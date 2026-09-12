import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { History, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Index({ logs, filters }) {
  const safeLogs = logs?.data ? logs : { data: [] };
  const safeFilters = filters || {};

  const [search, setSearch] = useState(safeFilters.search || "");
  const [module, setModule] = useState(safeFilters.module || "");

  const handleFilter = () => {
    router.get("/admin/activity-logs", { search, module }, { preserveState: true });
  };

  return (
    <>
      <Head title="Activity Logs" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Activity Audit Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Catatan jejak aktivitas penting pengubahan data di sistem ARTDEVATA.
          </p>
        </div>

        {/* Filter Card */}
        <Card className="border-slate-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari deskripsi, user, atau aktivitas..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>

              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="h-10 px-3 text-sm rounded-md border border-slate-200 bg-white"
              >
                <option value="">Semua Modul</option>
                <option value="Schedule">Schedule / Jadwal</option>
                <option value="Project">Project</option>
                <option value="Proof">Proofing</option>
                <option value="SalaryPayment">Gaji</option>
                <option value="MuaPayment">Fee MUA</option>
                <option value="Package">Paket Foto</option>
              </select>

              <Button onClick={handleFilter} className="bg-slate-900 text-white">
                <Filter className="h-4 w-4 mr-1.5" /> Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Logs */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Modul</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeLogs.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada catatan aktivitas ditemukan.
                  </td>
                </tr>
              ) : (
                safeLogs.data.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {log.user?.name || "Sistem"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{log.module}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {log.description}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {log.ip_address || "-"}
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
