import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, message } = body;

  const { data, error } = await supabaseServer
    .from("inquiry_alerts")
    .insert({
      name,
      email,
      phone,
      message,
    });

  return Response.json({ data, error });
}
