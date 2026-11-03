"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileSpreadsheet,
  Receipt,
  LogOut,
  LogIn,
  Menu,
  X,
  PlusCircle,
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
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                RukoHub
              </span>
              <span className="hidden sm:inline-block ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                Sewa Ruko
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/"
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Home className="w-4 h-4" />
              Katalog Ruko
            </Link>

            {user && (
              <Link
                href="/my-bookings"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === "/my-bookings"
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Receipt className="w-4 h-4" />
                Sewa Saya
              </Link>
            )}

            {/* Admin Exclusive Menus */}
            {user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/laporan"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === "/admin/laporan"
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Laporan Keuangan
                </Link>
                <Link
                  href="/admin/ruko"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === "/admin/ruko"
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                  Kelola Ruko
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-800 flex items-center justify-end gap-1">
                    {user.name}
                    {user.role === "ADMIN" && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-medium transition"
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 font-medium"
          >
            <Home className="w-4 h-4 text-blue-600" />
            Katalog Ruko
          </Link>
          {user && (
            <Link
              href="/my-bookings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 font-medium"
            >
              <Receipt className="w-4 h-4 text-blue-600" />
              Sewa Saya
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/admin/laporan"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 font-medium"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Laporan Keuangan
              </Link>
              <Link
                href="/admin/ruko"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 font-medium"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                Kelola Ruko
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-500">
                  Masuk sebagai: <strong>{user.name}</strong> ({user.role})
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
