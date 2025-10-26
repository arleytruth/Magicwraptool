-- Add all wrap categories to generation_categories table
-- Vehicle and furniture already exist, so we'll add the rest with Turkish names

-- Insert missing categories with placeholder prompts (to be updated later)
INSERT INTO public.generation_categories (name_tr, slug, credits_per_generation, is_active, prompt_template, sort_order, created_at, updated_at)
VALUES 
    -- 3. Duvar Kaplama
    ('Duvar Kaplama', 'wall', 1, true, 'PROMPT_PLACEHOLDER: Duvar kaplama promptu eklenecek.', 3, now(), now()),
    
    -- 4. Bina Kaplama
    ('Bina Kaplama', 'building', 1, true, 'PROMPT_PLACEHOLDER: Bina kaplama promptu eklenecek.', 4, now(), now()),
    
    -- 5. Elektronik Kaplama
    ('Elektronik Kaplama', 'electronics', 1, true, 'PROMPT_PLACEHOLDER: Elektronik kaplama promptu eklenecek.', 5, now(), now()),
    
    -- 6. Kutu Kaplama
    ('Kutu Kaplama', 'box', 1, true, 'PROMPT_PLACEHOLDER: Kutu kaplama promptu eklenecek.', 6, now(), now()),
    
    -- 7. Auto Tuning
    ('Auto Tuning', 'auto_tuning', 1, true, 'PROMPT_PLACEHOLDER: Auto tuning promptu eklenecek.', 7, now(), now()),
    
    -- 8. Eşya Kaplama
    ('Eşya Kaplama', 'general_item', 1, true, 'PROMPT_PLACEHOLDER: Eşya kaplama promptu eklenecek.', 8, now(), now())
ON CONFLICT (slug) DO UPDATE SET
    name_tr = EXCLUDED.name_tr,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

-- Update existing categories with Turkish names and sort order
UPDATE public.generation_categories
SET 
    name_tr = CASE 
        WHEN slug = 'vehicle' THEN 'Araç Kaplama'
        WHEN slug = 'furniture' THEN 'Mobilya Kaplama'
        ELSE name_tr
    END,
    sort_order = CASE 
        WHEN slug = 'vehicle' THEN 1
        WHEN slug = 'furniture' THEN 2
        ELSE sort_order
    END,
    updated_at = now()
WHERE slug IN ('vehicle', 'furniture');

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

