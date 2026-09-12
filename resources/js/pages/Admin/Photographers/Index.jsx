import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Plus, Search, Camera, Edit3, Trash2, Phone, Mail, UserCheck, MoreVertical, X, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Index({ photographers, filters }) {
  const safePhotographers = photographers?.data ? photographers : { data: [] };
  const safeFilters = filters || {};

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhotographer, setEditingPhotographer] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");

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

  const handleSearch = () => {
    router.get("/admin/photographers", { search }, { preserveState: true });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus photographer ini?")) {
      router.delete(`/admin/photographers/${id}`);
    }
  };

  return (
    <>
      <Head title="Manajemen Photographer" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Photographer
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola tim tim photographer internal ARTDEVATA dan kredensial login portal.
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus />
            Tambah Photographer Baru
          </Button>
        </div>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama, email, atau spesialisasi photographer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" onClick={handleSearch}>
                <Search /> Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safePhotographers.data.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              Belum ada data Photographer.
            </div>
          ) : (
            safePhotographers.data.map((p) => (
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
                      {p.status}
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
                          onClick={() => handleDelete(p.id)}
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
            ))
          )}
        </div>

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
      </div>
    </>
  );
}
