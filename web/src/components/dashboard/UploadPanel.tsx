"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Image as ImageIcon, CheckCircle2, X } from "lucide-react";
import { FadeCard, FlickerText } from "@/components/animations";
import { Button } from "@/components/ui/button";

interface UploadPanelProps {
  onUpload: (file: File) => void;
}

export function UploadPanel({ onUpload }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateAndSetFile = useCallback((file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/tiff"];
    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, [validateAndSetFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  }, [validateAndSetFile]);

  const handleStartInference = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-1">
      <FadeCard 
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-10 transition-colors backdrop-blur-md bg-card
          ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
        `}
      >
        <div 
          className="absolute inset-0" 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 to-transparent opacity-50" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none">
          {!selectedFile ? (
            <>
              <div className="mb-6 p-4 rounded-full bg-background border border-border shadow-lg">
                <UploadCloud className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 pointer-events-auto">
                <FlickerText delay={0.1}>Upload Infrared Image</FlickerText>
              </h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-sm pointer-events-auto">
                <FlickerText delay={0.2}>
                  Drag and drop your satellite IR imagery here, or click to browse. Supports PNG, JPG, and TIFF.
                </FlickerText>
              </p>
              
              <label className="cursor-pointer pointer-events-auto">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.tiff" 
                  onChange={handleFileInput}
                />
                <div className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  Browse Files
                </div>
              </label>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full pointer-events-auto"
            >
              <div className="flex items-center gap-4 w-full p-4 rounded-xl border border-border/50 bg-background/50 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <h4 className="font-medium truncate">{selectedFile.name}</h4>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <Button 
                onClick={handleStartInference} 
                className="w-full h-12 text-lg shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Run Model
              </Button>
            </motion.div>
          )}
        </div>
      </FadeCard>
    </div>
  );
}
