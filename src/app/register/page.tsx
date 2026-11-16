"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, UserPlus, Lock, Mail, User, Phone, AlertCircle, Store } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "VENDOR">("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftar");
      }

      if (role === "VENDOR") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[36px] shadow-sm border border-[#E7E5DC] space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-[#1A1916]">
            Ruko<span className="text-[#1E4D34]">Hub</span>
          </Link>
          <h2 className="text-xl font-normal text-[#1A1916]">
            Buat Akun <span className="font-serif italic text-[#1E4D34]">Baru</span>
          </h2>
          <p className="text-xs text-[#7A7566]">
            Pilih peran akun sesuai kebutuhan komersial Anda
          </p>
        </div>

        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#1A1916]">
            Daftar Sebagai:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 ${
                role === "USER"
                  ? "bg-[#E5EFE9] border-[#1E4D34] text-[#1A1916] ring-1 ring-[#1E4D34]"
                  : "bg-[#FAF9F5] border-[#E7E5DC] text-[#5A564C] hover:bg-[#EFECE5]"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Store className={`w-4 h-4 ${role === "USER" ? "text-[#1E4D34]" : "text-[#7A7566]"}`} />
                Pembeli / Penyewa
              </div>
              <span className="text-[10px] text-[#7A7566] leading-tight">
                Cari & sewa unit ruko untuk tempat usaha Anda
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("VENDOR")}
              className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 ${
                role === "VENDOR"
                  ? "bg-[#E5EFE9] border-[#1E4D34] text-[#1A1916] ring-1 ring-[#1E4D34]"
                  : "bg-[#FAF9F5] border-[#E7E5DC] text-[#5A564C] hover:bg-[#EFECE5]"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Building2 className={`w-4 h-4 ${role === "VENDOR" ? "text-[#1E4D34]" : "text-[#7A7566]"}`} />
                Penyedia Ruko
              </div>
              <span className="text-[10px] text-[#7A7566] leading-tight">
                Pasarkan unit ruko milik Anda & pantau pendapatan
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold text-[#1A1916] mb-1">
              {role === "VENDOR" ? "Nama Pemilik / Perusahaan Properti" : "Nama Lengkap / Perusahaan"}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C877A] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "VENDOR" ? "Contoh: PT Mitra Ruko Propertindo" : "Contoh: Budi Santoso"}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
              />
            </div>
          </div>

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
              Nomor WhatsApp / HP
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8C877A] absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E7E5DC] rounded-2xl text-xs sm:text-sm text-[#1A1916] focus:outline-none focus:ring-2 focus:ring-[#1E4D34]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1916] mb-1">
              Kata Sandi (Minimal 6 Karakter)
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
            <UserPlus className="w-4 h-4" />
            {loading
              ? "Mendaftarkan..."
              : role === "VENDOR"
              ? "Daftar Sebagai Penyedia Ruko"
              : "Daftar Sebagai Penyewa"}
          </button>
        </form>

        <div className="text-center text-xs text-[#7A7566] pt-2 border-t border-[#EAE8DF]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#1E4D34] hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
