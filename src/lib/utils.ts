import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = "INR" | "USD";

/**
 * Format an amount for the given currency.
 * Amounts are stored per-currency in the product data, so this only handles display.
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === "USD") {
    return "$" + amount.toLocaleString("en-US");
  }
  return "₹" + amount.toLocaleString("en-IN");
}
