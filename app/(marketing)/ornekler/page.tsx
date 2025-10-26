"use client";

import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/magicwrap/BeforeAfterSlider";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Example data structure
const categories = [
  {
    id: "vehicle",
    title: "Araç Kaplama",
    description: "Mockup kullanmak yerine aracın gerçek fotoğrafını kullan. Anında fotoğrafı çek, yükle ve istediğin malzeme ile kapla.",
    examples: [
      {
        before: "/examples/vehicle-1-before.jpg",
        after: "/examples/vehicle-1-after.jpg",
      },
      {
        before: "/examples/vehicle-2-before.jpg",
        after: "/examples/vehicle-2-after.jpg",
      },
      {
        before: "/examples/vehicle-3-before.jpg",
        after: "/examples/vehicle-3-after.jpg",
      },
      {
        before: "/examples/vehicle-4-before.jpg",
        after: "/examples/vehicle-4-after.jpg",
      },
    ],
  },
  {
    id: "furniture",
    title: "Mobilya Kaplama",
    description: "Mobilyalarını ahşap, mermer, metal ve daha fazlasıyla kapla. Tasarımını değiştir.",
    examples: [
      {
        before: "/examples/furniture-1-before.jpg",
        after: "/examples/furniture-1-after.jpg",
      },
      {
        before: "/examples/furniture-2-before.jpg",
        after: "/examples/furniture-2-after.jpg",
      },
      {
        before: "/examples/furniture-3-before.jpg",
        after: "/examples/furniture-3-after.jpg",
      },
      {
        before: "/examples/furniture-4-before.jpg",
        after: "/examples/furniture-4-after.jpg",
      },
    ],
  },
  {
    id: "wall",
    title: "Duvar Kaplama",
    description: "Duvarlarını taş, tuğla, ahşap ya da istediğin herhangi bir desenle kapla.",
    examples: [
      {
        before: "/examples/wall-1-before.jpg",
        after: "/examples/wall-1-after.jpg",
      },
      {
        before: "/examples/wall-2-before.jpg",
        after: "/examples/wall-2-after.jpg",
      },
      {
        before: "/examples/wall-3-before.jpg",
        after: "/examples/wall-3-after.jpg",
      },
      {
        before: "/examples/wall-4-before.jpg",
        after: "/examples/wall-4-after.jpg",
      },
    ],
  },
  {
    id: "box",
    title: "Kutu Kaplama",
    description: "Tasarımlarını veya desenlerini gerçek kutu üzerinde kaplayarak gör.",
    examples: [
      {
        before: "/examples/box-1-before.jpg",
        after: "/examples/box-1-after.jpg",
      },
      {
        before: "/examples/box-2-before.jpg",
        after: "/examples/box-2-after.jpg",
      },
      {
        before: "/examples/box-3-before.jpg",
        after: "/examples/box-3-after.jpg",
      },
      {
        before: "/examples/box-4-before.jpg",
        after: "/examples/box-4-after.jpg",
      },
    ],
  },
  {
    id: "object",
    title: "Genel Nesne Kaplama",
    description: "Herhangi bir nesneyi istediğin materyal veya desenle kapla. Sınırsız yaratıcılık.",
    examples: [
      {
        before: "/examples/object-1-before.jpg",
        after: "/examples/object-1-after.jpg",
      },
      {
        before: "/examples/object-2-before.jpg",
        after: "/examples/object-2-after.jpg",
      },
      {
        before: "/examples/object-3-before.jpg",
        after: "/examples/object-3-after.jpg",
      },
      {
        before: "/examples/object-4-before.jpg",
        after: "/examples/object-4-after.jpg",
      },
    ],
  },
];

export default function ExamplesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-chart-2 bg-clip-text text-transparent">
              İlham Alın
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Gerçek kullanıcılarımızın oluşturduğu etkileyici örnekleri keşfedin.
              Sürükleyerek öncesi ve sonrasını karşılaştırın.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`py-16 md:py-24 ${categoryIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
        >
          <div className="container max-w-7xl mx-auto px-4">
            {/* Category Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {category.title}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {category.examples.map((example, index) => (
                <div key={index}>
                  <BeforeAfterSlider
                    beforeImage={example.before}
                    afterImage={example.after}
                    beforeAlt={`${category.title} Önce`}
                    afterAlt={`${category.title} Sonra`}
                  />
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => router.push(`/generate?category=${category.id}`)}
                className="px-8 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {category.title} ile Hemen Başla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 via-purple-500/10 to-background">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Senin Sıran!
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Ücretsiz krediyle kendi tasarımını oluşturmaya başla.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/generate")}
            className="px-12 h-16 text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl hover:shadow-3xl transition-all"
          >
            <Sparkles className="mr-2 h-6 w-6" />
            Hemen Oluşturmaya Başla
          </Button>
        </div>
      </section>
    </div>
  );
}

