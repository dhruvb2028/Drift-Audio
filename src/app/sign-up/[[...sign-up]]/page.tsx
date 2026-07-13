import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your DRIFT AUDIO account.",
};

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignUpPage() {
  if (!hasClerk) redirect("/");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join DRIFT AUDIO for faster checkout, order tracking and drops."
    >
      <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/account" />
    </AuthShell>
  );
}
