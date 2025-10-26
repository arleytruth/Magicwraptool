import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "No signature provided" },
            { status: 400 }
        );
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err);
        return NextResponse.json(
            { error: "Webhook signature verification failed" },
            { status: 400 }
        );
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                
                console.log("✅ Payment successful:", session.id);

                // Get metadata from the session
                const userId = session.metadata?.userId;
                const packageId = session.metadata?.packageId;
                const credits = parseInt(session.metadata?.credits || "0");

                if (!userId || !credits) {
                    console.error("Missing metadata in session:", session.id);
                    return NextResponse.json(
                        { error: "Missing metadata" },
                        { status: 400 }
                    );
                }

                // Add credits to user account
                const supabase = createSupabaseServiceRoleClient();

                // Get current user credits and UUID
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("id, credits")
                    .eq("clerk_user_id", userId)
                    .single();

                if (userError || !userData) {
                    console.error("Error fetching user:", userError);
                    return NextResponse.json(
                        { error: "User not found" },
                        { status: 404 }
                    );
                }

                const userUuid = userData.id;
                const currentCredits = userData.credits || 0;
                const newCredits = currentCredits + credits;

                // Update user credits
                const { error: updateError } = await supabase
                    .from("users")
                    .update({ 
                        credits: newCredits,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", userUuid);

                if (updateError) {
                    console.error("Error updating credits:", updateError);
                    return NextResponse.json(
                        { error: "Failed to update credits" },
                        { status: 500 }
                    );
                }

                // Log the transaction with the correct UUID
                const { error: logError } = await supabase
                    .from("credit_transactions")
                    .insert({
                        user_id: userUuid, // Use UUID, not Clerk ID
                        amount: credits,
                        type: "purchase",
                        description: `Paket satın alma (${credits} kredi)`,
                        stripe_session_id: session.id,
                        package_id: packageId ? parseInt(packageId) : null,
                    });

                if (logError) {
                    console.error("Error logging transaction:", logError);
                    // Don't fail the webhook if logging fails
                }

                console.log(`✅ Credits added: ${credits} credits to user ${userId} (${currentCredits} → ${newCredits})`);
                
                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object;
                console.log("⏰ Checkout session expired:", session.id);
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                console.error("❌ Payment failed:", {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    last_payment_error: paymentIntent.last_payment_error,
                });
                
                // Log failed transaction to database
                const supabase = createSupabaseServiceRoleClient();
                
                // Try to get user from metadata if available
                const metadata = paymentIntent.metadata as any;
                const userId = metadata?.userId;
                
                if (userId) {
                    // Get user UUID
                    const { data: userData } = await supabase
                        .from("users")
                        .select("id")
                        .eq("clerk_user_id", userId)
                        .single();
                    
                    if (userData) {
                        await supabase.from("failed_transactions").insert({
                            user_id: userData.id,
                            stripe_payment_intent_id: paymentIntent.id,
                            amount: paymentIntent.amount,
                            currency: paymentIntent.currency,
                            failure_code: paymentIntent.last_payment_error?.code,
                            failure_message: paymentIntent.last_payment_error?.message,
                            last_payment_error: paymentIntent.last_payment_error,
                            event_type: "payment_intent.payment_failed",
                            metadata: metadata,
                        });
                    }
                }
                
                break;
            }

            case "charge.failed": {
                const charge = event.data.object;
                console.error("❌ Charge failed:", {
                    id: charge.id,
                    amount: charge.amount,
                    currency: charge.currency,
                    failure_code: charge.failure_code,
                    failure_message: charge.failure_message,
                    customer: charge.customer,
                });
                
                // Log failed charge to database
                const supabase = createSupabaseServiceRoleClient();
                
                // Try to get user from metadata if available
                const metadata = charge.metadata as any;
                const userId = metadata?.userId;
                
                if (userId) {
                    // Get user UUID
                    const { data: userData } = await supabase
                        .from("users")
                        .select("id")
                        .eq("clerk_user_id", userId)
                        .single();
                    
                    if (userData) {
                        await supabase.from("failed_transactions").insert({
                            user_id: userData.id,
                            stripe_charge_id: charge.id,
                            amount: charge.amount,
                            currency: charge.currency,
                            failure_code: charge.failure_code,
                            failure_message: charge.failure_message,
                            event_type: "charge.failed",
                            metadata: metadata,
                        });
                    }
                }
                
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Error processing webhook:", err);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

