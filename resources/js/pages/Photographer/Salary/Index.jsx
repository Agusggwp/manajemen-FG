import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ salaries = { data: [] }, unpaidTotal = 0, paidTotal = 0, filters = {} }) {
  const safeFilters = filters || {};
  const isNavigating = usePageLoading();
  const [isFiltering, setIsFiltering] = useState(false);
  const [status, setStatus] = useState(safeFilters.status || "");

  const handleStatusChange = (val) => {
    const newStatus = val === "all" ? "" : val;
    setStatus(newStatus);
    setIsFiltering(true);
    router.get(
      "/photographer/salary",
      { status: newStatus },
      {
        preserveState: true,
        onFinish: () => setIsFiltering(false),
      }
    );
  };

  const isLoading = isNavigating || isFiltering;

  return (
    <>
      <Head title="Gaji Saya" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gaji Saya (Per Project)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Rincian gaji penugasan project dan status pelunasan dari Admin.
          </p>
        </div>

        {/* Totals Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase">Belum Dibayar (UNPAID)</p>
                <p className="text-2xl font-bold text-amber-950 dark:text-amber-300 mt-1">{formatRupiah(unpaidTotal)}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-60" />
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase">Sudah Lunas (PAID)</p>
                <p className="text-2xl font-bold text-emerald-950 dark:text-emerald-300 mt-1">{formatRupiah(paidTotal)}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="pt-4 pb-4 flex gap-2 items-center">
            <Select value={status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-56 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-foreground text-xs">
                <SelectValue placeholder="Semua Status Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status Pembayaran</SelectItem>
                <SelectItem value="UNPAID">UNPAID (Belum Dibayar)</SelectItem>
                <SelectItem value="PAID">PAID (Sudah Lunas)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} hasActions={false} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Project / Pelanggan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Paket</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Gaji Project</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Status Pembayaran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!salaries?.data || salaries.data.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400 dark:text-slate-500">
                      Belum ada rekaman gaji penugasan project.
                    </TableCell>
                  </TableRow>
                ) : (
                  (salaries?.data || []).map((sal) => (
                    <TableRow key={sal.id} className="border-b border-slate-100 dark:border-slate-800/60">
                      <TableCell>
                        <span className="font-bold text-slate-900 dark:text-white block">{sal.project?.project_name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{sal.project?.customer?.name}</span>
                      </TableCell>

                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {sal.project?.photoPackage?.name || sal.project?.package_name || "-"}
                      </TableCell>

                      <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                        {formatRupiah(sal.amount)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={sal.payment_status === "PAID" ? "success" : "warning"}>
                          {sal.payment_status}
                        </Badge>
                        {sal.paid_at && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                            Lunas pada: {formatDate(sal.paid_at)}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
