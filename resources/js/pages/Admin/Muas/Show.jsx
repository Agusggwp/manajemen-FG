import React from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Sparkles, Phone, Mail, MapPin, Calendar, CheckCircle2, Wallet } from "lucide-react";
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

export default function Show({ mua }) {
  return (
    <>
      <Head title={`Detail MUA - ${mua.name}`} />
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin/muas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{mua.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Histori Penugasan & Gaji Project</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MUA Details Card */}
          <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900 md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" /> Profil MUA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Spesialisasi</p>
                <p className="font-semibold text-slate-900 dark:text-white">{mua.specialty || "Tata Rias Umum"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Gaji Standar</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 text-base">{formatRupiah(mua.default_fee || 0)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase">Status</p>
                <Badge variant={mua.status === "ACTIVE" ? "success" : "secondary"}>
                  {mua.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <div className="pt-2 border-t border-border dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span>{mua.phone}</span>
                </div>
                {mua.email && (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{mua.email}</span>
                  </div>
                )}
                {mua.address && (
                  <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                    <span>{mua.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project History */}
          <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Histori Project & Pembayaran Gaji ({mua.projects?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                  <TableRow className="border-border dark:border-slate-800">
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Tanggal</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Project / Pelanggan</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Paket</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Gaji MUA</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Status Gaji</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!mua.projects || mua.projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-slate-400 dark:text-slate-500">
                        Belum ada histori penugasan project untuk MUA ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mua.projects.map((prj) => {
                      const feeRecord = mua.project_fees?.find(f => f.project_id === prj.id);
                      return (
                        <TableRow key={prj.id} className="border-border dark:border-slate-800">
                          <TableCell className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {formatDate(prj.date)}
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-slate-900 dark:text-white block">{prj.project_name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{prj.customer?.name}</span>
                          </TableCell>
                          <TableCell className="text-slate-800 dark:text-slate-200">{prj.package_name}</TableCell>
                          <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                            {feeRecord ? formatRupiah(feeRecord.amount) : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {feeRecord ? (
                              <Badge variant={feeRecord.payment_status === "PAID" ? "success" : "warning"}>
                                {feeRecord.payment_status === "PAID" ? "Lunas" : "Belum Bayar"}
                              </Badge>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
