import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get user's UUID from Clerk ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError || !userData) {
      console.error("User lookup error:", userError);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch credit transactions with package info
    const { data: transactions, error: transactionsError } = await supabase
      .from("credit_transactions")
      .select(`
        id,
        amount,
        type,
        description,
        stripe_session_id,
        package_id,
        created_at,
        credit_packages (
          name,
          credits,
          price_try,
          currency
        )
      `)
      .eq("user_id", userData.id)
      .eq("type", "purchase")
      .order("created_at", { ascending: false });

    if (transactionsError) {
      console.error("Transactions fetch error:", transactionsError);
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    return NextResponse.json(transactions || []);
  } catch (error) {
    console.error("Transaction API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

