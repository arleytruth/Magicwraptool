# 🌐 Çoklu Dil Desteği

## Desteklenen Diller

Uygulama **4 dilde** mevcuttur:

### 1. 🇬🇧 **İngilizce (English)** - Ana Dil
- Kod: `en`
- Dosya: `locales/en.json`
- Varsayılan dil

### 2. 🇩🇪 **Almanca (Deutsch)**
- Kod: `de`
- Dosya: `locales/de.json`

### 3. 🇹🇷 **Türkçe**
- Kod: `tr`
- Dosya: `locales/tr.json`

### 4. 🇪🇸 **İspanyolca (Español)**
- Kod: `es`
- Dosya: `locales/es.json`

---

## Dil Seçici

Kullanıcılar header'daki **bayrak simgesine** tıklayarak dil değiştirebilir:

```tsx
<LanguageSwitcher />
```

Yerleşim:
- `components/magicwrap/LanguageSwitcher.tsx`
- Header'da sağ üstte
- Dropdown menü ile kolay geçiş

---

## Yapılandırma

### i18n Ayarları

`lib/i18n/client.ts` dosyasında:

```typescript
const resources = {
    en: { translation: en },  // İngilizce
    de: { translation: de },  // Almanca
    tr: { translation: tr },  // Türkçe
    es: { translation: es },  // İspanyolca
};

i18n.init({
    resources,
    lng: "en",        // Ana dil: İngilizce
    fallbackLng: "en", // Yedek dil: İngilizce
});
```

---

## Kullanım

### Component'lerde Çeviri

```tsx
import { useTranslation } from "react-i18next";

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('header.features')}</h1>
      <p>{t('generate.pageSubtitle')}</p>
    </div>
  );
}
```

### Çeviri Anahtarları

JSON dosyalarında hiyerarşik yapı:

```json
{
  "header": {
    "features": "Features",
    "pricing": "Pricing"
  },
  "generate": {
    "pageTitle": "Create Your Wrapped Image",
    "uploadingImages": "Uploading Images..."
  }
}
```

Kullanım: `t('header.features')` → "Features"

---

## Yeni Dil Ekleme

### Adım 1: Çeviri Dosyası Oluştur

`locales/fr.json` (örnek: Fransızca):

```json
{
  "header": {
    "features": "Caractéristiques",
    "pricing": "Tarification"
  }
  // ... diğer çeviriler
}
```

### Adım 2: i18n'e Ekle

`lib/i18n/client.ts`:

```typescript
import fr from "@/locales/fr.json";

const resources = {
    en: { translation: en },
    de: { translation: de },
    tr: { translation: tr },
    es: { translation: es },
    fr: { translation: fr }, // Yeni dil
};
```

### Adım 3: LanguageSwitcher'a Ekle

`components/magicwrap/LanguageSwitcher.tsx`:

```typescript
const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" }, // Yeni dil
];
```

---

## Çeviri Kategorileri

### 1. Genel (common)
- loading, error, success
- save, cancel, download
- Tüm sayfalarda ortak kullanılan terimler

### 2. Header
- Navigasyon menüsü
- Profil, kredi, galeri linkleri

### 3. Auth
- Giriş/Çıkış
- Yetkilendirme mesajları

### 4. Generate
- Ana üretim sayfası
- Upload, process, sonuç mesajları
- En kapsamlı bölüm

### 5. Profile
- Kullanıcı profili
- İstatistikler
- Galeri

### 6. Pricing
- Fiyatlandırma paketleri
- Özellik listesi

### 7. Features
- Ürün özellikleri
- Açıklamalar

### 8. How It Works
- Adım adım rehber
- Kullanım kılavuzu

### 9. Category Selector
- Nesne kategorileri
- Araç, mobilya, duvar, vb.

---

## Eksik Çeviri Kontrolü

Tüm dil dosyalarının aynı anahtarlara sahip olması önemli:

```bash
# JSON anahtarlarını karşılaştır
diff <(jq -S 'paths(scalars) | join(".")' locales/en.json) \
     <(jq -S 'paths(scalars) | join(".")' locales/de.json)
```

---

## Best Practices

1. **Anahtarlar İngilizce:** Tüm çeviri anahtarları İngilizce olmalı
2. **Nokta Notasyonu:** `header.features` şeklinde hiyerarşik
3. **Kısa ve Açık:** `btnSave` yerine `save` kullan
4. **Context:** Aynı kelime farklı bağlamlarda farklı çeviri gerektirebilir
5. **Placeholder:** `{{name}}` ile dinamik içerik: `"Hello {{name}}"`

---

## Dinamik Çeviriler

### Interpolation (Değişken Ekleme)

JSON:
```json
{
  "welcome": "Welcome, {{username}}!"
}
```

Kullanım:
```tsx
t('welcome', { username: 'John' })
// Sonuç: "Welcome, John!"
```

### Pluralization (Çoğul)

JSON:
```json
{
  "credits": "{{count}} credit",
  "credits_plural": "{{count}} credits"
}
```

Kullanım:
```tsx
t('credits', { count: 1 })  // "1 credit"
t('credits', { count: 5 })  // "5 credits"
```

---

## Test

### Dil Değiştirme Testi

```tsx
// Test component
const { i18n } = useTranslation();

// Dil değiştir
i18n.changeLanguage('de'); // Almanca
i18n.changeLanguage('tr'); // Türkçe
i18n.changeLanguage('en'); // İngilizce

// Mevcut dili kontrol et
console.log(i18n.language); // "en", "de", "tr", veya "es"
```

---

## Deployment

Netlify'de environment variable gerekmez - tüm çeviriler statik JSON dosyalarında.

Build sırasında otomatik olarak bundle'a dahil edilir.

---

## Sorun Giderme

### 1. Çeviri Görünmüyor
- JSON syntax hatası var mı kontrol et
- `i18n.init()` çağrıldı mı kontrol et
- Browser console'da hata var mı bak

### 2. Dil Değişmiyor
- LocalStorage temizle: `localStorage.clear()`
- Browser cache'i temizle
- `i18n.changeLanguage()` doğru çağrılıyor mu kontrol et

### 3. Eksik Çeviriler
- Fallback dil (İngilizce) devreye girer
- JSON dosyasında key eksik olabilir
- Console'da "Missing translation" uyarısı kontrol et

---

**Dil desteği tamam! Kullanıcılar artık 4 dil arasında kolayca geçiş yapabilir.** 🌐

