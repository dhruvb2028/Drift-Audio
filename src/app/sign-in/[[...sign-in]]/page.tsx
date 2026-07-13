import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your DRIFT AUDIO account.",
};

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignInPage() {
  if (!hasClerk) redirect("/");
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to check out securely and manage your orders."
    >
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/account" />
    </AuthShell>
  );
}
