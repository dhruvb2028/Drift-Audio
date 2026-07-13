"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Droplets,
  Gamepad2,
  BluetoothConnected,
  BatteryCharging,
  Headphones,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, revealItem } from "@/components/ui/reveal";

const FEATURES = [
  { icon: Zap, title: "Fast charge", desc: "10 minutes gives you 3 hours of playback." },
  { icon: Droplets, title: "IPX7 waterproof", desc: "Sweat, splashes and rain — no problem." },
  { icon: Gamepad2, title: "45ms game mode", desc: "Ultra-low latency keeps audio in sync." },
  { icon: BluetoothConnected, title: "Dual pairing", desc: "Connect two devices, switch instantly." },
  { icon: BatteryCharging, title: "70h battery", desc: "Marathon sessions on a single charge." },
  { icon: Headphones, title: "Signature sound", desc: "Tuned drivers with deep, controlled bass." },
];

export function FeatureHighlights() {
  return (
    <section className="container py-20">
      <SectionHeading
        align="center"
        eyebrow="Engineered in"
        title="Details you'll feel"
        subtitle="Every DRIFT product is built on the same obsessive spec sheet."
        className="mb-12"
      />
      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={revealItem}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-card p-6 transition-colors hover:border-white/20"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <f.icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-white/55">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
