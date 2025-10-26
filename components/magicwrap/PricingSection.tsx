"use client";

import dynamic from "next/dynamic";

const PricingSectionClient = dynamic(
  () => import("./PricingSectionClient").then((mod) => ({ default: mod.PricingSectionClient })),
  {
    ssr: false,
    loading: () => (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-muted animate-pulse rounded-lg mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded-lg mx-auto mb-6" />
            <div className="h-12 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-full rounded-3xl border bg-card/50 p-6 animate-pulse"
              >
                <div className="h-6 w-1/2 rounded-full bg-muted mb-4 mx-auto" />
                <div className="h-10 w-2/3 rounded-full bg-muted mb-6 mx-auto" />
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-4 w-full rounded-full bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

export function PricingSection() {
  return <PricingSectionClient />;
}
