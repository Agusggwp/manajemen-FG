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
import { AlertTriangle, Trash2, LogOut } from "lucide-react";

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Konfirmasi Aksi",
  description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "destructive",
  icon: IconComponent,
  onConfirm,
  disabled = false,
}) {
  const getIcon = () => {
    if (IconComponent) return <IconComponent className="h-5 w-5 shrink-0" />;
    if (variant === "destructive") {
      return <Trash2 className="h-5 w-5 text-destructive shrink-0" />;
    }
    return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-muted/60 mt-0.5">
              {getIcon()}
            </div>
            <div className="space-y-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.();
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
