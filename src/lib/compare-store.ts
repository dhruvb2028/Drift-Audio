"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_COMPARE = 3;

interface CompareState {
  slugs: string[];
  toggle: (slug: string) => boolean; // returns false if full and not added
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const { slugs } = get();
        if (slugs.includes(slug)) {
          set({ slugs: slugs.filter((x) => x !== slug) });
          return true;
        }
        if (slugs.length >= MAX_COMPARE) return false;
        set({ slugs: [...slugs, slug] });
        return true;
      },
      remove: (slug) => set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "drift-compare" }
  )
);
