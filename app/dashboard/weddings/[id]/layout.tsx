import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/status-badge";

const BASE_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "localhost:3000";

export default async function WeddingEditLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect("/login");

  const supabase = createServerClient();
  const { data: wedding, error: weddingError } = await supabase
    .from("weddings")
    .select("id, slug, status, content")
    .eq("id", id)
    .single();

  if (weddingError || !wedding) notFound();

  const { data: membership } = await supabase
    .from("wedding_collaborators")
    .select("role")
    .eq("wedding_id", id)
    .eq("user_id", session.user.id)
    .single();

  if (!membership) redirect("/dashboard");

  const c = wedding.content as { couple?: { bride?: { name?: string }; groom?: { name?: string } } } | undefined;
  const bride = c?.couple?.bride?.name;
  const groom = c?.couple?.groom?.name;
  const title =
    bride && groom ? `${bride} & ${groom}` : bride ?? groom ?? wedding.slug ?? "Untitled";

  const siteUrl =
    wedding.slug && wedding.status === "released"
      ? `https://${wedding.slug}.${BASE_DOMAIN}`
      : null;

  return (
    <div className="space-y-0">
      {/* Project header: title + status + actions */}
      <div className="flex flex-col gap-4 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="truncate text-[16px] font-semibold tracking-tight text-foreground" title={title}>
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={wedding.status === "released" ? "released" : "draft"} />
          <Link
            href={`/preview/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center rounded border border-border bg-transparent px-3 text-[11px] text-muted-foreground transition-all duration-150 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Preview
          </Link>
          <Link
            href={`/dashboard/weddings/${id}/settings`}
            className="inline-flex h-8 items-center rounded border border-border bg-transparent px-3 text-[11px] text-muted-foreground transition-all duration-150 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Settings
          </Link>
          {siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center rounded border border-border bg-white/5 px-3 text-[11px] font-medium text-foreground transition-all duration-150 hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Visit
            </a>
          ) : null}
        </div>
      </div>

      {/* Main content panel - accordion will be rendered here */}
      <div className="border-b border-border bg-card">
        {children}
      </div>
    </div>
  );
}
