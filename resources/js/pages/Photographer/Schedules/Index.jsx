import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Head, Link, router } from "@inertiajs/react";
import { Calendar, MapPin, Clock, Camera, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Index({ schedules = { data: [] }, filters = {} }) {
  const safeFilters = filters || {};
  const [date, setDate] = useState(safeFilters.date || "");

  const handleFilter = () => {
    router.get("/photographer/schedules", { date }, { preserveState: true });
  };

  return (
    <>
      <Head title="Jadwal Saya" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Pemotretan Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar jadwal dan penugasan lokasi pemotretan Anda.
          </p>
        </div>

        {/* Filter Date */}
        <Card className="border-slate-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="secondary" size="sm" onClick={handleFilter}>
                <Filter /> Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedules Cards List */}
        <div className="space-y-3">
          {(!schedules?.data || schedules.data.length === 0) ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              Tidak ada jadwal pemotretan ditugaskan.
            </div>
          ) : (
            (schedules?.data || []).map((sch) => (
              <Card key={sch.id} className="border-slate-200 hover:shadow-xs transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-base">{sch.customer?.name}</span>
                      <Badge variant="outline">{sch.photo_package?.name}</Badge>
                      <Badge variant={sch.status === "COMPLETED" ? "success" : "warning"}>
                        {sch.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center space-x-3">
                      <span>📅 {formatDate(sch.date)}</span>
                      <span>⏰ {sch.start_time?.substring(0, 5)} - {sch.end_time?.substring(0, 5)}</span>
                    </div>

                    <div className="text-xs text-slate-800 font-semibold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      <span>{sch.location_name}</span>
                    </div>
                    <p className="text-xs text-slate-500 pl-4">{sch.location_address}</p>
                  </div>

                  <div>
                    <Link href={`/photographer/schedules/${sch.id}`}>
                      <Button size="sm" className="w-full sm:w-auto">
                        <Camera /> Detail & Bukti Foto
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
