import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Toaster } from "@/components/ui/toaster";
import { QuickView } from "@/components/products/quick-view";
import { CompareBar } from "@/components/products/compare-bar";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DRIFT AUDIO — Sound Without Limits",
    template: "%s · DRIFT AUDIO",
  },
  description:
    "DRIFT AUDIO crafts premium wireless earbuds, headphones, speakers and smartwatches engineered for immersive, high-energy sound.",
  keywords: [
    "earbuds",
    "headphones",
    "wireless audio",
    "bluetooth speaker",
    "smartwatch",
    "DRIFT AUDIO",
  ],
  openGraph: {
    title: "DRIFT AUDIO — Sound Without Limits",
    description:
      "Premium wireless earbuds, headphones, speakers and smartwatches engineered for immersive sound.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <body className="noise min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <CartDrawer />
        <QuickView />
        <CompareBar />
        <BackToTop />
        <Toaster />
      </body>
    </html>
  );
}
