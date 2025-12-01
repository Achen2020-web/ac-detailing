import { supabaseServer } from "@/lib/supabase-server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, vehicle, service, date } = body;

  const { error } = await supabaseServer
    .from("bookings")
    .insert({
      name,
      email,
      vehicle,
      service,
      date,
    });

  if (error) {
    return Response.json({ error: "Failed to save booking" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "acdetailcleaning@gmail.com",
    subject: "New Booking Submission",
    text: `
A new booking has been submitted:

Name: ${name}
Email: ${email}
Vehicle: ${vehicle}
Service: ${service}
Preferred Date: ${date}

You can view this booking in Supabase.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (mailError) {
    return Response.json({ error: "Booking saved, but email failed" }, { status: 500 });
  }

  return Response.json({ success: true });
}
