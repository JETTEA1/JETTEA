import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const WholesaleUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "approved", "declined"]).optional(),
  adminNotes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await req.json();
    const validated = WholesaleUpdateSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (validated.data.status) {
      updatePayload.status = validated.data.status;
    }

    if (validated.data.adminNotes !== undefined) {
      updatePayload.admin_notes = validated.data.adminNotes;
    }

    const { data, error } = await supabase
      .from("wholesale_enquiries")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update wholesale inquiry" }, { status: 500 });
    }

    return NextResponse.json({ success: true, enquiry: data });
  } catch (err) {
    return NextResponse.json({ error: "Error updating wholesale record" }, { status: 500 });
  }
}
