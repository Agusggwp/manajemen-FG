import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Head, router } from "@inertiajs/react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Camera,
  User,
  AlertCircle,
  X,
  Loader2,
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { usePageLoading, CardGridSkeleton } from "@/components/loading/PageSkeletons";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export default function Index({ proofs, counts, activeTab = "pending" }) {
  const safeProofs = proofs?.data ? proofs : { data: [] };
  const safeCounts = counts || { pending: 0, approved: 0, rejected: 0 };

  const isNavigating = usePageLoading();
  const [selectedProof, setSelectedProof] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleTabChange = (tab) => {
    router.get("/admin/proofs", { tab }, { preserveState: true });
  };

  const handleApproveClick = (proof) => {
    setApproveTarget(proof);
    setApproveOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!approveTarget || isApproving) return;
    setIsApproving(true);
    router.post(`/admin/proofs/${approveTarget.id}/validate`, {
      is_valid: true,
    }, {
      onSuccess: () => {
        setApproveOpen(false);
        setApproveTarget(null);
      },
      onFinish: () => setIsApproving(false),
    });
  };

  const handleOpenReject = (proof) => {
    setSelectedProof(proof);
    setAdminNote("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!selectedProof || isRejecting) return;
    setIsRejecting(true);
    router.post(`/admin/proofs/${selectedProof.id}/validate`, {
      is_valid: false,
      admin_note: adminNote,
    }, {
      onSuccess: () => setRejectModalOpen(false),
      onFinish: () => setIsRejecting(false),
    });
  };

  return (
    <>
      <Head title="Validasi Pemotretan" />
      <div className="space-y-4 sm:space-y-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Validasi Pemotretan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verifikasi bukti foto awal (START) dan selesai (END) beserta koordinat GPS dari fotografer.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => handleTabChange("pending")}
            className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === "pending"
                ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Clock className="h-4 w-4 shrink-0" />
            <span>Menunggu Validasi</span>
            <Badge variant="warning" className="text-[10px] sm:text-xs px-1.5 py-0">
              {safeCounts.pending || 0}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("approved")}
            className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === "approved"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Disetujui</span>
            <Badge variant="success" className="text-[10px] sm:text-xs px-1.5 py-0">
              {safeCounts.approved || 0}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("rejected")}
            className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap transition-colors ${
              activeTab === "rejected"
                ? "border-red-600 text-red-600 dark:text-red-400 dark:border-red-400"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>Ditolak</span>
            <Badge variant="destructive" className="text-[10px] sm:text-xs px-1.5 py-0">
              {safeCounts.rejected || 0}
            </Badge>
          </button>
        </div>

        {/* Grid of Proofs or Skeleton */}
        {isNavigating ? (
          <CardGridSkeleton count={6} />
        ) : safeProofs.data.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-card dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 text-muted-foreground">
            Tidak ada data bukti foto pemotretan pada tab ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeProofs.data.map((proof) => (
              <Card key={proof.id} className="border-border dark:border-slate-800 bg-card dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-border dark:border-slate-800">
                    <ImageWithFallback
                      src={proof.photo_path ? `/storage/${proof.photo_path}` : null}
                      alt={`Bukti Foto ${proof.type}`}
                      fallbackIcon={Camera}
                      fallbackText="Foto bukti tidak tersedia"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <Badge variant="default" className="uppercase font-bold tracking-wider shadow-xs">
                        {proof.type} PROOF
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-xs pointer-events-none">
                      {new Date(proof.captured_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {proof.photographer?.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(proof.captured_at)}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center space-x-1 font-semibold text-slate-800 dark:text-slate-200">
                        <MapPin className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{proof.schedule?.location_name || proof.project?.location_name || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 font-mono text-[11px]">
                        <span>Jarak dari Lokasi:</span>
                        <strong className={proof.distance_from_location <= (proof.schedule?.location_radius || 100) ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-amber-700 dark:text-amber-400 font-bold"}>
                          {proof.distance_from_location} Meter
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        Akurasi GPS: {proof.accuracy}m
                      </div>
                    </div>

                    {proof.admin_note && (
                      <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded border border-red-200 dark:border-red-900/60">
                        <strong>Catatan Penolakan:</strong> {proof.admin_note}
                      </p>
                    )}
                  </CardContent>
                </div>

                {/* Validation Actions for Pending Tab */}
                {activeTab === "pending" && (
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5 font-semibold text-xs"
                      onClick={() => handleOpenReject(proof)}
                    >
                      <XCircle className="h-4 w-4" />
                      <span>TIDAK VALID</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      className="gap-1.5 font-semibold text-xs"
                      onClick={() => handleApproveClick(proof)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>VALID</span>
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Modal Reject */}
        <Dialog open={rejectModalOpen} onOpenChange={(val) => { if (!isRejecting) setRejectModalOpen(val); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Tolak Bukti Foto Pemotretan
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleConfirmReject} className="space-y-4 py-2">
              <p className="text-xs text-slate-600">
                Tolak bukti foto {selectedProof?.type} dari {selectedProof?.photographer?.name}? Berikan alasan penolakan agar fotografer dapat mengirimkan bukti ulang.
              </p>

              <div className="space-y-2">
                <Textarea
                  required
                  placeholder="Alasan penolakan (misal: Foto buram / lokasi tidak sesuai radius)..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" disabled={isRejecting} onClick={() => setRejectModalOpen(false)}>
                  <X />
                  <span>Batal</span>
                </Button>
                <Button type="submit" variant="destructive" disabled={isRejecting}>
                  {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle />}
                  <span>{isRejecting ? "Menolak..." : "Konfirmasi Tolak"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Confirm Approve Dialog */}
        <ConfirmDialog
          open={approveOpen}
          onOpenChange={(val) => { if (!isApproving) setApproveOpen(val); }}
          title="Setujui Bukti Foto"
          description={`Apakah Anda yakin ingin menyetujui foto bukti ${approveTarget?.type} dari ${approveTarget?.photographer?.name}? Status presensi pemotretan akan ditandai valid.`}
          confirmText="Setujui Valid"
          cancelText="Batal"
          loadingText="Menyetujui..."
          variant="default"
          icon={CheckCircle2}
          loading={isApproving}
          disabled={isApproving}
          onConfirm={handleConfirmApprove}
        />
      </div>
    </>
  );
}
