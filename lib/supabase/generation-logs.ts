import "server-only";

import { randomUUID } from "crypto";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type GenerationLogRow =
    Database["public"]["Tables"]["generation_logs"]["Row"];

interface CreateGenerationLogParams {
    jobId: string;
    userId: string;
    categoryId?: number | null;
    status?: GenerationLogRow["status"];
    creditsConsumed?: number;
    metadata?: Record<string, unknown> | null;
}

export async function createGenerationLog(
    params: CreateGenerationLogParams,
) {
    const supabase = createSupabaseServiceRoleClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("generation_logs")
        .insert({
            id: randomUUID(),
            job_id: params.jobId,
            user_id: params.userId,
            category_id: params.categoryId ?? null,
            status: params.status ?? "pending",
            credits_consumed: params.creditsConsumed ?? 0,
            metadata: params.metadata ?? null,
            created_at: now,
        })
        .select()
        .maybeSingle();

    if (error || !data) {
        throw error ?? new Error("Failed to create generation log");
    }

    return data as GenerationLogRow;
}

export async function updateGenerationLog(
    logId: string,
    updates: Partial<GenerationLogRow>,
) {
    const supabase = createSupabaseServiceRoleClient();
    const patch: Partial<GenerationLogRow> = {
        ...updates,
    };

    if (updates.status === "completed") {
        patch.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("generation_logs")
        .update(patch)
        .eq("id", logId)
        .select()
        .maybeSingle();

    if (error || !data) {
        throw error ?? new Error("Failed to update generation log");
    }

    return data as GenerationLogRow;
}

