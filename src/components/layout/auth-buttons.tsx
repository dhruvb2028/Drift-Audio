"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/** Navbar auth control — "Sign in" when signed out, avatar menu when signed in. */
export function AuthButtons() {
  if (!hasClerk) return null;
  return <NavAuthInner />;
}

function NavAuthInner() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-white/5" />;
  }
  if (isSignedIn) {
    return (
      <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }}>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Your account"
            labelIcon={<UserRound className="h-4 w-4" />}
            href="/account"
          />
        </UserButton.MenuItems>
      </UserButton>
    );
  }
  return (
    <SignInButton mode="modal">
      <button className="hidden h-10 items-center rounded-full border border-white/15 px-4 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white sm:inline-flex cursor-pointer">
        Sign in
      </button>
    </SignInButton>
  );
}

/** Mobile-menu auth control. */
export function MobileAuth({ onNavigate }: { onNavigate?: () => void }) {
  if (!hasClerk) return null;
  return <MobileAuthInner onNavigate={onNavigate} />;
}

function MobileAuthInner({ onNavigate }: { onNavigate?: () => void }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
        <Link
          href="/account"
          onClick={onNavigate}
          className="text-sm text-white/70 transition-colors hover:text-white"
        >
          Your account
        </Link>
      </div>
    );
  }
  return (
    <SignInButton mode="modal">
      <button
        onClick={onNavigate}
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          className: "w-full",
        })}
      >
        Sign in
      </button>
    </SignInButton>
  );
}
