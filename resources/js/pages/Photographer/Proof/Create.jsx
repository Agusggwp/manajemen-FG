import React, { useState, useEffect } from "react";
import PhotographerLayout from "@/layouts/PhotographerLayout";
import { useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Camera, MapPin, Navigation, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
      (position) => {
        form.setData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }));
        setGpsLoading(false);
      },
      (error) => {
        setGpsError(`Gagal mengambil koordinat GPS: ${error.message}`);
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      form.setData("photo", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.data.photo) {
      alert("Harap ambil/pilih foto bukti pemotretan terlebih dahulu.");
      return;
    }
    if (!form.data.latitude || !form.data.longitude) {
      alert("Koordinat GPS belum terdeteksi. Silakan coba muat ulang GPS.");
      return;
    }

    form.post(`/photographer/schedules/${schedule.id}/proof`);
  };

  return (
    <PhotographerLayout title={`Kirim Proof ${type} - ${schedule.customer?.name}`}>
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href={`/photographer/schedules/${schedule.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Kirim Bukti Foto {type} Pemotretan
            </h1>
            <p className="text-xs text-slate-500">{schedule.customer?.name} - {schedule.location_name}</p>
          </div>
        </div>

        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Form Bukti Foto {type}</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-900 text-white rounded uppercase">
                {type} PROOF
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* GPS Status Card */}
            <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-rose-600 animate-pulse" /> Deteksi GPS Lokasi
                </span>
                <Button type="button" size="xs" variant="outline" onClick={getGpsPosition} disabled={gpsLoading}>
                  {gpsLoading ? "Mendeteksi..." : "Muat Ulang GPS"}
                </Button>
              </div>

              {gpsError ? (
                <div className="p-2 bg-red-50 text-red-700 rounded border border-red-200">
                  {gpsError}
                </div>
              ) : gpsLoading ? (
                <p className="text-slate-500 italic">Mencari sinyal satelit GPS ponsel Anda...</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">LATITUDE:</span>
                    <strong>{form.data.latitude?.toFixed(6)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LONGITUDE:</span>
                    <strong>{form.data.longitude?.toFixed(6)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">AKURASI:</span>
                    <strong>±{form.data.accuracy?.toFixed(1)}m</strong>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload / Camera Input */}
              <div className="space-y-2">
                <Label>Ambil / Unggah Foto Bukti Pemotretan</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors relative cursor-pointer">
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img
                        src={previewUrl}
                        alt="Preview Proof"
                        className="max-h-56 mx-auto rounded-lg object-contain border border-slate-200"
                      />
                      <p className="text-xs text-emerald-600 font-semibold">✓ Foto berhasil dipilih</p>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <Camera className="h-10 w-10 text-slate-400 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">
                        Klik untuk mengambil foto dari kamera HP
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Format: JPG, PNG, WEBP (Maksimal 10MB)
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {form.errors.photo && (
                  <p className="text-xs text-red-600 font-medium">{form.errors.photo}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5"
                disabled={form.processing || gpsLoading}
              >
                {form.processing ? "Mengirim..." : `KIRIM BUKTI FOTO ${type}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PhotographerLayout>
  );
}
