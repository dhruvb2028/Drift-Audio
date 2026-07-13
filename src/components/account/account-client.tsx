"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import {
  Package,
  Heart,
  Settings,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Truck,
  Check,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export interface OrderView {
  id: string;
  date: string;
  status: string;
  amountTotal: number; // smallest currency unit
  currency: "USD" | "INR";
  items: {
    name: string;
    colorName: string | null;
    quantity: number;
    unitAmount: number;
  }[];
}

interface AccountClientProps {
  firstName: string | null;
  displayName: string;
  email: string;
  imageUrl: string;
  memberSince: string;
  isNewUser: boolean;
  orders: OrderView[];
}

export function AccountClient({
  firstName,
  displayName,
  email,
  imageUrl,
  memberSince,
  isNewUser,
  orders,
}: AccountClientProps) {
  const { openUserProfile, signOut } = useClerk();

  const greeting = isNewUser ? "Welcome to DRIFT AUDIO" : "Welcome back";

  const shortcuts = [
    {
      icon: Package,
      title: "Orders",
      desc: "Track shipments and view purchase history.",
      href: "/track",
      cta: "Track an order",
    },
    {
      icon: Heart,
      title: "Wishlist",
      desc: "The gear you've saved for later.",
      href: "/wishlist",
      cta: "View wishlist",
    },
    {
      icon: ShoppingBag,
      title: "Keep shopping",
      desc: "Discover new drops and premium sound.",
      href: "/products",
      cta: "Shop all products",
    },
  ];

  return (
    <div className="container max-w-5xl py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={displayName}
            className="h-20 w-20 rounded-full border border-white/15 object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm text-white/50">{greeting}</p>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {firstName ?? displayName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55">
              {email && <span className="truncate">{email}</span>}
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Member since {memberSince}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Order history */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="mt-6 rounded-3xl border border-white/10 bg-card p-6 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">
            Your orders
          </h2>
          {orders.length > 0 && (
            <span className="text-sm text-white/45">
              {orders.length} order{orders.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Package className="h-6 w-6 text-white/40" />
            </div>
            <p className="mt-4 font-medium text-white">No orders yet</p>
            <p className="mt-1 max-w-xs text-sm text-white/50">
              When you complete a purchase, it&apos;ll show up here with full
              details.
            </p>
            <Link
              href="/products"
              className={buttonVariants({ size: "md", className: "mt-5" })}
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                      <Check className="h-3.5 w-3.5" /> Paid
                    </span>
                    <span className="text-sm text-white/50">{o.date}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-white">
                      {formatPrice(o.amountTotal / 100, o.currency)}
                    </div>
                    <div className="text-xs text-white/35">
                      #{o.id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {o.items.length > 0 ? (
                    o.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 truncate text-white/70">
                          {it.quantity}× {it.name}
                          {it.colorName ? ` · ${it.colorName}` : ""}
                        </span>
                        <span className="shrink-0 text-white/50">
                          {formatPrice(
                            (it.unitAmount * it.quantity) / 100,
                            o.currency
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/40">
                      Order total {formatPrice(o.amountTotal / 100, o.currency)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Shortcut cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {shortcuts.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
          >
            <Link
              href={s.href}
              className="group flex h-full flex-col rounded-3xl border border-white/10 bg-card p-6 transition-colors hover:border-white/25"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-white">
                {s.title}
              </h2>
              <p className="mt-1 flex-1 text-sm text-white/55">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
                {s.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Account management */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-6 rounded-3xl border border-white/10 bg-card p-6 sm:p-8"
      >
        <h2 className="font-display text-lg font-semibold text-white">
          Profile &amp; security
        </h2>
        <p className="mt-1 text-sm text-white/55">
          Update your name, email, password and connected accounts, or sign out
          of this device.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => openUserProfile()}
            className="sm:w-auto"
          >
            <Settings className="h-4 w-4" /> Manage account
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="text-white/70 hover:text-white sm:w-auto"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </motion.div>

      {/* Assurance strip */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" /> Secure, encrypted
          sign-in
        </span>
        <span className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-brand" /> Free 2-day shipping on
          orders
        </span>
        <span className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-brand" /> 30-day returns
        </span>
      </div>
    </div>
  );
}
