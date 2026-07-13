"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Boxes,
  Truck,
  MapPin,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: Package, title: "Order placed", desc: "We've received your order." },
  { icon: Boxes, title: "Packed", desc: "Your items are boxed and ready." },
  { icon: Truck, title: "Shipped", desc: "On the way to your city." },
  { icon: MapPin, title: "Out for delivery", desc: "Arriving today." },
  { icon: CheckCircle2, title: "Delivered", desc: "Enjoy the sound!" },
];

export function TrackClient() {
  const [input, setInput] = useState("");
  const [tracked, setTracked] = useState<{ id: string; step: number } | null>(null);
  const [error, setError] = useState("");

  function track(e: React.FormEvent) {
    e.preventDefault();
    const id = input.trim();
    if (!id) {
      setError("Enter an order number");
      return;
    }
    const hash = [...id].reduce((s, c) => s + c.charCodeAt(0), 0);
    setTracked({ id: id.toUpperCase(), step: hash % STEPS.length });
    setError("");
  }

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Track your order
        </h1>
        <p className="mt-3 text-white/60">
          Enter your order number to see where your sound is. (Demo — try any
          code, e.g. <span className="text-white">DA12345678</span>.)
        </p>

        <form onSubmit={track} className="mt-8 flex gap-2" noValidate>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="Order number"
              aria-label="Order number"
              className="h-12 w-full rounded-full border border-white/12 bg-white/[0.04] pl-11 pr-4 text-white placeholder:text-white/30 focus:border-brand/50 focus:outline-none"
            />
          </div>
          <Button type="submit" size="lg">
            Track
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-brand-300">{error}</p>}
      </div>

      {tracked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-card p-6 sm:p-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/45">Order</p>
              <p className="font-display text-xl font-bold text-white">
                {tracked.id}
              </p>
            </div>
            <span className="rounded-full bg-brand/15 px-3 py-1 text-sm font-medium text-brand-300">
              {STEPS[tracked.step].title}
            </span>
          </div>

          <div className="relative mt-10 border-l border-white/12 pl-10">
            {STEPS.map((s, i) => {
              const done = i < tracked.step;
              const active = i === tracked.step;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pb-8 last:pb-0"
                >
                  <span
                    className={cn(
                      "absolute -left-[53px] flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-background transition-colors",
                      done || active
                        ? "bg-brand-gradient text-white"
                        : "bg-white/[0.06] text-white/40"
                    )}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                  <h3
                    className={cn(
                      "font-display font-semibold",
                      done || active ? "text-white" : "text-white/40"
                    )}
                  >
                    {s.title}
                    {active && (
                      <span className="ml-2 inline-flex h-2 w-2 animate-pulse-glow rounded-full bg-brand align-middle" />
                    )}
                  </h3>
                  <p className="mt-0.5 text-sm text-white/50">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
