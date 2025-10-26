import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { ensureUser } from "@/lib/supabase/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

        return NextResponse.json({
            success: true,
            user: supabaseUser,
        });
    } catch (error) {
        console.error("[api/users/me] GET error:", error);
        return NextResponse.json(
            { message: "Kullanıcı bilgisi alınamadı." },
            { status: 500 },
        );
    }
}
