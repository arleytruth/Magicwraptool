import "server-only";

import { z } from "zod";

const publicSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z
        .string()
        .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
        .default("http://localhost:3000"),
    NEXT_PUBLIC_CONVEX_URL: z
        .string()
        .url("NEXT_PUBLIC_CONVEX_URL must be a valid URL"),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
        .string()
        .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
    NEXT_PUBLIC_SUPABASE_URL: z
        .string()
        .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
        .string()
        .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

const serverSchema = z.object({
    CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
    CLERK_WEBHOOK_SECRET: z.string().min(1, "CLERK_WEBHOOK_SECRET is required"),
    SUPABASE_SERVICE_ROLE_KEY: z
        .string()
        .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
    FAL_API_KEY: z.string().min(1, "FAL_API_KEY is required"),
    CLOUDINARY_CLOUD_NAME: z
        .string()
        .min(1, "CLOUDINARY_CLOUD_NAME is required"),
    CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
    CLOUDINARY_API_SECRET: z
        .string()
        .min(1, "CLOUDINARY_API_SECRET is required"),
    STRAPI_BASE_URL: z
        .string()
        .url("STRAPI_BASE_URL must be a valid URL")
        .optional(),
    STRAPI_TOKEN: z.string().optional(),
    NETLIFY_SITE_URL: z
        .string()
        .url("NETLIFY_SITE_URL must be a valid URL")
        .optional(),
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
