import type { Metadata } from "next";
import { WishlistClient } from "@/components/wishlist/wishlist-client";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved DRIFT AUDIO products.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
