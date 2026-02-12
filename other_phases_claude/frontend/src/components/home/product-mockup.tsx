"use client";

import { motion } from "motion/react";
import {
  Layout,
  CheckCircle2,
  Circle,
  Inbox,
  Calendar,
  Star,
  Hash,
} from "lucide-react";

export default function ProductMockup() {
  const sampleTasks = [
    {
      title: "Fix the navigation bug",
      status: "done",
      color: "text-emerald-500",
    },
    {
      title: "Prepare hackathon presentation",
      status: "todo",
      color: "text-slate-600",
    },
    { title: "Review pull requests", status: "todo", color: "text-slate-600" },
    {
      title: "Update documentation for AI module",
      status: "todo",
      color: "text-slate-600",
    },
    {
      title: "Call with the design team",
      status: "todo",
      color: "text-slate-600",
    },
  ];

  return (
    <section id="demo" className="container mx-auto px-4 py-24">
      {/* 1. External Text Section */}
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-white md:text-5xl"
        >
          Manage your tasks efficiently with{" "}
          <span className="text-violet-400">TaskGenie</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-slate-400 md:text-lg"
        >
          Everything you need to go from "to-do" to "done." Experience a
          workspace designed for speed and clarity.
        </motion.p>
      </div>

      {/* 2. Responsive Mockup Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-5xl"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 rounded-[1.5rem] md:rounded-[2.5rem] bg-linear-to-r from-violet-600 to-indigo-600 opacity-20 blur-2xl" />

        <div className="relative rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 bg-slate-950 p-2 md:p-4 shadow-2xl">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            {/* Header / Search Bar */}
            <div className="flex h-12 w-full items-center justify-between bg-slate-800/50 px-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-32 md:w-64 rounded-full bg-slate-900/80 border border-slate-700 px-3 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="h-6 w-6 rounded-full bg-slate-700" />
            </div>

            {/* Application Inner Grid */}
            <div className="grid grid-cols-12 min-h-87.5 md:h-125">
              {/* Sidebar: Navigation text added */}
              <div className="hidden md:flex col-span-3 border-r border-slate-800 p-4 flex-col gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-violet-400">
                    <Inbox size={18} />
                    <span className="text-sm font-medium">Inbox</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">Today</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <Star size={18} />
                    <span className="text-sm font-medium">Important</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                    Projects
                  </span>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-3 text-slate-400 px-2 py-1 rounded-md hover:bg-slate-800">
                      <Hash size={14} />{" "}
                      <span className="text-xs">Hackathon</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 px-2 py-1 rounded-md hover:bg-slate-800">
                      <Hash size={14} />{" "}
                      <span className="text-xs">Personal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content: Real Task text added */}
              <div className="col-span-12 md:col-span-9 p-6 md:p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      All Tasks
                    </h3>
                    <p className="text-xs text-slate-500">
                      You have 4 tasks remaining for today.
                    </p>
                  </div>
                  <button className="h-10 w-10 rounded-full bg-violet-600 hover:bg-violet-500 transition-all flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    <span className="text-2xl">+</span>
                  </button>
                </div>

                {/* Animated Task List */}
                <div className="space-y-3">
                  {sampleTasks.map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex items-center gap-4 h-16 w-full rounded-2xl bg-slate-800/30 border border-slate-700/50 px-5 hover:bg-slate-800/60 transition-colors"
                    >
                      {task.status === "done" ? (
                        <CheckCircle2
                          size={22}
                          className="text-emerald-500 shrink-0"
                        />
                      ) : (
                        <Circle
                          size={22}
                          className="text-slate-600 shrink-0 group-hover:text-violet-400 transition-colors"
                        />
                      )}

                      <div className="flex flex-col">
                        <span
                          className={`text-sm md:text-base font-medium ${task.status === "done"
                              ? "text-slate-500 line-through"
                              : "text-slate-200"
                            }`}
                        >
                          {task.title}
                        </span>
                        {i === 0 && (
                          <span className="text-[10px] text-violet-400 font-semibold">
                            AI Prioritized
                          </span>
                        )}
                      </div>

                      <div className="ml-auto flex gap-2">
                        <div className="hidden sm:block h-2 w-12 rounded-full bg-slate-700" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
