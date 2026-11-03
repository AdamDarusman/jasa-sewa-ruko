import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-10">
      <div className="bg-[#FAF9F5] rounded-[36px] p-8 sm:p-12 border border-[#E7E5DC] text-[#4A463B] space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="inline-block text-xl font-bold tracking-tight text-[#1A1916]">
              Ruko<span className="text-[#1E4D34]">Hub</span>
            </Link>
            <p className="text-xs text-[#7A7566] leading-relaxed">
              Platform persewaan ruko dan ruang komersial terpercaya di Tangerang Selatan & Jabodetabek.
            </p>
            <div className="text-[11px] text-[#A8A394] pt-1">
              Digital Entrepreneurship • UNPAM S5
            </div>
          </div>

          {/* Navigasi Layanan */}
          <div>
            <div className="text-xs font-bold text-[#1A1916] uppercase tracking-wider mb-3">
              Layanan & Fitur
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#1E4D34] transition-colors">
                  Katalog Unit Siap Huni
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-[#1E4D34] transition-colors">
                  Riwayat & Status Sewa
                </Link>
              </li>
              <li>
                <span className="text-[#7A7566]">
                  Midtrans Payment Gateway
                </span>
              </li>
              <li>
                <span className="text-[#7A7566]">
                  Cetak Invoice & Struk PDF
                </span>
              </li>
            </ul>
          </div>

          {/* Area Populer */}
          <div>
            <div className="text-xs font-bold text-[#1A1916] uppercase tracking-wider mb-3">
              Area Populer
            </div>
            <ul className="space-y-2 text-xs text-[#7A7566]">
              <li>Pamulang (Dekat Kampus UNPAM)</li>
              <li>Bintaro Jaya Sektor 7</li>
              <li>BSD City Commercial District</li>
              <li>Ciputat Raya & Lebak Bulus</li>
              <li>Alam Sutera Business Center</li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <div className="text-xs font-bold text-[#1A1916] uppercase tracking-wider mb-3">
              Kontak Kami
            </div>
            <ul className="space-y-2.5 text-xs text-[#7A7566]">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1E4D34] mt-0.5 shrink-0" />
                <span>Jl. Surya Kencana No. 1, Pamulang, Tangerang Selatan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1E4D34] shrink-0" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1E4D34] shrink-0" />
                <span>halo@rukohub.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EAE8DF] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C877A] gap-3">
          <p>© {new Date().getFullYear()} RukoHub. All rights reserved.</p>
          <p>Inovasi Bisnis Persewaan Properti Digital</p>
        </div>
      </div>
    </footer>
  );
}
