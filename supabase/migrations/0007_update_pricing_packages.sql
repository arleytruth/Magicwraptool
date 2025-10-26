-- Add EUR pricing columns to credit_packages
ALTER TABLE public.credit_packages 
ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS original_price_eur DECIMAL(10,2);

-- Update existing packages with new pricing and EUR support
-- 1. Başlangıç Paketi: 25 kredi, 9.99 EUR
UPDATE public.credit_packages
SET 
    name = 'Başlangıç Paketi',
    credits = 25,
    price_try = 399,
    original_price_try = 599,
    price_eur = 9.99,
    original_price_eur = 14.99,
    description = 'Küçük projeler ve denemeler için ideal başlangıç paketi',
    feature_highlights = ARRAY[
        '25 görsel oluşturma hakkı',
        'Tüm kategorilerde kullanım',
        'HD kalitede çıktı',
        '30 gün geçerlilik'
    ],
    is_featured = false,
    badge_text = null,
    sort_order = 1,
    updated_at = now()
WHERE slug = 'starter';

-- 2. Profesyonel Paket: 50 kredi, 19.99 EUR
UPDATE public.credit_packages
SET 
    name = 'Profesyonel Paket',
    credits = 50,
    price_try = 799,
    original_price_try = 1099,
    price_eur = 19.99,
    original_price_eur = 29.99,
    description = 'Profesyonel kullanım için en popüler seçim',
    feature_highlights = ARRAY[
        '50 görsel oluşturma hakkı',
        'Tüm kategorilerde kullanım',
        '8K kalitede çıktı',
        'Öncelikli işleme',
        '60 gün geçerlilik'
    ],
    is_featured = true,
    badge_text = 'En Popüler',
    sort_order = 2,
    updated_at = now()
WHERE slug = 'pro';

-- 3. Update or Create İşletme Paketi: 150 kredi, 39.99 EUR
-- First, check if unlimited-monthly exists and update it to business
UPDATE public.credit_packages
SET 
    name = 'İşletme Paketi',
    slug = 'business',
    credits = 150,
    price_try = 1599,
    original_price_try = 2199,
    price_eur = 39.99,
    original_price_eur = 59.99,
    description = 'Yoğun kullanım ve işletmeler için en ekonomik çözüm',
    feature_highlights = ARRAY[
        '150 görsel oluşturma hakkı',
        'Tüm kategorilerde kullanım',
        '8K kalitede çıktı',
        'En hızlı işleme',
        'Öncelikli destek',
        '90 gün geçerlilik'
    ],
    is_featured = false,
    badge_text = 'En İyi Değer',
    sort_order = 3,
    updated_at = now()
WHERE slug = 'unlimited-monthly';

-- If business package doesn't exist, create it
INSERT INTO public.credit_packages (
    name, slug, description, credits, 
    price_try, original_price_try, 
    price_eur, original_price_eur,
    currency, feature_highlights, 
    is_featured, badge_text, sort_order, 
    is_active, created_at, updated_at
)
SELECT 
    'İşletme Paketi',
    'business',
    'Yoğun kullanım ve işletmeler için en ekonomik çözüm',
    150,
    1599,
    2199,
    39.99,
    59.99,
    'TRY',
    ARRAY[
        '150 görsel oluşturma hakkı',
        'Tüm kategorilerde kullanım',
        '8K kalitede çıktı',
        'En hızlı işleme',
        'Öncelikli destek',
        '90 gün geçerlilik'
    ],
    false,
    'En İyi Değer',
    3,
    true,
    now(),
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM public.credit_packages WHERE slug = 'business'
);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

