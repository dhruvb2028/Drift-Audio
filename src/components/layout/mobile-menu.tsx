"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { Logo } from "./logo";
import { CurrencyToggle } from "./currency-toggle";
import { MobileAuth } from "./auth-buttons";
import { buttonVariants } from "@/components/ui/button";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed left-0 top-0 z-[90] flex h-full w-[82%] max-w-xs flex-col border-r border-white/10 bg-background p-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-xl px-4 py-3 font-display text-lg font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-4">
              <MobileAuth onNavigate={onClose} />
              <CurrencyToggle className="w-full justify-center" />
              <Link
                href="/products"
                onClick={onClose}
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                  className: "w-full",
                })}
              >
                Shop all products
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
