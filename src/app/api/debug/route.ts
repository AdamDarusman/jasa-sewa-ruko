import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const envKeys = Object.keys(process.env).filter((k) =>
    /DATABASE|POSTGRES|PRISMA|JWT/i.test(k)
  );

  let dbStatus = "unknown";
  let rukoCount = -1;
  let errorMsg = null;

  try {
    rukoCount = await prisma.ruko.count();
    dbStatus = "connected";
  } catch (err) {
    dbStatus = "error";
    errorMsg = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    status: dbStatus,
    rukoCount,
    error: errorMsg,
    availableEnvKeys: envKeys,
    databaseUrlProtocol: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(":")[0] : null,
    storagePostgresProtocol: process.env.STORAGE_SEWA_RUKO_POSTGRES_URL ? process.env.STORAGE_SEWA_RUKO_POSTGRES_URL.split(":")[0] : null,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    nodeEnv: process.env.NODE_ENV,
  });
}
