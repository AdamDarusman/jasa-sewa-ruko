"use client";

import React from "react";

export default function BackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle Technical Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Animated Ambient Blobs (Aurora effect) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/25 rounded-full blur-[100px] animate-blob" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[110px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-blob animation-delay-4000" />

      {/* Radial soft highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
    </div>
  );
}
