"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  HardDrive,
  GitBranch,
  FileCode2,
  Sparkles,
  Puzzle,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Native Speed",
    accent: "#06b6d4",
    description:
      "50MB RAM. <2s startup. Tauri v2 + Rust backend delivers native performance — not Electron bloat.",
    href: "#",
  },
  {
    icon: HardDrive,
    title: "Local-First Forever",
    accent: "#22c55e",
    description:
      "Your data never leaves your machine. No login. No cloud. No telemetry. Complete privacy by design.",
    href: "#",
  },
  {
    icon: GitBranch,
    title: "Git-Native Storage",
    accent: "#8b5cf6",
    description:
      "YAML files. One per request. Fully diffable, mergeable, versionable. Works with any Git workflow.",
    href: "#",
  },
  {
    icon: FileCode2,
    title: "TypeScript Scripting",
    accent: "#eab308",
    description:
      "Pre/post scripts in TypeScript. Chai assertions, CryptoJS, Lodash, Faker — all built in.",
    href: "#",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    accent: "#ec4899",
    description:
      "Generate requests from natural language. Auto-generate tests. Use your own API key — no usage limits.",
    href: "#",
  },
  {
    icon: Puzzle,
    title: "Plugin Ecosystem",
    accent: "#f97316",
    description:
      "Extend with JavaScript or WASM plugins. Custom auth, transformers, integrations — your way.",
    href: "#",
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
        >
          <p className="section-label mb-4">_features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need.{" "}
            <span className="text-zinc-500">Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-3 text-base text-zinc-500 max-w-xl">
            A complete API development toolkit built for developers who value speed, privacy, and control.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                className="group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                {/* Icon */}
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${feature.accent}10`,
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: feature.accent }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-semibold text-zinc-200 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-zinc-500 mb-4 flex-1">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <a
                  href={feature.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors group-hover:text-indigo-400"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
