import Link from "next/link";

export default async function WeddingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Overview</h1>
      <p className="text-foreground/70">
        Edit your wedding invitation from the sections below.
      </p>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>
          <Link href={`/dashboard/weddings/${id}/content`} className="underline">
            Content
          </Link>
          {" "}
          — Couple, events, gallery, music
        </li>
        <li>
          <Link href={`/dashboard/weddings/${id}/layout-sections`} className="underline">
            Layout
          </Link>
          {" "}
          — Toggle and reorder sections
        </li>
        <li>
          <Link href={`/dashboard/weddings/${id}/settings`} className="underline">
            Settings
          </Link>
          {" "}
          — Subdomain (slug) and release
        </li>
      </ul>
    </div>
  );
}
