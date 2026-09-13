import React, { useState, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Plus, Search, Users, Edit3, Trash2, Phone, Mail, MapPin, MoreVertical, X, Save, Loader2 } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function Index({ customers, filters }) {
  const safeCustomers = customers?.data ? customers : { data: [] };
  const safeFilters = filters || {};

  const isNavigating = usePageLoading();
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      router.get("/admin/customers", { search: val }, {
        preserveState: true,
        onFinish: () => setIsSearching(false),
      });
    }, 500);
  };

  const handleDeleteClick = (customer) => {
    setDeleteTarget(customer);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    router.delete(`/admin/customers/${deleteTarget.id}`, {
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
      <Head title="Manajemen Pelanggan" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Manajemen Pelanggan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Database pelanggan ARTDEVATA beserta kontak dan alamat pemotretan.
            </p>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="font-semibold gap-1.5 text-xs w-full sm:w-auto shrink-0">
            <Plus className="h-4 w-4" />
            <span>Tambah Pelanggan</span>
          </Button>
        </div>

        {/* Search */}
        <Card className="border-border dark:border-slate-800 bg-card dark:bg-slate-900">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Cari nama, nomor HP, atau email pelanggan..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table or Skeleton */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={4} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
                <TableRow className="border-border dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Nama Pelanggan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kontak</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Alamat</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Catatan</TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeCustomers.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400 dark:text-slate-500 font-sans">
                      Belum ada data pelanggan.
                    </TableCell>
                  </TableRow>
                ) : (
                  safeCustomers.data.map((c) => (
                    <TableRow key={c.id} className="border-border dark:border-slate-800">
                      <TableCell className="font-semibold text-slate-900 dark:text-white">
                        {c.name}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="flex items-center text-slate-700 dark:text-slate-300">
                            <Phone className="h-3 w-3 mr-1 text-slate-400 dark:text-slate-500" /> {c.phone}
                          </span>
                          {c.email && (
                            <span className="flex items-center text-slate-500 dark:text-slate-400">
                              <Mail className="h-3 w-3 mr-1 text-slate-400 dark:text-slate-500" /> {c.email}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {c.address ? (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{c.address}</span>
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {c.notes || "-"}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus-visible:ring-1"
                              title="Aksi Pelanggan"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36 shadow-md">
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(c)}
                              className="cursor-pointer text-xs flex items-center gap-2"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                              <span>Edit Data</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(c)}
                              className="cursor-pointer text-xs text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40 flex items-center gap-2"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                              <span>Hapus</span>
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

        {/* Modal Form */}
        <Dialog open={modalOpen} onOpenChange={(val) => { if (!form.processing) setModalOpen(val); }}>
          <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {editingCustomer ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap *</Label>
                <Input
                  id="name"
                  required
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor Telepon / WhatsApp *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="08123456789"
                  value={form.data.phone}
                  onChange={(e) => form.setData("phone", e.target.value)}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.data.email}
                  onChange={(e) => form.setData("email", e.target.value)}
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Pemotretan / Domisili</Label>
                <Textarea
                  id="address"
                  rows={2}
                  placeholder="Alamat lengkap..."
                  value={form.data.address}
                  onChange={(e) => form.setData("address", e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  placeholder="Preferensi pelanggan, catatan khusus..."
                  value={form.data.notes}
                  onChange={(e) => form.setData("notes", e.target.value)}
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
                  <span>{form.processing ? "Menyimpan..." : "Simpan Pelanggan"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={(val) => { if (!isDeleting) setDeleteOpen(val); }}
          title="Hapus Data Pelanggan"
          description={`Apakah Anda yakin ingin menghapus pelanggan "${deleteTarget?.name}"? Seluruh data yang terkait akan terhapus.`}
          confirmText="Hapus Pelanggan"
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
