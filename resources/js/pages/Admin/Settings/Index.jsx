import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import {
  Settings,
  Save,
  Globe,
  Palette,
  Sparkles,
  MessageCircle,
  Mail,
  Clock,
  Bell,
  Send,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";

export default function Index({ settings }) {
  const [testingDiscord, setTestingDiscord] = useState(false);
  const { theme: currentAppTheme, setTheme: setAppTheme } = useTheme();

  const form = useForm({
    company_name: settings?.company_name || "ARTDEVATA Photography",
    company_phone: settings?.company_phone || "081999888777",
    company_address: settings?.company_address || "Denpasar, Bali",
    default_location_radius: settings?.default_location_radius || 100,
    reminder_email_time: settings?.reminder_email_time || "08:00",

    // Portal App Theme Setting
    app_theme: settings?.app_theme || currentAppTheme || "light",

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

  const handleAppThemeSelect = (mode) => {
    form.setData("app_theme", mode);
    setAppTheme(mode);
    const modeLabel = mode === "light" ? "Terang (Light)" : mode === "dark" ? "Gelap (Dark)" : "Sistem (Otomatis)";
    toast.success(`Tema aplikasi portal berhasil diubah ke mode ${modeLabel}.`);
  };

  const handlePublicThemeSelect = (mode) => {
    form.setData("public_theme_mode", mode);
    const modeLabel = mode === "dark" ? "Deep Green IT Agency & Mint Glow (Dark)" : "White & Deep Emerald (Light)";
    toast.info(`Tema katalog publik dipilih: ${modeLabel}. Klik "Simpan Semua Pengaturan" untuk menerapkan.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post("/admin/settings", {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Pengaturan dan tema berhasil disimpan!");
      },
    });
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
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Pengaturan Sistem & Tampilan Tema
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Konfigurasi tema portal internal, tema web katalog publik (/), profil studio, reminder, dan integrasi webhook.
            </p>
          </div>
          <Button type="submit" disabled={form.processing} className="shrink-0">
            {form.processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                <span>Simpan Semua Pengaturan</span>
              </>
            )}
          </Button>
        </div>

        {/* SECTION 1: TEMA APLIKASI PORTAL (ADMIN & FOTOGRAFER) */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card text-card-foreground">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Tema Aplikasi Portal (Admin & Fotografer)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pilih mode tampilan untuk seluruh halaman portal internal (Dashboard, Jadwal, Project, Bukti Foto, Gaji, dll).
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40">
                Pratinjau Instan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Option 1: Light */}
              <div
                onClick={() => handleAppThemeSelect("light")}
                className={`p-4 rounded-xl border text-sm flex flex-col justify-between cursor-pointer transition-all ${
                  currentAppTheme === "light"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                    <Sun className="h-5 w-5" />
                  </div>
                  {currentAppTheme === "light" && (
                    <Badge className="bg-indigo-600 text-white text-[10px] py-0 px-2 h-5">Aktif</Badge>
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Mode Terang (Light)</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Tampilan putih bersih dengan kontras optimal untuk bekerja di kondisi terang.
                  </span>
                </div>
              </div>

              {/* Option 2: Dark */}
              <div
                onClick={() => handleAppThemeSelect("dark")}
                className={`p-4 rounded-xl border text-sm flex flex-col justify-between cursor-pointer transition-all ${
                  currentAppTheme === "dark"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-900 dark:bg-slate-800 text-blue-400 border border-slate-700 flex items-center justify-center">
                    <Moon className="h-5 w-5" />
                  </div>
                  {currentAppTheme === "dark" && (
                    <Badge className="bg-indigo-600 text-white text-[10px] py-0 px-2 h-5">Aktif</Badge>
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Mode Gelap (Dark)</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Tampilan hitam elegan yang nyaman di mata untuk penggunaan jangka panjang.
                  </span>
                </div>
              </div>

              {/* Option 3: System */}
              <div
                onClick={() => handleAppThemeSelect("system")}
                className={`p-4 rounded-xl border text-sm flex flex-col justify-between cursor-pointer transition-all ${
                  currentAppTheme === "system"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <Laptop className="h-5 w-5" />
                  </div>
                  {currentAppTheme === "system" && (
                    <Badge className="bg-indigo-600 text-white text-[10px] py-0 px-2 h-5">Aktif</Badge>
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Sistem (Otomatis)</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                    Menyesuaikan tema terang/gelap secara otomatis mengikuti pengaturan OS perangkat Anda.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: TEMA & TAMPILAN WEB PUBLIK (/) */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card text-card-foreground">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> Tampilan & Tema Web Publik (/)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Atur tema visual, copywriting hero, tombol kontak WhatsApp, dan filter pada landing page katalog paket foto publik.
                </CardDescription>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Buka Landing Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Public Theme Cards Selector */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-800 dark:text-slate-200">
                Pilih Tema Visual Web Publik
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <div
                  onClick={() => handlePublicThemeSelect("light")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    form.data.public_theme_mode === "light"
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-600/30"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-center text-emerald-700">
                        <Sun className="h-4 w-4 text-amber-500" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Mode Terang (Clean White & Emerald)
                      </span>
                    </div>
                    {form.data.public_theme_mode === "light" && (
                      <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-2 h-5">Terpilih</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latar belakang putih bersih dengan aksen hijau zamrud elegan. Memberikan kesan fresh, terang, dan minimalis.
                  </p>
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => handlePublicThemeSelect("dark")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    form.data.public_theme_mode === "dark"
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-600/30"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-slate-950 border border-slate-800 shadow-xs flex items-center justify-center text-emerald-400">
                        <Moon className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Mode Gelap (Deep Green IT Agency & Mint)
                      </span>
                    </div>
                    {form.data.public_theme_mode === "dark" && (
                      <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-2 h-5">Terpilih</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Latar belakang hijau gelap mendalam (Dark Forest) dengan aksen mint glow neon. Tampilan modern, eksklusif, dan kontras tinggi.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hero Badge / Tagline Kecil</Label>
                <Input
                  value={form.data.public_hero_badge}
                  onChange={(e) => form.setData("public_hero_badge", e.target.value)}
                  placeholder="Contoh: Dokumentasi Fotografi & MUA Profesional di Bali"
                />
              </div>

              <div className="space-y-2">
                <Label>Nomor WhatsApp Reservasi / CS</Label>
                <Input
                  value={form.data.public_whatsapp_number}
                  onChange={(e) => form.setData("public_whatsapp_number", e.target.value)}
                  placeholder="Contoh: 6281999888777 (Gunakan awalan 62)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Judul Utama Hero (Hero Title)</Label>
              <Input
                value={form.data.public_hero_title}
                onChange={(e) => form.setData("public_hero_title", e.target.value)}
                placeholder="Contoh: Abadikan Setiap Momen Istimewa Anda"
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Subtitle Hero</Label>
              <Textarea
                rows={2}
                value={form.data.public_hero_subtitle}
                onChange={(e) => form.setData("public_hero_subtitle", e.target.value)}
                placeholder="Tuliskan deskripsi ringkas mengenai layanan studio Anda..."
              />
            </div>

            <div className="space-y-2">
              <Label>Judul Banner Konsultasi / CTA Bawah</Label>
              <Input
                value={form.data.public_cta_title}
                onChange={(e) => form.setData("public_cta_title", e.target.value)}
                placeholder="Contoh: Butuh Penawaran Custom atau Diskusi Lokasi?"
              />
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Tampilkan Kolom Pencarian</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Memungkinkan pengunjung mencari paket berdasarkan kata kunci nama / deskripsi.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.data.public_show_search === "true"}
                  onChange={(e) => form.setData("public_show_search", e.target.checked ? "true" : "false")}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Tampilkan Tab Kategori</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Menampilkan filter tab kategori paket foto (Wisuda, Pernikahan, Prewedding, dll).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.data.public_show_categories === "true"}
                  onChange={(e) => form.setData("public_show_categories", e.target.checked ? "true" : "false")}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: DISCORD WEBHOOK LOG INTEGRATION */}
        <Card className="border-indigo-200 dark:border-indigo-900/50 shadow-2xs bg-indigo-50/20 dark:bg-indigo-950/20">
          <CardHeader className="bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
                  <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Integrasi Discord Webhook Log
                </CardTitle>
                <CardDescription className="text-xs text-indigo-700/80 dark:text-indigo-400/80 mt-1">
                  Kirimkan notifikasi log aktivitas sistem (Login, CRUD, Dev Tools, Reset Password) secara real-time ke channel Discord Anda.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900">
                Live Discord Webhook
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-800 dark:text-slate-200">URL Webhook Discord</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/123456789/abc..."
                  value={form.data.discord_webhook_url}
                  onChange={(e) => form.setData("discord_webhook_url", e.target.value)}
                  className="bg-white dark:bg-slate-950 font-mono text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestDiscord}
                  disabled={testingDiscord || !form.data.discord_webhook_url}
                  className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 shrink-0 gap-1.5"
                >
                  {testingDiscord ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menguji...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Uji Coba Webhook</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dapatkan URL Webhook dari Discord: Server Settings → Integrations → Webhooks → New Webhook → Copy Webhook URL.
              </p>
            </div>

            <div className="pt-1">
              <label className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 flex items-center justify-between text-xs cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Aktifkan Notifikasi Discord</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Sistem akan mengirim pesan Rich Embed ke Discord setiap kali aktivitas dicatat.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.data.discord_notify_enabled === "true"}
                  onChange={(e) => form.setData("discord_notify_enabled", e.target.checked ? "true" : "false")}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: STUDIO PROFILE SETTINGS */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card text-card-foreground">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Settings className="h-5 w-5 text-slate-700 dark:text-slate-300" /> Profil Studio & Validasi GPS
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* SECTION 5: EMAIL REMINDER SETTINGS */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card text-card-foreground">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Pengaturan Email Peringatan H-1 (Reminder)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Atur jam eksekusi otomatis pengiriman email pengingat H-1 ke Pelanggan, Fotografer, dan MUA.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40">
                Otomatis Harian
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2 max-w-xs">
              <Label className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Jam Pengiriman Email (WITA / Local)
              </Label>
              <Input
                type="time"
                required
                value={form.data.reminder_email_time}
                onChange={(e) => form.setData("reminder_email_time", e.target.value)}
                className="bg-white dark:bg-slate-950 text-base font-semibold"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistem akan secara otomatis memproses dan mengirimkan email pengingat H-1 pada jam yang ditentukan ini setiap hari.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end">
          <Button type="submit" disabled={form.processing} size="lg" className="min-w-[160px]">
            {form.processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Simpan Semua Pengaturan</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
