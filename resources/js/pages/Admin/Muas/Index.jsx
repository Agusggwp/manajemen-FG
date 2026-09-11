import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useForm, router, Link } from "@inertiajs/react";
import { Plus, Search, Sparkles, Edit3, Trash2, Eye, Phone, MapPin } from "lucide-react";
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

export default function Index({ muas, filters }) {
  const safeMuas = muas?.data ? muas : { data: [] };
  const safeFilters = filters || {};

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMua, setEditingMua] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");

  const form = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialty: "",
    bio: "",
    status: "ACTIVE",
    notes: "",
  });

  const handleOpenCreate = () => {
    setEditingMua(null);
    form.reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (mua) => {
    setEditingMua(mua);
    form.setData({
      name: mua.name,
      email: mua.email || "",
      phone: mua.phone,
      address: mua.address || "",
      specialty: mua.specialty || "",
      bio: mua.bio || "",
      status: mua.status,
      notes: mua.notes || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMua) {
      form.put(`/admin/muas/${editingMua.id}`, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      form.post("/admin/muas", {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleSearch = () => {
    router.get("/admin/muas", { search }, { preserveState: true });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data MUA ini?")) {
      router.delete(`/admin/muas/${id}`);
    }
  };

  return (
    <AdminLayout title="Manajemen MUA">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Make Up Artist (MUA)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola data partner MUA, spesialisasi, dan riwayat penugasan project.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-slate-900 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah MUA Baru
          </Button>
        </div>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama, nomor HP, atau spesialisasi MUA..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" onClick={handleSearch}>
                Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MUA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeMuas.data.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              Belum ada data Make Up Artist (MUA).
            </div>
          ) : (
            safeMuas.data.map((mua) => (
              <Card key={mua.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{mua.name}</h3>
                        <p className="text-xs text-slate-500">{mua.specialty || "General MUA"}</p>
                      </div>
                    </div>
                    <Badge variant={mua.status === "ACTIVE" ? "success" : "secondary"}>
                      {mua.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{mua.phone}</span>
                    </div>
                    {mua.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate">{mua.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Total Project: <strong className="text-slate-900">{mua.projects_count || 0}</strong>
                    </span>
                    <div className="flex space-x-1">
                      <Link href={`/admin/muas/${mua.id}`}>
                        <Button variant="ghost" size="icon" title="Lihat Detail">
                          <Eye className="h-4 w-4 text-slate-600" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(mua)} title="Edit">
                        <Edit3 className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(mua.id)} title="Hapus">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
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
                {editingMua ? "Edit Data MUA" : "Tambah MUA Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nama Lengkap MUA</Label>
                <Input
                  required
                  placeholder="misal: Sari MUA Bali"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor WhatsApp / HP</Label>
                  <Input
                    required
                    placeholder="0812xxxx"
                    value={form.data.phone}
                    onChange={(e) => form.setData("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (Opsional)</Label>
                  <Input
                    type="email"
                    placeholder="mua@email.com"
                    value={form.data.email}
                    onChange={(e) => form.setData("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Spesialisasi Makeup</Label>
                  <Input
                    placeholder="misal: Graduation, Bridal, Glam"
                    value={form.data.specialty}
                    onChange={(e) => form.setData("specialty", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                    value={form.data.status}
                    onChange={(e) => form.setData("status", e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alamat / Dominasi Area</Label>
                <Input
                  placeholder="misal: Denpasar, Bali"
                  value={form.data.address}
                  onChange={(e) => form.setData("address", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Catatan Tambahan</Label>
                <Textarea
                  placeholder="Catatan internal..."
                  value={form.data.notes}
                  onChange={(e) => form.setData("notes", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-slate-900 text-white" disabled={form.processing}>
                  {form.processing ? "Menyimpan..." : "Simpan MUA"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
