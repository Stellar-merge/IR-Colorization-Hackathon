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
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.65, duration: 1.0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">About the Project</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Bharatiya Antariksh Hackathon Submission
        </p>
      </motion.div>

      <div className="space-y-12 text-lg text-foreground/80 leading-relaxed">
        <motion.section
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.65, duration: 1.0 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Problem Statement</h2>
          <div className="bg-card/30 p-6 rounded-2xl border border-border/50 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all duration-300 flex flex-col gap-4 text-foreground/90">
            <p>
              Satellite remote sensing frequently relies on infrared (IR) sensors to capture data during night time or under adverse weather conditions. However, IR images are inherently monochrome, suffer from low contrast, and lack the rich semantic textures found in visible-spectrum (RGB) imagery. This makes it difficult for human analysts and computer vision models to accurately identify objects like vehicles, buildings, roads, and vegetation.
            </p>
            <p>
              This challenge focuses on developing an end-to-end framework that simultaneously enhances the structural details of IR satellite images and predicts realistic colorization (RGB translation). By transforming low-visibility IR data into high-fidelity, colorized images, this solution will drastically improve situational awareness and automated object interpretation.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.65, duration: 1.0, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Our Objective</h2>
          <p className="bg-card/30 p-6 rounded-2xl border border-border/50 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all duration-300">
            We developed an end-to-end AI pipeline to artificially colorize and enhance the resolution of IR satellite images. By combining Super-Resolution Convolutional Neural Networks (SRCNN) with Pix2Pix Generative Adversarial Networks (GANs), our system predicts the corresponding RGB channels from thermal signatures, achieving state-of-the-art structural similarity.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.65, duration: 1.0, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Downstream Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app} className="group flex items-center gap-3 p-4 bg-background/50 rounded-xl border border-border/50 hover:border-cyan-500/30 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent transition-all duration-300 cursor-default">
                <CheckCircle2 className="w-5 h-5 text-accent group-hover:text-cyan-400 transition-colors duration-300" />
                <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">{app}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
