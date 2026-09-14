import React, { useState } from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, MapPin, Clock, Camera, Sparkles, User, CheckCircle2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function Show({ schedule }) {
  const [reminderOpen, setReminderOpen] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const handleSendReminder = () => {
    if (!schedule?.id || isSendingReminder) return;
    setIsSendingReminder(true);
    router.post(
      `/admin/schedules/${schedule.id}/send-reminder`,
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setIsSendingReminder(false);
          setReminderOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Head title={`Detail Jadwal - ${schedule.customer?.name || ""}`} />
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/schedules" className="shrink-0">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Detail Jadwal Pemotretan
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Informasi lokasi, waktu, dan tim bertugas</p>
            </div>
          </div>

          <Button
            onClick={() => setReminderOpen(true)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 px-4 shrink-0 shadow-xs"
          >
            <Mail className="h-4 w-4" />
            <span>Kirim Email Peringatan</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Info */}
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 lg:col-span-2 shadow-2xs">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Informasi Jadwal</CardTitle>
              <div className="flex flex-wrap items-center gap-1.5 justify-end">
                {schedule.reminder_sent_at && (
                  <Badge variant="outline" className="border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-[10px] whitespace-nowrap">
                    Email Reminder Terkirim
                  </Badge>
                )}
                <Badge className="text-[10px] whitespace-nowrap py-0 px-2 h-5" variant={
                  schedule.status === "COMPLETED" ? "success" :
                    schedule.status === "SHOOTING" ? "warning" :
                      schedule.status === "SCHEDULED" ? "info" :
                        schedule.status === "CANCELLED" ? "destructive" :
                          "secondary"
                }>
                  {getStatusLabel(schedule.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pelanggan</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{schedule.customer?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{schedule.customer?.phone || "-"}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Paket Foto</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{schedule.photo_package?.name || "-"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatRupiah(schedule.photo_package?.price)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tanggal</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{formatDate(schedule.date)}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Waktu Pemotretan</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                  </p>
                  {Number(schedule.overtime_hours) > 0 && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                      (Termasuk +{schedule.overtime_hours} Jam Overtime)
                    </p>
                  )}
                </div>
              </div>

              {(Number(schedule.overtime_hours) > 0 || Number(schedule.overtime_fee) > 0) && (
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                    <span>Informasi Overtime</span>
                    <span>+{formatRupiah(schedule.overtime_fee)}</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-400">
                    Tambahan durasi: <strong>{schedule.overtime_hours} Jam</strong>. Total tagihan (Paket + Overtime):{" "}
                    <strong>
                      {formatRupiah(
                        Number(schedule.photo_package?.price || 0) + Number(schedule.overtime_fee || 0)
                      )}
                    </strong>
                  </p>
                </div>
              )}

              {/* Shooting Location Detail Section */}
              <div className="p-3.5 sm:p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-950 dark:text-indigo-200 font-bold">
                    <Camera className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-sm">1. Lokasi Pemotretan (Shooting): {schedule.location_name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-indigo-100/60 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800">
                    Sesi Foto
                  </Badge>
                </div>
                {schedule.location_address && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-6">{schedule.location_address}</p>
                )}
                {schedule.location_notes && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 pl-6 font-medium italic">
                    Catatan: {schedule.location_notes}
                  </p>
                )}
                <div className="pl-6 pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Lat: {schedule.latitude}</span>
                  <span>Long: {schedule.longitude}</span>
                  <span>Radius GPS: {schedule.location_radius}m</span>
                </div>
              </div>

              {/* MUA Location Detail Section */}
              <div className="p-3.5 sm:p-4 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200/70 dark:border-pink-900/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-pink-950 dark:text-pink-200 font-bold">
                    <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400 shrink-0" />
                    <span className="text-sm">
                      2. Lokasi Rias (MUA): {schedule.mua_same_as_shooting_location ? schedule.location_name : (schedule.mua_location_name || schedule.location_name)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-pink-100/60 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800">
                    {schedule.mua_same_as_shooting_location ? "Sama dg Pemotretan" : "Lokasi Khusus MUA"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-6">
                  {schedule.mua_same_as_shooting_location
                    ? schedule.location_address
                    : (schedule.mua_location_address || schedule.location_address)}
                </p>
                {(!schedule.mua_same_as_shooting_location && schedule.mua_location_notes) && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 pl-6 font-medium italic">
                    Catatan MUA: {schedule.mua_location_notes}
                  </p>
                )}
                {!schedule.mua_same_as_shooting_location && schedule.mua_latitude && (
                  <div className="pl-6 pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Lat MUA: {schedule.mua_latitude}</span>
                    <span>Long MUA: {schedule.mua_longitude}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Assigned */}
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Tim Bertugas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Fotografer</p>
                {schedule.project?.photographers?.map((p) => (
                  <div key={p.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Make Up Artist (MUA)</p>
                {!schedule.project?.muas || schedule.project.muas.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">— Tidak menggunakan MUA</p>
                ) : (
                  schedule.project.muas.map((m) => (
                    <div key={m.id} className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">{m.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={reminderOpen}
        onOpenChange={(val) => { if (!isSendingReminder) setReminderOpen(val); }}
        title="Kirim Email Peringatan"
        description="Apakah Anda yakin ingin mengirim email peringatan (reminder) H-1 ke Pelanggan, Fotografer, dan MUA untuk jadwal pemotretan ini?"
        confirmText="Kirim Email"
        cancelText="Batal"
        loadingText="Mengirim Email..."
        variant="default"
        icon={Mail}
        loading={isSendingReminder}
        disabled={isSendingReminder}
        onConfirm={handleSendReminder}
      />
    </>
  );
}
