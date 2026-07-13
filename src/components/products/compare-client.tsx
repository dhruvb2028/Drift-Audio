"use client";

import Link from "next/link";
import { GitCompareArrows, X, ShoppingBag } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { useMounted } from "@/lib/use-mounted";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/lib/toast-store";
import { getProduct } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";
import { ProductRender } from "@/components/ui/product-render";
import { PriceTag } from "@/components/ui/price-tag";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button, buttonVariants } from "@/components/ui/button";
import { getStock } from "@/lib/commerce";

export function CompareClient() {
  const slugs = useCompare((s) => s.slugs);
  const remove = useCompare((s) => s.remove);
  const mounted = useMounted();
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const pushToast = useToast((s) => s.push);

  if (!mounted) {
    return <div className="container py-20 text-white/50">Loading…</div>;
  }

  const products = slugs.map(getProduct).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
          <GitCompareArrows className="h-9 w-9 text-white/30" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-white">
          Nothing to compare yet
        </h1>
        <p className="mt-2 max-w-sm text-white/55">
          Add products to compare using the compare icon on any product card.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "mt-8" })}>
          Browse products
        </Link>
      </div>
    );
  }

  // Union of spec labels across selected products
  const specLabels = Array.from(
    new Set(products.flatMap((p) => p!.specs.map((s) => s.label)))
  );

  const rows: { label: string; render: (p: NonNullable<typeof products[number]>) => React.ReactNode }[] = [
    {
      label: "Price",
      render: (p) => (
        <PriceTag priceINR={p.priceINR} priceUSD={p.priceUSD} size="sm" />
      ),
    },
    {
      label: "Rating",
      render: (p) => <RatingStars rating={p.rating} showValue />,
    },
    {
      label: "Category",
      render: (p) => CATEGORIES.find((c) => c.id === p.category)?.label,
    },
    {
      label: "Stock",
      render: (p) => `${getStock(p.slug)} units`,
    },
    ...specLabels.map((label) => ({
      label,
      render: (p: NonNullable<typeof products[number]>) =>
        p.specs.find((s) => s.label === label)?.value ?? "—",
    })),
  ];

  return (
    <div className="container py-10">
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
        Compare
      </h1>
      <p className="mt-2 text-white/50">
        Side-by-side specs for {products.length} product
        {products.length !== 1 && "s"}.
      </p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-card p-4 text-left" />
              {products.map(
                (p) =>
                  p && (
                    <th key={p.slug} className="bg-card p-4 align-top">
                      <div className="relative">
                        <button
                          onClick={() => remove(p.slug)}
                          aria-label={`Remove ${p.name}`}
                          className="absolute right-0 top-0 text-white/40 hover:text-white cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <Link href={`/products/${p.slug}`} className="block">
                          <div className="mx-auto h-24 w-24 rounded-xl bg-white/[0.04] p-2">
                            <ProductRender kind={p.render} color={p.colors[0].hex} />
                          </div>
                          <p className="mt-3 text-center font-display font-semibold text-white hover:text-brand-300">
                            {p.name}
                          </p>
                        </Link>
                        <Button
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() => {
                            add(p, p.colors[0]);
                            pushToast({
                              message: "Added to cart",
                              description: p.name,
                              actionLabel: "View",
                              onAction: openCart,
                            });
                          }}
                        >
                          <ShoppingBag className="h-4 w-4" /> Add
                        </Button>
                      </div>
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 ? "bg-white/[0.02]" : ""}>
                <td className="sticky left-0 z-10 bg-inherit p-4 text-sm font-medium text-white/55">
                  {row.label}
                </td>
                {products.map(
                  (p) =>
                    p && (
                      <td key={p.slug} className="p-4 text-sm text-white">
                        {row.render(p)}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
