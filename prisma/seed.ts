import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing data
  await prisma.paymentLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ruko.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // 3. Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Administrator RukoHub",
      email: "admin@ruko.id",
      password: adminPassword,
      phone: "081234567890",
      role: "ADMIN",
    },
  });

  const tenant1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      password: userPassword,
      phone: "081298765432",
      role: "USER",
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      name: "Siti Rahmawati",
      email: "siti@gmail.com",
      password: userPassword,
      phone: "081377889900",
      role: "USER",
    },
  });

  console.log("Created users:", admin.email, tenant1.email, tenant2.email);

  // 4. Create Rukos (All Real Commercial Shop-Houses / Ruko)
  const rukosData = [
    {
      title: "Ruko Pamulang Square Point No. 8",
      slug: "ruko-pamulang-square-point-8",
      description: "Ruko strategis 2 lantai tepat di jalur utama Pamulang, Tangerang Selatan. Sangat cocok untuk cafe, kantor cabang, minimarket, atau klinik kecantikan. Dilengkapi area parkir pengunjung luas dan keamanan 24 jam.",
      address: "Jl. Surya Kencana No. 8, Pamulang Barat",
      city: "Tangerang Selatan",
      pricePerYear: 65000000,
      pricePerMonth: 6000000,
      buildingArea: 120,
      landArea: 80,
      floors: 2,
      electricity: "3500 VA",
      water: "Air Tanah Bersih + Toren",
      certType: "SHM (Sertifikat Hak Milik)",
      facilities: JSON.stringify(["Parkir Luas", "Akses Jalan Utama", "Keamanan 24 Jam", "2 Toilet", "Pintu Rolling Door Besi"]),
      imageUrl: "/images/ruko/ruko-1-pamulang.jpg",
      status: "AVAILABLE",
    },
    {
      title: "Ruko Bintaro Arcade Plaza Blok B3",
      slug: "ruko-bintaro-arcade-plaza-b3",
      description: "Ruko mewah modern 3 lantai dengan fasad kaca modern di kawasan prestisius Bintaro Sektor 7. Lokasi ramai dikelilingi perumahan elit dan pusat kuliner. Siap pakai untuk kantor startup atau showroom.",
      address: "Jl. Boulevard Bintaro Jaya Sektor 7 Blok B3",
      city: "Tangerang Selatan",
      pricePerYear: 110000000,
      pricePerMonth: 10000000,
      buildingArea: 210,
      landArea: 90,
      floors: 3,
      electricity: "5500 VA",
      water: "PDAM Tirta Benteng",
      certType: "HGB Murni",
      facilities: JSON.stringify(["Fasad Kaca Tempered", "Parkir Basement & Outdoor", "CCTV Terintegrasi", "AC Terpasang", "Lift Barang"]),
      imageUrl: "/images/ruko/ruko-2-bintaro.jpg",
      status: "AVAILABLE",
    },
    {
      title: "Ruko BSD City Golden Boulevard Commercial",
      slug: "ruko-bsd-city-golden-boulevard",
      description: "Ruko komersial 2,5 lantai di jantung BSD City. Lalu lintas kendaraan ramai setiap hari, dekat akses tol Serpong-Balaraja dan stasiun KRL. Cocok untuk lembaga kursus, kantor notaris, atau studio kreatif.",
      address: "Jl. Pahlawan Seribu No. 22, BSD City",
      city: "Tangerang Selatan",
      pricePerYear: 90000000,
      pricePerMonth: 8000000,
      buildingArea: 165,
      landArea: 75,
      floors: 2,
      electricity: "4400 VA",
      water: "PDAM",
      certType: "HGB",
      facilities: JSON.stringify(["Parkir Khusus", "Keamanan One Gate", "3 Kamar Mandi", "Gudang Belakang"]),
      imageUrl: "/images/ruko/ruko-3-bsd.jpg",
      status: "AVAILABLE",
    },
    {
      title: "Ruko Ciputat Raya Prime Corner",
      slug: "ruko-ciputat-raya-prime-corner",
      description: "Ruko posisi hook menghadap langsung ke jalan raya nasional Ciputat. Visibilitas luar biasa dengan neon box siap pasang. Sangat prospektif untuk ekspansi bisnis kuliner franchise atau apotek.",
      address: "Jl. Ir. H. Juanda No. 105, Ciputat",
      city: "Tangerang Selatan",
      pricePerYear: 75000000,
      pricePerMonth: 7000000,
      buildingArea: 140,
      landArea: 95,
      floors: 2,
      electricity: "3500 VA",
      water: "Air Jetpump + Filter",
      certType: "SHM",
      facilities: JSON.stringify(["Posisi Hook", "Parkir Mobil 4 Unit", "Spanduk Promosi Luas", "Bebas Banjir"]),
      imageUrl: "/images/ruko/ruko-4-ciputat.jpg",
      status: "RENTED",
    },
    {
      title: "Ruko Alam Sutera Prominence Business",
      slug: "ruko-alam-sutera-prominence-business",
      description: "Ruko 3 lantai di kawasan premium Alam Sutera dengan captive market ekspatriat dan mahasiswa kampus ternama. Lingkungan bersih, asri, dan sistem pengelolaan gedung profesional.",
      address: "Jl. Jalur Sutera Barat Kav. 15",
      city: "Tangerang Selatan",
      pricePerYear: 135000000,
      pricePerMonth: 12500000,
      buildingArea: 240,
      landArea: 100,
      floors: 3,
      electricity: "7700 VA",
      water: "PDAM Alam Sutera",
      certType: "PPJB Siap AJB",
      facilities: JSON.stringify(["Double Fasad Modern", "Parkir Terkelola", "Hydrant Pemadam", "Keamanan 24 Jam Patroli"]),
      imageUrl: "/images/ruko/ruko-5-alamsutera.jpg",
      status: "AVAILABLE",
    },
    {
      title: "Ruko Serpong Paradise Walk",
      slug: "ruko-serpong-paradise-walk",
      description: "Ruko compact 2 lantai bernuansa semi-outdoor di kawasan perumahan Serpong. Cocok untuk laundry premium, bakery, pet shop, atau barbershop.",
      address: "Kawasan Paradise Serpong City Blok D1",
      city: "Tangerang Selatan",
      pricePerYear: 50000000,
      pricePerMonth: 4500000,
      buildingArea: 90,
      landArea: 60,
      floors: 2,
      electricity: "2200 VA",
      water: "Air Bersih",
      certType: "SHGB",
      facilities: JSON.stringify(["Balkon Lantai 2", "Parkir Roda Dua & Empat", "Taman Asri", "Jaringan Fiber Optic"]),
      imageUrl: "/images/ruko/ruko-6-serpong.jpg",
      status: "AVAILABLE",
    },
  ];

  const createdRukos = [];
  for (const r of rukosData) {
    const created = await prisma.ruko.create({ data: r });
    createdRukos.push(created);
  }

  console.log(`Created ${createdRukos.length} rukos.`);

  // 5. Create Sample Bookings (with various dates for financial report testing)
  const booking1 = await prisma.booking.create({
    data: {
      orderNumber: "INV-20261015-0001",
      userId: tenant1.id,
      rukoId: createdRukos[3].id, // Ciputat Raya (Status RENTED)
      startDate: new Date("2026-10-15T00:00:00Z"),
      durationMonths: 12,
      endDate: new Date("2027-10-14T23:59:59Z"),
      totalAmount: 75000000,
      status: "PAID",
      paymentType: "bank_transfer",
      paidAt: new Date("2026-10-15T10:30:00Z"),
      notes: "Sewa untuk outlet Apotek & Klinik 24 Jam",
      createdAt: new Date("2026-10-15T09:00:00Z"),
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      orderNumber: "INV-20261028-0002",
      userId: tenant2.id,
      rukoId: createdRukos[0].id,
      startDate: new Date("2026-11-01T00:00:00Z"),
      durationMonths: 6,
      endDate: new Date("2027-04-30T23:59:59Z"),
      totalAmount: 36000000,
      status: "PAID",
      paymentType: "qris",
      paidAt: new Date("2026-10-28T14:15:00Z"),
      notes: "Sewa lantai 1 untuk coffee shop",
      createdAt: new Date("2026-10-28T13:45:00Z"),
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      orderNumber: "INV-20261102-0003",
      userId: tenant1.id,
      rukoId: createdRukos[1].id,
      startDate: new Date("2026-11-10T00:00:00Z"),
      durationMonths: 12,
      endDate: new Date("2027-11-09T23:59:59Z"),
      totalAmount: 110000000,
      status: "PENDING",
      paymentType: "midtrans_snap",
      notes: "Menunggu pembayaran via payment gateway",
      createdAt: new Date("2026-11-02T10:00:00Z"),
    },
  });

  // Create payment logs
  await prisma.paymentLog.create({
    data: {
      bookingId: booking1.id,
      orderNumber: booking1.orderNumber,
      rawStatus: "settlement",
      paymentType: "bank_transfer - BCA",
      transactionTime: new Date("2026-10-15T10:30:00Z"),
    },
  });

  await prisma.paymentLog.create({
    data: {
      bookingId: booking2.id,
      orderNumber: booking2.orderNumber,
      rawStatus: "settlement",
      paymentType: "qris - GoPay",
      transactionTime: new Date("2026-10-28T14:15:00Z"),
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
