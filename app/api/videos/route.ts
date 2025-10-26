import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { generateVideoFromImage } from "@/lib/fal-video";
import { uploadBuffer } from "@/lib/cloudinary";
import {
    createVideoGeneration,
    updateVideoGeneration,
    listVideoGenerations,
} from "@/lib/supabase/video-generations";
import { ensureUser } from "@/lib/supabase/users";
import { createCreditTransaction } from "@/lib/supabase/credit-transactions";

const videoSchema = z.object({
    sourceImageUrl: z.string().url(),
    sourceImagePublicId: z.string().optional(),
    prompt: z.string().optional(), // Optional - will use default from database
    jobId: z.string().uuid().optional(),
    aspectRatio: z
        .enum(["21:9", "16:9", "4:3", "1:1", "3:4", "9:16", "auto"])
        .optional(),
    resolution: z.enum(["480p", "720p", "1080p"]).optional(),
    seed: z.number().int().optional(),
    // duration is removed from schema - always fixed at 5 seconds
});

// Default video prompt - can be moved to Supabase settings table later
const DEFAULT_VIDEO_PROMPT = "A slow cinematic camera movement showcasing the wrapped surface with realistic lighting, smooth reflections, and professional presentation. The camera gently pans to reveal the entire design with depth and dimension.";

// Fixed duration - always 5 seconds for cost optimization
const FIXED_DURATION = "5" as const;

export const runtime = "nodejs";

// GET - List user's video generations
export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const clerkUser = await currentUser();
        const supabaseUser = await ensureUser({
            clerkUserId: userId,
            email:
                clerkUser?.primaryEmailAddress?.emailAddress ??
                clerkUser?.emailAddresses?.[0]?.emailAddress ??
                null,
            firstName: clerkUser?.firstName ?? null,
            lastName: clerkUser?.lastName ?? null,
            profileImageUrl: clerkUser?.imageUrl ?? null,
            username: clerkUser?.username ?? null,
            emailVerified:
                clerkUser?.primaryEmailAddress?.verification?.status === "verified",
        });

        const videos = await listVideoGenerations(supabaseUser.id);
        return NextResponse.json(videos);
    } catch (error) {
        console.error("[api/videos] GET error:", error);
        return NextResponse.json(
            { message: "Videolar yüklenirken bir hata oluştu." },
            { status: 500 },
        );
    }
}

// POST - Generate video from image
export async function POST(request: Request) {
    console.log("[api/videos] POST request received");
    
    try {
        const { userId } = auth();
        console.log("[api/videos] User ID:", userId);
        
        if (!userId) {
            console.error("[api/videos] No user ID found");
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const clerkUser = await currentUser();
        const supabaseUser = await ensureUser({
            clerkUserId: userId,
            email:
                clerkUser?.primaryEmailAddress?.emailAddress ??
                clerkUser?.emailAddresses?.[0]?.emailAddress ??
                null,
            firstName: clerkUser?.firstName ?? null,
            lastName: clerkUser?.lastName ?? null,
            profileImageUrl: clerkUser?.imageUrl ?? null,
            username: clerkUser?.username ?? null,
            emailVerified:
                clerkUser?.primaryEmailAddress?.verification?.status === "verified",
        });

        const json = await request.json();
        console.log("[api/videos] Request body:", JSON.stringify(json, null, 2));
        
        const payload = videoSchema.parse(json);
        console.log("[api/videos] Parsed payload:", JSON.stringify(payload, null, 2));

        // Always use default prompt (Fal.ai requires prompt to be present)
        const videoPrompt = DEFAULT_VIDEO_PROMPT;
        console.log("[api/videos] Using prompt:", videoPrompt.substring(0, 50) + "...");

        const creditsRequired = 6; // Video generation costs 6 credits

        // Check if user has enough credits
        if (supabaseUser.credits < creditsRequired) {
            return NextResponse.json(
                {
                    message: "Yetersiz kredi. Video oluşturmak için 6 kredi gerekli.",
                    required: creditsRequired,
                    available: supabaseUser.credits,
                },
                { status: 402 },
            );
        }

        // Create video generation record
        const videoGeneration = await createVideoGeneration({
            userId: supabaseUser.id,
            jobId: payload.jobId || null,
            sourceImageUrl: payload.sourceImageUrl,
            sourceImagePublicId: payload.sourceImagePublicId || null,
            prompt: videoPrompt,
            aspectRatio: payload.aspectRatio || "auto",
            resolution: payload.resolution || "1080p",
            duration: FIXED_DURATION, // Always 5 seconds
            seed: payload.seed,
            creditsConsumed: creditsRequired,
        });

        // Update status to processing
        await updateVideoGeneration(videoGeneration.id, {
            status: "processing",
            startedAt: new Date().toISOString(),
        });

        try {
            console.log("[api/videos] Fal.ai video isteği gönderiliyor:", {
                videoId: videoGeneration.id,
                sourceImage: payload.sourceImageUrl.substring(0, 50) + "...",
                promptLength: videoPrompt.length,
                duration: FIXED_DURATION,
            });

            // Generate video using Fal.ai
            const falResult = await generateVideoFromImage({
                imageUrl: payload.sourceImageUrl,
                prompt: videoPrompt,
                aspectRatio: payload.aspectRatio || "auto",
                resolution: payload.resolution || "1080p",
                duration: FIXED_DURATION, // Always 5 seconds
                seed: payload.seed,
            });

            console.log("[api/videos] Fal.ai video sonucu alındı:", {
                videoUrl: falResult.videoUrl,
                seed: falResult.seed,
                requestId: falResult.requestId,
            });

            // Download video from Fal.ai
            const videoResponse = await fetch(falResult.videoUrl);
            if (!videoResponse.ok) {
                throw new Error("Fal.ai videosu indirilemedi");
            }

            const contentType = videoResponse.headers.get("content-type");
            console.log("[api/videos] Video content-type:", contentType);

            const arrayBuffer = await videoResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Verify it's a video file (should be video/mp4)
            if (contentType && !contentType.includes("video")) {
                console.warn("[api/videos] Warning: Expected video/mp4, got:", contentType);
            }

            // Upload to Cloudinary
            console.log("[api/videos] Uploading video to Cloudinary...", {
                bufferSize: buffer.length,
                contentType,
            });
            
            let upload;
            try {
                upload = await uploadBuffer(buffer, {
                    folder: `magicwrap/videos/${userId}`,
                    filename: `video-${videoGeneration.id}`,
                    resourceType: "video", // Use 'video' for video files
                });
                console.log("[api/videos] Video uploaded successfully to Cloudinary:", {
                    url: upload.secure_url,
                    publicId: upload.public_id,
                    format: upload.format,
                    resourceType: upload.resource_type,
                });
            } catch (uploadError) {
                console.error("[api/videos] Cloudinary upload failed:", uploadError);
                throw new Error(
                    `Cloudinary yükleme hatası: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`
                );
            }

            // Update video generation with result
            const completedVideo = await updateVideoGeneration(videoGeneration.id, {
                videoUrl: upload.secure_url,
                videoPublicId: upload.public_id,
                falRequestId: falResult.requestId,
                seed: falResult.seed,
                status: "completed",
                completedAt: new Date().toISOString(),
            });

            console.log("[api/videos] Video generation completed:", {
                id: completedVideo.id,
                hasVideoUrl: !!completedVideo.video_url,
                videoUrl: completedVideo.video_url,
                status: completedVideo.status,
            });

            // Deduct credits
            await createCreditTransaction({
                userId: supabaseUser.id,
                type: "consumption",
                referenceType: "generation", // Use existing type
                referenceId: videoGeneration.id,
                amount: -creditsRequired,
                metadata: {
                    videoGenerationId: videoGeneration.id,
                    generationType: "video",
                    prompt: videoPrompt,
                    resolution: payload.resolution || "1080p",
                    duration: FIXED_DURATION,
                    creditsConsumed: creditsRequired,
                },
            });

            console.log("[api/videos] Returning video data to client");
            return NextResponse.json(completedVideo);
        } catch (videoError) {
            console.error("[api/videos] processing error:", videoError);
            console.error("[api/videos] Error stack:", videoError instanceof Error ? videoError.stack : "No stack");
            
            const errorMessage = videoError instanceof Error ? videoError.message : "Video işleme sırasında hata oluştu";

            await updateVideoGeneration(videoGeneration.id, {
                status: "failed",
                failedAt: new Date().toISOString(),
                errorMessage,
            });

            return NextResponse.json(
                { 
                    message: errorMessage,
                    error: errorMessage,
                    details: videoError instanceof Error ? videoError.message : String(videoError),
                },
                { status: 500 },
            );
        }
    } catch (error) {
        console.error("[api/videos] POST error:", error);
        console.error("[api/videos] Error stack:", error instanceof Error ? error.stack : "No stack");
        console.error("[api/videos] Error name:", error instanceof Error ? error.name : typeof error);
        console.error("[api/videos] Error message:", error instanceof Error ? error.message : String(error));

        if (error instanceof z.ZodError) {
            console.error("[api/videos] Zod validation error:", JSON.stringify(error.issues, null, 2));
            return NextResponse.json(
                { 
                    message: "Geçersiz istek", 
                    issues: error.issues,
                    error: error.message 
                },
                { status: 400 },
            );
        }

        const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
        
        return NextResponse.json(
            { 
                message: "Video isteği oluşturulurken hata oluştu.",
                error: errorMessage,
                details: String(error)
            },
            { status: 500 },
        );
    }
}

