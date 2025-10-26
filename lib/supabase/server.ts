import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { publicEnv, serverEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase environment variables");
    }

    return createServerClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // noop - cookies() in route handlers is readonly
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.delete({ name, ...options });
                    } catch {
                        // noop
                    }
                },
            },
        },
    );
}

export function createSupabaseServiceRoleClient() {
    const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Missing Supabase environment variables (URL or Service Role Key)");
    }

    return createClient<Database>(
        supabaseUrl,
        serviceRoleKey,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        },
    ) as any;
}
