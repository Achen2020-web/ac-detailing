import { supabaseServer } from "@/lib/supabase-server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, vehicle, message } = body;

  // Insert into customer_inquiries table
  const { error } = await supabaseServer.from("customer_inquiries").insert({
    name,
    email,
    phone,
    vehicle,
    message,
  });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  // Send notification email
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
    subject: "New Inquiry",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nVehicle: ${vehicle}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (mailError) {
    return Response.json({ error: "Inquiry saved, but email failed" }, { status: 500 });
  }

  return Response.json({ success: true });
}
