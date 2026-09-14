import React from "react";
import { formatDate, getStatusLabel, formatRupiah } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Sparkles,
  User,
  Camera,
  Navigation,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ schedule = {} }) {
  const customer = schedule.customer || {};
  const photoPackage = schedule.photo_package || {};
  const project = schedule.project || {};
  const photographers = project.photographers || [];

  const cleanPhone = (customer.phone || "").replace(/[^0-9]/g, "");
  const formattedWaPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const waUrl = formattedWaPhone
    ? `https://wa.me/${formattedWaPhone}?text=${encodeURIComponent(
        `Halo Kak ${customer.name}, saya MUA dari ARTDEVATA untuk jadwal photoshoot pada ${formatDate(
          schedule.date
        )} (${schedule.start_time?.substring(0, 5)}).`
      )}`
    : null;

  const muaLat = schedule.mua_same_as_shooting_location
    ? schedule.latitude
    : (schedule.mua_latitude || schedule.latitude);
  const muaLng = schedule.mua_same_as_shooting_location
    ? schedule.longitude
    : (schedule.mua_longitude || schedule.longitude);
  const muaLocName = schedule.mua_same_as_shooting_location
    ? schedule.location_name
    : (schedule.mua_location_name || schedule.location_name);
  const muaLocAddr = schedule.mua_same_as_shooting_location
    ? schedule.location_address
    : (schedule.mua_location_address || schedule.location_address);

  const muaMapsUrl =
    muaLat && muaLng
      ? `https://www.google.com/maps/search/?api=1&query=${muaLat},${muaLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          (muaLocName || "") + " " + (muaLocAddr || "")
        )}`;

  const shootingMapsUrl =
    schedule.latitude && schedule.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${schedule.latitude},${schedule.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          (schedule.location_name || "") + " " + (schedule.location_address || "")
        )}`;

  return (
    <>
      <Head title={`Jadwal Rias: ${customer.name || "Detail"}`} />
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/mua/schedules">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Jadwal</span>
            </Button>
          </Link>
          <Badge
            className="text-xs uppercase font-bold"
            variant={
              schedule.status === "COMPLETED" ? "success" :
              schedule.status === "SHOOTING" ? "warning" :
              schedule.status === "SCHEDULED" ? "info" :
              schedule.status === "CANCELLED" ? "destructive" : "secondary"
            }
          >
            {getStatusLabel(schedule.status)}
          </Badge>
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none">
            <Sparkles className="h-48 w-48 text-white" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-pink-100">
                <Sparkles className="h-3 w-3" />
                <span>Sesi Rias MUA</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{customer.name || "Pelanggan"}</h1>
              <p className="text-xs sm:text-sm text-pink-100/90 font-medium flex items-center gap-2">
                <span>{photoPackage.name || project.package_name || "Paket Pemotretan"}</span>
                {project.project_code && (
                  <>
                    <span>•</span>
                    <span className="font-mono bg-black/20 px-1.5 py-0.5 rounded text-[11px]">
                      {project.project_code}
                    </span>
                  </>
                )}
              </p>
            </div>

            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button className="bg-white hover:bg-slate-100 text-pink-700 font-bold gap-2 text-xs shadow-md">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Hubungi via WhatsApp</span>
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location & GPS */}
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-500" />
                <span>Lokasi Tugas Rias & Pemotretan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Lokasi Rias MUA (Utama untuk MUA) */}
              <div className="p-3.5 rounded-xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200/80 dark:border-pink-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Lokasi Rias (MUA)
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-pink-100/60 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800">
                    {schedule.mua_same_as_shooting_location ? "Sama dg Pemotretan" : "Lokasi Khusus Rias"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {muaLocName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {muaLocAddr}
                  </p>
                </div>
                {(!schedule.mua_same_as_shooting_location && schedule.mua_location_notes) && (
                  <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/80 border border-pink-200/60 dark:border-pink-900/40 text-xs text-pink-800 dark:text-pink-300">
                    <span className="font-semibold block">Catatan Sesi Rias:</span>
                    {schedule.mua_location_notes}
                  </div>
                )}
                <div className="pt-1">
                  <a
                    href={muaMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button
                      type="button"
                      size="sm"
                      className="bg-pink-600 hover:bg-pink-700 text-white gap-1.5 text-xs h-8 px-3 rounded-lg shadow-xs font-medium"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>Buka Google Maps</span>
                    </Button>
                  </a>
                </div>
              </div>

              {/* Lokasi Pemotretan (Setelah Selesai Rias) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Lokasi Pemotretan
                  </span>
                  <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-slate-400">
                    Sesi Foto
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {schedule.location_name}
                  </p>
                  {schedule.location_address && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {schedule.location_address}
                    </p>
                  )}
                </div>
                {schedule.location_notes && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-700 dark:text-amber-400">
                    <span className="font-semibold block">Catatan Akses Foto:</span>
                    {schedule.location_notes}
                  </div>
                )}
                <div className="pt-1">
                  <a
                    href={shootingMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 gap-1.5 text-xs h-8 px-3 rounded-lg font-medium"
                    >
                      <Navigation className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Buka Google Maps</span>
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Team & Notes */}
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-indigo-500" />
                <span>Tim Fotografer Bertugas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {photographers.length === 0 ? (
                <p className="text-xs text-slate-400">Belum ada fotografer yang ditugaskan di project ini.</p>
              ) : (
                <div className="space-y-2.5">
                  {photographers.map((photo) => (
                    <div
                      key={photo.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {photo.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{photo.name}</p>
                          <p className="text-[10px] text-slate-400">{photo.phone || "Fotografer"}</p>
                        </div>
                      </div>
                      {photo.phone && (
                        <a
                          href={`https://wa.me/${photo.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Phone className="h-3 w-3" />
                          <span>Chat WA</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {schedule.notes && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Catatan Khusus Sesi</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 mt-1 whitespace-pre-line">
                    {schedule.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
