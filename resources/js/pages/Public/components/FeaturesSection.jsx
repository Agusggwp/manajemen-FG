import React from "react";
import { Camera, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function FeaturesSection({ isDarkTheme }) {
  const featuresList = [
    {
      icon: Camera,
      title: "Fotografer Berpengalaman",
      description:
        "Tim fotografer berpengalaman dengan spesialisasi Wisuda, Wedding, dan Personal Portrait yang ramah dan siap mengarahkan gaya terbaik Anda.",
    },
    {
      icon: Sparkles,
      title: "Mitra MUA Terverifikasi",
      description:
        "Kolaborasi eksklusif bersama Make Up Artist profesional terverifikasi di Bali yang menggunakan kosmetik higienis dan berkualitas tinggi.",
    },
    {
      icon: ShieldCheck,
      title: "Validasi Lokasi GPS & System",
      description:
        "Sistem manajemen terintegrasi dengan validasi GPS lokasi pemotretan serta pengiriman email reminder H-1 otomatis untuk kepastian jadwal.",
    },
    {
      icon: Zap,
      title: "Fast Delivery Preview",
      description:
        "Akses softcopy preview foto dengan cepat dalam kurun waktu 24-48 jam setelah sesi pemotretan selesai.",
    },
  ];

  return (
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
          <h2
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"
            }`}
          >
            Kualitas Foto & Pelayanan Terbaik di Bali
          </h2>
          <p className={isDarkTheme ? "text-sm text-[#B8C8C4]" : "text-sm text-slate-600"}>
            Kami memastikan setiap momen berharga Anda diabadikan secara profesional, berkelas, dan tepat waktu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <Card
                key={idx}
                className={`p-7 space-y-4 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 ${
                  isDarkTheme
                    ? "bg-[#0e352f]/90 border-white/10 hover:border-[#21C9A4]/40 hover:shadow-lg hover:shadow-[#21C9A4]/5"
                    : "bg-slate-50/80 border-slate-200/80 shadow-xs hover:border-[#14433B]/30 hover:shadow-md"
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-[#21C9A4]/15 border border-[#21C9A4]/30 flex items-center justify-center text-[#21C9A4] shadow-xs">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className={`font-black text-lg ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                  {feat.title}
                </h3>
                <p className={`text-xs leading-relaxed font-normal ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
