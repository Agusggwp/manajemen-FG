import React, { useState, useEffect } from "react";
import { ImageOff, Camera, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageWithFallback({
  src,
  alt = "Gambar",
  className = "w-full h-full object-cover",
  containerClassName = "w-full h-full",
  fallbackIcon: FallbackIcon = ImageOff,
  fallbackText = "Foto Tidak Tersedia",
  showText = true,
  children,
  ...props
}) {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 select-none relative",
          containerClassName
        )}
      >
        <FallbackIcon className="h-8 w-8 text-slate-300 stroke-[1.5] mb-1.5" />
        {showText && fallbackText && (
          <span className="text-[11px] font-medium text-slate-400 text-center tracking-tight">
            {fallbackText}
          </span>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", containerClassName)}>
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        {...props}
      />
      {children}
    </div>
  );
}

export default ImageWithFallback;
