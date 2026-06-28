"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const applications = [
    "Disaster Monitoring & Assessment",
    "Military Surveillance & Reconnaissance",
    "Environmental & Climate Monitoring",
    "Agriculture & Crop Health",
    "Urban Planning & Development",
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About the Project</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Bharatiya Antariksh Hackathon Submission
        </p>
      </motion.div>

      <div className="space-y-12 text-lg text-foreground/80 leading-relaxed">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Problem Statement</h2>
          <p className="bg-card/30 p-6 rounded-2xl border border-border/50">
            Thermal Infrared (IR) satellite imagery is crucial for nighttime observation, temperature profiling, and penetrating certain atmospheric conditions. However, it suffers from low spatial resolution and lacks natural color channels, making rapid visual interpretation difficult for human analysts who are accustomed to high-fidelity RGB imagery.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Our Objective</h2>
          <p className="bg-card/30 p-6 rounded-2xl border border-border/50">
            We developed an end-to-end AI pipeline to artificially colorize and enhance the resolution of IR satellite images. By combining Super-Resolution Convolutional Neural Networks (SRCNN) with Pix2Pix Generative Adversarial Networks (GANs), our system predicts the corresponding RGB channels from thermal signatures, achieving state-of-the-art structural similarity.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Downstream Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="flex items-center gap-3 p-4 bg-background/50 rounded-xl border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium">{app}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
