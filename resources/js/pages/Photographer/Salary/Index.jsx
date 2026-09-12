import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { DollarSign, Clock, CheckCircle2, Filter } from "lucide-react";
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

  const handleFilter = () => {
    setIsFiltering(true);
    router.get(
      "/photographer/salary",
      { status },
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
            <Select value={status || "all"} onValueChange={(val) => setStatus(val === "all" ? "" : val)}>
              <SelectTrigger className="w-full sm:w-56 bg-white text-xs">
                <SelectValue placeholder="Semua Status Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status Pembayaran</SelectItem>
                <SelectItem value="UNPAID">UNPAID (Belum Dibayar)</SelectItem>
                <SelectItem value="PAID">PAID (Sudah Lunas)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" size="sm" onClick={handleFilter}>
              <Filter /> Filter
            </Button>
          </CardContent>
        </Card>

        {/* Table or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} hasActions={false} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Project / Pelanggan</TableHead>
                <TableHead className="font-semibold text-slate-700">Paket</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Gaji Project</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Status Pembayaran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!salaries?.data || salaries.data.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                    Belum ada rekaman gaji penugasan project.
                  </TableCell>
                </TableRow>
              ) : (
                (salaries?.data || []).map((sal) => (
                  <TableRow key={sal.id}>
                    <TableCell>
                      <span className="font-bold text-slate-900 block">{sal.project?.project_name}</span>
                      <span className="text-xs text-slate-500">{sal.project?.customer?.name}</span>
                    </TableCell>

                    <TableCell className="text-slate-700">
                      {sal.project?.photoPackage?.name || sal.project?.package_name || "-"}
                    </TableCell>

                    <TableCell className="text-right font-bold text-slate-900">
                      {formatRupiah(sal.amount)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant={sal.payment_status === "PAID" ? "success" : "warning"}>
                        {sal.payment_status}
                      </Badge>
                      {sal.paid_at && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
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
