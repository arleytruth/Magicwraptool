# 🌍 MagicWrap - Profesyonel Çeviri Talimatları

## 📋 Proje Hakkında
MagicWrap, AI destekli bir görsel kaplama (wrapping) SaaS platformudur. Kullanıcılar araç, mobilya gibi nesnelerin fotoğraflarını yükleyerek farklı malzeme ve desenlerle sanal kaplama yapabilirler.

## 🎯 Çeviri Hedefi
Tüm site içeriğini **Türkçe**'den aşağıdaki dillere çevirin:
- 🇬🇧 **İngilizce (English)**
- 🇩🇪 **Almanca (Deutsch)**
- 🇪🇸 **İspanyolca (Español)**
- 🇫🇷 **Fransızca (Français)**

## 📁 Çevrilecek Dosyalar

### Ana Çeviri Dosyası (Kaynak)
```
locales/tr.json
```
Bu dosya **TÜM site içeriğini** içerir:
- Menü başlıkları
- Buton metinleri
- Form etiketleri
- Hata mesajları
- Başarı mesajları
- Özellik açıklamaları
- Fiyatlandırma metinleri
- FAQ soruları
- Uyarı mesajları

### Hedef Dosyalar (Güncellenecek)
```
locales/en.json
locales/de.json
locales/es.json
locales/fr.json
```

## 🎨 Çeviri Kuralları

### 1. JSON Yapısını Koruma (KRİTİK ⚠️)
- JSON anahtarlarını (key) **DEĞİŞTİRMEYİN**
- Sadece değerleri (value) çevirin
- JSON formatını bozmayın (virgül, süslü parantez, tırnak işaretleri)
- Escape karakterlerini koruyun (`\n`, `\"`, vb.)

**✅ DOĞRU:**
```json
{
  "hero.title": "Transform Your Objects with AI Magic"
}
```

**❌ YANLIŞ:**
```json
{
  "hero.baslik": "Transform Your Objects with AI Magic"  // Key değişti!
}
```

### 2. Teknik Terimler
Aşağıdaki terimler için tutarlı çeviriler kullanın:

| Türkçe | English | Deutsch | Español | Français |
|--------|---------|---------|---------|----------|
| Kaplama | Wrapping | Folierung | Vinilado | Covering |
| Kredi | Credit | Guthaben | Crédito | Crédit |
| Yapay Zeka | AI / Artificial Intelligence | KI / Künstliche Intelligenz | IA / Inteligencia Artificial | IA / Intelligence Artificielle |
| Görsel | Image / Visual | Bild / Visuell | Imagen / Visual | Image / Visuel |
| Malzeme | Material | Material | Material | Matériau |
| Desen | Pattern / Design | Muster / Design | Patrón / Diseño | Motif / Design |
| Yükle | Upload | Hochladen | Subir | Télécharger |
| Oluştur | Generate / Create | Generieren / Erstellen | Generar / Crear | Générer / Créer |
| İndir | Download | Herunterladen | Descargar | Télécharger |
| Önizleme | Preview | Vorschau | Vista Previa | Aperçu |

### 3. Marka ve Ürün İsimleri
Aşağıdaki isimler **ASLA ÇEVRİLMEMELİ**:
- ✅ MagicWrap (her zaman aynı)
- ✅ WrapGPT (varsa, değiştirmeyin)

### 4. UI/UX Metinleri
- Buton metinleri **kısa ve net** olmalı
- Menü başlıkları **1-2 kelime** ile sınırlı kalmalı
- Form etiketleri **açıklayıcı** olmalı
- Hata mesajları **nezaket ve profesyonellik** içermeli

### 5. Tonlama ve Üslup
- ✨ **Profesyonel ama samimi** bir dil kullanın
- 🎯 **Kullanıcı odaklı** ifadeler tercih edin
- 💼 **B2C (işletmeden tüketiciye)** tonunda yazın
- 🚀 **Teknoloji ve inovasyon** vurgusu yapın

### 6. Özel Durumlar

#### A) Değişken/Placeholder'lar
Metinlerde `{{variable}}` veya `{count}` gibi değişkenler varsa **DEĞİŞTİRMEYİN**:

```json
{
  "credits.remaining": "Kalan {{count}} kredi"
}
```

**Çevirileri:**
- 🇬🇧 `"{{count}} credits remaining"`
- 🇩🇪 `"{{count}} Guthaben verbleibend"`
- 🇪🇸 `"{{count}} créditos restantes"`
- 🇫🇷 `"{{count}} crédits restants"`

#### B) HTML/Markdown İçeriği
HTML veya Markdown içeren metinlerde **tag'leri koruyun**:

```json
{
  "info": "Daha fazla bilgi için <a href='/help'>buraya tıklayın</a>"
}
```

**✅ DOĞRU:**
```json
{
  "info": "For more information, <a href='/help'>click here</a>"
}
```

#### C) Çoğul Formları
Bazı dillerde çoğul kuralları farklıdır. İngilizce için dikkat edin:
- `credit` / `credits`
- `image` / `images`
- `day` / `days`

#### D) Resmi/Samimi Hitap
- 🇹🇷 Türkçe: "Sen" dilini kullanıyoruz (samimi)
- 🇬🇧 İngilizce: "You" zaten nötr
- 🇩🇪 Almanca: **"Du"** (samimi) - "Sie" değil
- 🇪🇸 İspanyolca: **"Tú"** (samimi) - "Usted" değil
- 🇫🇷 Fransızca: **"Tu"** (samimi) - "Vous" değil

### 7. SEO ve Pazarlama Metinleri
Aşağıdaki alanlarda özellikle dikkatli olun:
- Meta açıklamaları (karakter limiti: 155-160)
- Sayfa başlıkları (karakter limiti: 50-60)
- CTA (Call-to-Action) butonları - eyleme geçirici olmalı
- Özellik başlıkları - fayda vurgulayan

## 📝 Çeviri Süreci

### Adım 1: Kaynak Dosyayı İnceleyin
```bash
locales/tr.json
```
Bu dosyayı baştan sona okuyun ve içeriği anlayın.

### Adım 2: Her Dil İçin Çeviri Yapın
Her JSON dosyasını ayrı ayrı güncelleyin:

1. **İngilizce (en.json)**
   - Ana hedef pazar
   - En geniş kitleye hitap eder
   - Global İngilizce (US/UK karışımı değil, evrensel)

2. **Almanca (de.json)**
   - Resmi ama sıcak
   - Teknik detaylara önem veren kitle
   - Uzun kelimeler yerine net ifadeler

3. **İspanyolca (es.json)**
   - Samimi ve sıcak ton
   - Latin Amerika ve İspanya'ya uygun (universal Spanish)
   - Enerjik ve pozitif

4. **Fransızca (fr.json)**
   - Zarif ve sofistike
   - Detaylı açıklamalara değer veren kitle
   - Profesyonel ama yakın

### Adım 3: Kalite Kontrol

Her çeviriden sonra kontrol edin:
- [ ] JSON formatı doğru mu?
- [ ] Tüm anahtarlar (keys) aynı mı?
- [ ] Değişkenler korunmuş mu?
- [ ] Teknik terimler tutarlı mı?
- [ ] Uzunluk UI'a uygun mu? (çok uzun metinler sığmayabilir)
- [ ] Tonlama hedef kitleye uygun mu?

## 🧪 Test Senaryoları

Çeviri sonrası bu senaryoları hayal edin:

1. **Yeni Kullanıcı Deneyimi**
   - Ana sayfa başlıkları anlaşılıyor mu?
   - CTA butonları cazip mi?
   - Nasıl çalışır bölümü net mi?

2. **Kayıt ve Giriş**
   - Form etiketleri açık mı?
   - Hata mesajları yardımcı mı?
   - Başarı mesajları motive edici mi?

3. **Görsel Oluşturma**
   - Yükleme talimatları net mi?
   - İşlem durumu mesajları bilgilendirici mi?
   - Sonuç ekranı tatmin edici mi?

4. **Fiyatlandırma ve Ödeme**
   - Paket açıklamaları anlaşılır mı?
   - Fiyatlar net belirtilmiş mi?
   - Ödeme süreci güven veriyor mu?

## 🎁 Ek Notlar

### Kültürel Adaptasyon
Bazı ifadeleri doğrudan çevirmek yerine **kültürel olarak uygun** versiyonlarını kullanın:

**Örnek:**
- 🇹🇷 "Ücretsiz başla" 
- 🇬🇧 "Get started for free" / "Start free trial"
- 🇩🇪 "Kostenlos starten" / "Jetzt gratis testen"
- 🇪🇸 "Empieza gratis" / "Prueba gratuita"
- 🇫🇷 "Commencer gratuitement" / "Essai gratuit"

### Emoji Kullanımı
Türkçe metinlerde emoji varsa:
- 🇬🇧 İngilizce: Koruyabilirsiniz (emoji-friendly)
- 🇩🇪 Almanca: Dikkatli kullanın (daha formal)
- 🇪🇸 İspanyolca: Koruyabilirsiniz (emoji-friendly)
- 🇫🇷 Fransızca: Dikkatli kullanın (zarif kalsın)

### Sayısal Formatlar
Sayı, para birimi ve tarih formatlarını **metinlerden ayırın**:
- Para birimi sembolleri: € $ £ (değiştirmeyin)
- Sayı ayracı: virgül/nokta farklılıklarına dikkat
- Tarih: formatı metinlerde belirtmeyin (kod tarafında hallolur)

## ✅ Son Kontrol Listesi

Çeviriyi teslim etmeden önce:

- [ ] Tüm 4 dil dosyası (`en.json`, `de.json`, `es.json`, `fr.json`) güncellenmiş mi?
- [ ] Her dosya aynı JSON yapısına sahip mi?
- [ ] Teknik terimler tutarlı mı?
- [ ] Değişkenler korunmuş mu?
- [ ] JSON formatı hatasız mı? (JSON validator ile test edin)
- [ ] Özel karakterler doğru escape edilmiş mi?
- [ ] Marka isimleri (MagicWrap) değişmemiş mi?
- [ ] UI metinleri kısa ve öz mü?
- [ ] Tonlama her dilde tutarlı mı?
- [ ] Kültürel adaptasyonlar yapılmış mı?

## 🚀 Teslim Formatı

Lütfen aşağıdaki dosyaları tam ve hatasız şekilde teslim edin:

```
locales/
  ├── en.json  ✅
  ├── de.json  ✅
  ├── es.json  ✅
  └── fr.json  ✅
```

Her dosya:
- UTF-8 encoding
- 2 space indentation
- Valid JSON format
- Tüm anahtarlar mevcut

---

## 💡 İpucu

Çeviri yaparken kendinize şu soruyu sorun:
> "Bu metni hedef dilde ana dili olarak konuşan biri okuduğunda, doğal ve profesyonel mi görünüyor?"

Eğer cevap "evet" ise, doğru yoldasınız! ✨

---

**Son Not:** Bu çeviri, MagicWrap'in global başarısı için kritik öneme sahiptir. Kaliteli ve tutarlı çeviriler, uluslararası kullanıcılarımızın deneyimini doğrudan etkiler. Detaylara dikkat ettiğiniz için teşekkürler! 🙏

