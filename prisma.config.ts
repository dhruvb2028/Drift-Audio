import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load both env files the CLI might need: .env.local holds the Stripe/Clerk
// keys, .env holds DATABASE_URL written by `prisma postgres link`.
config({ path: ".env.local" });
config(); // .env (does not override values already set above)

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
