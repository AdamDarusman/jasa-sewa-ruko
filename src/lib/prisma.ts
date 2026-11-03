import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const vercelPostgresUrl =
  process.env.STORAGE_SEWA_RUKO_DATABASE_URL_POOLED ||
  process.env.STORAGE_SEWA_RUKO_DATABASE_URL ||
  process.env.STORAGE_SEWA_RUKO_POSTGRES_URL ||
  process.env.STORAGE_SEWA_RUKO_PRISMA_DATABASE_URL ||
  process.env.STORAGE_SEWA_RUKO_POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_POOLED ||
  process.env.POSTGRES_URL;

// Ensure process.env.DATABASE_URL starts with postgresql:// or postgres://
if (
  vercelPostgresUrl &&
  (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgres"))
) {
  process.env.DATABASE_URL = vercelPostgresUrl;
}

const activeUrl = vercelPostgresUrl || process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: activeUrl
      ? {
          db: {
            url: activeUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
