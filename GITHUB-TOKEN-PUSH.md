# 🔐 GitHub Token ile Push Rehberi

## Adım 1: Token ile Push Yap

Terminal'de şu komutu çalıştır:

```bash
cd /Users/omeristanbullu/wraptool/Magicwraptool

# Token'ı kullanarak push yap
git push https://YOUR_TOKEN@github.com/arleytruth/Magicwraptool.git main
```

**YOUR_TOKEN** kısmına GitHub'dan aldığın Personal Access Token'ı yapıştır.

---

## VEYA: Remote URL'i Güncelle (Kalıcı Çözüm)

Eğer her seferinde token yazmak istemiyorsan:

```bash
cd /Users/omeristanbullu/wraptool/Magicwraptool

# Remote URL'i token ile güncelle
git remote set-url origin https://YOUR_TOKEN@github.com/arleytruth/Magicwraptool.git

# Artık normal push yapabilirsin
git push origin main
```

---

## GitHub Token Nasıl Oluşturulur? (Referans)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Note: "Magicwraptool Deploy"
4. Expiration: 90 days veya No expiration
5. Scopes: **repo** (tüm repo yetkilerini seç)
6. "Generate token"
7. Token'ı kopyala (bir daha göremezsin!)

---

## ⚠️ Güvenlik Notları

- Token'ı kimseyle paylaşma
- Token'ı `.env` dosyasına veya koda yazma
- Token'ı güvenli bir yerde sakla (1Password, LastPass, vs.)
- Token süresi dolarsa yeni token oluştur

---

## 🎯 Push Sonrası

Push başarılı olduktan sonra:

1. GitHub repository'ye git: https://github.com/arleytruth/Magicwraptool
2. Commit'lerin yüklendiğini kontrol et
3. Netlify deployment'a geç (NETLIFY-DEPLOY.md)

---

**Başarılar! 🚀**

