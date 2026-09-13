import React from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { Calendar, FolderKanban, Clock, CheckCircle2, DollarSign, Camera, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageLoading, PhotographerDashboardSkeleton } from "@/components/loading/PageSkeletons";
import {
  PhotographerEarningsChart,
  ProjectStatusDonutChart,
} from "@/components/charts/DashboardCharts";

export default function Dashboard({
  stats = {},
  recentSchedules = [],
  recentProofs = [],
  earningsTrend = [],
  statusBreakdown = {},
}) {
  const isNavigating = usePageLoading();
  const safeStats = stats || {};
  const safeSchedules = Array.isArray(recentSchedules) ? recentSchedules : (recentSchedules?.data || []);

  if (isNavigating) {
    return (
      <>
        <Head title="Dashboard Fotografer" />
        <PhotographerDashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <Head title="Dashboard Fotografer" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Portal Fotografer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Selamat datang! Berikut jadwal pemotretan dan status penugasan Anda.
          </p>
        </div>

        {/* Financial Highlights (Own Salary Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900 dark:bg-slate-900 border-slate-800 text-white shadow-sm">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">
                Pendapatan Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-white">
                {formatRupiah(safeStats.monthlySalary || 0)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Bulan berjalan</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Total Gaji Diterima
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {formatRupiah(safeStats.totalSalaryPaid || 0)}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Sudah dibayarkan</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Tugas Aktif
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {safeStats.pendingJobs || 0}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Jadwal & Project</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/photographer/schedules" className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Jadwal</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Lihat agenda</p>
            </div>
          </Link>
          <Link href="/photographer/projects" className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Project</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Tugas foto</p>
            </div>
          </Link>
          <Link href="/photographer/gallery" className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Galeri</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Hasil karya</p>
            </div>
          </Link>
          <Link href="/photographer/salary" className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Gaji Saya</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Riwayat Gaji</p>
            </div>
          </Link>
        </div>

        {/* Analytics & Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PhotographerEarningsChart data={earningsTrend} />
          </div>
          <div>
            <ProjectStatusDonutChart statusCounts={statusBreakdown} title="Status Penugasan Foto" />
          </div>
        </div>

        {/* Assigned Upcoming Schedules */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                Jadwal Pemotretan Mendatang
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Daftar penugasan foto Anda</p>
            </div>
            <Link href="/photographer/schedules" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2.5">
                Semua Jadwal <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 space-y-3">
            {safeSchedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada jadwal pemotretan yang ditugaskan kepada Anda.</p>
              </div>
            ) : (
              safeSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white mr-1">
                        {schedule.customer?.name || "Pelanggan"}
                      </p>
                      <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-900 whitespace-nowrap py-0 px-2 h-5 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                        {schedule.photo_package?.name || schedule.photoPackage?.name || schedule.package?.name || "Paket Foto"}
                      </Badge>
                      <Badge className="text-[10px] whitespace-nowrap py-0 px-2 h-5" variant={
                        schedule.status === "COMPLETED"  ? "success"     :
                        schedule.status === "SHOOTING"   ? "warning"     :
                        schedule.status === "SCHEDULED"  ? "info"        :
                        schedule.status === "CANCELLED"  ? "destructive" :
                        "secondary"
                      }>
                        {getStatusLabel(schedule.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center text-[11px] text-slate-500 dark:text-slate-400 gap-x-3 gap-y-1 pt-0.5">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                        {formatDate(schedule.date || schedule.shooting_date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                        {schedule.start_time
                          ? `${schedule.start_time.substring(0, 5)}${schedule.end_time ? ` - ${schedule.end_time.substring(0, 5)}` : ''}`
                          : (schedule.shooting_time?.substring(0, 5) || "-")}
                      </span>
                      {(schedule.location_name || schedule.location_address || schedule.location) && (
                        <span className="flex items-center truncate">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate">{schedule.location_name || schedule.location_address || schedule.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                    <Link href={`/photographer/schedules/${schedule.id}`} className="block w-full sm:w-auto">
                      <Button size="sm" className="w-full sm:w-auto font-semibold gap-1.5 justify-center">
                        <Camera className="h-3.5 w-3.5" /> Buka Jadwal & Kirim Proof
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
