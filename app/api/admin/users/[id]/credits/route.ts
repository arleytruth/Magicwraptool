import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { updateUserCredits } from "@/lib/supabase/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
    credits: z
        .number({
            invalid_type_error: "Kredi sayısı geçerli bir sayı olmalıdır.",
        })
        .min(0, "Kredi sayısı negatif olamaz."),
});

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        await requireAdmin();
        const body = await request.json();
        const parsed = bodySchema.parse(body);

        const updated = await updateUserCredits({
            userId: params.id,
            credits: parsed.credits,
        });

        return NextResponse.json({ success: true, user: updated });
    } catch (error) {
        console.error("[api/admin/users/:id/credits] PUT error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Geçersiz istek", issues: error.issues },
                { status: 400 },
            );
        }

        const status = (error as any)?.status ?? 500;
        const message =
            status === 401
                ? "Unauthorized"
                : status === 403
                    ? "Forbidden"
                    : "Kredi güncellenemedi.";

        return NextResponse.json({ message }, { status });
    }
}

