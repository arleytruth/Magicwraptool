-- Add all wrap categories to generation_categories table
-- Vehicle and furniture already exist, so we'll add the rest

-- First, update existing categories with Turkish names if needed
UPDATE public.generation_categories
SET 
    updated_at = now()
WHERE slug IN ('vehicle', 'furniture');

-- Insert missing categories (wall, building, electronics, box, auto_tuning, general_item)
INSERT INTO public.generation_categories (slug, credits_per_generation, is_active, prompt_template, created_at, updated_at)
VALUES 
    -- 3. Duvar Kaplama
    ('wall', 1, true, NULL, now(), now()),
    
    -- 4. Bina Kaplama
    ('building', 1, true, NULL, now(), now()),
    
    -- 5. Elektronik Kaplama
    ('electronics', 1, true, NULL, now(), now()),
    
    -- 6. Kutu Kaplama
    ('box', 1, true, NULL, now(), now()),
    
    -- 7. Auto Tuning
    ('auto_tuning', 1, true, NULL, now(), now()),
    
    -- 8. Eşya Kaplama
    ('general_item', 1, true, NULL, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- Verify all categories
SELECT 
    id,
    slug,
    credits_per_generation,
    is_active,
    CASE 
        WHEN prompt_template IS NOT NULL THEN 'Prompt mevcut'
        ELSE 'Prompt bekleniyor'
    END as prompt_status,
    created_at
FROM public.generation_categories
ORDER BY id;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

