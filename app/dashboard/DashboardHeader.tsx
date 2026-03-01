"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { UserProfileDropdown } from "./UserProfileDropdown";

/** Placeholder that matches the profile trigger size so layout is stable until dropdown mounts (avoids hydration mismatch with Radix IDs and session). */
function ProfileDropdownPlaceholder() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/10 bg-muted/20 text-[11px] font-medium text-muted-foreground"
      aria-hidden
    >
      …
    </span>
  );
}

export function DashboardHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWeddingRoute =
    pathname?.startsWith("/dashboard/weddings/") &&
    pathname !== "/dashboard/weddings" &&
    pathname !== "/dashboard/new";

  return (
    <header className="sticky top-0 z-10 flex min-h-[52px] items-center justify-between gap-4 border-b border-border/10 bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/dashboard"
          className="shrink-0 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          aria-label="Attimo dashboard"
        >
          <BrandMark className="h-5" />
        </Link>
        <span className="hidden truncate text-sm text-muted-foreground sm:inline" aria-hidden>
          {isWeddingRoute ? "Project" : "Projects"}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="hidden sm:block">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Find…"
            autoComplete="off"
            className="h-8 min-w-[140px] max-w-[200px] rounded border border-border/10 bg-muted/20 px-2.5 py-1 text-xs placeholder:text-muted-foreground outline-none transition-colors focus:border-border/20 focus:bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </label>
        {mounted ? <UserProfileDropdown /> : <ProfileDropdownPlaceholder />}
      </div>
    </header>
  );
}
