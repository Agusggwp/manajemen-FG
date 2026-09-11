import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Sparkles, Phone, Mail, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ mua }) {
  return (
    <AdminLayout title={`Detail MUA - ${mua.name}`}>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link href="/admin/muas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{mua.name}</h1>
            <p className="text-xs text-slate-500">Histori Penugasan & Fee Project</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MUA Details Card */}
          <Card className="border-slate-200 md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" /> Profil MUA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Spesialisasi</p>
                <p className="font-semibold text-slate-900">{mua.specialty || "General Makeup"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Status</p>
                <Badge variant={mua.status === "ACTIVE" ? "success" : "secondary"}>
                  {mua.status}
                </Badge>
              </div>
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{mua.phone}</span>
                </div>
                {mua.email && (
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{mua.email}</span>
                  </div>
                )}
                {mua.address && (
                  <div className="flex items-start space-x-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{mua.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Project History */}
          <Card className="border-slate-200 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Histori Project & Pembayaran Fee ({mua.projects?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Project / Pelanggan</th>
                      <th className="px-4 py-3">Paket</th>
                      <th className="px-4 py-3 text-right">Fee MUA</th>
                      <th className="px-4 py-3 text-center">Status Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!mua.projects || mua.projects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-slate-400">
                          Belum ada histori penugasan project untuk MUA ini.
                        </td>
                      </tr>
                    ) : (
                      mua.projects.map((prj) => {
                        const feeRecord = mua.project_fees?.find(f => f.project_id === prj.id);
                        return (
                          <tr key={prj.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                              {formatDate(prj.date)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-900 block">{prj.project_name}</span>
                              <span className="text-xs text-slate-500">{prj.customer?.name}</span>
                            </td>
                            <td className="px-4 py-3">{prj.package_name}</td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                              {feeRecord ? formatRupiah(feeRecord.amount) : "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {feeRecord ? (
                                <Badge variant={feeRecord.payment_status === "PAID" ? "success" : "warning"}>
                                  {feeRecord.payment_status}
                                </Badge>
                              ) : (
                                <span className="text-xs text-slate-400">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
