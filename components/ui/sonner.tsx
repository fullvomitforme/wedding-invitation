"use client";

import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast border border-white/10 bg-[#141416] text-neutral-100 shadow-lg",
          title: "text-sm font-medium text-neutral-50",
          description: "text-xs text-neutral-400",
          success:
            "border-white/10 bg-[#141416] text-neutral-100 [&_[data-icon]]:text-[#BFA14A]",
          error:
            "border-red-500/30 bg-[#141416] text-red-300 [&_[data-icon]]:text-red-400",
          warning:
            "border-amber-500/30 bg-[#141416] text-amber-200 [&_[data-icon]]:text-amber-400",
          info: "border-white/10 bg-[#141416] text-neutral-100",
          actionButton:
            "bg-neutral-100 text-[#0E0E10] font-medium hover:bg-neutral-200 focus-visible:ring-[#BFA14A]",
          cancelButton:
            "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 focus-visible:ring-[#BFA14A]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
