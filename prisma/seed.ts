import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// Load env the same way the app/CLI do (DATABASE_URL lives in .env).
config({ path: ".env.local" });
config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Demo orders so /account has something to render before a real purchase.
// Upserts are idempotent on stripeSessionId, so re-seeding never duplicates.
const demoOrders = [
  {
    stripeSessionId: "seed_demo_session_1",
    userId: "seed_demo_user",
    email: "demo@driftaudio.example",
    currency: "INR",
    items: [
      { productSlug: "airwave-pods-pro", name: "Airwave Pods Pro", colorName: "Carbon", unitAmount: 999900, quantity: 1 },
      { productSlug: "airwave-pods-neo", name: "Airwave Pods Neo", colorName: "Midnight", unitAmount: 499900, quantity: 1 },
    ],
  },
  {
    stripeSessionId: "seed_demo_session_2",
    userId: "seed_demo_user",
    email: "demo@driftaudio.example",
    currency: "INR",
    items: [
      { productSlug: "airwave-pods-sport", name: "Airwave Pods Sport", colorName: "Blaze Red", unitAmount: 349900, quantity: 2 },
    ],
  },
];

async function main() {
  for (const o of demoOrders) {
    const amountTotal = o.items.reduce((s, i) => s + i.unitAmount * i.quantity, 0);
    await prisma.order.upsert({
      where: { stripeSessionId: o.stripeSessionId },
      update: {},
      create: {
        userId: o.userId,
        email: o.email,
        stripeSessionId: o.stripeSessionId,
        amountTotal,
        currency: o.currency,
        status: "paid",
        items: { create: o.items },
      },
    });
  }
  const count = await prisma.order.count();
  console.log(`✅ Seed complete — ${count} order(s) in the database.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:\n", e);
    await prisma.$disconnect();
    process.exit(1);
  });
