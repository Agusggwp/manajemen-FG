import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import {
  Camera,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  PieChart as PieChartIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

export default function Login() {
  const { flash } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.warning) toast.warning(flash.warning);
    if (flash?.info) toast.info(flash.info);
  }, [flash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login", {
      onError: (errs) => {
        const errorMsg = errs.email || errs.password || "Email atau kata sandi tidak valid.";
        toast.error(errorMsg);
      },
      onSuccess: () => {
        toast.success("Login berhasil! Mengalihkan...");
      },
    });
  };

  const handleQuickRole = (email, password, roleLabel) => {
    setData({ email, password });
    toast.info(`Akun demo ${roleLabel} dipilih.`);
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 md:p-8 font-sans">
      <Card className="w-full max-w-5xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-0 border-border">
        
        {/* Left Column: Form Area */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-card">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <img src="/logo.svg" alt="ARTDEVATA Logo" className="h-9 w-9 object-contain" />
              <div>
                <span className="font-bold text-base tracking-tight text-foreground block leading-tight">ARTDEVATA</span>
                <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
                  Photography Management
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Selamat Datang Kembali
              </h1>
              <p className="text-sm text-muted-foreground">
                Masukkan email dan kata sandi Anda untuk mengakses akun.
              </p>
            </div>

            {/* Developer Mode Quick Role */}
            {/* <Card className="mb-6 bg-muted/50 border-dashed">
              <CardHeader className="p-3 pb-2">
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                  Mode Developer (Quick Role):
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  onClick={() => handleQuickRole("admin@artdevata.com", "password", "Admin")}
                  className="w-full gap-1 font-semibold text-xs px-2"
                >
                  <ShieldCheck className="text-indigo-600 h-3.5 w-3.5" />
                  <span>Admin</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  onClick={() => handleQuickRole("agus@artdevata.com", "password", "Fotografer")}
                  className="w-full gap-1 font-semibold text-xs px-2"
                >
                  <Camera className="text-emerald-600 h-3.5 w-3.5" />
                  <span>Fotografer</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={processing}
                  onClick={() => handleQuickRole("sari@artdevata.com", "password", "MUA")}
                  className="w-full gap-1 font-semibold text-xs px-2"
                >
                  <Sparkles className="text-pink-600 h-3.5 w-3.5" />
                  <span>MUA</span>
                </Button>
              </CardContent>
            </Card> */}

            {/* Flash & Status Messages */}
            {flash?.success && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="leading-relaxed">{flash.success}</div>
              </div>
            )}
            {flash?.error && (
              <div className="mb-5 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{flash.error}</div>
              </div>
            )}
            {errors.email && (errors.email.includes('menunggu') || errors.email.includes('diverifikasi') || errors.email.includes('nonaktif')) && (
              <div className="mb-5 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-400 flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="leading-relaxed font-medium">{errors.email}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@artdevata.com"
                    value={data.email}
                    disabled={processing}
                    onChange={(e) => setData("email", e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                {errors.email && !errors.email.includes('menunggu') && !errors.email.includes('diverifikasi') && !errors.email.includes('nonaktif') && (
                  <p className="text-xs text-destructive font-medium">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    disabled={processing}
                    onChange={(e) => setData("password", e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={processing}
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-medium">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gap-2 font-semibold h-10 shadow-xs flex items-center justify-center"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-5 text-center text-xs text-muted-foreground">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-4"
              >
                Daftar sebagai Fotografer / MUA
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
        <div className="lg:col-span-7 p-3 lg:p-4 hidden lg:flex flex-col">
          <Card className="flex-1 bg-slate-900 text-white border-slate-800 p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden shadow-inner">
            
            {/* Header Content */}
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-transparent">
                <Sparkles className="h-3 w-3 mr-1 text-emerald-400" />
                Sistem Terintegrasi
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                Kelola tim & operasional studio tanpa hambatan.
              </h2>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Masuk untuk mengakses dashboard studio, memantau jadwal pemotretan real-time, dan mengelola operasional tim Anda.
              </p>
            </div>

            {/* Interactive Mockup Dashboard */}
            <div className="my-6 space-y-4">
              <div className="relative">
                <Card className="bg-card text-card-foreground shadow-lg border-border">
                  <CardContent className="p-4 space-y-4">
                    {/* Stat Badges / Mini Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-muted/40 border-border">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between text-muted-foreground mb-1">
                            <span className="text-[10px] uppercase font-medium">Total Booking</span>
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          </div>
                          <div className="text-sm font-bold text-foreground">Rp 189.374.000</div>
                          <Badge variant="outline" className="mt-1 text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            +12.5% bulan ini
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/40 border-border">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between text-muted-foreground mb-1">
                            <span className="text-[10px] uppercase font-medium">Durasi Rata-rata</span>
                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <div className="text-sm font-bold text-foreground">01:15:30</div>
                          <Badge variant="outline" className="mt-1 text-[9px] px-1.5 py-0 border-blue-500/30 text-blue-600 dark:text-blue-400">
                            On Schedule
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Mini Session Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-8 text-[11px] px-2">ID Sesi</TableHead>
                          <TableHead className="h-8 text-[11px] px-2">Paket / Klien</TableHead>
                          <TableHead className="h-8 text-[11px] px-2">Tanggal</TableHead>
                          <TableHead className="h-8 text-[11px] px-2 text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="py-2 px-2 text-xs font-mono text-muted-foreground">#SESI-01</TableCell>
                          <TableCell className="py-2 px-2 text-xs font-medium">Wedding Bali - Ayu</TableCell>
                          <TableCell className="py-2 px-2 text-xs text-muted-foreground">13 Feb 2026</TableCell>
                          <TableCell className="py-2 px-2 text-right">
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                              Lunas
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-2 px-2 text-xs font-mono text-muted-foreground">#SESI-02</TableCell>
                          <TableCell className="py-2 px-2 text-xs font-medium">Prewedding Kintamani</TableCell>
                          <TableCell className="py-2 px-2 text-xs text-muted-foreground">13 Feb 2026</TableCell>
                          <TableCell className="py-2 px-2 text-right">
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                              Lunas
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Overlapping Category Card */}
                <Card className="absolute -top-4 -right-2 hidden xl:block w-40 shadow-xl border-border bg-card">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-[10px] font-semibold text-muted-foreground flex justify-between items-center">
                      <span>Paket Terlaris</span>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal">Bulanan</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex items-center gap-2 mt-1">
                      <PieChartIcon className="h-5 w-5 text-emerald-500" />
                      <div>
                        <div className="text-xs font-bold">6,248 Sesi</div>
                        <div className="text-[9px] text-muted-foreground">Volume Pemotretan</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer Status Pill */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span className="text-[11px]">Sistem Manajemen Fotografi Real-Time</span>
            </div>

          </Card>
        </div>

      </Card>
    </div>
  );
}

