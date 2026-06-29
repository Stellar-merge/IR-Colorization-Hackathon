"use client";

import { useRef } from "react";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { UploadPanel } from "@/components/dashboard/UploadPanel";
import { PipelineAnimation } from "@/components/dashboard/PipelineAnimation";
import { ResultsDashboard } from "@/components/dashboard/ResultsDashboard";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { AnimatedHeading, FlickerText } from "@/components/animations";

export default function Home() {
  const { 
    isProcessing, 
    results, 
    metrics, 
    setProcessing, 
    setResults, 
    setMetrics 
  } = useAppStore();

  const uploadRef = useRef<HTMLDivElement>(null);

  const handleRunInferenceClick = () => {
    if (uploadRef.current) {
      const y = uploadRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleUpload = async (file: File) => {
    setProcessing(true);
    setResults(null);
    setMetrics(null);
    
    // Smooth scroll to the pipeline section
    setTimeout(() => {
      window.scrollBy({ top: 400, behavior: "smooth" });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/inference", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();
      
      // Mock API simulation logic
      setTimeout(() => {
        setProcessing(false);
        setResults({
          original: URL.createObjectURL(file),
          enhanced: "/samples/ir/tile_0000.png",
          generated: "/samples/rgb/tile_0000.png",
          groundTruth: "/samples/rgb/tile_0000.png",
        });
        setMetrics({
          psnr: 32.45,
          ssim: 0.945,
          fid: 18.7,
          inferenceTime: 0.85,
        });
        toast.success("Image successfully processed!");
      }, 4500);
      
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
      console.error(error);
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-12 pb-24 px-4 sm:px-6 relative w-full overflow-hidden">
      <HeroSection onRunInferenceClick={handleRunInferenceClick} />
      
      <div id="inference-gateway" ref={uploadRef} className="w-full max-w-4xl flex flex-col items-center justify-center z-10 space-y-8 mt-12 mb-8">
        <AnimatedHeading className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          <FlickerText delay={0.2}>Imagery Reconstruction Terminal</FlickerText>
        </AnimatedHeading>
        <UploadPanel onUpload={handleUpload} />
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            <PipelineAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && (
          <ResultsDashboard results={results} metrics={metrics} />
        )}
      </AnimatePresence>
    </div>
  );
}
