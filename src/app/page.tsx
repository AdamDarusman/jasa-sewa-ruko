"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  MapPin,
  Maximize2,
  Layers,
  Zap,
  CreditCard,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
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

  const fetchRukos = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (cityFilter !== "ALL") query.append("city", cityFilter);
      if (statusFilter !== "ALL") query.append("status", statusFilter);

      const res = await fetch(`/api/ruko?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRukos(data.rukos || []);
      }
    } catch (err) {
      console.error("Failed to load rukos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRukos();
  }, [cityFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRukos();
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium backdrop-blur">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Platform Jasa Sewa Ruko Digital Terintegrasi
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Temukan Ruko Strategis & Buka Peluang Bisnismu Hari Ini
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sewa unit ruko komersial siap pakai di Jabodetabek dengan pembayaran digital instan, cetak invoice struk PDF, dan pengelolaan kontrak yang transparan.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto mt-8 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl text-slate-800">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3"
            >
              {/* Keyword Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama ruko, jalan, atau daerah..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* City Filter */}
              <div className="sm:col-span-3">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value="ALL">Semua Kota</option>
                  <option value="Tangerang Selatan">Tangerang Selatan</option>
                  <option value="Pamulang">Pamulang</option>
                  <option value="Bintaro">Bintaro</option>
                  <option value="BSD">BSD City</option>
                  <option value="Ciputat">Ciputat</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="sm:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="AVAILABLE">Tersedia</option>
                  <option value="RENTED">Tersewa</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[46px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
                >
                  <Search className="w-4 h-4" /> Cari
                </button>
              </div>
            </form>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-300">
            <span className="text-slate-400">Pencarian Populer:</span>
            <button
              onClick={() => { setSearch("Pamulang"); fetchRukos(); }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Dekat UNPAM
            </button>
            <button
              onClick={() => { setSearch("Bintaro"); fetchRukos(); }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              Bintaro Sektor 7
            </button>
            <button
              onClick={() => { setSearch("BSD"); fetchRukos(); }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              BSD Commercial
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Payment Gateway Otomatis</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Pembayaran sewa aman & instan via Midtrans (QRIS, Transfer BCA/Mandiri, E-Wallet).
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cetak Struk & Invoice PDF</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Langsung unduh bukti pembayaran & kontrak sewa resmi dalam format PDF standar pembukuan.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Laporan Keuangan & Filter</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Dashboard keuangan admin terperinci dengan filter tanggal, siap diekspor ke Excel (.xlsx) & PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Katalog Properti
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Daftar Unit Ruko Pilihan
            </h2>
          </div>
          <div className="text-sm text-slate-500">
            Menampilkan <strong className="text-slate-900">{rukos.length}</strong> unit ruko
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-96 border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : rukos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Ruko Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Coba sesuaikan kata kunci pencarian atau reset filter kota dan status ruko.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCityFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rukos.map((ruko) => {
              const isAvailable = ruko.status === "AVAILABLE";
              return (
                <div
                  key={ruko.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image & Status Badge */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ruko.imageUrl}
                      alt={ruko.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md ${
                          isAvailable
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {isAvailable ? "Tersedia" : "Sudah Tersewa"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                      {ruko.city}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                        {ruko.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ruko.address}</span>
                      </p>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {ruko.description}
                      </p>
                    </div>

                    {/* Specifications Specs */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>LB: {ruko.buildingArea} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span>{ruko.floors} Lantai</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{ruko.electricity}</span>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Mulai dari:
                        </div>
                        <div className="text-lg font-extrabold text-blue-600">
                          {formatRupiah(ruko.pricePerYear)}
                          <span className="text-xs font-normal text-slate-500">
                            /thn
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          atau {formatRupiah(ruko.pricePerMonth)}/bln
                        </div>
                      </div>

                      <Link
                        href={`/ruko/${ruko.id}`}
                        className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition ${
                          isAvailable
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isAvailable ? "Sewa Ruko" : "Detail Ruko"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Alur Sewa Section */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Alur Transaksi Mudah
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Cara Menyewa Ruko di RukoHub
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Pilih Unit Ruko</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eksplor katalog ruko, lihat foto fasilitas, ukuran bangunan, dan lokasi strategis yang cocok untuk tokomu.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Pilih Durasi Sewa</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tentukan durasi sewa fleksibel (6 bulan atau tahunan) dan tentukan tanggal mulai pemakaian ruko.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Bayar Otomatis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Selesaikan pembayaran melalui Payment Gateway Midtrans (QRIS, VA Bank, Kartu, atau Simulator Demo).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Cetak Invoice PDF</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dapatkan struk & invoice digital PDF resmi sebagai bukti sah kontrak sewa dan serah terima kunci unit ruko.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
