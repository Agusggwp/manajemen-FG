import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index({ settings }) {
  const form = useForm({
    company_name: settings?.company_name || "ARTDEVATA Photography",
    company_phone: settings?.company_phone || "081234567890",
    company_address: settings?.company_address || "Denpasar, Bali",
    default_location_radius: settings?.default_location_radius || 100,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post("/admin/settings");
  };

  return (
    <AdminLayout title="Pengaturan Sistem">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Sistem
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Konfigurasi profil studio fotografi dan radius default validasi GPS.
          </p>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-700" /> Profil Studio & Validasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Studio / Perusahaan</Label>
                <Input
                  value={form.data.company_name}
                  onChange={(e) => form.setData("company_name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor Telepon Studio</Label>
                  <Input
                    value={form.data.company_phone}
                    onChange={(e) => form.setData("company_phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Radius Validasi GPS (Meter)</Label>
                  <Input
                    type="number"
                    min="10"
                    max="1000"
                    value={form.data.default_location_radius}
                    onChange={(e) => form.setData("default_location_radius", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alamat Studio</Label>
                <Input
                  value={form.data.company_address}
                  onChange={(e) => form.setData("company_address", e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="bg-slate-900 text-white" disabled={form.processing}>
                  <Save className="h-4 w-4 mr-2" />
                  {form.processing ? "Menyimpan..." : "Simpan Pengaturan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
