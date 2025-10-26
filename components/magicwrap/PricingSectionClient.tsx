"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles, ArrowRight, Zap, Loader2 } from "lucide-react";
import { SiPaypal, SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import { useLegacyNavigation } from "@/hooks/use-legacy-navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useToast } from "@/hooks/use-toast";

interface PricingPackage {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  credits: number;
  priceTry: number;
  originalPriceTry: number;
  priceEur?: number;
  originalPriceEur?: number;
  currency: string;
  featureHighlights: string[];
  isFeatured: boolean;
  badgeText: string | null;
  ctaLabel: string | null;
  sortOrder: number;
}

function formatCurrency(amount: number, currency: string) {
  const formatted = currency === "TRY" && amount % 1 === 0 
    ? amount.toString() 
    : amount.toFixed(2);
  
  if (currency === "EUR") {
    return `€${formatted}`;
  } else if (currency === "TRY") {
    return `₺${formatted}`;
  } else if (currency === "USD") {
    return `$${formatted}`;
  }
  
  return `${formatted} ${currency}`;
}

export function PricingSectionClient() {
  console.log("[PricingSectionClient] Component mount edildi!");
  
  const [, setLocation] = useLegacyNavigation();
  const { t } = useTranslation();
  const { isAuthenticated, isEmailVerified } = useAuth();
  const { openAuthModal } = useAuthModal();
  const { toast } = useToast();
  const [purchasingPackageId, setPurchasingPackageId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<{ success: boolean; packages: PricingPackage[] }>({
    queryKey: ["/api/credit-packages"],
    queryFn: async () => {
      console.log("[PricingSectionClient] API çağrısı başlatılıyor...");
      const response = await fetch("/api/credit-packages", {
        credentials: "include",
      });
      console.log("[PricingSectionClient] API yanıtı:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[PricingSectionClient] API hatası:", errorText);
        throw new Error(`Kredi paketleri yüklenemedi: ${response.status}`);
      }
      
      const json = await response.json();
      console.log("[PricingSectionClient] API JSON:", json);
      return json;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const packages = useMemo(() => {
    console.log("[PricingSectionClient] useMemo çalıştı:", {
      isLoading,
      hasError: !!error,
      error: error?.message,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
      rawPackages: data?.packages,
    });
    
    const sorted = (data?.packages ?? []).slice().sort((a, b) => {
      // Sadece sortOrder'a göre sırala (1, 2, 3)
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
    
    console.log("[PricingSectionClient] Sıralanmış paketler:", {
      packagesCount: sorted.length,
      packages: sorted.map(p => ({
        name: p.name,
        sortOrder: p.sortOrder,
        isFeatured: p.isFeatured,
      })),
    });
    
    return sorted;
  }, [data, isLoading, error]);

  const handleCallToAction = (redirectTo: string) => {
    if (isAuthenticated && isEmailVerified) {
      setLocation(redirectTo);
      return;
    }

    openAuthModal({
      redirectTo,
      initialMode: isAuthenticated ? "login" : "signup",
      title: isAuthenticated ? "Hemen devam et" : "Hemen denemeye başla",
      description:
        "E-posta doğrulamasıyla anında giriş yap, kampanyalı kredi paketlerinden yararlan.",
    });
  };

  const handlePurchase = async (pkg: PricingPackage) => {
    // Check authentication
    if (!isAuthenticated || !isEmailVerified) {
      openAuthModal({
        redirectTo: "/#pricing",
        initialMode: isAuthenticated ? "login" : "signup",
        title: "Kredi satın almak için giriş yapın",
        description: "E-posta doğrulamasıyla anında giriş yap ve kampanyalı kredi paketlerinden yararlan.",
      });
      return;
    }

    setPurchasingPackageId(pkg.id);

    try {
      const salePrice = pkg.priceEur || pkg.priceTry;
      const currency = pkg.priceEur ? "EUR" : pkg.currency;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.name,
          credits: pkg.credits,
          amount: salePrice,
          currency: currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ödeme işlemi başlatılamadı");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      setPurchasingPackageId(null);
    }
  };

  console.log("[PricingSectionClient] Render:", { 
    isLoading, 
    hasError: !!error, 
    packagesLength: packages.length,
    rendering: isLoading ? "loading" : packages.length === 0 ? "empty" : "cards"
  });

  return (
    <section id="pricing" className="py-24 bg-muted/30 scroll-mt-28 lg:scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("pricing.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            {t("pricing.subtitle")}
          </p>
          <Button
            size="lg"
            onClick={() => handleCallToAction("/generate")}
            className="text-lg px-10 h-12 font-semibold"
            data-testid="button-try-now-pricing-top"
          >
            {t("pricing.tryNowFree")}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-full rounded-3xl border bg-card/50 p-6 animate-pulse"
              >
                <div className="h-6 w-1/2 rounded-full bg-muted mb-4" />
                <div className="h-10 w-2/3 rounded-full bg-muted mb-6" />
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-4 w-full rounded-full bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-3xl border bg-card p-12 text-center mb-12 space-y-4">
            <p className="text-lg font-semibold text-destructive">
              Kredi paketleri yüklenemiyor
            </p>
            <p className="text-sm text-muted-foreground">
              {error ? `Hata: ${error.message}` : "Veri bulunamadı"}
            </p>
            <div className="text-xs text-left bg-muted p-4 rounded-md font-mono">
              <div>isLoading: {isLoading ? "true" : "false"}</div>
              <div>hasError: {error ? "true" : "false"}</div>
              <div>hasData: {data ? "true" : "false"}</div>
              <div>packagesCount: {data?.packages?.length ?? 0}</div>
            </div>
            <Button onClick={() => window.location.reload()}>
              Sayfayı Yenile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {packages.map((pkg) => {
              const salePrice = pkg.priceEur || pkg.priceTry;
              const originalPrice = pkg.priceEur 
                ? (pkg.originalPriceEur || salePrice) 
                : (pkg.originalPriceTry || pkg.priceTry);
              const currency = pkg.priceEur ? "EUR" : pkg.currency;
              const perCredit = salePrice / Math.max(pkg.credits, 1);
              const features = Array.isArray(pkg.featureHighlights)
                ? pkg.featureHighlights
                : [];

              return (
                <Card
                  key={pkg.id}
                  className={`relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
                    pkg.isFeatured 
                      ? "border-primary shadow-xl ring-2 ring-primary/20 bg-gradient-to-b from-primary/5 to-transparent" 
                      : "hover:border-primary/50"
                  }`}
                  data-testid={`pricing-card-${pkg.slug}`}
                >
                  {/* Glow effect for featured card */}
                  {pkg.isFeatured && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10" />
                  )}

                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {pkg.isFeatured && (
                      <Badge className="gap-1.5 px-4 py-1.5 text-sm font-semibold shadow-lg bg-gradient-to-r from-primary to-purple-600 border-0">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        {t("pricing.mostPopular")}
                      </Badge>
                    )}
                    {pkg.badgeText && !pkg.isFeatured && (
                      <Badge variant="secondary" className="px-3 py-1 shadow-md">{pkg.badgeText}</Badge>
                    )}
                  </div>

                  <CardHeader className="text-center pb-6 pt-12">
                    <CardTitle className="text-2xl mb-4 font-bold">{pkg.name}</CardTitle>
                    <CardDescription className="space-y-3">
                      <div className="relative inline-block">
                        <div className="text-sm text-muted-foreground line-through opacity-60">
                          {formatCurrency(originalPrice, currency)}
                        </div>
                        <div className="text-5xl font-black text-foreground tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                          {formatCurrency(salePrice, currency)}
                        </div>
                      </div>
                      {pkg.priceEur && pkg.priceTry > 0 && (
                        <div className="text-xs text-muted-foreground">
                          ≈ {formatCurrency(pkg.priceTry, "TRY")}
                        </div>
                      )}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{pkg.credits} kredi</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-primary font-semibold">
                          {formatCurrency(perCredit, currency)}/kredi
                        </span>
                      </div>
                      {pkg.description && (
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3.5 mb-6">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm group/item">
                          <div className="rounded-full bg-green-500/10 p-1 mt-0.5 group-hover/item:bg-green-500/20 transition-colors">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                          </div>
                          <span className="text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {features.length === 0 && (
                        <li className="text-sm text-muted-foreground text-center py-4">
                          Avantaj listesi yakında güncellenecek.
                        </li>
                      )}
                    </ul>

                    <Button
                      className={`w-full group/btn transition-all duration-300 ${
                        pkg.isFeatured 
                          ? "h-12 text-base font-semibold shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                          : "h-12 text-base font-semibold hover:bg-primary/10"
                      }`}
                      size="lg"
                      variant={pkg.isFeatured ? "default" : "outline"}
                      onClick={() => handlePurchase(pkg)}
                      disabled={purchasingPackageId === pkg.id}
                      data-testid={`button-buy-${pkg.slug}`}
                    >
                      {purchasingPackageId === pkg.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Yönlendiriliyor...</span>
                        </>
                      ) : (
                        <>
                          <span>{pkg.ctaLabel || t("pricing.getStarted")}</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 pt-3 text-muted-foreground/60 border-t border-border/50">
                      <CreditCard className="h-5 w-5" />
                      <SiVisa className="h-5 w-5" />
                      <SiMastercard className="h-5 w-5" />
                      <SiAmericanexpress className="h-5 w-5" />
                      <SiPaypal className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t("pricing.bottomText")}
          </p>
          <Button
            size="lg"
            onClick={() => handleCallToAction("/generate")}
            className="text-lg px-10 h-14 font-semibold"
            data-testid="button-try-now-pricing-bottom"
          >
            {t("pricing.tryNowFree")}
          </Button>
        </div>
      </div>
    </section>
  );
}

