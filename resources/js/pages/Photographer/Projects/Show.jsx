import React from "react";
import PhotographerLayout from "@/layouts/PhotographerLayout";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Clock, MapPin, DollarSign, Camera, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Show({ project, mySalary }) {
  return (
    <PhotographerLayout title={`Detail Project - ${project.project_name}`}>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Link href="/photographer/projects">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <span className="font-mono text-xs text-slate-400 font-bold">{project.project_code}</span>
            <h1 className="text-xl font-bold text-slate-900">{project.project_name}</h1>
          </div>
        </div>

        {/* Own Salary Card */}
        {mySalary && (
          <Card className="bg-slate-900 text-white shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Gaji Project Saya</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{formatRupiah(mySalary.amount)}</p>
              </div>
              <Badge variant={mySalary.payment_status === "PAID" ? "success" : "warning"}>
                {mySalary.payment_status}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Project Info */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Informasi Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 text-xs uppercase font-medium block">Pelanggan</span>
                <strong className="text-slate-900">{project.customer?.name}</strong>
                <p className="text-xs text-slate-500">{project.customer?.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 text-xs uppercase font-medium block">Paket Foto</span>
                <strong className="text-slate-900">{project.package_name}</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Durasi Kerja Project:</span>
              <span className="font-bold text-slate-900 text-sm">{project.formatted_work_duration}</span>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{project.location_name}</span>
              </div>
              <p className="text-xs text-slate-600 pl-6">{project.location_address}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PhotographerLayout>
  );
}
