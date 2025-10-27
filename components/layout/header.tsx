"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    SignInButton,
    SignUpButton,
    UserButton,
    useAuth as useClerkAuth,
    useClerk,
} from "@clerk/nextjs";
import { Sparkles, Wand2, Coins, Plus, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/magicwrap/ThemeToggle";
import { LanguageSwitcher } from "@/components/magicwrap/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

type NavLink = {
    title: string;
    href: string;
};

type HeaderProps = {
    navLinks?: NavLink[];
};

export function Header({ navLinks = [] }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { openSignUp } = useClerk();
    const { isSignedIn } = useClerkAuth();
    const { user, isAuthenticated, isEmailVerified } = useAuth();
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const navigate = useCallback(
        (href: string) => {
            setPendingAction(href);
            router.push(href);
            setPendingAction(null);
        },
        [router],
    );

    const navigateToSection = useCallback(
        (section: string) => {
            if (pathname === "/") {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                return;
            }

            router.push(`/#${section}`);
        },
        [pathname, router],
    );

    const navigateToPricing = useCallback(() => {
        navigateToSection("pricing");
    }, [navigateToSection]);

    const handlePrimaryAction = useCallback(() => {
        if (isSignedIn) {
            navigate("/generate");
            return;
        }

        openSignUp({
            redirectUrl: "/generate",
        });
    }, [isSignedIn, navigate, openSignUp]);

    const handleVideoAction = useCallback(() => {
        if (isSignedIn) {
            navigate("/generate");
            // Scroll to video section after navigation
            setTimeout(() => {
                const videoSection = document.getElementById("video-generation");
                if (videoSection) {
                    videoSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
            return;
        }

        openSignUp({
            redirectUrl: "/generate",
        });
    }, [isSignedIn, navigate, openSignUp]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                    aria-label="Anasayfa"
                >
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Magic Wrapper
                    </span>
                </button>

                <nav className="hidden items-center gap-6 lg:flex">
                    <button
                        type="button"
                        onClick={() => navigateToSection("features")}
                        className="text-sm font-medium text-foreground transition-transform duration-200 hover:scale-105 hover:text-primary"
                    >
                        Özellikler
                    </button>
                    <button
                        type="button"
                        onClick={() => navigateToSection("how-it-works")}
                        className="text-sm font-medium text-foreground transition-transform duration-200 hover:scale-105 hover:text-primary"
                    >
                        Nasıl Çalışır?
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/ornekler")}
                        className="text-sm font-medium text-foreground transition-transform duration-200 hover:scale-105 hover:text-primary"
                    >
                        Örnekleri Gör
                    </button>
                    <button
                        type="button"
                        onClick={() => navigateToSection("pricing")}
                        className="text-sm font-medium text-foreground transition-transform duration-200 hover:scale-105 hover:text-primary"
                    >
                        Fiyatlandırma
                    </button>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground transition-transform duration-200 hover:scale-105 hover:text-primary"
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-3" suppressHydrationWarning>
                    {isAuthenticated && isEmailVerified && user ? (
                        <>
                            {/* Credit Display and Actions */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <Badge 
                                    variant="secondary" 
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold"
                                >
                                    <Coins className="h-4 w-4 text-primary" />
                                    <span>{user.credits || 0}</span>
                                    <span className="text-xs text-muted-foreground">kredi</span>
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={navigateToPricing}
                                    className="h-9 gap-1.5 font-semibold hover:bg-primary/10"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden md:inline">Kredi Al</span>
                                </Button>
                            </div>

                            {/* Generate CTA Buttons */}
                            <Button
                                size="default"
                                onClick={() => navigate("/generate")}
                                className="h-10 gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={pendingAction === "/generate"}
                            >
                                <Wand2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Görsel Oluştur</span>
                                <span className="sm:hidden">Görsel</span>
                            </Button>

                            <Button
                                size="default"
                                onClick={handleVideoAction}
                                className="h-10 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-600/90 hover:to-pink-600/90 font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={pendingAction === "/generate"}
                            >
                                <Video className="h-4 w-4" />
                                <span className="hidden sm:inline">Video Oluştur</span>
                                <span className="sm:hidden">Video</span>
                            </Button>

                            <LanguageSwitcher />
                            <ThemeToggle />

                            <UserButton
                                userProfileUrl="/profile"
                                userProfileMode="navigation"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-9 w-9",
                                        notificationBadge: "hidden",
                                    },
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                size="lg"
                                onClick={handlePrimaryAction}
                                className="relative h-10 min-w-[140px] bg-primary font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
                                disabled={pendingAction === "/generate"}
                            >
                                <Wand2 className="mr-2 h-4 w-4" />
                                {pendingAction === "/generate" ? "Yükleniyor..." : "Hemen Başla"}
                            </Button>

                            <LanguageSwitcher />
                            <ThemeToggle />

                            {isSignedIn ? (
                                <UserButton
                                    userProfileUrl="/profile"
                                    userProfileMode="navigation"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "h-9 w-9",
                                            notificationBadge: "hidden",
                                        },
                                    }}
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <SignInButton 
                                        mode="modal"
                                        forceRedirectUrl="/generate"
                                        signUpForceRedirectUrl="/generate"
                                    >
                                        <Button variant="ghost" type="button">
                                            Giriş Yap
                                        </Button>
                                    </SignInButton>
                                    <SignUpButton
                                        mode="modal"
                                        forceRedirectUrl="/generate"
                                        signInForceRedirectUrl="/generate"
                                    >
                                        <Button type="button" className="hidden sm:inline-flex">
                                            Ücretsiz Başla
                                        </Button>
                                    </SignUpButton>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
