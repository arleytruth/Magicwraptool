export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    clerk_user_id: string;
                    email: string | null;
                    first_name: string | null;
                    last_name: string | null;
                    profile_image_url: string | null;
                    username: string | null;
                    role: "user" | "admin" | "owner";
                    status: "active" | "blocked" | "deleted";
                    credits: number;
                    email_verified: boolean;
                    email_verified_at: string | null;
                    created_at: string;
                    updated_at: string;
                    last_login_at: string | null;
                };
                Insert: {
                    id?: string;
                    clerk_user_id: string;
                    email?: string | null;
                    first_name?: string | null;
                    last_name?: string | null;
                    profile_image_url?: string | null;
                    username?: string | null;
                    role?: "user" | "admin" | "owner";
                    status?: "active" | "blocked" | "deleted";
                    credits?: number;
                    email_verified?: boolean;
                    email_verified_at?: string | null;
                    last_login_at?: string | null;
                };
                Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
            };
            jobs: {
                Row: {
                    id: string;
                    user_id: string;
                    category: string;
                    category_id: number | null;
                    object_image_url: string;
                    object_image_public_id: string | null;
                    material_image_url: string;
                    material_image_public_id: string | null;
                    result_image_url: string | null;
                    result_image_public_id: string | null;
                    status: "pending" | "processing" | "completed" | "failed";
                    saved: boolean;
                    error_message: string | null;
                    created_at: string;
                    updated_at: string;
                    completed_at: string | null;
                    failed_at: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    category: string;
                    category_id?: number | null;
                    object_image_url: string;
                    object_image_public_id?: string | null;
                    material_image_url: string;
                    material_image_public_id?: string | null;
                    result_image_url?: string | null;
                    result_image_public_id?: string | null;
                    status?: "pending" | "processing" | "completed" | "failed";
                    saved?: boolean;
                    error_message?: string | null;
                    created_at?: string;
                    updated_at?: string;
                    completed_at?: string | null;
                    failed_at?: string | null;
                };
                Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
            };
            generation_logs: {
                Row: {
                    id: string;
                    job_id: string | null;
                    user_id: string;
                    category_id: number | null;
                    status: "pending" | "processing" | "completed" | "failed";
                    credits_consumed: number;
                    metadata: Json | null;
                    created_at: string;
                    completed_at: string | null;
                };
                Insert: {
                    id?: string;
                    job_id?: string | null;
                    user_id: string;
                    category_id?: number | null;
                    status?: "pending" | "processing" | "completed" | "failed";
                    credits_consumed?: number;
                    metadata?: Json | null;
                    completed_at?: string | null;
                };
                Update: Partial<
                    Database["public"]["Tables"]["generation_logs"]["Insert"]
                >;
            };
            generation_categories: {
                Row: {
                    id: number;
                    name_tr: string;
                    slug: string;
                    prompt_template: string;
                    credits_per_generation: number;
                    is_active: boolean;
                    sort_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    name_tr: string;
                    slug: string;
                    prompt_template: string;
                    credits_per_generation?: number;
                    is_active?: boolean;
                    sort_order?: number;
                };
                Update: Partial<
                    Database["public"]["Tables"]["generation_categories"]["Insert"]
                >;
            };
            credit_transactions: {
                Row: {
                    id: string;
                    user_id: string;
                    type: "purchase" | "manual_adjustment" | "consumption" | "refund";
                    reference_type:
                        | "payment"
                        | "generation"
                        | "admin_action"
                        | "system";
                    reference_id: string | null;
                    amount: number;
                    metadata: Json | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    type:
                        | "purchase"
                        | "manual_adjustment"
                        | "consumption"
                        | "refund";
                    reference_type:
                        | "payment"
                        | "generation"
                        | "admin_action"
                        | "system";
                    reference_id?: string | null;
                    amount: number;
                    metadata?: Json | null;
                };
                Update: Partial<
                    Database["public"]["Tables"]["credit_transactions"]["Insert"]
                >;
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
};
