import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return null;

  const supabase = createServerClient();
  const { data: memberships } = await supabase
    .from("wedding_collaborators")
    .select("wedding_id")
    .eq("user_id", session.user.id);

  const weddingIds = (memberships ?? []).map((m) => m.wedding_id);
  let weddings: { id: string; slug: string | null; status: string; content: unknown }[] = [];

  if (weddingIds.length > 0) {
    const { data } = await supabase
      .from("weddings")
      .select("id, slug, status, content")
      .in("id", weddingIds)
      .order("created_at", { ascending: false });
    weddings = data ?? [];
  }

  const title = (w: { content: unknown }) => {
    const c = w.content as { couple?: { bride?: { name?: string }; groom?: { name?: string } } } | undefined;
    const bride = c?.couple?.bride?.name;
    const groom = c?.couple?.groom?.name;
    if (bride && groom) return `${bride} & ${groom}`;
    if (bride || groom) return bride ?? groom ?? "Untitled";
    return "Untitled";
  };

  const draftCount = weddings.filter((w) => w.status === "draft").length;
  const releasedCount = weddings.filter((w) => w.status === "released").length;

  return (
    <div className="space-y-6">
      {/* Page title + primary actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-50 sm:text-2xl">
          Projects
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 rounded-md border-white/10 bg-transparent px-3 text-xs text-neutral-200 hover:bg-white/5 hover:text-neutral-50 focus-visible:ring-[#BFA14A]"
          >
            <Link href="/dashboard">All projects</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-8 rounded-md bg-neutral-100 px-3 text-xs font-medium text-[#0E0E10] hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10]"
          >
            <Link href="/dashboard/new">New Wedding</Link>
          </Button>
        </div>
      </div>

      {weddings.length === 0 ? (
        <section className="rounded-md border border-white/6 bg-[#141416] px-6 py-8">
          <h2 className="text-sm font-semibold text-neutral-50">No projects yet</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Create a wedding project to get started.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4 h-8 rounded-md bg-neutral-100 px-3 text-xs font-medium text-[#0E0E10] hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]"
          >
            <Link href="/dashboard/new">Create project</Link>
          </Button>
        </section>
      ) : (
        <>
          {/* Main deployment list panel */}
          <section className="overflow-hidden rounded-md border border-white/6 bg-[#141416]">
            <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
              <h2 className="text-sm font-semibold text-neutral-50">All projects</h2>
              <div className="flex gap-2">
                <span className="rounded border border-white/6 bg-white/5 px-2 py-0.5 text-[11px] text-neutral-400">
                  {weddings.length} {weddings.length === 1 ? "project" : "projects"}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-xs text-neutral-200">
                <thead className="border-b border-white/6 bg-black/20 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Project</th>
                    <th className="px-4 py-3 text-left font-medium">Slug</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Last edited</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weddings.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors duration-200"
                    >
                      <td className="max-w-[220px] px-4 py-3 align-middle">
                        <div className="truncate font-medium text-neutral-50">
                          {title(w)}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle font-mono text-[11px] text-neutral-400">
                        {w.slug ?? "—"}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {w.status === "released" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA14A] px-2 py-0.5 text-[11px] font-medium text-[#BFA14A]">
                            <span className="size-1.5 rounded-full bg-[#BFA14A]" aria-hidden />
                            Released
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-neutral-400">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle text-[11px] text-neutral-500">
                        —
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/weddings/${w.id}`}
                            className="rounded px-2 py-1 text-[11px] text-neutral-200 underline-offset-4 hover:text-neutral-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A]"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/preview/${w.id}`}
                            className="rounded px-2 py-1 text-[11px] text-neutral-200 underline-offset-4 hover:text-neutral-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A]"
                          >
                            Preview
                          </Link>
                          {w.status === "released" && w.slug && (
                            <a
                              href={`https://${w.slug}.localhost:3000`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded px-2 py-1 text-[11px] font-medium text-neutral-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A]"
                            >
                              View site
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-white/6 bg-[#141416] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                Projects
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-neutral-50">
                {weddings.length}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">Total wedding projects</p>
            </div>
            <div className="rounded-md border border-white/6 bg-[#141416] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                Drafts
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-neutral-50">
                {draftCount}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">Not yet released</p>
            </div>
            <div className="rounded-md border border-white/6 bg-[#141416] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                Released
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-[#BFA14A]">
                {releasedCount}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">Live on subdomain</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
