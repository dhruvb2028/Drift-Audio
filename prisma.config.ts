import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Keep a single source of truth: the Prisma CLI reads the same .env.local that
// Next.js loads at runtime (where the Stripe/Clerk keys already live).
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
