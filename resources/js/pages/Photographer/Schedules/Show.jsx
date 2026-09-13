import React from "react";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, MapPin, Clock, Camera, CheckCircle2, AlertCircle, PlayCircle, StopCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ schedule }) {
  const startProof = schedule.proofs?.find((p) => p.type === "START");
  const endProof = schedule.proofs?.find((p) => p.type === "END");

  // Format & Hitung Validasi Tanggal & Waktu Jadwal
  const dateStr = schedule.date ? schedule.date.substring(0, 10) : "";
  const startTimeStr = schedule.start_time ? schedule.start_time.substring(0, 5) : "00:00";
  const scheduleStartDateTime = new Date(`${dateStr}T${startTimeStr}:00`);
  const now = new Date();
  const isTimeForStart = now >= scheduleStartDateTime;

  return (
    <>
      <Head title={`Jadwal Pemotretan - ${schedule.customer?.name}`} />
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link href="/photographer/schedules">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{schedule.customer?.name}</h1>
            <p className="text-xs text-slate-500">{schedule.photo_package?.name}</p>
          </div>
        </div>

        {/* Action Buttons for Proof Submission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* START PROOF CARD & BUTTON */}
          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-slate-700">1. Bukti Awal (START)</span>
                {startProof ? (
                  <Badge variant={startProof.status === "START_VALID" ? "success" : "warning"}>
                    {getStatusLabel(startProof.status)}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Belum Dikirim</Badge>
                )}
              </div>

              {startProof ? (
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Bukti START Telah Dikirim (1x Only)
                  </p>
                  <p>Waktu: {new Date(startProof.captured_at).toLocaleTimeString("id-ID")}</p>
                  <p>Jarak GPS: {startProof.distance_from_location}m</p>
                  {startProof.admin_note && (
                    <p className="text-red-600 bg-red-50 p-2 rounded">
                      Note: {startProof.admin_note}
                    </p>
                  )}
                </div>
              ) : !isTimeForStart ? (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lock className="h-3.5 w-3.5 text-amber-600" /> Pemotretan Belum Waktunya Dimulai
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Jadwal Anda: <strong>{formatDate(schedule.date)}</strong> jam <strong>{startTimeStr}</strong>.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Waktu pemotretan telah tiba. Klik tombol di bawah untuk mengambil foto bukti lokasi & GPS.
                </p>
              )}

              {/* START BUTTON LOGIC */}
              {startProof ? (
                <Button disabled variant="outline" className="w-full" size="sm">
                  <CheckCircle2 className="text-emerald-600" />
                  [ START TELAH DIKIRIM ]
                </Button>
              ) : !isTimeForStart ? (
                <Button disabled variant="outline" className="w-full" size="sm">
                  <Clock className="text-amber-500" />
                  [ BELUM WAKTUNYA DIMULAI ]
                </Button>
              ) : (
                <Link href={`/photographer/schedules/${schedule.id}/proof/start`}>
                  <Button className="w-full font-bold" size="sm">
                    <PlayCircle className="text-emerald-400" />
                    [ MULAI PEMOTRETAN ]
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* END PROOF CARD & BUTTON */}
          <Card className="border-slate-200 shadow-2xs">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-slate-700">2. Bukti Selesai (END)</span>
                {endProof ? (
                  <Badge variant={endProof.status === "END_VALID" ? "success" : "warning"}>
                    {getStatusLabel(endProof.status)}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Belum Dikirim</Badge>
                )}
              </div>

              {endProof ? (
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Pemotretan Selesai (1x Only)
                  </p>
                  <p>Waktu: {new Date(endProof.captured_at).toLocaleTimeString("id-ID")}</p>
                  <p>Jarak GPS: {endProof.distance_from_location}m</p>
                </div>
              ) : !startProof ? (
                <p className="text-xs text-slate-400 italic">
                  * Harap kirim bukti START terlebih dahulu sebelum bisa menyelesaikan sesi pemotretan.
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Sesi pemotretan berlangsung. Klik tombol di bawah saat pemotretan selesai.
                </p>
              )}

              {/* END BUTTON LOGIC */}
              {endProof ? (
                <Button disabled variant="outline" className="w-full" size="sm">
                  <CheckCircle2 className="text-emerald-600" />
                  [ SELESAI (END) TELAH DIKIRIM ]
                </Button>
              ) : !startProof ? (
                <Button disabled variant="outline" className="w-full" size="sm">
                  <Lock />
                  [ AMBIL BUKTI START DULU ]
                </Button>
              ) : (
                <Link href={`/photographer/schedules/${schedule.id}/proof/end`}>
                  <Button className="w-full font-bold" size="sm">
                    <StopCircle />
                    [ SELESAIKAN PEMOTRETAN ]
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Schedule & Location Details */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Informasi Penugasan & Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 text-xs uppercase font-medium block">Tanggal Jadwal</span>
                <strong className="text-slate-900">{formatDate(schedule.date)}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-xs uppercase font-medium block">Jam Pemotretan</span>
                <strong className="text-slate-900">
                  {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                </strong>
              </div>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{schedule.location_name}</span>
              </div>
              <p className="text-xs text-slate-600 pl-6">{schedule.location_address}</p>
              <div className="pl-6 pt-1 text-[11px] font-mono text-slate-500">
                Radius Validasi GPS: {schedule.location_radius} Meter
              </div>
            </div>

            {schedule.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-700 block mb-1">Catatan dari Admin:</span>
                <p className="text-xs text-slate-600">{schedule.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
