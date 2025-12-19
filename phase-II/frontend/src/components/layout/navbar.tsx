"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckSquare } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-lg tracking-tight">TaskFlow</span>
        </Link>
        
        <nav className="hidden gap-6 text-sm font-medium text-slate-400 md:flex">
          <Link href="#demo" className="hover:text-white transition-colors">Demo</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="flex gap-4">
          <button className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white">
            Log in
          </button>
          <button className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition-transform hover:scale-105">
            Sign Up Free
          </button>
        </div>
      </div>
    </motion.header>
  );
}