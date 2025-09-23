import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Gmail SMTP transporter
function makeTransporter() {
  const user = process.env.GMAIL_USER!;
  const pass = process.env.GMAIL_PASS!;
  if (!user || !pass) throw new Error("Missing GMAIL_USER/GMAIL_PASS env vars");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

const EXPECTED = process.env.SUPABASE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Optional: shared secret check for Supabase DB Webhook
    if (EXPECTED) {
      const sig = req.headers.get("x-supabase-signature");
      if (sig !== EXPECTED) {
        return NextResponse.json({ ok: false, msg: "unauthorized" }, { status: 401 });
      }
    }

    // Supabase DB webhook payload shape (row-level)
    const payload = await req.json();
    const row = payload.record || payload.new || payload;

    // Fallbacks so the email always renders
    const name = row?.name || "Unknown";
    const email = row?.email || "Unknown";
    const phone = row?.phone || "Unknown";
    const vehicle = row?.vehicle || "Unknown";
    const message = row?.message || "No message";

    const transporter = makeTransporter();
    const from = `AC Detailing <${process.env.GMAIL_USER}>`;
    const to = process.env.GMAIL_USER!; // send to yourself

    // Email to YOU (the business)
    await transporter.sendMail({
      from,
      to,
      subject: "New Inquiry Received",
      text:
`New inquiry from the website:

Name:    ${name}
Email:   ${email}
Phone:   ${phone}
Vehicle: ${vehicle}

Message:
${message}
`,
      // makes reply button go to the customer's address
      replyTo: email !== "Unknown" ? email : undefined,
    });

    // (Optional) Send a quick confirmation to the customer if they left a valid email
    if (email && email.includes("@")) {
      await transporter.sendMail({
        from,
        to: email,
        subject: "We got your inquiry — AC Detailing",
        text:
`Hi ${name},

Thanks for reaching out to AC Detailing. We received your message and will get back to you shortly.

— AC Detailing
acdetailcleaning@gmail.com`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("inquiry-webhook error", err);
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}