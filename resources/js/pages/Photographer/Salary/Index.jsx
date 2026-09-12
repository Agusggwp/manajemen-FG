import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { DollarSign, Clock, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Index({ salaries = { data: [] }, unpaidTotal = 0, paidTotal = 0, filters = {} }) {
  const safeFilters = filters || {};
  const [status, setStatus] = useState(safeFilters.status || "");

  const handleFilter = () => {
    router.get("/photographer/salary", { status }, { preserveState: true });
  };

  return (
    <>
      <Head title="Gaji Saya" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gaji & Honor Saya (Per Project)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rincian gaji penugasan project dan status pelunasan dari Admin.
          </p>
        </div>

        {/* Totals Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-800 uppercase">Belum Dibayar (UNPAID)</p>
                <p className="text-2xl font-bold text-amber-950 mt-1">{formatRupiah(unpaidTotal)}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-60" />
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800 uppercase">Sudah Lunas (PAID)</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">{formatRupiah(paidTotal)}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="border-slate-200">
          <CardContent className="pt-4 pb-4 flex gap-2 items-center">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
            >
              <option value="">Semua Status Pembayaran</option>
              <option value="UNPAID">UNPAID (Belum Dibayar)</option>
              <option value="PAID">PAID (Sudah Lunas)</option>
            </select>
            <Button variant="secondary" size="sm" onClick={handleFilter}>
              <Filter className="h-3.5 w-3.5 mr-1" /> Filter
            </Button>
          </CardContent>
        </Card>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Project / Pelanggan</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3 text-right">Gaji Project</th>
                <th className="px-4 py-3 text-center">Status Pembayaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!salaries?.data || salaries.data.length === 0) ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    Belum ada rekaman gaji penugasan project.
                  </td>
                </tr>
              ) : (
                (salaries?.data || []).map((sal) => (
                  <tr key={sal.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{sal.project?.project_name}</span>
                      <span className="text-xs text-slate-500">{sal.project?.customer?.name}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {sal.project?.photoPackage?.name || sal.project?.package_name || "-"}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {formatRupiah(sal.amount)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={sal.payment_status === "PAID" ? "success" : "warning"}>
                        {sal.payment_status}
                      </Badge>
                      {sal.paid_at && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Lunas pada: {formatDate(sal.paid_at)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
