import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const AdjustSchema = z.object({
  changeSachets: z.number().int(),
  reason: z.enum(["admin_restock", "damage_adjustment", "return_restock"]),
  notes: z.string().min(3, "Notes explaining the reason are required"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = AdjustSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid adjustment parameters", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { changeSachets, reason, notes } = validated.data;
    const supabase = createAdminClient();

    // Fetch primary product ID
    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", "jettea-green-tea")
      .single();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Call atomic stored procedure
    const { data: result, error } = await supabase.rpc("adjust_inventory_atomic", {
      p_product_id: product.id,
      p_change_sachets: changeSachets,
      p_reason: reason,
      p_notes: notes,
      p_admin_id: null,
    });

    if (error || !result?.success) {
      console.error("RPC adjust_inventory_atomic error:", error || result);
      return NextResponse.json(
        { error: result?.error || "Failed to adjust inventory" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, newBalance: result.new_balance });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Error adjusting inventory" },
      { status: 500 }
    );
  }
}
