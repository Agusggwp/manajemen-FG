import React from "react";
import { useForm } from "@inertiajs/react";
import { Camera, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-slate-900 text-white rounded-2xl mb-3 shadow-md">
            <Camera className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ARTDEVATA</h1>
          <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase mt-1">
            Photography Management System
          </p>
        </div>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Masuk ke Sistem</CardTitle>
            <CardDescription>
              Silakan masukkan email dan password akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
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
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm mt-2"
                disabled={processing}
              >
                {processing ? "Memproses..." : "Masuk"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Demo Login: <br />
                <span className="font-mono text-slate-700 font-medium">admin@artdevata.com</span> / <span className="font-mono text-slate-700 font-medium">password</span> (Admin) <br />
                <span className="font-mono text-slate-700 font-medium">agus@artdevata.com</span> / <span className="font-mono text-slate-700 font-medium">password</span> (Photographer)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
