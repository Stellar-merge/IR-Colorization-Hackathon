"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Satellite, 
  Database, 
  Maximize, 
  ThermometerSun, 
  Palette, 
  Split, 
  ArrowRight,
  ArrowDown,
  Search,
  X,
  ChevronDown,
  Layers,
  Settings2,
  RefreshCw,
  Crop,
  ShieldCheck
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const DATASET_STATS = [
  {
    icon: <Satellite className="w-8 h-8 text-cyan-400" />,
    value: "Landsat 8",
    title: "Source",
    desc: "USGS Earth Observation Satellite",
  },
  {
    icon: <Database className="w-8 h-8 text-cyan-400" />,
    value: "50,000",
    title: "Dataset Size",
    desc: "Paired IR–RGB training samples",
  },
  {
    icon: <Maximize className="w-8 h-8 text-cyan-400" />,
    value: "256 × 256",
    title: "Patch Size",
    desc: "Image patches used for training",
  },
  {
    icon: <ThermometerSun className="w-8 h-8 text-cyan-400" />,
    value: "Band 10",
    title: "Input",
    desc: "Thermal Infrared (TIRS)",
  },
  {
    icon: <Palette className="w-8 h-8 text-cyan-400" />,
    value: "Bands 4 • 3 • 2",
    title: "Target",
    desc: "Natural RGB Composite",
  },
  {
    icon: <Split className="w-8 h-8 text-cyan-400" />,
    value: "80 / 10 / 10",
    title: "Training Split",
    desc: "Train • Validation • Test",
  }
];

const PREP_PIPELINE = [
  { id: 1, label: "Landsat Scene", info: "Raw multi-spectral satellite imagery downloaded from USGS." },
  { id: 2, label: "Band Extraction", info: "Isolating Thermal (B10) and RGB (B4,B3,B2) bands." },
  { id: 3, label: "Image Registration", info: "Aligning bands to ensure pixel-perfect spatial correspondence." },
  { id: 4, label: "Patch Generation", info: "Slicing massive scenes into 256x256 computational patches." },
  { id: 5, label: "Normalization", info: "Scaling pixel values to [-1, 1] for stable neural network training." },
  { id: 6, label: "Training Dataset", info: "Final prepared pairs ready for the generator model." },
];

const PIE_DATA = [
  { name: 'Training', value: 80, color: '#00E5FF' },
  { name: 'Validation', value: 10, color: '#3B82F6' },
  { name: 'Testing', value: 10, color: '#8B5CF6' },
];

const BAR_DATA = [
  { name: 'Urban', count: 12500 },
  { name: 'Vegetation', count: 18000 },
  { name: 'Water', count: 7500 },
  { name: 'Agriculture', count: 8500 },
  { name: 'Bare Land', count: 3500 },
];

export default function DatasetPage() {
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredImageType, setHoveredImageType] = useState<"IR" | "RGB" | null>(null);

  const sampleImages = [
    { id: 1, ir: "/samples/ir/tile_0000.png", rgb: "/samples/rgb/tile_0000.png" },
    { id: 2, ir: "/samples/ir/tile_0001.png", rgb: "/samples/rgb/tile_0001.png" },
    { id: 3, ir: "/samples/ir/tile_0002.png", rgb: "/samples/rgb/tile_0002.png" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl animate-page-slide-in">
      
      {/* 1. Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-cyan-400">
          Training Dataset
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Carefully prepared Landsat 8 satellite imagery used to train the InfraVision AI model.
        </p>
      </motion.div>

      {/* 2. Dataset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 mb-24">
        {DATASET_STATS.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <Card className="h-full bg-card/20 backdrop-blur-md border-border/40 hover:border-cyan-400/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-cyan-400/10 transition-colors" />
              <CardContent className="p-6 flex flex-col h-full justify-between relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-background/50 rounded-xl border border-border/50 group-hover:border-cyan-400/30 transition-colors">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-cyan-300 transition-colors">{stat.value}</h3>
                  <p className="text-sm text-foreground/70">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. Dataset Preparation Pipeline */}
      <div className="mb-24 relative p-8 bg-card/10 border border-border/30 rounded-3xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-8 text-center text-cyan-400">Dataset Preparation Pipeline</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center relative z-10">
          {PREP_PIPELINE.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div 
                className="relative group cursor-pointer w-full md:w-auto my-2 md:my-0"
                onClick={() => setActivePipelineStep(activePipelineStep === step.id ? null : step.id)}
              >
                <div className={`px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 text-center text-sm font-semibold whitespace-nowrap
                  ${activePipelineStep === step.id 
                    ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                    : 'bg-background/80 border-border/60 hover:border-cyan-400/50 hover:bg-card/60'}`}
                >
                  {step.label}
                </div>
                
                <AnimatePresence>
                  {activePipelineStep === step.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 p-4 bg-background border border-cyan-400/50 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 text-center text-sm"
                    >
                      {step.info}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-l border-t border-cyan-400/50 rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {idx < PREP_PIPELINE.length - 1 && (
                <div className="hidden md:flex px-4 items-center justify-center text-cyan-400/30">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
              {idx < PREP_PIPELINE.length - 1 && (
                <div className="md:hidden flex items-center justify-center text-cyan-400/30 my-2">
                  <ArrowDown className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. Sample Image Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-10 text-center text-cyan-400">Dataset Samples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleImages.map((sample) => (
            <div key={sample.id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl">
                
                <div className="grid grid-cols-2 aspect-video md:aspect-square lg:aspect-[4/3] bg-black">
                  {/* IR Input */}
                  <div 
                    className="relative w-full h-full border-r border-border/30 overflow-hidden cursor-zoom-in"
                    onMouseEnter={() => setHoveredImageType("IR")}
                    onMouseLeave={() => setHoveredImageType(null)}
                    onClick={() => setSelectedImage(sample.ir)}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${sample.ir})`, filter: 'grayscale(100%)' }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Input</span>
                    </div>
                  </div>
                  
                  {/* RGB Target */}
                  <div 
                    className="relative w-full h-full overflow-hidden cursor-zoom-in"
                    onMouseEnter={() => setHoveredImageType("RGB")}
                    onMouseLeave={() => setHoveredImageType(null)}
                    onClick={() => setSelectedImage(sample.rgb)}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${sample.rgb})` }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Target</span>
                    </div>
                  </div>
                </div>

                {/* Floating Interactive Hover Info */}
                <div className="h-16 flex items-center justify-center bg-background/50 backdrop-blur-md border-t border-border/50">
                  <AnimatePresence mode="wait">
                    {hoveredImageType === "IR" ? (
                      <motion.div 
                        key="ir"
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="text-center"
                      >
                        <span className="text-sm font-semibold text-cyan-400 block">Band 10</span>
                        <span className="text-xs text-muted-foreground">Thermal Infrared</span>
                      </motion.div>
                    ) : hoveredImageType === "RGB" ? (
                      <motion.div 
                        key="rgb"
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="text-center"
                      >
                        <span className="text-sm font-semibold text-blue-400 block">Ground Truth (Bands 4,3,2)</span>
                        <span className="text-xs text-muted-foreground">Natural Color Composite</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="default"
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="text-muted-foreground/50 text-sm flex items-center"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Hover to inspect
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Data Distribution Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-10 text-center text-cyan-400">Data Distribution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="bg-card/20 backdrop-blur-md border-border/40 hover:border-cyan-400/20 transition-colors">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Dataset Split</CardTitle>
            </CardHeader>
            <CardContent className="h-80 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderColor: 'rgba(0, 229, 255, 0.3)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                    formatter={(value) => [`${value}%`, 'Split']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-foreground">50K</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Pairs</span>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-center gap-6 pb-6 text-sm">
              {PIE_DATA.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-card/20 backdrop-blur-md border-border/40 hover:border-cyan-400/20 transition-colors">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Land Cover Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    tickMargin={10}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis 
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 229, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderColor: 'rgba(0, 229, 255, 0.3)', borderRadius: '8px' }}
                    itemStyle={{ color: '#00E5FF' }}
                  />
                  <Bar dataKey="count" fill="#00E5FF" radius={[4, 4, 0, 0]}>
                    {BAR_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#00E5FF' : 'rgba(0, 229, 255, 0.4)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* 6. Data Preparation Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-10 text-center text-cyan-400">Data Preparation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/10 border-border/30 hover:bg-card/30 hover:border-cyan-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <Crop className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Patch Extraction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Large satellite scenes are systematically divided into smaller 256x256 image patches to fit network memory constraints.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/10 border-border/30 hover:bg-card/30 hover:border-cyan-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <Settings2 className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Normalization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pixel values across all thermal and optical bands are globally normalized to a range of [-1, 1] before training.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/10 border-border/30 hover:bg-card/30 hover:border-cyan-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <Layers className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Pair Generation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every extracted thermal infrared patch is meticulously aligned with its corresponding natural RGB image target.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/10 border-border/30 hover:bg-card/30 hover:border-cyan-400/40 transition-all duration-300">
            <CardContent className="p-6">
              <RefreshCw className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Data Augmentation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Random flips, orthogonal rotations, and cropping are applied dynamically during training to improve model generalization.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 7. Dataset Information Panel */}
      <div className="mb-24 max-w-4xl mx-auto">
        <div 
          className="bg-card/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl overflow-hidden cursor-pointer hover:bg-card/40 transition-colors"
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
        >
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Database className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold">Technical Specifications</h3>
            </div>
            <ChevronDown className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${isPanelExpanded ? 'rotate-180' : ''}`} />
          </div>
          
          <AnimatePresence>
            {isPanelExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 border-t border-border/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-6">
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Satellite</span>
                      <span className="font-semibold text-foreground">Landsat 8</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="font-semibold text-foreground">USGS</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Input</span>
                      <span className="font-semibold text-cyan-400">Thermal IR (Band 10)</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-semibold text-blue-400">RGB (Bands 4, 3, 2)</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Patch Size</span>
                      <span className="font-semibold text-foreground">256 × 256 px</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Image Format</span>
                      <span className="font-semibold text-foreground">PNG (Lossless)</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Training Framework</span>
                      <span className="font-semibold text-foreground">PyTorch</span>
                    </div>
                    <div className="flex justify-between border-b border-border/30 pb-2">
                      <span className="text-muted-foreground">Dataset Size</span>
                      <span className="font-semibold text-foreground">~50 GB</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 8. Visual Story & Footer Note */}
      <div className="mb-16">
        <div className="bg-card/10 rounded-3xl p-8 md:p-12 border border-border/30 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5" />
          
          <Card className="bg-background/80 backdrop-blur-md border-cyan-400/20 max-w-3xl mx-auto text-left shadow-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Why this dataset?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Landsat 8 provides accurately aligned Thermal Infrared and RGB spectral bands captured simultaneously. This eliminates spatial distortion and parallax errors, making it exceptionally well-suited for supervised image-to-image translation tasks such as our infrared enhancement and colorization pipeline.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Note: In a real implementation we would dynamically show either IR or RGB based on what was clicked, 
                  but for the hackathon prototype viewing the image directly is sufficient */}
              <div 
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${selectedImage})` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
