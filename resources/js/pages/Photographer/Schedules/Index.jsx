import React, { useState } from "react";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { Calendar, MapPin, Clock, Camera, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ schedules = { data: [] }, filters = {} }) {
  const safeFilters = filters || {};
  const isNavigating = usePageLoading();
  const [isFiltering, setIsFiltering] = useState(false);
  const [date, setDate] = useState(safeFilters.date || "");

  const handleDateChange = (e) => {
    const val = e.target.value;
    setDate(val);
    setIsFiltering(true);
    router.get(
      "/photographer/schedules",
      { date: val },
      {
        preserveState: true,
        onFinish: () => setIsFiltering(false),
      }
    );
  };

  const isLoading = isNavigating || isFiltering;

  return (
    <>
      <Head title="Jadwal Saya" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Jadwal Pemotretan Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar jadwal dan penugasan lokasi pemotretan Anda.
          </p>
        </div>

        {/* Filter Date */}
        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="max-w-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedules Cards List or Skeleton */}
        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : (!schedules?.data || schedules.data.length === 0) ? (
          <div className="text-center py-12 bg-card dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
            Tidak ada jadwal pemotretan ditugaskan.
          </div>
        ) : (
          <div className="space-y-3">
            {(schedules?.data || []).map((sch) => (
              <Card key={sch.id} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 hover:shadow-xs transition-shadow">
                <CardContent className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base mr-1">{sch.customer?.name}</span>
                      <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 whitespace-nowrap py-0 px-2 h-5">{sch.photo_package?.name}</Badge>
                      <Badge className="text-[10px] whitespace-nowrap py-0 px-2 h-5" variant={
                        sch.status === "COMPLETED"  ? "success"     :
                        sch.status === "SHOOTING"   ? "warning"     :
                        sch.status === "SCHEDULED"  ? "info"        :
                        sch.status === "CANCELLED"  ? "destructive" :
                        "secondary"
                      }>
                        {getStatusLabel(sch.status)}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" /> {formatDate(sch.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" /> {sch.start_time?.substring(0, 5)} - {sch.end_time?.substring(0, 5)}</span>
                    </div>

                    {sch.location_name && (
                      <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{sch.location_name}</span>
                      </div>
                    )}
                    {sch.location_address && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pl-4.5 truncate">{sch.location_address}</p>
                    )}
                  </div>

                  <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
                    <Link href={`/photographer/schedules/${sch.id}`} className="block w-full sm:w-auto">
                      <Button size="sm" className="w-full sm:w-auto justify-center font-semibold gap-1.5">
                        <Camera className="h-3.5 w-3.5" /> Detail & Bukti Foto
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
