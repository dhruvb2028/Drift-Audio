import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** True once a database is configured. Order features no-op until then. */
export const hasDatabase = !!process.env.DATABASE_URL;

function makeClient() {
  // node-postgres driver adapter over the direct Prisma Postgres connection.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
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
