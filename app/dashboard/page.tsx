import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ProjectsTable } from "./ProjectsTable";

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
  let weddings: { id: string; slug: string | null; status: string; content: unknown; updated_at?: string; created_at?: string }[] = [];

  if (weddingIds.length > 0) {
    const { data } = await supabase
      .from("weddings")
      .select("id, slug, status, content, updated_at, created_at")
      .in("id", weddingIds)
      .order("created_at", { ascending: false });
    weddings = data ?? [];
  }

  const draftCount = weddings.filter((w) => w.status === "draft").length;
  const releasedCount = weddings.filter((w) => w.status === "released").length;

  return (
    <div className="space-y-0">
      {/* Summary cards - above table */}
      {weddings.length > 0 && (
        <div className="gap-0 grid sm:grid-cols-3 border-border border-b">
          <div className="bg-card px-3 py-3 border-border sm:border-r sm:border-r-border border-b sm:border-b-0">
            <p className="font-medium text-[11px] text-tertiary-foreground uppercase tracking-wider">
              Projects
            </p>
            <p className="mt-1 font-semibold tabular-nums text-[16px] text-foreground">
              {weddings.length}
            </p>
            <p className="mt-0.5 text-[11px] text-tertiary-foreground">Total wedding projects</p>
          </div>
          <div className="bg-card px-3 py-3 border-border sm:border-r sm:border-r-border border-b sm:border-b-0">
            <p className="font-medium text-[11px] text-tertiary-foreground uppercase tracking-wider">
              Drafts
            </p>
            <p className="mt-1 font-semibold tabular-nums text-[16px] text-foreground">
              {draftCount}
            </p>
            <p className="mt-0.5 text-[11px] text-tertiary-foreground">Not yet released</p>
          </div>
          <div className="bg-card px-3 py-3">
            <p className="font-medium text-[11px] text-tertiary-foreground uppercase tracking-wider">
              Released
            </p>
            <p className="mt-1 font-semibold tabular-nums text-[16px] text-primary">
              {releasedCount}
            </p>
            <p className="mt-0.5 text-[11px] text-tertiary-foreground">Live on subdomain</p>
          </div>
        </div>
      )}

      {weddings.length === 0 ? (
        <section className="flex flex-col justify-center items-center bg-card px-3 py-12 border-border border-b min-h-[400px] text-center">
          <h2 className="font-semibold text-[14px] text-foreground">No projects yet</h2>
          <p className="mt-1 text-[11px] text-tertiary-foreground">
            Create a wedding project to get started.
          </p>
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 mt-6 px-3 border border-border rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card h-8 font-medium text-[11px] text-primary-foreground transition-all duration-150"
          >
            <Link href="/dashboard/new">New Wedding</Link>
          </Button>
        </section>
      ) : (
        <ProjectsTable
          weddings={weddings}
          baseDomain={process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "localhost:3000"}
        />
      )}
    </div>
  );
}
