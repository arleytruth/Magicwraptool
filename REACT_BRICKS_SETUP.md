# 🎨 React Bricks Kurulum Tamamlandı!

## ✅ Kurulum Detayları

### 1. Yüklenen Paket
- ✅ `react-bricks` (v4.7.1+) başarıyla yüklendi

### 2. Environment Variables
`.env.local` dosyasına eklendi:
```env
NEXT_PUBLIC_APP_ID=fc98fbd3-52d8-4fda-b204-8d0d67847a52
API_KEY=9b6088b0-1023-4405-b269-7162e7bb06d9
NEXT_PUBLIC_ENVIRONMENT=production
```

### 3. Oluşturulan Dosyalar

#### Config & Core
- `react-bricks/config.tsx` - Ana yapılandırma
- `react-bricks/pageTypes.ts` - Sayfa tipleri
- `components/ReactBricksApp.tsx` - Provider component

#### Brick Components (4 adet)
- `react-bricks/bricks/Title.tsx` - Başlık brick'i (H1, H2, H3)
- `react-bricks/bricks/Paragraph.tsx` - Paragraf brick'i
- `react-bricks/bricks/ButtonBrick.tsx` - Buton brick'i
- `react-bricks/bricks/HeroSection.tsx` - Hero bölümü brick'i
- `react-bricks/bricks/index.ts` - Brick registry

#### Admin Routes
- `/admin` - Ana dashboard
- `/admin/editor` - Sayfa editörü
- `/admin/playground` - Component playground
- `/admin/app-settings` - Uygulama ayarları
- `/preview` - Önizleme sayfası

#### Dynamic Pages
- `/rb/[slug]` - React Bricks sayfalarını render eder

## 🚀 Kullanıma Başlama

### 1. Development Server'ı Başlatın
```bash
npm run dev
```

### 2. Admin Paneline Giriş
Tarayıcınızda şu adreslere gidin:

**Admin Dashboard:**
```
http://localhost:3000/admin
```

**Editor:**
```
http://localhost:3000/admin/editor
```

**Playground:**
```
http://localhost:3000/admin/playground
```

### 3. İlk Sayfanızı Oluşturun

1. `http://localhost:3000/admin` adresine gidin
2. "New Page" butonuna tıklayın
3. Sayfa adı ve slug'ı belirleyin (örn: `test-sayfasi`)
4. Editor'de brick'leri sürükle-bırak ile ekleyin:
   - **Title** - Başlık eklemek için
   - **Paragraph** - Metin eklemek için
   - **Button** - Buton eklemek için
   - **Hero Section** - Hero bölümü eklemek için
5. Kaydedin ve yayınlayın
6. Sayfanızı görüntüleyin: `http://localhost:3000/rb/test-sayfasi`

## 📦 Mevcut Brick'ler

### 1. Title (Başlık)
- **Boyutlar:** H1, H2, H3
- **Özelleştirme:** Boyut seçimi
- **Kullanım:** Başlıklar için

### 2. Paragraph (Paragraf)
- **Kullanım:** Metin içeriği için
- **Özellikleri:** Responsive, okunabilir

### 3. Button (Buton)
- **Stiller:** Default, Outline, Ghost
- **Boyutlar:** Small, Default, Large
- **Özellikleri:** Link href ayarlanabilir

### 4. Hero Section
- **Özellikleri:**
  - Başlık ve alt başlık
  - Birden fazla buton eklenebilir (max 3)
  - Arka plan rengi özelleştirilebilir
  - Responsive tasarım

## 🎯 Sonraki Adımlar

### Daha Fazla Brick Eklemek İçin:

1. `react-bricks/bricks/` klasörüne yeni brick component'i oluşturun
2. `react-bricks/bricks/index.ts` dosyasına ekleyin
3. Server'ı yeniden başlatın

### Örnek Brick Yapısı:
```tsx
import React from 'react'
import { types, Text } from 'react-bricks/rsc'

const MyBrick: types.Brick = () => {
  return (
    <div className="my-4">
      <Text propName="text" placeholder="Metin..." />
    </div>
  )
}

MyBrick.schema = {
  name: 'my-brick',
  label: 'My Brick',
  category: 'Content',
  getDefaultProps: () => ({}),
}

export default MyBrick
```

## 🔗 Faydalı Linkler

- **React Bricks Dashboard:** https://dashboard.reactbricks.com/
- **Documentation:** https://docs.reactbricks.com/
- **Brick Library:** https://docs.reactbricks.com/bricks/

## ⚠️ Önemli Notlar

- React Bricks sayfaları `/rb/[slug]` route'u altında render edilir
- Admin panel için giriş yapmanız gerekebilir (React Bricks hesabınızla)
- Her brick değişikliğinden sonra server'ı yeniden başlatın
- Production'da revalidation süresi: 1 saniye

## 🎉 Kurulum Tamamlandı!

Artık React Bricks kullanmaya hazırsınız! Admin paneline gidip ilk içeriğinizi oluşturmaya başlayabilirsiniz.

Sorularınız için: https://docs.reactbricks.com/

