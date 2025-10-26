import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        
        if (!userId) {
            return NextResponse.json(
                { error: "Lütfen giriş yapın" },
                { status: 401 }
            );
        }

        const { packageId, packageName, credits, amount, currency = "try" } = await req.json();

        if (!packageId || !packageName || !credits || !amount) {
            return NextResponse.json(
                { error: "Geçersiz paket bilgileri" },
                { status: 400 }
            );
        }

        // Stripe Checkout Session oluştur
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: packageName,
                            description: `${credits} kredi`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents/kuruş
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/cancel`,
            metadata: {
                userId,
                packageId: packageId.toString(),
                credits: credits.toString(),
            },
        });

        if (!session.url) {
            throw new Error("Stripe session URL is missing.");
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: error.message || "Ödeme işlemi başlatılamadı" },
            { status: 500 }
        );
    }
}
