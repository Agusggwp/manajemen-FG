import React, { useState } from "react";
import { formatDate, formatRupiah, getStatusLabel } from "@/lib/utils";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Sparkles,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Image,
  RefreshCw,
  Check,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export default function Show({ project, allPhotographers = [], allMuas = [] }) {
  const safeProject = project || {};
  const safePhotographers = Array.isArray(allPhotographers) ? allPhotographers : [];
  const safeMuas = Array.isArray(allMuas) ? allMuas : [];

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [photographerModalOpen, setPhotographerModalOpen] = useState(false);
  const [muaModalOpen, setMuaModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    title: "",
    description: "",
    confirmText: "Hapus",
    action: null,
  });

  const statusForm = useForm({
    status: safeProject.status || "PENDING",
  });

  const durationForm = useForm({
    work_start_time: safeProject.work_start_time || "09:00",
    work_end_time: safeProject.work_end_time || "11:00",
  });

  const expenseForm = useForm({
    name: "",
    amount: "",
    description: "",
  });

  const photographerForm = useForm({
    photographer_id: "",
    amount: safeProject.photo_package?.estimated_photographer_cost || 0,
  });

  const muaForm = useForm({
    mua_id: "",
    amount: safeProject.photo_package?.estimated_mua_fee || 0,
  });

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    statusForm.patch(`/admin/projects/${safeProject.id}/status`);
  };

  const handleDurationSubmit = (e) => {
    e.preventDefault();
    durationForm.patch(`/admin/projects/${safeProject.id}/work-duration`);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    expenseForm.post(`/admin/projects/${safeProject.id}/expenses`, {
      onSuccess: () => {
        setExpenseModalOpen(false);
        expenseForm.reset();
      },
    });
  };

  const handleAddPhotographer = (e) => {
    e.preventDefault();
    photographerForm.post(`/admin/projects/${safeProject.id}/photographers`, {
      onSuccess: () => setPhotographerModalOpen(false),
    });
  };

  const handleAddMua = (e) => {
    e.preventDefault();
    muaForm.post(`/admin/projects/${safeProject.id}/muas`, {
      onSuccess: () => setMuaModalOpen(false),
    });
  };

  const handleRemovePhotographer = (salary) => {
    setConfirmConfig({
      open: true,
      title: "Hapus Fotografer dari Project",
      description: `Apakah Anda yakin ingin menghapus fotografer "${salary.photographer?.name}" dari penugasan project ini?`,
      confirmText: "Hapus Penugasan",
      action: () => {
        setIsDeleting(true);
        router.delete(`/admin/projects/${safeProject.id}/photographers/${salary.photographer_id}`, {
          onSuccess: () => setConfirmConfig((prev) => ({ ...prev, open: false })),
          onFinish: () => setIsDeleting(false),
        });
      },
    });
  };

  const handleRemoveMua = (fee) => {
    setConfirmConfig({
      open: true,
      title: "Hapus MUA dari Project",
      description: `Apakah Anda yakin ingin menghapus MUA "${fee.mua?.name}" dari penugasan project ini?`,
      confirmText: "Hapus Penugasan",
      action: () => {
        setIsDeleting(true);
        router.delete(`/admin/projects/${safeProject.id}/muas/${fee.mua_id}`, {
          onSuccess: () => setConfirmConfig((prev) => ({ ...prev, open: false })),
          onFinish: () => setIsDeleting(false),
        });
      },
    });
  };

  const handleDeleteExpense = (exp) => {
    setConfirmConfig({
      open: true,
      title: "Hapus Biaya Operasional",
      description: `Apakah Anda yakin ingin menghapus pengeluaran "${exp.name}" sebesar ${formatRupiah(exp.amount)}?`,
      confirmText: "Hapus Biaya",
      action: () => {
        setIsDeleting(true);
        router.delete(`/admin/expenses/${exp.id}`, {
          onSuccess: () => setConfirmConfig((prev) => ({ ...prev, open: false })),
          onFinish: () => setIsDeleting(false),
        });
      },
    });
  };

  const startProof = safeProject.proofs?.find((p) => p.type === "START");
  const endProof = safeProject.proofs?.find((p) => p.type === "END");

  return (
    <>
      <Head title={`Detail Project - ${project.project_name}`} />
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/admin/projects">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <span className="font-mono text-xs text-slate-400 font-bold">{project.project_code}</span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {project.project_name}
              </h1>
            </div>
          </div>

          {/* Quick Status Update Form */}
          <form onSubmit={handleStatusSubmit} className="flex items-center space-x-2">
            <Select
              value={statusForm.data.status}
              onValueChange={(val) => statusForm.setData("status", val)}
            >
              <SelectTrigger className="w-36 h-9 text-xs font-semibold bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {["PLANNING", "SCHEDULED", "SHOOTING", "EDITING", "REVIEW", "COMPLETED", "DELIVERED", "CANCELLED"].map((s) => (
                  <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" size="sm" variant="secondary" disabled={statusForm.processing}>
              <RefreshCw /> Update Status
            </Button>
          </form>
        </div>

        {/* SECTION 1: INFORMASI PROJECT */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>SECTION 1 — INFORMASI PROJECT</span>
              <Badge variant={
                project.status === "COMPLETED"  ? "success"     :
                project.status === "SHOOTING"   ? "warning"     :
                project.status === "SCHEDULED"  ? "info"        :
                project.status === "CANCELLED"  ? "destructive" :
                "secondary"
              }>
                {getStatusLabel(project.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Pelanggan (Customer)</p>
                <p className="font-bold text-slate-900">{project.customer?.name}</p>
                <p className="text-xs text-slate-500">{project.customer?.phone}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Paket Foto (Snapshot)</p>
                <p className="font-bold text-slate-900">{project.package_name}</p>
                <p className="text-xs font-semibold text-emerald-700">
                  {formatRupiah(project.package_price)} • {project.package_duration} Menit
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Tanggal Pemotretan</p>
                <p className="font-bold text-slate-900">{formatDate(project.date)}</p>
              </div>
            </div>

            {/* Durasi Kerja Project */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Durasi Kerja Aktual Project</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-5 w-5 text-slate-700" />
                  <span className="text-lg font-bold text-slate-900">
                    {project.formatted_work_duration}
                  </span>
                  {project.work_start_time && project.work_end_time && (
                    <span className="text-xs text-slate-500 font-mono">
                      ({project.work_start_time?.substring(0, 5)} - {project.work_end_time?.substring(0, 5)})
                    </span>
                  )}
                </div>
              </div>

              {/* Form Update Durasi */}
              <form onSubmit={handleDurationSubmit} className="flex items-center space-x-2">
                <Input
                  type="time"
                  className="h-8 text-xs w-28 bg-white"
                  value={durationForm.data.work_start_time}
                  onChange={(e) => durationForm.setData("work_start_time", e.target.value)}
                />
                <span className="text-xs text-slate-400">-</span>
                <Input
                  type="time"
                  className="h-8 text-xs w-28 bg-white"
                  value={durationForm.data.work_end_time}
                  onChange={(e) => durationForm.setData("work_end_time", e.target.value)}
                />
                <Button type="submit" size="sm" variant="outline">
                  <Check /> Set
                </Button>
              </form>
            </div>

            {/* Location Banner */}
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{project.location_name}</span>
              </div>
              <p className="text-xs text-slate-600 pl-6">{project.location_address}</p>
              <div className="pl-6 text-[10px] font-mono text-slate-500">
                Radius Validasi GPS: {project.location_radius} Meter
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: PHOTOGRAPHER & SECTION 3: MUA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 2: PHOTOGRAPHER */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Camera className="h-4 w-4 text-slate-700" /> SECTION 2 — PHOTOGRAPHER
              </CardTitle>

              {/* Add Photographer Trigger */}
              <Button size="sm" variant="outline" onClick={() => setPhotographerModalOpen(true)}>
                <Plus /> Assign
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {project.photographer_salaries?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada photographer assigned.</p>
                ) : (
                  project.photographer_salaries?.map((salary) => (
                    <div
                      key={salary.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {salary.photographer?.name}
                        </p>
                        <p className="text-slate-500">
                          Gaji Project: <strong className="text-slate-900">{formatRupiah(salary.amount)}</strong>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={salary.payment_status === "PAID" ? "success" : "warning"}>
                          {salary.payment_status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600"
                          onClick={() => handleRemovePhotographer(salary)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: MUA */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> SECTION 3 — MAKE UP ARTIST (MUA)
              </CardTitle>

              <Button size="sm" variant="outline" onClick={() => setMuaModalOpen(true)}>
                <Plus /> Assign
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {project.mua_fees?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">— Tidak menggunakan MUA pada project ini.</p>
                ) : (
                  project.mua_fees?.map((fee) => (
                    <div
                      key={fee.id}
                      className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-amber-950 text-sm">{fee.mua?.name}</p>
                        <p className="text-amber-800">
                          Fee MUA: <strong className="text-amber-950">{formatRupiah(fee.amount)}</strong>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={fee.payment_status === "PAID" ? "success" : "warning"}>
                          {fee.payment_status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600"
                          onClick={() => handleRemoveMua(fee)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 4: PHOTO PROOF (START & END) */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" /> SECTION 4 — VALIDASI PHOTO PROOF & GPS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* START PROOF */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    [ START ] PROOF PEMOTRETAN
                  </span>
                  {startProof ? (
                    <Badge variant={startProof.status === "START_VALID" ? "success" : "warning"}>
                      {getStatusLabel(startProof.status)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Belum Dikirim</Badge>
                  )}
                </div>

                {startProof ? (
                  <div className="space-y-2 text-xs">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <ImageWithFallback
                        src={startProof.photo_path ? `/storage/${startProof.photo_path}` : null}
                        alt="Start Proof"
                        fallbackIcon={Camera}
                        fallbackText="Foto bukti awal tidak tersedia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Photographer:</span>
                        <strong className="text-slate-900">{startProof.photographer?.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Jarak GPS:</span>
                        <strong className="text-slate-900">{startProof.distance_from_location} Meter</strong>
                      </div>
                    </div>
                    {startProof.admin_note && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border">
                        Catatan Admin: {startProof.admin_note}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    Photographer belum mengirimkan foto bukti awal pemotretan.
                  </p>
                )}
              </div>

              {/* END PROOF */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    [ END ] PROOF PEMOTRETAN
                  </span>
                  {endProof ? (
                    <Badge variant={endProof.status === "END_VALID" ? "success" : "warning"}>
                      {getStatusLabel(endProof.status)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Belum Dikirim</Badge>
                  )}
                </div>

                {endProof ? (
                  <div className="space-y-2 text-xs">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <ImageWithFallback
                        src={endProof.photo_path ? `/storage/${endProof.photo_path}` : null}
                        alt="End Proof"
                        fallbackIcon={Camera}
                        fallbackText="Foto bukti selesai tidak tersedia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Photographer:</span>
                        <strong className="text-slate-900">{endProof.photographer?.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Jarak GPS:</span>
                        <strong className="text-slate-900">{endProof.distance_from_location} Meter</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    Photographer belum mengirimkan foto bukti selesai pemotretan.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5: KEUANGAN & AUDIT PROFIT AKTUAL */}
        <Card className="border-slate-900 bg-slate-900 text-white shadow-md">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-base font-semibold flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" /> SECTION 5 — KEUANGAN & PROFIT AKTUAL
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setExpenseModalOpen(true)}
              >
                <Plus /> Tambah Operasional
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Financial Grid Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Harga Project (Revenue)</p>
                <p className="text-base font-bold text-white mt-1">{formatRupiah(project.package_price)}</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Gaji Photographer</p>
                <p className="text-base font-bold text-amber-400 mt-1">{formatRupiah(project.actual_photographer_cost)}</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Fee MUA</p>
                <p className="text-base font-bold text-amber-400 mt-1">{formatRupiah(project.actual_mua_cost)}</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Biaya Operasional</p>
                <p className="text-base font-bold text-amber-400 mt-1">{formatRupiah(project.actual_operational_cost)}</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Total Cost</p>
                <p className="text-base font-bold text-rose-400 mt-1">{formatRupiah(project.actual_total_cost)}</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 col-span-2">
                <p className="text-[11px] text-slate-400 font-medium">Profit Aktual ({project.actual_margin}%)</p>
                <p className={`text-xl font-bold mt-1 ${project.actual_profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {project.actual_profit >= 0 ? formatRupiah(project.actual_profit) : `RUGI ${formatRupiah(project.actual_profit)}`}
                </p>
              </div>
            </div>

            {/* List Biaya Operasional / Expenses */}
            <div className="border-t border-slate-800 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Rincian Biaya Operasional Project
              </p>
              {project.expenses?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Belum ada pengeluaran operasional tambahan.</p>
              ) : (
                <div className="space-y-2">
                  {project.expenses?.map((exp) => (
                    <div key={exp.id} className="p-2.5 bg-slate-800 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">{exp.name}</span>
                        {exp.description && <span className="text-slate-400 ml-2">({exp.description})</span>}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-amber-300">{formatRupiah(exp.amount)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteExpense(exp)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal Expense */}
        <Dialog open={expenseModalOpen} onOpenChange={(val) => { if (!expenseForm.processing) setExpenseModalOpen(val); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Biaya Operasional</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddExpense} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nama Pengeluaran / Item</Label>
                <Input
                  required
                  placeholder="misal: Tiket Masuk Lokasi, Transportasi"
                  value={expenseForm.data.name}
                  onChange={(e) => expenseForm.setData("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nominal Biaya (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  required
                  placeholder="50000"
                  value={expenseForm.data.amount}
                  onChange={(e) => expenseForm.setData("amount", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Keterangan Tambahan (Opsional)</Label>
                <Input
                  placeholder="Catatan kwitansi / invoice"
                  value={expenseForm.data.description}
                  onChange={(e) => expenseForm.setData("description", e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" disabled={expenseForm.processing} onClick={() => setExpenseModalOpen(false)}>
                  <X />
                  <span>Batal</span>
                </Button>
                <Button type="submit" disabled={expenseForm.processing}>
                  {expenseForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save />}
                  <span>{expenseForm.processing ? "Menyimpan..." : "Simpan Biaya"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal Photographer Assign */}
        <Dialog open={photographerModalOpen} onOpenChange={(val) => { if (!photographerForm.processing) setPhotographerModalOpen(val); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Fotografer ke Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddPhotographer} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Pilih Fotografer</Label>
                <Select
                  value={photographerForm.data.photographer_id ? String(photographerForm.data.photographer_id) : ""}
                  onValueChange={(val) => photographerForm.setData("photographer_id", val)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="-- Pilih Fotografer --" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPhotographers?.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gaji per Project ini (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  required
                  value={photographerForm.data.amount}
                  onChange={(e) => photographerForm.setData("amount", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" disabled={photographerForm.processing} onClick={() => setPhotographerModalOpen(false)}>
                  <X /> Batal
                </Button>
                <Button type="submit" disabled={photographerForm.processing}>
                  {photographerForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus />}
                  <span>{photographerForm.processing ? "Menyimpan..." : "Assign Fotografer"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal MUA Assign */}
        <Dialog open={muaModalOpen} onOpenChange={(val) => { if (!muaForm.processing) setMuaModalOpen(val); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign MUA ke Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddMua} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Pilih MUA</Label>
                <Select
                  value={muaForm.data.mua_id ? String(muaForm.data.mua_id) : ""}
                  onValueChange={(val) => {
                    const selected = allMuas?.find((m) => String(m.id) === String(val));
                    muaForm.setData({
                      ...muaForm.data,
                      mua_id: val,
                      amount: selected?.default_fee ? selected.default_fee : muaForm.data.amount,
                    });
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="-- Pilih MUA --" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMuas?.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name} {m.default_fee ? `(${formatRupiah(m.default_fee)})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gaji MUA per Project ini (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  required
                  disabled
                  value={muaForm.data.amount}
                  onChange={(e) => muaForm.setData("amount", e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" disabled={muaForm.processing} onClick={() => setMuaModalOpen(false)}>
                  <X />
                  <span>Batal</span>
                </Button>
                <Button type="submit" disabled={muaForm.processing}>
                  {muaForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus />}
                  <span>{muaForm.processing ? "Menyimpan..." : "Assign MUA"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Universal Confirm Dialog */}
        <ConfirmDialog
          open={confirmConfig.open}
          onOpenChange={(open) => { if (!isDeleting) setConfirmConfig((prev) => ({ ...prev, open })); }}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmText={confirmConfig.confirmText}
          cancelText="Batal"
          variant="destructive"
          loading={isDeleting}
          disabled={isDeleting}
          onConfirm={() => confirmConfig.action?.()}
        />
      </div>
    </>
  );
}
