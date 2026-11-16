import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "VENDOR" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Akses ditolak. Halaman ini khusus Penyedia Ruko." },
        { status: 403 }
      );
    }

    const rukoWhere = user.role === "VENDOR" ? { ownerId: user.id } : {};

    const rukos = await prisma.ruko.findMany({
      where: rukoWhere,
      include: {
        owner: {
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

    const rukoIds = rukos.map((r) => r.id);

    const bookings = await prisma.booking.findMany({
      where: {
        rukoId: { in: rukoIds },
      },
      include: {
        ruko: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            imageUrl: true,
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

    let totalRevenue = 0;
    let paidBookings = 0;
    let pendingBookings = 0;

    for (const b of bookings) {
      if (b.status === "PAID") {
        totalRevenue += b.totalAmount;
        paidBookings++;
      } else if (b.status === "PENDING") {
        pendingBookings++;
      }
    }

    const availableCount = rukos.filter((r) => r.status === "AVAILABLE").length;
    const rentedCount = rukos.filter((r) => r.status === "RENTED").length;

    return NextResponse.json({
      vendor: user,
      summary: {
        totalRukos: rukos.length,
        availableCount,
        rentedCount,
        totalRevenue,
        totalBookings: bookings.length,
        paidBookings,
        pendingBookings,
      },
      rukos,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching vendor dashboard:", error);
    return NextResponse.json(
      { error: "Gagal memuat data dashboard penyedia ruko" },
      { status: 500 }
    );
  }
}
