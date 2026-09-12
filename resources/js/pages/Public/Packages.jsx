import React, { useState, useEffect } from "react";
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
  X,
  Star,
  HelpCircle,
  ChevronDown,
  Calendar,
  MapPin,
  Award,
  Zap,
  MessageSquare,
  ArrowUp,
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
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const faqs = [
    {
      question: "Bagaimana cara melakukan booking jadwal pemotretan?",
      answer: "Anda dapat memilih paket yang diinginkan lalu mengklik tombol 'Pesan via WhatsApp'. Tim kami akan mengonfirmasi ketersediaan jadwal, lokasi, dan detail konsep foto yang Anda inginkan.",
    },
    {
      question: "Apakah lokasi pemotretan bebas dipilih oleh klien?",
      answer: "Ya, Anda dapat merekomendasikan lokasi outdoor atau studio favorit di Bali. Fotografer kami juga dapat memberikan saran lokasi terbaik sesuai dengan konsep paket foto yang Anda pilih.",
    },
    {
      question: "Berapa lama estimasi penyerahan hasil akhir foto?",
      answer: "Penyerahan softcopy foto mentah/preview biasanya dapat diakses dalam 24-48 jam. Hasil foto yang telah melalui retouch & editing final akan dikirimkan dalam kurun waktu 5 - 7 hari kerja.",
    },
    {
      question: "Apakah paket yang termasuk MUA sudah termasuk busana/kostum?",
      answer: "Paket foto mencakup riasan & hair styling profesional dari MUA mitra kami. Untuk kostum/busana adat/wisuda dapat dikonsultasikan terlebih dahulu atau membawa busana pribadi.",
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans relative selection:bg-[#21C9A4] ${
        isDarkTheme
          ? "bg-[#092722] text-[#F5F7F6] selection:text-[#092722]"
          : "bg-slate-50/50 text-slate-900 selection:text-white"
      }`}
    >
      <Head title={`Katalog Paket Foto & MUA - ${companyName}`} />

      {/* DYNAMIC BACKGROUND ANIMATIONS & GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div
          className={`absolute inset-0 bg-[size:48px_48px] opacity-25 ${
            isDarkTheme
              ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,rgba(20,67,59,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,67,59,0.05)_1px,transparent_1px)]"
          }`}
        />
        {/* Glowing Orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-[#21C9A4]/20 via-[#0D9488]/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-[#21C9A4]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 -right-32 w-[600px] h-[600px] bg-[#0D9488]/15 blur-[150px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-200 ${
          isDarkTheme
            ? "bg-[#092722]/85 border-white/10 shadow-lg shadow-black/20"
            : "bg-white/90 border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                isDarkTheme
                  ? "bg-gradient-to-br from-[#21C9A4]/20 to-[#0D9488]/30 border border-[#21C9A4]/40 shadow-sm"
                  : "bg-[#14433B] shadow-md shadow-[#14433B]/20"
              }`}
            >
              <Camera className="h-5 w-5 text-[#21C9A4]" />
            </div>
            <div>
              <span
                className={`text-lg font-black tracking-wider flex items-center gap-1.5 ${
                  isDarkTheme ? "text-[#F5F7F6]" : "text-[#14433B]"
                }`}
              >
                {companyName.split(" ")[0] || "ARTDEVATA"}
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#21C9A4] font-bold block uppercase -mt-1">
                {companyName.split(" ").slice(1).join(" ") || "Photography Bali"}
              </span>
            </div>
          </div>

          <nav
            className={`hidden md:flex items-center space-x-8 text-sm font-semibold ${
              isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"
            }`}
          >
            <a href="#katalog" className="hover:text-[#21C9A4] transition-colors flex items-center gap-1">
              <span>Katalog Paket</span>
            </a>
            <a href="#keunggulan" className="hover:text-[#21C9A4] transition-colors flex items-center gap-1">
              <span>Keunggulan</span>
            </a>
            <a href="#faq" className="hover:text-[#21C9A4] transition-colors flex items-center gap-1">
              <span>FAQ</span>
            </a>
            <a href="#kontak" className="hover:text-[#21C9A4] transition-colors flex items-center gap-1">
              <span>Kontak</span>
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {auth?.user ? (
              <Link href={dashboardUrl}>
                <Button
                  className={`font-bold rounded-xl text-xs h-9 px-4 transition-all duration-200 ${
                    isDarkTheme
                      ? "bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] shadow-md shadow-[#21C9A4]/20"
                      : "bg-[#14433B] hover:bg-[#0B302B] text-[#21C9A4] shadow-xs"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Dashboard Staff
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  const cleanPhone = waNumber.replace(/[^0-9]/g, "");
                  window.open(`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(companyName)},%20saya%20ingin%20tanya%20paket%20foto`, "_blank");
                }}
                className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-extrabold text-xs h-9 rounded-xl px-4 shadow-sm"
              >
                <Phone className="h-3.5 w-3.5 mr-1.5" /> Konsultasi Gratis
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className={`relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden z-10 border-b ${
          isDarkTheme ? "border-white/10" : "border-slate-200/80 bg-white"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Animated Hero Badge */}
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
            {heroTitle.split(" ").map((word, idx) => (
              <span key={idx} className={idx % 3 === 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-[#21C9A4] to-[#0D9488]" : ""}>
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

          {/* Search bar inside Hero */}
          {showSearch && (
            <div className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center group">
                <Search
                  className={`absolute left-4 h-5 w-5 transition-colors ${
                    isDarkTheme ? "text-[#829A94] group-focus-within:text-[#21C9A4]" : "text-slate-400 group-focus-within:text-[#14433B]"
                  }`}
                />
                <Input
                  type="text"
                  placeholder="Cari paket (misal: Wisuda, Wedding, Prewedding, MUA)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full h-13 pl-12 pr-4 text-sm rounded-2xl transition-all duration-300 border focus:ring-2 ${
                    isDarkTheme
                      ? "bg-[#092722]/90 border-white/15 text-[#F5F7F6] placeholder:text-[#829A94] focus:border-[#21C9A4] focus:ring-[#21C9A4]/30"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-md focus:border-[#14433B] focus:ring-[#14433B]/20"
                  }`}
                />
              </div>
            </div>
          )}

          {/* STATS BAR HIGHLIGHT */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm ${
                isDarkTheme ? "bg-[#14433B]/50 border-white/10" : "bg-white/80 border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[#21C9A4] font-black text-xl">
                <Star className="h-4 w-4 fill-[#21C9A4]" /> 4.9/5.0
              </div>
              <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>Rating Kepuasan</p>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm ${
                isDarkTheme ? "bg-[#14433B]/50 border-white/10" : "bg-white/80 border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="text-[#21C9A4] font-black text-xl">500+</div>
              <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>Sesi Pemotretan</p>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm ${
                isDarkTheme ? "bg-[#14433B]/50 border-white/10" : "bg-white/80 border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[#21C9A4] font-black text-xl">
                <Sparkles className="h-4 w-4" /> MUA Mitra
              </div>
              <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>Make Up Artist Pro</p>
            </div>

            <div
              className={`p-4 rounded-2xl border text-center space-y-1 backdrop-blur-sm ${
                isDarkTheme ? "bg-[#14433B]/50 border-white/10" : "bg-white/80 border-slate-200/80 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-center gap-1 text-[#21C9A4] font-black text-xl">
                <Zap className="h-4 w-4" /> 24-48 Jam
              </div>
              <p className={`text-xs font-semibold ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>Fast Preview Photo</p>
            </div>
          </div>
        </div>
      </section>

      {/* KATALOG PAKET FOTO */}
      <section id="katalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Camera className="h-5 w-5 text-[#21C9A4]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#21C9A4]">
                Pilihan Terbaik
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"
              }`}
            >
              Katalog Paket Pemotretan & MUA
            </h2>
            <p className={isDarkTheme ? "text-[#B8C8C4] text-sm mt-1" : "text-slate-600 text-sm mt-1"}>
              Jelajahi berbagai pilihan paket resmi {companyName} dengan harga transparan
            </p>
          </div>

          {/* Category Tabs Filter */}
          {showCategories && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === "ALL"
                    ? isDarkTheme
                      ? "bg-[#21C9A4] text-[#092722] shadow-lg shadow-[#21C9A4]/20 scale-105"
                      : "bg-[#14433B] text-[#21C9A4] shadow-md scale-105"
                    : isDarkTheme
                    ? "bg-[#14433B]/70 text-[#B8C8C4] border border-white/10 hover:bg-[#14433B]"
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? isDarkTheme
                          ? "bg-[#21C9A4] text-[#092722] shadow-lg shadow-[#21C9A4]/20 scale-105"
                          : "bg-[#14433B] text-[#21C9A4] shadow-md scale-105"
                        : isDarkTheme
                        ? "bg-[#14433B]/70 text-[#B8C8C4] border border-white/10 hover:bg-[#14433B]"
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
            className={`text-center py-20 rounded-3xl border space-y-4 ${
              isDarkTheme
                ? "bg-[#14433B]/40 border-white/10"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="h-16 w-16 mx-auto rounded-full bg-[#21C9A4]/10 flex items-center justify-center text-[#21C9A4]">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className={isDarkTheme ? "text-xl font-bold text-[#F5F7F6]" : "text-xl font-bold text-slate-800"}>
              Tidak ada paket foto ditemukan
            </h3>
            <p className={isDarkTheme ? "text-xs text-[#829A94] max-w-sm mx-auto" : "text-xs text-slate-500 max-w-sm mx-auto"}>
              Coba ubah kata kunci pencarian atau pilih kategori filter lainnya.
            </p>
            <Button
              onClick={() => {
                setSearch("");
                setSelectedCategory("ALL");
              }}
              className="bg-[#21C9A4] text-[#092722] font-bold text-xs rounded-xl h-9 px-4"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => {
              const isFeatured = index === 0 || pkg.includes_mua;

              return (
                <Card
                  key={pkg.id}
                  className={`transition-all duration-300 flex flex-col justify-between overflow-hidden group rounded-3xl relative border ${
                    isDarkTheme
                      ? `bg-[#0e352f]/80 backdrop-blur-md hover:border-[#21C9A4]/60 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-[#21C9A4]/10 ${
                          isFeatured ? "border-[#21C9A4]/50 ring-1 ring-[#21C9A4]/30" : "border-white/12"
                        }`
                      : `bg-white hover:border-[#14433B] hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-[#14433B]/10 ${
                          isFeatured ? "border-[#14433B]/40 ring-1 ring-[#14433B]/20" : "border-slate-200/90"
                        }`
                  }`}
                >
                  {/* POPULAR BADGE RIBBON */}
                  {isFeatured && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-l from-[#21C9A4] to-[#0D9488] text-[#092722] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                        <Sparkles className="h-3 w-3 fill-[#092722]" /> Recommended
                      </div>
                    </div>
                  )}

                  <CardContent className="p-7 space-y-6">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold rounded-xl px-3 py-1 ${
                          isDarkTheme
                            ? "border-[#21C9A4]/40 text-[#21C9A4] bg-[#21C9A4]/10"
                            : "border-[#14433B]/20 text-[#14433B] bg-[#14433B]/5"
                        }`}
                      >
                        {pkg.category}
                      </Badge>

                      {pkg.includes_mua ? (
                        <Badge
                          className={`gap-1.5 text-xs font-bold rounded-xl px-3 py-1 ${
                            isDarkTheme
                              ? "bg-[#21C9A4]/20 text-[#21C9A4] border border-[#21C9A4]/40"
                              : "bg-[#E6FFFA] text-[#0D9488] border border-[#99F6E4]"
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#21C9A4]" />
                          {pkg.mua?.name ? `MUA: ${pkg.mua.name}` : "Termasuk MUA"}
                        </Badge>
                      ) : (
                        <span className={`text-xs italic font-medium ${isDarkTheme ? "text-[#829A94]" : "text-slate-400"}`}>
                          — Tanpa MUA
                        </span>
                      )}
                    </div>

                    {/* Title & Price */}
                    <div>
                      <h3
                        className={`text-2xl font-black transition-colors leading-snug ${
                          isDarkTheme
                            ? "text-[#F5F7F6] group-hover:text-[#21C9A4]"
                            : "text-slate-900 group-hover:text-[#14433B]"
                        }`}
                      >
                        {pkg.name}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-[#21C9A4] tracking-tight">
                          {formatRupiah(pkg.price)}
                        </span>
                        <span className={`text-xs font-semibold ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                          / sesi
                        </span>
                      </div>
                    </div>

                    {/* Quick Specs Grid */}
                    <div
                      className={`grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl border ${
                        isDarkTheme
                          ? "bg-[#14433B]/70 border-white/10 text-[#B8C8C4]"
                          : "bg-slate-50 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2 font-medium">
                        <Clock className="h-4 w-4 text-[#21C9A4] shrink-0" />
                        <span>{pkg.duration_minutes} Menit</span>
                      </div>
                      <div className="flex items-center space-x-2 font-medium">
                        <ImageIcon className="h-4 w-4 text-[#21C9A4] shrink-0" />
                        <span>{pkg.number_of_photos} File Foto</span>
                      </div>
                      <div className="flex items-center space-x-2 font-medium">
                        <Users className="h-4 w-4 text-[#21C9A4] shrink-0" />
                        <span>{pkg.number_of_photographers} FG Bertugas</span>
                      </div>
                      <div className="flex items-center space-x-2 font-medium truncate">
                        <Sparkles className="h-4 w-4 text-[#21C9A4] shrink-0" />
                        <span className="truncate">
                          {pkg.mua?.name || (pkg.includes_mua ? "Mitra MUA Pro" : "Tanpa MUA")}
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
                      <div className={`space-y-2.5 border-t pt-4 ${isDarkTheme ? "border-white/10" : "border-slate-100"}`}>
                        <p className={`text-[11px] font-extrabold uppercase tracking-wider ${isDarkTheme ? "text-[#829A94]" : "text-slate-400"}`}>
                          Fasilitas Termasuk:
                        </p>
                        <ul className={`space-y-2 text-xs font-medium ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-700"}`}>
                          {pkg.features.slice(0, 4).map((feat, idx) => (
                            <li key={idx} className="flex items-start space-x-2.5">
                              <CheckCircle2 className="h-4 w-4 text-[#21C9A4] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>

                  {/* Footer Buttons */}
                  <div className="p-7 pt-0 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setActiveModalPackage(pkg)}
                      className={`flex-1 text-xs font-bold h-10 rounded-2xl transition-all ${
                        isDarkTheme
                          ? "border-white/20 bg-transparent text-[#F5F7F6] hover:bg-[#14433B]"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Info className="h-4 w-4 mr-1.5" /> Detail Paket
                    </Button>
                    <Button
                      onClick={() => handleWhatsAppInquiry(pkg)}
                      className="flex-1 bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-black text-xs h-10 rounded-2xl shadow-md shadow-[#21C9A4]/20 transition-all hover:scale-[1.02]"
                    >
                      <Phone className="h-4 w-4 mr-1.5" /> Pesan
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* KEUNGGULAN SECTION */}
      <section
        id="keunggulan"
        className={`py-20 border-t border-b relative z-10 ${
          isDarkTheme
            ? "bg-[#071f1b]/80 border-white/10"
            : "bg-white border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge
              variant="outline"
              className={`rounded-xl px-3.5 py-1 text-xs font-bold ${
                isDarkTheme
                  ? "border-[#21C9A4]/40 text-[#21C9A4] bg-[#21C9A4]/10"
                  : "border-[#14433B]/20 text-[#14433B] bg-[#14433B]/5"
              }`}
            >
              Keunggulan Layanan
            </Badge>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
              Kualitas Foto & Pelayanan Terbaik di Bali
            </h2>
            <p className={isDarkTheme ? "text-sm text-[#B8C8C4]" : "text-sm text-slate-600"}>
              Kami memastikan setiap momen berharga Anda diabadikan secara profesional dan sempurna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              className={`p-8 space-y-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                isDarkTheme
                  ? "bg-[#0e352f]/90 border-white/10 hover:border-[#21C9A4]/40"
                  : "bg-slate-50/80 border-slate-200/80 shadow-xs hover:border-[#14433B]/30"
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-[#21C9A4]/15 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4] shadow-xs">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className={`font-black text-xl ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                Fotografer Berpengalaman
              </h3>
              <p className={`text-xs leading-relaxed font-normal ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                Tim fotografer berpengalaman dengan spesialisasi momen Wisuda, Wedding, dan Personal Portrait yang ramah dan siap mengarahkan gaya terbaik Anda.
              </p>
            </Card>

            <Card
              className={`p-8 space-y-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                isDarkTheme
                  ? "bg-[#0e352f]/90 border-white/10 hover:border-[#21C9A4]/40"
                  : "bg-slate-50/80 border-slate-200/80 shadow-xs hover:border-[#14433B]/30"
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-[#21C9A4]/15 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4] shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className={`font-black text-xl ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                Mitra MUA Terverifikasi
              </h3>
              <p className={`text-xs leading-relaxed font-normal ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                Kolaborasi eksklusif bersama MUA profesional terverifikasi di Bali yang menggunakan kosmetik higienis dan berkualitas tinggi.
              </p>
            </Card>

            <Card
              className={`p-8 space-y-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
                isDarkTheme
                  ? "bg-[#0e352f]/90 border-white/10 hover:border-[#21C9A4]/40"
                  : "bg-slate-50/80 border-slate-200/80 shadow-xs hover:border-[#14433B]/30"
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-[#21C9A4]/15 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4] shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className={`font-black text-xl ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                Sistem Absensi GPS & Email Reminder
              </h3>
              <p className={`text-xs leading-relaxed font-normal ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                Sistem manajemen terintegrasi dengan validasi GPS lokasi pemotretan serta pengiriman email reminder H-1 otomatis untuk kepastian jadwal.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        <div className="text-center space-y-3">
          <Badge
            variant="outline"
            className={`rounded-xl px-3.5 py-1 text-xs font-bold ${
              isDarkTheme
                ? "border-[#21C9A4]/40 text-[#21C9A4] bg-[#21C9A4]/10"
                : "border-[#14433B]/20 text-[#14433B] bg-[#14433B]/5"
            }`}
          >
            Pusat Bantuan
          </Badge>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
            Pertanyaan Sering Diajukan (FAQ)
          </h2>
          <p className={isDarkTheme ? "text-sm text-[#B8C8C4]" : "text-sm text-slate-600"}>
            Temukan jawaban atas pertanyaan seputar pemesanan paket foto dan layanan kami
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDarkTheme
                    ? "bg-[#0e352f]/90 border-white/10"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base cursor-pointer"
                >
                  <span className={isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#21C9A4] transition-transform duration-300 shrink-0 ml-3 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    className={`p-5 pt-0 text-xs sm:text-sm leading-relaxed border-t mt-1 ${
                      isDarkTheme ? "text-[#B8C8C4] border-white/10" : "text-slate-600 border-slate-100"
                    }`}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER & CTA */}
      <footer
        id="kontak"
        className={`pt-16 pb-12 border-t relative z-10 ${
          isDarkTheme ? "bg-[#071f1b] text-[#829A94] border-white/10" : "bg-white text-slate-600 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="bg-gradient-to-r from-[#14433B] to-[#0e352f] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border border-[#21C9A4]/30 relative overflow-hidden">
            {/* Glow background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#21C9A4]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-black text-white">{ctaTitle}</h3>
              <p className="text-xs sm:text-sm text-[#B8C8C4] max-w-xl">
                Tim profesional kami siap membantu merekomendasikan konsep foto, tempat outdoor terbaik di Bali, dan mengatur jadwal pemotretan Anda.
              </p>
            </div>
            <Button
              onClick={() => {
                const cleanPhone = waNumber.replace(/[^0-9]/g, "");
                window.open(`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(companyName)},%20saya%20ingin%20konsultasi%20paket%20foto`, "_blank");
              }}
              className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-black text-sm px-7 h-12 rounded-2xl shadow-lg shadow-[#21C9A4]/20 transition-all hover:scale-105 whitespace-nowrap relative z-10"
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
              <div className="h-6 w-6 rounded-lg bg-[#21C9A4]/15 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4]">
                <Camera className="h-3.5 w-3.5" />
              </div>
              <span className={`font-black text-sm ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                {companyName}
              </span>
            </div>
            <p>© 2026 {companyName}. All Rights Reserved. Powered by Artdevata Management Platform.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border ${
              isDarkTheme
                ? "bg-[#14433B] text-[#21C9A4] border-[#21C9A4]/40"
                : "bg-white text-slate-800 border-slate-200"
            }`}
            title="Kembali ke Atas"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={() => {
            const cleanPhone = waNumber.replace(/[^0-9]/g, "");
            window.open(`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(companyName)},%20saya%20ingin%20tanya%20paket%20foto`, "_blank");
          }}
          className="h-13 w-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 group"
          title="Chat WhatsApp"
        >
          <MessageSquare className="h-6 w-6 fill-white" />
        </button>
      </div>
    </div>
  );
}
