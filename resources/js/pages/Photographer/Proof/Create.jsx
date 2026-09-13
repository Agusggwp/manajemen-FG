import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Camera, MapPin, Navigation, ShieldCheck, AlertCircle, RefreshCw, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

export default function Create({ schedule, type, existingProof }) {
  const [gpsLoading, setGpsLoading] = useState(true);
  const [gpsError, setGpsError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const form = useForm({
    type: type,
    photo: null,
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });

  const getGpsPosition = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung Geolocation GPS.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setData({
          ...form.data,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(`Gagal mengambil lokasi: ${err.message}. Pastikan izin lokasi aktif.`);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getGpsPosition();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setData("photo", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.data.photo) {
      toast.error("Wajib mengunggah foto bukti pemotretan!");
      return;
    }

    form.post(`/photographer/schedules/${schedule.id}/proof`);
  };

  return (
    <>
      <Head title={`Unggah Bukti ${type} - ${schedule.customer?.name || ""}`} />
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href={`/photographer/schedules/${schedule.id}`}>
            <Button variant="outline" size="icon" disabled={form.processing} className="bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Kirim Bukti Foto {type} Pemotretan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{schedule.customer?.name} - {schedule.location_name}</p>
          </div>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardHeader className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 py-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between text-slate-900 dark:text-white">
              <span>Form Bukti Foto {type}</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-900 dark:bg-slate-800 text-white rounded uppercase border border-transparent dark:border-slate-700">
                {type} PROOF
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* GPS Status Card */}
            <div className="p-3.5 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-rose-600 dark:text-rose-400 animate-pulse" /> Deteksi GPS Lokasi
                </span>
                <Button type="button" size="xs" variant="outline" onClick={getGpsPosition} disabled={gpsLoading || form.processing} className="bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${gpsLoading ? "animate-spin" : ""}`} />
                  {gpsLoading ? "Mendeteksi..." : "Muat Ulang GPS"}
                </Button>
              </div>

              {gpsError ? (
                <div className="p-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded border border-red-200 dark:border-red-900/40">
                  {gpsError}
                </div>
              ) : gpsLoading ? (
                <p className="text-slate-500 dark:text-slate-400 italic">Mencari sinyal satelit GPS ponsel Anda...</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">LATITUDE:</span>
                    <strong>{form.data.latitude?.toFixed(6)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">LONGITUDE:</span>
                    <strong>{form.data.longitude?.toFixed(6)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">AKURASI:</span>
                    <strong>±{form.data.accuracy?.toFixed(1)}m</strong>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload / Camera Input */}
              <div className="space-y-2">
                <Label className="text-slate-900 dark:text-white">Ambil / Unggah Foto Bukti Pemotretan</Label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-950/70 transition-colors relative cursor-pointer">
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview Proof"
                        className="max-h-64 mx-auto rounded-lg object-contain shadow-xs"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ketuk untuk mengganti foto</p>
                    </div>
                  ) : (
                    <div className="py-8 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-300">
                        <Camera className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ambil Foto Langsung dari Kamera</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Pastikan GPS aktif & lokasi sesuai</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    required
                    disabled={form.processing}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {form.errors.photo && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">{form.errors.photo}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-bold"
                disabled={form.processing || gpsLoading}
              >
                {form.processing ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Upload className="h-4 w-4 mr-1.5" />}
                <span>{form.processing ? "Mengirim..." : `KIRIM BUKTI FOTO ${type}`}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
