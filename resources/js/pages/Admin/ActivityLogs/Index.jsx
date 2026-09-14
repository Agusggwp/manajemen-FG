import React, { useState, useEffect, useRef } from "react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import { History, Search, Clock } from "lucide-react";
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
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ logs, filters }) {
  const safeLogs = logs?.data ? logs : { data: [] };
  const safeFilters = filters || {};

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [module, setModule] = useState(safeFilters.module || "");
  const debounceRef = useRef(null);

  const doFilter = (newSearch, newModule) => {
    setIsSearching(true);
    router.get(
      "/admin/activity-logs",
      { search: newSearch, module: newModule },
      {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doFilter(val, module), 500);
  };

  const handleModuleChange = (val) => {
    const newModule = val === "all" ? "" : val;
    setModule(newModule);
    doFilter(search, newModule);
  };

  const isLoading = isNavigating || isSearching;

  return (
    <>
      <Head title="Activity Logs" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Activity Audit Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Catatan jejak aktivitas penting pengubahan data di sistem ARTDEVATA.
          </p>
        </div>

        {/* Filter Card */}
        <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Cari deskripsi, user, atau aktivitas..."
                  className="pl-9"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>

              <Select value={module || "all"} onValueChange={handleModuleChange}>
                <SelectTrigger className="w-full sm:w-48">
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
            </div>
          </CardContent>
        </Card>

        {/* Table Logs or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={8} cols={6} hasActions={false} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                <TableRow className="border-border dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Waktu</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">User</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Modul</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Aksi</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Deskripsi</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeLogs.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400 dark:text-slate-500">
                      Tidak ada catatan aktivitas ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  safeLogs.data.map((log) => (
                    <TableRow key={log.id} className="border-border dark:border-slate-800">
                      <TableCell className="text-xs whitespace-nowrap">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {log.formatted_date || formatDate(log.created_at)}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-indigo-500 dark:text-indigo-400 shrink-0" />
                          {log.formatted_time || (log.formatted_created_at ? log.formatted_created_at : formatDateTime(log.created_at))}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-white">
                        {log.user?.name || "Sistem"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-slate-800 dark:text-slate-200">
                        {log.description}
                      </TableCell>
                      <TableCell className="text-slate-400 dark:text-slate-500">
                        {log.ip_address || "-"}
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
