import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: "draft" | "released" | "saving" | "saved";
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === "draft") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border border-border bg-white/5 px-2 py-0.5 text-[11px] font-medium text-tertiary-foreground",
          className
        )}
      >
        Draft
      </span>
    );
  }

  if (status === "released") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-primary px-2 py-0.5 text-[11px] font-medium text-primary",
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-primary" aria-hidden />
        Released
      </span>
    );
  }

  if (status === "saving") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[11px] font-medium text-primary/70",
          className
        )}
      >
        <span
          className="inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
        Saving…
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[11px] font-medium text-tertiary-foreground transition-opacity duration-200",
          className
        )}
      >
        <svg
          className="size-3 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Saved
      </span>
    );
  }

  return null;
}
