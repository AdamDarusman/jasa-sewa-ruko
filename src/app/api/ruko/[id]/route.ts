import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const ruko = await prisma.ruko.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!ruko) {
      return NextResponse.json(
        { error: "Ruko tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ruko });
  } catch (error) {
    console.error("Error getting ruko:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail ruko" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Admin yang dapat mengubah data ruko." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const updated = await prisma.ruko.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        address: body.address,
        city: body.city,
        pricePerYear: body.pricePerYear ? parseFloat(body.pricePerYear) : undefined,
        pricePerMonth: body.pricePerMonth ? parseFloat(body.pricePerMonth) : undefined,
        buildingArea: body.buildingArea ? parseInt(body.buildingArea) : undefined,
        landArea: body.landArea ? parseInt(body.landArea) : undefined,
        floors: body.floors ? parseInt(body.floors) : undefined,
        electricity: body.electricity,
        water: body.water,
        certType: body.certType,
        facilities: Array.isArray(body.facilities)
          ? JSON.stringify(body.facilities)
          : body.facilities,
        imageUrl: body.imageUrl,
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, ruko: updated });
  } catch (error) {
    console.error("Error updating ruko:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui ruko" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = params;
    await prisma.ruko.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Ruko berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting ruko:", error);
    return NextResponse.json(
      { error: "Gagal menghapus ruko" },
      { status: 500 }
    );
  }
}
