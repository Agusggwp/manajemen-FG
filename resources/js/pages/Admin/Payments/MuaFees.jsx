import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, useForm, router } from "@inertiajs/react";
import { Sparkles, CheckCircle2, Clock, CreditCard, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageLoading, TableSkeleton } from "@/components/loading/PageSkeletons";

export default function MuaFees({ fees = { data: [] }, filters = {}, unpaidTotal = 0, paidTotal = 0 }) {
  const isNavigating = usePageLoading();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const payForm = useForm({
    payment_method: "TRANSFER",
    payment_note: "",
  });

  const handleOpenPay = (fee) => {
    setSelectedFee(fee);
    payForm.reset();
    setPayModalOpen(true);
  };

  const handleConfirmPay = (e) => {
    e.preventDefault();
    if (!selectedFee) return;
    payForm.post(`/admin/payments/mua-fees/${selectedFee.id}/pay`, {
      onSuccess: () => setPayModalOpen(false),
    });
  };

  return (
    <>
      <Head title="Pembayaran Gaji MUA" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pembayaran Gaji Make Up Artist (MUA)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola dan tandai status pelunasan gaji MUA per project.
          </p>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-amber-50 border-amber-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-800 uppercase">Belum Dibayar (UNPAID)</p>
                <p className="text-2xl font-bold text-amber-950 mt-1">{formatRupiah(unpaidTotal)}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-60" />
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800 uppercase">Sudah Dibayar (PAID)</p>
                <p className="text-2xl font-bold text-emerald-950 mt-1">{formatRupiah(paidTotal)}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
            </CardContent>
          </Card>
        </div>

        {/* Table or Skeleton */}
        {isNavigating ? (
          <TableSkeleton rows={6} cols={5} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Nama MUA</TableHead>
                  <TableHead className="font-semibold text-slate-700">Project / Pelanggan</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Nominal Gaji</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!fees?.data || fees.data.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      Belum ada data rekaman gaji MUA.
                    </TableCell>
                  </TableRow>
                ) : (
                  (fees?.data || []).map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                          <span>{f.mua?.name}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-slate-900 block">{f.project?.project_name}</span>
                        <span className="text-xs text-slate-500">{f.project?.customer?.name}</span>
                      </TableCell>

                      <TableCell className="text-right font-bold text-slate-900">
                        {formatRupiah(f.amount)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={f.payment_status === "PAID" ? "success" : "warning"}>
                          {f.payment_status === "PAID" ? "Lunas" : "Belum Bayar"}
                        </Badge>
                        {f.paid_at && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {formatDate(f.paid_at)}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        {f.payment_status === "UNPAID" ? (
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs font-semibold"
                            onClick={() => handleOpenPay(f)}
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>Bayar Gaji</span>
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Lunas</span>
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Modal Pay MUA */}
        <Dialog open={payModalOpen} onOpenChange={(val) => { if (!payForm.processing) setPayModalOpen(val); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Pembayaran Gaji MUA</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleConfirmPay} className="space-y-4 py-2">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-1">
                <p>MUA: <strong className="text-amber-950">{selectedFee?.mua?.name}</strong></p>
                <p>Project: <strong className="text-amber-950">{selectedFee?.project?.project_name}</strong></p>
                <p className="text-sm font-bold text-amber-950 pt-1">
                  Nominal: {formatRupiah(selectedFee?.amount)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Metode Pembayaran</label>
                <Select
                  value={payForm.data.payment_method || "TRANSFER"}
                  onValueChange={(val) => payForm.setData("payment_method", val)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                    <SelectItem value="TUNAI">Tunai / Cash</SelectItem>
                    <SelectItem value="E-WALLET">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Catatan Bukti / Note (Opsional)</label>
                <Input
                  placeholder="misal: Transfer Mandiri Ref: 987654"
                  value={payForm.data.payment_note}
                  onChange={(e) => payForm.setData("payment_note", e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" disabled={payForm.processing} onClick={() => setPayModalOpen(false)}>
                  <X />
                  <span>Batal</span>
                </Button>
                <Button type="submit" disabled={payForm.processing}>
                  {payForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 />}
                  <span>{payForm.processing ? "Memproses..." : "Konfirmasi Pembayaran"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
