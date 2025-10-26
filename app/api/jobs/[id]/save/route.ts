import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { ensureUser } from "@/lib/supabase/users";

const bodySchema = z.object({
    saved: z.union([z.boolean(), z.string().transform((val) => val === "true")]),
});

export const runtime = "nodejs";

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
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
        const parsed = bodySchema.parse(json);
        const supabase = createSupabaseServiceRoleClient() as any;

        const updates = {
            saved: Boolean(parsed.saved),
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("jobs")
            .update(updates)
            .eq("id", params.id)
            .eq("user_id", supabaseUser.id)
            .select()
            .maybeSingle();

        if (error || !data) {
            throw error ?? new Error("Job güncellenemedi");
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[api/jobs/:id/save] error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Geçersiz istek", issues: error.issues },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { message: "İş kaydetme güncellenemedi." },
            { status: 500 },
        );
    }
}
