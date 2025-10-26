"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, Home, RefreshCw, HelpCircle, Shield, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-lg mx-auto">
        <Card className="p-6 md:p-8 text-center space-y-6 shadow-xl border-border bg-card/50 backdrop-blur-sm">
          {/* Cancel Icon with Animation */}
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-muted/40 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-muted to-muted/60 rounded-full p-6 shadow-lg border border-border">
              <XCircle className="h-16 w-16 text-muted-foreground animate-in zoom-in-50 duration-700" />
            </div>
          </div>

          {/* Cancel Message */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
              <Shield className="h-3.5 w-3.5" />
              <span>İşlem İptal Edildi</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Ödeme Tamamlanmadı
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Ödeme işleminiz iptal edildi veya tamamlanamadı. Hesabınızdan herhangi bir ücret tahsil edilmedi.
            </p>
          </div>

          {/* Possible Reasons */}
          <Card className="p-4 bg-muted/30 border-border/50 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">Olası Sebepler:</p>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• Ödeme işlemini iptal ettiniz</li>
                  <li>• Kart bilgilerinde hata oluştu</li>
                  <li>• Oturum zaman aşımına uğradı</li>
                  <li>• Banka tarafından işlem reddedildi</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 pt-2">
            <Button
              size="lg"
              onClick={() => router.push("/#pricing")}
              className="w-full md:text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group"
            >
              <CreditCard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Tekrar Dene</span>
            </Button>
            
            <Button
              size="lg"
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full md:text-base font-semibold hover:bg-primary/10 group"
            >
              <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Ana Sayfaya Dön</span>
            </Button>
          </div>

          {/* Additional Info & Support */}
          <div className="pt-4 border-t border-border/50 space-y-3">
            <p className="text-xs text-muted-foreground">
              Sorun devam ediyorsa lütfen destek ekibimizle iletişime geçin.
            </p>
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="text-xs hover:text-primary"
            >
              <Link href="/support">
                <HelpCircle className="mr-2 h-3.5 w-3.5" />
                Destek Al
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
