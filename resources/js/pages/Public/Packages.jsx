import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { formatRupiah } from "@/lib/utils";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

// Modular Components
import PublicNavbar from "./components/PublicNavbar";
import PublicHero from "./components/PublicHero";
import CategoryFilter from "./components/CategoryFilter";
import PackageCard from "./components/PackageCard";
import PackageDetailModal from "./components/PackageDetailModal";
import FeaturesSection from "./components/FeaturesSection";
import FaqSection from "./components/FaqSection";
import FooterSection from "./components/FooterSection";
import FloatingActions from "./components/FloatingActions";

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
      setShowScrollTop(window.scrollY > 300);
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
      answer:
        "Anda dapat memilih paket yang diinginkan lalu mengklik tombol 'Pesan via WhatsApp'. Tim kami akan mengonfirmasi ketersediaan jadwal, lokasi, dan detail konsep foto yang Anda inginkan.",
    },
    {
      question: "Apakah lokasi pemotretan bebas dipilih oleh klien?",
      answer:
        "Ya, Anda dapat merekomendasikan lokasi outdoor atau studio favorit di Bali. Fotografer kami juga dapat memberikan saran lokasi terbaik sesuai dengan konsep paket foto yang Anda pilih.",
    },
    {
      question: "Berapa lama estimasi penyerahan hasil akhir foto?",
      answer:
        "Penyerahan softcopy foto mentah/preview biasanya dapat diakses dalam 24-48 jam. Hasil foto yang telah melalui retouch & editing final akan dikirimkan dalam kurun waktu 5 - 7 hari kerja.",
    },
    {
      question: "Apakah paket yang termasuk MUA sudah termasuk busana/kostum?",
      answer:
        "Paket foto mencakup riasan & hair styling profesional dari MUA mitra kami. Untuk kostum/busana adat/wisuda dapat dikonsultasikan terlebih dahulu atau membawa busana pribadi.",
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
        {/* Subtle Grid overlay */}
        <div
          className={`absolute inset-0 bg-[size:48px_48px] opacity-25 ${
            isDarkTheme
              ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,rgba(20,67,59,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,67,59,0.05)_1px,transparent_1px)]"
          }`}
        />
        {/* Radial Glowing Orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-[#21C9A4]/20 via-[#0D9488]/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-[#21C9A4]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 -right-32 w-[600px] h-[600px] bg-[#0D9488]/15 blur-[150px] rounded-full" />
      </div>

      {/* NAVBAR */}
      <PublicNavbar
        isDarkTheme={isDarkTheme}
        companyName={companyName}
        waNumber={waNumber}
        auth={auth}
        dashboardUrl={dashboardUrl}
      />

      {/* HERO SECTION */}
      <PublicHero
        isDarkTheme={isDarkTheme}
        heroBadge={heroBadge}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        showSearch={showSearch}
        search={search}
        setSearch={setSearch}
        resultCount={filteredPackages.length}
      />

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
            <p className={isDarkTheme ? "text-sm text-[#B8C8C4] mt-1" : "text-sm text-slate-600 mt-1"}>
              Jelajahi berbagai pilihan paket resmi {companyName} dengan harga transparan
            </p>
          </div>

          {/* Category Tabs Filter */}
          {showCategories && (
            <CategoryFilter
              isDarkTheme={isDarkTheme}
              categories={safeCategories}
              safePackages={safePackages}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
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
              className="bg-[#21C9A4] text-[#092722] font-bold text-xs rounded-xl h-9 px-4 cursor-pointer"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => {
              const isFeatured = index === 0 || pkg.includes_mua;

              return (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isFeatured={isFeatured}
                  isDarkTheme={isDarkTheme}
                  onDetailClick={() => setActiveModalPackage(pkg)}
                  onWhatsAppClick={() => handleWhatsAppInquiry(pkg)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* KEUNGGULAN SECTION */}
      <FeaturesSection isDarkTheme={isDarkTheme} />

      {/* FAQ SECTION */}
      <FaqSection
        isDarkTheme={isDarkTheme}
        faqs={faqs}
        activeFaqIndex={activeFaqIndex}
        setActiveFaqIndex={setActiveFaqIndex}
      />

      {/* FOOTER & CTA */}
      <FooterSection
        isDarkTheme={isDarkTheme}
        ctaTitle={ctaTitle}
        companyName={companyName}
        waNumber={waNumber}
      />

      {/* DETAIL PAKET MODAL */}
      <PackageDetailModal
        activePackage={activeModalPackage}
        onClose={() => setActiveModalPackage(null)}
        isDarkTheme={isDarkTheme}
        onWhatsAppClick={handleWhatsAppInquiry}
      />

      {/* FLOATING ACTIONS */}
      <FloatingActions
        isDarkTheme={isDarkTheme}
        showScrollTop={showScrollTop}
        waNumber={waNumber}
        companyName={companyName}
      />
    </div>
  );
}
