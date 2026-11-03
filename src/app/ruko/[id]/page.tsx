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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="h-96 bg-[#FAF9F5] rounded-[32px] animate-pulse border border-[#E7E5DC]" />
      </div>
    );
  }

  if (error || !ruko) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#1A1916]">
          {error || "Ruko Tidak Ditemukan"}
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E4D34] hover:underline"
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A7566] hover:text-[#1A1916] transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Katalog Unit
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photos & Property Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Photo with Rounded Frame */}
          <div className="relative rounded-[32px] overflow-hidden bg-[#EAE8DF] border border-[#E7E5DC] shadow-sm">
            <img
              src={ruko.imageUrl}
              alt={ruko.title}
              className="w-full h-[400px] sm:h-[480px] object-cover"
            />
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                  isAvailable ? "bg-[#1E4D34] text-white" : "bg-[#4A463B] text-white"
                }`}
              >
                {isAvailable ? "Unit Tersedia" : "Sudah Tersewa"}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-[#1A1916] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-black/5 shadow-sm">
              Foto Asli Unit Terverifikasi
            </div>
          </div>

          {/* Title & Description Card */}
          <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#E7E5DC] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1916] tracking-tight">
                {ruko.title}
              </h1>
              <div className="text-xs px-3 py-1 rounded-full bg-[#E5EFE9] text-[#1E4D34] font-semibold border border-[#D0E3D7] self-start sm:self-auto">
                {ruko.city}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#7A7566] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E4D34] shrink-0" />
              <span>{ruko.address}</span>
            </p>

            <div className="pt-4 border-t border-[#EAE8DF]">
              <div className="text-xs font-bold text-[#1A1916] uppercase tracking-wider mb-2">
                Deskripsi Unit Komersial
              </div>
              <p className="text-xs sm:text-sm text-[#4A463B] leading-relaxed whitespace-pre-line">
                {ruko.description}
              </p>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#E7E5DC] shadow-sm space-y-4">
            <div className="text-xs font-bold text-[#1A1916] uppercase tracking-wider">
              Spesifikasi Lengkap
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DC]">
                <div className="text-[10px] text-[#7A7566] flex items-center gap-1 mb-1">
                  <Maximize2 className="w-3 h-3 text-[#1E4D34]" />
                  Luas Bangunan
                </div>
                <div className="font-bold text-[#1A1916] text-sm sm:text-base">
                  {ruko.buildingArea} m²
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DC]">
                <div className="text-[10px] text-[#7A7566] flex items-center gap-1 mb-1">
                  <Maximize2 className="w-3 h-3 text-[#1E4D34]" />
                  Luas Tanah
                </div>
                <div className="font-bold text-[#1A1916] text-sm sm:text-base">
                  {ruko.landArea} m²
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DC]">
                <div className="text-[10px] text-[#7A7566] flex items-center gap-1 mb-1">
                  <Layers className="w-3 h-3 text-[#1E4D34]" />
                  Jumlah Lantai
                </div>
                <div className="font-bold text-[#1A1916] text-sm sm:text-base">
                  {ruko.floors} Tingkat
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DC]">
                <div className="text-[10px] text-[#7A7566] flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-[#1E4D34]" />
                  Daya Listrik
                </div>
                <div className="font-bold text-[#1A1916] text-xs sm:text-sm">
                  {ruko.electricity}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DC]">
                <div className="text-[10px] text-[#7A7566] flex items-center gap-1 mb-1">
                  <Droplet className="w-3 h-3 text-[#1E4D34]" />
                  Sumber Air
                </div>
                <div className="font-bold text-[#1A1916] text-xs sm:text-sm truncate">
                  {ruko.water}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DC]">
                <div className="text-[10px] text-[#7A7566] flex items-center gap-1 mb-1">
                  <FileCheck2 className="w-3 h-3 text-[#1E4D34]" />
                  Legalitas Surat
                </div>
                <div className="font-bold text-[#1A1916] text-xs sm:text-sm truncate">
                  {ruko.certType}
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#E7E5DC] shadow-sm space-y-4">
            <div className="text-xs font-bold text-[#1A1916] uppercase tracking-wider">
              Fasilitas Unit
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {facilitiesList.map((fac, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E7E5DC] text-[#4A463B] text-xs font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E4D34]" />
                  {fac}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Card (Matching Image 2 Style) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#E7E5DC] shadow-sm space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7566]">
                Tarif Sewa
              </div>
              <div className="text-2xl font-black text-[#1E4D34] mt-1">
                {formatRupiah(ruko.pricePerYear)}
                <span className="text-xs font-normal text-[#7A7566]"> /tahun</span>
              </div>
              <div className="text-xs text-[#7A7566]">
                atau {formatRupiah(ruko.pricePerMonth)} /bulan
              </div>
            </div>

            <hr className="border-[#EAE8DF]" />

            {bookingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {isAvailable ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1916] mb-1.5">
                    Durasi Sewa
                  </label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  >
                    <option value={6}>6 Bulan (Setengah Tahun)</option>
                    <option value={12}>12 Bulan (1 Tahun - Hemat)</option>
                    <option value={24}>24 Bulan (2 Tahun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1916] mb-1.5">
                    Tanggal Mulai Sewa
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#8C877A] absolute left-3.5 top-3" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1916] mb-1.5">
                    Catatan Penggunaan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Rencana sewa untuk outlet kopi / kantor cabang..."
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>

                {/* Calculation Summary */}
                <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E7E5DC] space-y-2 text-xs">
                  <div className="flex justify-between text-[#7A7566]">
                    <span>Durasi:</span>
                    <span className="font-semibold text-[#1A1916]">
                      {durationMonths} Bulan
                    </span>
                  </div>
                  <div className="flex justify-between text-[#7A7566]">
                    <span>Biaya Administrasi:</span>
                    <span className="text-[#1E4D34] font-bold">GRATIS</span>
                  </div>
                  <div className="pt-2 border-t border-[#EAE8DF] flex justify-between text-sm font-black text-[#1A1916]">
                    <span>Total Tagihan:</span>
                    <span className="text-[#1E4D34]">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 px-4 bg-[#1E4D34] hover:bg-[#153826] text-white font-bold rounded-full shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {bookingLoading ? "Memproses..." : "Lanjutkan & Bayar Sewa"}
                </button>

                <div className="text-[10px] text-[#7A7566] text-center flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck className="w-3 h-3 text-[#1E4D34]" />
                  Aman via Midtrans & Invoice PDF Otomatis
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Clock className="w-8 h-8 text-[#A8A394] mx-auto" />
                <div className="font-bold text-[#1A1916] text-xs sm:text-sm">
                  Unit Ini Sedang Tersewa
                </div>
                <p className="text-xs text-[#7A7566]">
                  Unit ini saat ini memiliki penyewa aktif.
                </p>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-[#FAF9F5] border border-[#E7E5DC] text-[#1A1916] rounded-full text-xs font-semibold hover:bg-white"
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
