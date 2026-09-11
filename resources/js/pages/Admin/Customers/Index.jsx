import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useForm, router } from "@inertiajs/react";
import { Plus, Search, Users, Edit3, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Index({ customers, filters }) {
  const safeCustomers = customers?.data ? customers : { data: [] };
  const safeFilters = filters || {};

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");

  const form = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    form.reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    form.setData({
      name: c.name,
      email: c.email || "",
      phone: c.phone,
      address: c.address || "",
      notes: c.notes || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      form.put(`/admin/customers/${editingCustomer.id}`, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      form.post("/admin/customers", {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleSearch = () => {
    router.get("/admin/customers", { search }, { preserveState: true });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      router.delete(`/admin/customers/${id}`);
    }
  };

  return (
    <AdminLayout title="Manajemen Pelanggan">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Pelanggan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Database pelanggan ARTDEVATA beserta kontak dan alamat pemotretan.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-slate-900 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pelanggan Baru
          </Button>
        </div>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama, nomor HP, atau email pelanggan..."
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

        {/* Table View */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nama Pelanggan</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3 text-center">Total Project</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeCustomers.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Belum ada data pelanggan.
                  </td>
                </tr>
              ) : (
                safeCustomers.data.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center space-x-1 text-slate-800">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                        {c.email && (
                          <div className="flex items-center space-x-1 text-slate-500">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{c.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={c.address}>
                      {c.address || "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-900">
                      {c.projects_count || 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(c)} title="Edit">
                          <Edit3 className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} title="Hapus">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nama Lengkap Pelanggan</Label>
                <Input
                  required
                  placeholder="misal: Wayan Putu"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor HP / WhatsApp</Label>
                  <Input
                    required
                    placeholder="0819xxxx"
                    value={form.data.phone}
                    onChange={(e) => form.setData("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (Opsional)</Label>
                  <Input
                    type="email"
                    placeholder="pelanggan@email.com"
                    value={form.data.email}
                    onChange={(e) => form.setData("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alamat Lengkap</Label>
                <Textarea
                  placeholder="Jl. Danau Tamblingan No. 12, Sanur, Denpasar"
                  value={form.data.address}
                  onChange={(e) => form.setData("address", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-slate-900 text-white" disabled={form.processing}>
                  {form.processing ? "Menyimpan..." : "Simpan Pelanggan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
