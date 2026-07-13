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

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "there";

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <AccountClient
      name={name}
      email={primaryEmail}
      imageUrl={user.imageUrl}
      memberSince={memberSince}
    />
  );
}
