"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center pt-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[130px] mix-blend-screen" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 backdrop-blur-md"
        >
          <CheckCircle2 size={16} className="text-violet-400" />
          The AI Productivity Standard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          Organize chaos. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Achieve clarity.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-400"
        >
          The todo app built for high-performance humans. 
          Capture tasks instantly, prioritize with AI, and never miss a deadline again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/todo"
            className="group relative flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-transform hover:scale-105 active:scale-95"
          >
            Start Organizing
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}