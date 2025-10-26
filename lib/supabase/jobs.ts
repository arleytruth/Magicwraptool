import "server-only";

import { randomUUID } from "crypto";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { WrapCategory } from "@/types/wrap";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

interface CreateJobParams {
    userId: string;
    category: WrapCategory;
    categoryId?: number | null;
    objectImageUrl: string;
    objectImagePublicId?: string | null;
    materialImageUrl: string;
    materialImagePublicId?: string | null;
}

export async function createJob(params: CreateJobParams) {
    const supabase = createSupabaseServiceRoleClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("jobs")
        .insert({
            id: randomUUID(),
            user_id: params.userId,
            category: params.category,
            category_id: params.categoryId ?? null,
            status: "pending",
            object_image_url: params.objectImageUrl,
            object_image_public_id: params.objectImagePublicId ?? null,
            material_image_url: params.materialImageUrl,
            material_image_public_id: params.materialImagePublicId ?? null,
            created_at: now,
            updated_at: now,
        })
        .select()
        .maybeSingle();

    if (error || !data) {
        throw error ?? new Error("Failed to create job");
    }

    return data as JobRow;
}

export async function updateJobStatus(
    jobId: string,
    status: JobRow["status"],
    updates: Partial<JobRow>,
) {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("jobs")
        .update({
            status,
            updated_at: new Date().toISOString(),
            ...updates,
        })
        .eq("id", jobId)
        .select()
        .maybeSingle();

    if (error || !data) {
        throw error ?? new Error("Failed to update job");
    }

    return data as JobRow;
}

export async function listJobs(userId: string) {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return (data ?? []) as JobRow[];
}

export async function getJobById(jobId: string, userId: string) {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return (data ?? null) as JobRow | null;
}

