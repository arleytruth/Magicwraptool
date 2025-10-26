"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, Zap, Download, Shield, Globe } from "lucide-react";
import { useLegacyNavigation } from "@/hooks/use-legacy-navigation";
import { useTranslation } from "react-i18next";

export function FeatureGrid() {
  const [, setLocation] = useLegacyNavigation();
  const { t } = useTranslation();

  const handleTryNow = () => {
    setLocation("/generate");
  };

  const features = [
    {
      icon: Layers,
      title: t('features.items.worksOnAnything.title'),
      description: t('features.items.worksOnAnything.description'),
    },
    {
      icon: Sparkles,
      title: t('features.items.anyPatternOrTexture.title'),
      description: t('features.items.anyPatternOrTexture.description'),
    },
    {
      icon: Zap,
      title: t('features.items.superFast.title'),
      description: t('features.items.superFast.description'),
    },
    {
      icon: Shield,
      title: t('features.items.looksCompletelyReal.title'),
      description: t('features.items.looksCompletelyReal.description'),
    },
    {
      icon: Download,
      title: t('features.items.easyToSave.title'),
      description: t('features.items.easyToSave.description'),
    },
    {
      icon: Globe,
      title: t('features.items.yourLanguage.title'),
      description: t('features.items.yourLanguage.description'),
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('features.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all" data-testid={`feature-card-${index}`}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleTryNow}
            className="text-lg px-10 h-14 font-semibold"
            data-testid="button-try-now-features"
          >
            {t('features.tryNowFree')}
          </Button>
        </div>
      </div>
    </section>
  );
}
