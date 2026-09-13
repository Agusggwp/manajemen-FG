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
import { AlertTriangle, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Aksi",
  description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "destructive",
  icon: IconComponent,
  confirmIcon: CustomConfirmIcon,
  onConfirm,
  disabled = false,
}) {
  const getHeaderIcon = () => {
    if (IconComponent) return <IconComponent className="h-6 w-6 shrink-0" />;
    if (variant === "destructive") {
      return <Trash2 className="h-6 w-6 text-red-600 shrink-0" />;
    }
    return <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />;
  };

  const getConfirmIcon = () => {
    if (CustomConfirmIcon) return <CustomConfirmIcon className="h-4 w-4 shrink-0" />;
    if (IconComponent) return <IconComponent className="h-4 w-4 shrink-0" />;
    if (variant === "destructive") return <Trash2 className="h-4 w-4 shrink-0" />;
    return <Check className="h-4 w-4 shrink-0" />;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[92vw] sm:max-w-md p-6 rounded-2xl border-slate-200">
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "w-12 h-12 rounded-full shrink-0 flex items-center justify-center mb-3.5",
              variant === "destructive"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
            )}
          >
            {getHeaderIcon()}
          </div>
          <AlertDialogHeader className="space-y-2 text-center sm:text-center items-center">
            <AlertDialogTitle className="text-base sm:text-lg font-bold text-slate-900 tracking-tight text-center">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center max-w-xs sm:max-w-sm">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full sm:justify-center">
          <AlertDialogCancel
            disabled={disabled}
            className="w-full sm:w-1/2 font-semibold text-xs sm:text-sm h-10 flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4 shrink-0" />
            <span>{cancelText}</span>
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.();
            }}
            className="w-full sm:w-1/2 font-semibold text-xs sm:text-sm h-10 flex items-center justify-center gap-2 shadow-xs"
          >
            {getConfirmIcon()}
            <span>{confirmText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
