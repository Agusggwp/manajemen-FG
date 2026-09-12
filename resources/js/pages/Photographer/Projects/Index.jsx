import React from "react";
import { formatDate } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { FolderKanban, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Index({ projects = { data: [] } }) {
  return (
    <>
      <Head title="Project Saya" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Project Ditugaskan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh project pemotretan yang ditugaskan kepada Anda.
          </p>
        </div>

        <div className="space-y-3">
          {(!projects?.data || projects.data.length === 0) ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              Belum ada project yang ditugaskan.
            </div>
          ) : (
            (projects?.data || []).map((prj) => (
              <Card key={prj.id} className="border-slate-200 hover:shadow-xs transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-slate-400 font-bold block">{prj.project_code}</span>
                    <h3 className="font-bold text-slate-900 text-base">{prj.project_name}</h3>
                    <div className="text-xs text-slate-600 flex items-center space-x-3">
                      <span>Pelanggan: {prj.customer?.name}</span>
                      <span>•</span>
                      <span>Paket: {prj.package_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 justify-between sm:justify-end">
                    <Badge variant={prj.status === "COMPLETED" ? "success" : "warning"}>
                      {prj.status}
                    </Badge>
                    <Link href={`/photographer/projects/${prj.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye /> Detail Project
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
