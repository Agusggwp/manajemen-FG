import React, { useState, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Plus, Search, Camera, Edit3, Trash2, Phone, Mail, UserCheck, MoreVertical, X, Save } from "lucide-react";
import { getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ photographers, filters }) {
  const safePhotographers = photographers?.data ? photographers : { data: [] };
  const safeFilters = filters || {};

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhotographer, setEditingPhotographer] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const form = useForm({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    specialty: "",
    bio: "",
    status: "ACTIVE",
  });

  const handleOpenCreate = () => {
    setEditingPhotographer(null);
    form.reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPhotographer(p);
    form.setData({
      name: p.name,
      email: p.email,
      password: "",
      phone: p.phone || "",
      address: p.address || "",
      specialty: p.specialty || "",
      bio: p.bio || "",
      status: p.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPhotographer) {
      form.put(`/admin/photographers/${editingPhotographer.id}`, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      form.post("/admin/photographers", {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      router.get("/admin/photographers", { search: val }, {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      });
    }, 500);
  };

  const handleDeleteClick = (photographer) => {
    setDeleteTarget(photographer);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/photographers/${deleteTarget.id}`, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  const isLoading = isNavigating || isSearching;

  return (
    <>
      <Head title="Manajemen Photographer" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Photographer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kelola tim photographer internal ARTDEVATA dan kredensial login portal.
            </p>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="font-semibold gap-1.5 text-xs w-full sm:w-auto shrink-0">
            <Plus className="h-4 w-4" />
            Tambah Photographer Baru
          </Button>
        </div>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-3 sm:p-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama, email, atau spesialisasi photographer..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 bg-white text-xs sm:text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Grid List or Skeleton */}
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : safePhotographers.data.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            Belum ada data Photographer.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safePhotographers.data.map((p) => (
              <Card key={p.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                        <Camera className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                        <p className="text-xs text-slate-500">{p.specialty || "General Photographer"}</p>
                      </div>
                    </div>
                    <Badge variant={p.status === "ACTIVE" ? "success" : "secondary"}>
                      {getStatusLabel(p.status)}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{p.email}</span>
                    </div>
                    {p.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{p.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Project Ditugaskan: <strong className="text-slate-900">{p.projects_count || 0}</strong>
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-600 hover:text-slate-900 focus-visible:ring-1"
                          title="Aksi Photographer"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 shadow-md">
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(p)}
                          className="cursor-pointer text-xs"
                        >
                          <Edit3 className="mr-2 h-3.5 w-3.5 text-slate-600" />
                          <span>Edit Data</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(p)}
                          className="cursor-pointer text-xs text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5 text-red-600" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Form */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPhotographer ? "Edit Photographer" : "Tambah Photographer Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input
                  required
                  placeholder="misal: Agus Photographer"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email (Untuk Login Portal)</Label>
                  <Input
                    type="email"
                    required
                    placeholder="agus@artdevata.com"
                    value={form.data.email}
                    onChange={(e) => form.setData("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{editingPhotographer ? "Password Baru (Opsional)" : "Password"}</Label>
                  <Input
                    type="password"
                    required={!editingPhotographer}
                    placeholder="••••••••"
                    value={form.data.password}
                    onChange={(e) => form.setData("password", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor HP / WA</Label>
                  <Input
                    placeholder="0812xxxx"
                    value={form.data.phone}
                    onChange={(e) => form.setData("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Spesialisasi</Label>
                  <Input
                    placeholder="misal: Graduation, Wedding"
                    value={form.data.specialty}
                    onChange={(e) => form.setData("specialty", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.data.status || "ACTIVE"}
                  onValueChange={(val) => form.setData("status", val)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  <X /> Batal
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Save />
                  {form.processing ? "Menyimpan..." : "Simpan Photographer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus Data Photographer"
          description={`Apakah Anda yakin ingin menghapus photographer "${deleteTarget?.name}"? Akun dan akses penugasan akan dihapus.`}
          confirmText="Hapus Photographer"
          cancelText="Batal"
          variant="destructive"
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
