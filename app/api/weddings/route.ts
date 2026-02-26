import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import { defaultSections, defaultContent } from "@/lib/wedding-defaults";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const content = (body.content as Record<string, unknown>) ?? defaultContent;

    const supabase = createServerClient();
    const { data: wedding, error: weddingError } = await supabase
      .from("weddings")
      .insert({
        status: "draft",
        template_id: "classic",
        sections: defaultSections,
        content,
      })
      .select("id, slug")
      .single();

    if (weddingError || !wedding) {
      console.error("Create wedding error:", weddingError);
      return NextResponse.json(
        { error: "Failed to create wedding" },
        { status: 500 }
      );
    }

    const { error: collabError } = await supabase
      .from("wedding_collaborators")
      .insert({
        wedding_id: wedding.id,
        user_id: session.user.id,
        role: "owner",
      });

    if (collabError) {
      console.error("Create collaborator error:", collabError);
      await supabase.from("weddings").delete().eq("id", wedding.id);
      return NextResponse.json(
        { error: "Failed to create wedding" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { id: wedding.id, slug: wedding.slug },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/weddings:", err);
    return NextResponse.json(
      { error: "Failed to create wedding" },
      { status: 500 }
    );
  }
}
