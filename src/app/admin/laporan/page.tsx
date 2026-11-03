"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  Receipt,
  Building,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { formatRupiah, formatDate, formatDateTime, getStatusBadge } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TransactionItem {
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
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

interface ReportSummary {
  totalRevenue: number;
  totalTransactions: number;
  paidCount: number;
  pendingCount: number;
  cancelledCount: number;
  avgRevenue: number;
}

export default function LaporanKeuanganPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [summary, setSummary] = useState<ReportSummary>({
    totalRevenue: 0,
    totalTransactions: 0,
    paidCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    avgRevenue: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTable, setSearchTable] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);
      if (statusFilter !== "ALL") query.append("status", statusFilter);

      const res = await fetch(`/api/admin/laporan?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memuat laporan");
      }

      setTransactions(data.transactions || []);
      setSummary(data.summary);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat memuat laporan keuangan");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [statusFilter]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("ALL");
    setSearchTable("");
    setTimeout(() => {
      fetchReport();
    }, 50);
  };

  // Quick Preset Date Helpers
  const setThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
  };

  const setThisYear = () => {
    const now = new Date();
    const firstDay = `${now.getFullYear()}-01-01`;
    const lastDay = `${now.getFullYear()}-12-31`;
    setStartDate(firstDay);
    setEndDate(lastDay);
  };

  // EXPORT TO EXCEL (.xlsx)
  const handleExportExcel = () => {
    if (transactions.length === 0) {
      alert("Tidak ada data transaksi untuk diekspor");
      return;
    }

    const dataRows = transactions.map((t, idx) => ({
      No: idx + 1,
      "No. Invoice": t.orderNumber,
      "Tanggal Pesanan": formatDate(t.createdAt),
      "Nama Penyewa": t.user.name,
      "Email Penyewa": t.user.email,
      "No. Telepon": t.user.phone || "-",
      "Unit Ruko": t.ruko.title,
      Lokasi: `${t.ruko.address}, ${t.ruko.city}`,
      "Durasi Sewa": `${t.durationMonths} Bulan`,
      "Tanggal Mulai": formatDate(t.startDate),
      "Tanggal Selesai": formatDate(t.endDate),
      "Total Biaya (IDR)": t.totalAmount,
      Status: t.status === "PAID" ? "Lunas" : t.status === "PENDING" ? "Menunggu" : "Batal",
      "Metode Pembayaran": t.paymentType || "-",
      "Waktu Pembayaran": t.paidAt ? formatDateTime(t.paidAt) : "-",
    }));

    // Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataRows);

    // Auto fit column widths
    const colWidths = [
      { wch: 5 }, // No
      { wch: 20 }, // Invoice
      { wch: 16 }, // Tanggal
      { wch: 22 }, // Nama
      { wch: 24 }, // Email
      { wch: 15 }, // HP
      { wch: 35 }, // Ruko
      { wch: 35 }, // Lokasi
      { wch: 14 }, // Durasi
      { wch: 16 }, // Mulai
      { wch: 16 }, // Selesai
      { wch: 18 }, // Total
      { wch: 12 }, // Status
      { wch: 25 }, // Metode
      { wch: 20 }, // Waktu Bayar
    ];
    worksheet["!cols"] = colWidths;

    // Create Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");

    const dateTag = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Laporan_Keuangan_Ruko_${dateTag}.xlsx`);
  };

  // EXPORT TO PDF
  const handleExportPdf = () => {
    if (transactions.length === 0) {
      alert("Tidak ada data transaksi untuk dicetak ke PDF");
      return;
    }

    const doc = new jsPDF("landscape");

    // Header Title
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 297, 24, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RukoHub - LAPORAN KEUANGAN & TRANSAKSI SEWA RUKO", 14, 15);

    // Periode Subhead
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const periodText =
      startDate || endDate
        ? `Periode: ${startDate || "Awal"} s/d ${endDate || "Hari Ini"}`
        : "Periode: Semua Waktu";
    doc.text(periodText, 14, 32);
    doc.text(`Waktu Cetak: ${formatDateTime(new Date())}`, 14, 38);

    // Summary Box
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Pendapatan Lunas: ${formatRupiah(summary.totalRevenue)}  |  Transaksi Lunas: ${summary.paidCount}  |  Menunggu: ${summary.pendingCount}`,
      14,
      45
    );

    // Table of Transactions
    const tableData = transactions.map((t, idx) => [
      (idx + 1).toString(),
      t.orderNumber,
      formatDate(t.createdAt),
      t.user.name,
      t.ruko.title.length > 25 ? t.ruko.title.slice(0, 25) + "..." : t.ruko.title,
      `${t.durationMonths} Bln`,
      t.status === "PAID" ? "LUNAS" : t.status === "PENDING" ? "MENUNGGU" : "BATAL",
      t.paymentType || "-",
      formatRupiah(t.totalAmount),
    ]);

    autoTable(doc, {
      startY: 50,
      head: [
        [
          "No",
          "No. Invoice",
          "Tanggal",
          "Penyewa",
          "Unit Ruko",
          "Durasi",
          "Status",
          "Metode",
          "Total Tagihan",
        ],
      ],
      body: tableData,
      foot: [
        [
          "TOTAL PENDAPATAN DITERIMA (LUNAS)",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          formatRupiah(summary.totalRevenue),
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
      footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
    });

    const dateTag = new Date().toISOString().slice(0, 10);
    doc.save(`Laporan_Keuangan_Ruko_${dateTag}.pdf`);
  };

  // Filter transactions for in-table searching
  const filteredTransactions = transactions.filter((t) => {
    if (!searchTable) return true;
    const q = searchTable.toLowerCase();
    return (
      t.orderNumber.toLowerCase().includes(q) ||
      t.user.name.toLowerCase().includes(q) ||
      t.ruko.title.toLowerCase().includes(q) ||
      (t.paymentType && t.paymentType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            Panel Manajemen Keuangan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Laporan Keuangan Persewaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau arus kas, verifikasi transaksi sewa, dan ekspor laporan ke format Excel & PDF.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel (.xlsx)
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition"
          >
            <FileText className="w-4 h-4" /> Ekspor PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Total Pendapatan (Lunas)
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatRupiah(summary.totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              {summary.paidCount} transaksi berhasil
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Total Seluruh Pesanan
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {summary.totalTransactions}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Semua status sewa
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Menunggu Pembayaran
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
              {summary.pendingCount}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Pesanan belum lunas
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Rata-rata Nilai Sewa
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatRupiah(summary.avgRevenue)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Per unit tersewa
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Date Filter & Control Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Filter className="w-4 h-4 text-blue-600" />
            Filter Berdasarkan Rentang Tanggal & Status
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setThisMonth();
                setTimeout(fetchReport, 50);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              Bulan Ini
            </button>
            <button
              onClick={() => {
                setThisYear();
                setTimeout(fetchReport, 50);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              Tahun Ini
            </button>
            <button
              onClick={handleResetFilter}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>

        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          {/* Start Date */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tanggal Mulai
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tanggal Selesai
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status Pembayaran
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="ALL">Semua</option>
              <option value="PAID">Lunas (Paid)</option>
              <option value="PENDING">Menunggu (Pending)</option>
              <option value="CANCELLED">Batal / Kadaluarsa</option>
            </select>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              Terapkan Filter
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-800">
            Rincian Transaksi ({filteredTransactions.length} Ditemukan)
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder="Cari invoice, penyewa, ruko..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Penyewa</th>
                <th className="py-3 px-4">Unit Ruko</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat data keuangan...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada transaksi pada periode yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const badge = getStatusBadge(tx.status);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {tx.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {tx.user.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{tx.user.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                          {tx.ruko.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{tx.ruko.city}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {tx.durationMonths} Bulan
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {formatRupiah(tx.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {tx.paymentType || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/invoices/${tx.orderNumber}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Invoice <ExternalLink className="w-3 h-3" />
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
    </div>
  );
}
