import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { CategoryStrip } from "@/components/home/category-strip";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ColorConfigurator } from "@/components/home/color-configurator";
import { Bestsellers } from "@/components/home/bestsellers";
import { FeatureHighlights } from "@/components/home/feature-highlights";
import { Testimonials } from "@/components/home/testimonials";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <CategoryStrip />
      <FeaturedGrid />
      <ProductShowcase />
      <ColorConfigurator />
      <Bestsellers />
      <FeatureHighlights />
      <Testimonials />

      {/* Closing CTA */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-brand-gradient px-8 py-16 text-center md:py-20">
          <div className="absolute inset-0 bg-grid-faint opacity-20 [background-size:40px_40px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Ready to hear the difference?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/85">
              Free shipping, 2-year warranty and 30-day returns on every order.
            </p>
            <Link
              href="/products"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "mt-8",
              })}
            >
              Shop all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
