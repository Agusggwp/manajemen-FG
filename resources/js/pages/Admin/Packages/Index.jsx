import React, { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { Head, useForm, router } from "@inertiajs/react";
import {
  Package,
  Plus,
  Search,
  Copy,
  Power,
  Trash2,
  Edit3,
  Sparkles,
  TrendingUp,
  MoreVertical,
  X,
  Save,
  Loader2,
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ packages, filters, categories, muas }) {
  const safePackages = packages?.data ? packages : { data: [] };
  const safeFilters = {
    search: filters?.search ?? "",
    category: filters?.category ?? "",
    status: filters?.status ?? "",
    sort: filters?.sort ?? "all",
    direction: filters?.direction ?? "desc",
  };
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeMuas = Array.isArray(muas) ? muas : [];

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [category, setCategory] = useState(safeFilters.category || "");
  const [sortBy, setSortBy] = useState(safeFilters.sort || "all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const triggerFilter = (newSearch = search, newCategory = category, newSort = sortBy) => {
    setIsSearching(true);
    router.get(
      "/admin/packages",
      { search: newSearch, category: newCategory, sort: newSort },
      {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  useEffect(() => {
    if (search === (safeFilters.search || "")) return;
    const timer = setTimeout(() => {
      triggerFilter(search, category, sortBy);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const form = useForm({
    name: "",
    category: "Graduation",
    price: 0,
    duration_minutes: 60,
    number_of_photos: 25,
    number_of_photographers: 1,
    includes_mua: false,
    mua_id: "",
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
      mua_id: pkg.mua_id || "",
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

  const handleDuplicate = (id) => {
    router.post(`/admin/packages/${id}/duplicate`);
  };

  const handleToggleStatus = (id) => {
    router.patch(`/admin/packages/${id}/toggle-status`);
  };

  const handleDeleteClick = (pkg) => {
    setDeleteTarget(pkg);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    router.delete(`/admin/packages/${deleteTarget.id}`, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onFinish: () => setIsDeleting(false),
    });
  };

  const isLoading = isNavigating || isSearching;

  // Dynamic profit calculation in modal
  const estTotalCost =
    Number(form.data.estimated_photographer_cost || 0) +
    Number(form.data.estimated_mua_fee || 0) +
    Number(form.data.estimated_operational_cost || 0);

  const estProfit = Number(form.data.price || 0) - estTotalCost;
  const estMargin =
    form.data.price > 0 ? ((estProfit / form.data.price) * 100).toFixed(2) : 0;

  return (
    <>
      <Head title="Master Paket Foto" />
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
          <Button onClick={handleOpenCreate} size="sm" className="font-semibold gap-1.5 text-xs w-full sm:w-auto shrink-0">
            <Plus className="h-4 w-4" />
            <span>Tambah Paket Baru</span>
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Cari nama paket foto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Dropdown 1: Kategori */}
              <Select
                value={category || "all"}
                onValueChange={(val) => {
                  const newCat = val === "all" ? "" : val;
                  setCategory(newCat);
                  triggerFilter(search, newCat, sortBy);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {safeCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Dropdown 2: Urutan / Harga */}
              <Select
                value={sortBy || "all"}
                onValueChange={(val) => {
                  setSortBy(val);
                  triggerFilter(search, category, val);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="created_at">Terbaru</SelectItem>
                  <SelectItem value="price_asc">Harga Terendah</SelectItem>
                  <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
                  <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table Grid or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                <TableRow className="border-border dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Paket Foto</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Harga Jual</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Est. Total Biaya</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Est. Profit</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Margin</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">MUA</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safePackages.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400 dark:text-slate-500">
                      Tidak ada data paket foto ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  safePackages.data.map((pkg) => (
                    <TableRow key={pkg.id} className="border-border dark:border-slate-800">
                      <TableCell>
                        <div className="font-bold text-slate-900 dark:text-white">{pkg.name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-medium text-slate-600 dark:text-slate-400">{pkg.category}</span>
                          <span>•</span>
                          <span>{pkg.duration_minutes} Menit</span>
                          <span>•</span>
                          <span>{pkg.number_of_photos} Foto</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                        {formatRupiah(pkg.price)}
                      </TableCell>

                      <TableCell className="text-right font-medium text-slate-600 dark:text-slate-300">
                        {formatRupiah(pkg.estimated_total_cost)}
                      </TableCell>

                      <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(pkg.estimated_profit)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={pkg.estimated_margin >= 30 ? "success" : "warning"}>
                          {pkg.estimated_margin}%
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        {pkg.includes_mua ? (
                          <Badge variant="outline" className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 text-[10px]">
                            MUA Inc.
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={pkg.status === "ACTIVE" ? "success" : "secondary"}>
                          {pkg.status === "ACTIVE" ? "Aktif" : "Non-Aktif"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus-visible:ring-1"
                              title="Aksi Paket"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 shadow-md">
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(pkg)}
                              className="cursor-pointer text-xs flex items-center gap-2"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                              <span>Edit Paket</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(pkg.id)}
                              className="cursor-pointer text-xs flex items-center gap-2"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                              <span>Duplikasi Paket</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(pkg.id)}
                              className="cursor-pointer text-xs flex items-center gap-2"
                            >
                              <Power className={`h-3.5 w-3.5 ${pkg.status === "ACTIVE" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`} />
                              <span>{pkg.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(pkg)}
                              className="cursor-pointer text-xs text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40 flex items-center gap-2"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                              <span>Hapus Paket</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal Form Create/Edit Package */}
        <Dialog open={modalOpen} onOpenChange={(val) => { if (!form.processing) setModalOpen(val); }}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {editingPackage ? "Edit Master Paket Foto" : "Tambah Paket Foto Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-1">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Paket</Label>
                  <Input
                    required
                    placeholder="misal: Signature Graduation"
                    value={form.data.name}
                    onChange={(e) => form.setData("name", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</Label>
                  <Select
                    value={form.data.category || ""}
                    onValueChange={(val) => form.setData("category", val)}
                  >
                    <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Status Paket</Label>
                  <Select
                    value={form.data.status || "ACTIVE"}
                    onValueChange={(val) => form.setData("status", val)}
                  >
                    <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Aktif (ACTIVE)</SelectItem>
                      <SelectItem value="INACTIVE">Non-Aktif (INACTIVE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Harga Jual (Rp)</Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={form.data.price}
                    onChange={(e) => form.setData("price", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Durasi (Menit)</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={form.data.duration_minutes}
                    onChange={(e) => form.setData("duration_minutes", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah Foto</Label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={form.data.number_of_photos}
                    onChange={(e) => form.setData("number_of_photos", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </div>

              {/* MUA Selection */}
              <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-border dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Layanan MUA (Make Up Artist)</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">Pilih MUA yang otomatis digunakan untuk paket ini</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={form.data.includes_mua}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          form.setData({
                            ...form.data,
                            includes_mua: checked,
                            mua_id: checked ? form.data.mua_id : "",
                          });
                        }}
                        className="rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-slate-950 h-4 w-4"
                      />
                      <span>{form.data.includes_mua ? "✓ Termasuk MUA" : "— Tanpa MUA"}</span>
                    </label>
                  </div>
                </div>

                {form.data.includes_mua && (
                  <div className="space-y-1.5 sm:space-y-2 pt-1 border-t border-border dark:border-slate-700/60">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Pilih MUA Paket</Label>
                    <Select
                      value={form.data.mua_id ? String(form.data.mua_id) : ""}
                      onValueChange={(val) => {
                        const selectedMua = safeMuas.find((m) => String(m.id) === String(val));
                        form.setData({
                          ...form.data,
                          mua_id: val,
                          estimated_mua_fee: selectedMua?.default_fee ? selectedMua.default_fee : form.data.estimated_mua_fee,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="-- Pilih MUA (Default Paket) --" />
                      </SelectTrigger>
                      <SelectContent>
                        {safeMuas.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name} {m.specialty ? `(${m.specialty})` : ""} {m.default_fee ? `- ${formatRupiah(m.default_fee)}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Cost Estimations */}
              <div className="border-t border-border dark:border-slate-800 pt-3">
                <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
                  Estimasi Biaya & Margin Keuntungan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Est. Gaji Fotografer</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.data.estimated_photographer_cost}
                      onChange={(e) => form.setData("estimated_photographer_cost", e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Est. Gaji MUA</Label>
                    <Input
                      type="number"
                      min="0"
                      disabled
                      value={form.data.estimated_mua_fee}
                      onChange={(e) => form.setData("estimated_mua_fee", e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10 bg-slate-100 dark:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Est. Operasional</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.data.estimated_operational_cost}
                      onChange={(e) => form.setData("estimated_operational_cost", e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                </div>

                {/* Live Profit Preview */}
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-300">Total Biaya: </span>
                    <span className="text-emerald-800 dark:text-emerald-200 font-medium">{formatRupiah(estTotalCost)}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div>
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300">Est. Profit: </span>
                      <span className="font-bold text-emerald-950 dark:text-emerald-100">{formatRupiah(estProfit)}</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px]">
                      Margin {estMargin}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Deskripsi Paket</Label>
                <Textarea
                  placeholder="Keterangan mengenai fasilitas paket..."
                  value={form.data.description}
                  onChange={(e) => form.setData("description", e.target.value)}
                  rows={2}
                  className="text-xs sm:text-sm"
                />
              </div>

              <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={form.processing}
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto "
                >
                  <X />
                  <span>Batal</span>
                </Button>
                <Button
                  type="submit"
                  disabled={form.processing}
                  className="w-full sm:w-auto  shadow-xs"
                >
                  {form.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save />}
                  <span>{form.processing ? "Menyimpan..." : "Simpan Paket"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={(val) => { if (!isDeleting) setDeleteOpen(val); }}
          title="Hapus Paket Foto"
          description={`Apakah Anda yakin ingin menghapus paket "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus Paket"
          cancelText="Batal"
          variant="destructive"
          loading={isDeleting}
          disabled={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
