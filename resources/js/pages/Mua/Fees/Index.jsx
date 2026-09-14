import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import {
  DollarSign,
  Search,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Eye,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({
  fees = { data: [] },
  summary = { totalFee: 0, paidFee: 0, unpaidFee: 0 },
  filters = {},
}) {
  const safeFilters = filters || {};
  const isNavigating = usePageLoading();
  const [search, setSearch] = useState(safeFilters.search || "");
  const [status, setStatus] = useState(safeFilters.status || "ALL");

  const handleFilter = (e) => {
    e.preventDefault();
    router.get(
      "/mua/fees",
      {
        search: search || undefined,
        status: status !== "ALL" ? status : undefined,
      },
      { preserveState: true }
    );
  };

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    router.get("/mua/fees", {}, { preserveState: true });
  };

  return (
    <>
      <Head title="Fee Saya" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Riwayat Honor & Fee MUA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Catatan penerimaan honorarium rias per project yang telah selesai/ditugaskan.
          </p>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-pink-600 to-rose-700 text-white shadow-md border-0">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-pink-100 uppercase tracking-wider flex items-center justify-between">
                <span>Total Akumulasi Fee</span>
                <Sparkles className="h-4 w-4 text-pink-200" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-white">
                {formatRupiah(summary.totalFee || 0)}
              </p>
              <p className="text-[11px] text-pink-100/90 mt-0.5 font-medium">Seluruh project</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Sudah Dicairkan</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {formatRupiah(summary.paidFee || 0)}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Status PAID</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Menunggu Pencairan</span>
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {formatRupiah(summary.unpaidFee || 0)}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Status UNPAID</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4">
            <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cari Kode / Nama Project</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Ketik kode atau nama project..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 bg-white dark:bg-slate-950 text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status Pembayaran</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-pink-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PAID">PAID (Sudah Dibayar)</option>
                  <option value="UNPAID">UNPAID (Belum Dibayar)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="sm" className="bg-pink-600 hover:bg-pink-700 text-white flex-1 h-9 text-xs">
                  Filter
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleReset} className="h-9 text-xs">
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Fees Table */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs overflow-hidden">
          <CardContent className="p-0">
            {isNavigating ? (
              <div className="p-6">
                <CardGridSkeleton count={3} />
              </div>
            ) : !fees?.data || fees.data.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <DollarSign className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="font-semibold text-sm">Tidak ada riwayat fee yang ditemukan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      <th className="py-3 px-4">Tanggal Project</th>
                      <th className="py-3 px-4">Project & Klien</th>
                      <th className="py-3 px-4">Paket Foto</th>
                      <th className="py-3 px-4">Besaran Fee</th>
                      <th className="py-3 px-4">Status Pencairan</th>
                      <th className="py-3 px-4">Info Pembayaran</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {fees.data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {formatDate(item.project?.date || item.created_at)}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {item.project?.project_name || `Project #${item.project_id}`}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.project?.project_code} • {item.project?.customer?.name}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {item.project?.photo_package?.name || item.project?.package_name || "-"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {formatRupiah(item.amount || 0)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${
                              item.payment_status === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                            }`}
                          >
                            {item.payment_status === "PAID" ? "SUDAH CAIR" : "MENUNGGU"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {item.paid_at ? (
                            <div>
                              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                                {formatDate(item.paid_at)}
                              </p>
                              {item.payment_method && (
                                <p className="text-[10px]">{item.payment_method}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {item.project_id && (
                            <Link href={`/mua/projects/${item.project_id}`}>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 gap-1 px-2">
                                <Eye className="h-3.5 w-3.5" />
                                <span>Project</span>
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
