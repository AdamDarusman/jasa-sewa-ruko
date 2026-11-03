"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  ArrowRight,
  LogOut,
  Menu,
  X,
  FileSpreadsheet,
  PlusCircle,
  Receipt,
  Home,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="w-full pt-4 sm:pt-6 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between py-3 px-6 bg-white/70 backdrop-blur-md rounded-full border border-[#E7E5DC] shadow-sm">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-[#1A1916]">
            Ruko<span className="text-[#1E4D34]">Hub</span>
          </span>
          <span className="text-[10px] font-semibold text-[#1E4D34] bg-[#E5EFE9] px-2 py-0.5 rounded-full border border-[#D0E3D7]">
            Komersial
          </span>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#5A564C]">
          <Link
            href="/"
            className={`transition-colors hover:text-[#1A1916] ${
              pathname === "/" ? "text-[#1E4D34] font-bold" : ""
            }`}
          >
            Katalog Unit
          </Link>

          {user && (
            <Link
              href="/my-bookings"
              className={`transition-colors hover:text-[#1A1916] ${
                pathname === "/my-bookings" ? "text-[#1E4D34] font-bold" : ""
              }`}
            >
              Sewa Saya
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/admin/laporan"
                className={`transition-colors hover:text-[#1A1916] ${
                  pathname === "/admin/laporan" ? "text-[#1E4D34] font-bold" : ""
                }`}
              >
                Laporan Keuangan
              </Link>
              <Link
                href="/admin/ruko"
                className={`transition-colors hover:text-[#1A1916] ${
                  pathname === "/admin/ruko" ? "text-[#1E4D34] font-bold" : ""
                }`}
              >
                Kelola Unit
              </Link>
            </>
          )}
        </nav>

        {/* Right Info: Phone & Menu / User Pill */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#4A463B] hover:text-[#1A1916] transition-colors pr-2"
          >
            <div className="w-6 h-6 rounded-full bg-[#EAE8DF] flex items-center justify-center text-[#1A1916]">
              <Phone className="w-3 h-3" />
            </div>
            <span>0812-3456-7890</span>
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#1A1916] leading-none">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-[10px] text-[#7A7566] leading-none mt-0.5">
                  {user.role === "ADMIN" ? "Admin" : "Penyewa"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-[#EAE8DF] hover:bg-rose-100 text-[#4A463B] hover:text-rose-600 flex items-center justify-center transition-colors"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full bg-[#1A1916] hover:bg-[#2C2924] text-white text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              <span>Masuk</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-[#EAE8DF] flex items-center justify-center text-[#1A1916]"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 p-5 bg-white rounded-3xl border border-[#E7E5DC] shadow-lg space-y-3">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold text-[#1A1916] p-2 hover:bg-[#F4F3EE] rounded-xl"
          >
            <Home className="w-4 h-4 text-[#1E4D34]" />
            Katalog Unit
          </Link>
          {user && (
            <Link
              href="/my-bookings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[#1A1916] p-2 hover:bg-[#F4F3EE] rounded-xl"
            >
              <Receipt className="w-4 h-4 text-[#1E4D34]" />
              Sewa Saya
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/admin/laporan"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#1A1916] p-2 hover:bg-[#F4F3EE] rounded-xl"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#1E4D34]" />
                Laporan Keuangan
              </Link>
              <Link
                href="/admin/ruko"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#1A1916] p-2 hover:bg-[#F4F3EE] rounded-xl"
              >
                <PlusCircle className="w-4 h-4 text-[#1E4D34]" />
                Kelola Unit
              </Link>
            </>
          )}
          <div className="pt-3 border-t border-[#EAE8DF]">
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" /> Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 rounded-xl bg-[#1A1916] text-white text-xs font-bold"
              >
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
