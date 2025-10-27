"use client";

import { PropsWithChildren, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import "@/lib/i18n/client";

import { browserEnv } from "@/lib/env.browser";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { Toaster } from "@/components/ui/toaster";

const convexClient = new ConvexReactClient(browserEnv.NEXT_PUBLIC_CONVEX_URL);

export function AppProviders({ children }: PropsWithChildren) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ClerkProvider 
            publishableKey={browserEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            appearance={{
                elements: {
                    // Gizle: notification ve organization badges
                    organizationSwitcherTrigger: "hidden",
                    notificationBadge: "hidden",
                    badge: "hidden",
                    
                    // Gizle: "Secured by Clerk" footer
                    footer: "hidden",
                    footerActionLink: "hidden",
                    
                    // Gizle: Development mode badge
                    __experimental_badge: "hidden",
                    
                    // Özelleştir: Modal ve card arka planları
                    modalContent: "bg-background",
                    cardBox: "bg-card",
                    card: "bg-card shadow-xl border border-border",
                    
                    // Özelleştir: Input ve button stilleri
                    formButtonPrimary: 
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                    formFieldInput: 
                        "bg-background border-input focus:border-primary",
                    identityPreviewEditButton: "text-primary hover:text-primary/80",
                },
                layout: {
                    // Footer'ı tamamen kaldır
                    showOptionalFields: false,
                },
            }}
        >
            <ConvexProviderWithClerk client={convexClient} useAuth={useClerkAuth}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryClientProvider client={queryClient}>
                        <AuthModalProvider>
                            {children}
                            <Toaster />
                        </AuthModalProvider>
                    </QueryClientProvider>
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
