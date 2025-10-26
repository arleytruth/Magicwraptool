import "server-only";

import { randomUUID } from "crypto";
import { auth } from "@clerk/nextjs/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

async function createInitialCreditTransaction(
    userId: string,
    credits: number,
) {
    const supabase = createSupabaseServiceRoleClient();
    const now = new Date().toISOString();

    try {
        await supabase.from("credit_transactions").insert({
            id: randomUUID(),
            user_id: userId,
            type: "manual_adjustment",
            reference_type: "system",
            reference_id: null,
            amount: credits,
            balance_after: credits,
            metadata: {
                reason: "Hoş geldin bonusu",
                note: "İlk kayıt veya email doğrulama bonusu",
            },
            created_at: now,
        });
    } catch (error) {
        console.error("[createInitialCreditTransaction] Hata:", error);
    }
}

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface EnsureUserParams {
    clerkUserId: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
    emailVerified?: boolean;
    username?: string | null;
    role?: UserRow["role"] | null;
}

export async function getUserByClerkId(
    clerkUserId: string,
): Promise<UserRow | null> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data ?? null;
}

export async function ensureUser(params: EnsureUserParams): Promise<UserRow> {
    const supabase = createSupabaseServiceRoleClient();
    const existing = await getUserByClerkId(params.clerkUserId);
    const now = new Date().toISOString();

    if (existing) {
        // İlk kez email verify olan ve 0 kredisi olan kullanıcılara 3 kredi ver
        const shouldGrantInitialCredits =
            params.emailVerified &&
            !existing.email_verified &&
            existing.credits === 0;

        const { data, error } = await supabase
            .from("users")
            .update({
                email: params.email ?? existing.email,
                first_name: params.firstName ?? existing.first_name,
                last_name: params.lastName ?? existing.last_name,
                profile_image_url:
                    params.profileImageUrl ?? existing.profile_image_url,
                username: params.username ?? existing.username,
                email_verified: params.emailVerified ?? existing.email_verified,
                email_verified_at:
                    params.emailVerified && !existing.email_verified_at
                        ? now
                        : existing.email_verified_at,
                role: params.role ?? existing.role,
                credits: shouldGrantInitialCredits ? 3 : existing.credits,
                updated_at: now,
                last_login_at: now,
            })
            .eq("id", existing.id)
            .select()
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (shouldGrantInitialCredits && data) {
            console.log(
                `[ensureUser] İlk email verify: ${params.clerkUserId} → 3 kredi verildi`,
            );
            // İlk kredi transaction'ını kaydet
            await createInitialCreditTransaction(data.id, 3);
        }

        return (data ?? existing) as UserRow;
    }

    const newUserId = randomUUID();
    const { data, error } = await supabase
        .from("users")
        .insert({
            id: newUserId,
            clerk_user_id: params.clerkUserId,
            credits: 3,
            email: params.email ?? null,
            first_name: params.firstName ?? null,
            last_name: params.lastName ?? null,
            profile_image_url: params.profileImageUrl ?? null,
            username: params.username ?? null,
            role: params.role ?? "user",
            email_verified: params.emailVerified ?? false,
            email_verified_at: params.emailVerified ? now : null,
            last_login_at: now,
        })
        .select()
        .maybeSingle();

    if (error || !data) {
        throw error ?? new Error("Failed to create Supabase user");
    }

    console.log(`[ensureUser] Yeni kullanıcı: ${params.clerkUserId} → 3 kredi verildi`);
    
    // İlk kredi transaction'ını kaydet
    await createInitialCreditTransaction(newUserId, 3);

    return data;
}

export async function requireAuthUser() {
    const { userId } = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await getUserByClerkId(userId);
    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function listUsers() {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data as UserRow[];
}

export async function updateUserCredits(params: {
    userId: string;
    credits: number;
}) {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("users")
        .update({
            credits: params.credits,
            updated_at: new Date().toISOString(),
        })
        .eq("id", params.userId)
        .select()
        .maybeSingle();

    if (error || !data) {
        throw error ?? new Error("Failed to update user credits");
    }

    return data as UserRow;
}

export async function updateUserStatus(params: {
    clerkUserId: string;
    status: UserRow["status"];
}) {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
        .from("users")
        .update({
            status: params.status,
            updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", params.clerkUserId);

    if (error) {
        throw error;
    }
}
