import "server-only";

import { createSupabaseServiceRoleClient } from "./server";

export type VideoGenerationStatus = "pending" | "processing" | "completed" | "failed";

export interface VideoGeneration {
    id: string;
    user_id: string;
    job_id: string | null;
    source_image_url: string;
    source_image_public_id: string | null;
    prompt: string;
    aspect_ratio: string;
    resolution: string;
    duration: string;
    seed: number | null;
    video_url: string | null;
    video_public_id: string | null;
    fal_request_id: string | null;
    status: VideoGenerationStatus;
    credits_consumed: number;
    error_message: string | null;
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
    failed_at: string | null;
    metadata: Record<string, any>;
}

export interface CreateVideoGenerationParams {
    userId: string;
    jobId?: string | null;
    sourceImageUrl: string;
    sourceImagePublicId?: string | null;
    prompt: string;
    aspectRatio?: string;
    resolution?: string;
    duration?: string;
    seed?: number | null;
    creditsConsumed?: number;
}

export interface UpdateVideoGenerationParams {
    videoUrl?: string;
    videoPublicId?: string;
    falRequestId?: string;
    status?: VideoGenerationStatus;
    seed?: number;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
    failedAt?: string;
    metadata?: Record<string, any>;
}

/**
 * Create a new video generation record
 */
export async function createVideoGeneration(
    params: CreateVideoGenerationParams,
): Promise<VideoGeneration> {
    const supabase = createSupabaseServiceRoleClient();

    const { data, error } = await supabase
        .from("video_generations")
        .insert({
            user_id: params.userId,
            job_id: params.jobId || null,
            source_image_url: params.sourceImageUrl,
            source_image_public_id: params.sourceImagePublicId || null,
            prompt: params.prompt,
            aspect_ratio: params.aspectRatio || "auto",
            resolution: params.resolution || "1080p",
            duration: params.duration || "5",
            seed: params.seed || null,
            credits_consumed: params.creditsConsumed || 6,
            status: "pending",
        })
        .select()
        .single();

    if (error) {
        console.error("[video-generations] Create error:", error);
        throw new Error(`Video generation kaydı oluşturulamadı: ${error.message}`);
    }

    return data as VideoGeneration;
}

/**
 * Update video generation record
 */
export async function updateVideoGeneration(
    id: string,
    params: UpdateVideoGenerationParams,
): Promise<VideoGeneration> {
    const supabase = createSupabaseServiceRoleClient();

    const updateData: any = {};

    if (params.videoUrl !== undefined) updateData.video_url = params.videoUrl;
    if (params.videoPublicId !== undefined)
        updateData.video_public_id = params.videoPublicId;
    if (params.falRequestId !== undefined)
        updateData.fal_request_id = params.falRequestId;
    if (params.status !== undefined) updateData.status = params.status;
    if (params.seed !== undefined) updateData.seed = params.seed;
    if (params.errorMessage !== undefined)
        updateData.error_message = params.errorMessage;
    if (params.startedAt !== undefined) updateData.started_at = params.startedAt;
    if (params.completedAt !== undefined)
        updateData.completed_at = params.completedAt;
    if (params.failedAt !== undefined) updateData.failed_at = params.failedAt;
    if (params.metadata !== undefined) updateData.metadata = params.metadata;

    const { data, error } = await supabase
        .from("video_generations")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("[video-generations] Update error:", error);
        throw new Error(`Video generation güncellenemedi: ${error.message}`);
    }

    return data as VideoGeneration;
}

/**
 * Get video generation by ID
 */
export async function getVideoGeneration(
    id: string,
): Promise<VideoGeneration | null> {
    const supabase = createSupabaseServiceRoleClient();

    const { data, error } = await supabase
        .from("video_generations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null; // Not found
        }
        console.error("[video-generations] Get error:", error);
        throw new Error(`Video generation alınamadı: ${error.message}`);
    }

    return data as VideoGeneration;
}

/**
 * List video generations for a user
 */
export async function listVideoGenerations(
    userId: string,
    limit = 50,
): Promise<VideoGeneration[]> {
    const supabase = createSupabaseServiceRoleClient();

    const { data, error } = await supabase
        .from("video_generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("[video-generations] List error:", error);
        throw new Error(`Video generations listelenemedi: ${error.message}`);
    }

    return (data as VideoGeneration[]) || [];
}

/**
 * Delete video generation
 */
export async function deleteVideoGeneration(id: string): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();

    const { error } = await supabase
        .from("video_generations")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("[video-generations] Delete error:", error);
        throw new Error(`Video generation silinemedi: ${error.message}`);
    }
}

