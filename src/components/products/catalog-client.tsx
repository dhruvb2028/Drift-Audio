"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { CATEGORIES, discountPct, type CategoryId } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating" | "discount";
type PriceBucket = "all" | "under2k" | "2k-5k" | "over5k";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest discount" },
];

const PRICE_BUCKETS: { value: PriceBucket; label: string }[] = [
  { value: "all", label: "All prices" },
  { value: "under2k", label: "Under ₹2,000" },
  { value: "2k-5k", label: "₹2,000 – ₹5,000" },
  { value: "over5k", label: "Over ₹5,000" },
];

export function CatalogClient() {
  const params = useSearchParams();
  const router = useRouter();

  const urlCategory = (params.get("category") as CategoryId | null) ?? "all";
  const query = params.get("q")?.trim().toLowerCase() ?? "";

  const [category, setCategory] = useState<CategoryId | "all">(urlCategory);
  const [sort, setSort] = useState<Sort>("featured");
  const [price, setPrice] = useState<PriceBucket>("all");

  // Keep local category in sync when the URL changes (e.g. navbar links).
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();

    if (category !== "all") list = list.filter((p) => p.category === category);

    if (query) {
      list = list.filter((p) => {
        const cat = CATEGORIES.find((c) => c.id === p.category)?.label ?? "";
        return (
          p.name.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          cat.toLowerCase().includes(query)
        );
      });
    }

    if (price !== "all") {
      list = list.filter((p) => {
        if (price === "under2k") return p.priceINR < 2000;
        if (price === "2k-5k") return p.priceINR >= 2000 && p.priceINR <= 5000;
        return p.priceINR > 5000;
      });
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.priceINR - b.priceINR);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceINR - a.priceINR);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => discountPct(b) - discountPct(a));
        break;
      default:
        list.sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
        );
    }
    return list;
  }, [category, query, price, sort]);

  function selectCategory(c: CategoryId | "all") {
    setCategory(c);
    // reflect in URL without the search query
    const url = c === "all" ? "/products" : `/products?category=${c}`;
    router.replace(url, { scroll: false });
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          {query ? (
            <>Results for “{query}”</>
          ) : category !== "all" ? (
            CATEGORIES.find((c) => c.id === category)?.label
          ) : (
            "All products"
          )}
        </h1>
        <p className="mt-2 text-white/50">
          {filtered.length} product{filtered.length !== 1 && "s"}
          {query && (
            <button
              onClick={() => router.replace("/products", { scroll: false })}
              className="ml-3 inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Clear search
            </button>
          )}
        </p>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {[{ id: "all", label: "All" }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => selectCategory(c.id as CategoryId | "all")}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer sm:min-h-0",
              category === c.id
                ? "border-brand bg-brand/15 text-white"
                : "border-white/12 text-white/60 hover:border-white/25 hover:text-white"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-card p-3">
        <span className="flex items-center gap-2 px-2 text-sm text-white/50">
          <SlidersHorizontal className="h-4 w-4" /> Filter
        </span>
        <select
          value={price}
          onChange={(e) => setPrice(e.target.value as PriceBucket)}
          aria-label="Filter by price"
          className="min-h-11 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white focus:border-brand/50 focus:outline-none cursor-pointer sm:min-h-0"
        >
          {PRICE_BUCKETS.map((b) => (
            <option key={b.value} value={b.value} className="bg-background">
              {b.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort products"
          className="ml-auto min-h-11 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white focus:border-brand/50 focus:outline-none cursor-pointer sm:min-h-0"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-background">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/12 py-24 text-center">
          <p className="font-display text-xl font-semibold text-white">
            Nothing here… yet
          </p>
          <p className="mt-2 max-w-sm text-white/50">
            No products match these filters. Try widening your price range or
            clearing the search.
          </p>
          <button
            onClick={() => {
              setPrice("all");
              selectCategory("all");
              router.replace("/products", { scroll: false });
            }}
            className="mt-6 rounded-full bg-brand-gradient px-6 py-3 text-sm font-medium text-white hover:brightness-110 cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
