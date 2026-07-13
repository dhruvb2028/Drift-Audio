import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProductRender } from "@/components/ui/product-render";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-28 text-center">
      <div className="relative h-40 w-40 opacity-80">
        <div className="absolute inset-0 rounded-full bg-brand/20 blur-3xl" />
        <ProductRender kind="headphones" color="#EE1C25" className="relative" />
      </div>
      <p className="mt-6 font-display text-6xl font-bold text-brand-gradient">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">
        This track doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-sm text-white/55">
        The page you&apos;re looking for skipped a beat. Let&apos;s get you back
        to the music.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back home
        </Link>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Shop products
        </Link>
      </div>
    </div>
  );
}
