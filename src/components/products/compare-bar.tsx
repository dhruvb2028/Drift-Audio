"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/lib/compare-store";
import { useMounted } from "@/lib/use-mounted";
import { getProduct } from "@/lib/products";
import { ProductRender } from "@/components/ui/product-render";
import { buttonVariants } from "@/components/ui/button";

export function CompareBar() {
  const slugs = useCompare((s) => s.slugs);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const mounted = useMounted();
  const pathname = usePathname();

  const show = mounted && slugs.length > 0 && pathname !== "/compare";
  const products = slugs.map(getProduct).filter(Boolean);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-4 z-[55] px-3"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/12 bg-popover/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
              {products.map(
                (p) =>
                  p && (
                    <div
                      key={p.slug}
                      className="relative flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-6"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05] p-1">
                        <ProductRender kind={p.render} color={p.colors[0].hex} />
                      </span>
                      <span className="hidden text-xs font-medium text-white sm:block">
                        {p.name}
                      </span>
                      <button
                        onClick={() => remove(p.slug)}
                        aria-label={`Remove ${p.name} from compare`}
                        className="absolute right-1 top-1 text-white/40 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
              )}
            </div>
            <button
              onClick={clear}
              className="shrink-0 text-sm text-white/50 hover:text-white cursor-pointer"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className={buttonVariants({ size: "sm" })}
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare ({products.length})
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
