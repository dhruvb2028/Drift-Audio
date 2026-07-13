import type { Metadata } from "next";
import { recordOrderFromSession } from "@/lib/orders";
import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your DRIFT AUDIO order is confirmed.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  // Fallback to the webhook: persist the order server-side when the buyer lands
  // here. Idempotent and paid-only, so it never double-writes or trusts input.
  if (session_id) {
    await recordOrderFromSession(session_id).catch(() => {});
  }

  return <CheckoutSuccessClient />;
}
