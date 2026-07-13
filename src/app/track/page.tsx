import type { Metadata } from "next";
import { TrackClient } from "@/components/track/track-client";

export const metadata: Metadata = {
  title: "Track order",
  description: "Track your DRIFT AUDIO order status.",
};

export default function TrackPage() {
  return <TrackClient />;
}
