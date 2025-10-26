"use client";

import { useEffect, useState, memo } from "react";
import { Loader2, Sparkles, Check, Upload, Video, Wand2, Clock } from "lucide-react";

interface GenerationLoadingModalProps {
  isOpen: boolean;
  stage: "uploading" | "generating";
  type?: "image" | "video"; // New prop to customize messages
}

export const GenerationLoadingModal = memo(function GenerationLoadingModal({
  isOpen,
  stage,
  type = "image",
}: GenerationLoadingModalProps) {
  const [progress, setProgress] = useState(0);

  // Simulate progress animation - optimized to prevent flickering
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    let interval: NodeJS.Timeout;

    if (stage === "uploading") {
      // Start from 0 only on first open
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 30) {
            clearInterval(interval);
            return 30;
          }
          return prev + 2;
        });
      }, 50);
    } else if (stage === "generating") {
      // For video generation (no upload stage), start from 30% directly
      setProgress((prev) => prev === 0 ? 30 : prev);
      
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          // Ensure minimum 30% progress
          return Math.max(30, prev) + 0.5;
        });
      }, 300);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, stage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200">
      {/* Blur backdrop - with fade-in animation */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" />
      
      {/* Loading content */}
      <div className="relative z-10 max-w-lg w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card border-2 border-primary/30 rounded-3xl p-8 shadow-2xl">
          {/* Animated header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 relative will-change-transform">
              <Sparkles className="w-10 h-10 text-primary animate-pulse will-change-auto" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/20 animate-ping will-change-transform" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              {stage === "uploading" ? (
                <>
                  <Upload className="w-6 h-6 text-primary" />
                  Hazırlanıyor...
                </>
              ) : type === "video" ? (
                <>
                  <Video className="w-6 h-6 text-primary" />
                  Video Oluşturuluyor!
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6 text-primary" />
                  AI Sihir Yapıyor!
                </>
              )}
            </h2>
            
            <p className="text-muted-foreground">
              {stage === "uploading" ? (
                type === "video" ? "Görseliniz yükleniyor" : "Görselleriniz yükleniyor"
              ) : type === "video" ? (
                <span className="flex items-center justify-center gap-2">
                  <Video className="w-4 h-4 animate-bounce text-primary" />
                  <span>Videonuz oluşturuluyor</span>
                  <Video className="w-4 h-4 animate-bounce [animation-delay:100ms] text-primary" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-bounce text-primary" />
                  <span>Kaplamanız oluşturuluyor</span>
                  <Sparkles className="w-4 h-4 animate-bounce [animation-delay:100ms] text-primary" />
                </span>
              )}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse will-change-auto" />
              
              {/* Progress fill - using transform for GPU acceleration */}
              <div
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full transition-transform duration-300 ease-out will-change-transform"
                style={{ 
                  transform: `scaleX(${progress / 100})`,
                  background: 'linear-gradient(to right, hsl(var(--primary)), hsl(280 80% 60%), hsl(var(--primary)))'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] will-change-transform" />
              </div>
            </div>
            
            {/* Progress percentage */}
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>{Math.round(progress)}%</span>
              <span>
                {stage === "uploading" ? "Yükleniyor..." : "İşleniyor..."}
              </span>
            </div>
          </div>

          {/* Progress steps */}
          <div className="space-y-3">
            {/* Step 1: Upload */}
            <div className="flex items-center gap-3 text-sm">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                stage === "generating" 
                  ? "bg-green-500 text-white" 
                  : "bg-primary/20 text-primary"
              }`}>
                {stage === "generating" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
              <span className={stage === "generating" ? "text-muted-foreground" : "font-semibold text-foreground"}>
                Görseller yüklendi
              </span>
            </div>

            {/* Step 2: AI Generation */}
            <div className="flex items-center gap-3 text-sm">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                stage === "generating"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}>
                {stage === "generating" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="text-xs">2</span>
                )}
              </div>
              <span className={stage === "generating" ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {type === "video" ? "AI video oluşturuyor" : "AI görsel oluşturuyor"}
              </span>
            </div>

            {/* Step 3: Finalize */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-muted-foreground">
                <span className="text-xs">3</span>
              </div>
              <span className="text-muted-foreground">
                Sonuç hazırlanıyor
              </span>
            </div>
          </div>

          {/* Time estimate */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {stage === "uploading" 
                  ? "Birkaç saniye..." 
                  : type === "video"
                    ? "Tahmini süre: 30-60 saniye"
                    : "Tahmini süre: 20-30 saniye"}
              </span>
            </div>
            {stage === "generating" && (
              <p className="text-xs text-muted-foreground/80 text-center mt-2 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                {type === "video" 
                  ? "Video oluşturma biraz uzun sürebilir, lütfen bekleyin"
                  : "Lütfen sayfayı kapatmayın ve bekleyin"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
