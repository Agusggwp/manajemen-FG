import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Aksi",
  description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  loadingText,
  variant = "destructive",
  icon: IconComponent,
  confirmIcon: CustomConfirmIcon,
  onConfirm,
  disabled = false,
  loading = false,
}) {
  const isBusy = disabled || loading;

  const getHeaderIcon = () => {
    if (IconComponent) return <IconComponent className="h-6 w-6 shrink-0" />;
    if (variant === "destructive") {
      return <Trash2 className="h-6 w-6 text-red-600 shrink-0" />;
    }
    return <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />;
  };

  const getConfirmIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 shrink-0 animate-spin" />;
    if (CustomConfirmIcon) return <CustomConfirmIcon className="h-4 w-4 shrink-0" />;
    if (IconComponent) return <IconComponent className="h-4 w-4 shrink-0" />;
    if (variant === "destructive") return <Trash2 className="h-4 w-4 shrink-0" />;
    return <Check className="h-4 w-4 shrink-0" />;
  };

  const currentLoadingText = loadingText || (variant === "destructive" ? "Menghapus..." : "Memproses...");

  return (
    <AlertDialog
      open={open}
      onOpenChange={(val) => {
        if (!isBusy && onOpenChange) {
          onOpenChange(val);
        }
      }}
    >
      <AlertDialogContent className="max-w-[92vw] sm:max-w-md p-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-card dark:bg-slate-900 text-card-foreground">
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "w-12 h-12 rounded-full shrink-0 flex items-center justify-center mb-3.5",
              variant === "destructive"
                ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50"
                : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50"
            )}
          >
            {getHeaderIcon()}
          </div>
          <AlertDialogHeader className="space-y-2 text-center sm:text-center items-center">
            <AlertDialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight text-center">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-center max-w-xs sm:max-w-sm">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full sm:justify-center">
          <AlertDialogCancel
            disabled={isBusy}
            className="w-full sm:w-1/2 font-semibold text-xs sm:text-sm h-10 flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4 shrink-0" />
            <span>{cancelText}</span>
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            disabled={isBusy}
            onClick={(e) => {
              e.preventDefault();
              if (!isBusy) {
                onConfirm?.();
              }
            }}
            className="w-full sm:w-1/2 font-semibold text-xs sm:text-sm h-10 flex items-center justify-center gap-2 shadow-xs"
          >
            {getConfirmIcon()}
            <span>{loading ? currentLoadingText : confirmText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
