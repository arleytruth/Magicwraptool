-- Create video_generations table
CREATE TABLE IF NOT EXISTS public.video_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    
    -- Input data
    source_image_url TEXT NOT NULL,
    source_image_public_id TEXT,
    prompt TEXT NOT NULL,
    
    -- Fal.ai parameters
    aspect_ratio TEXT DEFAULT 'auto',
    resolution TEXT DEFAULT '1080p',
    duration TEXT DEFAULT '5',
    seed INTEGER,
    
    -- Output data
    video_url TEXT,
    video_public_id TEXT,
    fal_request_id TEXT,
    
    -- Status and metadata
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    credits_consumed INTEGER NOT NULL DEFAULT 6,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_video_generations_user_id ON public.video_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_job_id ON public.video_generations(job_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_status ON public.video_generations(status);
CREATE INDEX IF NOT EXISTS idx_video_generations_created_at ON public.video_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_generations_fal_request_id ON public.video_generations(fal_request_id);

-- Enable RLS
ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own video generations"
    ON public.video_generations
    FOR SELECT
    USING (auth.uid()::text = (SELECT clerk_user_id FROM public.users WHERE id = video_generations.user_id));

CREATE POLICY "Users can insert their own video generations"
    ON public.video_generations
    FOR INSERT
    WITH CHECK (auth.uid()::text = (SELECT clerk_user_id FROM public.users WHERE id = video_generations.user_id));

CREATE POLICY "Users can update their own video generations"
    ON public.video_generations
    FOR UPDATE
    USING (auth.uid()::text = (SELECT clerk_user_id FROM public.users WHERE id = video_generations.user_id));

-- Add comment
COMMENT ON TABLE public.video_generations IS 'Stores video generation history and results from Fal.ai Image-to-Video API';

