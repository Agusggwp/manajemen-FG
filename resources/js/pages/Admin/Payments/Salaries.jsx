import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatDate, formatRupiah } from "@/lib/utils";
import { useForm, router } from "@inertiajs/react";
import { CreditCard, CheckCircle2, DollarSign, Clock, Search } from "lucide-react";
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
    <AdminLayout title="Pembayaran Gaji Photographer">
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
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Photographer</th>
                <th className="px-4 py-3">Project / Pelanggan</th>
                <th className="px-4 py-3 text-right">Nominal Gaji</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeSalaries.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Belum ada data rekaman gaji.
                  </td>
                </tr>
              ) : (
                safeSalaries.data.map((sal) => (
                  <tr key={sal.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {sal.photographer?.name}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">
                        {sal.project?.project_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {sal.project?.customer?.name}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {formatRupiah(sal.amount)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={sal.payment_status === "PAID" ? "success" : "warning"}>
                        {sal.payment_status}
                      </Badge>
                      {sal.paid_at && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {formatDate(sal.paid_at)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {sal.payment_status === "UNPAID" ? (
                        <Button
                          size="sm"
                          className="bg-slate-900 text-white text-xs"
                          onClick={() => handleOpenPay(sal)}
                        >
                          [ Tandai Sudah Dibayar ]
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-medium">✓ Lunas ({sal.payment_method})</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                <select
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm"
                  value={payForm.data.payment_method}
                  onChange={(e) => payForm.setData("payment_method", e.target.value)}
                >
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="TUNAI">Tunai / Cash</option>
                  <option value="E-WALLET">E-Wallet (Gopay/OVO/ShopeePay)</option>
                </select>
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
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  Konfirmasi Pembayaran
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
