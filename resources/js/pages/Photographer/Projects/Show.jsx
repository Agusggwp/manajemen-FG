import React from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Clock, MapPin, DollarSign, Camera, CheckCircle2, User, Package, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ project, mySalary }) {
  const safeProject = project || {};

  return (
    <>
      <Head title={`Detail Project - ${safeProject.project_name || ""}`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/photographer/projects" className="shrink-0">
              <Button variant="outline" size="icon" className="h-9 w-9 bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                {safeProject.project_code}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {safeProject.project_name}
              </h1>
            </div>
          </div>
          <Badge
            className="self-start sm:self-auto text-xs py-1 px-2.5 h-6"
            variant={
              safeProject.status === "COMPLETED" ? "success" :
              safeProject.status === "SHOOTING" ? "warning" :
              safeProject.status === "SCHEDULED" ? "info" :
              safeProject.status === "CANCELLED" ? "destructive" :
              "secondary"
            }
          >
            {getStatusLabel(safeProject.status)}
          </Badge>
        </div>

        {/* Own Salary Card */}
        {mySalary && (
          <Card className="border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Gaji Project Saya
                </p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(mySalary.amount)}
                </p>
              </div>
              <Badge
                variant={mySalary.payment_status === "PAID" ? "success" : "warning"}
                className="text-xs px-2.5 py-0.5"
              >
                {mySalary.payment_status === "PAID" ? "DIBAYAR (PAID)" : "BELUM DIBAYAR (UNPAID)"}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Project Info Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Informasi Project
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" /> Pelanggan
                </span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {safeProject.customer?.name || "-"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {safeProject.customer?.phone || "-"}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" /> Paket Foto
                </span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {safeProject.package_name || "-"}
                </p>
                {safeProject.category && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kategori: {safeProject.category}
                  </p>
                )}
              </div>
            </div>

            {/* Durasi Kerja */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Durasi Kerja Project:
                </span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {safeProject.formatted_work_duration || "-"}
              </span>
            </div>

            {/* Lokasi */}
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm">
                <MapPin className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{safeProject.location_name || "-"}</span>
              </div>
              {safeProject.location_address && (
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-6">
                  {safeProject.location_address}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
