import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Settings, Save, Globe, Palette, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Index({ settings }) {
  const form = useForm({
    company_name: settings?.company_name || "ARTDEVATA Photography",
    company_phone: settings?.company_phone || "081999888777",
    company_address: settings?.company_address || "Denpasar, Bali",
    default_location_radius: settings?.default_location_radius || 100,

    // Public Web Display Settings
    public_theme_mode: settings?.public_theme_mode || "light",
    public_hero_badge: settings?.public_hero_badge || "Dokumentasi Fotografi & MUA Profesional di Bali",
    public_hero_title: settings?.public_hero_title || "Abadikan Setiap Momen Istimewa Anda",
    public_hero_subtitle: settings?.public_hero_subtitle || "Pilihan paket foto terbaik untuk Wisuda, Pernikahan, Prewedding, dan Personal Portrait. Didukung tim fotografer handal & MUA profesional terpercaya.",
    public_whatsapp_number: settings?.public_whatsapp_number || "6281999888777",
    public_cta_title: settings?.public_cta_title || "Butuh Penawaran Custom atau Diskusi Lokasi?",
    public_show_search: settings?.public_show_search ?? "true",
    public_show_categories: settings?.public_show_categories ?? "true",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post("/admin/settings");
  };

  return (
    <>
      <Head title="Pengaturan Sistem & Web Publik" />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pengaturan Sistem & Tampilan Web
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Atur profil studio, radius validasi GPS, serta tema dan konten halaman katalog web publik (/)
            </p>
          </div>
          <Button type="submit" className="bg-slate-900 text-white shadow-sm" disabled={form.processing}>
            <Save className="h-4 w-4 mr-2" />
            {form.processing ? "Menyimpan..." : "Simpan Semua Pengaturan"}
          </Button>
        </div>

        {/* SECTION 1: PUBLIC WEBSITE DISPLAY SETTINGS */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                  <Globe className="h-5 w-5 text-emerald-600" /> Tampilan & Tema Web Publik (/)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Atur tema warna, teks hero banner, kontak WhatsApp, dan visibilitas elemen halaman publik.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                Web Publik Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {/* Theme Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Mode Tema Tampilan Web (Public Theme)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => form.setData("public_theme_mode", "light")}
                  className={`p-4 rounded-xl border text-sm flex items-start space-x-3 cursor-pointer transition-all ${
                    form.data.public_theme_mode === "light"
                      ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center mt-0.5 shrink-0 bg-white">
                    {form.data.public_theme_mode === "light" && (
                      <div className="h-3 w-3 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Tema Terang (Background Putih)</span>
                    <span className="text-xs text-slate-500">
                      Tampilan bersih dengan background putih, aksen deep green (#14433B) dan mint (#21C9A4).
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => form.setData("public_theme_mode", "dark")}
                  className={`p-4 rounded-xl border text-sm flex items-start space-x-3 cursor-pointer transition-all ${
                    form.data.public_theme_mode === "dark"
                      ? "border-emerald-600 bg-slate-900 text-white ring-1 ring-emerald-600"
                      : "border-slate-200 bg-slate-900/90 text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="h-5 w-5 rounded-full border border-slate-600 flex items-center justify-center mt-0.5 shrink-0 bg-slate-800">
                    {form.data.public_theme_mode === "dark" && (
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-white block">Tema Gelap (Deep Green IT Agency)</span>
                    <span className="text-xs text-slate-400">
                      Tampilan eksklusif dengan background deep-green (#14433B), grid teknikal, dan aksen turquoise (#21C9A4).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Text Settings */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Teks Banner Hero Utama
              </p>

              <div className="space-y-2">
                <Label>Hero Badge Text</Label>
                <Input
                  value={form.data.public_hero_badge}
                  onChange={(e) => form.setData("public_hero_badge", e.target.value)}
                  placeholder="Dokumentasi Fotografi & MUA Profesional di Bali"
                />
              </div>

              <div className="space-y-2">
                <Label>Judul Utama (Hero Title)</Label>
                <Input
                  value={form.data.public_hero_title}
                  onChange={(e) => form.setData("public_hero_title", e.target.value)}
                  placeholder="Abadikan Setiap Momen Istimewa Anda"
                />
              </div>

              <div className="space-y-2">
                <Label>Deskripsi Hero (Subtitle)</Label>
                <Textarea
                  rows={2}
                  value={form.data.public_hero_subtitle}
                  onChange={(e) => form.setData("public_hero_subtitle", e.target.value)}
                  placeholder="Pilihan paket foto terbaik untuk Wisuda, Pernikahan..."
                />
              </div>
            </div>

            {/* Contact & CTA Settings */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Kontak & Tombol WhatsApp
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor WhatsApp Pemesanan</Label>
                  <Input
                    value={form.data.public_whatsapp_number}
                    onChange={(e) => form.setData("public_whatsapp_number", e.target.value)}
                    placeholder="6281999888777"
                  />
                  <p className="text-[11px] text-slate-400">Gunakan kode negara (contoh: 6281999888777)</p>
                </div>
                <div className="space-y-2">
                  <Label>Judul Banner Penawaran (CTA)</Label>
                  <Input
                    value={form.data.public_cta_title}
                    onChange={(e) => form.setData("public_cta_title", e.target.value)}
                    placeholder="Butuh Penawaran Custom atau Diskusi Lokasi?"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Fitur & Visibilitas Elemen
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Tampilkan Kolom Pencarian Paket</span>
                  <input
                    type="checkbox"
                    checked={form.data.public_show_search === "true"}
                    onChange={(e) => form.setData("public_show_search", e.target.checked ? "true" : "false")}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                  />
                </label>
                <label className="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Tampilkan Tab Filter Kategori</span>
                  <input
                    type="checkbox"
                    checked={form.data.public_show_categories === "true"}
                    onChange={(e) => form.setData("public_show_categories", e.target.checked ? "true" : "false")}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: STUDIO PROFILE SETTINGS */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
              <Settings className="h-5 w-5 text-slate-700" /> Profil Studio & Validasi GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
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
          </CardContent>
        </Card>

        <div className="pt-2">
          <Button type="submit" className="bg-slate-900 text-white shadow-sm" disabled={form.processing}>
            <Save className="h-4 w-4 mr-2" />
            {form.processing ? "Menyimpan..." : "Simpan Semua Pengaturan"}
          </Button>
        </div>
      </form>
    </>
  );
}
