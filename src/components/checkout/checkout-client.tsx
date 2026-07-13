"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Truck,
  ChevronLeft,
  BadgeCheck,
} from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { useCart } from "@/lib/cart-store";
import { computeOrder } from "@/lib/commerce";
import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { getStripe, hasStripeKey, resetStripe } from "@/lib/stripe-client";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
import { PaymentMarks } from "@/components/checkout/payment-marks";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Fields = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

const EMPTY: Fields = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
};

export function CheckoutClient() {
  const mounted = useMounted();
  const { items, clear, couponCode } = useCart();
  const currency = useCurrency((s) => s.currency);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState<string>("");
  const [initLoading, setInitLoading] = useState(false);

  // Stripe.js instance: undefined = loading, null = failed to load, Stripe = ready.
  const [stripe, setStripe] = useState<Stripe | null | undefined>(undefined);
  const [stripeReloadKey, setStripeReloadKey] = useState(0);

  const order = computeOrder(items, currency, couponCode);
  const itemsKey = items.map((i) => `${i.slug}:${i.qty}`).join(",");
  const stripeConfigured = hasStripeKey();

  // Delivery window (client-only render, so no hydration concern).
  const delivery = useMemo(() => {
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() + 3);
    const to = new Date(now);
    to.setDate(now.getDate() + 5);
    return `${fmt(from)} – ${fmt(to)}`;
  }, []);

  // Load Stripe.js (retryable if the CDN is blocked / offline).
  useEffect(() => {
    if (!stripeConfigured) return;
    let cancelled = false;
    setStripe(undefined);
    getStripe().then((s) => {
      if (!cancelled) setStripe(s);
    });
    return () => {
      cancelled = true;
    };
  }, [stripeConfigured, stripeReloadKey]);

  function retryStripe() {
    resetStripe();
    setStripe(undefined);
    setStripeReloadKey((k) => k + 1);
  }

  useEffect(() => {
    if (!mounted || placed || items.length === 0 || !stripeConfigured) return;
    let cancelled = false;
    setInitLoading(true);
    setInitError("");
    setClientSecret(null);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        currency,
        couponCode,
      }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (cancelled) return;
        if (!r.ok) {
          setInitError(data.error || "Could not start the payment.");
          return;
        }
        setClientSecret(data.clientSecret);
      })
      .catch(() => {
        if (!cancelled) setInitError("Could not reach the payment server.");
      })
      .finally(() => {
        if (!cancelled) setInitLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, itemsKey, currency, couponCode, stripeConfigured, placed]);

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateShipping(): boolean {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Enter a valid email";
    if (!fields.firstName.trim()) e.firstName = "Required";
    if (!fields.lastName.trim()) e.lastName = "Required";
    if (!fields.address.trim()) e.address = "Required";
    if (!fields.city.trim()) e.city = "Required";
    if (!fields.state.trim()) e.state = "Required";
    if (!/^\d{5,6}$/.test(fields.zip)) e.zip = "Invalid PIN/ZIP";
    if (!/^[\d\s+-]{7,}$/.test(fields.phone)) e.phone = "Invalid phone";
    setErrors(e);
    if (Object.keys(e).length) {
      document
        .querySelector("[data-error='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  function handleSuccess(paymentIntentId: string) {
    setOrderId(paymentIntentId);
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const appearance = useMemo(
    () =>
      ({
        theme: "night" as const,
        labels: "floating" as const,
        variables: {
          colorPrimary: "#EE1C25",
          colorBackground: "#141414",
          colorText: "#f5f5f5",
          colorTextSecondary: "#a1a1aa",
          colorDanger: "#ff6b6b",
          borderRadius: "12px",
          fontFamily: "DM Sans, system-ui, sans-serif",
          spacingUnit: "4px",
        },
      }),
    []
  );

  if (!mounted) {
    return <div className="container py-20 text-white/50">Loading…</div>;
  }

  // ---- Success ----
  if (placed) {
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
          Thank you for your order! A confirmation would be emailed in a live
          store. Your Stripe reference:
        </p>
        <p className="mt-2 break-all rounded-full bg-white/[0.05] px-4 py-1.5 font-mono text-xs text-white/70">
          {orderId}
        </p>
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

  // ---- Empty ----
  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
          <ShoppingBag className="h-9 w-9 text-white/30" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-white">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-white/55">
          Add a product before heading to checkout.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-8" })}>
          Shop all products
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" /> Back to cart
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Secure checkout
          </h1>
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-sm font-medium text-emerald-300">
            <Lock className="h-4 w-4" /> SSL encrypted
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* LEFT — details + payment */}
        <div className="space-y-5">
          <StepCard step={1} title="Contact" delay={0}>
            <div className="grid grid-cols-1 gap-4">
              <Field
                label="Email address"
                value={fields.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                type="email"
                placeholder="you@email.com"
                hint="Order confirmation & receipt sent here"
              />
            </div>
          </StepCard>

          <StepCard step={2} title="Shipping address" delay={0.05}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" value={fields.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} />
              <Field label="Last name" value={fields.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} />
              <Field label="Address" value={fields.address} onChange={(v) => set("address", v)} error={errors.address} className="sm:col-span-2" />
              <Field label="City" value={fields.city} onChange={(v) => set("city", v)} error={errors.city} />
              <Field label="State" value={fields.state} onChange={(v) => set("state", v)} error={errors.state} />
              <Field label="PIN / ZIP" value={fields.zip} onChange={(v) => set("zip", v)} error={errors.zip} inputMode="numeric" />
              <Field label="Phone" value={fields.phone} onChange={(v) => set("phone", v)} error={errors.phone} inputMode="tel" />
            </div>
          </StepCard>

          <StepCard
            step={3}
            title="Payment"
            delay={0.1}
            aside={
              <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-white/60">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secured by Stripe
              </span>
            }
          >
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.07] px-3.5 py-2.5 text-xs text-sky-200">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              Test mode — use <span className="font-mono">4242 4242 4242 4242</span>, any
              future date, any CVC. No real charge.
            </div>

            {!stripeConfigured || initError ? (
              <SetupNotice message={initError} />
            ) : stripe === null ? (
              <StripeLoadError onRetry={retryStripe} />
            ) : !clientSecret || stripe === undefined ? (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-sm text-white/50">
                <Loader2 className="h-4 w-4 animate-spin" />
                {initLoading ? "Setting up secure payment…" : "Preparing payment…"}
              </div>
            ) : (
              <Elements stripe={stripe} options={{ clientSecret, appearance }} key={clientSecret}>
                <PaymentSection
                  email={fields.email}
                  validateShipping={validateShipping}
                  totalLabel={formatPrice(order.total, currency)}
                  onSuccess={handleSuccess}
                />
              </Elements>
            )}
          </StepCard>
        </div>

        {/* RIGHT — premium summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
            <div className="h-1 w-full bg-brand-gradient" />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-white">
                  Order summary
                </h2>
                <span className="text-sm text-white/45">
                  {items.reduce((n, i) => n + i.qty, 0)} items
                </span>
              </div>

              {/* Items */}
              <ul className="mt-5 space-y-4">
                {items.map((item) => {
                  const price = currency === "USD" ? item.priceUSD : item.priceINR;
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] p-2">
                        <ProductRender kind={item.render} color={item.colorHex} />
                        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gradient px-1 text-[10px] font-bold text-white">
                          {item.qty}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.name}</p>
                        <p className="flex items-center gap-1.5 text-xs text-white/45">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white/20"
                            style={{ background: item.colorHex }}
                          />
                          {item.colorName}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {formatPrice(price * item.qty, currency)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {order.itemSavings + order.couponDiscount > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-2 text-sm font-medium text-emerald-300">
                  <BadgeCheck className="h-4 w-4" />
                  You&apos;re saving{" "}
                  {formatPrice(order.itemSavings + order.couponDiscount, currency)}
                </div>
              )}

              {/* Delivery estimate */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {order.shipping === 0 ? "Free delivery" : "Standard delivery"}
                  </p>
                  <p className="text-xs text-white/50">Estimated arrival {delivery}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-sm">
                <Row label="Subtotal" value={formatPrice(order.subtotal, currency)} />
                {order.itemSavings > 0 && (
                  <Row label="Item savings" value={`− ${formatPrice(order.itemSavings, currency)}`} accent />
                )}
                {order.couponDiscount > 0 && (
                  <Row label={`Coupon ${order.coupon?.code}`} value={`− ${formatPrice(order.couponDiscount, currency)}`} accent />
                )}
                <Row
                  label="Shipping"
                  value={order.shipping === 0 ? "Free" : formatPrice(order.shipping, currency)}
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="font-medium text-white">Total</span>
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-white">
                    {formatPrice(order.total, currency)}
                  </span>
                  <p className="text-xs text-white/40">Incl. all taxes</p>
                </div>
              </div>
            </div>

            {/* Trust footer */}
            <div className="space-y-3 border-t border-white/10 bg-white/[0.02] p-6">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: RefreshCw, label: "30-day returns" },
                  { icon: ShieldCheck, label: "2-yr warranty" },
                  { icon: Lock, label: "Secure pay" },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center gap-1.5 text-center">
                    <t.icon className="h-5 w-5 text-brand" />
                    <span className="text-[11px] leading-tight text-white/55">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/8 pt-3">
                <span className="text-xs text-white/40">We accept</span>
                <PaymentMarks />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PaymentSection({
  email,
  validateShipping,
  totalLabel,
  onSuccess,
}: {
  email: string;
  validateShipping: () => boolean;
  totalLabel: string;
  onSuccess: (id: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState("");

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!validateShipping()) return;
    if (!stripe || !elements) return;

    setProcessing(true);
    setPayError("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: email ? { receipt_email: email } : undefined,
    });

    if (error) {
      setPayError(error.message || "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
      return;
    }
    setPayError("Payment could not be completed.");
    setProcessing(false);
  }

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {payError && (
        <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand-300">
          {payError}
        </p>
      )}
      <Button type="submit" size="lg" disabled={!stripe || processing} className="w-full">
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Pay {totalLabel}
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-white/40">
        <Lock className="h-3 w-3" /> Payments are encrypted & processed by Stripe.
      </p>
    </form>
  );
}

function StepCard({
  step,
  title,
  aside,
  delay,
  children,
}: {
  step: number;
  title: string;
  aside?: React.ReactNode;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-white/10 bg-card p-6 sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
            {step}
          </span>
          <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </motion.section>
  );
}

function StripeLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-brand/25 bg-brand/[0.06] p-5 text-sm">
      <p className="font-medium text-white">
        Couldn&apos;t load the secure payment form
      </p>
      <p className="mt-2 leading-relaxed text-white/60">
        Stripe.js couldn&apos;t be reached. This is usually an ad-blocker or
        privacy extension blocking{" "}
        <span className="font-mono">js.stripe.com</span>, or a dropped
        connection. Allow it for this site, then retry.
      </p>
      <Button variant="outline" size="md" onClick={onRetry} className="mt-4">
        <RefreshCw className="h-4 w-4" /> Retry
      </Button>
    </div>
  );
}

function SetupNotice({ message }: { message?: string }) {
  return (
    <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-200">
      <p className="font-medium">{message || "Stripe isn't configured yet."}</p>
      <p className="mt-2 text-amber-200/80">
        Add your test keys to <span className="font-mono">.env.local</span> and restart:
      </p>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-amber-100">
{`STRIPE_SECRET_KEY=sk_test_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`}
      </pre>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  className,
  inputMode,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  inputMode?: "numeric" | "tel" | "email";
  hint?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z]/g, "-");
  return (
    <div className={className} data-error={error ? "true" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        suppressHydrationWarning
        className={cn(
          "h-12 w-full rounded-xl border bg-white/[0.03] px-4 text-white placeholder:text-white/30 transition-all focus:outline-none focus:ring-2",
          error
            ? "border-brand/60 focus:border-brand focus:ring-brand/20"
            : "border-white/10 focus:border-brand/50 focus:ring-brand/15"
        )}
      />
      {error ? (
        <p className="mt-1 text-xs text-brand-300">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-white/35">{hint}</p>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{label}</span>
      <span className={accent ? "font-medium text-emerald-400" : "text-white"}>
        {value}
      </span>
    </div>
  );
}
