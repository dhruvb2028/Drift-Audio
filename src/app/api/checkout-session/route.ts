import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripeServer } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Session details include customer email/name, so require auth when Clerk is on.
const authRequired = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/** Retrieve a Checkout Session to confirm payment on the success page. */
export async function GET(req: Request) {
  try {
    if (authRequired) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          { error: "Please sign in to view this order.", code: "auth_required" },
          { status: 401 }
        );
      }
    }

    const stripe = getStripeServer();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing session id." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json({
      id: session.id,
      paymentStatus: session.payment_status, // "paid" | "unpaid" | "no_payment_required"
      status: session.status, // "complete" | "open" | "expired"
      amountTotal: session.amount_total,
      currency: session.currency,
      email: session.customer_details?.email ?? null,
      name: session.customer_details?.name ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not retrieve session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
