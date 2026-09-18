import React, { useState, useEffect } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import {
  Camera,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Calendar,
  Heart,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

export default function Register() {
  const { flash } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    role: "PHOTOGRAPHER",
    name: "",
    email: "",
    phone: "",
    specialty: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.warning) toast.warning(flash.warning);
    if (flash?.info) toast.info(flash.info);
  }, [flash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register", {
      onError: (errs) => {
        const firstError = Object.values(errs)[0] || "Mohon periksa kembali form pendaftaran Anda.";
        toast.error(firstError);
      },
      onSuccess: () => {
        toast.success("Pendaftaran berhasil! Silakan periksa email Anda.");
      },
    });
  };

  const isMua = data.role === "MUA";

  return (
    <>
      <Head>
        <title>{`Registrasi ${isMua ? "MUA" : "Fotografer"} - ARTDEVATA`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 md:p-8 font-sans">
        <Card className="w-full max-w-5xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-0 border-border">
          
          {/* Left Column: Form Area */}
          <div className="lg:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-card">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <img src="/logo.svg" alt="ARTDEVATA Logo" className="h-9 w-9 object-contain" />
                <div>
                  <span className="font-bold text-base tracking-tight text-foreground block leading-tight">ARTDEVATA</span>
                  <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                    Photography & MUA Management
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Pendaftaran Kru Baru
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Bergabunglah dengan tim kreatif ARTDEVATA. Pilih peran dan isi formulir di bawah ini.
                </p>
              </div>

              {/* Role Selector */}
              <div className="mb-5 space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Daftar Sebagai Peran:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setData("role", "PHOTOGRAPHER")}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      data.role === "PHOTOGRAPHER"
                        ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-600"
                        : "border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${data.role === "PHOTOGRAPHER" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>
                      <Camera className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight">Fotografer</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">Dokumentasi Foto</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setData("role", "MUA")}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      data.role === "MUA"
                        ? "border-pink-600 bg-pink-50/50 dark:bg-pink-950/30 text-pink-900 dark:text-pink-100 ring-1 ring-pink-600"
                        : "border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${data.role === "MUA" ? "bg-pink-600 text-white" : "bg-muted text-muted-foreground"}`}>
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight">Make Up Artist</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">Tata Rias & Beauty</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step Flow Banner */}
              <div className="mb-6 p-3 rounded-lg bg-muted/60 border border-border text-xs space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className={`h-3.5 w-3.5 ${isMua ? "text-pink-500" : "text-emerald-500"}`} />
                  <span>Alur Aktivasi Akun {isMua ? "MUA" : "Fotografer"}:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground text-center">
                  <div className="p-1.5 bg-background rounded border border-border/80">
                    <span className={`font-bold block ${isMua ? "text-pink-600" : "text-emerald-600"}`}>1. Isi Form</span>
                    Data Diri
                  </div>
                  <div className="p-1.5 bg-background rounded border border-border/80">
                    <span className={`font-bold block ${isMua ? "text-pink-600" : "text-emerald-600"}`}>2. Cek Email</span>
                    Aktivasi Link
                  </div>
                  <div className="p-1.5 bg-background rounded border border-border/80">
                    <span className="font-bold text-amber-600 block">3. Admin</span>
                    Persetujuan
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold">
                    {isMua ? "Nama Lengkap / Studio MUA" : "Nama Lengkap"}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={isMua ? "misal: Ni Made Sari / Sari Artistry" : "misal: I Wayan Agus"}
                      value={data.name}
                      disabled={processing}
                      onChange={(e) => setData("name", e.target.value)}
                      className="pl-9 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Alamat Email Aktif</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={isMua ? "mua@email.com" : "fotografer@email.com"}
                      value={data.email}
                      disabled={processing}
                      onChange={(e) => setData("email", e.target.value)}
                      className="pl-9 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Tautan aktivasi akun akan dikirimkan ke email ini.</p>
                  {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
                </div>

                {/* Phone & Specialty (Two columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold">Nomor WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="text"
                        placeholder="0812xxxxxxxx"
                        value={data.phone}
                        disabled={processing}
                        onChange={(e) => setData("phone", e.target.value)}
                        className="pl-9 text-xs sm:text-sm"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive font-medium">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="specialty" className="text-xs font-semibold">
                      {isMua ? "Spesialisasi Rias" : "Spesialisasi Kamera / Foto"}
                    </Label>
                    <div className="relative">
                      {isMua ? (
                        <Palette className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      )}
                      <Input
                        id="specialty"
                        type="text"
                        placeholder={isMua ? "Graduation, Bridal, Soft Glam" : "Wedding, Studio, Prewed"}
                        value={data.specialty}
                        disabled={processing}
                        onChange={(e) => setData("specialty", e.target.value)}
                        className="pl-9 text-xs sm:text-sm"
                      />
                    </div>
                    {errors.specialty && <p className="text-xs text-destructive font-medium">{errors.specialty}</p>}
                  </div>
                </div>

                {/* Password & Password Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold">Kata Sandi</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 karakter"
                        value={data.password}
                        disabled={processing}
                        onChange={(e) => setData("password", e.target.value)}
                        className="pl-9 pr-8 text-xs sm:text-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={processing}
                        className="absolute right-0 top-0 h-full px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive font-medium">{errors.password}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password_confirmation" className="text-xs font-semibold">Konfirmasi Sandi</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password_confirmation"
                        type={showPasswordConfirm ? "text" : "password"}
                        placeholder="Ulangi sandi"
                        value={data.password_confirmation}
                        disabled={processing}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        className="pl-9 pr-8 text-xs sm:text-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={processing}
                        className="absolute right-0 top-0 h-full px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      >
                        {showPasswordConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-xs text-destructive font-medium">{errors.password_confirmation}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full gap-2 font-semibold h-10 shadow-xs flex items-center justify-center mt-2 ${
                    isMua ? "bg-pink-600 hover:bg-pink-700 text-white" : ""
                  }`}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      <span>Mendaftarkan Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Sebagai {isMua ? "MUA" : "Fotografer"}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </>
                  )}
                </Button>
              </form>

              {/* Link back to login */}
              <div className="mt-5 text-center text-xs text-muted-foreground">
                Sudah memiliki akun?{" "}
                <Link
                  href="/login"
                  className={`font-semibold underline underline-offset-4 ${
                    isMua ? "text-pink-600 hover:text-pink-700" : "text-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  Masuk di sini
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Separator className="mb-4" />
              <p className="text-[11px] text-muted-foreground text-center">
                Hak Cipta © {new Date().getFullYear()} ART DEVATA. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Column: Hero Showcase */}
          <div className="lg:col-span-6 p-3 lg:p-4 hidden lg:flex flex-col">
            <Card className="flex-1 bg-slate-900 text-white border-slate-800 p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden shadow-inner">
              {/* Header Content */}
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-transparent">
                  <Sparkles className={`h-3 w-3 mr-1 ${isMua ? "text-pink-400" : "text-emerald-400"}`} />
                  Portal Khusus {isMua ? "Make Up Artist (MUA)" : "Fotografer"}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                  {isMua
                    ? "Berkolaborasi dalam sesi rias & kecantikan bersama ARTDEVATA."
                    : "Kembangkan karier fotografi Anda bersama ARTDEVATA."}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Setelah mendaftar dan akun diaktifkan oleh Admin, Anda akan mendapatkan akses ke portal manajemen jadwal dan transparansi fee.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="my-6 space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${isMua ? "bg-pink-500/20 text-pink-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Jadwal Penugasan Terintegrasi</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isMua
                        ? "Lihat detail jadwal rias pelanggan, lokasi pemotretan, dan kontak klien dengan mudah."
                        : "Lihat penugasan pemotretan pelanggan, lokasi GPS presisi, dan detail konsep acara secara langsung."}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Kolaborasi Tim yang Rapi</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isMua
                        ? "Terhubung langsung dengan tim fotografer yang bertugas dalam satu project pemotretan."
                        : "Unggah bukti awal dan selesai tugas pemotretan dengan validasi lokasi geolokasi akurat."}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Transparansi Honor & Fee</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pantau rincian fee pengerjaan, status pembayaran, serta riwayat pencairan langsung di portal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>ARTDEVATA Creative Studio</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Keamanan Terjamin
                </span>
              </div>
            </Card>
          </div>

        </Card>
      </div>
    </>
  );
}
