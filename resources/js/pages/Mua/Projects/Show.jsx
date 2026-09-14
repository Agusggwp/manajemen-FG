import React from "react";
import { formatDate, getStatusLabel, formatRupiah } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import {
  FolderKanban,
  Calendar,
  MapPin,
  ArrowLeft,
  DollarSign,
  Camera,
  User,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ project = {} }) {
  const customer = project.customer || {};
  const photoPackage = project.photo_package || {};
  const photographers = project.photographers || [];
  const muaFees = project.mua_fees || [];
  const schedule = project.schedule || {};

  return (
    <>
      <Head title={`Project: ${project.project_name || "Detail"}`} />
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/mua/projects">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Project</span>
            </Button>
          </Link>
          <Badge
            className="text-xs uppercase font-bold"
            variant={
              project.status === "COMPLETED" || project.status === "DELIVERED" ? "success" :
              project.status === "SHOOTING" || project.status === "EDITING" ? "warning" :
              project.status === "SCHEDULED" ? "info" :
              project.status === "CANCELLED" ? "destructive" : "secondary"
            }
          >
            {getStatusLabel(project.status)}
          </Badge>
        </div>

        {/* Hero Card */}
        <div className="bg-card dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
                {project.project_code}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {project.project_name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Paket: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.package_name || photoPackage.name}</span>
              </p>
            </div>

            {schedule.id && (
              <Link href={`/mua/schedules/${schedule.id}`}>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white gap-1.5 text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Lihat Jadwal Terkait</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Location */}
          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                <span>Informasi Klien & Lokasi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Nama Klien</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{customer.name || "-"}</p>
                {customer.phone && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{customer.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Tanggal Pelaksanaan</span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                  {formatDate(project.date)}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Lokasi Pemotretan</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span>{project.location_name || "-"}</span>
                </p>
                {project.location_address && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pl-4.5">
                    {project.location_address}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* MUA Fee & Assigned Team */}
          <div className="space-y-6">
            {/* Fee Card */}
            <Card className="border-pink-200 dark:border-pink-900/50 bg-pink-50/20 dark:bg-pink-950/20 shadow-2xs">
              <CardHeader className="p-5 pb-3 border-b border-pink-100 dark:border-pink-900/40">
                <CardTitle className="text-sm sm:text-base font-bold text-pink-950 dark:text-pink-200 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span>Fee MUA Project Ini</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {muaFees.length === 0 ? (
                  <p className="text-xs text-slate-500">Data fee belum dialokasikan oleh Admin.</p>
                ) : (
                  muaFees.map((fee) => (
                    <div key={fee.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase">Besaran Honor</span>
                        <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                          {formatRupiah(fee.amount || 0)}
                        </p>
                        {fee.paid_at && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                            Dibayar pada {formatDate(fee.paid_at)}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold ${
                          fee.payment_status === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                        }`}
                      >
                        {fee.payment_status === "PAID" ? "SUDAH CAIR" : "MENUNGGU PENCAIRAN"}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Photographers Card */}
            <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
              <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="h-4 w-4 text-indigo-500" />
                  <span>Tim Fotografer Bertugas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {photographers.length === 0 ? (
                  <p className="text-xs text-slate-400">Belum ada fotografer yang ditugaskan.</p>
                ) : (
                  <div className="space-y-2">
                    {photographers.map((photo) => (
                      <div key={photo.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{photo.name}</span>
                        {photo.phone && (
                          <a
                            href={`https://wa.me/${photo.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <Phone className="h-3 w-3" />
                            <span>WA</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
