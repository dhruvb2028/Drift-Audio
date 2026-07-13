import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // One real read against the database.
  const count = await prisma.order.count();
  const latest = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  console.log(`✅ Connected — ${count} order(s) in the database.`);
  if (latest) {
    console.log(
      `   Latest: ${latest.stripeSessionId} · ${latest.items.length} item(s) · ${latest.currency} ${latest.amountTotal / 100}`
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Prisma connection failed:\n", e);
    await prisma.$disconnect();
    process.exit(1);
  });
