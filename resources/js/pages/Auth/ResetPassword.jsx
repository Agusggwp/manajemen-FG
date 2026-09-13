import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

export default function ResetPassword({ token, email: initialEmail }) {
  const { flash } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token || "",
    email: initialEmail || "",
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
    post("/reset-password", {
      onError: (errs) => {
        const errorMsg =
          errs.password || errs.email || errs.token || "Gagal memperbarui password.";
        toast.error(errorMsg);
      },
      onSuccess: () => {
        toast.success("Password berhasil diperbarui! Mengalihkan...");
      },
    });
  };

  return (
    <>
      <Head title="Reset Password" />

      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 md:p-8 font-sans">
        <Card className="w-full max-w-md shadow-xl overflow-hidden p-6 sm:p-8 border-border bg-card">
          
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
              Buat Kata Sandi Baru
            </h1>
            <p className="text-sm text-muted-foreground">
              Masukkan password baru untuk akun Anda. Minimal 8 karakter.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="token" value={data.token} />

            <div className="space-y-2">
              <Label htmlFor="email">Email Akun</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@artdevata.com"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="pl-9 pr-9"
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
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

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  className="pl-9 pr-9"
                  required
                />
              </div>
              {errors.password_confirmation && (
                <p className="text-xs text-destructive font-medium">{errors.password_confirmation}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gap-2 font-semibold h-10 shadow-xs flex items-center justify-center bg-slate-900 hover:bg-slate-800"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Menyimpan Password...</span>
                </>
              ) : (
                <>
                  <span>Simpan Password Baru</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 text-center">
            <Separator className="mb-4" />
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Batal & Kembali ke Halaman Login
            </Link>
          </div>

        </Card>
      </div>
    </>
  );
}
