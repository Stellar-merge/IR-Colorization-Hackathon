"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, Layers, Sparkles, Network, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ArchitecturePage() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      title: "Landsat 8 Thermal Image",
      desc: "Acquire single-channel Thermal Infrared (TIRS) imagery from Landsat 8. These images serve as the primary input for the system.",
      badge: "Input",
      icon: <Satellite className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      id: 2,
      title: "Image Preprocessing",
      desc: "Normalize thermal values, resize images, remove noise, and prepare the infrared image for the enhancement network.",
      badge: "Pre-processing",
      icon: <Layers className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      id: 3,
      title: "SRCNN Enhancement",
      desc: "Enhance image quality using the SRCNN model to sharpen edges, improve textures, and increase spatial details.",
      badge: "Enhanced IR",
      icon: <Sparkles className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      id: 4,
      title: "Pix2Pix Generator",
      desc: "The U-Net generator converts the enhanced infrared image into a realistic RGB satellite image while preserving structural information.",
      badge: "IR → RGB",
      icon: <Network className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      id: 5,
      title: "PatchGAN Discriminator",
      desc: "The discriminator compares generated RGB images with real RGB images to improve realism and preserve semantic consistency during training.",
      badge: "Training Module",
      icon: <ShieldCheck className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      id: 6,
      title: "Enhanced RGB Output",
      desc: "Generate the final high-resolution colorized satellite image that improves visual interpretation and supports downstream computer vision tasks.",
      badge: "Output",
      icon: <ImageIcon className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />,
    }
  ];

  const timelineDetails = [
    {
      title: "Landsat Image",
      desc: "Raw Thermal Infrared Sensor (TIRS) single-channel imagery.",
      input: "Satellite Sensors",
      output: "Raw IR Image",
      purpose: "Provide base thermal data for analysis."
    },
    {
      title: "Pre-processing",
      desc: "Data cleaning, normalization, and resizing.",
      input: "Raw IR Image",
      output: "Cleaned IR Tensor",
      purpose: "Prepare data for neural network ingestion."
    },
    {
      title: "SRCNN Enhancement",
      desc: "Improves image sharpness by reconstructing high-frequency details lost in low-resolution infrared imagery.",
      input: "Preprocessed Thermal Image",
      output: "Enhanced Thermal Image",
      purpose: "Improve structural features before colorization."
    },
    {
      title: "Pix2Pix Generator",
      desc: "Generate realistic RGB imagery while preserving spatial structures.",
      input: "Enhanced IR",
      output: "RGB Image",
      loss: "GAN Loss + L1 Loss",
      architecture: "U-Net Generator"
    },
    {
      title: "PatchGAN Validation",
      desc: "Acts as the discriminator during training.",
      purpose: "Ensures generated images resemble real RGB satellite images.",
      evaluates: "Local image patches."
    },
    {
      title: "Final RGB Output",
      desc: "The completed, colorized image.",
      input: "Generator Output",
      output: "RGB Image File",
      purpose: "Downstream analysis and visualization."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl animate-page-slide-in">
      <div className="text-center mb-16 animate-heading">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">Project Architecture</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Complete end-to-end workflow of our AI-powered Infrared Satellite Image Enhancement and Colorization system.
        </p>
      </div>

      {/* 6 Cards Grid Section */}
      <div className="relative mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              className="relative group perspective-1000"
            >
              <Card className="h-full bg-card/40 backdrop-blur-md border-border/50 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:border-cyan-400/50">
                <CardHeader className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-3 rounded-xl bg-background/50 inline-block border border-border/50 group-hover:border-cyan-400/30 transition-colors">
                      {step.icon}
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-shadow">
                      {step.badge}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-muted-foreground mb-1 group-hover:text-cyan-400/70 transition-colors">STEP {step.id}</div>
                  <CardTitle className="text-xl text-foreground group-hover:text-cyan-300 transition-colors">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-foreground/70 leading-relaxed">
                    {step.desc}
                  </CardDescription>
                </CardContent>
              </Card>

            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Timeline Section */}
      <div className="relative mt-32 bg-card/20 border border-border/30 rounded-2xl p-8 backdrop-blur-sm animate-fade-card">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">Pipeline Timeline</h2>
          <p className="text-muted-foreground text-lg">Follow how an infrared satellite image is transformed into an enhanced RGB image.</p>
        </div>

        {/* Timeline visualization */}
        <div className="relative max-w-5xl mx-auto mb-16">
          {/* Labels above timeline */}
          <div className="hidden md:flex justify-between w-full mb-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className={`flex-1 text-center transition-colors duration-300 ${hoveredNode === 0 ? 'text-cyan-400' : ''}`}>Input</div>
            <div className={`flex-1 text-center transition-colors duration-300 ${hoveredNode === 1 ? 'text-cyan-400' : ''}`}>Processing</div>
            <div className={`flex-1 text-center transition-colors duration-300 ${hoveredNode === 2 ? 'text-cyan-400' : ''}`}>Enhancement</div>
            <div className={`flex-1 text-center transition-colors duration-300 ${hoveredNode === 3 ? 'text-cyan-400' : ''}`}>Translation</div>
            <div className={`flex-1 text-center transition-colors duration-300 ${hoveredNode === 4 ? 'text-cyan-400' : ''}`}>Validation</div>
            <div className={`flex-1 text-center transition-colors duration-300 ${hoveredNode === 5 ? 'text-cyan-400' : ''}`}>Output</div>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-0">
            {/* Horizontal Line Background (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-1.5 border border-cyan-400/50 bg-background/50 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <div className={`absolute top-0 bottom-0 w-32 bg-linear-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00E5FF] animate-pulse-travel ${hoveredNode !== null ? 'animation-play-state-paused opacity-20' : ''}`} />
            </div>
            
            {/* Vertical Line Background (Mobile) */}
            <div className="md:hidden absolute left-1/2 top-[5%] bottom-[5%] w-1.5 border border-cyan-400/50 bg-background/50 -translate-x-1/2 z-0 rounded-full overflow-hidden">
               <div className={`absolute left-0 right-0 h-32 bg-linear-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00E5FF] animate-particle-v ${hoveredNode !== null ? 'animation-play-state-paused opacity-20' : ''}`} />
            </div>

            {timelineDetails.map((node, index) => (
              <div 
                key={index} 
                className="relative z-10 flex flex-col items-center group cursor-pointer w-full md:w-1/6"
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setHoveredNode(hoveredNode === index ? null : index)}
              >
                {/* Node Circle */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 bg-background
                  ${hoveredNode === index ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] scale-125' : 'border-cyan-400/50 group-hover:border-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]'}`}
                >
                  <span className={`text-sm font-bold ${hoveredNode === index ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-muted-foreground'}`}>{index + 1}</span>
                </div>
                
                {/* Mobile Label */}
                <div className={`md:hidden mt-3 text-sm font-medium text-center transition-colors duration-300 ${hoveredNode === index ? 'text-cyan-400' : 'text-muted-foreground'}`}>{node.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Information Panel */}
        <div className="min-h-[320px] relative w-full max-w-4xl mx-auto border border-dashed border-border/40 rounded-2xl bg-card/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
          {timelineDetails.map((details, index) => (
            <div 
              key={`panel-${index}`}
              className={`absolute inset-0 transition-all duration-500 ease-out flex flex-col justify-center p-8 md:p-10
                ${hoveredNode === index ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 pointer-events-none z-0'}`}
            >
              <div className="pb-4">
                <h3 className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{details.title}</h3>
              </div>
              <div className="space-y-4">
                <p className="text-foreground/90 text-lg">{details.desc}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {details.input && (
                    <div className="bg-muted/20 p-4 rounded-xl border border-border/50 hover:border-cyan-400/30 transition-colors">
                      <span className="block text-xs text-cyan-400/70 uppercase tracking-wider mb-1 font-semibold">Input</span>
                      <span className="font-medium text-sm">{details.input}</span>
                    </div>
                  )}
                  {details.output && (
                    <div className="bg-muted/20 p-4 rounded-xl border border-border/50 hover:border-cyan-400/30 transition-colors">
                      <span className="block text-xs text-cyan-400/70 uppercase tracking-wider mb-1 font-semibold">Output</span>
                      <span className="font-medium text-sm">{details.output}</span>
                    </div>
                  )}
                  {details.architecture && (
                    <div className="bg-muted/20 p-4 rounded-xl border border-border/50 hover:border-cyan-400/30 transition-colors">
                      <span className="block text-xs text-cyan-400/70 uppercase tracking-wider mb-1 font-semibold">Architecture</span>
                      <span className="font-medium text-sm">{details.architecture}</span>
                    </div>
                  )}
                  {details.loss && (
                    <div className="bg-muted/20 p-4 rounded-xl border border-border/50 hover:border-cyan-400/30 transition-colors">
                      <span className="block text-xs text-cyan-400/70 uppercase tracking-wider mb-1 font-semibold">Loss Function</span>
                      <span className="font-medium text-sm">{details.loss}</span>
                    </div>
                  )}
                  {details.evaluates && (
                    <div className="bg-muted/20 p-4 rounded-xl border border-border/50 hover:border-cyan-400/30 transition-colors">
                      <span className="block text-xs text-cyan-400/70 uppercase tracking-wider mb-1 font-semibold">Evaluates</span>
                      <span className="font-medium text-sm">{details.evaluates}</span>
                    </div>
                  )}
                  {details.purpose && (
                    <div className={`bg-muted/20 p-4 rounded-xl border border-border/50 hover:border-cyan-400/30 transition-colors ${!details.evaluates && !details.architecture ? 'md:col-span-2' : ''}`}>
                      <span className="block text-xs text-cyan-400/70 uppercase tracking-wider mb-1 font-semibold">Purpose</span>
                      <span className="font-medium text-sm">{details.purpose}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Default state when nothing is hovered */}
          <div className={`absolute inset-0 transition-all duration-500 flex items-center justify-center text-center p-12
            ${hoveredNode === null ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <div>
              <Sparkles className="w-10 h-10 mx-auto mb-6 text-cyan-400/50 animate-pulse" />
              <p className="text-xl font-medium text-foreground/80">Hover over any stage in the timeline above to view detailed technical specifications.</p>
              <p className="text-sm mt-3 text-cyan-400/60">Explore the transformation pipeline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
