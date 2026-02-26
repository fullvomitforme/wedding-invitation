"use client";

import * as React from "react";
import { Upload, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  id: string;
  uploadUrl: string;
  className?: string;
  disabled?: boolean;
};

export function ImageUpload({
  value,
  onChange,
  id,
  uploadUrl,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      if (typeof data.url === "string") {
        onChange(data.url);
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const clear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={cn("space-y-1", className)}>
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled || uploading}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        aria-label="Upload image"
        className={cn(
          "min-h-[120px] w-full rounded-md border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 p-4 transition-colors",
          "hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]",
          (disabled || uploading) && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="size-8 text-neutral-400 animate-spin" aria-hidden />
            <span className="text-sm text-neutral-400">Uploading…</span>
          </>
        ) : value ? (
          <>
            <div className="relative rounded overflow-hidden bg-white/10 max-h-24 max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt=""
                className="max-h-24 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 truncate max-w-[180px]">
                Image set
              </span>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded p-1 text-neutral-400 hover:text-red-400 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] min-h-[24px] min-w-[24px]"
                aria-label="Remove image"
              >
                <X className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Upload className="size-8 text-neutral-500" aria-hidden />
            <span className="text-sm text-neutral-400">Click or drop image</span>
          </>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
