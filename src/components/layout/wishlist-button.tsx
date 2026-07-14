"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";

export function WishlistButton() {
  const slugs = useWishlist((s) => s.slugs);
  const mounted = useMounted();
  const count = mounted ? slugs.length : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${count} items`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
    >
      <Heart className="h-5 w-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gradient px-1 text-[10px] font-bold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
