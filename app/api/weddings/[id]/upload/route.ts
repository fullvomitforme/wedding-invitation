import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";

const BUCKET = "wedding-assets";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function getWeddingAndAccess(
  weddingId: string,
  userId: string,
  supabase: ReturnType<typeof createServerClient>
) {
  const { data: membership } = await supabase
    .from("wedding_collaborators")
    .select("wedding_id")
    .eq("wedding_id", weddingId)
    .eq("user_id", userId)
    .single();
  if (!membership) return { error: "Forbidden" as const };

  const { data: wedding } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", weddingId)
    .single();
  if (!wedding) return { error: "Not found" as const };
  return { error: null };
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100) || "image";
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: weddingId } = await context.params;
    const supabase = createServerClient();
    const access = await getWeddingAndAccess(weddingId, session.user.id, supabase);
    if (access.error) {
      return NextResponse.json(
        { error: access.error === "Forbidden" ? "Forbidden" : "Not found" },
        { status: access.error === "Forbidden" ? 403 : 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid file (use field name 'file')" },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const extFromMime =
      file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1] ?? "jpg";
    const ext = /^(jpe?g|png|webp|gif)$/i.test(extFromMime) ? extFromMime : "jpg";
    const base = sanitizeFilename(
      file.name.replace(/\.[^.]+$/, "") || "image"
    );
    const path = `${weddingId}/couple/${Date.now()}-${base}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      if (error.message?.includes("Bucket not found") || error.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            error:
              "Storage bucket not set up. Create a public bucket named 'wedding-assets' in Supabase Dashboard → Storage.",
          },
          { status: 503 }
        );
      }
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: error.message ?? "Upload failed" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("POST /api/weddings/[id]/upload:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
