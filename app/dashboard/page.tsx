import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">My weddings</h1>
        <Button asChild>
          <Link href="/dashboard/new">New wedding</Link>
        </Button>
      </div>
      {weddings.length === 0 ? (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>No weddings yet</CardTitle>
            <CardDescription>Create one to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/new">Create wedding</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {weddings.map((w) => (
            <Card key={w.id} className="border-border py-4 shadow-none">
              <CardContent className="flex flex-col gap-3 px-6 py-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="font-medium text-foreground">{title(w)}</span>
                  {w.slug && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {w.slug}
                    </span>
                  )}
                  <span className="ml-2 text-sm capitalize text-muted-foreground">
                    ({w.status})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/weddings/${w.id}`}>Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/preview/${w.id}`}>Preview</Link>
                  </Button>
                  {w.status === "released" && w.slug && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://${w.slug}.localhost:3000`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View site
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
