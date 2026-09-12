import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { History, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

              <Select value={module || "all"} onValueChange={(val) => setModule(val === "all" ? "" : val)}>
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <SelectValue placeholder="Semua Modul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Modul</SelectItem>
                  <SelectItem value="Schedule">Schedule / Jadwal</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Proof">Proofing</SelectItem>
                  <SelectItem value="Customer">Pelanggan</SelectItem>
                  <SelectItem value="Photographer">Photographer</SelectItem>
                  <SelectItem value="Mua">MUA</SelectItem>
                  <SelectItem value="Package">Paket Foto</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="secondary" onClick={handleFilter}>
                <Filter /> Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Logs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Waktu</TableHead>
                <TableHead className="font-semibold text-slate-700">User</TableHead>
                <TableHead className="font-semibold text-slate-700">Modul</TableHead>
                <TableHead className="font-semibold text-slate-700">Aksi</TableHead>
                <TableHead className="font-semibold text-slate-700">Deskripsi</TableHead>
                <TableHead className="font-semibold text-slate-700">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeLogs.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada catatan aktivitas ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                safeLogs.data.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {log.user?.name || "Sistem"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.module}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-slate-700">
                      {log.action}
                    </TableCell>
                    <TableCell className="text-slate-800">
                      {log.description}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {log.ip_address || "-"}
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
