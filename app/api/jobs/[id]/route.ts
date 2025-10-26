import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getJobById } from "@/lib/supabase/jobs";
import { ensureUser } from "@/lib/supabase/users";

export const runtime = "nodejs";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
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

        const { id } = await params;
        const job = await getJobById(id, supabaseUser.id);
        if (!job) {
            return NextResponse.json(
                { message: "Job not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error("[api/jobs/:id] GET error:", error);
        return NextResponse.json(
            { message: "İş bilgisi alınırken hata oluştu." },
            { status: 500 },
        );
    }
}
