# Kategori Prompt Güncelleme Rehberi

Supabase'de 8 kategori hazır durumda. Aşağıdaki SQL komutlarını kullanarak her kategorinin prompt'unu güncelleyebilirsiniz.

## 📊 Mevcut Kategori Durumu

| # | Kategori Adı | Slug | Durum | Karakter Sayısı |
|---|-------------|------|-------|-----------------|
| 1 | Araç Kaplama | `vehicle` | ✅ Tamamlandı | 963 karakter |
| 2 | Mobilya Kaplama | `furniture` | ✅ Tamamlandı | 2,051 karakter |
| 3 | Duvar Kaplama | `wall` | ⏳ Prompt Bekleniyor | - |
| 4 | Bina Kaplama | `building` | ⏳ Prompt Bekleniyor | - |
| 5 | Elektronik Kaplama | `electronics` | ⏳ Prompt Bekleniyor | - |
| 6 | Kutu Kaplama | `box` | ⏳ Prompt Bekleniyor | - |
| 7 | Auto Tuning | `auto_tuning` | ⏳ Prompt Bekleniyor | - |
| 8 | Eşya Kaplama | `general_item` | ⏳ Prompt Bekleniyor | - |

## 🔧 Prompt Güncelleme Komutları

### 3. Duvar Kaplama (Wall)
```sql
UPDATE public.generation_categories
SET 
    prompt_template = 'BURAYA DUVAR KAPLAMA PROMPTUNU YAZ',
    updated_at = now()
WHERE slug = 'wall';
```

### 4. Bina Kaplama (Building)
```sql
UPDATE public.generation_categories
SET 
    prompt_template = 'BURAYA BINA KAPLAMA PROMPTUNU YAZ',
    updated_at = now()
WHERE slug = 'building';
```

### 5. Elektronik Kaplama (Electronics)
```sql
UPDATE public.generation_categories
SET 
    prompt_template = 'BURAYA ELEKTRONIK KAPLAMA PROMPTUNU YAZ',
    updated_at = now()
WHERE slug = 'electronics';
```

### 6. Kutu Kaplama (Box)
```sql
UPDATE public.generation_categories
SET 
    prompt_template = 'BURAYA KUTU KAPLAMA PROMPTUNU YAZ',
    updated_at = now()
WHERE slug = 'box';
```

### 7. Auto Tuning
```sql
UPDATE public.generation_categories
SET 
    prompt_template = 'BURAYA AUTO TUNING PROMPTUNU YAZ',
    updated_at = now()
WHERE slug = 'auto_tuning';
```

### 8. Eşya Kaplama (General Item)
```sql
UPDATE public.generation_categories
SET 
    prompt_template = 'BURAYA EŞYA KAPLAMA PROMPTUNU YAZ',
    updated_at = now()
WHERE slug = 'general_item';
```

## 📝 Prompt Yazma İpuçları

Prompt'ları yazarken şu kurallara dikkat edin:

1. **Kısa ve Öz**: 800-2000 karakter arası ideal
2. **Net Talimatlar**: Ne yapılacağını ve ne yapılmayacağını açıkça belirt
3. **FORBIDDEN Kuralları**: Yasaklı işlemleri listele
4. **PRESERVE**: Değiştirilmemesi gereken yüzeyleri belirt
5. **Malzeme Eşleştirme**: EXACT, NO ENHANCEMENTS gibi vurgular kullan

### Örnek Prompt Yapısı:
```
STRICT RULES:
1. DO NOT rotate/move/change angle
2. ONLY change [target surfaces]
3. PRESERVE [protected elements]

APPLY TO: [wrappable surfaces]
PRESERVE: [non-wrappable elements]

MATERIAL MATCHING:
- Copy EXACT RGB colors
- Copy EXACT finish
- NO enhancements

VERIFICATION: Same angle? Same background? Only texture changed?

OUTPUT: Photorealistic 8K wrap with EXACT material fidelity.
```

## ✅ Doğrulama

Prompt'u güncelledikten sonra kontrol için:

```sql
SELECT 
    id,
    name_tr,
    slug,
    LENGTH(prompt_template) as prompt_length,
    SUBSTRING(prompt_template, 1, 100) as prompt_preview
FROM public.generation_categories
WHERE slug = 'KATEGORI_SLUG';
```

## 🔄 Prompt Güncelleme Cache Yenileme

Her prompt güncellemesinden sonra:

```sql
NOTIFY pgrst, 'reload schema';
```

## 🎯 Sistem Nasıl Çalışır?

1. Kullanıcı `/generate` sayfasında kategori seçer
2. Görsel yükler ve "Oluşturmaya Başla" butonuna basar
3. Backend (`/api/jobs`):
   ```typescript
   const { data: categoryRow } = await supabase
       .from("generation_categories")
       .select("*")
       .eq("slug", payload.category)
       .maybeSingle();
   
   const prompt = categoryRow?.prompt_template ?? fallbackPrompt;
   ```
4. Bu prompt Fal.ai'ye gönderilir
5. Fal.ai görseli oluşturur
6. Sonuç kullanıcıya gösterilir

## 📊 Tüm Kategorileri Görüntüle

```sql
SELECT 
    id,
    name_tr AS "Kategori",
    slug AS "Slug",
    credits_per_generation AS "Kredi",
    CASE 
        WHEN prompt_template LIKE 'PROMPT_PLACEHOLDER%' THEN '⏳ Bekleniyor'
        ELSE '✅ Hazır (' || LENGTH(prompt_template) || ' karakter)'
    END AS "Durum",
    is_active AS "Aktif",
    sort_order AS "Sıra"
FROM public.generation_categories
ORDER BY sort_order;
```

## 🚀 Hızlı Test

Prompt güncelledikten sonra test etmek için:

1. `npm run dev` ile server'ı başlat
2. `/generate` sayfasına git
3. İlgili kategoriyi seç
4. Görsel yükle ve test et
5. Terminal'de log'ları kontrol et:
   ```
   [api/jobs] Fal.ai isteği gönderiliyor: {
     category: 'wall',
     promptSource: 'database',
     promptLength: 1234
   }
   ```

## 💾 Backup

Prompt değiştirmeden önce mevcut prompt'u yedekle:

```sql
SELECT slug, prompt_template
FROM public.generation_categories
WHERE slug = 'KATEGORI_SLUG';
```

