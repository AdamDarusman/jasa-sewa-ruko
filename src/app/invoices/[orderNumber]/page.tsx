"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Printer,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowLeft,
  AlertCircle,
  Zap,
} from "lucide-react";
import { formatRupiah, formatDate, formatDateTime, getStatusBadge } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BookingInvoice {
  id: string;
  orderNumber: string;
  startDate: string;
  durationMonths: number;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentType: string | null;
  snapToken: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  ruko: {
    id: string;
    title: string;
    address: string;
    city: string;
    buildingArea: number;
    floors: number;
    pricePerYear: number;
    pricePerMonth: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap?: any;
  }
}

export default function InvoicePage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [booking, setBooking] = useState<BookingInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [simulating, setSimulating] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/booking/${orderNumber}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invoice tidak ditemukan");
      setBooking(data.booking);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memuat invoice");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) fetchInvoice();
  }, [orderNumber]);

  // Generate & Download PDF using jsPDF + autoTable
  const handleDownloadPdf = () => {
    if (!booking) return;

    const doc = new jsPDF();

    // 1. Header & Brand
    doc.setFillColor(37, 99, 235); // Blue primary
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("RukoHub - INVOICE RESMI", 14, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Platform Jasa Sewa Ruko Digital | info@rukohub.id", 14, 25);

    // 2. Invoice Details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Nomor Invoice: ${booking.orderNumber}`, 14, 42);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Tanggal Terbit: ${formatDate(booking.createdAt)}`, 14, 48);
    doc.text(
      `Status Pembayaran: ${booking.status === "PAID" ? "LUNAS (PAID)" : "MENUNGGU PEMBAYARAN (PENDING)"}`,
      14,
      54
    );
    if (booking.paidAt) {
      doc.text(`Waktu Pembayaran: ${formatDateTime(booking.paidAt)}`, 14, 60);
    }

    // 3. Billing Boxes (Penyewa & Unit Ruko)
    autoTable(doc, {
      startY: booking.paidAt ? 66 : 60,
      head: [["Informasi Penyewa", "Detail Properti Ruko"]],
      body: [
        [
          `Nama: ${booking.user.name}\nEmail: ${booking.user.email}\nNo. HP: ${booking.user.phone || "-"}\nCatatan: ${booking.notes || "-"}`,
          `Unit: ${booking.ruko.title}\nAlamat: ${booking.ruko.address}, ${booking.ruko.city}\nUkuran: LB ${booking.ruko.buildingArea} m² (${booking.ruko.floors} Lantai)\nPeriode: ${formatDate(booking.startDate)} s/d ${formatDate(booking.endDate)} (${booking.durationMonths} Bulan)`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 4 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastY = (doc as any).lastAutoTable.finalY + 8;

    // 4. Financial Breakdown Table
    autoTable(doc, {
      startY: lastY,
      head: [["Deskripsi Tagihan", "Durasi", "Tarif Satuan", "Subtotal (IDR)"]],
      body: [
        [
          `Sewa Unit Komersial - ${booking.ruko.title}`,
          `${booking.durationMonths} Bulan`,
          booking.durationMonths >= 12 && booking.durationMonths % 12 === 0
            ? `${formatRupiah(booking.ruko.pricePerYear)} /tahun`
            : `${formatRupiah(booking.ruko.pricePerMonth)} /bulan`,
          formatRupiah(booking.totalAmount),
        ],
        ["Biaya Administrasi & Pajak Transaksi Digital", "-", "Gratis (Promo)", "Rp 0"],
      ],
      foot: [["TOTAL AKHIR PEMBAYARAN", "", "", formatRupiah(booking.totalAmount)]],
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
      footStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 4 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const afterTableY = (doc as any).lastAutoTable.finalY + 14;

    // Stamp / Watermark
    if (booking.status === "PAID") {
      doc.setDrawColor(16, 185, 129); // green border
      doc.setLineWidth(1);
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(14, afterTableY, 182, 24, 3, 3, "FD");

      doc.setTextColor(5, 150, 105);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("BUKTI PEMBAYARAN SAH & LUNAS", 20, afterTableY + 10);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Metode: ${booking.paymentType || "Payment Gateway"} | Invoice ini merupakan bukti sewa yang sah untuk penyerahan kunci unit ruko.`,
        20,
        afterTableY + 17
      );
    } else {
      doc.setDrawColor(245, 158, 11);
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(14, afterTableY, 182, 20, 3, 3, "FD");

      doc.setTextColor(180, 83, 9);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("MENUNGGU PEMBAYARAN", 20, afterTableY + 8);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Silakan selesaikan pembayaran untuk mengunci ketersediaan unit ruko.", 20, afterTableY + 14);
    }

    // Save and download
    doc.save(`Invoice_${booking.orderNumber}.pdf`);
  };

  // Payment with Midtrans Snap
  const handleMidtransPayment = () => {
    if (!booking) return;

    if (booking.snapToken && window.snap) {
      window.snap.pay(booking.snapToken, {
        onSuccess: function (result: unknown) {
          console.log("Payment success:", result);
          fetchInvoice();
        },
        onPending: function (result: unknown) {
          console.log("Payment pending:", result);
          fetchInvoice();
        },
        onError: function (result: unknown) {
          console.error("Payment error:", result);
          alert("Pembayaran gagal atau dibatalkan");
        },
        onClose: function () {
          fetchInvoice();
        },
      });
    } else {
      alert(
        "Token Midtrans belum terkonfigurasi pada sandbox demo ini. Anda dapat menggunakan tombol 'Simulasi Bayar Lunas (Demo)' di bawah untuk langsung menguji sistem!"
      );
    }
  };

  // Instant simulator for testing
  const handleSimulatePayment = async () => {
    if (!booking) return;
    setSimulating(true);
    try {
      const res = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: booking.orderNumber,
          paymentMethod: "Simulator Midtrans (QRIS / Bank Transfer)",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal simulasi pembayaran");

      await fetchInvoice();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal memproses simulasi");
      }
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-96 bg-white rounded-2xl animate-pulse border border-slate-200" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">
          {error || "Invoice Tidak Ditemukan"}
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

  const badge = getStatusBadge(booking.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action Bar (Buttons to Download PDF & Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Beranda
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" /> Cetak (Print)
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Download className="w-4 h-4" /> Unduh Invoice PDF
          </button>
        </div>
      </div>

      {/* Payment Action Alert (If Pending) */}
      {booking.status === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3 no-print">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Menunggu Pembayaran Sewa
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Silakan selesaikan pembayaran sebesar{" "}
                <strong className="text-slate-900">
                  {formatRupiah(booking.totalAmount)}
                </strong>{" "}
                agar unit ruko ini terkunci untuk usaha Anda.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleMidtransPayment}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
            >
              <CreditCard className="w-4 h-4" /> Bayar via Midtrans Snap
            </button>

            <button
              onClick={handleSimulatePayment}
              disabled={simulating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {simulating ? "Memproses..." : "Simulasi Bayar Lunas (Demo Cepat)"}
            </button>
          </div>
        </div>
      )}

      {/* Invoice Sheet (Printable Card) */}
      <div
        id="invoice-print-area"
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8"
      >
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b border-slate-100 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900">RukoHub</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Platform Jasa Sewa Ruko Digital Terpercaya
            </p>
            <p className="text-xs text-slate-400">
              Jl. Surya Kencana No. 1, Pamulang, Tangerang Selatan
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              INVOICE RESMI
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {booking.orderNumber}
            </div>
            <div className="text-xs text-slate-500">
              Tanggal: {formatDate(booking.createdAt)}
            </div>

            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg} ${badge.text} ${badge.border}`}
              >
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Parties Info (Penyewa & Ruko) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Data Penyewa (Tenant)
            </div>
            <div className="text-sm font-bold text-slate-800">
              {booking.user.name}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">{booking.user.email}</div>
            <div className="text-xs text-slate-600">{booking.user.phone || "-"}</div>
            {booking.notes && (
              <div className="text-xs text-slate-500 mt-2 italic">
                Catatan: &quot;{booking.notes}&quot;
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Unit Ruko Yang Disewa
            </div>
            <div className="text-sm font-bold text-slate-800">
              {booking.ruko.title}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {booking.ruko.address}, {booking.ruko.city}
            </div>
            <div className="text-xs text-slate-600">
              Luas Bangunan: {booking.ruko.buildingArea} m² ({booking.ruko.floors} Lantai)
            </div>
            <div className="text-xs text-blue-600 font-semibold mt-1">
              Periode: {formatDate(booking.startDate)} - {formatDate(booking.endDate)} ({booking.durationMonths} Bulan)
            </div>
          </div>
        </div>

        {/* Table of Charges */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3">Rincian Layanan Sewa</th>
                <th className="py-3 text-center">Durasi</th>
                <th className="py-3 text-right">Tarif Dasar</th>
                <th className="py-3 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-4">
                  <div className="font-bold text-slate-900">
                    Sewa Komersial - {booking.ruko.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Akses penuh tempat usaha & fasilitas unit
                  </div>
                </td>
                <td className="py-4 text-center font-medium">
                  {booking.durationMonths} Bulan
                </td>
                <td className="py-4 text-right">
                  {booking.durationMonths >= 12 && booking.durationMonths % 12 === 0
                    ? `${formatRupiah(booking.ruko.pricePerYear)}/thn`
                    : `${formatRupiah(booking.ruko.pricePerMonth)}/bln`}
                </td>
                <td className="py-4 text-right font-bold text-slate-900">
                  {formatRupiah(booking.totalAmount)}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-slate-600">Biaya Administrasi & Kontrak Digital</td>
                <td className="py-3 text-center">-</td>
                <td className="py-3 text-right">Rp 0</td>
                <td className="py-3 text-right font-semibold text-emerald-600">
                  Gratis
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200">
                <td colSpan={3} className="pt-4 text-right font-bold text-slate-700">
                  Total Tagihan:
                </td>
                <td className="pt-4 text-right text-lg font-black text-blue-600">
                  {formatRupiah(booking.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Payment Status Seal */}
        <div className="pt-6 border-t border-slate-100">
          {booking.status === "PAID" ? (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-emerald-900 text-sm">
                    PEMBAYARAN TELAH LUNAS
                  </div>
                  <div className="text-xs text-emerald-700">
                    Metode: {booking.paymentType || "Payment Gateway"} | Dibayar pada: {formatDateTime(booking.paidAt)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-emerald-800 font-semibold px-3 py-1.5 rounded-lg bg-emerald-100/80">
                Unit Sah Tersewa
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <Clock className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-800">
                Struk ini masih dalam status <strong>MENUNGGU PEMBAYARAN</strong>. Segera selesaikan pembayaran untuk mendapatkan surat bukti sewa resmi.
              </div>
            </div>
          )}
        </div>

        {/* Terms note */}
        <div className="text-[11px] text-slate-400 leading-relaxed pt-2">
          * Dokumen ini dibuat secara otomatis oleh sistem digital RukoHub dan diakui sebagai bukti transaksi sewa menyewa yang sah.
        </div>
      </div>
    </div>
  );
}
