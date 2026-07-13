import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { getStripeServer } from "@/lib/stripe";
import { computeOrderFromLines, findCoupon } from "@/lib/commerce";
import { PRODUCTS } from "@/lib/products";
import type { StoredCartItem } from "@/lib/orders";
import type { Currency } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Checkout requires a signed-in user whenever Clerk is configured.
const authRequired = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

interface Line {
  slug: string;
  qty: number;
  colorName?: string;
}

export async function POST(req: Request) {
  try {
    // Gate checkout behind authentication (server-side, so it can't be bypassed).
    // Capture the user id so we can attribute the resulting order to them.
    let userId: string | null = null;
    if (authRequired) {
      const session = await auth();
      if (!session.userId) {
        return NextResponse.json(
          { error: "Please sign in to check out.", code: "auth_required" },
          { status: 401 }
        );
      }
      userId = session.userId;
    }

    const stripe = getStripeServer();
    const body = await req.json();
    const items: Line[] = Array.isArray(body?.items) ? body.items : [];
    const currency: Currency = body?.currency === "USD" ? "USD" : "INR";
    const couponCode: string | null = body?.couponCode ?? null;
    const origin: string =
      typeof body?.origin === "string" ? body.origin : new URL(req.url).origin;

    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Trusted, server-side pricing. The coupon % is applied per unit so the
    // Stripe total exactly matches our order total — client input is ignored.
    const pct = findCoupon(couponCode)?.value ?? 0;
    const cur = currency.toLowerCase();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    // Compact per-line record persisted with the order (via session metadata).
    const storedCart: StoredCartItem[] = [];
    for (const l of items) {
      const p = PRODUCTS.find((x) => x.slug === l.slug);
      if (!p) continue;
      const qty = Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 1)));
      const base = currency === "USD" ? p.priceUSD : p.priceINR;
      const unit = Math.round(base * (1 - pct / 100) * 100);
      line_items.push({
        quantity: qty,
        price_data: {
          currency: cur,
          unit_amount: unit,
          product_data: {
            name: l.colorName ? `${p.name} — ${l.colorName}` : p.name,
          },
        },
      });
      storedCart.push({ slug: p.slug, qty, colorName: l.colorName ?? null, unit });
    }

    if (line_items.length === 0) {
      return NextResponse.json({ error: "No valid items." }, { status: 400 });
    }

    // Shipping as its own line (kept in sync with our own order math).
    const order = computeOrderFromLines(
      items.map((i) => ({ slug: i.slug, qty: i.qty })),
      currency,
      couponCode
    );
    if (order.shipping > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: cur,
          unit_amount: Math.round(order.shipping * 100),
          product_data: { name: "Shipping" },
        },
      });
    }

    // Stripe caps each metadata value at 500 chars; if the cart is unusually
    // large we drop the itemization (the order + Stripe total still persist).
    const cartJson = JSON.stringify(storedCart);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "GB", "CA", "AU", "AE", "SG", "DE", "FR"],
      },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
      metadata: {
        project: "drift-audio-demo",
        couponCode: couponCode ?? "",
        userId: userId ?? "",
        cart: cartJson.length <= 500 ? cartJson : "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    const notConfigured =
      message === "STRIPE_SECRET_KEY_MISSING" ||
      /api key|apikey|Invalid API Key/i.test(message);
    if (notConfigured) {
      return NextResponse.json(
        {
          error:
            "Stripe isn't configured yet. Add your test keys to .env.local and restart the dev server.",
          code: "not_configured",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
