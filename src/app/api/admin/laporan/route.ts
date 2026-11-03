import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Halaman ini khusus Administrator." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const statusParam = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filter date range based on createdAt or paidAt
    if (startDateParam || endDateParam) {
      where.createdAt = {};
      if (startDateParam) {
        const start = new Date(startDateParam);
        start.setHours(0, 0, 0, 0);
        where.createdAt.gte = start;
      }
      if (endDateParam) {
        const end = new Date(endDateParam);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (statusParam && statusParam !== "ALL") {
      where.status = statusParam;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        ruko: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate Financial KPIs
    let totalRevenue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    for (const b of bookings) {
      if (b.status === "PAID") {
        totalRevenue += b.totalAmount;
        paidCount++;
      } else if (b.status === "PENDING") {
        pendingCount++;
      } else {
        cancelledCount++;
      }
    }

    const avgRevenue = paidCount > 0 ? totalRevenue / paidCount : 0;

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalTransactions: bookings.length,
        paidCount,
        pendingCount,
        cancelledCount,
        avgRevenue,
      },
      transactions: bookings,
    });
  } catch (error) {
    console.error("Laporan API error:", error);
    return NextResponse.json(
      { error: "Gagal memproses data laporan keuangan" },
      { status: 500 }
    );
  }
}
