import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("reservations")
      .select("check_in, check_out")
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Supabase availability fetch error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Failed to fetch availability:", err);
    return NextResponse.json([], { status: 200 });
  }
}
