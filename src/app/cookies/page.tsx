import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How and why DRIFT AUDIO uses cookies.",
};

export default function CookiesPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Cookie Policy"
      subtitle="A quick guide to the cookies we use and how you can control them."
      updated="July 2026"
      sections={[
        {
          heading: "What are cookies?",
          body: [
            "Cookies are small text files stored in your browser that help a website remember things between visits — like the items in your cart or your currency preference.",
          ],
        },
        {
          heading: "Cookies we use",
          body: ["We keep it minimal and purposeful:"],
          bullets: [
            "Essential: cart contents, wishlist and currency (stored locally in your browser)",
            "Analytics: anonymous usage stats to improve the experience",
            "Preferences: remembering your settings between visits",
          ],
        },
        {
          heading: "Managing cookies",
          body: [
            "You can clear or block cookies at any time in your browser settings. Note that disabling essential storage will reset your cart and preferences.",
          ],
        },
        {
          heading: "A note on this demo",
          body: [
            "This concept store uses only your browser's local storage for cart, wishlist and currency — no third-party tracking cookies are set.",
          ],
        },
      ]}
    />
  );
}
