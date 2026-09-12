"use client";
import React from "react";
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { toast, Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      closeButton
      icons={{
        success: <CircleCheck className="h-5 w-5 text-white shrink-0" />,
        info: <Info className="h-5 w-5 text-white shrink-0" />,
        warning: <TriangleAlert className="h-5 w-5 text-white shrink-0" />,
        error: <OctagonX className="h-5 w-5 text-white shrink-0" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border group-[.toaster]:shadow-lg font-medium text-sm rounded-xl py-3 px-4 flex items-center gap-3",
          title: "font-semibold text-sm",
          description: "text-xs opacity-90",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-slate-900 text-xs font-semibold",
          cancelButton:
            "group-[.toast]:bg-black/20 group-[.toast]:text-white text-xs",
          closeButton:
            "!bg-black/10 !text-white hover:!bg-black/20 !border-transparent transition-colors",
          default:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
          success:
            "!bg-emerald-500 !text-white !border-emerald-600 [&_[data-icon]]:!text-white [&_[data-description]]:!text-emerald-50 [&_[data-close-button]]:!text-white",
          error:
            "!bg-red-500 !text-white !border-red-600 [&_[data-icon]]:!text-white [&_[data-description]]:!text-red-50 [&_[data-close-button]]:!text-white",
          warning:
            "!bg-yellow-500 !text-white !border-yellow-600 [&_[data-icon]]:!text-white [&_[data-description]]:!text-yellow-50 [&_[data-close-button]]:!text-white",
          info:
            "!bg-blue-500 !text-white !border-blue-600 [&_[data-icon]]:!text-white [&_[data-description]]:!text-blue-50 [&_[data-close-button]]:!text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

