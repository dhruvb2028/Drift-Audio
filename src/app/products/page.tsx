import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogClient } from "@/components/products/catalog-client";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Browse DRIFT AUDIO earbuds, headphones, premium ANC, speakers and smartwatches.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-20 text-white/50">Loading products…</div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
