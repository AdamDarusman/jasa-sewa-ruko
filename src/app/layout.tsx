import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "RukoHub - Platform Jasa Sewa Ruko Digital",
  description:
    "Solusi sewa ruko strategis, cepat, dan transparan dengan Payment Gateway otomatis, cetak invoice PDF, dan laporan keuangan digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

  return (
    <html lang="id">
      <head>
        {/* Midtrans Snap Script (Sandbox) */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={clientKey}
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
