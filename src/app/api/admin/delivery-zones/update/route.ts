import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const ZoneSchema = z.object({
  id: z.string().uuid(),
  fee: z.number().nonnegative(),
  estimated_days: z.string(),
  is_active: z.boolean(),
});

const ZonesUpdateSchema = z.object({
  zones: z.array(ZoneSchema),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = ZonesUpdateSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid delivery zone parameters" }, { status: 400 });
    }

    const { zones } = validated.data;
    const supabase = createAdminClient();

    for (const z of zones) {
      await supabase
        .from("delivery_zones")
        .update({
          fee: z.fee,
          estimated_days: z.estimated_days,
          is_active: z.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", z.id);
    }

    return NextResponse.json({ success: true, message: "Delivery zones updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Error updating delivery zones" }, { status: 500 });
  }
}
