import React, { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { formatDate } from "@/lib/utils";
import { router } from "@inertiajs/react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Camera,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Index({ proofs, counts, activeTab = "pending" }) {
  const safeProofs = proofs?.data ? proofs : { data: [] };
  const safeCounts = counts || { pending: 0, approved: 0, rejected: 0 };

  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const handleTabChange = (tab) => {
    router.get("/admin/proofs", { tab }, { preserveState: true });
  };

  const handleApprove = (proof) => {
    if (confirm(`Setujui foto bukti ${proof.type} dari ${proof.photographer?.name}?`)) {
      router.post(`/admin/proofs/${proof.id}/validate`, {
        is_valid: true,
      });
    }
  };

  const handleOpenReject = (proof) => {
    setSelectedProof(proof);
    setAdminNote("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!selectedProof) return;
    router.post(`/admin/proofs/${selectedProof.id}/validate`, {
      is_valid: false,
      admin_note: adminNote,
    }, {
      onSuccess: () => setRejectModalOpen(false),
    });
  };

  return (
    <AdminLayout title="Validasi Pemotretan">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Validasi Pemotretan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verifikasi bukti foto awal (START) dan selesai (END) beserta koordinat GPS dari photographer.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-4">
          <button
            onClick={() => handleTabChange("pending")}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "pending"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Menunggu Validasi</span>
            <Badge variant="warning">{safeCounts.pending || 0}</Badge>
          </button>

          <button
            onClick={() => handleTabChange("approved")}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "approved"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Disetujui</span>
            <Badge variant="success">{safeCounts.approved || 0}</Badge>
          </button>

          <button
            onClick={() => handleTabChange("rejected")}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === "rejected"
                ? "border-red-600 text-red-600"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <XCircle className="h-4 w-4 text-red-600" />
            <span>Ditolak</span>
            <Badge variant="destructive">{safeCounts.rejected || 0}</Badge>
          </button>
        </div>

        {/* Grid of Proofs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProofs.data.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              Tidak ada data bukti foto pemotretan pada tab ini.
            </div>
          ) : (
            safeProofs.data.map((proof) => (
              <Card key={proof.id} className="border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <img
                      src={`/storage/${proof.photo_path}`}
                      alt="Proof Photo"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=Photo+Proof"; }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="uppercase font-bold tracking-wider">
                        {proof.type} PROOF
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {new Date(proof.captured_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        {proof.photographer?.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(proof.captured_at)}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center space-x-1 font-semibold text-slate-800">
                        <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        <span className="truncate">{proof.schedule?.location_name || proof.project?.location_name || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100 font-mono text-[11px]">
                        <span>Jarak dari Lokasi:</span>
                        <strong className={proof.distance_from_location <= (proof.schedule?.location_radius || 100) ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                          {proof.distance_from_location} Meter
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Akurasi GPS: {proof.accuracy}m
                      </div>
                    </div>

                    {proof.admin_note && (
                      <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                        <strong>Catatan Penolakan:</strong> {proof.admin_note}
                      </p>
                    )}
                  </CardContent>
                </div>

                {/* Validation Actions for Pending Tab */}
                {activeTab === "pending" && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => handleOpenReject(proof)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> TIDAK VALID
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      onClick={() => handleApprove(proof)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> VALID
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Modal Reject */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Tolak Bukti Foto Pemotretan
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleConfirmReject} className="space-y-4 py-2">
              <p className="text-xs text-slate-600">
                Tolak bukti foto {selectedProof?.type} dari {selectedProof?.photographer?.name}? Berikan alasan penolakan agar photographer dapat mengirimkan bukti ulang.
              </p>

              <div className="space-y-2">
                <Textarea
                  required
                  placeholder="Alasan penolakan (misal: Foto buram / lokasi tidak sesuai radius)..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setRejectModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="destructive">
                  Konfirmasi Tolak
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
