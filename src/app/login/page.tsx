"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk ke akun");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin/laporan");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError("");
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[36px] shadow-sm border border-[#E7E5DC] space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-[#1A1916]">
            Ruko<span className="text-[#1E4D34]">Hub</span>
          </Link>
          <h2 className="text-xl font-normal text-[#1A1916]">
            Masuk ke <span className="font-serif italic text-[#1E4D34]">Akun Anda</span>
          </h2>
          <p className="text-xs text-[#7A7566]">
            Akses dashboard penyewa atau kelola laporan sewa
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E7E5DC] text-xs space-y-2">
          <div className="font-bold text-[#1A1916] flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D34]" />
            Tombol Uji Coba Cepat (Autofill):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("admin@ruko.id", "admin123")}
              className="p-2 rounded-xl bg-white hover:bg-[#EFECE5] text-[#1A1916] border border-[#E7E5DC] font-medium transition text-left"
            >
              <div className="font-bold text-xs">Akun Admin</div>
              <div className="text-[10px] text-[#7A7566]">admin@ruko.id</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("budi@gmail.com", "user123")}
              className="p-2 rounded-xl bg-white hover:bg-[#EFECE5] text-[#1A1916] border border-[#E7E5DC] font-medium transition text-left"
            >
              <div className="font-bold text-xs">Akun Penyewa</div>
              <div className="text-[10px] text-[#7A7566]">budi@gmail.com</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold text-[#1A1916] mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C877A] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1916] mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C877A] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold text-white bg-[#1A1916] hover:bg-[#2C2924] shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Memproses..." : "Masuk ke Akun"}
          </button>
        </form>

        <div className="text-center text-xs text-[#7A7566] pt-2 border-t border-[#EAE8DF]">
          Belum memiliki akun penyewa?{" "}
          <Link href="/register" className="font-bold text-[#1E4D34] hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
