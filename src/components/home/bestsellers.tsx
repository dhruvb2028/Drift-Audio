"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BESTSELLERS } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function Bestsellers() {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    scroller.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-16">
      <div className="container flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Crowd favourites"
          title="Bestsellers"
          subtitle="The products flying off our virtual shelves."
        />
        <div className="hidden gap-2 sm:flex">
          {(["left", "right"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              aria-label={`Scroll ${dir}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-white/30 hover:text-white cursor-pointer"
            >
              {dir === "left" ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-[max(1.25rem,calc((100vw-1360px)/2+1.25rem))]"
      >
        {BESTSELLERS.map((product) => (
          <div
            key={product.id}
            className="w-[78%] shrink-0 snap-start sm:w-[300px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
