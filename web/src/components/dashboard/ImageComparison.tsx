"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageComparisonProps {
  images: {
    original: string;
    enhanced: string;
    generated: string;
    groundTruth?: string;
  };
}

export function ImageComparison({ images }: ImageComparisonProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    { id: "original", title: "Original Infrared", src: images.original },
    { id: "enhanced", title: "Enhanced Infrared (SR)", src: images.enhanced },
    { id: "generated", title: "Generated RGB (Ours)", src: images.generated },
    { id: "truth", title: "Ground Truth RGB", src: images.groundTruth || images.generated },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative group rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl aspect-square md:aspect-[4/3]"
        >
          {/* Label */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/10 text-sm font-medium shadow-lg">
            {card.title}
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredCard === card.id ? 1 : 0 }}
            className="absolute top-4 right-4 z-20 flex gap-2"
          >
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-colors">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-colors">
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Image Placeholder / Actual Image */}
          <div className="absolute inset-0 bg-muted flex items-center justify-center overflow-hidden">
            {card.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
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
        </motion.div>
      ))}
    </div>
  );
}
