import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RukoHub - Sewa Ruko Strategis & Ruang Usaha Komersial",
  description:
    "Kurasi tempat usaha komersial terbaik di Tangerang Selatan & Jabodetabek dengan pembayaran digital terintegrasi dan invoice PDF resmi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`}>
      <head>
        {/* Midtrans Snap Script */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={clientKey}
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F4F3EE] text-[#1A1916] font-sans antialiased selection:bg-[#153323] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
