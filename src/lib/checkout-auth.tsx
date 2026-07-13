"use client";

import { useClerk, useUser } from "@clerk/nextjs";

// Build-time constant → the branch below is stable across every render, so the
// conditional hook call is safe (same pattern as auth-buttons.tsx).
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export interface CheckoutGate {
  /** True once we know the visitor is signed in and may proceed to payment. */
  ready: boolean;
  /** Opens Clerk's sign-in modal, returning the visitor to the cart afterward. */
  promptSignIn: () => void;
}

/**
 * Returns a login gate for checkout, or `null` when Clerk isn't configured
 * (in which case checkout stays open, exactly as before auth was added).
 */
export function useCheckoutGate(): CheckoutGate | null {
  if (!hasClerk) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useClerkGate();
}

function useClerkGate(): CheckoutGate {
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  return {
    ready: !!isSignedIn,
    promptSignIn: () =>
      clerk.openSignIn({
        fallbackRedirectUrl:
          typeof window !== "undefined" ? window.location.href : "/cart",
      }),
  };
}
