import "server-only";

import { fal } from "@fal-ai/client";
import { serverEnv } from "@/lib/env";

fal.config({
    credentials: serverEnv.FAL_API_KEY,
});

export interface GenerateVideoPayload {
    imageUrl: string;
    prompt: string;
    aspectRatio?: "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16" | "auto";
    resolution?: "480p" | "720p" | "1080p";
    duration?: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
    seed?: number;
}

export interface GenerateVideoResponse {
    videoUrl: string;
    seed: number;
    requestId: string;
}

/**
 * Generate video from image using Fal.ai Bytedance Seedance Image-to-Video
 * Reference: https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/fast/image-to-video/api
 */
export async function generateVideoFromImage(
    payload: GenerateVideoPayload,
): Promise<GenerateVideoResponse> {
    // Validate required fields
    if (!payload.imageUrl || !payload.prompt) {
        throw new Error("imageUrl and prompt are required for video generation");
    }

    try {
        console.log("[fal.ai video] İstek gönderiliyor:", {
            model: "fal-ai/bytedance/seedance/v1/pro/fast/image-to-video",
            imageUrl: payload.imageUrl.substring(0, 50) + "...",
            promptLength: payload.prompt.length,
            resolution: payload.resolution || "1080p",
            duration: payload.duration || "5",
        });

        const result = (await fal.subscribe(
            "fal-ai/bytedance/seedance/v1/pro/fast/image-to-video",
            {
                input: {
                    image_url: payload.imageUrl,
                    prompt: payload.prompt,
                    aspect_ratio: payload.aspectRatio || "auto",
                    resolution: payload.resolution || "1080p",
                    duration: payload.duration || "5",
                    enable_safety_checker: true,
                    ...(payload.seed !== undefined && payload.seed >= 0
                        ? { seed: payload.seed }
                        : {}),
                },
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === "IN_PROGRESS") {
                        update.logs
                            ?.map((log) => log.message)
                            .forEach((msg) =>
                                console.log("[fal.ai video] Progress:", msg),
                            );
                    }
                },
            },
        )) as any;

        console.log("[fal.ai video] Response alındı, yapı kontrol ediliyor...");
        console.log("[fal.ai video] Response keys:", Object.keys(result));

        // Extract video data
        const videoData = result.data?.video || result.video;
        const seed = result.data?.seed || result.seed || 0;
        const requestId = result.requestId || "";

        if (!videoData || !videoData.url) {
            console.error("[fal.ai video] Video bulunamadı!");
            console.error(
                "[fal.ai video] Full response:",
                JSON.stringify(result, null, 2),
            );
            throw new Error(
                "Fal.ai video döndürmedi. Response yapısı beklenmedik.",
            );
        }

        const videoUrl = videoData.url;

        if (!videoUrl || typeof videoUrl !== "string") {
            console.error("[fal.ai video] Video URL geçersiz:", videoData);
            throw new Error("Fal.ai geçersiz video URL döndürdü");
        }

        console.log("[fal.ai video] ✅ Başarılı! Video URL:", videoUrl);
        console.log("[fal.ai video] Request ID:", requestId);
        console.log("[fal.ai video] Seed:", seed);

        return {
            videoUrl,
            seed,
            requestId,
        };
    } catch (error) {
        console.error("[fal.ai video] ❌ HATA:", error);

        // Enhanced error logging
        if (error && typeof error === "object") {
            console.error(
                "[fal.ai video] Error type:",
                (error as any).constructor?.name,
            );
            console.error(
                "[fal.ai video] Error keys:",
                Object.keys(error),
            );

            if ("body" in error) {
                console.error(
                    "[fal.ai video] Error body:",
                    JSON.stringify((error as any).body, null, 2),
                );
            }
            if ("status" in error) {
                console.error(
                    "[fal.ai video] HTTP status:",
                    (error as any).status,
                );
            }
        }

        const errorMessage =
            error && typeof error === "object" && "message" in error
                ? (error as any).message
                : "Fal.ai video isteği başarısız";

        const detail =
            error && typeof error === "object" && "body" in error
                ? JSON.stringify((error as any).body)
                : "";

        throw new Error(
            `Video oluşturulamadı: ${errorMessage}${detail ? ` - ${detail}` : ""}`,
        );
    }
}

