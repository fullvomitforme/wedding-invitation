import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, message, wedding_id: weddingId } = body;

    if (!name || !location || !message) {
      return NextResponse.json(
        { error: "Name, location, and message are required" },
        { status: 400 }
      );
    }
    if (weddingId != null && !UUID_REGEX.test(String(weddingId))) {
      return NextResponse.json(
        { error: "Invalid wedding_id" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("wishes")
      .insert({
        name: name.trim(),
        location: location.trim(),
        message: message.trim(),
        ...(weddingId && { wedding_id: weddingId }),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit wish", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Wish submitted successfully",
        data: {
          id: data.id,
          name: data.name,
          location: data.location,
          message: data.message,
          createdAt: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting wish:", error);
    return NextResponse.json(
      { error: "Failed to submit wish" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const weddingId = request.nextUrl.searchParams.get("wedding_id");
    if (weddingId != null && !UUID_REGEX.test(weddingId)) {
      return NextResponse.json({ error: "Invalid wedding_id" }, { status: 400 });
    }
    const supabase = createServerClient();

    let query = supabase.from("wishes").select("*").order("created_at", { ascending: false });
    if (weddingId) query = query.eq("wedding_id", weddingId);
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch wishes data", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.map((item) => ({
        id: item.id,
        name: item.name,
        location: item.location,
        message: item.message,
        createdAt: item.created_at,
      })),
      count: data.length,
    });
  } catch (error) {
    console.error("Error fetching wishes data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishes data" },
      { status: 500 }
    );
  }
}
