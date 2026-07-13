"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, ShoppingBag, Info } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { computeOrder } from "@/lib/commerce";
import { useCurrency } from "@/lib/currency-store";
import { useMounted } from "@/lib/use-mounted";
import { ProductRender } from "@/components/ui/product-render";
import { Button, buttonVariants } from "@/components/ui/button";
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
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
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
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export function CheckoutClient() {
  const mounted = useMounted();
  const { items, clear, couponCode } = useCart();
  const currency = useCurrency((s) => s.currency);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const order = computeOrder(items, currency, couponCode);

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "Enter a valid email";
    if (!fields.firstName.trim()) e.firstName = "Required";
    if (!fields.lastName.trim()) e.lastName = "Required";
    if (!fields.address.trim()) e.address = "Required";
    if (!fields.city.trim()) e.city = "Required";
    if (!fields.state.trim()) e.state = "Required";
    if (!/^\d{5,6}$/.test(fields.zip)) e.zip = "Invalid PIN/ZIP";
    if (!/^[\d\s+-]{7,}$/.test(fields.phone)) e.phone = "Invalid phone";
    if (!fields.cardName.trim()) e.cardName = "Required";
    if (fields.cardNumber.replace(/\s/g, "").length < 15)
      e.cardNumber = "Invalid card number";
    if (!/^\d{2}\s?\/\s?\d{2}$/.test(fields.expiry)) e.expiry = "MM / YY";
    if (!/^\d{3,4}$/.test(fields.cvc)) e.cvc = "CVC";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      document
        .querySelector("[data-error='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setOrderId("DA" + Date.now().toString().slice(-8));
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!mounted) {
    return <div className="container py-20 text-white/50">Loading…</div>;
  }

  // Success state
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
          Order confirmed
        </h1>
        <p className="mt-3 max-w-md text-white/60">
          Thanks for the (demo) order! Your confirmation number is{" "}
          <span className="font-semibold text-white">{orderId}</span>. In a real
          store, a receipt would now be on its way to your inbox.
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

      {/* Demo banner */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
        <Info className="h-4 w-4 shrink-0" />
        Demo checkout — this is a portfolio concept. No real payment is
        processed and no card data is stored.
      </div>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
        {/* Left: form */}
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

          <Fieldset title="Payment" icon={<Lock className="h-4 w-4 text-white/40" />}>
            <Field label="Name on card" value={fields.cardName} onChange={(v) => set("cardName", v)} error={errors.cardName} className="sm:col-span-2" />
            <Field
              label="Card number"
              value={fields.cardNumber}
              onChange={(v) => set("cardNumber", formatCard(v))}
              error={errors.cardNumber}
              className="sm:col-span-2"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
            />
            <Field label="Expiry" value={fields.expiry} onChange={(v) => set("expiry", formatExpiry(v))} error={errors.expiry} placeholder="MM / YY" inputMode="numeric" />
            <Field label="CVC" value={fields.cvc} onChange={(v) => set("cvc", v.replace(/\D/g, "").slice(0, 4))} error={errors.cvc} placeholder="123" inputMode="numeric" />
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
                      <p className="truncate text-sm font-medium text-white">
                        {item.name}
                      </p>
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
                <Row
                  label="Item savings"
                  value={`− ${formatPrice(order.itemSavings, currency)}`}
                  accent
                />
              )}
              {order.couponDiscount > 0 && (
                <Row
                  label={`Coupon ${order.coupon?.code}`}
                  value={`− ${formatPrice(order.couponDiscount, currency)}`}
                  accent
                />
              )}
              <Row
                label="Shipping"
                value={
                  order.shipping === 0 ? "Free" : formatPrice(order.shipping, currency)
                }
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
              <span className="font-medium text-white">Total</span>
              <span className="font-display text-2xl font-bold text-white">
                {formatPrice(order.total, currency)}
              </span>
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full">
              <Lock className="h-4 w-4" /> Place order · {formatPrice(order.total, currency)}
            </Button>
            <p className="mt-3 text-center text-xs text-white/40">
              By placing this demo order you agree to nothing at all.
            </p>
          </div>
        </aside>
      </form>
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
          error
            ? "border-brand/60 focus:border-brand"
            : "border-white/12 focus:border-brand/50"
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

function formatCard(v: string): string {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}
