import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Bot Honeypot check (hidden field that real users do not fill)
    if (data.honeypot && data.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Request received" });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests = 1,
      notes = "",
      accommodationType = "whole_villa",
      estimatedTotal = 0,
      breakdown = "",
    } = data;

    // 2. Validate required fields
    if (!firstName || !lastName || !email || !phone || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (
      isNaN(checkInDate.getTime()) ||
      isNaN(checkOutDate.getTime()) ||
      checkOutDate <= checkInDate
    ) {
      return NextResponse.json(
        { success: false, error: "Check-out date must be after check-in date." },
        { status: 400 }
      );
    }

    const accommodationLabels: Record<string, string> = {
      whole_villa: "Whole Villa Exclusive (Weekdays: ₹50,000 / Weekends: ₹60,000)",
      ground_floor_garden: "Ground Floor Garden Suite (₹8,000 / night)",
      second_floor_beach_view: "Second Floor Beach View Suite (₹10,000 / night)",
      terrace_suite: "Terrace Suite Beach View (₹13,000 / night)",
    };

    const accommodationTitle = accommodationLabels[accommodationType] || "Whole Villa Exclusive";

    const fullNotesPayload = [
      `[Option: ${accommodationTitle}]`,
      estimatedTotal ? `[Est. Tariff: ₹${Number(estimatedTotal).toLocaleString("en-IN")}]` : null,
      breakdown ? `[Rate Breakdown: ${breakdown}]` : null,
      notes ? `Guest Special Notes: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // 3. Insert into Supabase if configured with graceful local fallback
    let reservationId = `CM-${Date.now().toString().slice(-6)}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: insertedData, error: dbError } = await supabase
          .from("reservations")
          .insert({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.replace(/[^\d+]/g, ""),
            check_in: checkIn,
            check_out: checkOut,
            guests: Number(guests) || 1,
            notes: fullNotesPayload,
            status: "pending",
          })
          .select("id")
          .single();

        if (dbError) {
          console.warn(
            "Supabase insert warning (falling back to generated reservation ID):",
            dbError.message || dbError
          );
        } else if (insertedData?.id) {
          reservationId = insertedData.id;
        }
      } catch (dbEx: any) {
        console.warn(
          "Supabase connection exception (falling back to generated reservation ID):",
          dbEx?.message || dbEx
        );
      }
    } else {
      console.warn(
        "Supabase credentials not configured or incomplete in .env.local. Reservation logged locally:",
        { firstName, lastName, email, phone, checkIn, checkOut, guests, accommodationType, estimatedTotal }
      );
    }

    // 4. Send Email Notification via Resend if configured (non-blocking)
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail =
      process.env.NOTIFICATION_EMAIL || "casameridianecr@gmail.com";

    if (resendApiKey && resendApiKey.trim() !== "" && !resendApiKey.includes("your-")) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Casa Meridian <onboarding@resend.dev>",
          to: [notificationEmail],
          subject: `✨ New Reservation Request: ${firstName} ${lastName} (${checkIn} to ${checkOut})`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a1a22; color: #f5f2eb; border-radius: 12px;">
              <h1 style="color: #b8935a; font-size: 24px; margin-bottom: 20px; border-bottom: 1px solid #b8935a40; padding-bottom: 12px;">
                Casa Meridian Reservation Request
              </h1>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Guest Name:</strong> ${firstName} ${lastName}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
              <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 16px 0;" />
              <p style="font-size: 16px; margin: 8px 0;"><strong>Selected Stay:</strong> ${accommodationTitle}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Estimated Total:</strong> ₹${Number(estimatedTotal).toLocaleString("en-IN")}</p>
              ${breakdown ? `<p style="font-size: 14px; color: #b8935a; margin: 4px 0;"><strong>Breakdown:</strong> ${breakdown}</p>` : ""}
              <p style="font-size: 16px; margin: 8px 0;"><strong>Check-In:</strong> ${checkIn}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Check-Out:</strong> ${checkOut}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Number of Guests:</strong> ${guests}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Special Notes:</strong> ${notes || "None provided"}</p>
              <p style="font-size: 16px; margin: 8px 0;"><strong>Status:</strong> Pending Confirmation</p>
            </div>
          `,
        });
      } catch (emailErr: any) {
        console.warn("Resend email dispatch error (non-fatal):", emailErr?.message || emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      id: reservationId,
      message: "Reservation request submitted successfully.",
    });
  } catch (err: any) {
    console.error("Reserve route exception:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
