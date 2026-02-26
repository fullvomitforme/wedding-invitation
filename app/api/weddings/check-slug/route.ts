import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";

const RESERVED = new Set(["www", "api", "app", "dashboard", "admin", "login", "signup", "preview", "invitation"]);
const SLUG_REGEX = /^[a-z0-9-]+$/;
const SLUG_MIN = 2;
const SLUG_MAX = 63;

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const slug = request.nextUrl.searchParams.get("slug")?.toLowerCase().trim();
    const excludeWeddingId = request.nextUrl.searchParams.get("weddingId") ?? undefined;

    if (!slug) {
      return NextResponse.json({ available: false, error: "Slug is required" }, { status: 400 });
    }
    if (slug.length < SLUG_MIN || slug.length > SLUG_MAX) {
      return NextResponse.json({ available: false, error: `Slug must be ${SLUG_MIN}–${SLUG_MAX} characters` });
    }
    if (!SLUG_REGEX.test(slug)) {
      return NextResponse.json({ available: false, error: "Slug can only use lowercase letters, numbers, and hyphens" });
    }
    if (RESERVED.has(slug)) {
      return NextResponse.json({ available: false, error: "This slug is reserved" });
    }

    const supabase = createServerClient();
    let query = supabase.from("weddings").select("id").eq("slug", slug);
    if (excludeWeddingId) query = query.neq("id", excludeWeddingId);
    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("check-slug error:", error);
      return NextResponse.json({ available: false, error: "Check failed" }, { status: 500 });
    }
    return NextResponse.json({ available: !data });
  } catch (err) {
    console.error("GET /api/weddings/check-slug:", err);
    return NextResponse.json({ available: false, error: "Check failed" }, { status: 500 });
  }
}
