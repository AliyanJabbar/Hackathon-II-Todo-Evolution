"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: { monthly: "$0", yearly: "$0" },
    description: "Perfect for staying organized on your own.",
    features: [
      "Unlimited basic tasks",
      "5 AI-prioritizations per day",
      "Mobile & Desktop sync",
      "Community support",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    name: "Genie Pro",
    price: { monthly: "$12", yearly: "$8" },
    description: "For high-performers who need an AI assistant.",
    features: [
      "Everything in Starter",
      "Unlimited AI prioritization",
      "Collaborative team spaces",
      "Advanced focus analytics",
      "Priority 'Genie' support",
    ],
    buttonText: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: { monthly: "$49", yearly: "$39" },
    description: "Built for fast-moving hackathon teams.",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Shared project timelines",
      "Custom AI workflow rules",
      "Dedicated account manager",
    ],
    buttonText: "Contact Sales",
    highlight: false,
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-5xl">
          Pricing that fits your focus
        </h2>
        <p className="mt-4 text-slate-400">
          Choose the plan that powers your productivity.
        </p>

        {/* Billing Toggle */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <span className={`text-sm ${!isYearly ? "text-white" : "text-slate-500"}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-6 w-12 rounded-full bg-slate-800 p-1 transition-colors hover:bg-slate-700"
          >
            <motion.div
              animate={{ x: isYearly ? 24 : 0 }}
              className="h-4 w-4 rounded-full bg-violet-500"
            />
          </button>
          <span className={`text-sm ${isYearly ? "text-white" : "text-slate-500"}`}>
            Yearly <span className="text-xs text-emerald-400 font-medium">(Save 30%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {tiers.map((tier, ind) => (
          <motion.div
            key={tier.name}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ind * 0.1 }}
            whileHover={{ y: -10 }}
            className={`relative flex flex-col rounded-3xl p-8 transition-all ${tier.highlight
                ? "bg-slate-900 border-2 border-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                : "bg-slate-900/50 border border-slate-800"
              }`}
          >
            {tier.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {isYearly ? tier.price.yearly : tier.price.monthly}
                </span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{tier.description}</p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check size={18} className="shrink-0 text-violet-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/todo"
              className={`flex h-12 items-center justify-center rounded-xl text-sm font-bold transition-all ${tier.highlight
                  ? "bg-violet-600 text-white hover:bg-violet-500 shadow-lg"
                  : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
            >
              {tier.buttonText}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
        <Zap size={16} className="text-amber-400" />
        <span>Secure payment via Stripe. Cancel any time.</span>
      </div>
    </section>
  );
}
