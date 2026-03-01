"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ChevronRight } from "lucide-react";

type Wedding = {
  id: string;
  slug: string | null;
  status: string;
  content: unknown;
  updated_at?: string;
  created_at?: string;
};

type DashboardHeaderProps = {
  weddings: Wedding[];
};

function getWeddingTitle(w: Wedding): string {
  const c = w.content as { couple?: { bride?: { name?: string }; groom?: { name?: string } } } | undefined;
  const bride = c?.couple?.bride?.name;
  const groom = c?.couple?.groom?.name;
  if (bride && groom) return `${bride} & ${groom}`;
  if (bride || groom) return bride ?? groom ?? "Untitled";
  return "Untitled";
}

/** Placeholder that matches the profile trigger size so layout is stable until dropdown mounts (avoids hydration mismatch with Radix IDs and session). */
function ProfileDropdownPlaceholder() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[11px] font-medium text-muted-foreground"
      aria-hidden
    >
      …
    </span>
  );
}

export function DashboardHeader({ weddings }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract current wedding ID from pathname
  const currentWeddingId = useMemo(() => {
    if (!pathname) return undefined;
    const match = pathname.match(/^\/dashboard\/weddings\/([^/]+)/);
    return match ? match[1] : undefined;
  }, [pathname]);

  const currentWedding = useMemo(() => {
    if (!currentWeddingId) return null;
    return weddings.find((w) => w.id === currentWeddingId) ?? null;
  }, [currentWeddingId, weddings]);

  const currentWeddingTitle = currentWedding ? getWeddingTitle(currentWedding) : null;

  const isWeddingDetailRoute =
    pathname?.startsWith("/dashboard/weddings/") &&
    pathname !== "/dashboard/weddings" &&
    pathname !== "/dashboard/new" &&
    currentWeddingId &&
    currentWeddingTitle;

  return (
    <header className="sticky top-0 z-10 flex min-h-[52px] items-center justify-between gap-4 border-b border-border bg-background px-1">
      {/* Left: Logo + Breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href="/dashboard"
          className="shrink-0 transition-colors duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          aria-label="Attimo dashboard"
        >
          <BrandMark className="h-5" />
        </Link>
        {isWeddingDetailRoute && currentWeddingTitle && (
          <>
            <ChevronRight className="size-3 shrink-0 text-tertiary-foreground" aria-hidden />
            <nav aria-label="Breadcrumb" className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-[11px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              >
                Dashboard
              </Link>
              <ChevronRight className="size-3 shrink-0 text-tertiary-foreground" aria-hidden />
              <span className="truncate text-[11px] font-medium text-foreground" aria-current="page">
                {currentWeddingTitle}
              </span>
            </nav>
          </>
        )}
      </div>

      {/* Center: Project Switcher */}
      <div className="flex shrink-0 items-center justify-center">
        {mounted && <ProjectSwitcher weddings={weddings} currentWeddingId={currentWeddingId} />}
      </div>

      {/* Right: Search + Avatar */}
      <div className="flex shrink-0 items-center gap-2">
        <label className="hidden sm:block">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Find…"
            autoComplete="off"
            className="h-8 min-w-[140px] max-w-[200px] rounded border border-input bg-card px-2.5 py-1 text-[11px] text-foreground placeholder:text-tertiary-foreground outline-none transition-colors duration-150 focus:border-border/20 focus:bg-white/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </label>
        {mounted ? <UserProfileDropdown /> : <ProfileDropdownPlaceholder />}
      </div>
    </header>
  );
}
