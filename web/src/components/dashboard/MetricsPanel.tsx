"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Cpu, Image as ImageIcon, Zap } from "lucide-react";
import { AnimatedMetric } from "@/components/animations";

interface MetricsPanelProps {
  metrics?: {
    psnr: number;
    ssim: number;
    fid: number;
    inferenceTime: number;
  } | null;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const items = [
    {
      label: "PSNR",
      value: metrics ? metrics.psnr : "--",
      unit: "dB",
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      sparkline: "M0,10 L5,8 L10,12 L15,5 L20,7 L25,2 L30,4"
    },
    {
      label: "SSIM",
      value: metrics ? metrics.ssim.toFixed(3) : "--",
      unit: "",
      icon: <ImageIcon className="w-4 h-4 text-blue-400" />,
      sparkline: "M0,12 L5,9 L10,10 L15,4 L20,6 L25,2 L30,3"
    },
    {
      label: "FID",
      value: metrics ? metrics.fid.toFixed(1) : "--",
      unit: "",
      icon: <Zap className="w-4 h-4 text-purple-400" />,
      sparkline: "M0,2 L5,5 L10,3 L15,10 L20,8 L25,12 L30,10"
    },
    {
      label: "Inference Time",
      value: metrics ? metrics.inferenceTime.toFixed(2) : "--",
      unit: "sec",
      icon: <Clock className="w-4 h-4 text-green-400" />,
      sparkline: "M0,8 L5,8 L10,8 L15,8 L20,7 L25,8 L30,8"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-full bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-5 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-3">
        <Cpu className="w-5 h-5 text-primary" />
        <h3 className="text-[16px] font-semibold text-foreground">Model Metrics</h3>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
        {items.map((item) => (
          <div key={item.label} className="group flex items-center justify-between p-3 rounded-xl bg-background/30 border border-transparent hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] lg:text-[24px] font-bold font-mono text-foreground tracking-tight">
                    {metrics ? <AnimatedMetric value={item.value as number | string} /> : "--"}
                  </span>
                  {item.unit && <span className="text-[12px] text-muted-foreground">{item.unit}</span>}
                </div>
              </div>
            </div>
            
            <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 30 14" className="w-full h-full overflow-visible">
                <path 
                  d={item.sparkline} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        ))}

        <div className="mt-2 pt-3 border-t border-border/50 flex justify-between items-center text-[12px]">
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium text-cyan-400">Pix2Pix + SRCNN</span>
        </div>
      </div>
    </motion.div>
  );
}
