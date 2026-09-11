import React from "react";
import PhotographerLayout from "@/layouts/PhotographerLayout";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { Calendar, FolderKanban, Clock, CheckCircle2, DollarSign, Camera, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Dashboard({ stats = {}, recentSchedules = [], recentProofs = [] }) {
  const safeStats = stats || {};
  const safeSchedules = Array.isArray(recentSchedules) ? recentSchedules : (recentSchedules?.data || []);
  return (
    <PhotographerLayout title="Dashboard Photographer">
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
              <div className="text-xl font-bold">{formatRupiah(safeStats.monthlyEarnings || 0)}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Total gaji penugasan project</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-amber-800 uppercase">
                Gaji Belum Dibayar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-xl font-bold text-amber-950">{formatRupiah(safeStats.unpaidSalary || 0)}</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-emerald-800 uppercase">
                Sudah Lunas Dibayar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-xl font-bold text-emerald-950">{formatRupiah(safeStats.paidSalary || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <Calendar className="h-4 w-4 text-slate-700 mx-auto mb-1" />
            <p className="text-[11px] font-medium text-slate-500">Jadwal Hari Ini</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{safeStats.todaysScheduleCount || 0}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <FolderKanban className="h-4 w-4 text-slate-700 mx-auto mb-1" />
            <p className="text-[11px] font-medium text-slate-500">Project Saya</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{safeStats.myProjectsCount || 0}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <Clock className="h-4 w-4 text-amber-600 mx-auto mb-1" />
            <p className="text-[11px] font-medium text-slate-500">Berlangsung</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{safeStats.ongoingCount || 0}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <p className="text-[11px] font-medium text-slate-500">Selesai</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{safeStats.completedCount || 0}</p>
          </div>
        </div>

        {/* Actionable Today's & Assigned Schedules List */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-semibold">Jadwal Pemotretan Saya</CardTitle>
            <Link href="/photographer/schedules">
              <Button size="sm" variant="outline" className="text-xs">
                Lihat Semua <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {safeSchedules.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada penugasan jadwal.</p>
            ) : (
              safeSchedules.map((sch) => (
                <div key={sch.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{sch.customer?.name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {sch.photo_package?.name}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center space-x-3">
                      <span>📅 {formatDate(sch.date)}</span>
                      <span>⏰ {sch.start_time?.substring(0, 5)} - {sch.end_time?.substring(0, 5)}</span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span>{sch.location_name} ({sch.location_address})</span>
                    </div>
                  </div>

                  <div>
                    <Link href={`/photographer/schedules/${sch.id}`}>
                      <Button size="sm" className="bg-slate-900 text-white w-full sm:w-auto text-xs">
                        Buka Jadwal & Kirim Proof
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PhotographerLayout>
  );
}
