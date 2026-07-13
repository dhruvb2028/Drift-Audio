"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, ShoppingBag, Info, Loader2 } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cart-store";
import { computeOrder } from "@/lib/commerce";
import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { getStripe, hasStripeKey } from "@/lib/stripe-client";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const stripePromise = getStripe();

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

  const order = computeOrder(items, currency, couponCode);
  const itemsKey = items.map((i) => `${i.slug}:${i.qty}`).join(",");
  const stripeConfigured = hasStripeKey();

  // Create / refresh the PaymentIntent whenever the order changes.
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
        variables: {
          colorPrimary: "#EE1C25",
          colorBackground: "#121212",
          colorText: "#f5f5f5",
          colorDanger: "#ff6b6b",
          borderRadius: "10px",
          fontFamily: "DM Sans, system-ui, sans-serif",
        },
      }),
    []
  );

  if (!mounted) {
    return <div className="container py-20 text-white/50">Loading…</div>;
  }

  // Success
  if (placed) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15"
        >
          <CheckCircle2 className="h-11 w-11 text-emerald-400" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl font-bold text-white">
          Payment successful
        </h1>
        <p className="mt-3 max-w-md text-white/60">
          Thanks for your order! Your Stripe payment reference is{" "}
          <span className="break-all font-mono text-sm text-white">{orderId}</span>.
          A receipt would be emailed in a live store.
        </p>
        <Link
          href="/products"
          className={buttonVariants({ size: "lg", className: "mt-8" })}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  // Empty cart
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
        <Link
          href="/products"
          className={buttonVariants({ size: "lg", className: "mt-8" })}
        >
          Shop all products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl font-bold text-white">Checkout</h1>

      {/* Test-mode banner */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <strong>Stripe test mode.</strong> Pay with card{" "}
          <span className="font-mono">4242 4242 4242 4242</span>, any future expiry,
          any CVC & ZIP. It&apos;s a real Stripe payment flow — no money moves.
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: shipping */}
        <div className="space-y-8">
          <Fieldset title="Contact">
            <Field
              label="Email"
              value={fields.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
              type="email"
              placeholder="you@email.com"
              className="sm:col-span-2"
            />
          </Fieldset>

          <Fieldset title="Shipping address">
            <Field label="First name" value={fields.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} />
            <Field label="Last name" value={fields.lastName} onChange={(v) => set("lastName", v)} error={errors.lastName} />
            <Field label="Address" value={fields.address} onChange={(v) => set("address", v)} error={errors.address} className="sm:col-span-2" />
            <Field label="City" value={fields.city} onChange={(v) => set("city", v)} error={errors.city} />
            <Field label="State" value={fields.state} onChange={(v) => set("state", v)} error={errors.state} />
            <Field label="PIN / ZIP" value={fields.zip} onChange={(v) => set("zip", v)} error={errors.zip} inputMode="numeric" />
            <Field label="Phone" value={fields.phone} onChange={(v) => set("phone", v)} error={errors.phone} inputMode="tel" />
          </Fieldset>

          {/* Payment */}
          <Fieldset title="Payment" icon={<Lock className="h-4 w-4 text-white/40" />}>
            <div className="sm:col-span-2">
              {!stripeConfigured || initError ? (
                <SetupNotice message={initError} />
              ) : !clientSecret ? (
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-white/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {initLoading ? "Setting up secure payment…" : "Preparing payment…"}
                </div>
              ) : (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance }}
                  key={clientSecret}
                >
                  <PaymentSection
                    email={fields.email}
                    validateShipping={validateShipping}
                    totalLabel={formatPrice(order.total, currency)}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              )}
            </div>
          </Fieldset>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-white/10 bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              Order summary
            </h2>
            <ul className="mt-5 space-y-4">
              {items.map((item) => {
                const price = currency === "USD" ? item.priceUSD : item.priceINR;
                return (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] p-1.5">
                      <ProductRender kind={item.render} color={item.colorHex} />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-1 text-[10px] font-bold text-white">
                        {item.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-white/45">{item.colorName}</p>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {formatPrice(price * item.qty, currency)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 space-y-2 border-t border-white/8 pt-5 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal, currency)} />
              {order.itemSavings > 0 && (
                <Row label="Item savings" value={`− ${formatPrice(order.itemSavings, currency)}`} accent />
              )}
              {order.couponDiscount > 0 && (
                <Row label={`Coupon ${order.coupon?.code}`} value={`− ${formatPrice(order.couponDiscount, currency)}`} accent />
              )}
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping, currency)} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
              <span className="font-medium text-white">Total</span>
              <span className="font-display text-2xl font-bold text-white">
                {formatPrice(order.total, currency)}
              </span>
            </div>
            <p className="mt-4 text-center text-xs text-white/40">
              Secured by Stripe · your card details never touch our servers.
            </p>
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
      {payError && <p className="text-sm text-brand-300">{payError}</p>}
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
    </form>
  );
}

function SetupNotice({ message }: { message?: string }) {
  return (
    <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-200">
      <p className="font-medium">
        {message || "Stripe isn't configured yet."}
      </p>
      <p className="mt-2 text-amber-200/80">
        Add your test keys to <span className="font-mono">.env.local</span> and
        restart the dev server:
      </p>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-amber-100">
{`STRIPE_SECRET_KEY=sk_test_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`}
      </pre>
    </div>
  );
}

function Fieldset({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        {icon}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  inputMode?: "numeric" | "tel" | "email";
}) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className={className} data-error={error ? "true" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm text-white/60">
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
        className={cn(
          "h-11 w-full rounded-xl border bg-white/[0.04] px-4 text-white placeholder:text-white/30 focus:outline-none",
          error ? "border-brand/60 focus:border-brand" : "border-white/12 focus:border-brand/50"
        )}
      />
      {error && <p className="mt-1 text-xs text-brand-300">{error}</p>}
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
