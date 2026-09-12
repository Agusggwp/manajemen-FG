import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { TrendingUp, Filter, DollarSign, PieChart, Sparkles, Download } from "lucide-react";
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

export default function PackageProfit({ reportData, summary, filters, categories }) {
  const safeReportData = Array.isArray(reportData) ? reportData : [];
  const safeSummary = summary || {};
  const safeFilters = filters || {};
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [startDate, setStartDate] = useState(safeFilters.start_date || "");
  const [endDate, setEndDate] = useState(safeFilters.end_date || "");
  const [category, setCategory] = useState(safeFilters.category || "");

  const handleFilter = () => {
    router.get(
      "/admin/reports/package-profit",
      {
        start_date: startDate,
        end_date: endDate,
        category: category,
      },
      { preserveState: true }
    );
  };

  return (
    <>
      <Head title="Laporan Profitability Paket" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Laporan Profitability Paket Foto
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Analisis perbandingan revenue, total cost aktual, dan profit per paket foto ARTDEVATA.
            </p>
          </div>
          <a
            href={`/admin/reports/package-profit/export-csv?start_date=${startDate}&end_date=${endDate}&category=${category}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Download /> Unduh Laporan CSV
            </Button>
          </a>
        </div>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-slate-600">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-slate-600">Tanggal Selesai</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-slate-600">Kategori Paket</label>
                <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? "" : val)}>
                  <SelectTrigger className="w-full bg-white">
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

              <Button variant="secondary" onClick={handleFilter}>
                <Filter /> Terapkan Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white shadow-sm border-slate-800">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-xl font-bold">{formatRupiah(safeSummary.total_revenue || 0)}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{safeSummary.total_projects || 0} Project Selesai</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Total Cost Aktual</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-xl font-bold text-slate-900">{formatRupiah(safeSummary.total_cost || 0)}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Total Profit</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className={`text-xl font-bold ${(safeSummary.total_profit || 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatRupiah(safeSummary.total_profit || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Rata-Rata Margin</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-xl font-bold text-slate-900">{safeSummary.total_margin || 0}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Per Package Profitability Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Nama Paket Foto</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">MUA</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Jumlah Project</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Total Revenue</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Total Cost</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Total Profit</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Avg Profit / Project</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Avg Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeReportData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                    Tidak ada data profitabilitas paket foto.
                  </TableCell>
                </TableRow>
              ) : (
                safeReportData.map((row) => (
                  <TableRow key={row.package_id}>
                    <TableCell className="font-bold text-slate-900">
                      {row.package_name}
                      <span className="text-xs text-slate-400 font-normal block">{row.category}</span>
                    </TableCell>

                    <TableCell className="text-center">
                      {row.includes_mua ? (
                        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 text-[10px]">
                          MUA
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center font-bold text-slate-900">
                      {row.project_count}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-slate-900">
                      {formatRupiah(row.total_revenue)}
                    </TableCell>

                    <TableCell className="text-right font-medium text-slate-600">
                      {formatRupiah(row.total_cost)}
                    </TableCell>

                    <TableCell className="text-right font-bold">
                      {row.total_profit >= 0 ? (
                        <span className="text-emerald-600">{formatRupiah(row.total_profit)}</span>
                      ) : (
                        <span className="text-red-600">RUGI {formatRupiah(row.total_profit)}</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right font-medium text-slate-800">
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
      </div>
    </>
  );
}
