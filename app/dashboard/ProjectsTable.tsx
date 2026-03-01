"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableSkeletonRow } from "@/components/ui/skeleton";

type Wedding = {
  id: string;
  slug: string | null;
  status: string;
  content: unknown;
  updated_at?: string;
  created_at?: string;
};

type ProjectsTableProps = {
  weddings: Wedding[];
  baseDomain?: string;
  isLoading?: boolean;
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

export function ProjectsTable({ weddings, baseDomain = "localhost:3000", isLoading = false }: ProjectsTableProps) {
  const [filter, setFilter] = useState<"all" | "draft" | "released">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWeddings = weddings.filter((w) => {
    if (filter === "draft" && w.status !== "draft") return false;
    if (filter === "released" && w.status !== "released") return false;
    if (searchQuery) {
      const title = getWeddingTitle(w).toLowerCase();
      const slug = (w.slug ?? "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return title.includes(query) || slug.includes(query);
    }
    return true;
  });

  return (
    <section className="border-b border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[14px] font-semibold text-foreground">Projects</h2>
        <div className="flex flex-1 items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
              filter === "all"
                ? "border-border bg-white/5 text-foreground"
                : "border-transparent bg-transparent text-tertiary-foreground hover:text-muted-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("draft")}
            className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
              filter === "draft"
                ? "border-border bg-white/5 text-foreground"
                : "border-transparent bg-transparent text-tertiary-foreground hover:text-muted-foreground"
            }`}
          >
            Drafts
          </button>
          <button
            type="button"
            onClick={() => setFilter("released")}
            className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
              filter === "released"
                ? "border-border bg-white/5 text-foreground"
                : "border-transparent bg-transparent text-tertiary-foreground hover:text-muted-foreground"
            }`}
          >
            Released
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search projects…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 min-w-[160px] rounded border border-input bg-white/5 px-2.5 py-1 text-[11px] text-foreground placeholder:text-tertiary-foreground outline-none transition-colors focus:border-border/20 focus:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          />
          <Button
            asChild
            size="sm"
            className="h-8 rounded border border-white/[0.06] bg-[#BFA14A] px-3 text-[11px] font-medium text-[#0E0E10] transition-all duration-150 hover:border-white/10 hover:bg-[#BFA14A]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]"
          >
            <Link href="/dashboard/new">New Wedding</Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="border-b border-border bg-black/20">
            <tr>
              <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-tertiary-foreground">
                Project
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                Slug
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                Status
              </th>
              <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                Last edited
              </th>
              <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <TableSkeletonRow />
                <TableSkeletonRow />
                <TableSkeletonRow />
              </>
            ) : (
              filteredWeddings.map((w) => (
              <tr
                key={w.id}
                className="h-[40px] border-b border-border/70 last:border-0 hover:bg-white/[0.02] transition-colors duration-150"
              >
                <td className="max-w-[220px] px-3 align-middle">
                  <div className="truncate text-[12px] font-medium text-foreground">
                    {getWeddingTitle(w)}
                  </div>
                </td>
                <td className="px-3 align-middle">
                  <div className="font-mono text-[11px] text-tertiary-foreground">
                    {w.slug ?? "—"}
                  </div>
                </td>
                <td className="px-3 align-middle">
                  <StatusBadge status={w.status === "released" ? "released" : "draft"} />
                </td>
                <td className="px-3 align-middle">
                  <div className="text-[11px] text-tertiary-foreground">
                    {getRelativeTime(w.updated_at ?? w.created_at)}
                  </div>
                </td>
                <td className="px-3 align-middle">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/dashboard/weddings/${w.id}`}
                      className="text-[11px] text-muted-foreground underline-offset-4 transition-all duration-150 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/preview/${w.id}`}
                      className="text-[11px] text-muted-foreground underline-offset-4 transition-all duration-150 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded"
                    >
                      Preview
                    </Link>
                    {w.status === "released" && w.slug && (
                      <a
                        href={`https://${w.slug}.${baseDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-foreground underline-offset-4 transition-all duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded"
                      >
                        Visit
                      </a>
                    )}
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
