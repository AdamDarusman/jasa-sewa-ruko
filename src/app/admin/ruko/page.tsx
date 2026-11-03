"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface RukoManageItem {
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

export default function AdminRukoPage() {
  const [rukos, setRukos] = useState<RukoManageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  // Form state
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
  const [facilities, setFacilities] = useState("Parkir Luas, Keamanan 24 Jam, Akses Jalan Utama");
  const [imageUrl, setImageUrl] = useState("/images/ruko/ruko-1-pamulang.jpg");

  const fetchRukos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ruko");
      const data = await res.json();
      setRukos(data.rukos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRukos();
  }, []);

  const handleCreateRuko = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      const facArr = facilities.split(",").map((f) => f.trim()).filter(Boolean);

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

      setMsg("Ruko berhasil ditambahkan ke katalog!");
      setShowModal(false);
      // Reset form
      setTitle("");
      setDescription("");
      setAddress("");
      setPricePerYear("");
      setPricePerMonth("");
      fetchRukos();
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
        fetchRukos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus unit ruko ini?")) return;
    try {
      const res = await fetch(`/api/ruko/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRukos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Panel Administrator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kelola Unit Ruko
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah properti ruko baru, sesuaikan tarif, atau ubah status ketersediaan.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Ruko Baru
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Ruko Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Properti Ruko</th>
                <th className="py-3 px-4">Kota</th>
                <th className="py-3 px-4">Ukuran & Lantai</th>
                <th className="py-3 px-4 text-right">Tarif per Tahun</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat daftar ruko...
                  </td>
                </tr>
              ) : (
                rukos.map((r) => {
                  const isAvail = r.status === "AVAILABLE";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{r.title}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">
                              {r.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {r.city}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        LB {r.buildingArea} m² / {r.floors} Lt
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-blue-600">
                        {formatRupiah(r.pricePerYear)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(r.id, r.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                            isAvail
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                          }`}
                          title="Klik untuk ubah status ketersediaan"
                        >
                          {isAvail ? "Tersedia (Klik Ubah)" : "Tersewa (Klik Ubah)"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/ruko/${r.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
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

      {/* Modal Tambah Ruko */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                Tambah Properti Ruko Baru
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateRuko} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama / Judul Ruko
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Ruko Pamulang Point Blok C2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsikan keunggulan lokasi, akses jalan, potensi bisnis..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Surya Kencana..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Tangerang Selatan"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif per Tahun (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    value={pricePerYear}
                    onChange={(e) => setPricePerYear(e.target.value)}
                    placeholder="65000000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tarif per Bulan (IDR)
                  </label>
                  <input
                    type="number"
                    value={pricePerMonth}
                    onChange={(e) => setPricePerMonth(e.target.value)}
                    placeholder="6000000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Luas Bangunan (m²)
                  </label>
                  <input
                    type="number"
                    value={buildingArea}
                    onChange={(e) => setBuildingArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Luas Tanah (m²)
                  </label>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lantai</label>
                  <input
                    type="number"
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listrik</label>
                  <input
                    type="text"
                    value={electricity}
                    onChange={(e) => setElectricity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Air</label>
                  <input
                    type="text"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sertifikat</label>
                  <input
                    type="text"
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fasilitas (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  placeholder="Parkir Luas, CCTV, Keamanan 24 Jam..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL Foto Ruko
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Unit Ruko"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
