import React from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import {
  Calendar,
  FolderKanban,
  Clock,
  Sparkles,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageLoading, PhotographerDashboardSkeleton } from "@/components/loading/PageSkeletons";
import {
  MuaEarningsChart,
  ProjectStatusDonutChart,
} from "@/components/charts/DashboardCharts";

export default function Dashboard({
  mua = {},
  stats = {},
  recentSchedules = [],
  recentFees = [],
  earningsTrend = [],
  statusBreakdown = {},
}) {
  const isNavigating = usePageLoading();
  const safeStats = stats || {};
  const safeSchedules = Array.isArray(recentSchedules) ? recentSchedules : (recentSchedules?.data || []);
  const safeFees = Array.isArray(recentFees) ? recentFees : (recentFees?.data || []);

  if (isNavigating) {
    return (
      <>
        <Head title="Dashboard MUA" />
        <PhotographerDashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <Head title="Dashboard MUA" />
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Portal Make Up Artist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Selamat datang, <span className="font-semibold text-slate-700 dark:text-slate-200">{mua?.name || "MUA"}</span>! Berikut jadwal rias dan ringkasan fee Anda.
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900 dark:bg-slate-900 border-slate-800 text-white shadow-sm">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">
                Fee Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-white">
                {formatRupiah(safeStats.monthlyEarnings || 0)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Bulan berjalan</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Total Fee Diterima
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {formatRupiah(safeStats.paidFees || 0)}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Sudah dicairkan</p>
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
                {safeStats.todaysScheduleCount || 0}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {safeStats.upcomingSchedulesCount || 0} jadwal mendatang
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/mua/schedules"
            className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Jadwal</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Lihat agenda</p>
            </div>
          </Link>

          <Link
            href="/mua/projects"
            className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Project</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Tugas riasan</p>
            </div>
          </Link>

          <Link
            href="/mua/fees"
            className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center space-x-3"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Fee Saya</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Riwayat Fee</p>
            </div>
          </Link>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MuaEarningsChart data={earningsTrend} />
          </div>
          <div>
            <ProjectStatusDonutChart statusCounts={statusBreakdown} title="Status Penugasan MUA" />
          </div>
        </div>

        {/* Upcoming Schedules */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                Jadwal Makeup Mendatang
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Daftar penugasan riasan Anda</p>
            </div>
            <Link href="/mua/schedules" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2.5">
                Semua Jadwal <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 space-y-3">
            {safeSchedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Belum ada jadwal riasan yang ditugaskan kepada Anda.
                </p>
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
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-white dark:bg-slate-900 whitespace-nowrap py-0 px-2 h-5 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        {schedule.photo_package?.name || schedule.photoPackage?.name || "Paket Foto"}
                      </Badge>
                      <Badge
                        className="text-[10px] whitespace-nowrap py-0 px-2 h-5"
                        variant={
                          schedule.status === "COMPLETED"  ? "success"     :
                          schedule.status === "SHOOTING"   ? "warning"     :
                          schedule.status === "SCHEDULED"  ? "info"        :
                          schedule.status === "CANCELLED"  ? "destructive" :
                          "secondary"
                        }
                      >
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
                          ? `${schedule.start_time.substring(0, 5)}${schedule.end_time ? ` - ${schedule.end_time.substring(0, 5)}` : ""}`
                          : (schedule.shooting_time?.substring(0, 5) || "-")}
                      </span>
                      {(schedule.location_name || schedule.location_address || schedule.location) && (
                        <span className="flex items-center truncate">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate">
                            {schedule.location_name || schedule.location_address || schedule.location}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                    <Link href={`/mua/schedules/${schedule.id}`} className="block w-full sm:w-auto">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto font-semibold gap-1.5 justify-center bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <Eye className="h-3.5 w-3.5" /> Detail Jadwal
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Fees */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                Riwayat Fee Terbaru
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Rincian honorarium per project yang dikerjakan</p>
            </div>
            <Link href="/mua/fees" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2.5">
                Semua Fee <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 space-y-3">
            {safeFees.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Belum ada catatan fee pengerjaan saat ini.
                </p>
              </div>
            ) : (
              safeFees.map((fee) => (
                <div
                  key={fee.id}
                  className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {fee.project?.project_name || `Project #${fee.project_id}`}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatDate(fee.created_at)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-black text-sm text-slate-900 dark:text-white">
                      {formatRupiah(fee.amount || 0)}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold mt-1 ${
                        fee.payment_status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {fee.payment_status === "PAID" ? (
                        <><CheckCircle2 className="h-2.5 w-2.5 mr-1 inline" />SUDAH CAIR</>
                      ) : (
                        <><AlertCircle className="h-2.5 w-2.5 mr-1 inline" />MENUNGGU</>
                      )}
                    </Badge>
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
