import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { DashboardHeader } from "./DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's weddings for the project switcher
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
      .select("id, slug, status, content, updated_at, created_at")
      .in("id", weddingIds)
      .order("created_at", { ascending: false });
    weddings = data ?? [];
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader weddings={weddings} />
      <main className="flex-1 border-b border-border">
        <div className="p-1">{children}</div>
      </main>
    </div>
  );
}
