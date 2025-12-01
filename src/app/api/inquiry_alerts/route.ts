import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, vehicle, message } = body;

  const { data, error } = await supabaseServer
    .from("customer_inquiries")
    .insert({
      name,
      email,
      phone,
      vehicle,
      message,
    });

  return Response.json({ data, error });
}
