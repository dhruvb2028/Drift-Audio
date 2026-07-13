import type { Metadata } from "next";
import { ContactClient } from "@/components/contact/contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the DRIFT AUDIO team, or browse our FAQ.",
};

export default function ContactPage() {
  return <ContactClient />;
}
