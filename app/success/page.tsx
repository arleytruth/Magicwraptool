"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);
  const [progress, setProgress] = useState(0);

  // Separate effect for navigation to avoid render-time state updates
  useEffect(() => {
    if (countdown === 0) {
      const timer = setTimeout(() => {
        router.push("/generate");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [countdown, router]);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.25;
      });
    }, 100);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleNavigateNow = () => {
    router.push("/generate");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-lg mx-auto">
        <Card className="p-6 md:p-8 text-center space-y-6 shadow-xl border-primary/20 bg-card/50 backdrop-blur-sm">
          {/* Success Icon with Animation */}
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-full p-6 shadow-lg">
              <CheckCircle2 className="h-16 w-16 text-primary-foreground animate-in zoom-in-50 duration-700" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>İşlem Tamamlandı</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Ödemeniz Başarıyla Tamamlandı
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Krediniz hesabınıza yüklendi. Artık projelerinizi oluşturmaya başlayabilirsiniz.
            </p>
          </div>

          {/* Auto-redirect Progress */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 pt-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {countdown > 0 
                  ? `${countdown} saniye içinde yönlendirileceksiniz` 
                  : "Yönlendiriliyor..."}
              </p>
              <Progress value={progress} className="h-2" />
            </div>

            <Button
              size="lg"
              onClick={handleNavigateNow}
              className="w-full md:text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group"
            >
              <span>Hemen Başla</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Sorun yaşıyorsanız destek ekibimiz yardımcı olabilir.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
