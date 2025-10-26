-- Magicwrap initial schema for Supabase

create type user_role as enum ('user', 'admin', 'owner');
create type user_status as enum ('active', 'blocked', 'deleted');
create type generation_status as enum ('pending', 'processing', 'completed', 'failed');
create type credit_transaction_type as enum ('purchase', 'manual_adjustment', 'consumption', 'refund');
create type credit_transaction_reference as enum ('payment', 'generation', 'admin_action', 'system');

create table public.users (
    id uuid primary key default gen_random_uuid(),
    clerk_user_id text not null unique,
    email text unique,
    email_verified boolean not null default false,
    email_verified_at timestamptz,
    first_name text,
    last_name text,
    profile_image_url text,
    role user_role not null default 'user',
    status user_status not null default 'active',
    credits integer not null default 0,
    last_login_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.generation_categories (
    id serial primary key,
    name_tr text not null unique,
    slug text not null unique,
    prompt_template text not null,
    credits_per_generation integer not null default 1,
    is_active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.jobs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users (id) on delete cascade,
    category text not null default 'vehicle',
    category_id integer references public.generation_categories (id),
    status generation_status not null default 'pending',
    object_image_url text not null,
    object_image_public_id text,
    material_image_url text not null,
    material_image_public_id text,
    result_image_url text,
    result_image_public_id text,
    saved boolean not null default false,
    error_message text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    completed_at timestamptz,
    failed_at timestamptz
);

create table public.generation_logs (
    id uuid primary key default gen_random_uuid(),
    job_id uuid references public.jobs (id) on delete set null,
    user_id uuid not null references public.users (id) on delete cascade,
    category_id integer references public.generation_categories (id),
    status generation_status not null default 'pending',
    credits_consumed integer not null default 0,
    metadata jsonb,
    created_at timestamptz not null default now(),
    completed_at timestamptz
);

create table public.credit_transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users (id) on delete cascade,
    type credit_transaction_type not null,
    reference_type credit_transaction_reference not null,
    reference_id text,
    amount integer not null,
    balance_after integer,
    metadata jsonb,
    created_at timestamptz not null default now()
);

create index idx_jobs_user_created_at on public.jobs (user_id, created_at desc);
create index idx_jobs_status on public.jobs (status);
create index idx_generation_logs_user_created_at on public.generation_logs (user_id, created_at desc);
create index idx_credit_transactions_user_created_at on public.credit_transactions (user_id, created_at desc);

comment on table public.users is 'Mirror of Clerk users with credit tracking';
comment on table public.jobs is 'Wrap jobs generated via Fal.ai';
comment on table public.generation_logs is 'Detailed audit trail for each generation run';
comment on table public.credit_transactions is 'Ledger of credit debits/credits';

