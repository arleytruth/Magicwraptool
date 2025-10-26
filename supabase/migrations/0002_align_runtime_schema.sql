-- Align runtime database schema with application expectations

-- Ensure required enum types exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'owner');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('active', 'blocked', 'deleted');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'generation_status') THEN
        CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'credit_transaction_type') THEN
        CREATE TYPE credit_transaction_type AS ENUM ('purchase', 'manual_adjustment', 'consumption', 'refund');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'credit_transaction_reference') THEN
        CREATE TYPE credit_transaction_reference AS ENUM ('payment', 'generation', 'admin_action', 'system');
    END IF;
END;
$$;

-- users table adjustments
ALTER TABLE public.users
    ALTER COLUMN clerk_user_id SET NOT NULL,
    ALTER COLUMN email_verified SET DEFAULT false,
    ALTER COLUMN email_verified SET NOT NULL,
    ALTER COLUMN credits SET DEFAULT 0,
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS status user_status NOT NULL DEFAULT 'active';

ALTER TABLE public.users
    ALTER COLUMN email_verified_at TYPE timestamptz USING
        CASE
            WHEN email_verified_at IS NULL THEN NULL
            ELSE email_verified_at AT TIME ZONE 'UTC'
        END,
    ALTER COLUMN last_login_at TYPE timestamptz USING
        CASE
            WHEN last_login_at IS NULL THEN NULL
            ELSE last_login_at AT TIME ZONE 'UTC'
        END;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.users'::regclass
          AND conname = 'users_clerk_user_id_key'
    ) THEN
        ALTER TABLE public.users
            ADD CONSTRAINT users_clerk_user_id_key UNIQUE (clerk_user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.users'::regclass
          AND conname = 'users_email_key'
    ) THEN
        ALTER TABLE public.users
            ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END;
$$;

-- jobs table adjustments
ALTER TABLE public.jobs
    ALTER COLUMN category SET DEFAULT 'vehicle';

ALTER TABLE public.jobs
    ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.jobs
    ALTER COLUMN status TYPE generation_status USING status::generation_status;

ALTER TABLE public.jobs
    ALTER COLUMN status SET DEFAULT 'pending';

-- generation_logs table adjustments
ALTER TABLE public.generation_logs
    ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.generation_logs
    ALTER COLUMN status TYPE generation_status USING status::generation_status;

ALTER TABLE public.generation_logs
    ALTER COLUMN status SET DEFAULT 'pending',
    ALTER COLUMN credits_consumed SET DEFAULT 0;

-- credit_transactions table adjustments
ALTER TABLE public.credit_transactions
    ADD COLUMN IF NOT EXISTS balance_after integer,
    ALTER COLUMN reference_id TYPE text USING reference_id::text;

ALTER TABLE public.credit_transactions
    ALTER COLUMN type TYPE credit_transaction_type USING type::credit_transaction_type,
    ALTER COLUMN reference_type TYPE credit_transaction_reference USING reference_type::credit_transaction_reference;

UPDATE public.credit_transactions
SET reference_type = 'system'
WHERE reference_type IS NULL;

ALTER TABLE public.credit_transactions
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN reference_type SET NOT NULL;

-- Ensure helpful indexes exist
CREATE INDEX IF NOT EXISTS idx_jobs_user_created_at ON public.jobs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_created_at ON public.generation_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created_at ON public.credit_transactions (user_id, created_at DESC);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

