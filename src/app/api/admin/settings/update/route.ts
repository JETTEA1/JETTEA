import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const SettingsSchema = z.object({
  general: z.record(z.any()),
  seo: z.record(z.any()),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = SettingsSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid settings parameters" }, { status: 400 });
    }

    const { general, seo } = validated.data;
    const supabase = createAdminClient();

    await supabase
      .from("site_settings")
      .upsert({ id: "general", value: general, updated_at: new Date().toISOString() });

    await supabase
      .from("site_settings")
      .upsert({ id: "seo", value: seo, updated_at: new Date().toISOString() });

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Error updating settings" }, { status: 500 });
  }
}
