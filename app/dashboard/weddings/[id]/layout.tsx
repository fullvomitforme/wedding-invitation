import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex gap-6">
      <aside className="w-64 shrink-0">
        <Card className="border-border bg-card/90">
          <CardHeader className="space-y-1">
            <CardTitle className="truncate text-base" title={title}>
              {title}
            </CardTitle>
            <CardDescription>Invitation builder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <nav className="flex flex-col gap-1 text-sm">
              <Link
                href={`/dashboard/weddings/${id}`}
                className="rounded-md px-2 py-1 text-foreground/80 hover:bg-accent hover:text-accent-foreground"
              >
                Overview
              </Link>
              <Link
                href={`/dashboard/weddings/${id}/content`}
                className="rounded-md px-2 py-1 text-foreground/80 hover:bg-accent hover:text-accent-foreground"
              >
                Content
              </Link>
              <Link
                href={`/dashboard/weddings/${id}/layout-sections`}
                className="rounded-md px-2 py-1 text-foreground/80 hover:bg-accent hover:text-accent-foreground"
              >
                Layout
              </Link>
              <Link
                href={`/dashboard/weddings/${id}/settings`}
                className="rounded-md px-2 py-1 text-foreground/80 hover:bg-accent hover:text-accent-foreground"
              >
                Settings
              </Link>
            </nav>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="justify-start px-0 text-primary hover:text-primary"
            >
              <Link
                href={`/preview/${id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </aside>
      <div className="min-w-0 flex-1 space-y-6">{children}</div>
    </div>
  );
}
