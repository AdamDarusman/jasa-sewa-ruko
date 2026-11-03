import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { orderNumber, paymentMethod } = await request.json();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number wajib diisi" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { orderNumber },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    const now = new Date();
    const method = paymentMethod || "Simulator QRIS / Transfer Bank";

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { orderNumber },
      data: {
        status: "PAID",
        paymentType: method,
        paidAt: now,
      },
    });

    // Update ruko status to RENTED
    await prisma.ruko.update({
      where: { id: booking.rukoId },
      data: { status: "RENTED" },
    });

    // Record payment log
    await prisma.paymentLog.create({
      data: {
        bookingId: booking.id,
        orderNumber: booking.orderNumber,
        rawStatus: "settlement_simulated",
        paymentType: method,
        transactionTime: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pembayaran berhasil disimulasikan! Status pesanan kini LUNAS.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Payment simulation error:", error);
    return NextResponse.json(
      { error: "Gagal memproses simulasi pembayaran" },
      { status: 500 }
    );
  }
}
