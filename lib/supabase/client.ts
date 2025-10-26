"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { browserEnv } from "@/lib/env.browser";
import type { Database } from "@/types/supabase";

let client: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
    if (client) {
        return client;
    }

    client = createBrowserClient<Database>(
        browserEnv.NEXT_PUBLIC_SUPABASE_URL,
        browserEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    return client;
}
