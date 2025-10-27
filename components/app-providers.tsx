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
                baseTheme: undefined, // System theme kullan ama light mode zorla
                variables: {
                    colorPrimary: "hsl(250, 85%, 55%)", // Primary color
                    colorBackground: "#ffffff", // Light background
                    colorInputBackground: "#ffffff",
                    colorInputText: "#1a1a1a",
                    colorText: "#1a1a1a",
                    colorTextSecondary: "#666666",
                    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    borderRadius: "0.5rem",
                },
                elements: {
                    // Gizle: notification ve organization badges
                    organizationSwitcherTrigger: "hidden",
                    notificationBadge: "hidden",
                    badge: "hidden",
                    
                    // Gizle: "Secured by Clerk" footer
                    footer: "hidden",
                    footerAction: "hidden",
                    footerActionLink: "hidden",
                    footerActionText: "hidden",
                    
                    // Gizle: Development mode badge
                    __experimental_badge: "hidden",
                    
                    // Modal ve Card - Light mode
                    modalContent: "bg-white dark:bg-white",
                    modalBackdrop: "bg-black/50",
                    card: "bg-white shadow-2xl border border-gray-200",
                    cardBox: "bg-white",
                    
                    // Header
                    headerTitle: "text-gray-900 font-bold text-xl",
                    headerSubtitle: "text-gray-600",
                    
                    // Form elements - Light mode
                    formButtonPrimary: 
                        "bg-primary hover:bg-primary/90 text-white font-semibold",
                    formFieldInput: 
                        "bg-white border-gray-300 text-gray-900 focus:border-primary",
                    formFieldLabel: "text-gray-700 font-medium",
                    
                    // Links
                    identityPreviewEditButton: "text-primary hover:text-primary/80",
                    formFieldAction: "text-primary hover:text-primary/80",
                    
                    // Social buttons
                    socialButtonsBlockButton: 
                        "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
                    
                    // Divider
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500",
                },
                layout: {
                    showOptionalFields: false,
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "blockButton",
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
