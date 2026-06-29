"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2 } from "lucide-react";
import { ImageComparison } from "./ImageComparison";
import { MetricsPanel } from "./MetricsPanel";
import { PerformanceChart } from "./PerformanceChart";
import { PipelineStatus } from "./PipelineStatus";
import { ExportPanel } from "./ExportPanel";

interface ResultsDashboardProps {
  results: {
    original: string;
    enhanced: string;
    generated: string;
    groundTruth?: string;
  };
  metrics?: any;
}

export function ResultsDashboard({ results, metrics }: ResultsDashboardProps) {
  const steps = ["Upload", "Preprocess", "Enhancement", "Colorization", "Evaluation"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-[1400px] mx-auto flex flex-col gap-4 mt-8 px-4 lg:px-8 xl:min-h-[85vh]"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div>
          <h2 className="text-[28px] font-bold text-primary flex items-center gap-3">
            Inference Results
            <span className="flex items-center gap-1 text-[11px] font-medium bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </h2>
          <p className="text-[13px] text-muted-foreground">AI-powered Infrared Enhancement and Colorization</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-muted-foreground uppercase">Processing Time</span>
            <span className="text-[14px] font-mono font-medium text-foreground">1.42s</span>
          </div>
          <div className="h-8 w-px bg-border/50 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-muted-foreground uppercase">Model Version</span>
            <span className="text-[14px] font-mono font-medium text-cyan-400">v2.1.0-stable</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-col xl:grid xl:grid-cols-12 gap-4 min-h-0 pt-2">
        
        {/* Top Section: Images (Left) + Metrics (Right) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <ImageComparison images={results} />
          </div>
        </div>
        
        <div className="col-span-12 xl:col-span-4 flex flex-col min-h-[300px]">
          <MetricsPanel metrics={metrics} />
        </div>

        {/* Bottom Section: Chart + Status + Export */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 min-h-[180px]">
            <PerformanceChart />
          </div>
          <div className="col-span-1 min-h-[180px]">
            <PipelineStatus />
          </div>
          <div className="col-span-1 min-h-[180px]">
            <ExportPanel onRunAgain={() => window.location.reload()} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
