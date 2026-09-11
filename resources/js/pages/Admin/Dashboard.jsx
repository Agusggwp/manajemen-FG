import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Link } from "@inertiajs/react";
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

export default function Dashboard({ stats = {}, recentSchedules = [], pendingProofs = [] }) {
  const safeStats = stats || {};
  const safeSchedules = Array.isArray(recentSchedules) ? recentSchedules : (recentSchedules?.data || []);
  const safeProofs = Array.isArray(pendingProofs) ? pendingProofs : (pendingProofs?.data || []);
  return (
    <AdminLayout title="Dashboard Admin">
      <div className="space-y-8">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan operasional dan keuangan Photography Management System ARTDEVATA.
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white shadow-sm border-slate-800">
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

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Biaya (Cost)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatRupiah(safeStats.totalCost || 0)}</div>
              <p className="text-xs text-slate-500 mt-1">Gaji + Fee MUA + Operasional</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Profit Bersih
              </CardTitle>
              <Badge variant={(safeStats.totalProfit || 0) >= 0 ? "success" : "destructive"}>
                Margin {safeStats.margin || 0}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(safeStats.totalProfit || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatRupiah(safeStats.totalProfit || 0)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {(safeStats.totalProfit || 0) >= 0 ? "Keuntungan Aktual" : "Status Rugi Operational"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Belum Dibayar
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {formatRupiah((safeStats.unpaidPhotographerSalaries || 0) + (safeStats.unpaidMuaFees || 0))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Gaji: {formatRupiah(safeStats.unpaidPhotographerSalaries || 0)} | MUA: {formatRupiah(safeStats.unpaidMuaFees || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Calendar className="h-5 w-5 text-slate-700 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">Jadwal Hari Ini</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{safeStats.todaysScheduleCount || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">Berlangsung</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{safeStats.ongoingProjectsCount || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <ShieldCheck className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">Butuh Validasi</p>
            <p className="text-xl font-bold text-indigo-600 mt-0.5">{safeStats.waitingValidationCount || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">Selesai</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{safeStats.completedProjectsCount || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Users className="h-5 w-5 text-slate-700 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">Pelanggan</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{safeStats.totalCustomers || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <Camera className="h-5 w-5 text-slate-700 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">Photographer</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{safeStats.totalPhotographers || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
            <Sparkles className="h-5 w-5 text-slate-700 mx-auto mb-1" />
            <p className="text-xs font-medium text-slate-500">MUA</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{safeStats.totalMuas || 0}</p>
          </div>
        </div>

        {/* Section: Actionable Pending Proof Validation */}
        {safeProofs.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                  Menunggu Validasi Bukti Pemotretan ({safeProofs.length})
                </CardTitle>
                <p className="text-xs text-amber-700 mt-0.5">
                  Photographer telah mengirimkan foto lokasi & GPS untuk diverifikasi.
                </p>
              </div>
              <Link href="/admin/proofs">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100">
                  Lihat Semua Proof <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeProofs.map((proof) => (
                  <div key={proof.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="warning" className="uppercase font-bold">
                        {proof.type} PROOF
                      </Badge>
                      <span className="text-xs text-slate-500 font-mono">
                        Jarak: {proof.distance_from_location}m
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {proof.photographer?.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      Pelanggan: {proof.schedule?.customer?.name || "-"}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <Link href="/admin/proofs">
                        <Button size="sm" className="bg-slate-900 text-white text-xs">
                          Validasi Sekarang
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
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900">
              Jadwal Terbaru
            </CardTitle>
            <Link href="/admin/schedules">
              <Button size="sm" variant="outline">
                Semua Jadwal <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tanggal & Jam</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Paket Foto</th>
                    <th className="px-4 py-3">Lokasi Pemotretan</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400">
                        Belum ada data jadwal pemotretan.
                      </td>
                    </tr>
                  ) : (
                    safeSchedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                          {formatDate(schedule.date)} <br />
                          <span className="text-xs text-slate-400">
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {schedule.customer?.name}
                        </td>
                        <td className="px-4 py-3">
                          {schedule.photo_package?.name || "-"}
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate" title={schedule.location_address}>
                          <span className="font-medium text-slate-800">{schedule.location_name}</span>
                          <br />
                          <span className="text-xs text-slate-400 truncate block">{schedule.location_address}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              schedule.status === "COMPLETED"
                                ? "success"
                                : schedule.status === "SHOOTING"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {schedule.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
