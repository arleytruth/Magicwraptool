import "server-only";

import { z } from "zod";

// Build-time safe: make public env optional with defaults
const publicSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z
        .string()
        .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
        .default("http://localhost:3000"),
    NEXT_PUBLIC_CONVEX_URL: z
        .string()
        .url("NEXT_PUBLIC_CONVEX_URL must be a valid URL")
        .default("https://placeholder.convex.cloud"),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().default(""),
    NEXT_PUBLIC_SUPABASE_URL: z
        .string()
        .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
        .default("https://placeholder.supabase.co"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(""),
});

// Build-time safe: provide defaults for all server secrets to allow build without them
const serverSchema = z.object({
    CLERK_SECRET_KEY: z.string().default(""),
    CLERK_WEBHOOK_SECRET: z.string().default(""),
    SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),
    FAL_API_KEY: z.string().default(""),
    CLOUDINARY_CLOUD_NAME: z.string().default(""),
    CLOUDINARY_API_KEY: z.string().default(""),
    CLOUDINARY_API_SECRET: z.string().default(""),
    STRAPI_BASE_URL: z.string().optional(),
    STRAPI_TOKEN: z.string().optional(),
    NETLIFY_SITE_URL: z.string().optional(),
});

const _publicEnv = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const _serverEnv = {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    FAL_API_KEY: process.env.FAL_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    STRAPI_BASE_URL: process.env.STRAPI_BASE_URL,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
    NETLIFY_SITE_URL: process.env.NETLIFY_SITE_URL,
};

export const publicEnv = publicSchema.parse(_publicEnv);
export const serverEnv = serverSchema.parse(_serverEnv);

export const env = {
    ...publicEnv,
    ...serverEnv,
};
