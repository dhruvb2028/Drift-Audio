"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { ProductRender } from "@/components/ui/product-render";
import { PriceTag } from "@/components/ui/price-tag";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const term = q.trim().toLowerCase();
  const results = term
    ? PRODUCTS.filter((p) => {
        const cat = CATEGORIES.find((c) => c.id === p.category)?.label ?? "";
        return (
          p.name.toLowerCase().includes(term) ||
          p.tagline.toLowerCase().includes(term) ||
          cat.toLowerCase().includes(term)
        );
      }).slice(0, 5)
    : [];

  function submit() {
    if (!term) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-sm transition-colors focus-within:border-white/25">
        <Search className="h-4 w-4 shrink-0 text-white/40" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full bg-transparent text-white placeholder:text-white/35 focus:outline-none"
        />
        {q && (
          <button
            aria-label="Clear search"
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            className="text-white/40 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && term && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-white/10 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-white/45">
                No products match “{q.trim()}”.
              </p>
            ) : (
              <ul className="space-y-1">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] p-1.5">
                        <ProductRender kind={p.render} color={p.colors[0].hex} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-white/45">
                          {p.tagline}
                        </span>
                      </span>
                      <PriceTag
                        priceINR={p.priceINR}
                        priceUSD={p.priceUSD}
                        size="sm"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
