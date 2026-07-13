import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of DRIFT AUDIO.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="The ground rules for using this site and buying our products."
      updated="July 2026"
      sections={[
        {
          heading: "Using this site",
          body: [
            "By browsing or purchasing from DRIFT AUDIO you agree to use the site lawfully and not to disrupt, reverse-engineer or misuse any part of it.",
          ],
        },
        {
          heading: "Orders & pricing",
          body: [
            "All prices are shown in your selected currency and include applicable taxes where stated. We reserve the right to correct pricing errors and to decline or cancel orders in rare cases of obvious mistakes.",
          ],
        },
        {
          heading: "Returns & refunds",
          body: [
            "Products can be returned within 30 days in original condition for a full refund. Refunds are issued to the original payment method once the return is received.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "Our products are covered by the warranty described on the Warranty page. To the extent permitted by law, our liability is limited to the value of the product purchased.",
          ],
        },
        {
          heading: "Changes to these terms",
          body: [
            "We may update these terms from time to time. Continued use of the site after changes means you accept the revised terms.",
          ],
        },
      ]}
    />
  );
}
