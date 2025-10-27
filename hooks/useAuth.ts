"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

export interface AppUser {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    credits: number;
    role: string | null;
    username: string | null;
}

export function useAuth() {
    const { isLoaded: authLoaded, isSignedIn, getToken } = useClerkAuth();
    const {
        isLoaded: userLoaded,
        user,
        isSignedIn: userSignedIn,
    } = useUser();

    const [supabaseCredits, setSupabaseCredits] = useState<number | null>(null);
    const [isFetchingCredits, setIsFetchingCredits] = useState(false);

    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    const emailVerified =
        user?.primaryEmailAddress?.verification?.status === "verified";

    const fallbackCredits = useMemo(() => {
        if (!user) {
            return 0;
        }

        if (typeof user.publicMetadata?.credits === "number") {
            return user.publicMetadata.credits as number;
        }

        if (typeof user.unsafeMetadata?.credits === "number") {
            return user.unsafeMetadata.credits as number;
        }

        return 0;
    }, [user]);

    const role = useMemo(() => {
        if (!user) {
            return null;
        }
        const fromPublic = user.publicMetadata?.role;
        const fromUnsafe = user.unsafeMetadata?.role;
        return (fromPublic ?? fromUnsafe ?? null) as string | null;
    }, [user]);

    const fallbackUsername = useMemo(() => {
        if (!user) {
            return null;
        }
        const fromPublic = user.publicMetadata?.username;
        const fromUnsafe = user.unsafeMetadata?.username;
        return (user.username ?? fromPublic ?? fromUnsafe ?? null) as string | null;
    }, [user]);

    const mappedUser: AppUser | null = user
        ? {
              id: user.id,
              email:
                  primaryEmail ??
                  user.emailAddresses[0]?.emailAddress ??
                  user.emailAddresses[0]?.emailAddress ??
                  null,
              firstName: user.firstName ?? null,
              lastName: user.lastName ?? null,
              profileImageUrl: user.imageUrl ?? null,
              credits: supabaseCredits ?? fallbackCredits,
              role,
              username: fallbackUsername,
          }
        : null;

    const loadCredits = useMemo(() => {
        return async (retryCount = 0) => {
            if (!user || !userLoaded || !authLoaded) {
                return;
            }

            try {
                setIsFetchingCredits(true);
                const response = await fetch("/api/users/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                    },
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`Failed to load user credits: ${response.status}`);
                }

                const data = (await response.json()) as {
                    success: boolean;
                    user?: { credits?: number | null; username?: string | null };
                };

                if (data?.success && typeof data.user?.credits === "number") {
                    console.log("[useAuth] ✅ Credits loaded:", data.user.credits);
                    setSupabaseCredits(data.user.credits);
                } else if (retryCount < 2) {
                    // Retry up to 2 times
                    console.warn("[useAuth] Invalid data, retrying...", retryCount + 1);
                    setTimeout(() => loadCredits(retryCount + 1), 1000);
                } else {
                    console.warn("[useAuth] Using fallback credits after retries");
                    setSupabaseCredits(fallbackCredits);
                }
            } catch (error) {
                console.error("[useAuth] ❌ Failed to fetch Supabase credits", error);
                
                if (retryCount < 2) {
                    // Retry up to 2 times
                    console.warn("[useAuth] Error, retrying...", retryCount + 1);
                    setTimeout(() => loadCredits(retryCount + 1), 1000);
                } else {
                    console.warn("[useAuth] Using fallback credits after errors");
                    setSupabaseCredits(fallbackCredits);
                }
            } finally {
                if (retryCount === 0) {
                    setIsFetchingCredits(false);
                }
            }
        };
    }, [user, userLoaded, authLoaded, fallbackCredits]);

    useEffect(() => {
        if (!user || !userLoaded || !authLoaded) {
            setSupabaseCredits(null);
            return;
        }

        let isMounted = true;
        let intervalId: NodeJS.Timeout;

        const init = async () => {
            if (isMounted) {
                await loadCredits(0);
                
                // Kredileri her 30 saniyede bir otomatik güncelle
                intervalId = setInterval(async () => {
                    if (isMounted) {
                        await loadCredits(0);
                    }
                }, 30000); // 30 saniye
            }
        };

        void init();

        return () => {
            isMounted = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [user, userLoaded, authLoaded, loadCredits]);

    const isAuthenticated = (isSignedIn ?? false) || (userSignedIn ?? false);

    return {
        user: mappedUser,
        isAuthenticated,
        isEmailVerified: emailVerified ?? false,
        needsVerification: isAuthenticated && !(emailVerified ?? false),
        isLoading: !authLoaded || !userLoaded || isFetchingCredits,
        firebaseUser: null,
        token: null,
        async refreshUser() {
            await user?.reload?.();
            await loadCredits(0);
        },
        async getAuthToken() {
            return await getToken();
        },
    };
}
