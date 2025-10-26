import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { listUsers } from "@/lib/supabase/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await requireAdmin();

        const users = await listUsers();
        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error("[api/admin/users] GET error:", error);

        const status = (error as any)?.status ?? 500;
        const message =
            status === 401
                ? "Unauthorized"
                : status === 403
                    ? "Forbidden"
                    : "Kullanıcı listesi getirilemedi.";

        return NextResponse.json({ message }, { status });
    }
}

