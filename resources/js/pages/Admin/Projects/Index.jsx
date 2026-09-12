import React, { useState, useEffect } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { FolderKanban, Search, Eye, Clock, TrendingUp, AlertCircle } from "lucide-react";
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
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ projects, filters, statuses }) {
  const safeProjects = projects?.data ? projects : { data: [] };
  const safeFilters = filters || {};
  const safeStatuses = Array.isArray(statuses) ? statuses : [];

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [status, setStatus] = useState(safeFilters.status || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(true);
      router.get(
        "/admin/projects",
        { search, status },
        {
          preserveState: true,
          onFinish: () => setIsSearching(false),
        }
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = (val) => {
    const newStatus = val === "all" ? "" : val;
    setStatus(newStatus);
    setIsSearching(true);
    router.get(
      "/admin/projects",
      { search, status: newStatus },
      {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  const isLoading = isNavigating || isSearching;

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

              <Select
                value={status || "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Project Table or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Kode & Project</TableHead>
                <TableHead className="font-semibold text-slate-700">Pelanggan</TableHead>
                <TableHead className="font-semibold text-slate-700">Durasi Kerja</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Harga Jual</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Biaya / Cost</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Profit Aktual</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeProjects.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                    Belum ada data project.
                  </TableCell>
                </TableRow>
              ) : (
                safeProjects.data.map((prj) => (
                  <TableRow key={prj.id}>
                    <TableCell>
                      <span className="font-mono text-xs text-slate-400 font-bold block">{prj.project_code}</span>
                      <span className="font-bold text-slate-900">{prj.project_name}</span>
                      <span className="text-xs text-slate-400 block">{formatDate(prj.date)}</span>
                    </TableCell>

                    <TableCell className="font-semibold text-slate-800">
                      {prj.customer?.name}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-slate-800">{prj.formatted_work_duration}</span>
                      {prj.work_start_time && prj.work_end_time && (
                        <span className="text-xs text-slate-400 block">
                          {prj.work_start_time?.substring(0, 5)} - {prj.work_end_time?.substring(0, 5)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right font-bold text-slate-900">
                      {formatRupiah(prj.package_price)}
                    </TableCell>

                    <TableCell className="text-right font-medium text-slate-600">
                      {formatRupiah(prj.actual_total_cost)}
                    </TableCell>

                    <TableCell className="text-right font-bold">
                      {prj.actual_profit >= 0 ? (
                        <span className="text-emerald-600">{formatRupiah(prj.actual_profit)}</span>
                      ) : (
                        <span className="text-red-600">RUGI {formatRupiah(prj.actual_profit)}</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant={prj.status === "COMPLETED" ? "success" : "secondary"}>
                        {prj.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Link href={`/admin/projects/${prj.id}`}>
                        <Button variant="ghost" size="icon" title="Detail Project">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
