import React, { useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

export default function ForgotPassword() {
  const { flash } = usePage().props;

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    email: "",
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.warning) toast.warning(flash.warning);
    if (flash?.info) toast.info(flash.info);
  }, [flash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/forgot-password", {
      onError: (errs) => {
        const errorMsg = errs.email || "Gagal mengirimkan tautan reset password.";
        toast.error(errorMsg);
      },
      onSuccess: () => {
        toast.success("Instruksi reset password berhasil dikirim!");
      },
    });
  };

  return (
    <>
      <Head title="Lupa Password" />

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
              Lupa Kata Sandi?
            </h1>
            <p className="text-sm text-muted-foreground">
              Masukkan alamat email Anda di bawah ini. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
            </p>
          </div>

          {recentlySuccessful && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Tautan Terkirim!</span>
                Silakan periksa email Anda (termasuk folder spam) untuk melanjutkan pembuatan password baru.
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Terdaftar</Label>
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
                  autoFocus
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2 font-semibold bg-slate-900 hover:bg-slate-800" disabled={processing}>
              <span>{processing ? "Mengirim Tautan..." : "Kirim Tautan Reset Password"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 text-center">
            <Separator className="mb-4" />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Halaman Login</span>
            </Link>
          </div>

        </Card>
      </div>
    </>
  );
}
