"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { buttonVariants } from "@/components/ui/button";

type State = "loading" | "paid" | "pending" | "error";

export function CheckoutSuccessClient() {
  const clear = useCart((s) => s.clear);
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [ref, setRef] = useState<string>("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id");
    if (!id) {
      setState("error");
      return;
    }
    fetch(`/api/checkout-session?id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) {
          setState("error");
          return;
        }
        if (d.paymentStatus === "paid" || d.status === "complete") {
          setEmail(d.email ?? null);
          setRef(d.id ?? id);
          clear();
          setState("paid");
        } else {
          setState("pending");
        }
      })
      .catch(() => setState("error"));
  }, [clear]);

  if (state === "loading") {
    return (
      <div className="container flex flex-col items-center py-28 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <p className="mt-5 text-white/60">Confirming your payment…</p>
      </div>
    );
  }

  if (state === "error" || state === "pending") {
    const isPending = state === "pending";
    return (
      <div className="container flex flex-col items-center py-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/12">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-white">
          {isPending ? "Payment processing" : "Couldn't confirm payment"}
        </h1>
        <p className="mt-3 max-w-md text-white/60">
          {isPending
            ? "Your payment is still processing. You'll get an email once it's confirmed."
            : "We couldn't verify this order. If you were charged, please reach out and we'll sort it out right away."}
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Continue shopping
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  // paid
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15"
      >
        <motion.span
          className="absolute inset-0 rounded-full ring-2 ring-emerald-400/40"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <CheckCircle2 className="h-12 w-12 text-emerald-400" />
      </motion.div>
      <h1 className="mt-6 font-display text-4xl font-bold text-white">
        Payment successful
      </h1>
      <p className="mt-3 max-w-md text-white/60">
        Thank you for your order{email ? <>, a receipt is on its way to <span className="text-white">{email}</span></> : ""}.
        You&apos;ll get shipping updates by email.
      </p>
      {ref && (
        <p className="mt-2 break-all rounded-full bg-white/[0.05] px-4 py-1.5 font-mono text-xs text-white/70">
          {ref}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          Continue shopping
        </Link>
        <Link href="/track" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Track order
        </Link>
      </div>
    </div>
  );
}
