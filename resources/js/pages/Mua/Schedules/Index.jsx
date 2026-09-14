import React, { useState, useRef, useEffect } from "react";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { Calendar, MapPin, Clock, Sparkles, Eye, Search, Phone, UserCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ schedules = { data: [] }, filters = {} }) {
  const safeFilters = filters || {};
  const isNavigating = usePageLoading();
  const [isFiltering, setIsFiltering] = useState(false);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [status, setStatus] = useState(safeFilters.status || "");
  const [dateFrom, setDateFrom] = useState(safeFilters.date_from || "");
  const [dateTo, setDateTo] = useState(safeFilters.date_to || "");

  const searchTimeoutRef = useRef(null);

  // Sync state if props change
  useEffect(() => {
    setSearch(safeFilters.search || "");
    setStatus(safeFilters.status || "");
    setDateFrom(safeFilters.date_from || "");
    setDateTo(safeFilters.date_to || "");
  }, [safeFilters.search, safeFilters.status, safeFilters.date_from, safeFilters.date_to]);

  const applyFilters = (overrides = {}) => {
    const qSearch = overrides.search !== undefined ? overrides.search : search;
    const qStatus = overrides.status !== undefined ? overrides.status : status;
    const qDateFrom = overrides.date_from !== undefined ? overrides.date_from : dateFrom;
    const qDateTo = overrides.date_to !== undefined ? overrides.date_to : dateTo;

    setIsFiltering(true);
    router.get(
      "/mua/schedules",
      {
        search: qSearch || undefined,
        status: qStatus || undefined,
        date_from: qDateFrom || undefined,
        date_to: qDateTo || undefined,
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

  const handleDateFromChange = (e) => {
    const val = e.target.value;
    setDateFrom(val);
    applyFilters({ date_from: val });
  };

  const handleDateToChange = (e) => {
    const val = e.target.value;
    setDateTo(val);
    applyFilters({ date_to: val });
  };

  const handleReset = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearch("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setIsFiltering(true);
    router.get(
      "/mua/schedules",
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

  const hasActiveFilters = Boolean(search || status || dateFrom || dateTo);
  const isLoading = isNavigating || isFiltering;

  return (
    <>
      <Head title="Jadwal Rias Makeup" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Jadwal Rias Makeup Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar penugasan makeup untuk sesi pemotretan pelanggan.
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cari Lokasi / Klien</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Nama klien, paket, tempat..."
                    value={search}
                    onChange={handleSearchChange}
                    className="pl-8 bg-white dark:bg-slate-950 text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status Sesi</label>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">Semua Status</option>
                  <option value="SCHEDULED">SCHEDULED (Terjadwal)</option>
                  <option value="SHOOTING">SHOOTING (Sedang Berlangsung)</option>
                  <option value="COMPLETED">COMPLETED (Selesai)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dari Tanggal</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  className="bg-white dark:bg-slate-950 text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sampai Tanggal</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={handleDateToChange}
                  className="bg-white dark:bg-slate-950 text-xs h-9"
                />
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

        {/* Schedule List */}
        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : !schedules?.data || schedules.data.length === 0 ? (
          <div className="text-center py-16 bg-card dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
            <Sparkles className="h-10 w-10 mx-auto mb-2 text-pink-300 dark:text-pink-900" />
            <p className="font-semibold text-sm">Tidak ada jadwal makeup yang ditemukan.</p>
            <p className="text-xs mt-1">Coba sesuaikan filter pencarian atau rentang tanggal Anda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.data.map((sch) => (
              <Card key={sch.id} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 hover:border-pink-200 dark:hover:border-pink-900/50 transition-all shadow-2xs">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {sch.customer?.name}
                      </span>
                      <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800">
                        {sch.photo_package?.name || "Paket Foto"}
                      </Badge>
                      <Badge
                        className="text-[10px] uppercase font-bold"
                        variant={
                          sch.status === "COMPLETED" ? "success" :
                          sch.status === "SHOOTING" ? "warning" :
                          sch.status === "SCHEDULED" ? "info" :
                          sch.status === "CANCELLED" ? "destructive" : "secondary"
                        }
                      >
                        {getStatusLabel(sch.status)}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {formatDate(sch.date)}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {sch.start_time?.substring(0, 5)} - {sch.end_time?.substring(0, 5)} WITA
                      </span>
                      {sch.customer?.phone && (
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {sch.customer.phone}
                        </span>
                      )}
                    </div>

                    {sch.location_name && (
                      <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 pt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{sch.location_name}</span>
                        {sch.location_address && (
                          <span className="text-slate-400 font-normal truncate max-w-md hidden md:inline">
                            — {sch.location_address}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <Link href={`/mua/schedules/${sch.id}`} className="w-full sm:w-auto">
                      <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs font-semibold hover:bg-pink-50 dark:hover:bg-pink-950/40 hover:text-pink-600 border-slate-200 dark:border-slate-800">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Detail Jadwal</span>
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
