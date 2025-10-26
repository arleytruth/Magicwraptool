import "server-only";

import Stripe from "stripe";

// Lazy-load Stripe client to avoid build-time errors
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
    if (stripeInstance) {
        return stripeInstance;
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
        throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }

    stripeInstance = new Stripe(secretKey, {
        apiVersion: "2025-09-30.clover",
    });

    return stripeInstance;
};

// Backward compatibility: export stripe for existing code
export const stripe = new Proxy({} as Stripe, {
    get(target, prop) {
        return getStripe()[prop as keyof Stripe];
    }
});
