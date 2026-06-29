"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { AnimatedHeading, FlickerText, RevealSection, FadeCard } from "@/components/animations";

interface HeroSectionProps {
  onRunInferenceClick: () => void;
}

export function HeroSection({ onRunInferenceClick }: HeroSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden flex flex-col items-center justify-center text-center">
      <RevealSection className="container px-4 md:px-6 z-10">
        <FadeCard className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
          <Activity className="mr-2 h-4 w-4" />
          <FlickerText delay={0.2}>System Online</FlickerText>
        </FadeCard>
        
        <AnimatedHeading className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-7xl max-w-4xl mx-auto pb-4 text-center">
          <span className="text-primary">Turn </span>
          <span 
            className="bg-clip-text text-transparent animate-rgb-shift"
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #ffffff, #666666, #ffffff)',
              backgroundSize: '300% 100%' 
            }}
          >Black-and-White</span>
          <br className="hidden md:block" />
          <span className="text-primary">Satellite Images into </span>
          <br className="hidden md:block" />
          <span 
            className="bg-clip-text text-transparent animate-rgb-shift"
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000)',
              backgroundSize: '300% 100%' 
            }}
          >Full Color</span>
        </AnimatedHeading>
        
        <FlickerText delay={0.6} className="mx-auto max-w-[700px] text-muted-foreground text-sm md:text-lg lg:text-xl mt-4 mb-10 block text-center px-4">
          Use Artificial Intelligence to automatically add realistic colors and enhance details in infrared satellite photos.
        </FlickerText>
        
        <FadeCard className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
          <a 
            href="#inference-gateway" 
            className="w-full sm:w-auto min-h-[44px] h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all group inline-flex items-center justify-center text-sm font-medium"
          >
            Try it Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link 
            href="/architecture"
            className="w-full sm:w-auto min-h-[44px] h-12 px-8 rounded-full border border-primary/20 hover:bg-primary/10 inline-flex items-center justify-center text-sm font-medium"
          >
            View Architecture
          </Link>
        </FadeCard>
      </RevealSection>
    </section>
  );
}
