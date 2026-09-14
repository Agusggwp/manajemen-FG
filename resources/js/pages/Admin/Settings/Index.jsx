import React, { useState } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
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
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
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
      <Head title="Pengaturan Sistem & Tampilan" />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card dark:bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span>Pengaturan Sistem & Tampilan</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kelola tema portal, visual web publik (/), profil studio, jadwal reminder, dan integrasi webhook Discord.
            </p>
          </div>
          <Button type="submit" disabled={form.processing}>
            {form.processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Semua</span>
              </>
            )}
          </Button>
        </div>

        {/* 2-Column Responsive Layout for Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: VISUAL THEMES & PUBLIC WEB CUSTOMIZATION (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* SECTION 1: TEMA APLIKASI PORTAL */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                      <span>Tema Aplikasi Portal (Admin & Fotografer)</span>
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pilih tema untuk halaman dashboard, jadwal, project, bukti foto, dan gaji.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-[10px] hidden sm:inline-flex">
                    Pratinjau Instan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Light */}
                  <div
                    onClick={() => handleAppThemeSelect("light")}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm flex flex-col justify-between cursor-pointer transition-all ${currentAppTheme === "light"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                        <Sun className="h-4 w-4" />
                      </div>
                      {currentAppTheme === "light" && (
                        <Badge className="bg-indigo-600 text-white text-[9px] py-0 px-1.5 h-4">Aktif</Badge>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">Mode Terang</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-tight">
                        Putih bersih, kontras tinggi di ruang terang.
                      </span>
                    </div>
                  </div>

                  {/* Option 2: Dark */}
                  <div
                    onClick={() => handleAppThemeSelect("dark")}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm flex flex-col justify-between cursor-pointer transition-all ${currentAppTheme === "dark"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-slate-800 text-blue-400 border border-slate-700 flex items-center justify-center">
                        <Moon className="h-4 w-4" />
                      </div>
                      {currentAppTheme === "dark" && (
                        <Badge className="bg-indigo-600 text-white text-[9px] py-0 px-1.5 h-4">Aktif</Badge>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">Mode Gelap</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-tight">
                        Hitam elegan, nyaman di mata durasi panjang.
                      </span>
                    </div>
                  </div>

                  {/* Option 3: System */}
                  <div
                    onClick={() => handleAppThemeSelect("system")}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm flex flex-col justify-between cursor-pointer transition-all ${currentAppTheme === "system"
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <Laptop className="h-4 w-4" />
                      </div>
                      {currentAppTheme === "system" && (
                        <Badge className="bg-indigo-600 text-white text-[9px] py-0 px-1.5 h-4">Aktif</Badge>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">Otomatis (OS)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-tight">
                        Mengikuti preferensi terang/gelap sistem OS.
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: TAMPILAN & TEMA WEB PUBLIK (/) */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                      <span>Tampilan & Tema Web Publik (/)</span>
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Atur tema warna, copywriting hero, kontak WhatsApp, dan filter katalog publik.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-5">
                {/* Public Theme Cards Selector */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pilihan Tema Katalog Publik
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Light Mode Card */}
                    <div
                      onClick={() => handlePublicThemeSelect("light")}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${form.data.public_theme_mode === "light"
                        ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-600/30 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-emerald-700">
                            <Sun className="h-4 w-4 text-amber-500" />
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            Mode Terang (Clean White)
                          </span>
                        </div>
                        {form.data.public_theme_mode === "light" && (
                          <Badge className="bg-emerald-600 text-white text-[9px] py-0 px-1.5 h-4">Terpilih</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Latar belakang putih bersih dengan aksen emerald green. Fresh, terang, dan minimalis.
                      </p>
                    </div>

                    {/* Dark Mode Card */}
                    <div
                      onClick={() => handlePublicThemeSelect("dark")}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${form.data.public_theme_mode === "dark"
                        ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-600/30 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-slate-950 border border-slate-800 shadow-2xs flex items-center justify-center text-emerald-400">
                            <Moon className="h-4 w-4 text-emerald-400" />
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            Mode Gelap (Deep Green Mint)
                          </span>
                        </div>
                        {form.data.public_theme_mode === "dark" && (
                          <Badge className="bg-emerald-600 text-white text-[9px] py-0 px-1.5 h-4">Terpilih</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Latar hijau gelap mendalam (*Dark Forest*) dengan aksen *mint glow neon*. Eksklusif & modern.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hero Settings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Hero Badge / Tagline Atas</Label>
                    <Input
                      value={form.data.public_hero_badge}
                      onChange={(e) => form.setData("public_hero_badge", e.target.value)}
                      placeholder="Contoh: Dokumentasi Fotografi & MUA Profesional di Bali"
                      className="text-xs bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Nomor WhatsApp Reservasi / CS</Label>
                    <Input
                      value={form.data.public_whatsapp_number}
                      onChange={(e) => form.setData("public_whatsapp_number", e.target.value)}
                      placeholder="Contoh: 6281999888777 (Awalan 62)"
                      className="text-xs bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Judul Utama Hero (Hero Title)</Label>
                  <Input
                    value={form.data.public_hero_title}
                    onChange={(e) => form.setData("public_hero_title", e.target.value)}
                    placeholder="Contoh: Abadikan Setiap Momen Istimewa Anda"
                    className="text-xs bg-white dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Deskripsi Subtitle Hero</Label>
                  <Textarea
                    rows={2}
                    value={form.data.public_hero_subtitle}
                    onChange={(e) => form.setData("public_hero_subtitle", e.target.value)}
                    placeholder="Tuliskan deskripsi ringkas mengenai layanan studio Anda..."
                    className="text-xs bg-white dark:bg-slate-950 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Judul Banner Konsultasi / CTA Bawah</Label>
                  <Input
                    value={form.data.public_cta_title}
                    onChange={(e) => form.setData("public_cta_title", e.target.value)}
                    placeholder="Contoh: Butuh Penawaran Custom atau Diskusi Lokasi?"
                    className="text-xs bg-white dark:bg-slate-950"
                  />
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Kolom Pencarian</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        Cari paket dengan kata kunci
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.data.public_show_search === "true"}
                      onChange={(e) => form.setData("public_show_search", e.target.checked ? "true" : "false")}
                      className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                  </label>

                  <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Tab Kategori Paket</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        Filter tab Wisuda, Wedding, dll
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

                {/* Portfolio Shortcut Banner */}
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Galeri Portofolio & Perlengkapan Studio
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Upload foto hasil karya & banner portofolio di menu khusus.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/admin/portfolios"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-2xs"
                  >
                    <span>Buka Portofolio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: STUDIO PROFILE, REMINDER, DISCORD WEBHOOK (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* SECTION 3: PROFIL STUDIO & VALIDASI GPS */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 p-4 sm:p-5">
                <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                  <span>Profil Studio & Validasi GPS</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Informasi kontak studio & radius toleransi GPS presensi.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nama Studio / Perusahaan</Label>
                  <Input
                    value={form.data.company_name}
                    onChange={(e) => form.setData("company_name", e.target.value)}
                    className="text-xs bg-white dark:bg-slate-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Telepon Studio</Label>
                    <Input
                      value={form.data.company_phone}
                      onChange={(e) => form.setData("company_phone", e.target.value)}
                      className="text-xs bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Radius GPS (Meter)</Label>
                    <Input
                      type="number"
                      min="10"
                      max="1000"
                      value={form.data.default_location_radius}
                      onChange={(e) => form.setData("default_location_radius", e.target.value)}
                      className="text-xs bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Alamat Studio</Label>
                  <Input
                    value={form.data.company_address}
                    onChange={(e) => form.setData("company_address", e.target.value)}
                    className="text-xs bg-white dark:bg-slate-950"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SECTION 4: EMAIL REMINDER SETTINGS */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-2xs bg-card dark:bg-slate-900">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Email Pengingat H-1 (Reminder)</span>
                  </CardTitle>
                  <Badge variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 text-[10px]">
                    Otomatis
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Jam pengiriman email otomatis ke Pelanggan, FG, dan MUA.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Jam Eksekusi Harian (WITA / Local)</span>
                  </Label>
                  <Input
                    type="time"
                    required
                    value={form.data.reminder_email_time}
                    onChange={(e) => form.setData("reminder_email_time", e.target.value)}
                    className="bg-white dark:bg-slate-950 text-sm font-semibold max-w-[140px]"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sistem otomatis mengirim email pengingat H-1 pada jam ini setiap hari.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 5: DISCORD WEBHOOK LOG INTEGRATION */}
            <Card className="border-indigo-200 dark:border-indigo-900/50 shadow-2xs bg-indigo-50/20 dark:bg-indigo-950/20">
              <CardHeader className="bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Integrasi Discord Webhook</span>
                  </CardTitle>
                  <Badge variant="outline" className="border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 text-[10px]">
                    Live Webhook
                  </Badge>
                </div>
                <CardDescription className="text-xs text-indigo-700/80 dark:text-indigo-400/80 mt-0.5">
                  Kirim notifikasi log aktivitas sistem secara real-time ke Discord.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-slate-800 dark:text-slate-200">URL Webhook Discord</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={form.data.discord_webhook_url}
                      onChange={(e) => form.setData("discord_webhook_url", e.target.value)}
                      className="bg-white dark:bg-slate-950 font-mono text-[11px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTestDiscord}
                      disabled={testingDiscord || !form.data.discord_webhook_url}
                      className="w-full bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 gap-1.5 text-xs font-semibold"
                    >
                      {testingDiscord ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Menguji Webhook...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>Uji Coba Kirim Pesan Webhook</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-900 flex items-center justify-between text-xs cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block text-xs">Aktifkan Notifikasi Discord</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        Kirim Rich Embed saat aktivitas dicatat
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

            {/* Bottom Save Action Box */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Simpan Perubahan</span>
                <span className="text-[11px] text-slate-400">Pastikan data sudah sesuai</span>
              </div>
              <Button type="submit" disabled={form.processing} size="lg">
                {form.processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan Pengaturan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Semua Pengaturan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}