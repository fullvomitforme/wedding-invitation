import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";

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

  const nav = [
    { href: `/dashboard/weddings/${id}`, label: "Overview" },
    { href: `/dashboard/weddings/${id}/content`, label: "Content" },
    { href: `/dashboard/weddings/${id}/layout-sections`, label: "Layout" },
    { href: `/dashboard/weddings/${id}/settings`, label: "Settings" },
  ];

  return (
    <div className="flex gap-6">
      <aside className="w-48 shrink-0 space-y-1 border-r border-gray-200 pr-4">
        <p className="text-sm font-medium text-foreground/80 truncate" title={title}>
          {title}
        </p>
        <nav className="flex flex-col gap-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="pt-2">
          <Link
            href={`/preview/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground/80 hover:text-foreground"
          >
            Preview →
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
