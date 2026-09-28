import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const StatusUpdateSchema = z.object({
  fulfillmentStatus: z.enum(["unfulfilled", "processing", "shipped", "delivered", "cancelled"]).optional(),
  adminNotes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await req.json();
    const validated = StatusUpdateSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid status parameters" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (validated.data.fulfillmentStatus) {
      updatePayload.fulfillment_status = validated.data.fulfillmentStatus;
    }

    if (validated.data.adminNotes !== undefined) {
      updatePayload.admin_notes = validated.data.adminNotes;
    }

    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedOrder) {
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}
