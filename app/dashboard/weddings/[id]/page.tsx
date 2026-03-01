import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { WeddingAccordion } from "./WeddingAccordion";
import type { WeddingContent } from "@/lib/wedding-defaults";
import type { SectionConfig } from "@/lib/wedding-defaults";

export default async function WeddingEditPage({
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
    .select("content, sections, slug, status")
    .eq("id", id)
    .single();
  if (error || !wedding) notFound();

  const content = (wedding.content ?? {}) as WeddingContent;
  const initialContent: WeddingContent = {
    couple: content.couple ?? {
      bride: { name: "", username: "", parentInfo: "", location: "" },
      groom: { name: "", username: "", parentInfo: "", location: "" },
    },
    events: Array.isArray(content.events) ? content.events : [],
    gallery: content.gallery,
    music: content.music,
  };

  const sections = (Array.isArray(wedding.sections) ? wedding.sections : []) as SectionConfig[];
  const initialSections = sections.length > 0 ? sections : [
    { id: "hero", enabled: true, order: 0 },
    { id: "couple", enabled: true, order: 1 },
    { id: "date", enabled: true, order: 2 },
    { id: "location", enabled: true, order: 3 },
    { id: "gallery", enabled: true, order: 4 },
    { id: "rsvp", enabled: true, order: 5 },
    { id: "wishes", enabled: true, order: 6 },
    { id: "gift", enabled: true, order: 7 },
    { id: "music", enabled: true, order: 8 },
  ];

  return (
    <WeddingAccordion
      weddingId={id}
      initialContent={initialContent}
      initialSections={initialSections}
      initialSlug={wedding.slug}
      initialStatus={wedding.status}
    />
  );
}
