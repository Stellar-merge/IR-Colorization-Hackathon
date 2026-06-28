"use client";

import { useRef, useEffect } from "react";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { UploadPanel } from "@/components/dashboard/UploadPanel";
import { PipelineAnimation } from "@/components/dashboard/PipelineAnimation";
import { ImageComparison } from "@/components/dashboard/ImageComparison";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { AnimatedHeading, FlickerText, RevealSection } from "@/components/animations";

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
      
      // Since it's a mock API, we pass the local object URL directly to the original state
      // so we don't have to deal with base64 conversion in this demo.
      const originalObjectUrl = URL.createObjectURL(file);
      
      setResults({
        original: originalObjectUrl,
        enhanced: data.images.enhanced,
        generated: data.images.generated,
      });
      setMetrics(data.metrics);
      
      toast.success("Image successfully processed!");
      
      // Scroll to results
      setTimeout(() => {
        window.scrollBy({ top: 600, behavior: "smooth" });
      }, 500);
      
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  // Pre-load placeholder images so they don't pop-in
  useEffect(() => {
    const img1 = new Image();
    img1.src = "/placeholder-enhanced.jpg";
    const img2 = new Image();
    img2.src = "/placeholder-generated.jpg";
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 pb-24">
      <HeroSection onRunInferenceClick={handleRunInferenceClick} />
      
      <div id="inference-gateway" ref={uploadRef} className="w-full max-w-5xl mt-12 mb-24 scroll-mt-24">
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
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-7xl flex flex-col items-center gap-12 mt-12"
          >
            <div className="w-full text-center">
              <h2 className="text-3xl font-bold mb-2 text-primary">Enhancement Results</h2>
              <p className="text-muted-foreground">High-fidelity translation powered by Pix2Pix.</p>
            </div>
            
            <ImageComparison images={results} />
            <MetricCards metrics={metrics} />
            
            <div className="w-full max-w-5xl mt-16">
              <PerformanceChart />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
