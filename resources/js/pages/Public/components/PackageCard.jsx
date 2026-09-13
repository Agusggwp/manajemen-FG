import React from "react";
import { formatRupiah } from "@/lib/utils";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Phone,
  Users,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PackageCard({
  pkg,
  isFeatured,
  isDarkTheme,
  onDetailClick,
  onWhatsAppClick,
}) {
  return (
    <Card
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
      {/* Recommended Ribbon */}
      {isFeatured && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-l from-[#21C9A4] to-[#0D9488] text-[#092722] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
            <Sparkles className="h-3 w-3 fill-[#092722]" /> Recommended
          </div>
        </div>
      )}

      <CardContent className="p-7 space-y-6">
        {/* Category & MUA Status Badges */}
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

        {/* Specs Grid */}
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

        {/* Features Checklist */}
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

      {/* Action Buttons */}
      <div className="p-7 pt-0 flex gap-3">
        <Button
          variant="outline"
          onClick={onDetailClick}
          className={`flex-1 text-xs font-bold h-10 rounded-2xl transition-all ${
            isDarkTheme
              ? "border-white/20 bg-transparent text-[#F5F7F6] hover:bg-[#14433B]"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Info className="h-4 w-4 mr-1.5" /> Detail Paket
        </Button>
        <Button
          onClick={onWhatsAppClick}
          className="flex-1 bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-black text-xs h-10 rounded-2xl shadow-md shadow-[#21C9A4]/20 transition-all hover:scale-[1.02]"
        >
          <Phone className="h-4 w-4 mr-1.5" /> Pesan
        </Button>
      </div>
    </Card>
  );
}
