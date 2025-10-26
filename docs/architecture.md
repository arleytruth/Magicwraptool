# Magicwrap Architecture

## Overview
- **Framework**: Next.js 14 (App Router) deployed on Netlify with the official Next runtime plugin.
- **Auth**: Clerk provides hosted sign in / sign up, session management, and webhooks for provisioning internal user records.
- **Database**: Supabase (Postgres). The app uses a server-side service role key for mutations and the anonymous key for client reads. Tables mirror the former Drizzle schema (`users`, `jobs`, `generation_logs`, `generation_categories`, `credit_transactions`, ...).
- **Content**: Strapi delivers marketing & admin-copy via REST. Static fallback content lives in the repo so pages can render during local development.
- **Image Generation**: Fal.ai handles wrap rendering. Requests originate from Next API routes with Clerk auth guards and Supabase-backed request logging.
- **Asset Storage**: Cloudinary stores user uploads and Fal.ai outputs. Uploads run through signed server-side API routes in Next.

## Request Flow
1. **User Auth**  
   - Browser loads marketing pages via Next static/ISR routes.  
   - Authenticated areas are wrapped by `ClerkProvider` in `app/layout.tsx`.  
   - Clerk webhook (`/api/webhooks/clerk`) upserts a Supabase `users` row (including role resolution).  
   - Supabase Row Level Security (RLS) ensures users can only read/write their records.

2. **Job Generation**  
   - Client uploads object & material images to `/api/uploads` (multipart).  
   - API route validates Clerk session, streams file buffers to Cloudinary, and stores public IDs.  
   - Client posts to `/api/jobs` with Cloudinary URLs + category.  
   - Handler creates a Supabase job record (`pending`), enqueues Fal.ai request, and updates status once Fal.ai finishes.  
   - Final render is persisted back to Cloudinary, job status -> `completed`, and a generation log row records credits consumed.

3. **Content Delivery**  
   - Marketing pages fetch Strapi JSON via `lib/strapi.ts`. Responses are cached with Next's `revalidate` helpers.  
   - If Strapi is offline, the helper returns baked-in defaults so pages stay functional.

4. **Dashboard**  
   - Protected routes rely on Clerk middleware + `auth()` in server components.  
   - Supabase queries use the authenticated user's ID, sourced from Clerk, to list jobs, credits, etc.

## Deployment Pipeline
1. Netlify builds the project with `NEXT_PUBLIC_SITE_URL`, Clerk keys, Supabase keys, Fal.ai key, Cloudinary credentials, and Strapi tokens.  
2. `netlify.toml` enables the Next runtime and sets environment defaults (region, node version).  
3. Supabase migrations (SQL in `/supabase/migrations`) run via Supabase CLI/manual apply.  
4. Strapi Netlify Integration triggers rebuild webhooks when content changes.  
5. Environment secrets are maintained centrally (Netlify), not committed.

## Key Environment Variables
See `.env.example` for the complete list. Core secrets:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `FAL_API_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `STRAPI_BASE_URL`, `STRAPI_TOKEN`
- `NEXT_PUBLIC_SITE_URL` (used for metadata & OAuth callbacks)

## Open Items
- Choose Strapi collection structure for marketing content.
- Confirm Supabase credit/transaction tables required day-one.
- Configure Netlify background functions if long-running Fal.ai jobs exceed standard timeout (current approach runs inline with retries).

