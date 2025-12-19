"use client";

import { motion } from "motion/react";
import { BrainCircuit, Zap, Users, BarChart3 } from "lucide-react";

const features = [
  {
    title: "AI Prioritization",
    desc: "Our LLM analyzes your list and automatically moves urgent tasks to the top.",
    icon: BrainCircuit,
    delay: 0,
  },
  {
    title: "Instant Sync",
    desc: "Move from phone to laptop without missing a beat. <50ms sync time.",
    icon: Zap,
    delay: 0.1,
  },
  {
    title: "Collaborative Mode",
    desc: "Share lists with your hackathon team and track progress in real-time.",
    icon: Users,
    delay: 0.2,
  },
  {
    title: "Productivity Insights",
    desc: "Visual charts showing your completion velocity and focus hours.",
    icon: BarChart3,
    delay: 0.3,
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: item.delay }}
            whileHover={{ y: -5 }}
            className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-violet-500/50 hover:bg-slate-900"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500 group-hover:text-white">
              <item.icon size={24} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}