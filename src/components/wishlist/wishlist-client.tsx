"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";
import { getProduct } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { buttonVariants } from "@/components/ui/button";

export function WishlistClient() {
  const slugs = useWishlist((s) => s.slugs);
  const mounted = useMounted();

  if (!mounted) return <div className="container py-20 text-white/50">Loading…</div>;

  const products = slugs.map(getProduct).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
          <Heart className="h-9 w-9 text-white/30" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-white">
          Your wishlist is empty
        </h1>
        <p className="mt-2 max-w-sm text-white/55">
          Tap the heart on any product to save it here for later.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-8" })}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
        Your wishlist
      </h1>
      <p className="mt-2 text-white/50">
        {products.length} saved product{products.length !== 1 && "s"}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
