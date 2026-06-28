"use client";

import { motion } from "framer-motion";
import { Activity, Zap, Layers, Focus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface MetricCardsProps {
  metrics?: {
    psnr: number;
    ssim: number;
    fid: number;
    inferenceTime: number;
  } | null;
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const [animatedMetrics, setAnimatedMetrics] = useState({
    psnr: 0,
    ssim: 0,
    fid: 0,
    inferenceTime: 0,
  });

  useEffect(() => {
    if (metrics) {
      // Simple animation for the numbers
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        
        setAnimatedMetrics({
          psnr: metrics.psnr * ease,
          ssim: metrics.ssim * ease,
          fid: metrics.fid * ease,
          inferenceTime: metrics.inferenceTime * ease,
        });

        if (step >= steps) {
          clearInterval(timer);
          setAnimatedMetrics(metrics);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [metrics]);

  const cards = [
    {
      title: "PSNR (dB)",
      value: metrics ? animatedMetrics.psnr.toFixed(1) : "--",
      description: "Peak Signal-to-Noise Ratio",
      icon: <Activity className="h-4 w-4 text-primary" />,
    },
    {
      title: "SSIM",
      value: metrics ? animatedMetrics.ssim.toFixed(3) : "--",
      description: "Structural Similarity Index",
      icon: <Layers className="h-4 w-4 text-secondary" />,
    },
    {
      title: "FID Score",
      value: metrics ? animatedMetrics.fid.toFixed(1) : "--",
      description: "Frechet Inception Distance",
      icon: <Focus className="h-4 w-4 text-accent" />,
    },
    {
      title: "Inference Time",
      value: metrics ? `${animatedMetrics.inferenceTime.toFixed(2)}s` : "--",
      description: "Per 256x256 tile",
      icon: <Zap className="h-4 w-4 text-yellow-400" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-6 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                {card.icon}
              </div>
              <div className="text-3xl font-bold font-mono tracking-tight text-foreground mt-2">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
