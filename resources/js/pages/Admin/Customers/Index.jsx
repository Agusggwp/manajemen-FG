import React, { useState, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Plus, Search, Users, Edit3, Trash2, Phone, Mail, MapPin, MoreVertical, X, Save } from "lucide-react";
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
    if (!deleteTarget) return;
    router.delete(`/admin/customers/${deleteTarget.id}`, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  const isLoading = isNavigating || isSearching;

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
          <Button onClick={handleOpenCreate}>
            <Plus /> Tambah Pelanggan
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Nama Pelanggan</TableHead>
                <TableHead className="font-semibold text-slate-700">Kontak</TableHead>
                <TableHead className="font-semibold text-slate-700">Alamat</TableHead>
                <TableHead className="font-semibold text-slate-700">Catatan</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeCustomers.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400 font-sans">
                    Belum ada data pelanggan.
                  </TableCell>
                </TableRow>
              ) : (
                safeCustomers.data.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {c.name}
                    </TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                      {c.address ? (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-slate-400 shrink-0" />
                          <span className="truncate">{c.address}</span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                      {c.notes || "-"}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-slate-600 hover:text-slate-900 focus-visible:ring-1"
                            title="Aksi Pelanggan"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 shadow-md">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(c)}
                            className="cursor-pointer text-xs"
                          >
                            <Edit3 className="mr-2 h-3.5 w-3.5 text-slate-600" />
                            <span>Edit Data</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(c)}
                            className="cursor-pointer text-xs text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-red-600" />
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
                  <X /> Batal
                </Button>
                <Button type="submit" disabled={form.processing}>
                  <Save />
                  {form.processing ? "Menyimpan..." : "Simpan Pelanggan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Hapus Data Pelanggan"
          description={`Apakah Anda yakin ingin menghapus pelanggan "${deleteTarget?.name}"? Seluruh data yang terkait akan terhapus.`}
          confirmText="Hapus Pelanggan"
          cancelText="Batal"
          variant="destructive"
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
}
