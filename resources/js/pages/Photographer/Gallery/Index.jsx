import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Image, Upload, CheckCircle2, FolderKanban, X } from "lucide-react";
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Galeri Project Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Unggah hasil foto karya pemotretan Anda untuk diserahkan ke Admin / Pelanggan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              Belum ada project yang ditugaskan.
            </div>
          ) : (
            safeProjects.map((project) => (
              <Card key={project.id} className="border-slate-200 shadow-xs">
                <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">{project.project_name}</CardTitle>
                    <p className="text-xs text-slate-500">{project.customer?.name} • {project.package_name}</p>
                  </div>
                  <Button size="sm" onClick={() => handleOpenUpload(project)}>
                    <Upload /> Unggah Foto
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Foto Terunggah: <strong>{project.galleries?.length || 0} File</strong></span>
                  </div>

                  {/* Thumbnail Preview */}
                  {project.galleries && project.galleries.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {project.galleries.slice(0, 4).map((g) => (
                        <div key={g.id} className="aspect-square rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={`/storage/${g.file_path}`}
                            alt={g.file_name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
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
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unggah Hasil Foto Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <p className="text-xs text-slate-600 font-semibold">
                Project: {selectedProject?.project_name}
              </p>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Pilih File Foto (Bisa Banyak)</label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  required
                  onChange={(e) => form.setData("photos", Array.from(e.target.files))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Judul / Keterangan (Opsional)</label>
                <Input
                  placeholder="misal: Edited Photos Final"
                  value={form.data.title}
                  onChange={(e) => form.setData("title", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
                  <X /> Batal
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Upload /> {form.processing ? "Mengunggah..." : "Unggah Hasil Foto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
