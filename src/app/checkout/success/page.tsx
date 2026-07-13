import type { Metadata } from "next";
import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your DRIFT AUDIO order is confirmed.",
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
