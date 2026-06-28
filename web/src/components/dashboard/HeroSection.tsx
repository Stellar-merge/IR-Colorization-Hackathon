"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity } from "lucide-react";

interface HeroSectionProps {
  onRunInferenceClick: () => void;
}

export function HeroSection({ onRunInferenceClick }: HeroSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container px-4 md:px-6 z-10"
      >
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
          <Activity className="mr-2 h-4 w-4" />
          Mission Control Online
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 pb-4">
          Transform Infrared Satellite Imagery into High-Fidelity RGB Intelligence
        </h1>
        
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4 mb-10">
          Enhance low-contrast thermal imagery using AI Super Resolution and Pix2Pix-based colorization for improved object interpretation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onRunInferenceClick}
            className="group rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]"
          >
            Run Inference
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8 border-border bg-background/30 backdrop-blur-sm hover:bg-background/50"
            onClick={() => {
              window.location.href = "/architecture";
            }}
          >
            View Architecture
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
