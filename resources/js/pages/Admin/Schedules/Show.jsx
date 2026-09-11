import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { ArrowLeft, MapPin, Clock, Camera, Sparkles, User, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ schedule }) {
  return (
    <AdminLayout title={`Detail Jadwal - ${schedule.customer?.name}`}>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin/schedules">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Detail Jadwal Pemotretan
            </h1>
            <p className="text-xs text-slate-500">Informasi lokasi, waktu, dan tim bertugas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Informasi Jadwal</CardTitle>
              <Badge variant={schedule.status === "COMPLETED" ? "success" : "warning"}>
                {schedule.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Pelanggan</p>
                  <p className="font-bold text-slate-900">{schedule.customer?.name}</p>
                  <p className="text-xs text-slate-500">{schedule.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Paket Foto</p>
                  <p className="font-bold text-slate-900">{schedule.photo_package?.name || "-"}</p>
                  <p className="text-xs text-slate-500">{formatRupiah(schedule.photo_package?.price)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Tanggal</p>
                  <p className="font-semibold text-slate-900">{formatDate(schedule.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium">Waktu Pemotretan</p>
                  <p className="font-semibold text-slate-900">
                    {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                  </p>
                </div>
              </div>

              {/* Location Detail Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{schedule.location_name}</span>
                </div>
                <p className="text-xs text-slate-600 pl-6">{schedule.location_address}</p>
                <div className="pl-6 pt-1 flex items-center space-x-4 text-[11px] text-slate-500 font-mono">
                  <span>Lat: {schedule.latitude}</span>
                  <span>Long: {schedule.longitude}</span>
                  <span>Radius GPS: {schedule.location_radius}m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Assigned */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tim Bertugas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Photographer</p>
                {schedule.project?.photographers?.map((p) => (
                  <div key={p.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">{p.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Make Up Artist (MUA)</p>
                {!schedule.project?.muas || schedule.project.muas.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">— Tidak menggunakan MUA</p>
                ) : (
                  schedule.project.muas.map((m) => (
                    <div key={m.id} className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-900">{m.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
