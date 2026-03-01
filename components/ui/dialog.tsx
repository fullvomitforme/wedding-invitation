"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onOpenChange) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onOpenChange]);

  // Focus management
  React.useEffect(() => {
    if (open && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements[0]?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        className={cn(
          "relative mx-auto my-auto flex min-h-full items-center justify-center p-4",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        <div className="relative w-full max-w-md rounded border border-border bg-card shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            {title && (
              <h2 id="dialog-title" className="text-[13px] font-semibold text-foreground">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card p-1"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type DialogButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive";
};

export function DialogButton({ variant = "default", className, children, ...props }: DialogButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "h-8 px-3 text-[11px] font-medium rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card inline-flex items-center gap-2",
        variant === "default"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-destructive/15 text-destructive border border-destructive/40 hover:bg-destructive/20 hover:border-destructive/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
