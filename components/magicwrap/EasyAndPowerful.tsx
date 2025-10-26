"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLegacyNavigation } from "@/hooks/use-legacy-navigation";

export function EasyAndPowerful() {
  const [, setLocation] = useLegacyNavigation();
  const { t } = useTranslation();

  const handleTryNow = () => {
    setLocation("/generate");
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
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* It's Really This Easy Section - Blue Theme */}
        <div
          id="how-it-works"
          className="mb-20 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl p-8 -mx-8 scroll-mt-28 lg:scroll-mt-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900 dark:text-blue-100">{t('howItWorks.title')}</h2>
            <p className="text-xl text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={step.number} className="relative" data-testid={`step-${step.number}`}>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent -translate-x-1/2 z-0" />
                  )}
                  <Card className="relative z-10 h-full hover-elevate transition-all border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-blue-900/20 shadow-blue-100/50 dark:shadow-blue-900/20">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="h-16 w-16 rounded-full bg-blue-100/80 dark:bg-blue-900/50 flex items-center justify-center">
                            <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                            {step.number}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">{step.title}</h3>
                        <p className="text-blue-700/80 dark:text-blue-300/90 leading-relaxed">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-blue-700/80 dark:text-blue-300/90 mb-6 text-lg">{t('howItWorks.bottomText')}</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleTryNow}
            className="text-lg px-10 h-14 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            data-testid="button-try-now-how-it-works"
          >
            {t('howItWorks.tryNowFree')}
          </Button>
        </div>
      </div>
    </section>
  );
}