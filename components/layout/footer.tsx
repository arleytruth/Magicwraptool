"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

type NavLink = {
    title: string;
    href: string;
};

type FooterProps = {
    navLinks?: NavLink[];
};

export function Footer({ navLinks = [] }: FooterProps) {
    const router = useRouter();
    const pathname = usePathname();

    const navigateToSection = (section: string) => {
        if (pathname === "/") {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
        }

        router.push(`/#${section}`);
    };

    return (
        <footer className="bg-muted/30 border-t py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-foreground">Magic Wrapper</span>
                        </div>
                        <p className="max-w-md text-sm text-muted-foreground">
                            Combine two images in seconds with AI. Apply any wrap to any surface
                            without prompts or complicated settings.
                        </p>
                    </div>

                    <div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => navigateToSection("features")}
                                    className="transition-transform duration-200 text-left hover:scale-105 hover:text-foreground"
                                >
                                    Features
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => navigateToSection("how-it-works")}
                                    className="transition-transform duration-200 text-left hover:scale-105 hover:text-foreground"
                                >
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => navigateToSection("pricing")}
                                    className="transition-transform duration-200 text-left hover:scale-105 hover:text-foreground"
                                >
                                    Pricing
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/support"
                                    className="transition-transform duration-200 hover:scale-105 hover:text-foreground"
                                >
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-of-use"
                                    className="transition-transform duration-200 hover:scale-105 hover:text-foreground"
                                >
                                    Terms of Use
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} Magic Wrapper. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
