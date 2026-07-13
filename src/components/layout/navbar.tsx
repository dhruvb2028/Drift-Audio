"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { CurrencyToggle } from "./currency-toggle";
import { CartButton } from "./cart-button";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <div
          className={cn(
            "mx-auto flex h-14 max-w-[1360px] items-center gap-3 rounded-full border px-3 transition-all duration-300 sm:px-4",
            scrolled
              ? "border-white/10 bg-background/70 backdrop-blur-xl shadow-lg"
              : "border-transparent bg-transparent"
          )}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white md:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo />

          {/* Desktop nav */}
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SearchBar className="hidden w-56 lg:block" />
            <CurrencyToggle className="hidden sm:flex" />
            <CartButton />
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
