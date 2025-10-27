import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const PublicRoute = createRouteMatcher([
    "/",
    "/ornekler",          // Examples/showcase page
    "/api/credit-packages(.*)", // Pricing API public olmalı
    "/api/webhooks(.*)",        // Webhook endpoints (Stripe, vb.)
    "/support",            // Destek sayfası
    "/documentation",      // Dokümantasyon
    "/contact",           // İletişim
    "/terms-of-use",      // Kullanım Koşulları
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId && !PublicRoute(req)) {
        // Add custom logic to run before redirecting

        return redirectToSignIn();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
