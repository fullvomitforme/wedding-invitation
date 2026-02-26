import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { ContentForm } from "./ContentForm";
import type { WeddingContent } from "@/lib/wedding-defaults";

export const metadata = {
  title: "Content | Wedding",
};

export default async function ContentPage({
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
    .select("content")
    .eq("id", id)
    .single();
  if (error || !wedding) notFound();

  const content = (wedding.content ?? {}) as WeddingContent;
  const initial: WeddingContent = {
    couple: content.couple ?? {
      bride: { name: "", username: "", parentInfo: "", location: "" },
      groom: { name: "", username: "", parentInfo: "", location: "" },
    },
    events: Array.isArray(content.events) ? content.events : [],
    gallery: content.gallery,
    music: content.music,
  };

  return (
    <div className="space-y-6">
      <ContentForm weddingId={id} initialContent={initial} />
    </div>
  );
}
