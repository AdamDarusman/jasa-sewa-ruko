import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const status = searchParams.get("status") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { address: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (city) {
      where.city = { contains: city };
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (minPrice || maxPrice) {
      where.pricePerYear = {};
      if (minPrice) where.pricePerYear.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerYear.lte = parseFloat(maxPrice);
    }

    const rukos = await prisma.ruko.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ rukos });
  } catch (error) {
    console.error("Error fetching rukos:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar ruko" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Admin yang dapat menambah ruko." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      address,
      city,
      pricePerYear,
      pricePerMonth,
      buildingArea,
      landArea,
      floors,
      electricity,
      water,
      certType,
      facilities,
      imageUrl,
    } = body;

    if (!title || !pricePerYear || !address || !imageUrl) {
      return NextResponse.json(
        { error: "Judul, harga tahunan, alamat, dan foto wajib diisi." },
        { status: 400 }
      );
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const ruko = await prisma.ruko.create({
      data: {
        title,
        slug,
        description: description || "",
        address,
        city: city || "Tangerang Selatan",
        pricePerYear: parseFloat(pricePerYear),
        pricePerMonth: pricePerMonth
          ? parseFloat(pricePerMonth)
          : Math.round(parseFloat(pricePerYear) / 12),
        buildingArea: parseInt(buildingArea) || 100,
        landArea: parseInt(landArea) || 80,
        floors: parseInt(floors) || 2,
        electricity: electricity || "2200 VA",
        water: water || "PDAM",
        certType: certType || "SHM",
        facilities: Array.isArray(facilities)
          ? JSON.stringify(facilities)
          : facilities || "[]",
        imageUrl,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({ success: true, ruko }, { status: 201 });
  } catch (error) {
    console.error("Error creating ruko:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan ruko baru" },
      { status: 500 }
    );
  }
}
