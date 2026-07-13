import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { recordOrderFromSession } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe webhook — the durable, production-correct way orders get recorded.
 * Every request is cryptographically verified against STRIPE_WEBHOOK_SECRET, so
 * a forged "payment succeeded" POST is rejected here and never reaches the DB.
 */
export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeServer();
    const rawBody = await req.text(); // raw body is required for signature checks
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      // Re-verifies payment status from Stripe and writes the order idempotently.
      await recordOrderFromSession(session.id);
    } catch {
      // Transient failure (e.g. DB blip) → 500 so Stripe retries with backoff.
      return NextResponse.json({ received: true, recorded: false }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
