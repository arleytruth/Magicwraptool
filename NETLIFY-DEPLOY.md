# 🚀 Netlify Deployment Rehberi

## ✅ Hazırlık Tamamlandı

Aşağıdaki hazırlıklar tamamlandı:
- [x] Test dosyaları temizlendi
- [x] netlify.toml güvenlik başlıkları eklendi
- [x] next.config.mjs Netlify için optimize edildi
- [x] .gitignore kontrol edildi

## 📝 Deployment Adımları

### 1. GitHub'a Push

```bash
git status
git add .
git commit -m "feat: Netlify deployment hazırlıkları tamamlandı

- Gereksiz test dosyaları temizlendi
- netlify.toml güvenlik başlıkları eklendi
- next.config.mjs standalone output eklendi
- Sanity CDN image hostname eklendi"
git push origin main
```

### 2. Netlify Hesabı Oluştur ve Bağlan

1. **https://app.netlify.com** adresine git
2. GitHub hesabınla giriş yap
3. **"Add new site"** butonuna tıkla
4. **"Import an existing project"** seç
5. **GitHub** seç ve yetki ver
6. **Magicwraptool** repository'sini seç

### 3. Build Settings Yapılandırması

Netlify otomatik olarak `netlify.toml` dosyasını algılayacak. Kontrol et:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** 20

### 4. Environment Variables (ÖNEMLİ!)

Netlify Dashboard → **Site settings** → **Environment variables** → **Add a variable**

Aşağıdaki tüm değişkenleri ekle:

#### Clerk Auth
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

#### Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (Netlify deploy'dan sonra güncellenecek)
```

#### FAL AI
```
FAL_KEY=xxxxx
```

#### Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

#### Sanity CMS
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxxxx
SANITY_WEBHOOK_SECRET=xxxxx
```

#### Convex (eğer kullanıyorsanız)
```
CONVEX_DEPLOYMENT=xxxxx
NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
```

#### Site URL
```
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app (deploy sonrası güncelle)
```

### 5. İlk Deployment

1. **"Deploy site"** butonuna tıkla
2. Build loglarını izle (5-10 dakika sürebilir)
3. Deploy tamamlandığında site URL'i kopyala: `https://random-name-xxxxx.netlify.app`

### 6. Stripe Production Webhook Kurulumu (KRİTİK!)

⚠️ **ÖNEMLİ:** Test ödemelerin çalışması için gerekli!

1. **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL:** `https://your-site.netlify.app/api/webhooks/stripe`
3. **Events to send:** Şunları seç:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. **"Add endpoint"** tıkla
5. **Signing secret** kopyala (whsec_xxxxx ile başlayan)
6. **Netlify Environment Variables**'a dön
7. `STRIPE_WEBHOOK_SECRET` değişkenini güncelle
8. **"Trigger deploy"** → **"Clear cache and deploy site"**

### 7. Domain Bağlama (Opsiyonel - İleriye Dönük)

1. Netlify Dashboard → **Domain settings** → **Add custom domain**
2. Domain adını gir (örn: magicwrap.com)
3. DNS ayarlarını yap (domain sağlayıcında):
   ```
   A Record: 75.2.60.5
   CNAME: your-site.netlify.app
   ```
4. SSL sertifikası otomatik aktif olacak (Let's Encrypt)
5. `NEXT_PUBLIC_SITE_URL` değişkenini güncelle

## 🧪 Deployment Sonrası Test Checklist

### Temel Fonksiyonellik
- [ ] Ana sayfa yükleniyor mu?
- [ ] Tüm sayfalar çalışıyor mu?
- [ ] Görseller yükleniyor mu?
- [ ] Login/Signup çalışıyor mu?

### AI Fonksiyonları
- [ ] Video generation çalışıyor mu?
- [ ] Cloudinary upload çalışıyor mu?
- [ ] FAL AI entegrasyonu çalışıyor mu?

### Ödeme Sistemi
- [ ] Test ödeme sayfası açılıyor mu?
- [ ] Stripe checkout çalışıyor mu?
- [ ] Webhook tetikleniyor mu?
  - Test için: Test kartı ile ödeme yap (4242 4242 4242 4242)
  - Stripe Dashboard → Events → Webhook çağrısını kontrol et

### Performans
- [ ] Lighthouse skoru: https://pagespeed.web.dev
  - Performance: >90
  - Accessibility: >90
  - SEO: >90
- [ ] Mobile responsive test
  - Chrome DevTools → Device Mode
  - iPhone, iPad, Desktop

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Yerel olarak test et
npm run build

# Hata varsa log'ları kontrol et
# Netlify Dashboard → Deploys → Failed deploy → Log
```

### Environment Variables Eksik
- Netlify Dashboard'da tüm değişkenleri kontrol et
- Spelling hataları olabilir (NEXT_PUBLIC_ prefix)
- Değişken ekledikten sonra **yeniden deploy** gerekli

### Stripe Webhook Çalışmıyor
1. Stripe Dashboard → Webhooks → Endpoint'i kontrol et
2. URL doğru mu? (https:// ile başlamalı)
3. Events seçilmiş mi?
4. Webhook secret Netlify'de doğru mu?
5. Test gönder: Stripe'da "Send test webhook"

### Image Loading Hatası
- next.config.mjs'de `remotePatterns` kontrol et
- Cloudinary, Sanity CDN hostname'leri ekli mi?

## 📊 Monitoring ve Analytics

### Google Analytics (Gelecekte)
1. Google Analytics hesabı oluştur
2. Measurement ID al
3. `NEXT_PUBLIC_GA_ID` environment variable ekle
4. `app/layout.tsx`'e Analytics script ekle

### Error Tracking (Sentry - Gelecekte)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring (UptimeRobot)
1. https://uptimerobot.com → Ücretsiz hesap
2. Monitor ekle: `https://your-site.netlify.app`
3. Email alert aktif et

## 🎯 Sonraki Adımlar

1. **Netlify'e deploy et** ve test et
2. **Arkadaşlarınla paylaş** ve feedback topla
3. **Ödeme sistemi:** Vergi numarası gelince Stripe Live Mode'a geç
4. **Domain bağla** (gelecekte)
5. **Analytics ve monitoring ekle** (gelecekte)

## 📞 Yardım

Sorun yaşarsan:
1. Netlify Dashboard → Deploys → Deploy log'larını kontrol et
2. Browser console'da hata var mı kontrol et
3. Stripe webhook log'larını kontrol et
4. Environment variables'ı tekrar kontrol et

---

**Başarılar! 🚀 Deployment'tan sonra site URL'ini paylaş!**

