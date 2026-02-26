"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: (id: string) => `/dashboard/weddings/${id}`, label: "Overview" },
  { href: (id: string) => `/dashboard/weddings/${id}/content`, label: "Content" },
  { href: (id: string) => `/dashboard/weddings/${id}/layout-sections`, label: "Layout" },
  { href: (id: string) => `/dashboard/weddings/${id}/settings`, label: "Settings" },
] as const;

export function WeddingTabs({ weddingId }: { weddingId: string }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 border-b border-white/6"
      aria-label="Project sections"
    >
      {TABS.map(({ href, label }) => {
        const hrefResolved = href(weddingId);
        const isActive =
          hrefResolved === pathname ||
          (hrefResolved !== `/dashboard/weddings/${weddingId}` &&
            pathname?.startsWith(hrefResolved));

        return (
          <Link
            key={hrefResolved}
            href={hrefResolved}
            className={
              isActive
                ? "border-b-2 border-[#BFA14A] px-3 py-2.5 text-xs font-medium text-[#BFA14A] -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10] rounded-t"
                : "px-3 py-2.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10] rounded-t"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
