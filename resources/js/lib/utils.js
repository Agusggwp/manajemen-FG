import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(timeString) {
  if (!timeString) return "-";
  return timeString.substring(0, 5);
}

// Satu sumber terjemahan status — seluruh UI wajib pakai fungsi ini
const STATUS_LABELS = {
  // Jadwal & Project
  SCHEDULED:  "Terjadwal",
  SHOOTING:   "Pemotretan",
  EDITING:    "Pengeditan",
  REVIEW:     "Peninjauan",
  PLANNING:   "Perencanaan",
  COMPLETED:  "Selesai",
  DELIVERED:  "Terkirim",
  CANCELLED:  "Dibatalkan",
  // Pembayaran
  PAID:       "Lunas",
  UNPAID:     "Belum Lunas",
  PENDING:    "Menunggu",
  // Proof
  APPROVED:   "Disetujui",
  REJECTED:   "Ditolak",
  // Anggota
  ACTIVE:      "Aktif",
  INACTIVE:    "Nonaktif",
  // Proof
  START_VALID:   "Tervalidasi",
  START_INVALID: "Tidak Valid",
  END_VALID:     "Tervalidasi",
  END_INVALID:   "Tidak Valid",
  PENDING_REVIEW:"Menunggu Review",
};

export function getStatusLabel(status) {
  if (!status) return "-";
  return STATUS_LABELS[status] ?? status;
}
