import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const VariantUpdateSchema = z.object({
  id: z.string().uuid(),
  price: z.number().positive(),
  compareAtPrice: z.number().nullable().optional(),
  wholesalePrice: z.number().nullable().optional(),
  isActive: z.boolean(),
});

const ProductUpdateSchema = z.object({
  productId: z.string().uuid(),
  variants: z.array(VariantUpdateSchema),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = ProductUpdateSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid product parameters", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { variants } = validated.data;
    const supabase = createAdminClient();

    for (const v of variants) {
      await supabase
        .from("product_variants")
        .update({
          price: v.price,
          compare_at_price: v.compareAtPrice || null,
          wholesale_price: v.wholesalePrice || null,
          is_active: v.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", v.id);
    }

    return NextResponse.json({ success: true, message: "Pricing updated successfully" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Error updating pricing" },
      { status: 500 }
    );
  }
}
