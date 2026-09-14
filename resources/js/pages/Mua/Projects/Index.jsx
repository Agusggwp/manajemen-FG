import React, { useState, useRef, useEffect } from "react";
import { formatDate, getStatusLabel, formatRupiah } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { FolderKanban, Search, Calendar, MapPin, Eye, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ projects = { data: [] }, filters = {} }) {
  const safeFilters = filters || {};
  const isNavigating = usePageLoading();
  const [isFiltering, setIsFiltering] = useState(false);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [status, setStatus] = useState(safeFilters.status || "");

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setSearch(safeFilters.search || "");
    setStatus(safeFilters.status || "");
  }, [safeFilters.search, safeFilters.status]);

  const applyFilters = (overrides = {}) => {
    const qSearch = overrides.search !== undefined ? overrides.search : search;
    const qStatus = overrides.status !== undefined ? overrides.status : status;

    setIsFiltering(true);
    router.get(
      "/mua/projects",
      {
        search: qSearch || undefined,
        status: qStatus || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onFinish: () => setIsFiltering(false),
      }
    );
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      applyFilters({ search: val });
    }, 350);
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatus(val);
    applyFilters({ status: val });
  };

  const handleReset = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearch("");
    setStatus("");
    setIsFiltering(true);
    router.get(
      "/mua/projects",
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onFinish: () => setIsFiltering(false),
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    applyFilters();
  };

  const hasActiveFilters = Boolean(search || status);
  const isLoading = isNavigating || isFiltering;

  return (
    <>
      <Head title="Project Saya" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Project MUA Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar penugasan project pemotretan yang melibatkan riasan Anda.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cari Kode / Nama / Klien</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Ketik kode project, nama klien..."
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-8 bg-white dark:bg-slate-950 text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status Project</label>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">Semua Status</option>
                  <option value="PLANNING">PLANNING</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="SHOOTING">SHOOTING</option>
                  <option value="EDITING">EDITING</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-end">
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="w-full h-9 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 gap-1.5 font-medium transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Filter
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-full h-9 text-xs text-slate-400 border-dashed border-slate-200 dark:border-slate-800 opacity-60 cursor-default"
                  >
                    Filter Otomatis Aktif
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Project List */}
        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : !projects?.data || projects.data.length === 0 ? (
          <div className="text-center py-16 bg-card dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
            <Sparkles className="h-10 w-10 mx-auto mb-2 text-pink-300 dark:text-pink-900" />
            <p className="font-semibold text-sm">Tidak ada project yang ditemukan.</p>
            <p className="text-xs mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.data.map((prj) => (
              <Card key={prj.id} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 hover:border-pink-200 dark:hover:border-pink-900/50 transition-all shadow-2xs flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-pink-600 dark:text-pink-400 block">
                        {prj.project_code}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                        {prj.project_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Klien: <span className="font-semibold text-slate-700 dark:text-slate-300">{prj.customer?.name}</span>
                      </p>
                    </div>
                    <Badge
                      className="text-[10px] uppercase font-bold shrink-0"
                      variant={
                        prj.status === "COMPLETED" || prj.status === "DELIVERED" ? "success" :
                        prj.status === "SHOOTING" || prj.status === "EDITING" ? "warning" :
                        prj.status === "SCHEDULED" ? "info" :
                        prj.status === "CANCELLED" ? "destructive" : "secondary"
                      }
                    >
                      {getStatusLabel(prj.status)}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Tanggal: {formatDate(prj.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{prj.location_name}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {prj.package_name || prj.photo_package?.name}
                    </span>
                    <Link href={`/mua/projects/${prj.id}`}>
                      <Button size="sm" variant="ghost" className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 h-8 gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Rincian</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
