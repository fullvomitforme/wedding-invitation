import { NextResponse } from "next/server";
import { defaultSongs } from "@/lib/music";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      songs: defaultSongs,
    });
  } catch (error) {
    console.error("Error fetching music:", error);
    return NextResponse.json(
      { error: "Failed to fetch music" },
      { status: 500 }
    );
  }
}
