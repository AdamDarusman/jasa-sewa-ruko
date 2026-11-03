"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Maximize2,
  Layers,
  Zap,
  MapPin,
  Play,
  CheckCircle2,
  Star,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface RukoItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  pricePerYear: number;
  pricePerMonth: number;
  buildingArea: number;
  landArea: number;
  floors: number;
  electricity: string;
  water: string;
  certType: string;
  facilities: string;
  imageUrl: string;
  status: string;
}

export default function HomePage() {
  const [rukos, setRukos] = useState<RukoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchRukos = async (searchQuery = search, city = cityFilter, status = statusFilter) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.append("search", searchQuery);
      if (city !== "ALL") query.append("city", city);
      if (status !== "ALL") query.append("status", status);

      const res = await fetch(`/api/ruko?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRukos(data.rukos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRukos(search, cityFilter, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRukos(search, cityFilter, statusFilter);
  };

  const featuredRukos = rukos.slice(0, 6);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-10">
      {/* =========================================================================
          SECTION 1: HERO CONTAINER (Top-Left of Image 2)
         ========================================================================= */}
      <section className="bg-[#FAF9F5] rounded-[36px] p-6 sm:p-10 lg:p-14 border border-[#E7E5DC] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Social Proof */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1916] leading-[1.12]">
                Temukan Tempat{" "}
                <span className="font-serif italic font-normal text-[#1E4D34] block sm:inline">
                  Usaha Terbaik
                </span>{" "}
                untuk Tumbuh ✳
              </h1>

              <p className="text-sm sm:text-base text-[#615C4F] max-w-lg leading-relaxed">
                Jelajahi kurasi ruko komersial siap pakai di Jabodetabek yang dirancang untuk mempercepat skala usaha, lengkap dengan payment gateway otomatis dan legalitas terjamin.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#katalog-ruko"
                className="flex items-center gap-3 pl-6 pr-2.5 py-3.5 rounded-full bg-[#1A1916] hover:bg-[#2C2924] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all group"
              >
                <span>Lihat Katalog Ruko</span>
                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>

              <Link
                href="/login"
                className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold text-[#1A1916] hover:bg-[#EFECE5] transition-colors"
              >
                Masuk Akun Demo
              </Link>
            </div>

            {/* Social Proof & Metrics (Exact match to Image 2) */}
            <div className="pt-6 border-t border-[#EAE8DF] flex flex-wrap items-center gap-8 sm:gap-12">
              {/* Avatar Stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1916]">Lebih dari 100+</div>
                  <div className="text-[11px] text-[#7A7566]">Unit Ruko Terverifikasi</div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-xs font-black text-[#1A1916] mr-1">5/5</span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <div className="text-[11px] text-[#7A7566] mt-0.5">
                  50+ Ulasan Positif Pemilik Usaha
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Badges (From Image 2) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden bg-[#EAE8DF] aspect-[4/3] sm:aspect-[14/11] border border-[#E0DED4] shadow-sm">
              <img
                src="/images/ruko/ruko-1-pamulang.jpg"
                alt="Ruko Komersial Siap Pakai"
                className="w-full h-full object-cover"
              />

              {/* Floating Badge 1: Discount Promo (Top Left) */}
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-black/5 max-w-[140px]">
                <div className="text-[9px] font-semibold text-[#7A7566]">Hemat Sewa s/d</div>
                <div className="text-2xl font-black text-[#1E4D34] leading-tight">20%</div>
                <div className="text-[9px] text-[#7A7566] font-medium mt-0.5">Sewa Tahunan</div>
              </div>

              {/* Floating Badge 2: Virtual Tour (Top Right) */}
              <div className="absolute top-5 right-5 bg-black/75 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Unit Tour</span>
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-2 h-2 fill-current" />
                </div>
              </div>

              {/* Floating Badge 3: Unit Info Pill (Bottom Right) */}
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-black/5 max-w-[210px] space-y-1">
                <div className="text-[10px] font-bold text-[#7A7566] uppercase tracking-wider">
                  Ruko Pamulang Point
                </div>
                <div className="text-base font-black text-[#1E4D34]">
                  Rp 65.000.000 <span className="text-[10px] font-normal text-[#7A7566]">/thn</span>
                </div>
                <div className="text-[10px] text-[#7A7566] leading-tight">
                  Lokasi ramai di jalur utama dekat kampus UNPAM.
                </div>
              </div>

              {/* Floating Badge 4: Verifier (Bottom Left) */}
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-black/5 flex items-center gap-2 max-w-[170px]">
                <div className="w-7 h-7 rounded-full bg-[#1E4D34] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-[#2C2924] font-semibold leading-tight">
                  Legalitas SHM Resmi Terverifikasi
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FILTER & SEARCH BAR (Clean, Organic, Uncluttered)
         ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-[#E7E5DC] shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative flex items-center">
            <Search className="w-4 h-4 text-[#8C877A] absolute left-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ruko, jalan, atau daerah (misal: Pamulang, Bintaro)..."
              className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] placeholder-[#8C877A] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
            >
              <option value="ALL">Semua Wilayah</option>
              <option value="Tangerang Selatan">Tangerang Selatan</option>
              <option value="Pamulang">Pamulang (UNPAM)</option>
              <option value="Bintaro">Bintaro Sektor 7</option>
              <option value="BSD">BSD City</option>
              <option value="Ciputat">Ciputat Raya</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
            >
              <option value="ALL">Semua Status</option>
              <option value="AVAILABLE">Tersedia</option>
              <option value="RENTED">Tersewa</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[46px] flex items-center justify-center gap-2 bg-[#1E4D34] hover:bg-[#153826] text-white text-xs sm:text-sm font-semibold rounded-2xl transition shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Cari Unit</span>
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          SECTION 2: FEATURED PROPERTIES (Top-Right of Image 2)
         ========================================================================= */}
      <section id="katalog-ruko" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#1E4D34] flex items-center gap-1.5 uppercase tracking-wider">
              <span>✳</span>
              <span>(Unit Unggulan)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1916]">
              Pilihan Unit Ruko{" "}
              <span className="font-serif italic text-[#1E4D34]">Terpopuler</span>
            </h2>
          </div>

          <div className="text-xs text-[#7A7566]">
            Menampilkan <strong className="text-[#1A1916]">{featuredRukos.length}</strong> unit ruko
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[28px] h-96 animate-pulse border border-[#E7E5DC]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredRukos.map((ruko) => {
              const isAvailable = ruko.status === "AVAILABLE";
              return (
                <Link
                  key={ruko.id}
                  href={`/ruko/${ruko.id}`}
                  className="group bg-white rounded-[28px] p-4 border border-[#E7E5DC] shadow-sm hover:shadow-md transition-all duration-300 block"
                >
                  {/* Photo with Overlay Specs Pill (Match Image 2 Top-Right) */}
                  <div className="relative h-60 w-full rounded-[20px] overflow-hidden bg-[#EAE8DF]">
                    <img
                      src={ruko.imageUrl}
                      alt={ruko.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status Chip */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                          isAvailable
                            ? "bg-[#1E4D34] text-white"
                            : "bg-[#4A463B] text-white"
                        }`}
                      >
                        {isAvailable ? "Tersedia" : "Tersewa"}
                      </span>
                    </div>

                    {/* Specs Pill Overlay (Exact design from Image 2) */}
                    <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md py-2 px-3 rounded-full text-[11px] font-medium text-[#4A463B] flex items-center justify-around shadow-sm border border-black/5">
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-[#1E4D34]" />
                        <span>LB {ruko.buildingArea} m²</span>
                      </div>
                      <span className="text-[#C5C1B4]">|</span>
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#1E4D34]" />
                        <span>{ruko.floors} Lantai</span>
                      </div>
                      <span className="text-[#C5C1B4]">|</span>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#1E4D34]" />
                        <span>{ruko.electricity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Price (Exact match to Image 2) */}
                  <div className="pt-4 px-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-base text-[#1A1916] group-hover:text-[#1E4D34] transition-colors line-clamp-1">
                        {ruko.title}
                      </h3>
                      <div className="font-extrabold text-sm sm:text-base text-[#1E4D34] shrink-0">
                        {formatRupiah(ruko.pricePerYear)}
                        <span className="text-[10px] font-normal text-[#7A7566]">/thn</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#7A7566] flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-[#A8A394] shrink-0" />
                      <span>{ruko.address}, {ruko.city}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: ABOUT US & 3 PASTEL FEATURE CARDS (Bottom-Left of Image 2)
         ========================================================================= */}
      <section className="bg-white rounded-[36px] p-6 sm:p-10 lg:p-14 border border-[#E7E5DC] shadow-sm space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 text-xs font-semibold text-[#1E4D34] flex items-center gap-1.5 uppercase tracking-wider">
            <span>✳</span>
            <span>(Tentang Kami)</span>
          </div>

          <div className="lg:col-span-9">
            <p className="text-base sm:text-lg text-[#2C2924] leading-relaxed font-normal">
              Kami percaya bahwa menemukan ruko komersial atau ruang kantor yang tepat seharusnya menjadi pengalaman yang menyenangkan dan bebas stres. RukoHub menghadirkan kurasi tempat usaha terbaik dengan standar legalitas teruji, integrasi payment gateway otomatis, serta transparansi laporan keuangan digital.
            </p>
          </div>
        </div>

        {/* 3 Pastel Cards (Exact match to Image 2 Bottom-Left) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Soft Sage Green */}
          <div className="bg-[#E4EFE8] rounded-[28px] p-8 space-y-8 flex flex-col justify-between">
            <div className="w-16 h-16 rounded-full bg-[#1E4D34]/10 flex items-center justify-center text-[#1E4D34]">
              {/* Organic 4-point star icon */}
              <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#153826]">
                Legalitas SHM / HGB Terverifikasi
              </h3>
              <p className="text-xs sm:text-sm text-[#486354] leading-relaxed">
                Seluruh unit ruko telah melalui validasi kepemilikan sertifikat resmi dan izin komersial bebas sengketa.
              </p>
            </div>
          </div>

          {/* Card 2: Soft Gray/Lavender */}
          <div className="bg-[#E9ECF1] rounded-[28px] p-8 space-y-8 flex flex-col justify-between">
            <div className="w-16 h-16 rounded-full bg-[#354866]/10 flex items-center justify-center text-[#354866]">
              {/* Dotted circle pattern */}
              <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="4" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="20" cy="12" r="2" />
                <circle cx="18" cy="18" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="6" cy="6" r="2" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#1F2E45]">
                Payment Gateway & Invoice PDF
              </h3>
              <p className="text-xs sm:text-sm text-[#4C5B73] leading-relaxed">
                Pembayaran otomatis via Midtrans (QRIS, VA Bank) dan penerbitan bukti struk/invoice sah format PDF instan.
              </p>
            </div>
          </div>

          {/* Card 3: Soft Warm Sand/Cream */}
          <div className="bg-[#EFECE3] rounded-[28px] p-8 space-y-8 flex flex-col justify-between">
            <div className="w-16 h-16 rounded-full bg-[#6B5A42]/10 flex items-center justify-center text-[#6B5A42]">
              {/* Clover/flower icon */}
              <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                <circle cx="9" cy="9" r="4" />
                <circle cx="15" cy="9" r="4" />
                <circle cx="9" cy="15" r="4" />
                <circle cx="15" cy="15" r="4" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#3B3020]">
                Laporan Keuangan Transparan
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6350] leading-relaxed">
                Panel admin terpadu untuk menyaring transaksi by date range dan langsung ekspor ke format Excel (.xlsx) atau PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CONTACT US / CTA BANNER (Bottom-Right of Image 2)
         ========================================================================= */}
      <section className="bg-[#2D4A3E] text-white rounded-[36px] overflow-hidden border border-[#233B31] shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Heading & Action */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5 uppercase tracking-wider">
                <span>✳</span>
                <span>(Konsultasi Sewa)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15]">
                Siap Menemukan{" "}
                <span className="font-serif italic font-normal text-emerald-200 block sm:inline">
                  Ruko Impianmu?
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md leading-relaxed">
                Konsultasikan kebutuhan tempat usaha Anda dengan tim RukoHub. Dapatkan pendampingan survei lokasi dan negosiasi sewa terbaik.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 pl-6 pr-2.5 py-3 rounded-full bg-white hover:bg-[#FAF9F5] text-[#1A1916] text-xs sm:text-sm font-bold shadow-md transition-all group"
              >
                <span>Hubungi Kami via WhatsApp</span>
                <div className="w-8 h-8 rounded-full bg-[#1E4D34] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Photography */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/images/ruko/ruko-cta-banner.jpg"
              alt="Arsitektur Modern Ruko"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
