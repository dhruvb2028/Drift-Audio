"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageSquare,
  MapPin,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Orders ship within 24 hours. Standard delivery is 3–5 business days, and it's free on orders over the free-shipping threshold shown in your cart.",
  },
  {
    q: "What's your return policy?",
    a: "30-day no-questions-asked returns on all products. If you're not in love with the sound, send it back for a full refund.",
  },
  {
    q: "Do your products come with a warranty?",
    a: "Yes — every DRIFT product includes a 2-year limited warranty covering manufacturing defects.",
  },
  {
    q: "Can I pair two speakers for stereo sound?",
    a: "Absolutely. Stone Blast and most of our speakers support TWS stereo pairing — connect two for a true left/right stereo field.",
  },
  {
    q: "Is this a real store?",
    a: "No — DRIFT AUDIO is a portfolio concept project. It's fully functional as a demo, but no real orders or payments are processed.",
  },
];

export function ContactClient() {
  const pushToast = useToast((s) => s.push);
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!fields.name.trim()) err.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) err.email = "Valid email required";
    if (!fields.message.trim()) err.message = "Tell us how we can help";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSent(true);
    setFields({ name: "", email: "", subject: "", message: "" });
    pushToast({ message: "Message sent", description: "We'll be in touch soon (demo)." });
  }

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-3 text-white/60">
          Questions about a product, an order, or just want to talk audio? We&apos;re here.
        </p>
      </div>

      {/* Contact cards */}
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, title: "Email", value: "hello@driftaudio.demo" },
          { icon: MessageSquare, title: "Live chat", value: "Mon–Sat, 9–6" },
          { icon: MapPin, title: "HQ", value: "Bengaluru, India" },
        ].map((c) => (
          <div
            key={c.title}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-card p-6 text-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 text-brand">
              <c.icon className="h-5 w-5" />
            </span>
            <p className="font-medium text-white">{c.title}</p>
            <p className="text-sm text-white/50">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-3xl border border-white/10 bg-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white">
            Send us a message
          </h2>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex flex-col items-center gap-3 py-10 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                <p className="font-display text-lg font-semibold text-white">
                  Thanks — we got it!
                </p>
                <p className="max-w-xs text-sm text-white/55">
                  This is a demo, so no email was actually sent, but the flow works.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-sm text-brand-300 hover:text-brand cursor-pointer"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                className="mt-6 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <ContactField label="Name" value={fields.name} onChange={(v) => set("name", v)} error={errors.name} />
                  <ContactField label="Email" type="email" value={fields.email} onChange={(v) => set("email", v)} error={errors.email} />
                </div>
                <ContactField label="Subject" value={fields.subject} onChange={(v) => set("subject", v)} />
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm text-white/60">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={fields.message}
                    onChange={(e) => set("message", e.target.value)}
                    className={cn(
                      "w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 focus:outline-none",
                      errors.message
                        ? "border-brand/60 focus:border-brand"
                        : "border-white/12 focus:border-brand/50"
                    )}
                    placeholder="How can we help?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-brand-300">{errors.message}</p>
                  )}
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Send message
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-xl font-semibold text-white">
            Frequently asked
          </h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-card"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer"
                  >
                    <span className="font-medium text-white">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-white/50 transition-transform",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-white/55">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  const id = label.toLowerCase();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-white/60">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border bg-white/[0.04] px-4 text-white placeholder:text-white/30 focus:outline-none",
          error ? "border-brand/60 focus:border-brand" : "border-white/12 focus:border-brand/50"
        )}
      />
      {error && <p className="mt-1 text-xs text-brand-300">{error}</p>}
    </div>
  );
}
