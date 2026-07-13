import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { computeOrderFromLines } from "@/lib/commerce";
import type { Currency } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Line {
  slug: string;
  qty: number;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripeServer();
    const body = await req.json();
    const items: Line[] = Array.isArray(body?.items) ? body.items : [];
    const currency: Currency = body?.currency === "USD" ? "USD" : "INR";
    const couponCode: string | null = body?.couponCode ?? null;

    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Amount is recomputed from trusted server-side prices — never from the client.
    const order = computeOrderFromLines(items, currency, couponCode);
    const amount = Math.round(order.total * 100); // smallest currency unit

    if (amount < 1) {
      return NextResponse.json({ error: "Invalid order amount." }, { status: 400 });
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      // Card-style methods only, resolve inline (no redirect) for a smooth demo.
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      metadata: { project: "drift-audio-demo" },
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      amount,
      currency,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment setup failed";
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
