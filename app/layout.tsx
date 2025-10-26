import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/app-providers";
import "@/styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Magic Wrapper - AI Powered Wrapping",
    description: "Transform your images with AI-powered wrapping technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
