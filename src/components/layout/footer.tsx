"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook, Check } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

const COLUMNS = [
  {
    title: "Shop",
    links: NAV_LINKS.map((l) => ({ label: l.label, href: l.href })),
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Compare", href: "/compare" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/contact" },
      { label: "Track Order", href: "/track" },
      { label: "Warranty", href: "/warranty" },
      { label: "Shipping", href: "/shipping" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="container py-16">
        {/* Newsletter */}
        <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-card p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-md">
            <h3 className="font-display text-2xl font-bold text-white">
              Join the DRIFT crew
            </h3>
            <p className="mt-2 text-white/55">
              Early drops, member pricing and sound tips. No spam, ever.
            </p>
          </div>
          <form onSubmit={subscribe} className="w-full max-w-md" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="you@email.com"
                  suppressHydrationWarning
                  className="h-12 w-full rounded-full border border-white/12 bg-white/[0.04] px-5 text-white placeholder:text-white/35 focus:border-brand/50 focus:outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                {status === "done" ? (
                  <>
                    <Check className="h-4 w-4" /> Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
            {status === "error" && (
              <p className="mt-2 pl-5 text-sm text-brand-300">
                Please enter a valid email address.
              </p>
            )}
            {status === "done" && (
              <p className="mt-2 pl-5 text-sm text-emerald-400">
                You&apos;re in. Welcome to the crew!
              </p>
            )}
          </form>
        </div>

        {/* Links */}
        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Premium audio engineered for people who live loud. Sound without
              limits.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: Twitter, href: "https://x.com", label: "X (Twitter)" },
                { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-brand/40 hover:text-white cursor-pointer sm:h-10 sm:w-10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-1.5 text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row">
          <p>© 2026 DRIFT AUDIO. Concept portfolio project — not a real store.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="inline-block py-1.5 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="inline-block py-1.5 hover:text-white">
              Terms
            </Link>
            <Link href="/cookies" className="inline-block py-1.5 hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
