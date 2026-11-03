"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  Layers,
  Zap,
  Droplet,
  FileCheck2,
  CheckCircle2,
  Calendar,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface RukoDetail {
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

export default function RukoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [ruko, setRuko] = useState<RukoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking Form State
  const [durationMonths, setDurationMonths] = useState(12);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const fetchRuko = async () => {
      try {
        const res = await fetch(`/api/ruko/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ruko tidak ditemukan");
        setRuko(data.ruko);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat ruko");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRuko();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-96 bg-white rounded-2xl animate-pulse border border-slate-200" />
      </div>
    );
  }

  if (error || !ruko) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">
          {error || "Ruko Tidak Ditemukan"}
        </h2>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const isAnnual = durationMonths >= 12 && durationMonths % 12 === 0;
  const totalPrice = isAnnual
    ? (durationMonths / 12) * ruko.pricePerYear
    : durationMonths * ruko.pricePerMonth;

  let facilitiesList: string[] = [];
  try {
    facilitiesList = JSON.parse(ruko.facilities);
  } catch {
    facilitiesList = ["Parkir Luas", "Keamanan 24 Jam", "Listrik Terpasang"];
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rukoId: ruko.id,
          startDate,
          durationMonths,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/ruko/${ruko.id}`);
          return;
        }
        throw new Error(data.error || "Gagal membuat pesanan sewa");
      }

      // Order created, navigate directly to invoice page
      router.push(`/invoices/${data.booking.orderNumber}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBookingError(err.message);
      } else {
        setBookingError("Terjadi kesalahan saat memproses sewa");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const isAvailable = ruko.status === "AVAILABLE";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Ruko
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Photo & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Photo */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
            <img
              src={ruko.imageUrl}
              alt={ruko.title}
              className="w-full h-[400px] sm:h-[480px] object-cover"
            />
            <div className="absolute top-4 left-4">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md ${
                  isAvailable
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                {isAvailable ? "Unit Tersedia" : "Sudah Tersewa"}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-medium">
              Foto Asli Unit Terverifikasi
            </div>
          </div>

          {/* Title & Location Header */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {ruko.title}
              </h1>
              <div className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold self-start sm:self-auto">
                {ruko.city}
              </div>
            </div>

            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{ruko.address}</span>
            </p>

            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                Deskripsi Properti
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {ruko.description}
              </p>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Spesifikasi Utama Unit
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  Luas Bangunan
                </div>
                <div className="font-extrabold text-slate-800 text-base">
                  {ruko.buildingArea} m²
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                  Luas Tanah
                </div>
                <div className="font-extrabold text-slate-800 text-base">
                  {ruko.landArea} m²
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Jumlah Lantai
                </div>
                <div className="font-extrabold text-slate-800 text-base">
                  {ruko.floors} Tingkat
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Daya Listrik
                </div>
                <div className="font-bold text-slate-800 text-sm">
                  {ruko.electricity}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                  Sumber Air
                </div>
                <div className="font-bold text-slate-800 text-sm truncate">
                  {ruko.water}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-rose-500" />
                  Legalitas
                </div>
                <div className="font-bold text-slate-800 text-sm truncate">
                  {ruko.certType}
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Fasilitas Pendukung
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {facilitiesList.map((fac, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {fac}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Booking Checkout Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tarif Sewa
              </div>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {formatRupiah(ruko.pricePerYear)}
                <span className="text-xs font-normal text-slate-500"> /tahun</span>
              </div>
              <div className="text-xs text-slate-500">
                atau {formatRupiah(ruko.pricePerMonth)} /bulan
              </div>
            </div>

            <hr className="border-slate-100" />

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {isAvailable ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Durasi Sewa
                  </label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value={6}>6 Bulan (Setengah Tahun)</option>
                    <option value={12}>12 Bulan (1 Tahun - Hemat)</option>
                    <option value={24}>24 Bulan (2 Tahun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Mulai Sewa
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Catatan Penggunaan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Untuk usaha cafe / kantor konsultan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Calculation Summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Durasi:</span>
                    <span className="font-semibold text-slate-700">
                      {durationMonths} Bulan
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Biaya Administrasi:</span>
                    <span className="text-emerald-600 font-bold">GRATIS</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Pembayaran:</span>
                    <span className="text-blue-600">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {bookingLoading ? "Membuat Pesanan..." : "Lanjutkan & Bayar Sewa"}
                </button>

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Transaksi dijamin aman dengan Payment Gateway & Invoice PDF
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Clock className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Unit Ini Sedang Tersewa
                </h3>
                <p className="text-xs text-slate-500">
                  Unit ruko ini saat ini sedang memiliki penyewa aktif. Silakan pilih unit ruko lain yang masih tersedia di katalog.
                </p>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100"
                >
                  Lihat Ruko Lain
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
