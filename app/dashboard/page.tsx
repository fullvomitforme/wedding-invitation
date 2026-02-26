import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";

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
        <h1 className="text-xl font-semibold">My weddings</h1>
        <NewWeddingButton />
      </div>
      {weddings.length === 0 ? (
        <p className="text-foreground/70">No weddings yet. Create one to get started.</p>
      ) : (
        <ul className="space-y-3">
          {weddings.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between rounded border border-gray-200 p-3"
            >
              <div>
                <span className="font-medium">{title(w)}</span>
                {w.slug && (
                  <span className="ml-2 text-sm text-foreground/60">
                    {w.slug}
                  </span>
                )}
                <span className="ml-2 text-sm capitalize text-foreground/60">
                  ({w.status})
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/weddings/${w.id}`}
                  className="text-sm underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/preview/${w.id}`}
                  className="text-sm underline"
                >
                  Preview
                </Link>
                {w.status === "released" && w.slug && (
                  <a
                    href={`https://${w.slug}.localhost:3000`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                  >
                    View site
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewWeddingButton() {
  return (
    <Link
      href="/dashboard/new"
      className="rounded bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
    >
      New wedding
    </Link>
  );
}
