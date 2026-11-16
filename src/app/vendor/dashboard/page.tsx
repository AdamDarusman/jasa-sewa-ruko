"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Wallet,
  KeyRound,
  Receipt,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import { formatRupiah, formatDate, getStatusBadge } from "@/lib/utils";

interface VendorRukoItem {
  id: string;
  title: string;
  slug: string;
  address: string;
  city: string;
  pricePerYear: number;
  pricePerMonth: number;
  buildingArea: number;
  landArea: number;
  floors: number;
  status: string;
  imageUrl: string;
}

interface VendorBookingItem {
  id: string;
  orderNumber: string;
  startDate: string;
  durationMonths: number;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentType: string | null;
  createdAt: string;
  ruko: {
    id: string;
    title: string;
    address: string;
    city: string;
    imageUrl: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

interface VendorSummary {
  totalRukos: number;
  availableCount: number;
  rentedCount: number;
  totalRevenue: number;
  totalBookings: number;
  paidBookings: number;
  pendingBookings: number;
}

export default function VendorDashboardPage() {
  const [vendorName, setVendorName] = useState("");
  const [summary, setSummary] = useState<VendorSummary>({
    totalRukos: 0,
    availableCount: 0,
    rentedCount: 0,
    totalRevenue: 0,
    totalBookings: 0,
    paidBookings: 0,
    pendingBookings: 0,
  });
  const [rukos, setRukos] = useState<VendorRukoItem[]>([]);
  const [bookings, setBookings] = useState<VendorBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  // Form state for adding new ruko
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Tangerang Selatan");
  const [pricePerYear, setPricePerYear] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [buildingArea, setBuildingArea] = useState("120");
  const [landArea, setLandArea] = useState("80");
  const [floors, setFloors] = useState("2");
  const [electricity, setElectricity] = useState("3500 VA");
  const [water, setWater] = useState("PDAM");
  const [certType, setCertType] = useState("SHM");
  const [facilities, setFacilities] = useState(
    "Parkir Luas, Keamanan 24 Jam, Akses Jalan Utama"
  );
  const [imageUrl, setImageUrl] = useState("/images/ruko/ruko-1-pamulang.jpg");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vendor/dashboard");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat dashboard penyedia ruko");
      }
      setVendorName(data.vendor?.name || "Penyedia Ruko");
      setSummary(data.summary);
      setRukos(data.rukos || []);
      setBookings(data.bookings || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateRuko = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      const facArr = facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/ruko", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          facilities: facArr,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah ruko");

      setMsg("Unit ruko Anda berhasil dipublikasikan ke katalog!");
      setShowModal(false);
      setTitle("");
      setDescription("");
      setAddress("");
      setPricePerYear("");
      setPricePerMonth("");
      fetchDashboard();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "AVAILABLE" ? "RENTED" : "AVAILABLE";
    try {
      const res = await fetch(`/api/ruko/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus unit ruko Anda ini?")) return;
    try {
      const res = await fetch(`/api/ruko/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="bg-white rounded-3xl p-8 border border-[#E7E5DC] shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#1A1916]">{error}</h2>
          <p className="text-xs text-[#7A7566]">
            Silakan masuk menggunakan akun Penyedia Ruko untuk mengakses halaman ini.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-full bg-[#1E4D34] text-white text-xs font-bold"
          >
            Masuk ke Akun Penyedia
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#FAF9F5] rounded-[32px] p-6 sm:p-8 border border-[#E7E5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1E4D34] bg-[#E5EFE9] px-3 py-1 rounded-full mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Portal Mitra Penyedia Ruko
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#1A1916]">
            Halo,{" "}
            <span className="font-serif italic text-[#1E4D34]">
              {vendorName}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A5E] mt-1">
            Kelola daftar properti ruko milik Anda, pantau status sewa, dan lihat pemasukan transaksi penyewa.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1E4D34] hover:bg-[#163B27] text-white text-xs sm:text-sm font-bold shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Pasang Iklan Ruko Baru
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-[#E5EFE9] border border-[#C5DDD0] text-[#1E4D34] rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-5 border border-[#E7E5DC] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A7566]">
            <span className="text-xs font-semibold">Total Pendapatan Sewa</span>
            <div className="w-8 h-8 rounded-full bg-[#E5EFE9] text-[#1E4D34] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1E4D34]">
            {formatRupiah(summary.totalRevenue)}
          </div>
          <div className="text-[11px] text-[#7A7566]">
            Dari {summary.paidBookings} transaksi lunas
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-[#E7E5DC] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A7566]">
            <span className="text-xs font-semibold">Total Unit Ruko Saya</span>
            <div className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#1A1916] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1A1916]">
            {summary.totalRukos} Unit
          </div>
          <div className="text-[11px] text-[#7A7566]">
            Terdaftar di katalog RukoHub
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-[#E7E5DC] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A7566]">
            <span className="text-xs font-semibold">Status Ketersediaan</span>
            <div className="w-8 h-8 rounded-full bg-[#E5EFE9] text-[#1E4D34] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1A1916]">
            {summary.availableCount} Tersedia
          </div>
          <div className="text-[11px] text-[#7A7566]">
            {summary.rentedCount} unit sedang tersewa
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-[#E7E5DC] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#7A7566]">
            <span className="text-xs font-semibold">Pesanan Sewa Masuk</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#1A1916]">
            {summary.totalBookings} Pesanan
          </div>
          <div className="text-[11px] text-[#7A7566]">
            {summary.pendingBookings} menunggu pembayaran
          </div>
        </div>
      </div>

      {/* Section 1: My Ruko Units Table */}
      <div className="bg-white rounded-[28px] border border-[#E7E5DC] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EAE8DF] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1A1916]">
              Daftar Properti Ruko Saya
            </h2>
            <p className="text-xs text-[#7A7566]">
              Klik tombol status untuk mengubah ketersediaan unit ruko secara langsung
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#EAE8DF] text-[#7A7566] font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Properti Ruko</th>
                <th className="py-3.5 px-4">Lokasi Kota</th>
                <th className="py-3.5 px-4">Spesifikasi</th>
                <th className="py-3.5 px-4 text-right">Harga Sewa / Thn</th>
                <th className="py-3.5 px-4 text-center">Status Unit</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE6] text-[#1A1916]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7A7566]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1E4D34]" />
                    Memuat properti ruko Anda...
                  </td>
                </tr>
              ) : rukos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#7A7566]">
                    Anda belum memiliki unit ruko yang dipublikasikan. Klik tombol &ldquo;Pasang Iklan Ruko Baru&rdquo; di atas.
                  </td>
                </tr>
              ) : (
                rukos.map((r) => {
                  const isAvail = r.status === "AVAILABLE";
                  return (
                    <tr key={r.id} className="hover:bg-[#FAF9F5] transition">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.imageUrl}
                            alt={r.title}
                            className="w-14 h-14 rounded-xl object-cover bg-[#EAE8DF] shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[#1A1916]">
                              {r.title}
                            </div>
                            <div className="text-[11px] text-[#7A7566] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-xs">{r.address}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-[#5A564C]">
                        {r.city}
                      </td>
                      <td className="py-4 px-4 text-[#5A564C]">
                        LB {r.buildingArea} m² / LT {r.landArea} m² ({r.floors} Lt)
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#1E4D34]">
                        {formatRupiah(r.pricePerYear)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(r.id, r.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                            isAvail
                              ? "bg-[#E5EFE9] text-[#1E4D34] border-[#C5DDD0] hover:bg-[#D5E6DC]"
                              : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                          }`}
                        >
                          {isAvail
                            ? "Tersedia (Ubah)"
                            : "Tersewa (Ubah)"}
                        </button>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Hapus Ruko"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Incoming Tenant Bookings */}
      <div className="bg-white rounded-[28px] border border-[#E7E5DC] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EAE8DF]">
          <h2 className="text-lg font-bold text-[#1A1916]">
            Daftar Penyewa & Transaksi Masuk
          </h2>
          <p className="text-xs text-[#7A7566]">
            Riwayat penyewaan pada unit-unit ruko milik Anda
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF9F5] border-b border-[#EAE8DF] text-[#7A7566] font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">No. Invoice</th>
                <th className="py-3.5 px-4">Penyewa (Pembeli)</th>
                <th className="py-3.5 px-4">Unit Ruko</th>
                <th className="py-3.5 px-4">Periode Sewa</th>
                <th className="py-3.5 px-4 text-right">Total Nilai</th>
                <th className="py-3.5 px-4 text-center">Status Bayar</th>
                <th className="py-3.5 px-5 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEE6] text-[#1A1916]">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7A7566]">
                    Belum ada transaksi penyewaan untuk unit ruko Anda.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b.id} className="hover:bg-[#FAF9F5] transition">
                      <td className="py-4 px-5 font-bold text-[#1A1916]">
                        {b.orderNumber}
                        <div className="text-[10px] font-normal text-[#7A7566]">
                          {formatDate(b.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#1A1916] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#1E4D34]" />
                          {b.user.name}
                        </div>
                        <div className="text-[11px] text-[#7A7566]">
                          {b.user.email} {b.user.phone ? `• ${b.user.phone}` : ""}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-[#1A1916]">
                        {b.ruko.title}
                      </td>
                      <td className="py-4 px-4 text-[#5A564C]">
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#1E4D34]" />
                          <span>{b.durationMonths} Bulan</span>
                        </div>
                        <div className="text-[10px] text-[#7A7566]">
                          Mulai: {formatDate(b.startDate)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#1E4D34]">
                        {formatRupiah(b.totalAmount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <Link
                          href={`/invoices/${b.orderNumber}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#EFECE5] text-[#1A1916] border border-[#E7E5DC] text-xs font-semibold transition"
                        >
                          <span>Detail</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Ruko */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7E5DC] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE8DF] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1916]">
                  Pasang Iklan Unit Ruko Baru
                </h2>
                <p className="text-xs text-[#7A7566]">
                  Unit ruko yang Anda tambahkan akan langsung tampil di katalog publik
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded-full bg-[#FAF9F5] text-[#7A7566] hover:text-[#1A1916] text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <form
              onSubmit={handleCreateRuko}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div>
                <label className="block font-bold text-[#1A1916] mb-1">
                  Nama / Judul Ruko
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Ruko Golden Boulevard Blok A5"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1916] mb-1">
                  Deskripsi Keunggulan Ruko
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan lokasi strategis, fasilitas parkir, cocok untuk usaha apa..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Pahlawan Seribu No. 12..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Tangerang Selatan"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Harga Sewa per Tahun (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    value={pricePerYear}
                    onChange={(e) => setPricePerYear(e.target.value)}
                    placeholder="75000000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Harga Sewa per Bulan (IDR)
                  </label>
                  <input
                    type="number"
                    value={pricePerMonth}
                    onChange={(e) => setPricePerMonth(e.target.value)}
                    placeholder="6500000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Luas Bangunan (m²)
                  </label>
                  <input
                    type="number"
                    value={buildingArea}
                    onChange={(e) => setBuildingArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Luas Tanah (m²)
                  </label>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Jumlah Lantai
                  </label>
                  <input
                    type="number"
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Daya Listrik
                  </label>
                  <input
                    type="text"
                    value={electricity}
                    onChange={(e) => setElectricity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Sumber Air
                  </label>
                  <input
                    type="text"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1916] mb-1">
                    Sertifikat
                  </label>
                  <input
                    type="text"
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A1916] mb-1">
                  Fasilitas Ruko (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1916] mb-1">
                  Pilih Foto Ruko / URL Gambar
                </label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none mb-2"
                >
                  <option value="/images/ruko/ruko-1-pamulang.jpg">
                    Foto Ruko 1 - Etalase Kaca Modern 2 Lantai
                  </option>
                  <option value="/images/ruko/ruko-2-bintaro.jpg">
                    Foto Ruko 2 - Deretan Ruko Arcade Komersial
                  </option>
                  <option value="/images/ruko/ruko-3-bsd.jpg">
                    Foto Ruko 3 - Blok Ruko Boulevard Bertingkat
                  </option>
                  <option value="/images/ruko/ruko-4-ciputat.jpg">
                    Foto Ruko 4 - Ruko Sudut / Hook Retail
                  </option>
                  <option value="/images/ruko/ruko-5-alamsutera.jpg">
                    Foto Ruko 5 - Fasad Ruko Butik Elegan
                  </option>
                  <option value="/images/ruko/ruko-6-serpong.jpg">
                    Foto Ruko 6 - Ruko Komersial Semi-Outdoor
                  </option>
                </select>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/ruko/ruko-1-pamulang.jpg atau https://..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E7E5DC] rounded-xl focus:ring-2 focus:ring-[#1E4D34] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-[#E7E5DC] rounded-full text-[#5A564C] font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#1E4D34] hover:bg-[#163B27] text-white font-bold rounded-full shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Publikasikan Ruko"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
