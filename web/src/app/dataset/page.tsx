"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function DatasetPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Training Dataset</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Curated Landsat 8 satellite imagery covering geographically diverse regions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="bg-card/40 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-3xl font-bold text-primary mb-2">200+</h3>
            <p className="text-muted-foreground">Paired Training Tiles</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-3xl font-bold text-secondary mb-2">256x256</h3>
            <p className="text-muted-foreground">Native Resolution</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-3xl font-bold text-accent mb-2">B10 & B4,3,2</h3>
            <p className="text-muted-foreground">Landsat Spectral Bands</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Sample Pairs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-border/50 flex flex-col"
          >
            <div className="grid grid-cols-2 h-48 sm:h-64 bg-muted">
              {/* Using the placeholder for visual demo in hackathon */}
              <div 
                className="w-full h-full bg-cover bg-center border-r border-background"
                style={{ backgroundImage: `url('/placeholder-enhanced.jpg')`, filter: 'grayscale(100%)' }}
              />
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/placeholder-generated.jpg')` }}
              />
            </div>
            <div className="bg-card p-3 flex justify-between text-sm font-medium">
              <span>Infrared (Input)</span>
              <span>RGB (Target)</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
