import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, attendance, guestCount, message, wedding_id: weddingId } = body;

    if (!name || !attendance) {
      return NextResponse.json(
        { error: "Name and attendance are required" },
        { status: 400 }
      );
    }
    if (weddingId != null && !UUID_REGEX.test(String(weddingId))) {
      return NextResponse.json(
        { error: "Invalid wedding_id" },
        { status: 400 }
      );
    }

    if (!["yes", "no", "maybe"].includes(attendance)) {
      return NextResponse.json(
        { error: "Invalid attendance value" },
        { status: 400 }
      );
    }

    if (attendance === "yes" && (!guestCount || guestCount < 1)) {
      return NextResponse.json(
        { error: "Guest count must be at least 1 when attending" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("rsvp")
      .insert({
        name: name.trim(),
        attendance,
        guest_count: attendance === "yes" ? guestCount : 0,
        message: message?.trim() || null,
        ...(weddingId && { wedding_id: weddingId }),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit RSVP", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "RSVP submitted successfully",
        data: {
          id: data.id,
          name: data.name,
          attendance: data.attendance,
          guestCount: data.guest_count,
          message: data.message,
          submittedAt: data.submitted_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
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

    let query = supabase.from("rsvp").select("*").order("submitted_at", { ascending: false });
    if (weddingId) query = query.eq("wedding_id", weddingId);
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch RSVP data", details: error.message },
        { status: 500 }
      );
    }

    // Calculate statistics
    const totalResponses = data.length;
    const attending = data.filter((r) => r.attendance === "yes").length;
    const totalGuests = data
      .filter((r) => r.attendance === "yes")
      .reduce((sum, r) => sum + (r.guest_count || 0), 0);

    return NextResponse.json({
      success: true,
      data: data.map((item) => ({
        id: item.id,
        name: item.name,
        attendance: item.attendance,
        guestCount: item.guest_count,
        message: item.message,
        submittedAt: item.submitted_at,
      })),
      statistics: {
        totalResponses,
        attending,
        totalGuests,
      },
    });
  } catch (error) {
    console.error("Error fetching RSVP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP data" },
      { status: 500 }
    );
  }
}
