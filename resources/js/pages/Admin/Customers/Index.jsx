import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
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
    <>
      <Head title="Manajemen Pelanggan" />
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
          <Button onClick={handleOpenCreate} className="bg-slate-900 text-white">
            <Plus className="h-4 w-4 mr-2" /> Tambah Pelanggan
          </Button>
        </div>

        {/* Search */}
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama, nomor HP, atau email pelanggan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" onClick={handleSearch}>
                Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nama Pelanggan</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Alamat</th>
                <th className="px-4 py-3">Catatan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeCustomers.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 font-sans">
                    Belum ada data pelanggan.
                  </td>
                </tr>
              ) : (
                safeCustomers.data.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {c.name}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="flex items-center text-slate-700">
                          <Phone className="h-3 w-3 mr-1 text-slate-400" /> {c.phone}
                        </span>
                        {c.email && (
                          <span className="flex items-center text-slate-500">
                            <Mail className="h-3 w-3 mr-1 text-slate-400" /> {c.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">
                      {c.address ? (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
                          <span className="truncate">{c.address}</span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                      {c.notes || "-"}
                    </td>

                    <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-600 hover:text-slate-900"
                        onClick={() => handleOpenEdit(c)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Create/Edit Customer */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  required
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor Telepon / WhatsApp *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="08123456789"
                  value={form.data.phone}
                  onChange={(e) => form.setData("phone", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.data.email}
                  onChange={(e) => form.setData("email", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Alamat Pemotretan / Domisili</Label>
                <Textarea
                  id="address"
                  rows={2}
                  placeholder="Alamat lengkap..."
                  value={form.data.address}
                  onChange={(e) => form.setData("address", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  placeholder="Preferensi pelanggan, catatan khusus..."
                  value={form.data.notes}
                  onChange={(e) => form.setData("notes", e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
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
    </>
  );
}
