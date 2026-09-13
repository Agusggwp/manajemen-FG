import React from "react";
import { Phone, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FooterSection({ isDarkTheme, ctaTitle, companyName, waNumber }) {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppConsultation = () => {
    const cleanPhone = waNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Halo ${companyName}, saya ingin konsultasi paket foto & lokasi.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <footer
      id="kontak"
      className={`pt-16 pb-12 border-t relative z-10 ${
        isDarkTheme ? "bg-[#071f1b] text-[#829A94] border-white/10" : "bg-white text-slate-600 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* CTA Card Banner */}
        <div className="bg-gradient-to-r from-[#14433B] to-[#0e352f] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border border-[#21C9A4]/30 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#21C9A4]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 max-w-xl">
            <h3 className="text-2xl font-black text-white">{ctaTitle}</h3>
            <p className="text-xs sm:text-sm text-[#B8C8C4] leading-relaxed">
              Tim profesional kami siap membantu merekomendasikan konsep foto, tempat outdoor terbaik di Bali, dan mengatur jadwal pemotretan Anda.
            </p>
          </div>
          <Button
            onClick={handleWhatsAppConsultation}
            className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-black text-sm px-7 h-12 rounded-2xl shadow-lg shadow-[#21C9A4]/20 transition-all hover:scale-105 whitespace-nowrap relative z-10"
          >
            <Phone className="h-4 w-4 mr-2" /> Hubungi via WhatsApp
          </Button>
        </div>

        {/* Copyright & Branding Footer */}
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
          <p>© {currentYear} {companyName}. All Rights Reserved. Powered by Artdevata Management Platform.</p>
        </div>
      </div>
    </footer>
  );
}
