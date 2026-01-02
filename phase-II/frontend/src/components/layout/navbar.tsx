"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, Menu, X, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  const navLinks = [
    { name: "Demo", href: "/todo" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-50 w-full border-b border-violet-500/10 bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
            <span className="text-lg tracking-tight bg-gradient-to-r from-white to-violet-400 bg-clip-text text-transparent">
              TaskGenie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden gap-8 text-sm font-medium text-slate-400 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-violet-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Auth Logic */}
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-violet-900/20 border border-violet-500/20" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer border border-violet-500/20 hover:border-violet-500/50 transition-colors">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="bg-violet-600 text-white">
                        {getInitials(session.user.name, session.user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-slate-950 border-violet-500/20 text-slate-200"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-slate-400">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-violet-500/10" />
                    <DropdownMenuItem className="focus:bg-violet-500/10 focus:text-violet-400 cursor-pointer">
                      <Link href="/todo" className="flex gap-2">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Manage Tasks</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="focus:bg-red-500/10 focus:text-red-400 cursor-pointer text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:block rounded-full bg-violet-600 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-violet-500 hover:scale-105 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/5 text-violet-400 md:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-violet-500/10 bg-slate-950/95 p-6 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-violet-500/10 hover:text-violet-400"
                >
                  {link.name}
                  <ChevronRight size={16} className="text-violet-500" />
                </Link>
              ))}

              {!session && (
                <div className="mt-4 flex flex-col gap-3 border-t border-violet-500/10 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-lg border border-violet-500/20 text-sm font-medium text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    Register For Free
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
