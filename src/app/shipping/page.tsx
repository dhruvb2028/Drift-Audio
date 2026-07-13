import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "Shipping",
  description: "DRIFT AUDIO shipping options, delivery times and tracking.",
};

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Shipping"
      subtitle="Fast, fully tracked delivery — and it's free once your cart crosses the free-shipping threshold."
      updated="July 2026"
      sections={[
        {
          heading: "Delivery times",
          body: [
            "Orders placed before 4pm ship the same day. You'll have your sound in:",
          ],
          bullets: [
            "Standard: 3–5 business days",
            "Express: 1–2 business days",
            "Metro same-day in select cities",
          ],
        },
        {
          heading: "Shipping costs",
          body: [
            "Standard shipping is free above the threshold shown in your cart, and a small flat fee below it. Express is a flat surcharge calculated at checkout.",
            "The free-shipping progress bar in your cart shows exactly how much more you need to unlock free delivery.",
          ],
        },
        {
          heading: "Tracking your order",
          body: [
            "Every order ships with end-to-end tracking. Use the Track Order page with your order number to see live status from packed to delivered.",
          ],
        },
        {
          heading: "International shipping",
          body: [
            "We ship to 40+ countries. Duties and taxes for international orders are calculated at checkout so there are no surprises on delivery.",
          ],
        },
      ]}
    />
  );
}
