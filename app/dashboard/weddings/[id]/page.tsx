import Link from "next/link";

export default async function WeddingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-neutral-50">Overview</h1>
      <p className="text-sm text-neutral-400">
        Edit your wedding invitation from the sections below.
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm text-neutral-300">
        <li>
          <Link
            href={`/dashboard/weddings/${id}/content`}
            className="underline underline-offset-2 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] rounded"
          >
            Content
          </Link>
          {" "}
          — Couple, events, gallery, music
        </li>
        <li>
          <Link
            href={`/dashboard/weddings/${id}/layout-sections`}
            className="underline underline-offset-2 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] rounded"
          >
            Layout
          </Link>
          {" "}
          — Toggle and reorder sections
        </li>
        <li>
          <Link
            href={`/dashboard/weddings/${id}/settings`}
            className="underline underline-offset-2 hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] rounded"
          >
            Settings
          </Link>
          {" "}
          — Subdomain (slug) and release
        </li>
      </ul>
    </div>
  );
}
