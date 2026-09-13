import React from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FaqSection({
  isDarkTheme,
  faqs = [],
  activeFaqIndex,
  setActiveFaqIndex,
}) {
  return (
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
  );
}
