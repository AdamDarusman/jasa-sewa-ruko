import React from "react";
import Link from "next/link";
import { Building2, Phone, Mail, MapPin, ShieldCheck, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">RukoHub</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform persewaan ruko dan tempat usaha komersial terpercaya di Tangerang Selatan & Jabodetabek.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
              Proyek Kuliah: Digital Entrepreneurship - UNPAM S5
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Layanan & Fitur
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Katalog Ruko Tersedia
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-blue-400 transition">
                  Cek Status Sewa & Tagihan
                </Link>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Payment Gateway Midtrans
                </span>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Cetak Invoice & Struk PDF
                </span>
              </li>
            </ul>
          </div>

          {/* Area Populer */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Lokasi Strategis
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Pamulang (Dekat Kampus UNPAM)</li>
              <li>Bintaro Jaya Sektor 7 & 9</li>
              <li>BSD City Commercial Area</li>
              <li>Ciputat Raya & Lebak Bulus</li>
              <li>Alam Sutera Business Hub</li>
            </ul>
          </div>

          {/* Kontak & Bantuan */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <span>Jl. Surya Kencana No. 1, Pamulang Barat, Tangerang Selatan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>(021) 7412-5678 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@rukohub.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RukoHub - Digital Entrepreneurship. All rights reserved.</p>
          <p>Dibuat untuk Inovasi Usaha Persewaan Properti Digital</p>
        </div>
      </div>
    </footer>
  );
}
