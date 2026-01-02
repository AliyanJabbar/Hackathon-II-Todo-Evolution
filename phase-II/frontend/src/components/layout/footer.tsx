import Link from "next/link";
import { Github, Twitter, Linkedin, CheckSquare, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
                <CheckSquare size={18} className="text-white" />
              </div>
              <span className="text-lg tracking-tight">TaskGenie</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The AI-powered task manager designed for high-performance individuals. 
              Organize your life, one pixel at a time.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-slate-100">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#features" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Features
              </Link>
              <Link href="#demo" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Live Demo
              </Link>
              <Link href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Changelog
              </Link>
              <Link href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Integration
              </Link>
            </nav>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-slate-100">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Community
              </Link>
              <Link href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Documentation
              </Link>
              <Link href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                API Reference
              </Link>
              <Link href="#" className="text-sm text-slate-400 transition-colors hover:text-indigo-400">
                Status
              </Link>
            </nav>
          </div>

          {/* Column 4: Legal & Social */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-slate-100">Connect</h4>
            <div className="flex gap-4">
              <Link 
                href="https://github.com" 
                target="_blank" 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition-all hover:bg-indigo-600 hover:text-white"
              >
                <Github size={20} />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition-all hover:bg-sky-500 hover:text-white"
              >
                <Twitter size={20} />
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition-all hover:bg-blue-700 hover:text-white"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TaskGenie Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span>Made with</span>
            <Heart size={14} className="fill-red-500 text-red-500" />
            <span>for the 2025 Hackathon.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}