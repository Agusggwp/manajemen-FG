import React from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Camera,
  Sparkles,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { usePageLoading, DashboardPageSkeleton } from "@/components/loading/PageSkeletons";
import {
  RevenueTrendChart,
  PackagePerformanceBarChart,
  ProjectStatusDonutChart,
} from "@/components/charts/DashboardCharts";

export default function Dashboard({
  stats = {},
  recentSchedules = [],
  pendingProofs = [],
  revenueTrend = [],
  packagePerformance = [],
}) {
  const isNavigating = usePageLoading();
  const safeStats = stats || {};
  const safeSchedules = Array.isArray(recentSchedules) ? recentSchedules : (recentSchedules?.data || []);
  const safeProofs = Array.isArray(pendingProofs) ? pendingProofs : (pendingProofs?.data || []);

  if (isNavigating) {
    return (
      <>
        <Head title="Dashboard Admin" />
        <DashboardPageSkeleton />
      </>
    );
  }

  return (
    <>
      <Head title="Dashboard Admin" />
      <div className="space-y-8">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ringkasan operasional dan keuangan Photography Management System ARTDEVATA.
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 dark:bg-slate-900 text-white shadow-sm border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(safeStats.totalRevenue || 0)}</div>
              <p className="text-xs text-slate-400 mt-1">Dari project selesai</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Biaya (Cost)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatRupiah(safeStats.totalCost || 0)}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gaji + Fee MUA + Operasional</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Profit Bersih
              </CardTitle>
              <Badge variant={(safeStats.totalProfit || 0) >= 0 ? "success" : "destructive"}>
                Margin {safeStats.margin || 0}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(safeStats.totalProfit || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {formatRupiah(safeStats.totalProfit || 0)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {(safeStats.totalProfit || 0) >= 0 ? "Keuntungan Aktual" : "Status Rugi Operational"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Belum Dibayar
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {formatRupiah((safeStats.unpaidPhotographerSalaries || 0) + (safeStats.unpaidMuaFees || 0))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gaji: {formatRupiah(safeStats.unpaidPhotographerSalaries || 0)} | MUA: {formatRupiah(safeStats.unpaidMuaFees || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <Calendar className="h-5 w-5 text-slate-700 dark:text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Jadwal Hari Ini</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{safeStats.todaysScheduleCount || 0}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Berlangsung</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{safeStats.ongoingProjectsCount || 0}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Butuh Validasi</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{safeStats.waitingValidationCount || 0}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Selesai</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{safeStats.completedProjectsCount || 0}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <Users className="h-5 w-5 text-slate-700 dark:text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pelanggan</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{safeStats.totalCustomers || 0}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <Camera className="h-5 w-5 text-slate-700 dark:text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Fotografer</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{safeStats.totalPhotographers || 0}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
            <Sparkles className="h-5 w-5 text-slate-700 dark:text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">MUA</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{safeStats.totalMuas || 0}</p>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueTrendChart data={revenueTrend} />
          </div>
          <div>
            <ProjectStatusDonutChart statusCounts={safeStats.statusCounts} title="Status Seluruh Project" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <PackagePerformanceBarChart data={packagePerformance} />
          </div>
        </div>

        {/* Section: Actionable Pending Proof Validation */}
        {safeProofs.length > 0 && (
          <Card className="border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Menunggu Validasi Bukti Pemotretan ({safeProofs.length})
                </CardTitle>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Fotografer telah mengirimkan foto lokasi & GPS untuk diverifikasi.
                </p>
              </div>
              <Link href="/admin/proofs">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/40">
                  <span>Lihat Semua Proof</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeProofs.map((proof) => (
                  <div key={proof.id} className="bg-card dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="warning" className="uppercase font-bold">
                        {proof.type} PROOF
                      </Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Jarak: {proof.distance_from_location}m
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {proof.photographer?.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Pelanggan: {proof.schedule?.customer?.name || "-"}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <Link href="/admin/proofs">
                        <Button size="xs" className="gap-1.5 font-semibold">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Validasi Sekarang</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section: Recent Schedules */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
              Jadwal Terbaru
            </CardTitle>
            <Link href="/admin/schedules">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                <span>Semua Jadwal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/80">
                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Tanggal & Jam</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Pelanggan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Paket Foto</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Lokasi Pemotretan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-400 dark:text-slate-500">
                      Belum ada data jadwal pemotretan.
                    </TableCell>
                  </TableRow>
                ) : (
                  safeSchedules.map((schedule) => (
                    <TableRow key={schedule.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <TableCell className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {formatDate(schedule.date)} <br />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {schedule.start_time} - {schedule.end_time}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                        {schedule.customer?.name}
                      </TableCell>
                      <TableCell className="text-slate-800 dark:text-slate-200">
                        {schedule.photo_package?.name || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={schedule.location_address}>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{schedule.location_name}</span>
                        <br />
                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate block">{schedule.location_address}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            schedule.status === "COMPLETED"
                              ? "success"
                              : schedule.status === "SHOOTING"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {getStatusLabel(schedule.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
