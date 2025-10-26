"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { WrapCategory } from "@/types/wrap";

// Main 4 categories to showcase on homepage
const examples = [
  {
    id: 1,
    category: 'vehicle' as WrapCategory,
    label: "Araç Kaplama",
    description: "Araçlarını farklı renkler ve desenlerle kapla",
    bgColor: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    category: 'furniture' as WrapCategory,
    label: "Mobilya Kaplama",
    description: "Mobilyalarına yeni bir görünüm kazandır",
    bgColor: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: 3,
    category: 'wall' as WrapCategory,
    label: "Duvar Kaplama",
    description: "Duvarlarını istediğin desenle yenile",
    bgColor: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: 4,
    category: 'object' as WrapCategory,
    label: "Genel Nesne Kaplama",
    description: "Her türlü nesneye istediğin tasarımı uygula",
    bgColor: "from-violet-500/20 to-purple-500/20",
  },
];

export function BeforeAfterShowcase() {
  const router = useRouter();
  
  const handleExampleClick = (categoryId: string) => {
    router.push(`/ornekler#${categoryId}`);
  };

  const handleViewAllExamples = () => {
    router.push("/ornekler");
  };

  return (
    <section id="examples" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Neler Yapabilirsiniz?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Her şeyi istediğin tasarımla kapla—arabalar, duvarlar, mobilyalar ve daha fazlası
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {examples.map((example) => (
            <Card 
              key={example.id} 
              className="overflow-hidden hover-elevate transition-all cursor-pointer group" 
              data-testid={`example-card-${example.id}`}
              onClick={() => handleExampleClick(example.category)}
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center border-r">
                    <span className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      Önce
                    </span>
                    <div className="text-5xl opacity-20">📷</div>
                  </div>
                  <div className={`relative aspect-square bg-gradient-to-br ${example.bgColor} flex items-center justify-center`}>
                    <span className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      Sonra
                    </span>
                    <div className="text-5xl opacity-40">✨</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">{example.label}</Badge>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleViewAllExamples}
            className="text-lg px-10 h-12 font-semibold border-2 hover:bg-primary hover:text-primary-foreground"
            data-testid="button-view-all-examples"
          >
            Tüm Örnekleri Gör
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground">
            100+ gerçek örnek ve interaktif karşılaştırma
          </p>
        </div>
      </div>
    </section>
  );
}
