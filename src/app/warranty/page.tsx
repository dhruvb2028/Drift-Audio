import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "Warranty",
  description: "DRIFT AUDIO's 2-year limited warranty — coverage and claims.",
};

export default function WarrantyPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Warranty"
      subtitle="Every DRIFT product is backed by a 2-year limited warranty against manufacturing defects."
      updated="July 2026"
      sections={[
        {
          heading: "What's covered",
          body: [
            "Your warranty covers defects in materials and workmanship under normal use for two years from the date of delivery.",
          ],
          bullets: [
            "Battery faults that fall below 60% of rated capacity",
            "Driver, speaker or microphone failure",
            "Charging case and connector defects",
            "Buttons, hinges and structural defects",
          ],
        },
        {
          heading: "What's not covered",
          body: [
            "The warranty does not cover accidental damage, cosmetic wear, or issues caused by misuse.",
          ],
          bullets: [
            "Physical or liquid damage beyond the product's IP rating",
            "Normal wear such as scuffs and ear-tip wear",
            "Loss or theft",
            "Repairs performed by unauthorised third parties",
          ],
        },
        {
          heading: "How to make a claim",
          body: [
            "Reach out through our Contact page with your order number and a short description of the issue. Our team responds within one business day.",
            "For approved claims we cover return shipping and dispatch a replacement or repair at no cost to you.",
          ],
        },
      ]}
    />
  );
}
