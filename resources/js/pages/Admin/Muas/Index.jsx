import React, { useState, useRef } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { Plus, Search, Sparkles, Edit3, Trash2, Eye, Phone, MapPin, MoreVertical, X, Save, Wallet, Loader2 } from "lucide-react";
import { formatRupiah, getStatusLabel } from "@/lib/utils";
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

import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ muas, filters }) {
  const safeMuas = muas?.data ? muas : { data: [] };
  const safeFilters = filters || {};

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMua, setEditingMua] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialty: "",
    bio: "",
    status: "ACTIVE",
    notes: "",
    default_fee: "",
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
      default_fee: mua.default_fee ?? "",
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

  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      router.get("/admin/muas", { search: val }, {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      });
    }, 500);
  };

  const handleDeleteClick = (mua) => {
    setDeleteTarget(mua);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    router.delete(`/admin/muas/${deleteTarget.id}`, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onFinish: () => setIsDeleting(false),
    });
  };

  const isLoading = isNavigating || isSearching;

  return (
    <>
      <Head title="Manajemen MUA" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Make Up Artist (MUA)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kelola data partner MUA, spesialisasi, dan riwayat penugasan project.
            </p>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="font-semibold gap-1.5 text-xs w-full sm:w-auto shrink-0">
            <Plus className="h-4 w-4" />
            Tambah MUA Baru
          </Button>
        </div>

        <Card className="border-slate-200 shadow-2xs">
          <CardContent className="p-3 sm:p-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama, nomor HP, atau spesialisasi MUA..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 bg-white text-xs sm:text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* MUA Cards Grid or Skeleton */}
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : safeMuas.data.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            Belum ada data Make Up Artist (MUA).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeMuas.data.map((mua) => (
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
                      {getStatusLabel(mua.status)}
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
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Gaji: <strong className="text-slate-900">{formatRupiah(mua.default_fee || 0)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Total Project: <strong className="text-slate-900">{mua.projects_count || 0}</strong>
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-600 hover:text-slate-900 focus-visible:ring-1"
                          title="Aksi MUA"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 shadow-md">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/muas/${mua.id}`} className="cursor-pointer text-xs flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5 text-slate-600" />
                            <span>Lihat Detail</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(mua)}
                          className="cursor-pointer text-xs flex items-center gap-2"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-slate-600" />
                          <span>Edit Data</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(mua)}
                          className="cursor-pointer text-xs text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
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
        <Dialog open={modalOpen} onOpenChange={(val) => { if (!form.processing) setModalOpen(val); }}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
                {editingMua ? "Edit Data MUA" : "Tambah MUA Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 py-2">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">Nama Lengkap MUA</Label>
                <Input
                  required
                  placeholder="misal: Sari MUA Bali"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Nomor WhatsApp / HP</Label>
                  <Input
                    required
                    placeholder="0812xxxx"
                    value={form.data.phone}
                    onChange={(e) => form.setData("phone", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Email (Opsional)</Label>
                  <Input
                    type="email"
                    placeholder="mua@email.com"
                    value={form.data.email}
                    onChange={(e) => form.setData("email", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Spesialisasi Makeup</Label>
                  <Input
                    placeholder="misal: Graduation, Bridal, Glam"
                    value={form.data.specialty}
                    onChange={(e) => form.setData("specialty", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Gaji Standar / Default (Rp)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="misal: 300000"
                    value={form.data.default_fee}
                    onChange={(e) => form.setData("default_fee", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Alamat / Dominasi Area</Label>
                  <Input
                    placeholder="misal: Denpasar, Bali"
                    value={form.data.address}
                    onChange={(e) => form.setData("address", e.target.value)}
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Status</Label>
                  <Select
                    value={form.data.status || "ACTIVE"}
                    onValueChange={(val) => form.setData("status", val)}
                  >
                    <SelectTrigger className="w-full bg-white text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Aktif (ACTIVE)</SelectItem>
                      <SelectItem value="INACTIVE">Nonaktif (INACTIVE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">Catatan Tambahan</Label>
                <Textarea
                  placeholder="Catatan internal..."
                  value={form.data.notes}
                  onChange={(e) => form.setData("notes", e.target.value)}
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
                  <span>{form.processing ? "Menyimpan..." : "Simpan MUA"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={(val) => { if (!isDeleting) setDeleteOpen(val); }}
          title="Hapus Data MUA"
          description={`Apakah Anda yakin ingin menghapus MUA "${deleteTarget?.name}"? Seluruh riwayat gaji yang terkait akan terhapus.`}
          confirmText="Hapus MUA"
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
