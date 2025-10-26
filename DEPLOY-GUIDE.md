# 🚀 Netlify Deployment Guide

## ✅ GÜVENLİK DURUMU
- ✅ Tüm eski secret'lar iptal edildi
- ✅ Git repository temiz (secret yok)
- ✅ .env.local ignore edilmiş
- ✅ Kaynak kod güvenli

---

## 📋 PHASE 1: Netlify Site Oluştur (5 dakika)

### 1.1 Netlify'ye Git
- URL: https://app.netlify.com
- Sign in (GitHub ile)

### 1.2 New Site Oluştur
1. **"Add new site"** → **"Import an existing project"**
2. **"Deploy with GitHub"**
3. Repository seç: **`arleytruth/Magicwraptool`**
4. Branch seç: **`main`**

### 1.3 Build Settings
```
Build command: npm run build
Publish directory: .next
```

### 1.4 İLK DEPLOY'U BAŞLAT
- **"Deploy site"** butonuna tıkla
- ⚠️ Build BAŞARISIZ olacak (normal!)
- Sebep: Environment variables henüz yok

---

## 📋 PHASE 2: YENİ Secret'ları Oluştur (30 dakika)

### 2.1 Clerk (Authentication)
1. Dashboard: https://dashboard.clerk.com
2. **Settings → API Keys**
3. Not al:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
4. **Webhooks → Create endpoint**
   - URL: `https://YOUR-SITE.netlify.app/api/clerk/webhooks`
   - Events: `user.*`
   - Not al:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### 2.2 Supabase (Database)
1. Dashboard: https://supabase.com/dashboard
2. **Project Settings → API**
3. Not al:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

### 2.3 Stripe (Payment)
1. Dashboard: https://dashboard.stripe.com/test/apikeys
2. **Create new keys**
3. Not al:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. **Webhooks → Add endpoint** (Deployment sonrası)
   - URL: `https://YOUR-SITE.netlify.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`

### 2.4 Cloudinary (Image Storage)
1. Dashboard: https://cloudinary.com/console
2. **Settings → Security → Access Keys**
3. **Generate New API Key**
4. Not al:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 2.5 FAL.AI (Video Generation)
1. Dashboard: https://fal.ai/dashboard/keys
2. **Create new key**
3. Not al:
   ```
   FAL_API_KEY=your_fal_key
   ```

### 2.6 Convex (Real-time Database)
1. Dashboard: https://dashboard.convex.dev
2. **Project Settings → Deploy Keys**
3. Not al:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
   ```

---

## 📋 PHASE 3: Netlify Environment Variables Ekle (15 dakika)

### 3.1 Netlify Dashboard'a Git
- Site seç → **Site settings → Environment variables**

### 3.2 Her Bir Variable'ı Ekle

**"Add a variable"** butonuna tıkla ve şunları ekle:

#### Public Variables (Client-side)
```bash
NEXT_PUBLIC_SITE_URL=https://YOUR-SITE-NAME.netlify.app
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SANITY_PROJECT_ID=r2yabxzn
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-24
```

#### Server Variables (Server-only)
```bash
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (webhook oluşturduktan sonra)
FAL_API_KEY=your_fal_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**ÖNEMLI:**
- Her variable için **"All scopes"** seç (Production + Previews + Branches)
- **Save** butonuna basıldığından emin ol

---

## 📋 PHASE 4: Yeniden Deploy (5 dakika)

### 4.1 Clean Deploy
1. Netlify Dashboard → **Deploys**
2. **"Trigger deploy"** → **"Clear cache and deploy site"**

### 4.2 Build Log'u İzle
```
✓ Installing dependencies
✓ npm run build
✓ Compiled successfully!
✓ Site is live! 🎉
```

### 4.3 Site URL'sini Al
```
https://YOUR-SITE-NAME.netlify.app
```

---

## 📋 PHASE 5: Webhook'ları Tamamla (10 dakika)

### 5.1 Clerk Webhook
1. Clerk Dashboard → **Webhooks**
2. **Edit endpoint URL:**
   ```
   https://YOUR-SITE-NAME.netlify.app/api/clerk/webhooks
   ```
3. **Save**

### 5.2 Stripe Webhook
1. Stripe Dashboard → **Webhooks → Add endpoint**
2. **Endpoint URL:**
   ```
   https://YOUR-SITE-NAME.netlify.app/api/webhooks/stripe
   ```
3. **Events to send:**
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `charge.failed`
4. **Add endpoint**
5. **Signing secret** kopyala
6. Netlify'de `STRIPE_WEBHOOK_SECRET` variable'ı ekle/güncelle
7. Netlify'de **tekrar deploy** tetikle

---

## 📋 PHASE 6: Test Et (15 dakika)

### 6.1 Authentication Test
- [ ] Site aç: `https://YOUR-SITE-NAME.netlify.app`
- [ ] **Sign In** butonuna tıkla
- [ ] Clerk login sayfası açılıyor ✅
- [ ] Email/password ile kayıt ol ✅
- [ ] Giriş yapabiliyorum ✅

### 6.2 Database Test
- [ ] **Dashboard** sayfasını aç
- [ ] Kullanıcı bilgileri görünüyor ✅
- [ ] Credits görünüyor ✅
- [ ] Supabase Dashboard'da user kaydı var ✅

### 6.3 Dil Değiştirici Test
- [ ] Sağ üst köşede dil seçici görünüyor ✅
- [ ] 🇬🇧 English → 🇩🇪 Deutsch değiştir ✅
- [ ] 🇹🇷 Türkçe → 🇪🇸 Español değiştir ✅
- [ ] Çeviriler çalışıyor ✅

### 6.4 Payment Test (Opsiyonel - Vergi numarası aldıktan sonra)
- [ ] **Pricing** sayfasını aç
- [ ] Paket seç → Checkout
- [ ] Stripe checkout açılıyor ✅
- [ ] Test card: `4242 4242 4242 4242`
- [ ] Ödeme başarılı ✅
- [ ] Credits hesaba eklendi ✅

### 6.5 Video Generation Test (Opsiyonel)
- [ ] Video generation sayfasını aç
- [ ] Prompt gir → Generate
- [ ] FAL.AI API çalışıyor ✅
- [ ] Video oluşturuldu ✅

---

## 🎯 BAŞARI KRİTERLERİ

- ✅ Netlify site live
- ✅ Build başarılı (no errors)
- ✅ Authentication çalışıyor (Clerk)
- ✅ Database bağlantısı çalışıyor (Supabase)
- ✅ Dil değiştirici çalışıyor (EN, DE, TR, ES)
- ✅ UI tamamen görünüyor
- ✅ 404 hatası yok
- ✅ Console'da critical error yok

---

## ⚠️ ÖNEMLİ NOTLAR

### Güvenlik
1. ✅ Tüm secret'lar YENİ oluşturuldu
2. ✅ Eski secret'lar iptal edildi
3. ✅ .env.local ASLA commit edilmedi
4. ✅ Environment variables sadece Netlify'de

### Deployment
1. İlk deployment başarısız olabilir (environment variables eksikse)
2. Variables eklendikten sonra **tekrar deploy** et
3. Webhook URL'leri **deployment sonrası** güncelle

### Password Manager
Tüm yeni secret'ları bir **password manager'a kaydet**:
- 1Password
- Bitwarden
- LastPass
- vb.

---

## 📞 Yardım

### Netlify Build Hatası
- Log'ları incele: Netlify Dashboard → Deploys → Build log
- Eksik environment variable var mı kontrol et

### Clerk Authentication Hatası
- Domain settings kontrol et: Clerk Dashboard → Settings
- Webhook URL doğru mu kontrol et

### Supabase Connection Hatası
- API keys doğru mu kontrol et
- RLS policies aktif mi kontrol et

### Stripe Payment Hatası
- Webhook secret doğru mu kontrol et
- Test mode'da olduğundan emin ol

---

**Hazırlayan:** AI Assistant
**Tarih:** 2025-10-26
**Durum:** ✅ Güvenlik onaylandı - Deploy başlatılabilir!

