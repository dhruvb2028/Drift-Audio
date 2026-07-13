import type { Metadata } from "next";
import { CartClient } from "@/components/cart/cart-client";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your DRIFT AUDIO cart.",
};

export default function CartPage() {
  return <CartClient />;
}
