"use client";

import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { useMounted } from "@/lib/use-mounted";
import { getProduct } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const slugs = useRecentlyViewed((s) => s.slugs);
  const mounted = useMounted();

  if (!mounted) return null;

  const products = slugs
    .filter((s) => s !== exclude)
    .map(getProduct)
    .filter(Boolean)
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="font-display text-2xl font-bold text-white">
        Recently viewed
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
