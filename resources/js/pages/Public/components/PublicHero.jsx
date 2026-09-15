import React from "react";
import { Sparkles, Search, Star, Zap, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PublicHero({
  isDarkTheme,
  heroBadge,
  heroTitle,
  heroSubtitle,
  showSearch,
  search,
  setSearch,
  resultCount,
}) {
  const titleWords = (heroTitle || "").split(" ");

  return (
    <section
      id="beranda"
      className={`relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden z-10 border-b ${
        isDarkTheme ? "border-white/10" : "border-slate-200/80 bg-white"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Hero Badge */}
        <div className="inline-flex items-center justify-center">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs border transition-all duration-300 hover:scale-105 ${
              isDarkTheme
                ? "bg-[#14433B]/90 border-[#21C9A4]/40 text-[#21C9A4]"
                : "bg-[#14433B]/5 border-[#14433B]/20 text-[#14433B]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#21C9A4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#21C9A4]"></span>
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#21C9A4]" />
            <span>{heroBadge}</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto ${
            isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"
          }`}
        >
          {titleWords.map((word, idx) => (
            <span
              key={idx}
              className={
                idx % 3 === 2
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-[#21C9A4] to-[#0D9488]"
                  : ""
              }
            >
              {word}{" "}
            </span>
          ))}
        </h1>

        {/* Hero Subtitle */}
        <p
          className={`max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed ${
            isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"
          }`}
        >
          {heroSubtitle}
        </p>

        {/* Search Bar */}
        {showSearch && (
          <div className="max-w-xl mx-auto pt-2 space-y-2">
            <div className="relative flex items-center group">
              <Search
                className={`absolute left-4 h-5 w-5 transition-colors ${
                  isDarkTheme
                    ? "text-[#829A94] group-focus-within:text-[#21C9A4]"
                    : "text-slate-400 group-focus-within:text-[#14433B]"
                }`}
              />
              <Input
                type="text"
                placeholder="Cari paket (misal: Wisuda, Wedding, Prewedding, MUA)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full h-13 pl-12 pr-10 text-sm rounded-2xl transition-all duration-300 border focus:ring-2 ${
                  isDarkTheme
                    ? "bg-[#092722]/90 border-white/15 text-[#F5F7F6] placeholder:text-[#829A94] focus:border-[#21C9A4] focus:ring-[#21C9A4]/30"
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-md focus:border-[#14433B] focus:ring-[#14433B]/20"
                }`}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className={`absolute right-3.5 p-1 rounded-full hover:opacity-80 transition-opacity ${
                    isDarkTheme ? "text-[#829A94] hover:bg-white/10" : "text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {search && (
              <p className={`text-xs text-left px-2 font-medium ${isDarkTheme ? "text-[#21C9A4]" : "text-[#14433B]"}`}>
                Ditemukan {resultCount} paket foto untuk kata kunci "{search}"
              </p>
            )}
          </div>
        )}

        {/* Highlight Stats */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm transition-all hover:scale-105 ${
              isDarkTheme
                ? "bg-[#14433B]/50 border-white/10 hover:border-[#21C9A4]/40"
                : "bg-white/80 border-slate-200/80 shadow-2xs hover:border-[#14433B]/30"
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[#21C9A4] font-black text-xl">
              <Star className="h-4 w-4 fill-[#21C9A4]" /> 4.9/5.0
            </div>
            <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
              Rating Kepuasan
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm transition-all hover:scale-105 ${
              isDarkTheme
                ? "bg-[#14433B]/50 border-white/10 hover:border-[#21C9A4]/40"
                : "bg-white/80 border-slate-200/80 shadow-2xs hover:border-[#14433B]/30"
            }`}
          >
            <div className="text-[#21C9A4] font-black text-xl">500+</div>
            <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
              Sesi Pemotretan
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm transition-all hover:scale-105 ${
              isDarkTheme
                ? "bg-[#14433B]/50 border-white/10 hover:border-[#21C9A4]/40"
                : "bg-white/80 border-slate-200/80 shadow-2xs hover:border-[#14433B]/30"
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[#21C9A4] font-black text-xl">
              <Sparkles className="h-4 w-4" /> MUA Mitra
            </div>
            <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
              Make Up Artist Pro
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm transition-all hover:scale-105 ${
              isDarkTheme
                ? "bg-[#14433B]/50 border-white/10 hover:border-[#21C9A4]/40"
                : "bg-white/80 border-slate-200/80 shadow-2xs hover:border-[#14433B]/30"
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[#21C9A4] font-black text-xl">
              <Zap className="h-4 w-4" /> 24-48 Jam
            </div>
            <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
              Fast Preview Photo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
