import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { SettingsForm } from "./SettingsForm";

export const metadata = {
  title: "Settings | Wedding",
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const supabase = createServerClient();
  const { data: membership } = await supabase
    .from("wedding_collaborators")
    .select("wedding_id")
    .eq("wedding_id", id)
    .eq("user_id", session.user.id)
    .single();
  if (!membership) redirect("/dashboard");

  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("slug, status")
    .eq("id", id)
    .single();
  if (error || !wedding) notFound();

  return (
    <div className="space-y-6">
      <SettingsForm
        weddingId={id}
        initialSlug={wedding.slug}
        initialStatus={wedding.status}
      />
    </div>
  );
}
