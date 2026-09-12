import React, { useState, useEffect } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { FolderKanban, Search, Eye, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Index({ projects, filters, statuses }) {
  const safeProjects = projects?.data ? projects : { data: [] };
  const safeFilters = filters || {};
  const safeStatuses = Array.isArray(statuses) ? statuses : [];

  const [search, setSearch] = useState(safeFilters.search || "");
  const [status, setStatus] = useState(safeFilters.status || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.get("/admin/projects", { search, status }, { preserveState: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    router.get("/admin/projects", { search, status: newStatus }, { preserveState: true });
  };

  return (
    <>
      <Head title="Manajemen Project" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Project Pemotretan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau status pengerjaan, durasi kerja aktual, dan keuangan project.
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari kode project, nama, atau pelanggan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <select
                value={status}
                onChange={handleStatusChange}
                className="h-9 px-3 text-sm rounded-md border border-slate-200 bg-white"
              >
                <option value="">Semua Status</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Project Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Kode & Project</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Durasi Kerja</th>
                <th className="px-4 py-3 text-right">Harga Jual</th>
                <th className="px-4 py-3 text-right">Biaya / Cost</th>
                <th className="px-4 py-3 text-right">Profit Aktual</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeProjects.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Belum ada data project.
                  </td>
                </tr>
              ) : (
                safeProjects.data.map((prj) => (
                  <tr key={prj.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-400 font-bold block">{prj.project_code}</span>
                      <span className="font-bold text-slate-900">{prj.project_name}</span>
                      <span className="text-xs text-slate-400 block">{formatDate(prj.date)}</span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {prj.customer?.name}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{prj.formatted_work_duration}</span>
                      {prj.work_start_time && prj.work_end_time && (
                        <span className="text-xs text-slate-400 block">
                          {prj.work_start_time?.substring(0, 5)} - {prj.work_end_time?.substring(0, 5)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {formatRupiah(prj.package_price)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-600">
                      {formatRupiah(prj.actual_total_cost)}
                    </td>

                    <td className="px-4 py-3 text-right font-bold">
                      {prj.actual_profit >= 0 ? (
                        <span className="text-emerald-600">{formatRupiah(prj.actual_profit)}</span>
                      ) : (
                        <span className="text-red-600">RUGI {formatRupiah(prj.actual_profit)}</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={prj.status === "COMPLETED" ? "success" : "secondary"}>
                        {prj.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Link href={`/admin/projects/${prj.id}`}>
                        <Button variant="ghost" size="icon" title="Detail Project">
                          <Eye className="h-4 w-4 text-slate-600" />
                        </Button>
                      </Link>
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
