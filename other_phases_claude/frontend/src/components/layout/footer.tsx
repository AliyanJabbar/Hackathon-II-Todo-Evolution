import Link from "next/link";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-white group"
            >
              <Image
                src="/logo.png"
                alt="taskgenie"
                width={180}
                height={100}
                className="flex h-8 w-auto md:h-10 transition-transform group-hover:scale-105"
              />
              <span className="text-lg tracking-tight bg-linear-to-r from-white to-violet-400 bg-clip-text text-transparent">
                TaskGenie
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The AI-powered task manager designed for high-performance
              individuals. Organize your life, one pixel at a time.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-slate-100">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/#features"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Features
              </Link>
              <Link
                href="/#demo"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Demo
              </Link>
              <Link
                href="/#pricing"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Pricing
              </Link>
              <Link
                href="/#features"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Start Managing
              </Link>
            </nav>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-slate-100">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="https://www.linkedin.com/in/aliyan-jabbar/"
                target="_blank"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Community
              </Link>
              <Link
                href="https://github.com/AliyanJabbar/"
                target="_blank"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Github
              </Link>
              <Link
                href="mailto:aliyanjabbardev@gmail.com"
                target="_blank"
                className="text-sm text-slate-400 transition-colors hover:text-indigo-400"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Column 4: Legal & Social */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-slate-100">Connect</h4>
            <div className="flex gap-4">
              <Link
                href="https://github.com/AliyanJabbar"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition-all hover:bg-indigo-600 hover:text-white"
              >
                <Github size={20} />
              </Link>
              <Link
                href="https://x.com/aliyanjabbar_ai"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 transition-all hover:bg-sky-500 hover:text-white"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/aliyan-jabbar"
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
            &copy; {new Date().getFullYear()} TaskGenie Inc. All rights
            reserved.
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
