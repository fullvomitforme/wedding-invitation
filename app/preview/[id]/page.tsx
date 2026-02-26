import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";
import { ClassicTemplate } from "@/app/invitation/ClassicTemplate";
import type { SectionConfig } from "@/components/InvitationContext";

export default async function PreviewPage({
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
  if (!membership) notFound();

  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("id, slug, status, template_id, sections, content")
    .eq("id", id)
    .single();
  if (error || !wedding) notFound();

  const sections = (Array.isArray(wedding.sections) ? wedding.sections : []) as SectionConfig[];
  const content = (wedding.content ?? {}) as Parameters<typeof ClassicTemplate>[0]["content"];

  return (
    <ClassicTemplate
      weddingId={wedding.id}
      content={content}
      sections={sections}
    />
  );
}
