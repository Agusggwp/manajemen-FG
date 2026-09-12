import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { formatRupiah } from "@/lib/utils";
import {
  Camera,
  Sparkles,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  Phone,
  ShieldCheck,
  Users,
  LayoutDashboard,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Packages({ packages, categories, settings, auth }) {
  const safePackages = Array.isArray(packages) ? packages : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Dynamic Settings from Admin
  const isDarkTheme = (settings?.public_theme_mode || "light") === "dark";
  const heroBadge = settings?.public_hero_badge || "Dokumentasi Fotografi & MUA Profesional di Bali";
  const heroTitle = settings?.public_hero_title || "Abadikan Setiap Momen Istimewa Anda";
  const heroSubtitle =
    settings?.public_hero_subtitle ||
    "Pilihan paket foto terbaik untuk Wisuda, Pernikahan, Prewedding, dan Personal Portrait. Didukung tim fotografer handal & MUA profesional terpercaya.";
  const waNumber = settings?.public_whatsapp_number || settings?.company_phone || "6281999888777";
  const ctaTitle = settings?.public_cta_title || "Butuh Penawaran Custom atau Diskusi Lokasi?";
  const showSearch = settings?.public_show_search !== "false";
  const showCategories = settings?.public_show_categories !== "false";
  const companyName = settings?.company_name || "Artdevata Photography Bali";

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [activeModalPackage, setActiveModalPackage] = useState(null);

  // Filter packages by search & category
  const filteredPackages = safePackages.filter((pkg) => {
    const matchesCategory =
      !showCategories || selectedCategory === "ALL" || pkg.category === selectedCategory;
    const matchesSearch =
      !showSearch ||
      !search ||
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.category.toLowerCase().includes(search.toLowerCase()) ||
      (pkg.description && pkg.description.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppInquiry = (pkg) => {
    const cleanPhone = waNumber.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Halo ${companyName}! Saya berminat dengan paket foto "${pkg.name}" (${formatRupiah(pkg.price)}). Mohon info ketersediaan jadwal.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const dashboardUrl =
    auth?.user?.role === "ADMIN" ? "/admin/dashboard" : "/photographer/dashboard";

  return (
    <div
      className={`min-h-screen font-sans relative selection:bg-[#21C9A4] ${
        isDarkTheme
          ? "bg-[#14433B] text-[#F5F7F6] selection:text-[#0B302B]"
          : "bg-white text-slate-900 selection:text-slate-900"
      }`}
    >
      <Head title={`Katalog Paket Foto - ${companyName}`} />

      {/* SUBTLE TECHNICAL GRID BACKGROUND */}
      <div
        className={`fixed inset-0 pointer-events-none opacity-30 bg-[size:44px_44px] z-0 ${
          isDarkTheme
            ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,rgba(20,67,59,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,67,59,0.06)_1px,transparent_1px)]"
        }`}
      />

      {/* SOFT TURQUOISE RADIAL GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#21C9A4]/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${
          isDarkTheme
            ? "bg-[#0B302B]/85 border-white/10"
            : "bg-white/90 border-slate-200/80 shadow-2xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-xs ${
                isDarkTheme
                  ? "bg-[#21C9A4]/15 border border-[#21C9A4]/30"
                  : "bg-[#14433B]"
              }`}
            >
              <Camera className="h-5 w-5 text-[#21C9A4]" />
            </div>
            <div>
              <span
                className={`text-lg font-extrabold tracking-wider flex items-center gap-1 ${
                  isDarkTheme ? "text-[#F5F7F6]" : "text-[#14433B]"
                }`}
              >
                {companyName.split(" ")[0] || "ARTDEVATA"}
              </span>
              <span className="text-[10px] tracking-widest text-[#21C9A4] font-bold block uppercase -mt-1">
                {companyName.split(" ").slice(1).join(" ") || "Photography Bali"}
              </span>
            </div>
          </div>

          <nav
            className={`hidden md:flex items-center space-x-8 text-sm font-medium ${
              isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"
            }`}
          >
            <a href="#katalog" className="hover:text-[#21C9A4] transition-colors">
              Katalog Paket
            </a>
            <a href="#keunggulan" className="hover:text-[#21C9A4] transition-colors">
              Keunggulan
            </a>
            <a href="#kontak" className="hover:text-[#21C9A4] transition-colors">
              Kontak
            </a>
          </nav>

          {auth?.user && (
            <div>
              <Link href={dashboardUrl}>
                <Button
                  className={`font-bold rounded-xl text-xs ${
                    isDarkTheme
                      ? "bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#0B302B] shadow-md shadow-[#21C9A4]/15"
                      : "bg-[#14433B] hover:bg-[#0B302B] text-[#21C9A4] shadow-xs"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard Staff
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className={`relative pt-14 pb-16 md:pt-20 md:pb-24 overflow-hidden z-10 border-b ${
          isDarkTheme ? "border-white/10" : "border-slate-100"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xs ${
              isDarkTheme
                ? "bg-[#0B302B]/90 border border-[#21C9A4]/30 text-[#21C9A4]"
                : "bg-[#14433B]/5 border border-[#14433B]/15 text-[#14433B]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#21C9A4]" />
            <span>{heroBadge}</span>
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
              isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"
            }`}
          >
            {heroTitle}
          </h1>

          <p
            className={`max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed ${
              isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"
            }`}
          >
            {heroSubtitle}
          </p>

          {/* Search bar inside Hero */}
          {showSearch && (
            <div className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center">
                <Search
                  className={`absolute left-4 h-5 w-5 ${
                    isDarkTheme ? "text-[#829A94]" : "text-slate-400"
                  }`}
                />
                <Input
                  type="text"
                  placeholder="Cari paket (misal: Wisuda, Wedding, Prewedding)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full h-12 pl-12 pr-4 text-sm rounded-xl focus:border-[#21C9A4] focus:ring-[#21C9A4]/20 ${
                    isDarkTheme
                      ? "bg-[#0B302B]/90 border-white/15 text-[#F5F7F6] placeholder:text-[#829A94]"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* KATALOG PAKET FOTO */}
      <section id="katalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"
              }`}
            >
              Pilihan Paket Foto Popular
            </h2>
            <p className={isDarkTheme ? "text-[#B8C8C4] text-sm mt-1" : "text-slate-600 text-sm mt-1"}>
              Jelajahi berbagai penawaran paket foto resmi {companyName}
            </p>
          </div>

          {/* Category Tabs Filter */}
          {showCategories && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "ALL"
                    ? isDarkTheme
                      ? "bg-[#21C9A4] text-[#0B302B] font-bold shadow-md shadow-[#21C9A4]/15"
                      : "bg-[#14433B] text-[#21C9A4] font-bold shadow-xs"
                    : isDarkTheme
                    ? "bg-[#0B302B]/70 text-[#B8C8C4] border border-white/10 hover:bg-[#14433B]"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Semua Paket ({safePackages.length})
              </button>
              {safeCategories.map((cat) => {
                const count = safePackages.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? isDarkTheme
                          ? "bg-[#21C9A4] text-[#0B302B] font-bold shadow-md shadow-[#21C9A4]/15"
                          : "bg-[#14433B] text-[#21C9A4] font-bold shadow-xs"
                        : isDarkTheme
                        ? "bg-[#0B302B]/70 text-[#B8C8C4] border border-white/10 hover:bg-[#14433B]"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PACKAGE CARDS GRID */}
        {filteredPackages.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border space-y-3 ${
              isDarkTheme
                ? "bg-[#0B302B]/60 border-white/10"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Camera
              className={`h-12 w-12 mx-auto ${
                isDarkTheme ? "text-[#829A94]" : "text-slate-400"
              }`}
            />
            <h3 className={isDarkTheme ? "text-lg font-bold text-[#F5F7F6]" : "text-lg font-bold text-slate-800"}>
              Tidak ada paket foto ditemukan
            </h3>
            <p className={isDarkTheme ? "text-xs text-[#829A94]" : "text-xs text-slate-500"}>
              Coba ubah kata kunci pencarian atau kategori filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`transition-all duration-300 flex flex-col justify-between overflow-hidden group rounded-2xl ${
                  isDarkTheme
                    ? "bg-[#0B302B]/75 border-white/12 hover:border-[#21C9A4]/40 hover:bg-[#0B302B]/90 shadow-xl backdrop-blur-xs"
                    : "bg-white border-slate-200/90 hover:border-[#21C9A4] hover:shadow-xl hover:shadow-[#14433B]/5"
                }`}
              >
                <CardContent className="p-6 space-y-5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold rounded-lg px-2.5 py-0.5 ${
                        isDarkTheme
                          ? "border-[#21C9A4]/30 text-[#21C9A4] bg-[#21C9A4]/10"
                          : "border-slate-200 text-[#14433B] bg-slate-100"
                      }`}
                    >
                      {pkg.category}
                    </Badge>

                    {pkg.includes_mua ? (
                      <Badge
                        className={`gap-1 text-[11px] font-medium rounded-lg ${
                          isDarkTheme
                            ? "bg-[#21C9A4]/15 text-[#21C9A4] border border-[#21C9A4]/30"
                            : "bg-[#E6FFFA] text-[#0D9488] border border-[#99F6E4]"
                        }`}
                      >
                        <Sparkles className="h-3 w-3 text-[#21C9A4]" />
                        {pkg.mua?.name ? `MUA: ${pkg.mua.name}` : "Termasuk MUA"}
                      </Badge>
                    ) : (
                      <span className={`text-[11px] italic ${isDarkTheme ? "text-[#829A94]" : "text-slate-400"}`}>
                        — Tanpa MUA
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3
                      className={`text-xl font-bold transition-colors ${
                        isDarkTheme
                          ? "text-[#F5F7F6] group-hover:text-[#21C9A4]"
                          : "text-slate-900 group-hover:text-[#14433B]"
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#21C9A4] tracking-tight">
                        {formatRupiah(pkg.price)}
                      </span>
                      <span className={`text-xs ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                        / project
                      </span>
                    </div>
                  </div>

                  {/* Quick Specs Grid */}
                  <div
                    className={`grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border ${
                      isDarkTheme
                        ? "bg-[#14433B]/60 border-white/10 text-[#B8C8C4]"
                        : "bg-slate-50 border-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 text-[#21C9A4] shrink-0" />
                      <span>{pkg.duration_minutes} Menit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="h-3.5 w-3.5 text-[#21C9A4] shrink-0" />
                      <span>{pkg.number_of_photos} Foto</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-3.5 w-3.5 text-[#21C9A4] shrink-0" />
                      <span>{pkg.number_of_photographers} FG</span>
                    </div>
                    <div className="flex items-center space-x-2 truncate">
                      <Sparkles className="h-3.5 w-3.5 text-[#21C9A4] shrink-0" />
                      <span className="truncate">
                        {pkg.mua?.name || (pkg.includes_mua ? "MUA Paket" : "No MUA")}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {pkg.description && (
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                      {pkg.description}
                    </p>
                  )}

                  {/* Features Highlights */}
                  {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                    <div className={`space-y-2 border-t pt-4 ${isDarkTheme ? "border-white/10" : "border-slate-100"}`}>
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${isDarkTheme ? "text-[#829A94]" : "text-slate-400"}`}>
                        Fitur Paket:
                      </p>
                      <ul className={`space-y-1.5 text-xs ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-700"}`}>
                        {pkg.features.slice(0, 4).map((feat, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#21C9A4] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveModalPackage(pkg)}
                    className={`flex-1 text-xs h-9 rounded-xl ${
                      isDarkTheme
                        ? "border-white/15 bg-transparent text-[#F5F7F6] hover:bg-[#14433B]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Info className="h-3.5 w-3.5 mr-1" /> Detail
                  </Button>
                  <Button
                    onClick={() => handleWhatsAppInquiry(pkg)}
                    className="flex-1 bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#0B302B] font-bold text-xs h-9 rounded-xl shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" /> Pesan
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* KEUNGGULAN SECTION */}
      <section
        id="keunggulan"
        className={`py-16 border-t border-b relative z-10 ${
          isDarkTheme
            ? "bg-[#0B302B]/60 border-white/10"
            : "bg-slate-50/80 border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge
              variant="outline"
              className={`rounded-lg px-3 py-1 font-semibold ${
                isDarkTheme
                  ? "border-[#21C9A4]/30 text-[#21C9A4] bg-[#21C9A4]/10"
                  : "border-[#14433B]/20 text-[#14433B] bg-[#14433B]/5"
              }`}
            >
              Mengapa {companyName}?
            </Badge>
            <h2 className={`text-3xl font-bold tracking-tight ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
              Kualitas Fotografi Terbaik Untuk Momen Anda
            </h2>
            <p className={isDarkTheme ? "text-sm text-[#B8C8C4]" : "text-sm text-slate-600"}>
              Kami berkomitmen memberikan hasil karya foto terbaik dengan pelayanan profesional dan tepat waktu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className={`p-6 space-y-3 rounded-2xl ${
                isDarkTheme
                  ? "bg-[#14433B]/70 border-white/10"
                  : "bg-white border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-[#21C9A4]/10 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4]">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-lg ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                Fotografer Berpengalaman
              </h3>
              <p className={`text-xs leading-relaxed ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                Tim fotografer kami siap menangkap momen terbaik dengan komposisi dan lighting kelas profesional.
              </p>
            </Card>

            <Card
              className={`p-6 space-y-3 rounded-2xl ${
                isDarkTheme
                  ? "bg-[#14433B]/70 border-white/10"
                  : "bg-white border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-[#21C9A4]/10 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-lg ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                Mitra MUA Terkemuka
              </h3>
              <p className={`text-xs leading-relaxed ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                Bekerja sama dengan MUA profesional terverifikasi di Bali untuk memastikan penampilan Anda sempurna.
              </p>
            </Card>

            <Card
              className={`p-6 space-y-3 rounded-2xl ${
                isDarkTheme
                  ? "bg-[#14433B]/70 border-white/10"
                  : "bg-white border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-[#21C9A4]/10 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className={`font-bold text-lg ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                Hasil Foto High-Res & Tepat Waktu
              </h3>
              <p className={`text-xs leading-relaxed ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                Proses editing foto cepat dengan standar kualitas tinggi, diserahkan tepat sesuai estimasi waktu.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER & CTA */}
      <footer
        id="kontak"
        className={`pt-16 pb-12 border-t relative z-10 ${
          isDarkTheme ? "bg-[#0B302B] text-[#829A94] border-white/10" : "bg-white text-slate-600 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-[#14433B] text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{ctaTitle}</h3>
              <p className="text-xs text-[#B8C8C4]">
                Tim kami siap membantu merekomendasikan paket dan tempat pemotretan terbaik di Bali.
              </p>
            </div>
            <Button
              onClick={() => {
                const cleanPhone = waNumber.replace(/[^0-9]/g, "");
                window.open(`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(companyName)},%20saya%20ingin%20konsultasi%20paket%20foto`, "_blank");
              }}
              className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#0B302B] font-bold text-sm px-6 h-11 rounded-xl shadow-md whitespace-nowrap"
            >
              <Phone className="h-4 w-4 mr-2" /> Hubungi via WhatsApp
            </Button>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-center justify-between text-xs border-t pt-8 gap-4 ${
              isDarkTheme ? "text-[#829A94] border-white/10" : "text-slate-500 border-slate-100"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-[#21C9A4]" />
              <span className={`font-bold ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                {companyName}
              </span>
            </div>
            <p>© 2026 {companyName}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* PACKAGE DETAIL DIALOG / MODAL */}
      <Dialog open={Boolean(activeModalPackage)} onOpenChange={() => setActiveModalPackage(null)}>
        {activeModalPackage && (
          <DialogContent
            className={`max-w-lg rounded-2xl ${
              isDarkTheme
                ? "bg-[#0B302B] border-white/15 text-[#F5F7F6]"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <DialogHeader>
              <div className="flex items-center justify-between pr-4">
                <Badge
                  variant="outline"
                  className={`text-xs rounded-lg ${
                    isDarkTheme
                      ? "border-[#21C9A4]/30 text-[#21C9A4] bg-[#21C9A4]/10"
                      : "border-slate-200 text-[#14433B] bg-slate-100"
                  }`}
                >
                  {activeModalPackage.category}
                </Badge>
                {activeModalPackage.includes_mua && (
                  <Badge
                    className={`gap-1 text-xs rounded-lg ${
                      isDarkTheme
                        ? "bg-[#21C9A4]/15 text-[#21C9A4] border border-[#21C9A4]/30"
                        : "bg-[#E6FFFA] text-[#0D9488] border border-[#99F6E4]"
                    }`}
                  >
                    <Sparkles className="h-3 w-3 text-[#21C9A4]" />
                    {activeModalPackage.mua?.name ? `MUA: ${activeModalPackage.mua.name}` : "Termasuk MUA"}
                  </Badge>
                )}
              </div>
              <DialogTitle className={`text-2xl font-bold pt-2 ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                {activeModalPackage.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDarkTheme
                    ? "bg-[#14433B]/70 border-white/10"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <p className={`text-xs font-medium ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                    Harga Paket Foto
                  </p>
                  <p className="text-2xl font-black text-[#21C9A4]">
                    {formatRupiah(activeModalPackage.price)}
                  </p>
                </div>
                <div className={`text-right text-xs space-y-0.5 ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                  <p>Durasi: <strong>{activeModalPackage.duration_minutes} Menit</strong></p>
                  <p>Fotografer: <strong>{activeModalPackage.number_of_photographers} FG</strong></p>
                </div>
              </div>

              {activeModalPackage.description && (
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkTheme ? "text-[#829A94]" : "text-slate-400"}`}>
                    Deskripsi Paket
                  </h4>
                  <p
                    className={`text-xs leading-relaxed p-3 rounded-lg border ${
                      isDarkTheme
                        ? "bg-[#14433B]/50 border-white/10 text-[#B8C8C4]"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {activeModalPackage.description}
                  </p>
                </div>
              )}

              {Array.isArray(activeModalPackage.features) && activeModalPackage.features.length > 0 && (
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkTheme ? "text-[#829A94]" : "text-slate-400"}`}>
                    Semua Fitur & Fasilitas
                  </h4>
                  <div
                    className={`space-y-1.5 p-3 rounded-lg border text-xs ${
                      isDarkTheme
                        ? "bg-[#14433B]/50 border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {activeModalPackage.features.map((feat, idx) => (
                      <div key={idx} className={`flex items-center space-x-2 ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-800"}`}>
                        <CheckCircle2 className="h-4 w-4 text-[#21C9A4] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setActiveModalPackage(null)}
                className={`text-xs rounded-xl ${
                  isDarkTheme
                    ? "border-white/15 bg-transparent text-[#F5F7F6] hover:bg-[#14433B]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  handleWhatsAppInquiry(activeModalPackage);
                  setActiveModalPackage(null);
                }}
                className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#0B302B] font-bold text-xs rounded-xl shadow-xs"
              >
                <Phone className="h-3.5 w-3.5 mr-1" /> Pesan via WhatsApp
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
