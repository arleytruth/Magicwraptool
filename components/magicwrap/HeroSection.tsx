"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, MoveHorizontal } from "lucide-react";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { openSignUp } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleStartWrapping = () => {
    if (isSignedIn) {
      router.push("/generate");
      return;
    }

    openSignUp({ redirectUrl: "/generate" });
  };

  const handleSeeExamples = () => {
    document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-chart-2/10" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 backdrop-blur-sm px-4 py-1.5 text-sm shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Start with 3 free credits</span>
              </div>
            </div>

            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2]">
              <span className="block">Wrap anything with</span>
              <span className="block mt-2">any design in seconds</span>
              <span className="block mt-2 pb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                using AI
              </span>
            </h1>

            <p className="mb-8 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Just upload two photos and let our AI handle the rest. No complicated settings!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleStartWrapping}
                className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all"
                data-testid="button-start-wrapping"
              >
                Try for free now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSeeExamples}
                className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg backdrop-blur-sm"
                data-testid="button-see-examples"
              >
                See Examples
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                <span>No installation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                <span>Results in 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                <span>Realistic look</span>
              </div>
            </div>
          </div>

          {/* Right: Before/After Slider */}
          <div className="order-1 lg:order-2">
            <div
              className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border bg-muted cursor-col-resize select-none"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onTouchMove={handleTouchMove}
            >
              {/* Before Image (Background) */}
              <div className="absolute inset-0" style={{ willChange: 'auto' }}>
                <img
                  src="/hero-after.png"
                  alt="Before - Original Image"
                  className="w-full h-full object-cover pointer-events-none"
                  draggable="false"
                  loading="eager"
                  fetchPriority="high"
                  onError={(e) => {
                    // Fallback if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-muted', 'to-muted-foreground/20');
                  }}
                />
              </div>

              {/* After Image (Overlay) */}
              <div
                className="absolute inset-0"
                style={{ 
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  willChange: isDragging ? 'clip-path' : 'auto'
                }}
              >
                <img
                  src="/hero-before.jpg"
                  alt="After - Wrapped Image"
                  className="w-full h-full object-cover pointer-events-none"
                  draggable="false"
                  loading="eager"
                  fetchPriority="high"
                  onError={(e) => {
                    // Fallback if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary/20', 'via-purple-500/20', 'to-chart-2/20');
                  }}
                />
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                style={{ 
                  left: `${sliderPosition}%`,
                  transition: isDragging ? 'none' : 'left 0.1s ease-out'
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary pointer-events-none">
                  <MoveHorizontal className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold pointer-events-none select-none">
                Before
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold pointer-events-none select-none">
                After
              </div>

              {/* Drag Hint */}
              {sliderPosition === 50 && !isDragging && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg animate-pulse pointer-events-none">
                  ← Drag →
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
