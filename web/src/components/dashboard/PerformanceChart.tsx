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
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Training Loss Convergence</CardTitle>
          <CardDescription>Generator (U-Net) vs Discriminator (PatchGAN) over 100 epochs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="epoch" 
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(3,7,18,0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="generatorLoss" 
                  name="Generator Loss"
                  stroke="#00E5FF" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#030712", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#00E5FF" }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="discriminatorLoss" 
                  name="Discriminator Loss"
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#030712", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
