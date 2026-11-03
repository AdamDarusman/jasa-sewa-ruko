"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { formatRupiah, formatDate, getStatusBadge } from "@/lib/utils";

interface MyBookingItem {
  id: string;
  orderNumber: string;
  startDate: string;
  durationMonths: number;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentType: string | null;
  paidAt: string | null;
  createdAt: string;
  ruko: {
    id: string;
    title: string;
    address: string;
    city: string;
    imageUrl: string;
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<MyBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/booking/my");
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setError("Silakan masuk terlebih dahulu untuk melihat riwayat sewa Anda.");
            return;
          }
          throw new Error(data.error || "Gagal memuat riwayat sewa");
        }
        setBookings(data.bookings || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat riwayat sewa");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Dashboard Penyewa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Riwayat Sewa Ruko Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lihat daftar transaksi sewa, status pembayaran, dan akses cetak invoice PDF kapan saja.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition"
        >
          Sewa Unit Baru
        </Link>
      </div>

      {error ? (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">{error}</h3>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Masuk ke Akun
          </Link>
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            Belum Ada Transaksi Sewa
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Anda belum pernah memesan atau menyewa ruko. Silakan cari ruko idaman Anda di katalog.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Lihat Katalog Ruko
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const badge = getStatusBadge(b.status);
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Left Info with Ruko Thumbnail */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={b.ruko.imageUrl}
                      alt={b.ruko.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {b.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                      {b.ruko.title}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Periode: {formatDate(b.startDate)} s/d {formatDate(b.endDate)} ({b.durationMonths} Bulan)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Info: Total Price & Invoice Link */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 gap-2">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400 font-medium uppercase">
                      Total Biaya
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900">
                      {formatRupiah(b.totalAmount)}
                    </div>
                  </div>

                  <Link
                    href={`/invoices/${b.orderNumber}`}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition"
                  >
                    Buka Invoice PDF
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
