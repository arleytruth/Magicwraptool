"use client";

import { useState } from "react";
import { Chrome, Loader2 } from "lucide-react";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function EmailAuthForm({
    onVerifiedLogin,
    initialMode = "signup",
}: {
    onVerifiedLogin?: () => void;
    initialMode?: "login" | "signup";
}) {
    const { toast } = useToast();
    const { openSignIn } = useClerk();
    const { signIn, isLoaded: isSignInLoaded } = useSignIn();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            if (!isSignInLoaded || !signIn) {
                await openSignIn({
                    redirectUrl: "/generate",
                });
                return;
            }

            toast({
                title: "Google ile devam ediyorsun",
                description:
                    "Google hesabınla giriş yapmak için yönlendiriliyorsun.",
            });

            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/generate",
                redirectUrlComplete: "/generate",
            });

            onVerifiedLogin?.();
        } catch (error) {
            console.error("Google sign-in error:", error);

            if (isClerkAPIResponseError(error)) {
                toast({
                    title: "Google ile giriş yapılamadı",
                    description:
                        error.errors?.[0]?.message ??
                        "Please try again later.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Google ile giriş yapılamadı",
                description: "Lütfen daha sonra tekrar dene.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full rounded-xl bg-black/90 text-white shadow-lg transition-all duration-200 ease-out hover:translate-y-[-1px] hover:shadow-xl active:translate-y-[1px] active:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/50"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Google ile bağlanılıyor...
                    </>
                ) : (
                    <>
                        <Chrome className="mr-2 h-5 w-5" />
                        Google ile devam et
                    </>
                )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
                Google hesabınla tek tıkla kayıt ol veya giriş yap.
            </p>
        </div>
    );
}
