import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { promptForCategory } from "@/lib/prompts";
import { generateWrapImage } from "@/lib/fal";
import { uploadBuffer } from "@/lib/cloudinary";
import {
    createGenerationLog,
    updateGenerationLog,
} from "@/lib/supabase/generation-logs";
import {
    createJob,
    listJobs,
    updateJobStatus,
} from "@/lib/supabase/jobs";
import { ensureUser, getUserByClerkId } from "@/lib/supabase/users";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { createCreditTransaction } from "@/lib/supabase/credit-transactions";
import { wrapCategories, type WrapCategory } from "@/types/wrap";

const jobSchema = z.object({
    objectImage: z.string().url(),
    materialImage: z.string().url(),
    category: z.enum(wrapCategories).default("vehicle"),
    objectImagePublicId: z.string().optional(),
    materialImagePublicId: z.string().optional(),
});

export const runtime = "nodejs";

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
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
                clerkUser?.primaryEmailAddress?.verification?.status ===
                "verified",
        });

        const jobs = await listJobs(supabaseUser.id);
        return NextResponse.json(jobs);
    } catch (error) {
        console.error("[api/jobs] GET error:", error);
        return NextResponse.json(
            { message: "İşler yüklenirken bir hata oluştu." },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
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
                clerkUser?.primaryEmailAddress?.verification?.status ===
                "verified",
        });

        const json = await request.json();
        const payload = jobSchema.parse(json);

        const supabase = createSupabaseServiceRoleClient() as any;
        const { data: categoryRow } = await supabase
            .from("generation_categories")
            .select("*")
            .eq("slug", payload.category)
            .maybeSingle();

        const creditsRequired = categoryRow?.credits_per_generation ?? 1;

        // Check if user has enough credits
        if (supabaseUser.credits < creditsRequired) {
            return NextResponse.json(
                {
                    message: "Yetersiz kredi. Lütfen kredi satın alın.",
                    required: creditsRequired,
                    available: supabaseUser.credits,
                },
                { status: 402 },
            );
        }

        const job = await createJob({
            userId: supabaseUser.id,
            category: payload.category as WrapCategory,
            categoryId: categoryRow?.id ?? null,
            objectImageUrl: payload.objectImage,
            objectImagePublicId: payload.objectImagePublicId ?? null,
            materialImageUrl: payload.materialImage,
            materialImagePublicId: payload.materialImagePublicId ?? null,
        });

        const generationLog = await createGenerationLog({
            jobId: job.id,
            userId: supabaseUser.id,
            categoryId: categoryRow?.id ?? null,
            status: "processing",
            creditsConsumed: categoryRow?.credits_per_generation ?? 1,
            metadata: {
                objectImageUrl: payload.objectImage,
                materialImageUrl: payload.materialImage,
            },
        });

        await updateJobStatus(job.id, "processing", {});

        try {
            const prompt =
                categoryRow?.prompt_template ??
                promptForCategory(payload.category as WrapCategory);

            console.log("[api/jobs] Fal.ai isteği gönderiliyor:", {
                category: payload.category,
                categoryId: categoryRow?.id,
                promptSource: categoryRow?.prompt_template
                    ? "database"
                    : "code",
                promptLength: prompt.length,
            });

            const falResult = await generateWrapImage({
                objectImageUrl: payload.objectImage,
                materialImageUrl: payload.materialImage,
                category: payload.category as WrapCategory,
                prompt,
            });

            console.log("[api/jobs] Fal.ai sonucu alındı:", {
                imageUrl: falResult.imageUrl,
                provider: falResult.provider,
            });

            const falResponse = await fetch(falResult.imageUrl);
            if (!falResponse.ok) {
                throw new Error("Fal.ai görseli indirilemedi");
            }

            const arrayBuffer = await falResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const upload = await uploadBuffer(buffer, {
                folder: `magicwrap/generated/${userId}`,
                filename: `job-${job.id}`,
            });

            const completedJob = await updateJobStatus(job.id, "completed", {
                result_image_url: upload.secure_url,
                result_image_public_id: upload.public_id,
                completed_at: new Date().toISOString(),
            });

            await updateGenerationLog(generationLog.id, {
                status: "completed",
                metadata: {
                    ...(typeof generationLog.metadata === "object" &&
                    generationLog.metadata !== null
                        ? generationLog.metadata
                        : {}),
                    falResultUrl: falResult.imageUrl,
                    resultImageUrl: upload.secure_url,
                    resultImagePublicId: upload.public_id,
                    provider: "cloudinary",
                },
            });

            // Deduct credits
            await createCreditTransaction({
                userId: supabaseUser.id,
                type: "consumption",
                referenceType: "generation",
                referenceId: job.id,
                amount: -creditsRequired,
                metadata: {
                    jobId: job.id,
                    generationLogId: generationLog.id,
                    category: payload.category,
                    creditsConsumed: creditsRequired,
                },
            });

            // Get updated user with new credit balance
            const updatedUser = await getUserByClerkId(userId);

            return NextResponse.json({
                ...completedJob,
                user_credits: updatedUser?.credits ?? 0,
            });
        } catch (jobError) {
            console.error("[api/jobs] processing error:", jobError);

            await updateJobStatus(job.id, "failed", {
                failed_at: new Date().toISOString(),
                error_message:
                    jobError instanceof Error
                        ? jobError.message
                        : "İşlem sırasında hata oluştu",
            });

            await updateGenerationLog(generationLog.id, {
                status: "failed",
                metadata: {
                    ...(typeof generationLog.metadata === "object" &&
                    generationLog.metadata !== null
                        ? generationLog.metadata
                        : {}),
                    error:
                        jobError instanceof Error
                            ? jobError.message
                            : "Bilinmeyen hata",
                },
            });

            return NextResponse.json(
                { message: "Görsel oluşturulamadı." },
                { status: 500 },
            );
        }
    } catch (error) {
        console.error("[api/jobs] POST error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Geçersiz istek", issues: error.issues },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { message: "İş oluşturulurken hata oluştu." },
            { status: 500 },
        );
    }
}
