import "server-only";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/products";

/** Compact per-line record we stash in the Stripe session metadata at creation. */
export interface StoredCartItem {
  slug: string;
  qty: number;
  colorName?: string | null;
  unit: number; // per-unit amount actually charged, smallest currency unit
}

function productName(slug: string): string {
  return PRODUCTS.find((p) => p.slug === slug)?.name ?? slug;
}

/**
 * Persist an order from a Stripe Checkout Session — the ONLY way an order is
 * ever created. Security-critical invariants:
 *   - The single input is a session id. No caller can pass a status or amount.
 *   - "paid" is derived solely from Stripe's own `payment_status`, read back
 *     server-side with the secret key. A forged/guessed id yields no order.
 *   - `amountTotal` is Stripe's number, not anything recomputed from client input.
 *   - Idempotent on the unique `stripeSessionId`, so the webhook and the success
 *     page can both call it without ever double-writing.
 * Returns the order, or null if it isn't a real paid session (or no DB / Stripe).
 */
export async function recordOrderFromSession(sessionId: string) {
  if (!prisma || !sessionId) return null;

  let session: Stripe.Checkout.Session;
  try {
    const stripe = getStripeServer();
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null; // unknown/invalid session id, or Stripe not configured
  }

  // The one gate that makes an order "paid". Client input can never reach it.
  if (session.payment_status !== "paid") return null;

  // Idempotent: one order per session.
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
    include: { items: true },
  });
  if (existing) return existing;

  // Owner is the Clerk user id we attached server-side at session creation.
  const userId = session.metadata?.userId;
  if (!userId) return null;

  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const amountTotal = session.amount_total ?? 0;
  const currency = (session.currency ?? "usd").toUpperCase();

  let stored: StoredCartItem[] = [];
  try {
    const raw = session.metadata?.cart;
    stored = raw ? (JSON.parse(raw) as StoredCartItem[]) : [];
  } catch {
    stored = [];
  }

  const items = stored
    .filter((i) => i && typeof i.slug === "string")
    .map((i) => ({
      productSlug: i.slug,
      name: productName(i.slug),
      colorName: i.colorName ?? null,
      unitAmount: Math.max(0, Math.round(Number(i.unit) || 0)),
      quantity: Math.max(1, Math.round(Number(i.qty) || 1)),
    }));

  try {
    return await prisma.order.create({
      data: {
        userId,
        email,
        stripeSessionId: session.id,
        amountTotal,
        currency,
        status: "paid",
        items: { create: items },
      },
      include: { items: true },
    });
  } catch {
    // Race: webhook + success page created concurrently. The unique constraint
    // means the loser just re-reads the winner's row.
    return prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      include: { items: true },
    });
  }
}

/** All orders for a signed-in user, newest first. Empty when no DB configured. */
export async function getOrdersForUser(userId: string) {
  if (!prisma || !userId) return [];
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}
