import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Image, Upload, CheckCircle2, FolderKanban, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { usePageLoading, GalleryPageSkeleton } from "@/components/loading/PageSkeletons";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export default function Index({ projects = [] }) {
  const safeProjects = Array.isArray(projects) ? projects : (projects?.data || []);
  const isNavigating = usePageLoading();
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const form = useForm({
    photos: [],
    title: "",
    description: "",
  });

  const handleOpenUpload = (project) => {
    setSelectedProject(project);
    form.reset();
    setUploadModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    form.post(`/photographer/projects/${selectedProject.id}/gallery`, {
      onSuccess: () => setUploadModalOpen(false),
    });
  };

  if (isNavigating) {
    return <GalleryPageSkeleton />;
  }

  return (
    <>
      <Head title="Galeri Project" />
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Galeri Project Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Unggah hasil foto karya pemotretan Anda untuk diserahkan ke Admin / Pelanggan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-card dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
              Belum ada project yang ditugaskan.
            </div>
          ) : (
            safeProjects.map((project) => (
              <Card key={project.id} className="border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 shadow-xs">
                <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {project.project_name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {project.customer?.name} • {project.package_name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto shrink-0 font-semibold justify-center gap-1.5"
                    onClick={() => handleOpenUpload(project)}
                  >
                    <Upload className="h-3.5 w-3.5" /> Unggah Foto
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Foto Terunggah: <strong className="text-slate-900 dark:text-white">{project.galleries?.length || 0} File</strong></span>
                  </div>

                  {/* Thumbnail Preview */}
                  {project.galleries && project.galleries.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {project.galleries.slice(0, 4).map((g) => (
                        <div key={g.id} className="aspect-square rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <ImageWithFallback
                            src={g.file_path ? `/storage/${g.file_path}` : null}
                            alt={g.file_name}
                            fallbackIcon={Image}
                            showText={false}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Upload Modal */}
        <Dialog open={uploadModalOpen} onOpenChange={(val) => { if (!form.processing) setUploadModalOpen(val); }}>
          <DialogContent className="bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-foreground">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">Unggah Hasil Foto Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                Project: {selectedProject?.project_name}
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih File Foto (Bisa Banyak)</label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  required
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-foreground"
                  onChange={(e) => form.setData("photos", Array.from(e.target.files))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Judul / Keterangan (Opsional)</label>
                <Input
                  placeholder="misal: Edited Photos Final"
                  value={form.data.title}
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-foreground"
                  onChange={(e) => form.setData("title", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" disabled={form.processing} onClick={() => setUploadModalOpen(false)} className="mt-2 bg-card dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-foreground">
                  <X className="h-4 w-4 mr-1.5" /> <span>Batal</span>
                </Button>
                <Button type="submit" disabled={form.processing}>
                  {form.processing ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Upload className="h-4 w-4 mr-1.5" />}
                  <span>{form.processing ? "Mengunggah..." : "Unggah Hasil Foto"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
