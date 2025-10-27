import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { ensureUser } from "@/lib/supabase/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) {
            console.log("[api/users/me] No userId from Clerk auth");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        console.log("[api/users/me] ✅ Clerk userId:", userId);

        const clerkUser = await currentUser();
        console.log("[api/users/me] ✅ Clerk user loaded:", {
            email: clerkUser?.primaryEmailAddress?.emailAddress,
            hasUser: !!clerkUser,
        });

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

        console.log("[api/users/me] ✅ Supabase user:", {
            id: supabaseUser.id,
            email: supabaseUser.email,
            credits: supabaseUser.credits,
        });

        return NextResponse.json({
            success: true,
            user: supabaseUser,
        });
    } catch (error) {
        console.error("[api/users/me] ❌ GET error:", error);
        console.error("[api/users/me] ❌ Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { 
                message: "Failed to load user information",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
