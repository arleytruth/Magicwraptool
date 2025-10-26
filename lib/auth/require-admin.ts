import { auth, currentUser } from "@clerk/nextjs/server";

const ADMIN_ROLES = ["admin", "owner"];

export async function requireAdmin() {
    const { userId } = auth();
    if (!userId) {
        const error = new Error("Unauthorized");
        (error as any).status = 401;
        throw error;
    }

    const clerkUser = await currentUser();
    const role =
        (clerkUser?.publicMetadata?.role as string | undefined) ??
        (clerkUser?.unsafeMetadata?.role as string | undefined) ??
        null;

    if (!role || !ADMIN_ROLES.includes(role)) {
        const error = new Error("Forbidden");
        (error as any).status = 403;
        throw error;
    }

    return { userId, clerkUser, role };
}

