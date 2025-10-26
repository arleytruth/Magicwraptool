import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { serverEnv } from "@/lib/env";
import { ensureUser, updateUserStatus } from "@/lib/supabase/users";

export const runtime = "nodejs";

const webhookSecret = serverEnv.CLERK_WEBHOOK_SECRET;

interface ClerkWebhookEvent {
    type: string;
    data: any;
}

type ClerkEmailAddress = {
    id: string;
    email_address?: string | null;
    verification?: { status?: string | null } | null;
};

const allowedRoles = new Set(["user", "admin", "owner"]);

function extractPrimaryEmail(user: any) {
    const emailAddresses: ClerkEmailAddress[] = Array.isArray(
        user?.email_addresses,
    )
        ? (user.email_addresses as ClerkEmailAddress[])
        : [];
    const primaryId = user?.primary_email_address_id as string | null;

    const primaryEmail = primaryId
        ? emailAddresses.find((item: ClerkEmailAddress) => item.id === primaryId)
        : emailAddresses[0];

    const email = primaryEmail?.email_address ?? null;
    const emailVerified =
        primaryEmail?.verification?.status === "verified" ||
        emailAddresses.some(
            (item) =>
                item.id === primaryId &&
                item.verification?.status === "verified",
        );

    return { email, emailVerified };
}

function normalizeRole(value: unknown) {
    if (typeof value !== "string") {
        return null;
    }
    return allowedRoles.has(value) ? (value as "user" | "admin" | "owner") : null;
}

export async function POST(request: Request) {
    const body = await request.text();
    const headerList = await headers();

    const svixId = headerList.get("svix-id");
    const svixTimestamp = headerList.get("svix-timestamp");
    const svixSignature = headerList.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
            { message: "Svix imza başlıkları eksik" },
            { status: 400 },
        );
    }

    // Runtime check for webhook secret
    if (!webhookSecret) {
        console.error("[clerk webhook] CLERK_WEBHOOK_SECRET is missing");
        return NextResponse.json(
            { message: "Webhook configuration error" },
            { status: 500 },
        );
    }

    let event: ClerkWebhookEvent;
    try {
        const webhook = new Webhook(webhookSecret);
        event = webhook.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as ClerkWebhookEvent;
    } catch (error) {
        console.error("[clerk webhook] imza doğrulama hatası", error);
        return NextResponse.json(
            { message: "İmza doğrulanamadı" },
            { status: 400 },
        );
    }

    const { type, data } = event;

    try {
        if (type === "user.created" || type === "user.updated") {
            const { email, emailVerified } = extractPrimaryEmail(data);
            const username =
                data?.username ??
                data?.public_metadata?.username ??
                data?.private_metadata?.username ??
                null;
            const role =
                normalizeRole(data?.public_metadata?.role) ??
                normalizeRole(data?.private_metadata?.role) ??
                normalizeRole(data?.unsafe_metadata?.role);

            await ensureUser({
                clerkUserId: data.id,
                email,
                firstName: data?.first_name ?? null,
                lastName: data?.last_name ?? null,
                profileImageUrl: data?.image_url ?? null,
                emailVerified,
                username,
                role,
            });
        } else if (type === "user.deleted") {
            await updateUserStatus({
                clerkUserId: data.id,
                status: "deleted",
            });
        }
    } catch (error) {
        console.error(`[clerk webhook] ${type} işlenemedi`, error);
        return NextResponse.json(
            { message: "Webhook işlenemedi" },
            { status: 500 },
        );
    }

    return NextResponse.json({ success: true });
}
