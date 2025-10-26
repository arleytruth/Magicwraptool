"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();

  const handleTryNow = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: t('howItWorks.steps.uploadObject.title'),
      description: t('howItWorks.steps.uploadObject.description'),
    },
    {
      number: 2,
      icon: ImageIcon,
      title: t('howItWorks.steps.uploadDesign.title'),
      description: t('howItWorks.steps.uploadDesign.description'),
    },
    {
      number: 3,
      icon: Download,
      title: t('howItWorks.steps.getResult.title'),
      description: t('howItWorks.steps.getResult.description'),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('howItWorks.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="relative" data-testid={`step-${step.number}`}>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                )}
                <Card className="relative z-10 h-full hover-elevate transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <step.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {step.number}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-6 text-lg">{t('howItWorks.bottomText')}</p>
          <Button
            size="lg"
            onClick={handleTryNow}
            className="text-lg px-10 h-14 font-semibold"
            data-testid="button-try-now-how-it-works"
          >
            {t('howItWorks.tryNowFree')}
          </Button>
        </div>
      </div>
    </section>
  );
}
