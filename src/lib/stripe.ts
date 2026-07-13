import Stripe from "stripe";

let cached: Stripe | null = null;

/** Server-side Stripe client. Throws a clear error if the secret key is missing. */
export function getStripeServer(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY_MISSING");
  }
  if (!cached) {
    cached = new Stripe(key);
  }
  return cached;
}
