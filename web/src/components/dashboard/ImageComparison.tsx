"use client";

import { useState } from "react";
import { Download, Maximize2, Columns, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedImage } from "@/components/animations";
import { motion, AnimatePresence } from "framer-motion";

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
  const [compareMode, setCompareMode] = useState<{ left: string, right: string, leftTitle: string, rightTitle: string } | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const cards = [
    { id: "original", title: "Original IR", src: images.original, resolution: "256x256", format: "PNG", model: "Input" },
    { id: "generated", title: "Generated RGB", src: images.generated, resolution: "256x256", format: "PNG", model: "Pix2Pix" },
    { id: "enhanced", title: "Enhanced IR", src: images.enhanced, resolution: "512x512", format: "PNG", model: "SRCNN" },
    { id: "truth", title: "Ground Truth", src: images.groundTruth || images.generated, resolution: "256x256", format: "PNG", model: "Target" },
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

  const handleCompare = (card: typeof cards[0]) => {
    if (card.id === "original" || card.id === "enhanced") {
      setCompareMode({ left: images.original, right: images.enhanced, leftTitle: "Original IR", rightTitle: "Enhanced IR" });
    } else {
      setCompareMode({ left: images.generated, right: images.groundTruth || images.generated, leftTitle: "Generated RGB", rightTitle: "Ground Truth" });
    }
  };

  return (
    <>
      <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 gap-3 w-full h-full pb-2 md:pb-0 scrollbar-hide">
        {cards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            key={card.id}
            className="group relative rounded-xl overflow-hidden border border-border/50 bg-card aspect-16/10 min-w-full md:min-w-0 snap-center w-full"
          >
            {/* Action Buttons Toolbar */}
            <div className="absolute top-3 right-3 z-50 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="icon" variant="secondary" onClick={() => handleCompare(card)} className="h-8 w-8 rounded-md bg-background/80 backdrop-blur-md hover:bg-cyan-500 hover:text-white transition-colors">
                <Columns className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={() => setActiveLightboxImage({ src: card.src, title: card.title })} className="h-8 w-8 rounded-md bg-background/80 backdrop-blur-md hover:bg-primary transition-colors">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={() => handleDownload(card.src, card.title)} className="h-8 w-8 rounded-md bg-background/80 backdrop-blur-md hover:bg-primary transition-colors">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom-left Label */}
            <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-md bg-background/80 backdrop-blur-md border border-white/10 text-[13px] font-medium shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              {card.title}
            </div>

            {/* Hover Glass Tooltip */}
            <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-background/90 backdrop-blur-xl border border-white/10 text-[11px] shadow-2xl">
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Resolution</span><span className="text-foreground font-mono">{card.resolution}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Format</span><span className="text-foreground">{card.format}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted-foreground">Source</span><span className="text-foreground">{card.model}</span></div>
              </div>
            </div>

            {/* Image */}
            <div className="absolute inset-0 bg-muted flex items-center justify-center overflow-hidden">
              {card.src ? (
                <AnimatedImage src={card.src} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-muted to-background animate-pulse" />
              )}
            </div>
            
            <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400/50 transition-colors pointer-events-none rounded-xl z-30" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setActiveLightboxImage(null)}
          >
            <div className="max-w-[90vw] max-h-[90vh] rounded-xl relative border border-white/10 shadow-2xl bg-black overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-4 right-4 flex gap-2 z-50">
                <Button size="icon" variant="outline" onClick={() => handleDownload(activeLightboxImage.src, activeLightboxImage.title)} className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => setActiveLightboxImage(null)} className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md hover:bg-destructive hover:text-white border-transparent">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <img src={activeLightboxImage.src} alt={activeLightboxImage.title} className="max-w-full max-h-[85vh] object-contain" />
            </div>
          </motion.div>
        )}

        {/* Compare Modal */}
        {compareMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
            onClick={() => setCompareMode(null)}
          >
            <div className="w-[90vw] max-w-5xl aspect-video rounded-xl relative border border-white/10 shadow-2xl bg-black overflow-hidden select-none" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-4 right-4 flex gap-2 z-50">
                <Button size="icon" variant="outline" onClick={() => setCompareMode(null)} className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md hover:bg-destructive hover:text-white border-transparent">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute top-4 left-4 z-50 flex gap-4">
                <span className="px-3 py-1 rounded-md bg-background/80 backdrop-blur-md text-sm">{compareMode.leftTitle}</span>
                <span className="px-3 py-1 rounded-md bg-background/80 backdrop-blur-md text-sm">{compareMode.rightTitle}</span>
              </div>

              {/* Base Image (Right) */}
              <img src={compareMode.right} alt="Right" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              
              {/* Overlay Image (Left) */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img src={compareMode.left} alt="Left" className="absolute inset-0 w-full h-full object-cover" />
              </div>

              {/* Slider Input */}
              <input 
                type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
              />
              
              {/* Slider Line */}
              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-30 pointer-events-none" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                  <Columns className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
