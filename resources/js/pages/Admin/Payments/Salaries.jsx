import React, { useState } from "react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Head, useForm, router } from "@inertiajs/react";
import { CreditCard, CheckCircle2, DollarSign, Clock, Search, X } from "lucide-react";
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

export default function Salaries({ salaries, filters, unpaidTotal = 0, paidTotal = 0 }) {
  const safeSalaries = salaries?.data ? salaries : { data: [] };
  const safeFilters = filters || {};

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
      <Head title="Pembayaran Gaji Photographer" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pembayaran Gaji Photographer (Per Project)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola dan tandai status pembayaran gaji per project untuk photographer.
          </p>
        </div>

        {/* Totals Banner */}
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

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Photographer</TableHead>
                <TableHead className="font-semibold text-slate-700">Project / Pelanggan</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Nominal Gaji</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeSalaries.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    Belum ada data rekaman gaji.
                  </TableCell>
                </TableRow>
              ) : (
                safeSalaries.data.map((sal) => (
                  <TableRow key={sal.id}>
                    <TableCell className="font-bold text-slate-900">
                      {sal.photographer?.name}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-slate-900 block">
                        {sal.project?.project_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {sal.project?.customer?.name}
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-bold text-slate-900">
                      {formatRupiah(sal.amount)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant={sal.payment_status === "PAID" ? "success" : "warning"}>
                        {sal.payment_status}
                      </Badge>
                      {sal.paid_at && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {formatDate(sal.paid_at)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {sal.payment_status === "UNPAID" ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenPay(sal)}
                        >
                          <CreditCard /> Bayar Gaji
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Lunas
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pay Modal */}
        <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Pembayaran Gaji Photographer</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleConfirmPay} className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <p>Photographer: <strong className="text-slate-900">{selectedSalary?.photographer?.name}</strong></p>
                <p>Project: <strong className="text-slate-900">{selectedSalary?.project?.project_name}</strong></p>
                <p className="text-sm font-bold text-emerald-700 pt-1">
                  Nominal: {formatRupiah(selectedSalary?.amount)}
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
                    <SelectItem value="E-WALLET">E-Wallet (Gopay/OVO/ShopeePay)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Catatan Bukti / Note (Opsional)</label>
                <Input
                  placeholder="misal: Transfer BCA Ref: 123456"
                  value={payForm.data.payment_note}
                  onChange={(e) => payForm.setData("payment_note", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPayModalOpen(false)}>
                  <X /> Batal
                </Button>
                <Button type="submit">
                  <CheckCircle2 /> Konfirmasi Pembayaran
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
