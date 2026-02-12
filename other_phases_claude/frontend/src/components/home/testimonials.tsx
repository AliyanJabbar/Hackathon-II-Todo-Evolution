"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Hackathon Winner",
    content: "TaskGenie's AI prioritization was the only reason our team finished the MVP on time.",
    avatar: "AR"
  },
  {
    name: "Sarah Chen",
    role: "Senior Dev",
    content: "The <50ms sync is real. It's the first todo app that doesn't feel like it's lagging behind my thoughts.",
    avatar: "SC"
  },
  {
    name: "James Wilson",
    role: "Product Manager",
    content: "Clean, fast, and dark mode that actually looks good. My daily driver now.",
    avatar: "JW"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonial" className="container mx-auto px-4 py-24">
      <h2 className="mb-16 text-center text-3xl font-bold text-white">Trusted by builders</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xs"
          >
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-violet-400 text-violet-400" />
              ))}
            </div>
            <p className="mb-6 text-slate-300 italic">"{t.content}"</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}