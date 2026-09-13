import React from "react";
import { Link } from "@inertiajs/react";
import { Camera, Phone, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicNavbar({ isDarkTheme, companyName, waNumber, auth, dashboardUrl }) {
  const brandFirstWord = companyName?.split(" ")[0] || "ARTDEVATA";
  const brandRestWords = companyName?.split(" ").slice(1).join(" ") || "Photography Bali";

  const handleConsultation = () => {
    const cleanPhone = waNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Halo ${companyName}, saya ingin tanya mengenai paket pemotretan.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDarkTheme
          ? "bg-[#092722]/85 border-white/10 shadow-lg shadow-black/20"
          : "bg-white/90 border-slate-200/80 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center space-x-3 group cursor-pointer">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              isDarkTheme
                ? "bg-gradient-to-br from-[#21C9A4]/20 to-[#0D9488]/30 border border-[#21C9A4]/40 shadow-sm"
                : "bg-[#14433B] shadow-md shadow-[#14433B]/20"
            }`}
          >
            <Camera className="h-5 w-5 text-[#21C9A4]" />
          </div>
          <div>
            <span
              className={`text-lg font-black tracking-wider flex items-center gap-1.5 leading-none ${
                isDarkTheme ? "text-[#F5F7F6]" : "text-[#14433B]"
              }`}
            >
              {brandFirstWord}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#21C9A4] font-bold block uppercase mt-0.5">
              {brandRestWords}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center space-x-8 text-sm font-semibold ${
            isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"
          }`}
        >
          <a
            href="#katalog"
            className="hover:text-[#21C9A4] transition-colors duration-200"
          >
            Katalog Paket
          </a>
          <a
            href="#keunggulan"
            className="hover:text-[#21C9A4] transition-colors duration-200"
          >
            Keunggulan
          </a>
          <a
            href="#faq"
            className="hover:text-[#21C9A4] transition-colors duration-200"
          >
            FAQ
          </a>
          <a
            href="#kontak"
            className="hover:text-[#21C9A4] transition-colors duration-200"
          >
            Kontak
          </a>
        </nav>

        {/* Action Button */}
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
              onClick={handleConsultation}
              className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-extrabold text-xs h-9 rounded-xl px-4 shadow-sm transition-all duration-200 hover:scale-[1.02]"
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" /> Konsultasi Gratis
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
