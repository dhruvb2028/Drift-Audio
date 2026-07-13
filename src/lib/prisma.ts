import { PrismaClient } from "@/generated/prisma/client";

/** True once a database is configured. Order features no-op until then. */
export const hasDatabase = !!process.env.DATABASE_URL;

function makeClient() {
  // Prisma Postgres connects over its Accelerate URL (prisma+postgres://…),
  // which handles connection pooling for serverless out of the box.
  return new PrismaClient({ accelerateUrl: process.env.DATABASE_URL as string });
}

type AppPrismaClient = ReturnType<typeof makeClient>;

// Reuse a single client across hot reloads / serverless invocations so we don't
// exhaust the connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma?: AppPrismaClient;
};

export const prisma: AppPrismaClient | null = hasDatabase
  ? (globalForPrisma.prisma ?? makeClient())
  : null;

if (prisma && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
