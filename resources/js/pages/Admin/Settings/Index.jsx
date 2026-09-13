import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Settings, Save, Globe, Palette, Sparkles, MessageCircle, Mail, Clock, Bell, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

export default function Index({ settings }) {
  const [testingDiscord, setTestingDiscord] = useState(false);

  const form = useForm({
    company_name: settings?.company_name || "ARTDEVATA Photography",
    company_phone: settings?.company_phone || "081999888777",
    company_address: settings?.company_address || "Denpasar, Bali",
    default_location_radius: settings?.default_location_radius || 100,
    reminder_email_time: settings?.reminder_email_time || "08:00",

    // Public Web Display Settings
    public_theme_mode: settings?.public_theme_mode || "light",
    public_hero_badge: settings?.public_hero_badge || "Dokumentasi Fotografi & MUA Profesional di Bali",
    public_hero_title: settings?.public_hero_title || "Abadikan Setiap Momen Istimewa Anda",
    public_hero_subtitle: settings?.public_hero_subtitle || "Pilihan paket foto terbaik untuk Wisuda, Pernikahan, Prewedding, dan Personal Portrait. Didukung tim fotografer handal & MUA profesional terpercaya.",
    public_whatsapp_number: settings?.public_whatsapp_number || "6281999888777",
    public_cta_title: settings?.public_cta_title || "Butuh Penawaran Custom atau Diskusi Lokasi?",
    public_show_search: settings?.public_show_search ?? "true",
    public_show_categories: settings?.public_show_categories ?? "true",

    // Discord Webhook Settings
    discord_webhook_url: settings?.discord_webhook_url || "",
    discord_notify_enabled: settings?.discord_notify_enabled ?? "true",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post("/admin/settings");
  };

  const handleTestDiscord = () => {
    if (!form.data.discord_webhook_url) {
      toast.error("Silakan masukkan URL Webhook Discord terlebih dahulu.");
      return;
    }
    setTestingDiscord(true);
    router.post(
      "/admin/settings/test-discord",
      { webhook_url: form.data.discord_webhook_url },
      {
        onFinish: () => setTestingDiscord(false),
      }
    );
  };

  return (
    <>
      <Head title="Pengaturan Sistem & Web Publik" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pengaturan Sistem & Tampilan Web
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Atur profil studio, radius validasi GPS, tema katalog web publik, serta integrasi Discord Webhook.
            </p>
          </div>
          <Button type="submit" disabled={form.processing}>
            <Save />
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

        {/* SECTION 2: DISCORD WEBHOOK LOG INTEGRATION */}
        <Card className="border-indigo-200 shadow-2xs bg-indigo-50/20">
          <CardHeader className="bg-indigo-50/60 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-indigo-950">
                  <Bell className="h-5 w-5 text-indigo-600" /> Integrasi Discord Webhook Log
                </CardTitle>
                <CardDescription className="text-xs text-indigo-700/80 mt-1">
                  Kirimkan notifikasi log aktivitas sistem (Login, CRUD, Dev Tools, Reset Password) secara real-time ke channel Discord Anda.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-white">
                Live Discord Webhook
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-800">URL Webhook Discord</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/123456789/abc..."
                  value={form.data.discord_webhook_url}
                  onChange={(e) => form.setData("discord_webhook_url", e.target.value)}
                  className="bg-white font-mono text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestDiscord}
                  disabled={testingDiscord || !form.data.discord_webhook_url}
                  className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 shrink-0 gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>{testingDiscord ? "Menguji..." : "Uji Coba Webhook"}</span>
                </Button>
              </div>
              <p className="text-[11px] text-slate-500">
                Dapatkan URL Webhook dari Discord: Server Settings → Integrations → Webhooks → New Webhook → Copy Webhook URL.
              </p>
            </div>

            <div className="pt-1">
              <label className="p-3.5 rounded-xl border border-indigo-200 bg-white flex items-center justify-between text-xs cursor-pointer hover:bg-indigo-50/50">
                <div>
                  <span className="font-bold text-slate-900 block">Aktifkan Notifikasi Discord</span>
                  <span className="text-slate-500 text-[11px]">
                    Sistem akan mengirim pesan Rich Embed ke Discord setiap kali aktivitas dicatat.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.data.discord_notify_enabled === "true"}
                  onChange={(e) => form.setData("discord_notify_enabled", e.target.checked ? "true" : "false")}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: STUDIO PROFILE SETTINGS */}
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

        {/* SECTION 4: EMAIL REMINDER SETTINGS */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                  <Mail className="h-5 w-5 text-indigo-600" /> Pengaturan Email Peringatan H-1 (Reminder)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Atur jam eksekusi otomatis pengiriman email pengingat H-1 ke Pelanggan, Fotografer, dan MUA.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                Otomatis Harian
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2 max-w-xs">
              <Label className="flex items-center gap-1.5 font-bold text-slate-800">
                <Clock className="h-4 w-4 text-indigo-600" /> Jam Pengiriman Email (WITA / Local)
              </Label>
              <Input
                type="time"
                required
                value={form.data.reminder_email_time}
                onChange={(e) => form.setData("reminder_email_time", e.target.value)}
                className="bg-white text-base font-semibold"
              />
              <p className="text-xs text-slate-500">
                Sistem akan secara otomatis memproses dan mengirimkan email pengingat H-1 pada jam yang ditentukan ini setiap hari.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="pt-2">
          <Button type="submit" disabled={form.processing}>
            <Save />
            {form.processing ? "Menyimpan..." : "Simpan Semua Pengaturan"}
          </Button>
        </div>
      </form>
    </>
  );
}
