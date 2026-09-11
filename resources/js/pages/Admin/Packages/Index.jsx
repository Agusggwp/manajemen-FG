import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatRupiah } from "@/lib/utils";
import { useForm, router } from "@inertiajs/react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Copy,
  Power,
  Trash2,
  Edit3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Index({ packages, filters, categories }) {
  const safePackages = packages?.data ? packages : { data: [] };
  const safeFilters = {
    search: filters?.search ?? "",
    category: filters?.category ?? "",
    status: filters?.status ?? "",
    sort: filters?.sort ?? "created_at",
    direction: filters?.direction ?? "desc",
  };
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [search, setSearch] = useState(safeFilters.search);
  const [category, setCategory] = useState(safeFilters.category);
  const [sortBy, setSortBy] = useState(safeFilters.sort);

  const form = useForm({
    name: "",
    category: "Graduation",
    price: 0,
    duration_minutes: 60,
    number_of_photos: 25,
    number_of_photographers: 1,
    includes_mua: false,
    estimated_photographer_cost: 0,
    estimated_mua_fee: 0,
    estimated_operational_cost: 0,
    description: "",
    status: "ACTIVE",
  });

  const handleOpenCreate = () => {
    setEditingPackage(null);
    form.reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    form.setData({
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      duration_minutes: pkg.duration_minutes,
      number_of_photos: pkg.number_of_photos,
      number_of_photographers: pkg.number_of_photographers,
      includes_mua: pkg.includes_mua,
      estimated_photographer_cost: pkg.estimated_photographer_cost,
      estimated_mua_fee: pkg.estimated_mua_fee,
      estimated_operational_cost: pkg.estimated_operational_cost,
      description: pkg.description || "",
      status: pkg.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      form.put(`/admin/packages/${editingPackage.id}`, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      form.post("/admin/packages", {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleFilter = () => {
    router.get(
      "/admin/packages",
      { search, category, sort: sortBy },
      { preserveState: true }
    );
  };

  const handleDuplicate = (id) => {
    router.post(`/admin/packages/${id}/duplicate`);
  };

  const handleToggleStatus = (id) => {
    router.patch(`/admin/packages/${id}/toggle-status`);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket foto ini?")) {
      router.delete(`/admin/packages/${id}`);
    }
  };

  // Dynamic profit calculation in modal
  const estTotalCost =
    Number(form.data.estimated_photographer_cost || 0) +
    Number(form.data.estimated_mua_fee || 0) +
    Number(form.data.estimated_operational_cost || 0);

  const estProfit = Number(form.data.price || 0) - estTotalCost;
  const estMargin =
    form.data.price > 0 ? ((estProfit / form.data.price) * 100).toFixed(2) : 0;

  return (
    <AdminLayout title="Master Paket Foto">
      <div className="space-y-6">
        {/* Header Title & Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Master Paket Foto
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola master paket foto, estimasi biaya operasional, dan margin keuntungan.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-slate-900 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Paket Baru
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama paket foto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 px-3 text-sm rounded-md border border-slate-200 bg-white"
              >
                <option value="">Semua Kategori</option>
                {safeCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 text-sm rounded-md border border-slate-200 bg-white"
              >
                <option value="created_at">Urutkan: Terbaru</option>
                <option value="price">Urutkan: Harga</option>
                <option value="profit">Urutkan: Profit Est.</option>
                <option value="margin">Urutkan: Margin Est.</option>
              </select>

              <Button variant="secondary" onClick={handleFilter}>
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table Grid */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Paket Foto</th>
                <th className="px-4 py-3 text-right">Harga Jual</th>
                <th className="px-4 py-3 text-right">Est. Total Biaya</th>
                <th className="px-4 py-3 text-right">Est. Profit</th>
                <th className="px-4 py-3 text-center">Margin</th>
                <th className="px-4 py-3 text-center">MUA</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safePackages.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Tidak ada data paket foto ditemukan.
                  </td>
                </tr>
              ) : (
                safePackages.data.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{pkg.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-600">{pkg.category}</span>
                        <span>•</span>
                        <span>{pkg.duration_minutes} Menit</span>
                        <span>•</span>
                        <span>{pkg.number_of_photos} Foto</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {formatRupiah(pkg.price)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-slate-600">
                      {formatRupiah(pkg.estimated_total_cost)}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                      {formatRupiah(pkg.estimated_profit)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={pkg.estimated_margin >= 30 ? "success" : "warning"}>
                        {pkg.estimated_margin}%
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {pkg.includes_mua ? (
                        <Badge variant="info" className="gap-1">
                          <Sparkles className="h-3 w-3" /> Ya
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">— Tidak</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={pkg.status === "ACTIVE" ? "success" : "secondary"}>
                        {pkg.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(pkg)}
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(pkg.id)}
                          title="Duplikasi"
                        >
                          <Copy className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(pkg.id)}
                          title={pkg.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                        >
                          <Power className={`h-4 w-4 ${pkg.status === "ACTIVE" ? "text-emerald-600" : "text-slate-400"}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pkg.id)}
                          title="Hapus"
                        >
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

        {/* Modal Form Create/Edit Package */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Master Paket Foto" : "Tambah Paket Foto Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Paket</Label>
                  <Input
                    required
                    placeholder="misal: Signature Graduation"
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                    value={form.data.category}
                    onChange={(e) => form.setData("category", e.target.value)}
                  >
                    {safeCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Harga Jual (Rp)</Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={form.data.price}
                    onChange={(e) => form.setData("price", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durasi (Menit)</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={form.data.duration_minutes}
                    onChange={(e) => form.setData("duration_minutes", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Jumlah Foto</Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={form.data.number_of_photos}
                    onChange={(e) => form.setData("number_of_photos", e.target.value)}
                  />
                </div>
              </div>

              {/* MUA Selection */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Layanan MUA (Make Up Artist)</p>
                  <p className="text-xs text-slate-500">Apakah paket ini sudah termasuk MUA?</p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.data.includes_mua}
                      onChange={(e) => form.setData("includes_mua", e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-950 mr-2"
                    />
                    {form.data.includes_mua ? "✓ Termasuk MUA" : "— Tanpa MUA"}
                  </label>
                </div>
              </div>

              {/* Cost Estimations */}
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                  Estimasi Biaya & Margin Keuntungan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Est. Gaji Photographer</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.data.estimated_photographer_cost}
                      onChange={(e) => form.setData("estimated_photographer_cost", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Est. Fee MUA</Label>
                    <Input
                      type="number"
                      min="0"
                      disabled={!form.data.includes_mua}
                      value={form.data.estimated_mua_fee}
                      onChange={(e) => form.setData("estimated_mua_fee", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Est. Operasional</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.data.estimated_operational_cost}
                      onChange={(e) => form.setData("estimated_operational_cost", e.target.value)}
                    />
                  </div>
                </div>

                {/* Live Profit Preview */}
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-emerald-900">Total Biaya: </span>
                    <span className="text-emerald-800">{formatRupiah(estTotalCost)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-900">Est. Profit: </span>
                    <span className="font-bold text-emerald-950">{formatRupiah(estProfit)}</span>
                    <span className="ml-2 font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px]">
                      Margin {estMargin}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi Paket</Label>
                <Textarea
                  placeholder="Keterangan mengenai fasilitas paket..."
                  value={form.data.description}
                  onChange={(e) => form.setData("description", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-slate-900 text-white" disabled={form.processing}>
                  {form.processing ? "Menyimpan..." : "Simpan Paket"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
