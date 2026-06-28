"use client";

import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon, Layers, Cpu, CheckCircle } from "lucide-react";

export function PipelineAnimation() {
  const steps = [
    { name: "Infrared Input", icon: <ImageIcon className="w-6 h-6" /> },
    { name: "SR Enhancement", icon: <Layers className="w-6 h-6" /> },
    { name: "Pix2Pix GAN", icon: <Cpu className="w-6 h-6" /> },
    { name: "RGB Output", icon: <CheckCircle className="w-6 h-6 text-primary" /> },
  ];

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <h3 className="text-xl font-medium mb-12 text-foreground/80">Active Processing Pipeline</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-5xl">
        {steps.map((step, index) => (
          <div key={step.name} className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.5, duration: 0.5 }}
              className="relative flex flex-col items-center p-6 bg-card border border-border/50 rounded-2xl shadow-lg backdrop-blur-sm min-w-[140px]"
            >
              <motion.div 
                className="absolute inset-0 rounded-2xl border border-primary/50"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              />
              <div className="p-4 rounded-full bg-primary/10 mb-3 text-primary">
                {step.icon}
              </div>
              <span className="text-sm font-medium text-center">{step.name}</span>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 + 0.3 }}
                className="flex items-center justify-center rotate-90 md:rotate-0"
              >
                <motion.div 
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-primary/70"
                >
                  <ArrowRight className="w-8 h-8" />
                </motion.div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
