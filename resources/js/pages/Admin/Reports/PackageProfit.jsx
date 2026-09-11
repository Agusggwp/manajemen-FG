import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatRupiah } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { TrendingUp, Filter, DollarSign, PieChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PackageProfit({ reportData, summary, filters, categories }) {
  const safeReportData = Array.isArray(reportData) ? reportData : [];
  const safeSummary = summary || {};
  const safeFilters = filters || {};
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [startDate, setStartDate] = useState(safeFilters.start_date || "");
  const [endDate, setEndDate] = useState(safeFilters.end_date || "");
  const [category, setCategory] = useState(safeFilters.category || "");

  const handleFilter = () => {
    router.get("/admin/reports/package-profit", {
      start_date: startDate,
      end_date: endDate,
      category,
    }, { preserveState: true });
  };

  return (
    <AdminLayout title="Laporan Profit Per Paket">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Profitability Paket Foto
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Analisis perbandingan revenue, total cost aktual, dan profit per paket foto ARTDEVATA.
          </p>
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
                <select
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {safeCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <Button variant="secondary" onClick={handleFilter}>
                <Filter className="h-4 w-4 mr-2" /> Terapkan Filter
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
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nama Paket Foto</th>
                <th className="px-4 py-3 text-center">MUA</th>
                <th className="px-4 py-3 text-center">Jumlah Project</th>
                <th className="px-4 py-3 text-right">Total Revenue</th>
                <th className="px-4 py-3 text-right">Total Cost</th>
                <th className="px-4 py-3 text-right">Total Profit</th>
                <th className="px-4 py-3 text-right">Avg Profit / Project</th>
                <th className="px-4 py-3 text-center">Avg Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeReportData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Tidak ada data profitabilitas paket foto.
                  </td>
                </tr>
              ) : (
                safeReportData.map((row) => (
                  <tr key={row.package_id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {row.package_name}
                      <span className="text-xs text-slate-400 font-normal block">{row.category}</span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {row.includes_mua ? (
                        <Badge variant="info">MUA</Badge>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-slate-900">
                      {row.project_count}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {formatRupiah(row.total_revenue)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-600">
                      {formatRupiah(row.total_cost)}
                    </td>

                    <td className="px-4 py-3 text-right font-bold">
                      {row.total_profit >= 0 ? (
                        <span className="text-emerald-600">{formatRupiah(row.total_profit)}</span>
                      ) : (
                        <span className="text-red-600">RUGI {formatRupiah(row.total_profit)}</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                      {formatRupiah(row.avg_profit)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={row.avg_margin >= 35 ? "success" : row.avg_margin > 0 ? "warning" : "destructive"}>
                        {row.avg_margin}%
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
