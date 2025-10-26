"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Palette, Car } from "lucide-react";
import { useLegacyNavigation } from "@/hooks/use-legacy-navigation";

const audiences = [
  {
    icon: Palette,
    title: "Reklam Ajansları",
    description: "Markanızın her yüzeyde nasıl duracağını baskıya geçmeden gösterin. Saatler değil saniyeler içinde şık mockuplar hazırlayın.",
    benefits: [
      "Hızlı müşteri sunumları",
      "Birden fazla tasarımı anında dene",
      "Gerçeğe en yakın sonuçları göster",
    ],
  },
  {
    icon: Building2,
    title: "Mimarlık Ofisleri",
    description: "Müşterilerinize farklı kaplama ve malzemeleri anında görselleştirin. Ahşap, taş, cam... hepsi için hazır örnekler sunun.",
    benefits: [
      "Malzeme seçeneklerini yan yana göster",
      "Tasarım varyasyonlarını kolayca aktar",
      "Projeleri daha hızlı kazan",
    ],
  },
  {
    icon: Car,
    title: "Kaplama Atölyeleri",
    description: "Müşterilerinize kaplamanın araçlarında nasıl duracağını işe başlamadan gösterin. Güven ver, daha fazla satış kapat.",
    benefits: [
      "Her wrap tasarımını önceden göster",
      "Müşteri tereddütünü azalt",
      "Dönüşüm oranlarını artır",
    ],
  },
];

export function WhoIsThisFor() {
  const [, setLocation] = useLegacyNavigation();
  
  const handleTryNow = () => {
    setLocation("/generate");
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">İşiniz için biçilmiş kaftan</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            İster müşterileriniz için ister kendi projeleriniz için çalışın, Magic Wrapper size zaman ve maliyet kazandırır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {audiences.map((audience, index) => (
            <Card key={index} className="hover-elevate transition-all" data-testid={`audience-card-${index}`}>
              <CardHeader>
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <audience.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
                <ul className="space-y-2">
                  {audience.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleTryNow}
            className="text-lg px-10 h-14 font-semibold"
            data-testid="button-try-now-who-is-this-for"
          >
            Hemen ücretsiz dene
          </Button>
        </div>
      </div>
    </section>
  );
}
