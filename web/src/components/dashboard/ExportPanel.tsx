"use client";

import { motion } from "framer-motion";
import { Download, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportPanelProps {
  onRunAgain?: () => void;
}

export function ExportPanel({ onRunAgain }: ExportPanelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="h-full bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
        <h3 className="text-[14px] font-semibold text-foreground">Export Panel</h3>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">
        <Button variant="secondary" className="w-full justify-start h-9 text-[13px] bg-background/50 hover:bg-cyan-900/30 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition-all">
          <Download className="w-4 h-4 mr-2" /> Download Results
        </Button>
        <Button variant="secondary" className="w-full justify-start h-9 text-[13px] bg-background/50 hover:bg-cyan-900/30 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30 transition-all">
          <FileText className="w-4 h-4 mr-2" /> Export PDF Report
        </Button>
        <Button variant="outline" onClick={onRunAgain} className="w-full justify-start h-9 text-[13px] border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all mt-1">
          <RefreshCw className="w-4 h-4 mr-2" /> Run New Inference
        </Button>
      </div>
    </motion.div>
  );
}
