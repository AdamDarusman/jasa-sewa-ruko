import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createMidtransTransaction } from "@/lib/midtrans";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk menyewa ruko." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rukoId, startDate, durationMonths, notes } = body;

    if (!rukoId || !startDate || !durationMonths) {
      return NextResponse.json(
        { error: "Data sewa tidak lengkap (ruko, tanggal mulai, dan durasi wajib diisi)" },
        { status: 400 }
      );
    }

    const ruko = await prisma.ruko.findUnique({
      where: { id: rukoId },
    });

    if (!ruko) {
      return NextResponse.json(
        { error: "Ruko tidak ditemukan" },
        { status: 404 }
      );
    }

    if (ruko.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Maaf, unit ruko ini saat ini sedang tidak tersedia untuk disewa." },
        { status: 400 }
      );
    }

    const duration = parseInt(durationMonths, 10);
    // Hitung total harga: jika 12 bulan (1 tahun) pakai pricePerYear, selain itu pricePerMonth * duration
    let totalAmount = 0;
    if (duration >= 12 && duration % 12 === 0) {
      totalAmount = (duration / 12) * ruko.pricePerYear;
    } else {
      totalAmount = duration * ruko.pricePerMonth;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);

    // Generate unique order number: INV-YYYYMMDD-RANDOM
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNumber = `INV-${dateStr}-${randomHex}`;

    let snapToken = null;
    let snapRedirectUrl = null;

    // Coba buat transaksi ke Midtrans jika memungkinkan
    try {
      const midtransRes = await createMidtransTransaction({
        orderNumber,
        grossAmount: totalAmount,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || undefined,
        itemName: `Sewa ${ruko.title} (${duration} Bulan)`,
      });
      snapToken = midtransRes.token;
      snapRedirectUrl = midtransRes.redirect_url;
    } catch (midtransErr) {
      console.warn("Midtrans transaction generation fallback (demo mode):", midtransErr);
      // Tetap lanjutkan pemesanan, simulator pembayaran siap digunakan
    }

    const booking = await prisma.booking.create({
      data: {
        orderNumber,
        userId: user.id,
        rukoId: ruko.id,
        startDate: start,
        durationMonths: duration,
        endDate: end,
        totalAmount,
        status: "PENDING",
        snapToken,
        snapRedirectUrl,
        notes: notes || null,
      },
      include: {
        ruko: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pesanan sewa ruko" },
      { status: 500 }
    );
  }
}
