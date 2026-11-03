import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    // Verify SHA512 signature if server key is provided
    if (serverKey && signature_key) {
      const hash = crypto
        .createHash("sha512")
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest("hex");

      if (hash !== signature_key) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 }
        );
      }
    }

    const booking = await prisma.booking.findUnique({
      where: { orderNumber: order_id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    let newStatus = booking.status;
    let isPaid = false;

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        newStatus = "PAID";
        isPaid = true;
      }
    } else if (transaction_status === "settlement") {
      newStatus = "PAID";
      isPaid = true;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = "CANCELLED";
    } else if (transaction_status === "pending") {
      newStatus = "PENDING";
    }

    await prisma.booking.update({
      where: { orderNumber: order_id },
      data: {
        status: newStatus,
        paymentType: payment_type || booking.paymentType,
        paidAt: isPaid ? new Date() : booking.paidAt,
      },
    });

    if (isPaid) {
      await prisma.ruko.update({
        where: { id: booking.rukoId },
        data: { status: "RENTED" },
      });
    }

    await prisma.paymentLog.create({
      data: {
        bookingId: booking.id,
        orderNumber: order_id,
        rawStatus: transaction_status,
        paymentType: payment_type,
      },
    });

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    return NextResponse.json(
      { error: "Error handling notification" },
      { status: 500 }
    );
  }
}
