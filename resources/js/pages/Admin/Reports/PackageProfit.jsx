import React, { useState, useRef } from "react";
import { formatRupiah } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { TrendingUp, DollarSign, PieChart, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function PackageProfit({ reportData, summary, filters, categories }) {
  const safeReportData = Array.isArray(reportData) ? reportData : [];
  const safeSummary = summary || {};
  const safeFilters = filters || {};
  const safeCategories = Array.isArray(categories) ? categories : [];

  const isNavigating = usePageLoading();
  const [isFiltering, setIsFiltering] = useState(false);
  const [startDate, setStartDate] = useState(safeFilters.start_date || "");
  const [endDate, setEndDate] = useState(safeFilters.end_date || "");
  const [category, setCategory] = useState(safeFilters.category || "");
  const debounceRef = useRef(null);

  const doFilter = (newStart, newEnd, newCat) => {
    setIsFiltering(true);
    router.get(
      "/admin/reports/package-profit",
      { start_date: newStart, end_date: newEnd, category: newCat },
      {
        preserveState: true,
        onFinish: () => setIsFiltering(false),
      }
    );
  };

  const handleStartDate = (e) => {
    const val = e.target.value;
    setStartDate(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doFilter(val, endDate, category), 300);
  };

  const handleEndDate = (e) => {
    const val = e.target.value;
    setEndDate(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doFilter(startDate, val, category), 300);
  };

  const handleCategoryChange = (val) => {
    const newCat = val === "all" ? "" : val;
    setCategory(newCat);
    doFilter(startDate, endDate, newCat);
  };

  const isLoading = isNavigating || isFiltering;

  return (
    <>
      <Head title="Laporan Keuntungan Paket Foto" />
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Laporan Keuntungan Paket Foto
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
              Analisis perbandingan pendapatan, total biaya aktual, dan keuntungan per paket foto ARTDEVATA.
            </p>
          </div>
          <a
            href={`/admin/reports/package-profit/export-csv?start_date=${startDate}&end_date=${endDate}&category=${category}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0"
          >
            <Button size="sm" className="font-semibold gap-1.5 text-xs w-full sm:w-auto h-10 shadow-xs">
              <Download className="h-4 w-4" />
              <span>Unduh Laporan CSV</span>
            </Button>
          </a>
        </div>

        {/* Filters */}
        <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={handleStartDate}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tanggal Selesai</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={handleEndDate}
                  className="w-full text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kategori Paket</label>
                <Select value={category || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {safeCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-slate-900 dark:bg-slate-900 text-white shadow-2xs border-slate-800">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-lg sm:text-xl font-bold">{formatRupiah(safeSummary.total_revenue || 0)}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{safeSummary.total_projects || 0} Project Selesai</p>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-slate-900 border-border dark:border-slate-800 shadow-2xs">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Biaya Aktual</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{formatRupiah(safeSummary.total_cost || 0)}</div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Gaji & Biaya Operasional</p>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-slate-900 border-border dark:border-slate-800 shadow-2xs">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Keuntungan</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className={`text-lg sm:text-xl font-bold ${(safeSummary.total_profit || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {formatRupiah(safeSummary.total_profit || 0)}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Laba Bersih Project</p>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-slate-900 border-border dark:border-slate-800 shadow-2xs">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rata-Rata Margin</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{safeSummary.total_margin || 0}%</div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Rasio Keuntungan</p>
            </CardContent>
          </Card>
        </div>

        {/* Per Package Profitability Comparison Table or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={8} hasActions={false} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                <TableRow className="border-border dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Nama Paket Foto</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">MUA</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Jumlah Project</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Total Pendapatan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Total Biaya</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Total Keuntungan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Rata-rata / Project</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeReportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400 dark:text-slate-500">
                      Tidak ada data profitabilitas paket foto.
                    </TableCell>
                  </TableRow>
                ) : (
                  safeReportData.map((row) => (
                    <TableRow key={row.package_id} className="border-border dark:border-slate-800">
                      <TableCell className="font-bold text-slate-900 dark:text-white">
                        {row.package_name}
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-normal block">{row.category}</span>
                      </TableCell>

                      <TableCell className="text-center">
                        {row.includes_mua ? (
                          <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-[10px]">
                            MUA
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center font-bold text-slate-900 dark:text-white">
                        {row.project_count}
                      </TableCell>

                      <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                        {formatRupiah(row.total_revenue)}
                      </TableCell>

                      <TableCell className="text-right font-medium text-slate-600 dark:text-slate-300">
                        {formatRupiah(row.total_cost)}
                      </TableCell>

                      <TableCell className="text-right font-bold">
                        {row.total_profit >= 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">{formatRupiah(row.total_profit)}</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">RUGI {formatRupiah(row.total_profit)}</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-medium text-slate-800 dark:text-slate-200">
                        {formatRupiah(row.avg_profit)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={row.avg_margin >= 35 ? "success" : row.avg_margin > 0 ? "warning" : "destructive"}>
                          {row.avg_margin}%
                        </Badge>
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
