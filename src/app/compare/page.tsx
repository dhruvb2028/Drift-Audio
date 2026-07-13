import type { Metadata } from "next";
import { CompareClient } from "@/components/products/compare-client";

export const metadata: Metadata = {
  title: "Compare products",
  description: "Compare DRIFT AUDIO products side by side.",
};

export default function ComparePage() {
  return <CompareClient />;
}
