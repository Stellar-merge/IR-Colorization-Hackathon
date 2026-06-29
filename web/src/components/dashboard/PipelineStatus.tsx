"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";
import { motion } from "framer-motion";

export function PipelineStatus() {
  const statuses = [
    { label: "Dataset Loaded", active: true },
    { label: "Generator Active", active: true },
    { label: "SRCNN Active", active: true },
    { label: "GPU Available", active: true },
    { label: "Metrics Ready", active: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
        <h3 className="text-[14px] font-semibold text-foreground">System Status</h3>
        <span className="text-[12px] text-green-400 font-medium">All Systems Nominal</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4 items-center">
        {statuses.map((status, i) => (
          <div key={status.label} className="flex items-center gap-2 text-[12px] text-foreground">
            {status.active ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <CircleDashed className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
