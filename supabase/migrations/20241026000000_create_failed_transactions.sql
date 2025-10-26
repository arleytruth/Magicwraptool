-- Create failed_transactions table to track payment failures
CREATE TABLE IF NOT EXISTS public.failed_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id text,
    stripe_charge_id text,
    amount integer NOT NULL,
    currency text DEFAULT 'try',
    failure_code text,
    failure_message text,
    last_payment_error jsonb,
    event_type text NOT NULL, -- 'payment_intent.payment_failed' or 'charge.failed'
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes
CREATE INDEX idx_failed_transactions_user_id ON public.failed_transactions (user_id);
CREATE INDEX idx_failed_transactions_created_at ON public.failed_transactions (created_at DESC);
CREATE INDEX idx_failed_transactions_stripe_payment_intent_id ON public.failed_transactions (stripe_payment_intent_id);

-- Enable Row Level Security
ALTER TABLE public.failed_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own failed transactions."
ON public.failed_transactions FOR SELECT
TO authenticated
USING (user_id IN (SELECT id FROM public.users WHERE clerk_user_id = (auth.uid())::text));

CREATE POLICY "Admins can view all failed transactions."
ON public.failed_transactions FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE clerk_user_id = (auth.uid())::text 
    AND role IN ('admin', 'owner')
));

-- Comment
COMMENT ON TABLE public.failed_transactions IS 'Stores failed payment attempts for debugging and customer support';

