import "server-only";

import { fal } from "@fal-ai/client";

import { serverEnv } from "@/lib/env";

fal.config({
    credentials: serverEnv.FAL_API_KEY,
});

export interface GenerateWrapPayload {
    objectImageUrl: string;
    materialImageUrl: string;
    category: string;
    prompt: string;
}

export interface GenerateWrapResponse {
    imageUrl: string;
    seed: number;
    provider: "fal";
}

export async function generateWrapImage(
    payload: GenerateWrapPayload,
): Promise<GenerateWrapResponse> {
    try {
        console.log("[fal.ai] İstek gönderiliyor:", {
            model: "fal-ai/reve/remix",
            imageCount: 2,
            promptLength: payload.prompt.length,
            objectUrl: payload.objectImageUrl.substring(0, 50) + "...",
            materialUrl: payload.materialImageUrl.substring(0, 50) + "...",
        });

        const response = (await fal.subscribe("fal-ai/reve/remix", {
            input: {
                prompt: payload.prompt,
                image_urls: [payload.objectImageUrl, payload.materialImageUrl],
                output_format: "png",
            },
            logs: true,
        })) as any;

        console.log("[fal.ai] Response alındı, yapı kontrol ediliyor...");
        console.log("[fal.ai] Response keys:", Object.keys(response));
        console.log("[fal.ai] Response.data keys:", response.data ? Object.keys(response.data) : "data yok");
        
        // According to Fal.ai docs, response structure is: { data: { images: [...] }, requestId: "..." }
        const images = response.data?.images || response.images;
        
        if (!images || !Array.isArray(images) || images.length === 0) {
            console.error("[fal.ai] Görsel bulunamadı!");
            console.error("[fal.ai] Full response:", JSON.stringify(response, null, 2));
            throw new Error("Fal.ai görsel döndürmedi. Response yapısı beklenmedik.");
        }

        const imageUrl = images[0].url;
        
        if (!imageUrl || typeof imageUrl !== "string") {
            console.error("[fal.ai] Image URL geçersiz:", images[0]);
            throw new Error("Fal.ai geçersiz image URL döndürdü");
        }

        console.log("[fal.ai] ✅ Başarılı! Image URL:", imageUrl);
        console.log("[fal.ai] Request ID:", response.requestId);

        return {
            imageUrl,
            seed: 0,
            provider: "fal",
        };
    } catch (error) {
        console.error("[fal.ai] ❌ HATA:", error);
        
        // Enhanced error logging
        if (error && typeof error === "object") {
            console.error("[fal.ai] Error type:", (error as any).constructor?.name);
            console.error("[fal.ai] Error keys:", Object.keys(error));
            
            if ("body" in error) {
                console.error("[fal.ai] Error body:", JSON.stringify((error as any).body, null, 2));
            }
            if ("status" in error) {
                console.error("[fal.ai] HTTP status:", (error as any).status);
            }
        }

        const errorMessage =
            error && typeof error === "object" && "message" in error
                ? (error as any).message
                : "Fal.ai isteği başarısız";

        const detail =
            error && typeof error === "object" && "body" in error
                ? JSON.stringify((error as any).body)
                : "";

        throw new Error(
            `Görsel oluşturulamadı: ${errorMessage}${detail ? ` - ${detail}` : ""}`,
        );
    }
}
