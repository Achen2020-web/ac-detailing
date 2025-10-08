import { NextRequest, NextResponse } from "next/server";

// OPTIONAL: Resend for email; Twilio for SMS
import { Resend } from "resend";
import twilio from "twilio";

const resend = new Resend(process.env.RESEND_API_KEY);      // or SendGrid/Postmark
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

function verifySignature(req: NextRequest) {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET || "";
  const got = req.headers.get("x-supa-signature") || "";
  return secret && got && got === secret; // use HMAC if you prefer; this is the simplest
}

export async function POST(req: NextRequest) {
  try {
    if (!verifySignature(req)) {
      return NextResponse.json({ ok: false, error: "bad signature" }, { status: 401 });
    }

    const body = await req.json();
    // Supabase sends something like: { type, table, record, schema, ... }
    const booking = body?.record || body?.new || body; // be tolerant to shapes
    if (!booking?.email) {
      return NextResponse.json({ ok: false, error: "no booking/email" }, { status: 400 });
    }

    // ---- Send email to customer
    try {
      await resend.emails.send({
        from: "AC Detailing <bookings@yourdomain.com>",
        to: booking.email,
        subject: "We got your booking request ✔",
        html: `
          <h2>Thanks for booking, ${booking.name || ""}!</h2>
          <p>Package: ${booking.package || "—"}</p>
          <p>Date: ${booking.date || "—"} at ${booking.time || "—"}</p>
          <p>We’ll confirm shortly. Reply to this email with any questions.</p>
        `,
      });
    } catch (e) {
      console.error("Customer email failed", e);
    }

    // ---- Send email to you (admin)
    try {
      await resend.emails.send({
        from: "AC Detailing <alerts@yourdomain.com>",
        to: process.env.ADMIN_EMAIL!, // set in Vercel env
        subject: "New booking received",
        html: `
          <h3>New booking</h3>
          <ul>
            <li>Name: ${booking.name}</li>
            <li>Email: ${booking.email}</li>
            <li>Phone: ${booking.phone || "—"}</li>
            <li>Vehicle: ${booking.vehicle || "—"}</li>
            <li>Package: ${booking.package || "—"}</li>
            <li>Date: ${booking.date || "—"} ${booking.time || ""}</li>
          </ul>
        `,
      });
    } catch (e) {
      console.error("Admin email failed", e);
    }

    // ---- Optional SMS to you or the customer
    if (process.env.TWILIO_FROM && booking.phone) {
      try {
        await twilioClient.messages.create({
          from: process.env.TWILIO_FROM,
          to: booking.phone, // or your phone for admin SMS alerts
          body: `AC Detailing: Booking received for ${booking.date || ""} ${booking.time || ""}. We'll confirm shortly.`,
        });
      } catch (e) {
        console.error("SMS failed", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
