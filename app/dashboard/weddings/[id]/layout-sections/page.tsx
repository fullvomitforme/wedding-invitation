import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { SectionsForm } from "./SectionsForm";
import type { SectionConfig } from "@/lib/wedding-defaults";

export const metadata = {
  title: "Layout | Wedding",
};

export default async function LayoutSectionsPage({
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
    .select("sections")
    .eq("id", id)
    .single();
  if (error || !wedding) notFound();

  const sections = (Array.isArray(wedding.sections) ? wedding.sections : []) as SectionConfig[];
  const initial = sections.length > 0 ? sections : [
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
    <div className="space-y-6">
      <SectionsForm weddingId={id} initialSections={initial} />
    </div>
  );
}
