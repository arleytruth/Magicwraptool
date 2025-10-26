"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ScrollText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Kullanım Koşulları</h1>
          <p className="text-muted-foreground">
            Son güncellenme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="pt-6 space-y-8 text-foreground">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Genel Koşullar</h2>
              <p className="text-muted-foreground leading-relaxed">
                Magic Wrapper hizmetini kullanarak bu kullanım koşullarını kabul etmiş sayılırsınız. 
                Hizmetimizi kullanmadan önce lütfen bu koşulları dikkatlice okuyunuz.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Hizmet Kullanımı</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Magic Wrapper, yapay zeka destekli görsel kaplama hizmeti sunmaktadır. 
                  Kullanıcılar, yükledikleri görsellerin telif haklarına sahip olduklarını veya 
                  kullanım iznine sahip olduklarını taahhüt ederler.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Yalnızca yasal ve meşru amaçlarla kullanılabilir</li>
                  <li>Telif hakkı ihlali yapılamaz</li>
                  <li>Başkalarının haklarına tecavüz edilemez</li>
                  <li>Yasadışı içerik üretilemez</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Kredi Sistemi ve Ödemeler</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Hizmetimiz kredi sistemi ile çalışmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Her görsel üretimi belirli miktarda kredi tüketir</li>
                  <li>Krediler ön ödemeli olarak satın alınır</li>
                  <li>Satın alınan krediler iade edilemez</li>
                  <li>Kullanılmayan kredilerin son kullanma tarihi yoktur</li>
                  <li>Ödemeler güvenli ödeme altyapısı ile işlenir</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Fikri Mülkiyet Hakları</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hizmetimiz aracılığıyla oluşturulan görsellerin telif hakları kullanıcıya aittir. 
                Ancak, kullanıcılar yükledikleri orijinal görsellerin telif haklarından sorumludur. 
                Magic Wrapper platformu ve teknolojisi üzerindeki tüm haklar şirketimize aittir.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Gizlilik ve Veri Güvenliği</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kullanıcı verilerinin gizliliği bizim için önemlidir. Yüklenen görseller yalnızca 
                hizmetin sağlanması amacıyla işlenir ve belirli bir süre sonra sistemlerimizden silinir. 
                Kişisel verileriniz üçüncü taraflarla paylaşılmaz.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Hizmet Değişiklikleri</h2>
              <p className="text-muted-foreground leading-relaxed">
                Magic Wrapper, önceden bildirimde bulunmaksızın hizmette değişiklik yapma, 
                geliştirme veya güncelleme yapma hakkını saklı tutar. Önemli değişiklikler 
                kullanıcılara bildirilecektir.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Sorumluluk Reddi</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hizmetimiz "olduğu gibi" sunulmaktadır. Üretilen görsellerin kullanımından 
                doğabilecek sonuçlardan kullanıcı sorumludur. Magic Wrapper, hizmetin kesintisiz 
                veya hatasız çalışacağını garanti etmez.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Hesap Güvenliği</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  Kullanıcılar hesap güvenliğinden sorumludur:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hesap bilgilerinizi güvende tutun</li>
                  <li>Şifrenizi kimseyle paylaşmayın</li>
                  <li>Yetkisiz erişim şüphesi durumunda derhal bize bildirin</li>
                  <li>Hesabınızda gerçekleştirilen tüm işlemlerden siz sorumlusunuz</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Hizmet Durdurma</h2>
              <p className="text-muted-foreground leading-relaxed">
                Magic Wrapper, kullanım koşullarını ihlal eden kullanıcıların hesaplarını 
                uyarı vermeksizin askıya alma veya kapatma hakkını saklı tutar. Bu durumda 
                kullanılmayan krediler iade edilmeyecektir.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. İletişim</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kullanım koşulları ile ilgili sorularınız için destek sayfamız üzerinden 
                bizimle iletişime geçebilirsiniz.
              </p>
            </section>

            {/* Footer Note */}
            <section className="pt-6 border-t">
              <p className="text-sm text-muted-foreground italic">
                Bu kullanım koşulları herhangi bir zamanda güncellenebilir. Önemli değişiklikler 
                kayıtlı e-posta adresinize bildirilecektir. Hizmeti kullanmaya devam ederek 
                güncel koşulları kabul etmiş sayılırsınız.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

