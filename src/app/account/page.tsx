import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { AccountClient } from "@/components/account/account-client";

export const metadata: Metadata = {
  title: "Your account",
  description: "Manage your DRIFT AUDIO profile, orders and preferences.",
};

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function AccountPage() {
  // Auth not configured → there's no account area to show.
  if (!hasClerk) redirect("/");

  // Middleware already guarantees a signed-in user here; this is a belt-and-
  // suspenders check so the page can never render without one.
  const user = await currentUser();
  if (!user) redirect("/");

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";

  // Personalize by first name. Fall back to username, then a name derived from
  // the email handle, so the greeting is friendly even before Clerk collects a
  // real name. Null only if we truly have nothing to go on.
  const firstName =
    user.firstName || user.username || firstNameFromEmail(primaryEmail) || null;

  // Fuller name for the avatar alt text.
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    firstName ||
    "Your account";

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Treat an account created in the last 10 minutes as a first-time visit, so a
  // brand-new registrant is welcomed rather than greeted with "welcome back".
  const isNewUser = Date.now() - new Date(user.createdAt).getTime() < 10 * 60 * 1000;

  return (
    <AccountClient
      firstName={firstName}
      displayName={displayName}
      email={primaryEmail}
      imageUrl={user.imageUrl}
      memberSince={memberSince}
      isNewUser={isNewUser}
    />
  );
}

/** Best-effort first name from an email handle, e.g. "dhruv.b28" → "Dhruv". */
function firstNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const token = local.split(/[._+\-0-9]+/).filter(Boolean)[0] || local;
  return token ? token.charAt(0).toUpperCase() + token.slice(1) : "";
}
