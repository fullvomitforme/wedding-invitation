"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";
import { ChevronDown, Check, Plus, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type Wedding = {
  id: string;
  slug: string | null;
  status: string;
  content: unknown;
  updated_at?: string;
  created_at?: string;
};

type ProjectSwitcherProps = {
  weddings: Wedding[];
  currentWeddingId?: string;
};

function getWeddingTitle(w: Wedding): string {
  const c = w.content as { couple?: { bride?: { name?: string }; groom?: { name?: string } } } | undefined;
  const bride = c?.couple?.bride?.name;
  const groom = c?.couple?.groom?.name;
  if (bride && groom) return `${bride} & ${groom}`;
  if (bride || groom) return bride ?? groom ?? "Untitled";
  return "Untitled";
}

function getRelativeTime(dateString: string | undefined): string {
  if (!dateString) return "—";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return "—";
  }
}

export function ProjectSwitcher({ weddings, currentWeddingId }: ProjectSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOnDashboard = pathname === "/dashboard" || pathname === "/dashboard/new";

  const currentWedding = currentWeddingId
    ? weddings.find((w) => w.id === currentWeddingId)
    : null;
  const currentTitle = isOnDashboard
    ? "All Projects"
    : currentWedding
      ? getWeddingTitle(currentWedding)
      : "Select project";

  const filteredWeddings = useMemo(() => {
    if (!searchQuery) return weddings;
    const query = searchQuery.toLowerCase();
    return weddings.filter((w) => {
      const title = getWeddingTitle(w).toLowerCase();
      const slug = (w.slug ?? "").toLowerCase();
      return title.includes(query) || slug.includes(query);
    });
  }, [weddings, searchQuery]);

  if (!mounted) {
    return (
      <div className="flex h-8 min-w-[140px] items-center justify-between gap-2 rounded border border-input bg-card px-3 py-1.5">
        <span className="truncate text-xs font-medium text-muted-foreground">Loading…</span>
        <ChevronDown className="size-3 shrink-0 text-tertiary-foreground" aria-hidden />
      </div>
    );
  }

  const itemClass =
    "flex min-h-[44px] cursor-pointer select-none items-center gap-2 rounded px-2 py-2 text-[11px] text-foreground outline-none transition-colors duration-150 hover:bg-white/5 hover:text-foreground focus:bg-white/5 focus:text-foreground data-[highlighted]:bg-white/5 data-[highlighted]:text-foreground data-[highlighted]:outline-none";

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex h-8 min-w-[140px] items-center justify-between gap-2 rounded border border-input bg-card px-3 py-1.5 text-xs text-foreground transition-colors duration-150 hover:border-border/20 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Switch project"
        >
          <span className="truncate font-medium">{currentTitle}</span>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="center"
          className="z-50 w-[320px] rounded border border-border bg-card p-0 shadow-lg"
        >
          {/* Search input */}
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-tertiary-foreground" aria-hidden />
              <input
                type="search"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded border border-input bg-white/5 pl-7 pr-2 text-[11px] text-foreground placeholder:text-tertiary-foreground outline-none transition-colors duration-150 focus:border-border/20 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                autoFocus
              />
            </div>
          </div>

          {/* Projects list */}
          <div className="max-h-[320px] overflow-y-auto">
            <DropdownMenu.Item asChild className={itemClass}>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2"
              >
                <span className="flex-1 truncate text-[11px] font-medium text-foreground">All projects</span>
                {isOnDashboard && (
                  <Check className="size-3 shrink-0 text-primary" aria-hidden />
                )}
              </Link>
            </DropdownMenu.Item>
            {filteredWeddings.length > 0 && (
              <>
                <DropdownMenu.Separator className="h-px bg-border" />
                {filteredWeddings.map((wedding) => {
                  const title = getWeddingTitle(wedding);
                  const isActive = wedding.id === currentWeddingId;
                  const isReleased = wedding.status === "released";
                  return (
                    <DropdownMenu.Item key={wedding.id} asChild className={itemClass}>
                      <Link
                        href={`/dashboard/weddings/${wedding.id}`}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-start gap-2"
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-[11px] font-medium text-foreground">{title}</span>
                            <span
                              className={cn(
                                "size-1.5 shrink-0 rounded-full",
                                isReleased ? "bg-primary" : "bg-tertiary-foreground"
                              )}
                              aria-label={isReleased ? "Released" : "Draft"}
                            />
                          </div>
                          <span className="text-[10px] text-tertiary-foreground">
                            {getRelativeTime(wedding.updated_at ?? wedding.created_at)}
                          </span>
                        </div>
                        {isActive && (
                          <Check className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden />
                        )}
                      </Link>
                    </DropdownMenu.Item>
                  );
                })}
              </>
            )}
            {filteredWeddings.length === 0 && searchQuery && (
              <div className="px-3 py-4 text-center">
                <p className="text-[11px] text-tertiary-foreground">No projects found</p>
              </div>
            )}
          </div>

          {/* Create new project */}
          <div className="border-t border-border p-1">
            <DropdownMenu.Item asChild className={itemClass}>
              <Link
                href="/dashboard/new"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2"
              >
                <Plus className="size-3 shrink-0 text-muted-foreground" aria-hidden />
                <span className="text-[11px] font-medium text-foreground">Create new project</span>
              </Link>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
