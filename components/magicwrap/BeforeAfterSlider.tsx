"use client";

import { useState, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isBeforeLoaded, setIsBeforeLoaded] = useState(false);
  const [isAfterLoaded, setIsAfterLoaded] = useState(false);

  // Reset loading state when images change
  useEffect(() => {
    // Preload images to reduce flicker
    const imgBefore = new Image();
    const imgAfter = new Image();
    
    imgBefore.src = beforeImage;
    imgAfter.src = afterImage;
    
    imgBefore.onload = () => setIsBeforeLoaded(true);
    imgAfter.onload = () => setIsAfterLoaded(true);
    
    // Reset on unmount or image change
    return () => {
      setIsBeforeLoaded(false);
      setIsAfterLoaded(false);
    };
  }, [beforeImage, afterImage]);

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

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  const bothImagesLoaded = isBeforeLoaded && isAfterLoaded;

  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-border bg-muted cursor-col-resize select-none group ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* Loading Skeleton - positioned above images */}
      {!bothImagesLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-card animate-pulse flex items-center justify-center z-10">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      )}

      {/* Before Image (Background) - always visible, no opacity transition */}
      <div className="absolute inset-0" style={{ willChange: 'auto' }}>
        <img
          src={afterImage}
          alt={afterAlt}
          className="w-full h-full object-cover pointer-events-none"
          draggable="false"
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.classList.add(
              "bg-gradient-to-br",
              "from-muted",
              "to-muted-foreground/20"
            );
          }}
        />
      </div>

      {/* After Image (Overlay with clip) - always visible, no opacity transition */}
      <div
        className="absolute inset-0"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          willChange: isDragging ? 'clip-path' : 'auto'
        }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="w-full h-full object-cover pointer-events-none"
          draggable="false"
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.classList.add(
              "bg-gradient-to-br",
              "from-primary/20",
              "via-purple-500/20",
              "to-chart-2/20"
            );
          }}
        />
      </div>

      {/* Slider Handle - only show when images are loaded */}
      {bothImagesLoaded && (
        <>
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
            style={{ 
              left: `${sliderPosition}%`,
              transition: isDragging ? 'none' : 'left 0.1s ease-out'
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-primary pointer-events-none">
              <MoveHorizontal className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none select-none">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none select-none">
            After
          </div>

          {/* Hint - only show when at 50% and not dragging */}
          {Math.abs(sliderPosition - 50) < 2 && !isDragging && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm animate-pulse pointer-events-none">
              ← Drag →
            </div>
          )}
        </>
      )}
    </div>
  );
}

