"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 8;

interface RecentlyViewedState {
  slugs: string[];
  add: (slug: string) => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      slugs: [],
      add: (slug) =>
        set((s) => ({
          slugs: [slug, ...s.slugs.filter((x) => x !== slug)].slice(0, MAX),
        })),
    }),
    { name: "drift-recently-viewed" }
  )
);
