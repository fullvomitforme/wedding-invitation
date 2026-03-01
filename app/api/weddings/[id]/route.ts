import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";

const RESERVED_SLUGS = new Set(["www", "api", "app", "dashboard", "admin", "login", "signup", "preview", "invitation"]);
const SLUG_REGEX = /^[a-z0-9-]+$/;
const SLUG_MIN = 2;
const SLUG_MAX = 63;

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
  if (!membership) return { wedding: null, error: "Forbidden" as const };

  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("id, slug, status, template_id, sections, content, created_at, updated_at")
    .eq("id", weddingId)
    .single();
  if (error || !wedding) return { wedding: null, error: "Not found" as const };
  return { wedding, error: null };
}

function validateSlug(slug: unknown): { ok: true; slug: string } | { ok: false; error: string } {
  if (typeof slug !== "string" || slug.length < SLUG_MIN || slug.length > SLUG_MAX) {
    return { ok: false, error: `Slug must be ${SLUG_MIN}–${SLUG_MAX} characters` };
  }
  const lower = slug.toLowerCase().trim();
  if (!SLUG_REGEX.test(lower)) {
    return { ok: false, error: "Slug can only use lowercase letters, numbers, and hyphens" };
  }
  if (RESERVED_SLUGS.has(lower)) {
    return { ok: false, error: "This slug is reserved" };
  }
  return { ok: true, slug: lower };
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const supabase = createServerClient();
    const { wedding, error } = await getWeddingAndAccess(id, session.user.id, supabase);
    if (error === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error === "Not found" || !wedding) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(wedding);
  } catch (err) {
    console.error("GET /api/weddings/[id]:", err);
    return NextResponse.json({ error: "Failed to load wedding" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const supabase = createServerClient();
    const { wedding, error: accessError } = await getWeddingAndAccess(id, session.user.id, supabase);
    if (accessError === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (accessError === "Not found" || !wedding) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.content !== undefined) updates.content = body.content;
    if (body.sections !== undefined) updates.sections = body.sections;
    if (body.template_id !== undefined) {
      // Validate template_id
      const validTemplateIds = ["classic", "modern", "minimalist", "floral"];
      if (typeof body.template_id === "string" && validTemplateIds.includes(body.template_id)) {
        updates.template_id = body.template_id;
      } else {
        return NextResponse.json({ error: "Invalid template_id" }, { status: 400 });
      }
    }
    if (body.status !== undefined) {
      if (!["draft", "released"].includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.slug !== undefined) {
      const result = validateSlug(body.slug);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      const { data: existing } = await supabase
        .from("weddings")
        .select("id")
        .eq("slug", result.slug)
        .neq("id", id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
      updates.slug = result.slug;
    }

    const { data: updated, error: updateError } = await supabase
      .from("weddings")
      .update(updates)
      .eq("id", id)
      .select("id, slug, status, template_id, sections, content, created_at, updated_at")
      .single();

    if (updateError) {
      console.error("PATCH wedding error:", updateError);
      return NextResponse.json({ error: "Failed to update wedding" }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/weddings/[id]:", err);
    return NextResponse.json({ error: "Failed to update wedding" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const supabase = createServerClient();

    // Only the owner can delete the wedding site.
    const { data: membership } = await supabase
      .from("wedding_collaborators")
      .select("role")
      .eq("wedding_id", id)
      .eq("user_id", session.user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Only the owner can delete this wedding" }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("weddings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("DELETE wedding error:", deleteError);
      return NextResponse.json({ error: "Failed to delete wedding" }, { status: 500 });
    }

    // Related collaborators, RSVP, and wishes rows cascade via FKs.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/weddings/[id]:", err);
    return NextResponse.json({ error: "Failed to delete wedding" }, { status: 500 });
  }
}
