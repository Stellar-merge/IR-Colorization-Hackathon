"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { epoch: 0, generatorLoss: 14.2, discriminatorLoss: 0.8 },
  { epoch: 10, generatorLoss: 11.5, discriminatorLoss: 0.6 },
  { epoch: 20, generatorLoss: 9.8, discriminatorLoss: 0.4 },
  { epoch: 30, generatorLoss: 8.4, discriminatorLoss: 0.35 },
  { epoch: 40, generatorLoss: 7.9, discriminatorLoss: 0.3 },
  { epoch: 50, generatorLoss: 7.2, discriminatorLoss: 0.25 },
  { epoch: 60, generatorLoss: 6.8, discriminatorLoss: 0.2 },
  { epoch: 70, generatorLoss: 6.5, discriminatorLoss: 0.18 },
  { epoch: 80, generatorLoss: 6.2, discriminatorLoss: 0.15 },
  { epoch: 90, generatorLoss: 6.0, discriminatorLoss: 0.12 },
  { epoch: 100, generatorLoss: 5.9, discriminatorLoss: 0.1 },
];

export function PerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-full"
    >
      <Card className="h-full bg-card/40 backdrop-blur-md border border-border/50 flex flex-col p-4">
        <div className="flex items-center justify-between mb-2 border-b border-border/50 pb-2">
          <h3 className="text-[14px] font-semibold text-foreground">Training Loss Curve</h3>
          <span className="text-[12px] text-muted-foreground">Epoch 100</span>
        </div>
        <div className="flex-1 w-full min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, bottom: -10, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="epoch" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(3,7,18,0.9)', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} 
                iconSize={6}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="generatorLoss" 
                name="Generator"
                stroke="#00E5FF" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#00E5FF" }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="discriminatorLoss" 
                name="Discriminator"
                stroke="#2563EB" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#2563EB" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
