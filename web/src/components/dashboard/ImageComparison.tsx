"use client";

import { useState } from "react";
import { Download, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeCard, RevealSection, AnimatedImage, FlickerText } from "@/components/animations";

interface ImageComparisonProps {
  images: {
    original: string;
    enhanced: string;
    generated: string;
    groundTruth?: string;
  };
}

export function ImageComparison({ images }: ImageComparisonProps) {
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const cards = [
    { id: "original", title: "Original Infrared Image", src: images.original },
    { id: "enhanced", title: "Enhanced Details", src: images.enhanced },
    { id: "generated", title: "Generated Color Image", src: images.generated },
    { id: "truth", title: "Actual Color Image", src: images.groundTruth || images.generated },
  ];

  const handleDownload = (src: string, title: string) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "_")}.png`;
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <RevealSection className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-8" delay={0.4}>
        {cards.map((card, i) => (
          <FadeCard
            key={card.id}
            className="relative group rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl aspect-square md:aspect-[4/3]"
          >
            {/* Label */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/10 text-sm font-medium shadow-lg pointer-events-none">
              <FlickerText delay={i * 0.15 + 0.5}>{card.title}</FlickerText>
            </div>

            {/* Action Buttons (Fades in on hover smoothly via CSS) */}
            <div className="absolute top-4 right-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                size="icon" 
                variant="secondary" 
                onClick={() => setActiveLightboxImage({ src: card.src, title: card.title })}
                className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                onClick={() => handleDownload(card.src, card.title)}
                className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Placeholder / Actual Image */}
            <div className="absolute inset-0 bg-muted flex items-center justify-center overflow-hidden">
              {card.src ? (
                <AnimatedImage 
                  src={card.src} 
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-background animate-pulse" />
              )}
            </div>
            
            {/* Highlight border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-colors pointer-events-none rounded-2xl z-30" />
          </FadeCard>
        ))}
      </RevealSection>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/40 backdrop-blur-[6px] animate-fade-in"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div 
            className="max-w-[90vw] max-h-[80vh] overflow-hidden rounded-xl border border-primary/20 relative bg-background/90 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action buttons pinned to the top right of the image card */}
            <div className="absolute top-4 right-4 flex gap-2.5 z-50">
              <Button 
                size="icon" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(activeLightboxImage.src, activeLightboxImage.title);
                }}
                className="h-9 w-9 rounded-full border-primary/20 bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxImage(null);
                }}
                className="h-9 w-9 rounded-full border-primary/20 bg-background/80 backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeLightboxImage.src} 
              alt={activeLightboxImage.title} 
              className="max-w-full max-h-[75vh] object-contain"
            />
            <div className="bg-background/80 backdrop-blur-md py-4 px-6 border-t border-border/50 text-center font-medium text-primary">
              {activeLightboxImage.title}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
