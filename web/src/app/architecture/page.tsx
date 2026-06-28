"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Database, Layers, Eye } from "lucide-react";

export default function ArchitecturePage() {
  const blocks = [
    {
      title: "Input Modality",
      desc: "Raw Landsat 8 Thermal Infrared Sensor (TIRS) single-channel imagery.",
      icon: <Database className="w-8 h-8 text-primary" />,
      delay: 0.1
    },
    {
      title: "SRCNN Enhancement",
      desc: "Super-Resolution Convolutional Neural Network upscales and sharpens the structural edges of the IR image.",
      icon: <Layers className="w-8 h-8 text-secondary" />,
      delay: 0.3
    },
    {
      title: "U-Net Generator",
      desc: "Encoder-Decoder architecture with skip connections. Translates the IR domain into RGB while preserving spatial resolution.",
      icon: <Network className="w-8 h-8 text-accent" />,
      delay: 0.5
    },
    {
      title: "PatchGAN Discriminator",
      desc: "Evaluates N x N patches of the generated image to enforce high-frequency realness and structural fidelity.",
      icon: <Eye className="w-8 h-8 text-primary" />,
      delay: 0.7
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Model Architecture</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Deep learning translation pipeline combining Super Resolution with Conditional GANs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Connection lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary z-0 animate-ping" />
        
        {blocks.map((block, index) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: block.delay, duration: 0.5 }}
            className="z-10"
          >
            <Card className="bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/50 transition-colors h-full group">
              <CardHeader>
                <div className="mb-4 p-3 rounded-xl bg-background/50 inline-block w-fit group-hover:scale-110 transition-transform">
                  {block.icon}
                </div>
                <CardTitle className="text-2xl">{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-foreground/70">
                  {block.desc}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
