import React from "react";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { FolderKanban, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ projects = { data: [] } }) {
  const isNavigating = usePageLoading();

  return (
    <>
      <Head title="Project Saya" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Project Ditugaskan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar seluruh project pemotretan yang ditugaskan kepada Anda.
          </p>
        </div>

        {isNavigating ? (
          <CardGridSkeleton count={4} />
        ) : (!projects?.data || projects.data.length === 0) ? (
          <div className="text-center py-12 bg-card dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
            Belum ada project yang ditugaskan.
          </div>
        ) : (
          <div className="space-y-3">
            {(projects?.data || []).map((prj) => (
              <Card key={prj.id} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 hover:shadow-xs transition-shadow">
                <CardContent className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-bold block">{prj.project_code}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">{prj.project_name}</h3>
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>Pelanggan: <strong className="text-slate-900 dark:text-white">{prj.customer?.name}</strong></span>
                      <span>•</span>
                      <span>Paket: {prj.package_name}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0">
                    <Badge variant={
                      prj.status === "COMPLETED"  ? "success"     :
                      prj.status === "SHOOTING"   ? "warning"     :
                      prj.status === "SCHEDULED"  ? "info"        :
                      prj.status === "CANCELLED"  ? "destructive" :
                      "secondary"
                    } className="text-[10px] whitespace-nowrap py-0 px-2 h-5">
                      {getStatusLabel(prj.status)}
                    </Badge>
                    <Link href={`/photographer/projects/${prj.id}`} className="w-full sm:w-auto">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto justify-center font-semibold gap-1.5 bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <Eye className="h-3.5 w-3.5" /> Detail Project
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
