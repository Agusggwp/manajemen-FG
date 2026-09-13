import React from "react";
import { ArrowUp, MessageSquare } from "lucide-react";

export default function FloatingActions({
  isDarkTheme,
  showScrollTop,
  waNumber,
  companyName,
}) {
  const handleWhatsAppChat = () => {
    const cleanPhone = waNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(`Halo ${companyName}, saya ingin bertanya mengenai paket foto.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border cursor-pointer ${
            isDarkTheme
              ? "bg-[#14433B] text-[#21C9A4] border-[#21C9A4]/40 hover:bg-[#1d574d]"
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
          }`}
          title="Kembali ke Atas"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <button
        onClick={handleWhatsAppChat}
        className="h-13 w-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 cursor-pointer"
        title="Chat WhatsApp"
      >
        <MessageSquare className="h-6 w-6 fill-white" />
      </button>
    </div>
  );
}
