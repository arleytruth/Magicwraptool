"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { SignOutButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Coins, Plus, Wand2, Video } from "lucide-react";

const DashboardNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const navItems = [
        { href: "/dashboard", label: "Genel Bakış" },
    ];

    if (user?.role === "admin" || user?.role === "owner") {
        navItems.push({ href: "/dashboard/admin/users", label: "Kullanıcılar" });
    }

    const handleBuyCredits = () => {
        router.push("/#pricing");
    };

    const handleVideoAction = () => {
        router.push("/generate");
        // Scroll to video section after navigation
        setTimeout(() => {
            const videoSection = document.getElementById("video-generation");
            if (videoSection) {
                videoSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <header className="border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-4 text-sm font-medium">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={
                                    "transition-colors" +
                                    (isActive
                                        ? " text-primary"
                                        : " text-muted-foreground hover:text-foreground")
                                }
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    {/* Credit Display and Actions */}
                    {user && (
                        <div className="flex items-center gap-2">
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
                                onClick={handleBuyCredits}
                                className="h-8 gap-1.5 font-semibold hover:bg-primary/10"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Kredi Al</span>
                            </Button>
                        </div>
                    )}

                    {/* Generate CTA Buttons */}
                    <Button
                        size="sm"
                        onClick={() => router.push("/generate")}
                        className="h-8 gap-1.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        <Wand2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Görsel Oluştur</span>
                        <span className="sm:hidden">Görsel</span>
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleVideoAction}
                        className="h-8 gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-600/90 hover:to-pink-600/90 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        <Video className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Video Oluştur</span>
                        <span className="sm:hidden">Video</span>
                    </Button>

                    <SignOutButton>
                        <Button variant="outline" size="sm">
                            Çıkış Yap
                        </Button>
                    </SignOutButton>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
