import type { CartItem } from "./cart-store";
import type { Currency } from "./utils";
import { PRODUCTS } from "./products";

/** Free-shipping threshold + flat fee, per currency. */
export const FREE_SHIPPING_THRESHOLD: Record<Currency, number> = {
  INR: 2000,
  USD: 30,
};
export const SHIPPING_FEE: Record<Currency, number> = { INR: 99, USD: 4 };

export interface Coupon {
  code: string;
  label: string;
  value: number; // percent
}

export const COUPONS: Coupon[] = [
  { code: "DRIFT10", label: "10% off your order", value: 10 },
  { code: "SOUND20", label: "20% off — big sale", value: 20 },
  { code: "WELCOME15", label: "15% off your first order", value: 15 },
];

export function findCoupon(code?: string | null): Coupon | undefined {
  if (!code) return undefined;
  return COUPONS.find((c) => c.code === code.toUpperCase().trim());
}

/** Deterministic demo stock — low numbers drive urgency messaging. */
const LOW_STOCK: Record<string, number> = {
  "airwave-pods-pro": 4,
  "nirvana-elite-anc": 3,
  "pulse-studio": 2,
  "stone-blast": 5,
  "vantage-watch": 6,
};
export function getStock(slug: string): number {
  return LOW_STOCK[slug] ?? 24;
}
export function isLowStock(slug: string): boolean {
  return getStock(slug) <= 6;
}

export interface OrderTotals {
  subtotal: number;
  itemSavings: number;
  coupon?: Coupon;
  couponDiscount: number;
  shipping: number;
  freeShipping: boolean;
  freeShippingRemaining: number;
  threshold: number;
  total: number;
}

/**
 * Server-safe order total from raw line items ({slug, qty}) — looks up trusted
 * prices from PRODUCTS so the client can never dictate the amount charged.
 */
export function computeOrderFromLines(
  lines: { slug: string; qty: number }[],
  currency: Currency,
  couponCode?: string | null
): OrderTotals {
  const items = lines
    .map((l) => {
      const p = PRODUCTS.find((x) => x.slug === l.slug);
      if (!p) return null;
      const qty = Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 1)));
      return {
        priceINR: p.priceINR,
        priceUSD: p.priceUSD,
        mrpINR: p.mrpINR,
        mrpUSD: p.mrpUSD,
        qty,
      } as CartItem;
    })
    .filter(Boolean) as CartItem[];
  return computeOrder(items, currency, couponCode);
}

/** Single source of truth for cart/checkout math. */
export function computeOrder(
  items: CartItem[],
  currency: Currency,
  couponCode?: string | null
): OrderTotals {
  const price = (i: CartItem) => (currency === "USD" ? i.priceUSD : i.priceINR);
  const mrp = (i: CartItem) => (currency === "USD" ? i.mrpUSD : i.mrpINR);

  const subtotal = items.reduce((s, i) => s + price(i) * i.qty, 0);
  const itemSavings = items.reduce((s, i) => s + (mrp(i) - price(i)) * i.qty, 0);

  const coupon = findCoupon(couponCode);
  const couponDiscount = coupon ? Math.round((subtotal * coupon.value) / 100) : 0;
  const afterCoupon = subtotal - couponDiscount;

  const threshold = FREE_SHIPPING_THRESHOLD[currency];
  const empty = items.length === 0;
  const freeShipping = empty || afterCoupon >= threshold;
  const shipping = empty ? 0 : freeShipping ? 0 : SHIPPING_FEE[currency];

  return {
    subtotal,
    itemSavings,
    coupon,
    couponDiscount,
    shipping,
    freeShipping,
    freeShippingRemaining: Math.max(0, threshold - afterCoupon),
    threshold,
    total: afterCoupon + shipping,
  };
}
