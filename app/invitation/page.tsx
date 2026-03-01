import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { getTemplateComponent } from "@/lib/templates";
import type { SectionConfig } from "@/components/InvitationContext";

export const dynamic = "force-dynamic";

export default async function InvitationPage() {
  const headersList = await headers();
  const slug = headersList.get("x-wedding-slug");
  if (!slug) notFound();

  const supabase = createServerClient();
  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("id, slug, status, template_id, sections, content")
    .eq("slug", slug)
    .eq("status", "released")
    .single();

  if (error || !wedding) notFound();

  const sections = (Array.isArray(wedding.sections) ? wedding.sections : []) as SectionConfig[];
  const content = (wedding.content ?? {}) as any;
  const TemplateComponent = getTemplateComponent(wedding.template_id ?? "classic");

  return (
    <TemplateComponent
      weddingId={wedding.id}
      content={content}
      sections={sections}
    />
  );
}
