"use client";

import { motion } from "motion/react";

const stats = [
  { label: "Tasks Completed", value: "1.2M+" },
  { label: "Time Saved/Week", value: "4.5h" },
  { label: "Active Users", value: "50k+" },
  { label: "AI Accuracy", value: "99.2%" },
];

export default function StatSection() {
  return (
    <section className="border-y border-slate-900 bg-slate-950/50 py-24 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}