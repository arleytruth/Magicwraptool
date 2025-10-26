# 🔑 SSH ile GitHub Push Rehberi

## ⚠️ Token Güvenliği
İlk olarak, önceki token'ları iptal et:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Eski token'ları bul ve **"Delete"** veya **"Revoke"** tıkla

---

## ✅ SSH Key ile Push (Önerilen)

### Adım 1: SSH Public Key'ini GitHub'a Ekle

1. **GitHub.com** → sağ üst profil → **Settings**
2. Sol menüden **"SSH and GPG keys"**
3. **"New SSH key"** butonuna tıkla
4. **Title:** "MacBook Pro - Magicwraptool" (istediğin ismi verebilirsin)
5. **Key type:** Authentication Key (varsayılan)
6. **Key:** Aşağıdaki key'i kopyala-yapıştır:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC9eFlwAIKhZM18OstB+KmX7glFKA4J9cXIMDfHBDuNz52jiDIhRmy0cWmTuf+n9SnHQmT8cI6U8xBAon3XGoR7vkCJNv6h8mSV2pBGyLUeK33GyXFE0Go5V3KnlVpgw9VOo38ov9U08RTykcobDdN0tX79W+zDJyhyBgCMKwgJp8PiZUI3+MmjAlRtnFZO9G2tmBp/XFkoLJFoxkcPgxB4v0mTZUo8o+j6ne1Or2Sd8qxxLdv97G/hDDYJVSfKsYXjmcOP794b10LCKFxSjYAI7JbkNjeH6gPgMGa8ntCxJTrIfTljrcLEf6+nZvh6RbrYFF7eQRfOuI0OHg60uoMmYQHNycebd98IKRCM794aHZ0ZRWPSkUy51fCwKyLdgAlbAAbh2kaJdE6UGvGKQ89sTf4RuvL6P6vUHWhKM+kN/m4bRD6iF5O3gNl2CevQamnLDKX81UUZATeiEMeBNo+OcFlcXR08o658yJQhu0rFdesOA6x3S2U8EJBMX8MLotfXsLhXxWXrRXyURXHXUYEmJENA5FbW0+ZnDzYjoRZT8BoksIwnjXQI485rC/wPyLnckqTesNjQMroQT1PY/ePjhUI/uXhtYogRtvVqh/pGb2ub44OcmG13HG5e+ZKj3E/SCxvNrjM/PqzaLuLkLg8q1M7wm0GzreMLIxUUiBalkQ==
```

7. **"Add SSH key"** tıkla
8. GitHub şifreni gir (doğrulama için)

### Adım 2: Terminal'de Push Yap

```bash
cd /Users/omeristanbullu/wraptool/Magicwraptool

# Remote URL'i SSH'e çevir
git remote set-url origin git@github.com:arleytruth/Magicwraptool.git

# Push yap
git push origin main
```

İlk kez push yaparken "Are you sure you want to continue connecting?" sorusu gelirse **"yes"** yaz.

---

## 🎯 Push Başarılı mı?

Push sonrası kontrol et:
- https://github.com/arleytruth/Magicwraptool
- Son commit'in görünüyor mu?

✅ Başarılıysa → **Netlify deployment'a geç!**

---

## 🆘 Sorun Giderme

### "Permission denied (publickey)" hatası
```bash
# SSH bağlantısını test et
ssh -T git@github.com

# Başarılı mesaj: "Hi arleytruth! You've successfully authenticated..."
```

Eğer hata alıyorsan:
- SSH key'i GitHub'a doğru ekledin mi?
- Key'in tamamını kopyaladın mı? (ssh-rsa ile başlayıp son karaktere kadar)

---

**Başarılar! 🚀**

