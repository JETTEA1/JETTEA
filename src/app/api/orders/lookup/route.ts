import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const LookupSchema = z.object({
  orderNumber: z.string().min(3),
  phoneOrEmail: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = LookupSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Please enter a valid order number and contact information" },
        { status: 400 }
      );
    }

    const { orderNumber, phoneOrEmail } = validated.data;
    const cleanSearch = phoneOrEmail.trim().toLowerCase();
    const cleanOrderNum = orderNumber.trim().toUpperCase();

    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .ilike("order_number", cleanOrderNum)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "No order found matching the provided details." },
        { status: 404 }
      );
    }

    // Verify contact info matches either email or phone
    const emailMatch = order.customer_email?.toLowerCase() === cleanSearch;
    const phoneMatch = order.customer_phone?.replace(/\s+/g, "").includes(cleanSearch.replace(/\s+/g, "")) ||
                       cleanSearch.replace(/\s+/g, "").includes(order.customer_phone?.replace(/\s+/g, ""));

    if (!emailMatch && !phoneMatch) {
      return NextResponse.json(
        { error: "The contact information does not match the record for this order number." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Error looking up order details" },
      { status: 500 }
    );
  }
}
