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

  const mapsUrl =
    schedule.latitude && schedule.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${schedule.latitude},${schedule.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          schedule.location_name + " " + (schedule.location_address || "")
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
        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-100">
                  {photoPackage.name || "Paket Foto"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{customer.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-pink-100 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-4 w-4" /> {formatDate(schedule.date)}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4" /> {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)} WITA
                </span>
              </div>
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
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>Lokasi Pemotretan & Rias</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Nama Lokasi</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {schedule.location_name}
                </p>
              </div>

              {schedule.location_address && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Alamat Lengkap</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {schedule.location_address}
                  </p>
                </div>
              )}

              {schedule.location_notes && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">Catatan Akses Lokasi:</span>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{schedule.location_notes}</p>
                </div>
              )}

              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block pt-2">
                <Button variant="outline" className="w-full gap-2 text-xs font-semibold border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Buka Petunjuk Arah di Google Maps</span>
                </Button>
              </a>
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
