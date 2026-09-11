import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatDate } from "@/lib/utils";
import { router } from "@inertiajs/react";
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
    <AdminLayout title="Activity Logs">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Activity Audit Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Catatan jejak aktivitas penting pengubahan data di sistem ARTDEVATA.
          </p>
        </div>

        {/* Search */}
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari kata kunci deskripsi aktivitas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" onClick={handleFilter}>
                Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action / Module</th>
                <th className="px-4 py-3">Deskripsi Aktivitas</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {safeLogs.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 font-sans">
                    Belum ada rekaman aktivitas.
                  </td>
                </tr>
              ) : (
                safeLogs.data.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("id-ID")}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900 font-sans">
                      {log.user?.name || "System"}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="outline" className="mr-1">
                        {log.action}
                      </Badge>
                      <Badge variant="secondary">{log.module}</Badge>
                    </td>

                    <td className="px-4 py-3 text-slate-800 font-sans max-w-md">
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
    </AdminLayout>
  );
}
