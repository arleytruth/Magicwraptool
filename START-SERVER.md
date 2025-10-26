# 🚀 Server Başlatma Rehberi

## Şu anda yapman gereken:

Terminal'de bu komutları çalıştır:

```bash
cd /Users/omeristanbullu/wraptool/Magicwraptool

# Portları temizle
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Cache'i temizle
rm -rf .next

# Dev server'ı başlat
npm run dev
```

Server başladığında tarayıcıda aç:
**http://localhost:3000**

---

## Eğer Hata Alırsan:

### 1. "Port already in use" Hatası
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### 2. Build Hatası
```bash
rm -rf .next node_modules/.cache
npm run dev
```

### 3. "Module not found" Hatası
```bash
npm install
npm run dev
```

---

## Ne Görmelisin:

✅ **Ana sayfa components:**
- Hero Section (Başlık ve açıklama)
- Feature Grid (Özellikler)
- How It Works (Nasıl çalışır)
- Before/After Showcase
- Pricing Section
- Upload Section

❌ **GÖRMEMEN GEREKEN:**
- React Bricks
- Admin paneli
- CMS editör

---

Hataları bana gönder, düzeltelim!

