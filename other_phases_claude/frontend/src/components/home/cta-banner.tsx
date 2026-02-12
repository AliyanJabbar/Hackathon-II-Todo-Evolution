"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function CtaBanner() {
  return (
    <section className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-16 text-center shadow-2xl"
      >
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Get 1% Better Every Day
          </h2>
          <p className="mb-8 text-indigo-100">
            Stop letting tasks slip through the cracks. Join the hackathon winners using TaskGenie.
          </p>
          <Link
            href="/todo"
            className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-indigo-600 transition-transform hover:scale-105 shadow-lg"
          >
            Try It Now
          </Link>
        </div>
        
        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/20 blur-3xl mix-blend-overlay"></div>
      </motion.div>
    </section>
  );
}