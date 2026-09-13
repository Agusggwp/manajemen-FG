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
        <Head title="Dashboard Photographer" />
        <PhotographerDashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <Head title="Dashboard Photographer" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Portal Photographer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Selamat datang! Berikut jadwal pemotretan dan status penugasan Anda.
          </p>
        </div>

        {/* Financial Highlights (Own Salary Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900 text-white shadow-sm">
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

          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase">
                Total Gaji Diterima
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {formatRupiah(safeStats.totalSalaryPaid || 0)}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Sudah dibayarkan</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase">
                Tugas Aktif
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                {safeStats.pendingJobs || 0}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Jadwal & Project</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/photographer/schedules" className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-md">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Jadwal</p>
              <p className="text-[10px] text-slate-500">Lihat agenda</p>
            </div>
          </Link>
          <Link href="/photographer/projects" className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-md">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Project</p>
              <p className="text-[10px] text-slate-500">Tugas foto</p>
            </div>
          </Link>
          <Link href="/photographer/gallery" className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-md">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Galeri</p>
              <p className="text-[10px] text-slate-500">Hasil karya</p>
            </div>
          </Link>
          <Link href="/photographer/salary" className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors flex items-center space-x-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-md">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Gaji Saya</p>
              <p className="text-[10px] text-slate-500">Riwayat gaji</p>
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
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900">
                Jadwal Pemotretan Mendatang
              </CardTitle>
              <p className="text-xs text-slate-500">Daftar penugasan foto Anda</p>
            </div>
            <Link href="/photographer/schedules">
              <Button variant="ghost" size="sm">
                Semua Jadwal <ArrowRight />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-3">
            {safeSchedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada jadwal pemotretan yang ditugaskan kepada Anda.</p>
              </div>
            ) : (
              safeSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-3 sm:p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-slate-900">
                        {schedule.customer?.name || "Pelanggan"}
                      </p>
                      <Badge variant="outline" className="text-[10px] bg-white">
                        {schedule.package?.name || "Paket Foto"}
                      </Badge>
                      <Badge className="text-[10px]" variant={
                        schedule.status === "COMPLETED"  ? "success"     :
                        schedule.status === "SHOOTING"   ? "warning"     :
                        schedule.status === "SCHEDULED"  ? "info"        :
                        schedule.status === "CANCELLED"  ? "destructive" :
                        "secondary"
                      }>
                        {getStatusLabel(schedule.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center text-[11px] text-slate-500 gap-x-3 gap-y-1">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {formatDate(schedule.shooting_date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {schedule.shooting_time?.substring(0, 5) || "-"}
                      </span>
                      {schedule.location && (
                        <span className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          {schedule.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link href={`/photographer/schedules/${schedule.id}`}>
                      <Button size="sm">
                        <Camera /> Buka Jadwal & Kirim Proof
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
