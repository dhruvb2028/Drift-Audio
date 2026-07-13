"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductColor } from "./types";

export interface CartItem {
  id: string; // `${slug}__${colorName}`
  slug: string;
  name: string;
  colorName: string;
  colorHex: string;
  render: Product["render"];
  priceINR: number;
  priceUSD: number;
  mrpINR: number;
  mrpUSD: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  add: (product: Product, color: ProductColor, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      add: (product, color, qty = 1) =>
        set((state) => {
          const id = `${product.slug}__${color.name}`;
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id,
                slug: product.slug,
                name: product.name,
                colorName: color.name,
                colorHex: color.hex,
                render: product.render,
                priceINR: product.priceINR,
                priceUSD: product.priceUSD,
                mrpINR: product.mrpINR,
                mrpUSD: product.mrpUSD,
                qty,
              },
            ],
          };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: Math.max(0, Math.min(qty, 99)) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [], couponCode: null }),
      setCoupon: (code) => set({ couponCode: code }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "drift-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
      }),
    }
  )
);

// Derived selectors (call with the store's items)
export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items: CartItem[], currency: "INR" | "USD"): number {
  return items.reduce(
    (sum, i) => sum + (currency === "USD" ? i.priceUSD : i.priceINR) * i.qty,
    0
  );
}

export function cartSavings(items: CartItem[], currency: "INR" | "USD"): number {
  return items.reduce((sum, i) => {
    const price = currency === "USD" ? i.priceUSD : i.priceINR;
    const mrp = currency === "USD" ? i.mrpUSD : i.mrpINR;
    return sum + (mrp - price) * i.qty;
  }, 0);
}
