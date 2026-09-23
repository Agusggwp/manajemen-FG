import React from "react";
import { formatRupiah } from "@/lib/utils";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Phone,
  Users,
  Image as ImageIcon,
  Camera,
  ShieldCheck,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PackageDetailModal({
  activePackage,
  onClose,
  isDarkTheme,
  onWhatsAppClick,
}) {
  if (!activePackage) return null;

  const isMuaOnly =
    activePackage.category === "MUA Only" ||
    (Number(activePackage.number_of_photographers) === 0 && Boolean(activePackage.includes_mua));

  return (
    <Dialog open={Boolean(activePackage)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`max-w-2xl rounded-3xl p-0 overflow-hidden border ${
          isDarkTheme
            ? "bg-[#092722] text-[#F5F7F6] border-white/15"
            : "bg-white text-slate-900 border-slate-200"
        }`}
      >
        {/* Header Banner */}
        <div
          className={`p-6 sm:p-8 border-b relative ${
            isDarkTheme
              ? "bg-gradient-to-r from-[#14433B] to-[#0e352f] border-white/10"
              : "bg-gradient-to-r from-slate-900 to-[#14433B] text-white border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <Badge
              className={`text-xs font-bold px-3 py-1 rounded-xl ${
                isDarkTheme
                  ? isMuaOnly
                    ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                    : "bg-[#21C9A4]/20 text-[#21C9A4] border border-[#21C9A4]/40"
                  : isMuaOnly
                  ? "bg-pink-500 text-white border border-pink-400"
                  : "bg-white/20 text-[#21C9A4] border border-white/30"
              }`}
            >
              {activePackage.category}
            </Badge>

            {isMuaOnly ? (
              <Badge className="bg-pink-500 text-white font-black text-xs px-3 py-1 rounded-xl gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {activePackage.mua?.name ? `MUA: ${activePackage.mua.name}` : "Khusus Layanan MUA"}
              </Badge>
            ) : activePackage.includes_mua ? (
              <Badge className="bg-[#21C9A4] text-[#092722] font-black text-xs px-3 py-1 rounded-xl gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {activePackage.mua?.name ? `MUA: ${activePackage.mua.name}` : "Termasuk MUA"}
              </Badge>
            ) : null}
          </div>

          <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {activePackage.name}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#B8C8C4] mt-1">
            {isMuaOnly
              ? "Detail rincian fasilitas layanan rias & hairdo profesional MUA."
              : "Detail rincian fasilitas dan penawaran paket resmi pemotretan."}
          </DialogDescription>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#21C9A4]">
              {formatRupiah(activePackage.price)}
            </span>
            <span className="text-xs text-[#B8C8C4] font-medium">
              {isMuaOnly ? "/ Sesi rias" : "/ Sesi foto"}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className={`p-3.5 rounded-2xl border text-center space-y-1 ${
                isDarkTheme
                  ? "bg-[#14433B]/50 border-white/10"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <Clock className="h-4 w-4 text-[#21C9A4] mx-auto" />
              <div className="text-xs font-bold">{activePackage.duration_minutes} Menit</div>
              <div className={`text-[10px] ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                Durasi Sesi
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-center space-y-1 ${
                isDarkTheme
                  ? "bg-[#14433B]/50 border-white/10"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <ImageIcon className="h-4 w-4 text-[#21C9A4] mx-auto" />
              <div className="text-xs font-bold">
                {isMuaOnly ? "Tanpa Foto" : `${activePackage.number_of_photos} Photos`}
              </div>
              <div className={`text-[10px] ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                {isMuaOnly ? "Dokumentasi" : "Hasil Foto"}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-center space-y-1 ${
                isDarkTheme
                  ? "bg-[#14433B]/50 border-white/10"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <Users className="h-4 w-4 text-[#21C9A4] mx-auto" />
              <div className="text-xs font-bold">
                {isMuaOnly ? "Tanpa FG" : `${activePackage.number_of_photographers} FG`}
              </div>
              <div className={`text-[10px] ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                {isMuaOnly ? "Layanan MUA" : "Fotografer"}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border text-center space-y-1 ${
                isDarkTheme
                  ? "bg-[#14433B]/50 border-white/10"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <Sparkles className="h-4 w-4 text-[#21C9A4] mx-auto" />
              <div className="text-xs font-bold truncate">
                {isMuaOnly
                  ? activePackage.mua?.name || "MUA Professional"
                  : activePackage.includes_mua
                  ? "MUA Terfasilitasi"
                  : "Tanpa MUA"}
              </div>
              <div className={`text-[10px] ${isDarkTheme ? "text-[#829A94]" : "text-slate-500"}`}>
                Layanan MUA
              </div>
            </div>
          </div>

          {/* Description Section */}
          {activePackage.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#21C9A4]">
                Deskripsi Paket
              </h4>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"
                }`}
              >
                {activePackage.description}
              </p>
            </div>
          )}

          {/* MUA Details Card */}
          {activePackage.includes_mua && activePackage.mua && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 ${
                isDarkTheme
                  ? "bg-[#14433B]/40 border-[#21C9A4]/30"
                  : "bg-[#E6FFFA] border-[#99F6E4]"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-[#21C9A4]/20 flex items-center justify-center text-[#21C9A4] shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#21C9A4]">
                  Make Up Artist Mitra
                </div>
                <div className={`text-sm font-bold ${isDarkTheme ? "text-[#F5F7F6]" : "text-slate-900"}`}>
                  {activePackage.mua.name}
                </div>
                {activePackage.mua.phone && (
                  <div className={`text-xs ${isDarkTheme ? "text-[#B8C8C4]" : "text-slate-600"}`}>
                    Kontak Mitra: {activePackage.mua.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features List */}
          {Array.isArray(activePackage.features) && activePackage.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#21C9A4]">
                Fasilitas & Kelengkapan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePackage.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-medium ${
                      isDarkTheme
                        ? "bg-[#14433B]/30 border-white/5 text-[#F5F7F6]"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#21C9A4] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Guarantee */}
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isDarkTheme
                ? "bg-[#071f1b] border-white/10 text-[#B8C8C4]"
                : "bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-[#21C9A4]">
              <ShieldCheck className="h-4 w-4" /> Ketentuan & Pengiriman Hasil Foto:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
              <li>Softcopy mentah / preview akan dikirimkan maksimal 24-48 jam setelah pemotretan.</li>
              <li>Hasil foto editing final diselesaikan dalam 5-7 hari kerja.</li>
              <li>Validasi lokasi dan konfirmasi jam dilakukan via WhatsApp.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter
          className={`p-6 border-t flex flex-col sm:flex-row gap-3 ${
            isDarkTheme ? "bg-[#071f1b] border-white/10" : "bg-slate-50 border-slate-200"
          }`}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={`w-full sm:w-auto text-xs font-bold rounded-xl h-11 ${
              isDarkTheme
                ? "border-white/20 bg-transparent text-[#F5F7F6] hover:bg-white/10"
                : "border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Tutup
          </Button>
          <Button
            onClick={() => {
              onWhatsAppClick(activePackage);
              onClose();
            }}
            className="w-full sm:flex-1 bg-[#21C9A4] hover:bg-[#2ED9B2] text-[#092722] font-black text-xs h-11 rounded-xl shadow-lg shadow-[#21C9A4]/20"
          >
            <Phone className="h-4 w-4 mr-2" /> Booking via WhatsApp Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
