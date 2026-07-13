import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DRIFT AUDIO collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Your privacy matters. Here's a plain-English summary of what we collect and why."
      updated="July 2026"
      sections={[
        {
          heading: "Information we collect",
          body: [
            "We only collect what we need to fulfil your order and improve your experience.",
          ],
          bullets: [
            "Contact and shipping details you enter at checkout",
            "Order history and preferences",
            "Basic device and usage analytics",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use your data to process orders, provide support, prevent fraud and — only with your consent — send you product updates. We never sell your personal information.",
          ],
        },
        {
          heading: "Payment security",
          body: [
            "Card details are handled directly by our payment processor (Stripe) and never touch or get stored on our servers. We only receive a confirmation token for your order.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can request a copy of your data, ask us to correct it, or request deletion at any time via the Contact page. We respond to all requests within 30 days.",
          ],
        },
        {
          heading: "A note on this demo",
          body: [
            "DRIFT AUDIO is a portfolio concept project. No real customer data is collected or processed — this policy illustrates how a production store would communicate its practices.",
          ],
        },
      ]}
    />
  );
}
