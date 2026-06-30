"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Database, Cpu, Play } from "lucide-react";
import Link from "next/link";
import { AnimatedHeading, FlickerText, RevealSection, FadeCard } from "@/components/animations";

interface HeroSectionProps {
  onRunInferenceClick: () => void;
}

const SAMPLES = [
  {
    name: "Urban Infrastructure",
    ir: "/samples/ir/patch_3.png",
    rgb: "/samples/rgb/patch_3.png",
    type: "Landsat 8 - Thermal Band 10",
    desc: "Reconstructing roads, buildings, and urban grids by converting temperature profiles into optical signatures.",
  },
  {
    name: "Forest & Vegetation",
    ir: "/samples/ir/patch_79.png",
    rgb: "/samples/rgb/patch_79.png",
    type: "Landsat 8 - Thermal Band 10",
    desc: "Predicting dense vegetation canopies and agriculture plots based on surface energy emission data.",
  },
  {
    name: "Desert",
    ir: "/samples/ir/patch_69.png",
    rgb: "/samples/rgb/patch_69.png",
    type: "Landsat 8 - Thermal Band 10",
    desc: "Detecting dune structures, barren landscape elevations, and dry sand bed outlines from thermal emissivity gradients.",
  }
];

interface ComponentCardProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  title: string;
  metadata: string;
  statusColor: string;
}

function ComponentCard({ href, onClick, icon, title, metadata, statusColor }: ComponentCardProps) {
  const content = (
    <div className="flex items-center justify-between w-full p-4 rounded-xl border border-white/5 bg-card/20 backdrop-blur-md hover:border-primary/40 hover:bg-card/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.08)] transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-primary group-hover:bg-primary/15 transition-all">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
            {title}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">{metadata}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest hidden sm:inline">Active</span>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`}></span>
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block w-full">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="group block w-full focus:outline-none cursor-pointer">
      {content}
    </button>
  );
}

export function HeroSection({ onRunInferenceClick }: HeroSectionProps) {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section className="relative w-full pt-4 pb-8 overflow-hidden flex flex-col items-center justify-center text-center">
      <RevealSection className="container px-4 md:px-6 z-10 flex flex-col items-center">
        {/* System Status Badge */}
        <FadeCard className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4 backdrop-blur-sm">
          <Activity className="mr-2 h-3.5 w-3.5 animate-pulse" />
          <FlickerText delay={0.2}>System Online</FlickerText>
        </FadeCard>
        
        {/* Soothing Title */}
        <AnimatedHeading className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto pb-2 text-center leading-tight">
          <span className="text-foreground">Turn </span>
          <span 
            className="bg-clip-text text-transparent animate-rgb-shift"
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #ffffff, #888888, #ffffff)',
              backgroundSize: '300% 100%' 
            }}
          >Black-and-White</span>
          <span className="text-foreground"> Satellite Images into </span>
          <span 
            className="bg-clip-text text-transparent animate-rgb-shift"
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #00E5FF, #0EA5E9, #2563EB, #00E5FF)',
              backgroundSize: '300% 100%' 
            }}
          >Full Color</span>
        </AnimatedHeading>
        
        {/* Subtitle */}
        <FlickerText delay={0.4} className="mx-auto max-w-[600px] text-muted-foreground text-xs sm:text-sm mt-2 mb-8 block text-center px-4 leading-relaxed">
          Deep learning translation models reconstruct spectral signatures and details from thermal infrared satellite data to generate realistic optical RGB imagery.
        </FlickerText>
      </RevealSection>

      {/* Main Console Grid */}
      <div className="w-full max-w-5xl mx-auto px-4 z-10 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Component Cards */}
          <div className="md:col-span-4 flex flex-col justify-start gap-4">
            <div className="text-left mb-1">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-semibold">MODULE GATEWAYS</span>
            </div>
            
            <ComponentCard 
              href="/dataset"
              icon={<Database className="w-4 h-4" />}
              title="Dataset Preview"
              metadata="50k paired Landsat 8 scenes"
              statusColor="bg-primary"
            />
            
            <ComponentCard 
              href="/architecture"
              icon={<Cpu className="w-4 h-4" />}
              title="Model Architecture"
              metadata="Pix2Pix GAN & SRCNN layers"
              statusColor="bg-sky-400"
            />
            
            <ComponentCard 
              onClick={onRunInferenceClick}
              icon={<Play className="w-4 h-4" />}
              title="Launch Live Demo"
              metadata="Interactive reconstruction terminal"
              statusColor="bg-emerald-400"
            />

            {/* Quick stats panel */}
            <div className="mt-2 p-4 rounded-xl border border-white/5 bg-card/10 backdrop-blur-md text-left">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">MODEL GATEWAY TELEMETRY</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-muted-foreground block">Inference Speed</span>
                  <span className="font-mono text-foreground font-semibold">0.85s / patch</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">FID Score</span>
                  <span className="font-mono text-foreground font-semibold">18.7 (Lower is better)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Centered Hero Stage Comparison Slider */}
          <div className="md:col-span-8 flex flex-col justify-start">
            <div className="text-left mb-1.5 flex justify-between items-center">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-semibold">INTERACTIVE VISUALIZATION STAGE</span>
              <span className="text-[9px] font-mono text-muted-foreground">DRAG SLIDER TO COLORIZE</span>
            </div>
            
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl select-none group/slider">
              {/* Underlay (RGB Color) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={SAMPLES[activeSampleIndex].rgb} 
                alt="Colorized RGB" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Overlay (IR Grayscale) */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" 
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={SAMPLES[activeSampleIndex].ir} 
                  alt="Infrared IR" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>

              {/* Slider Bar & Handle */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_10px_rgba(0,229,255,0.8)] pointer-events-none z-20"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-primary text-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform duration-200 group-hover/slider:scale-110">
                  <span className="text-[10px] font-bold font-mono">⇄</span>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/5 text-[9px] font-mono text-muted-foreground pointer-events-none z-10">
                INFRARED INPUT (IR)
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/5 text-[9px] font-mono text-primary pointer-events-none z-10">
                COLORIZED (RGB OUTPUT)
              </div>

              {/* Interactive Overlay Input Range */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition} 
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>
            
            {/* Sample Selector Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                {SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSampleIndex(idx);
                      setSliderPosition(50); // reset slider to 50%
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border whitespace-nowrap transition-all duration-300 cursor-pointer
                      ${activeSampleIndex === idx 
                        ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_12px_rgba(0,229,255,0.1)]" 
                        : "bg-card/20 border-white/5 hover:border-white/20 text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground text-right w-full sm:w-auto font-mono">
                {SAMPLES[activeSampleIndex].type}
              </div>
            </div>

            {/* Current Sample Description */}
            <div className="mt-2.5 p-3 rounded-lg bg-card/10 border border-white/5 text-[11px] text-muted-foreground leading-relaxed text-left">
              <span className="font-semibold text-foreground mr-1.5">Model Objective:</span>
              {SAMPLES[activeSampleIndex].desc}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

