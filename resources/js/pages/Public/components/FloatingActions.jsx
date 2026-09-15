import React from "react";
import { ArrowUp } from "lucide-react";

function WhatsAppIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.4C4.54 15.14 4.12 13.55 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67ZM8.84 7.02C8.63 7.02 8.44 7.04 8.28 7.38C8.07 7.83 7.51 8.35 7.51 9.42C7.51 10.49 8.29 11.51 8.4 11.66C8.51 11.82 9.94 14.01 12.13 14.95C12.65 15.17 13.06 15.31 13.37 15.41C13.89 15.58 14.37 15.55 14.74 15.5C15.16 15.44 16.03 14.97 16.21 14.46C16.4 13.95 16.4 13.52 16.34 13.43C16.28 13.34 16.14 13.28 15.93 13.17C15.72 13.06 14.69 12.55 14.5 12.48C14.31 12.41 14.17 12.38 14.03 12.59C13.89 12.8 13.5 13.28 13.38 13.41C13.26 13.55 13.14 13.56 12.93 13.46C12.72 13.35 12.04 13.13 11.24 12.41C10.61 11.85 10.19 11.16 10.07 10.95C9.95 10.74 10.06 10.62 10.17 10.51C10.26 10.42 10.37 10.28 10.48 10.16C10.59 10.04 10.63 9.95 10.7 9.81C10.77 9.67 10.73 9.55 10.68 9.45C10.63 9.35 10.23 8.36 10.06 7.95C9.89 7.55 9.72 7.6 9.59 7.6L9.19 7.6C9.05 7.6 8.84 7.02 8.84 7.02Z" />
    </svg>
  );
}

export default function FloatingActions({
  isDarkTheme,
  showScrollTop,
  waNumber,
  companyName,
}) {
  const handleWhatsAppChat = () => {
    const cleanPhone = waNumber?.replace(/[^0-9]/g, "") || "6281999888777";
    const text = encodeURIComponent(`Halo ${companyName || "ArtDevata"}, saya ingin bertanya mengenai layanan.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-11 w-11 rounded-full bg-[#21C9A4] hover:bg-[#1db896] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
          title="Kembali ke Atas"
        >
          <ArrowUp className="h-5 w-5 stroke-[2.5]" />
        </button>
      )}

      {/* WhatsApp Action with badge */}
      <div className="flex items-center gap-2 group cursor-pointer" onClick={handleWhatsAppChat}>
        <div className="bg-white text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg select-none whitespace-nowrap">
          Hubungi via Whatsapp
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleWhatsAppChat();
          }}
          className="h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all duration-300 group-hover:scale-110 cursor-pointer shrink-0"
          title="Chat via WhatsApp"
        >
          <WhatsAppIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}

