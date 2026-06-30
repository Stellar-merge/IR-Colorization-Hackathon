"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsDashboardProps {
  results: {
    original: string;
    enhanced: string;
    generated: string;
  };
  metrics?: any;
}

export function ResultsDashboard({ results, metrics }: ResultsDashboardProps) {
  const [compareMode, setCompareMode] = useState<"colorized" | "enhanced">("colorized");
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleDownload = (src: string, title: string) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "_")}.png`;
    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentOutputImage = compareMode === "colorized" ? results.generated : results.enhanced;
  const currentOutputLabel = compareMode === "colorized" ? "COLORIZED (RGB OUTPUT)" : "ENHANCED (SRCNN OUTPUT)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto flex flex-col gap-4 mt-8 px-4"
    >
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            Reconstruction Console
            {metrics?.isDemoFallback ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider animate-pulse">
                ⚠️ Demo Fallback
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-3 h-3" /> Live Backend
              </span>
            )}
          </h2>
          <p className="text-[11px] text-muted-foreground">AI-powered Infrared Colorization & Detail Enhancement</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Processing Speed</span>
            <span className="font-mono font-medium text-foreground">{metrics?.inferenceTime || 0.85}s</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Pipeline Engine</span>
            <span className="font-mono font-medium text-cyan-400">
              {metrics?.isDemoFallback ? "Mock Simulator" : "FastAPI + CUDA"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-1">
        
        {/* Left Column: Slider Stage (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-semibold">INTERACTIVE VISUAL COMPARISON</span>
            
            {/* Compare Selector Tabs */}
            <div className="flex gap-1 bg-card/40 border border-white/5 p-0.5 rounded-lg">
              <button
                onClick={() => {
                  setCompareMode("colorized");
                  setSliderPosition(50);
                }}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer
                  ${compareMode === "colorized" 
                    ? "bg-primary/10 border border-primary/20 text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                Colorized Output
              </button>
              <button
                onClick={() => {
                  setCompareMode("enhanced");
                  setSliderPosition(50);
                }}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer
                  ${compareMode === "enhanced" 
                    ? "bg-primary/10 border border-primary/20 text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                Super-Res Output
              </button>
            </div>
          </div>

          {/* Interactive Before/After Drag Slider */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl select-none group/slider">
            {/* Base Image (Underlay Output) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentOutputImage} 
              alt="Processed output" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Overlay Image (Original B&W Input) */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" 
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={results.original} 
                alt="Original IR input" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>

            {/* Slider Divider Line & Glowing Handle */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_10px_rgba(0,229,255,0.8)] pointer-events-none z-20"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-primary text-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-transform duration-200 group-hover/slider:scale-110">
                <span className="text-[10px] font-bold font-mono">⇄</span>
              </div>
            </div>

            {/* Faded Labels */}
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/5 text-[9px] font-mono text-muted-foreground pointer-events-none z-10">
              ORIGINAL IR INPUT
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/5 text-[9px] font-mono text-primary pointer-events-none z-10">
              {currentOutputLabel}
            </div>

            {/* Transparent Input Range Overlay to Handle Drag */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        </div>

        {/* Right Column: Telemetry & Controls Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          
          {/* Section: Telemetry */}
          <div className="p-4 rounded-xl border border-white/5 bg-card/10 backdrop-blur-md text-left flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-semibold block mb-3">INFERENCE DATA</span>
              
              <div className="space-y-2.5 text-[11px]">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-muted-foreground">Original Resolution</span>
                  <span className="font-mono text-foreground font-medium">256 × 256 px</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-muted-foreground">Super-Res Output</span>
                  <span className="font-mono text-cyan-400 font-medium">512 × 512 px</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-muted-foreground">Inference Time</span>
                  <span className="font-mono text-foreground font-medium">{metrics?.inferenceTime || 0.85}s</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Accelerator Device</span>
                  <span className="font-mono text-foreground font-medium">GPU (Host CUDA)</span>
                </div>
              </div>
            </div>

            {/* Baseline Model Benchmarks */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-semibold block mb-2.5">BASELINE MODEL BENCHMARKS</span>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[8px] text-muted-foreground block font-mono">AVG PSNR</span>
                  <span className="text-xs font-mono font-bold text-foreground">{metrics?.psnr || 17.61} dB</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[8px] text-muted-foreground block font-mono">AVG SSIM</span>
                  <span className="text-xs font-mono font-bold text-foreground">{metrics?.ssim || 0.2545}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[8px] text-muted-foreground block font-mono">FID SCORE</span>
                  <span className="text-xs font-mono font-bold text-foreground">{metrics?.fid || 19.4}</span>
                </div>
              </div>

              {/* Explanatory Note */}
              <div className="flex items-start gap-1.5 p-2 rounded bg-primary/5 border border-primary/10 text-[9px] text-muted-foreground leading-relaxed mt-2.5">
                <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  Metrics computed offline against evaluation sets. Live user uploads lack reference targets for real-time comparison.
                </span>
              </div>
            </div>
          </div>

          {/* Section: Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <Button
              onClick={() => handleDownload(results.generated, "colorized_rgb")}
              className="w-full h-10 text-xs font-semibold shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Colorized RGB
            </Button>
            
            <Button
              onClick={() => handleDownload(results.enhanced, "enhanced_ir")}
              variant="outline"
              className="w-full h-10 text-xs font-semibold border-white/10 hover:bg-white/5 cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Enhanced IR
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              className="w-full h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Process Another Image
            </Button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
