"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "./utils";

interface CurrencyState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "INR",
      setCurrency: (currency) => set({ currency }),
      toggle: () => set({ currency: get().currency === "INR" ? "USD" : "INR" }),
    }),
    { name: "drift-currency" }
  )
);
