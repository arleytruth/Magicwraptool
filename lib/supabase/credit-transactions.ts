import "server-only";

import { randomUUID } from "crypto";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type CreditTransactionRow =
    Database["public"]["Tables"]["credit_transactions"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface CreateCreditTransactionParams {
    userId: string;
    type: CreditTransactionRow["type"];
    referenceType: CreditTransactionRow["reference_type"];
    referenceId?: string | null;
    amount: number;
    metadata?: any;
}

export async function createCreditTransaction(
    params: CreateCreditTransactionParams,
): Promise<CreditTransactionRow> {
    const supabase = createSupabaseServiceRoleClient();

    // Get current user balance
    const { data: user } = await supabase
        .from("users")
        .select("credits")
        .eq("id", params.userId)
        .maybeSingle();

    if (!user) {
        throw new Error("User not found");
    }

    const currentBalance = user.credits;
    const newBalance = currentBalance + params.amount;

    // Prevent negative balance for consumption
    if (params.type === "consumption" && newBalance < 0) {
        throw new Error("Insufficient credits");
    }

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
        .from("credit_transactions")
        .insert({
            id: randomUUID(),
            user_id: params.userId,
            type: params.type,
            reference_type: params.referenceType,
            reference_id: params.referenceId ?? null,
            amount: params.amount,
            balance_after: newBalance,
            metadata: params.metadata ?? null,
            created_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle();

    if (txError || !transaction) {
        throw txError ?? new Error("Failed to create credit transaction");
    }

    // Update user balance
    const { error: updateError } = await supabase
        .from("users")
        .update({
            credits: newBalance,
            updated_at: new Date().toISOString(),
        })
        .eq("id", params.userId);

    if (updateError) {
        throw updateError;
    }

    return transaction as CreditTransactionRow;
}

export async function listCreditTransactions(
    userId: string,
): Promise<CreditTransactionRow[]> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return (data ?? []) as CreditTransactionRow[];
}

