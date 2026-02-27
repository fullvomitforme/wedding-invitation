import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-text-tertiary selection:bg-action-primary selection:text-text-inverse h-9 w-full min-w-0 rounded-md border border-border-default bg-surface-secondary px-3 py-1 text-base text-text-primary shadow-sm transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-action-primary focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-invalid:ring-destructive aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
