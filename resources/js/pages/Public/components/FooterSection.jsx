import React from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

// ArtDevata Public Footer Component

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.58a8.32 8.32 0 0 0 4.78 1.48V6.69h-.02z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.4C4.54 15.14 4.12 13.55 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67ZM8.84 7.02C8.63 7.02 8.44 7.04 8.28 7.38C8.07 7.83 7.51 8.35 7.51 9.42C7.51 10.49 8.29 11.51 8.4 11.66C8.51 11.82 9.94 14.01 12.13 14.95C12.65 15.17 13.06 15.31 13.37 15.41C13.89 15.58 14.37 15.55 14.74 15.5C15.16 15.44 16.03 14.97 16.21 14.46C16.4 13.95 16.4 13.52 16.34 13.43C16.28 13.34 16.14 13.28 15.93 13.17C15.72 13.06 14.69 12.55 14.5 12.48C14.31 12.41 14.17 12.38 14.03 12.59C13.89 12.8 13.5 13.28 13.38 13.41C13.26 13.55 13.14 13.56 12.93 13.46C12.72 13.35 12.04 13.13 11.24 12.41C10.61 11.85 10.19 11.16 10.07 10.95C9.95 10.74 10.06 10.62 10.17 10.51C10.26 10.42 10.37 10.28 10.48 10.16C10.59 10.04 10.63 9.95 10.7 9.81C10.77 9.67 10.73 9.55 10.68 9.45C10.63 9.35 10.23 8.36 10.06 7.95C9.89 7.55 9.72 7.6 9.59 7.6L9.19 7.6C9.05 7.6 8.84 7.02 8.84 7.02Z" />
    </svg>
  );
}

function DiscordIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function FooterSection({ isDarkTheme, ctaTitle, companyName, waNumber }) {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppConsultation = () => {
    const cleanPhone = waNumber?.replace(/[^0-9]/g, "") || "6281999888777";
    const text = encodeURIComponent(`Halo ArtDevata, saya ingin konsultasi layanan IT & website.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <footer
      id="kontak"
      className="bg-[#0e3832] text-[#9db6af] pt-16 pb-10 border-t border-[#1a4a42] relative z-10 selection:bg-[#21C9A4] selection:text-[#092722]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* CTA Card Banner */}
        {ctaTitle && (
          <div className="bg-gradient-to-r from-[#14433B] to-[#0c312b] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left border border-[#21C9A4]/30 relative overflow-hidden">
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
              className="bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-black text-sm px-7 h-12 rounded-2xl shadow-lg shadow-[#21C9A4]/20 transition-all hover:scale-105 whitespace-nowrap relative z-10 cursor-pointer"
            >
              <Phone className="h-4 w-4 mr-2" /> Hubungi via WhatsApp
            </Button>
          </div>
        )}

        {/* 4-Column Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pt-2">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt={companyName || "ArtDevata"} className="h-9 w-9 object-contain shrink-0" />
              <span className="text-2xl font-bold text-white tracking-tight">{companyName || "ArtDevata"}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#a3bbb5] max-w-sm">
              Kami menyediakan solusi IT terpadu dari pengembangan website, hosting &amp; domain, instalasi CCTV, hingga IT support untuk mendukung transformasi digital bisnis Anda.
            </p>
            <div className="pt-2">
              <a
                href="mailto:artdevata@gmail.com"
                className="inline-flex items-center text-xs sm:text-sm text-[#a3bbb5] hover:text-[#21C9A4] transition-colors gap-2 group"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#a3bbb5] group-hover:text-[#21C9A4] transition-colors" />
                <span>artdevata@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Link Cepat */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Link Cepat</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#a3bbb5]">
              <li>
                <a href="#tentang" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Layanan
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Layanan */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Layanan</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#a3bbb5]">
              <li>
                <a href="#katalog" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Pengembangan Website
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Hosting &amp; Domain
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#21C9A4] transition-colors inline-block">
                  Instalasi CCTV
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#21C9A4] transition-colors inline-block">
                  IT Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Ikuti Kami */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wide">Ikuti Kami</h4>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d1e5e0] hover:text-white hover:bg-[#21C9A4]/20 hover:border-[#21C9A4] transition-all"
                title="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d1e5e0] hover:text-white hover:bg-[#21C9A4]/20 hover:border-[#21C9A4] transition-all"
                title="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppConsultation}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d1e5e0] hover:text-white hover:bg-[#21C9A4]/20 hover:border-[#21C9A4] transition-all cursor-pointer"
                title="WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </button>
              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d1e5e0] hover:text-white hover:bg-[#21C9A4]/20 hover:border-[#21C9A4] transition-all"
                title="Discord"
              >
                <DiscordIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#829A94] gap-4">
          <p>© {currentYear} ArtDevata. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed &amp; Built with <span className="text-red-500">❤️</span> by ArtDevata
          </p>
        </div>
      </div>
    </footer>
  );
}

