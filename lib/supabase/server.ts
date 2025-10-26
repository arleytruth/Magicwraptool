import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { publicEnv, serverEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";

export function createSupabaseServerClient() {
    const cookieStore = cookies();

    return createServerClient<Database>(
        publicEnv.NEXT_PUBLIC_SUPABASE_URL,
        publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    return createClient<Database>(
        publicEnv.NEXT_PUBLIC_SUPABASE_URL,
        serverEnv.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        },
    ) as any;
}
