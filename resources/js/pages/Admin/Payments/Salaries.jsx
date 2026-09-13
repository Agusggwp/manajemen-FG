import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, useForm, router } from "@inertiajs/react";
import { CreditCard, CheckCircle2, DollarSign, Clock, Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Salaries({ salaries, filters, unpaidTotal = 0, paidTotal = 0 }) {
  const safeSalaries = salaries?.data ? salaries : { data: [] };
  const safeFilters = filters || {};

  const isNavigating = usePageLoading();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [search, setSearch] = useState(safeFilters.search || "");

  const payForm = useForm({
    payment_method: "TRANSFER",
    payment_note: "",
  });

  const handleOpenPay = (salary) => {
    setSelectedSalary(salary);
    payForm.reset();
    setPayModalOpen(true);
  };

  const handleConfirmPay = (e) => {
    e.preventDefault();
    if (!selectedSalary) return;
    payForm.post(`/admin/payments/salaries/${selectedSalary.id}/pay`, {
      onSuccess: () => setPayModalOpen(false),
    });
  };

  const handleSearch = () => {
    router.get("/admin/payments/salaries", { search }, { preserveState: true });
  };

  return (
    <>
      <Head title="Pembayaran Gaji Fotografer" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Pembayaran Gaji Fotografer (Per Project)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola dan tandai status pembayaran gaji per project untuk fotografer.
          </p>
        </div>

        {/* Totals Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">Belum Dibayar (UNPAID)</p>
                <p className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">{formatRupiah(unpaidTotal)}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-60" />
            </CardContent>
          </Card>

          <Card className="bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Sudah Dibayar (PAID)</p>
                <p className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 mt-1">{formatRupiah(paidTotal)}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
            </CardContent>
          </Card>
        </div>

        {/* Table or Skeleton */}
        {isNavigating ? (
          <TableSkeleton rows={6} cols={5} />
        ) : (
          <div className="bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
              <TableRow className="border-border dark:border-slate-800">
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fotografer</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Project / Pelanggan</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">Nominal Gaji</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeSalaries.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400 dark:text-slate-500">
                    Belum ada data rekaman gaji.
                  </TableCell>
                </TableRow>
              ) : (
                safeSalaries.data.map((sal) => (
                  <TableRow key={sal.id} className="border-border dark:border-slate-800">
                    <TableCell className="font-bold text-slate-900 dark:text-white">
                      {sal.photographer?.name}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {sal.project?.project_name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {sal.project?.customer?.name}
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                      {formatRupiah(sal.amount)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant={sal.payment_status === "PAID" ? "success" : "warning"}>
                        {sal.payment_status}
                      </Badge>
                      {sal.paid_at && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                          {formatDate(sal.paid_at)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {sal.payment_status === "UNPAID" ? (
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs font-semibold"
                          onClick={() => handleOpenPay(sal)}
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Bayar Gaji</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center justify-center gap-1">
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

        {/* Pay Modal */}
        <Dialog open={payModalOpen} onOpenChange={(val) => { if (!payForm.processing) setPayModalOpen(val); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">Konfirmasi Pembayaran Gaji Fotografer</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleConfirmPay} className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border dark:border-slate-700/60 text-xs space-y-1">
                <p className="text-slate-700 dark:text-slate-300">Fotografer: <strong className="text-slate-900 dark:text-white">{selectedSalary?.photographer?.name}</strong></p>
                <p className="text-slate-700 dark:text-slate-300">Project: <strong className="text-slate-900 dark:text-white">{selectedSalary?.project?.project_name}</strong></p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                  Nominal: {formatRupiah(selectedSalary?.amount)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Metode Pembayaran</label>
                <Select
                  value={payForm.data.payment_method || "TRANSFER"}
                  onValueChange={(val) => payForm.setData("payment_method", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                    <SelectItem value="TUNAI">Tunai / Cash</SelectItem>
                    <SelectItem value="E-WALLET">E-Wallet (Gopay/OVO/ShopeePay)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Catatan Bukti / Note (Opsional)</label>
                <Input
                  placeholder="misal: Transfer BCA Ref: 123456"
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
