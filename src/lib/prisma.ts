import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.STORAGE_SEWA_RUKO_DATABASE_URL_POOLED ||
  process.env.STORAGE_SEWA_RUKO_DATABASE_URL ||
  process.env.STORAGE_SEWA_RUKO_POSTGRES_URL ||
  process.env.STORAGE_SEWA_RUKO_PRISMA_DATABASE_URL ||
  process.env.STORAGE_SEWA_RUKO_POSTGRES_PRISMA_URL ||
  process.env.STORAGE_SEWA_RUKO_URL_POOLED ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
