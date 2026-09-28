import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/utils";
import { nowPaymentsGateway } from "@/lib/payments/nowpayments";

const CheckoutItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const CheckoutPayloadSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please provide a valid email"),
  customerPhone: z.string().min(10, "Please provide a valid phone number"),
  customerWhatsapp: z.string().optional().nullable(),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  deliveryCity: z.string().min(2, "City is required"),
  deliveryState: z.string().min(2, "State is required"),
  deliveryInstructions: z.string().optional().nullable(),
  items: z.array(CheckoutItemSchema).min(1, "Cart cannot be empty"),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = CheckoutPayloadSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid checkout submission",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerWhatsapp,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryInstructions,
      items,
    } = validated.data;

    const supabase = createAdminClient();

    // 1. Authoritative price & stock lookup for variants
    const variantIds = items.map((i) => i.variantId);
    const { data: dbVariants, error: varError } = await supabase
      .from("product_variants")
      .select("*")
      .in("id", variantIds)
      .eq("is_active", true);

    if (varError || !dbVariants || dbVariants.length === 0) {
      return NextResponse.json(
        { success: false, error: "Unable to verify product items" },
        { status: 400 }
      );
    }

    // 2. Fetch active inventory
    const { data: dbInventory } = await supabase
      .from("inventory")
      .select("*")
      .single();

    const currentStock = dbInventory?.total_sachets_in_stock || 0;

    let subtotal = 0;
    let totalSachetsNeeded = 0;
    const orderItemsToInsert: Array<{
      variant_id: string;
      variant_name: string;
      unit_price: number;
      quantity: number;
      sachet_equivalent: number;
      line_total: number;
    }> = [];

    for (const item of items) {
      const variant = dbVariants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, error: `Invalid product variant ID: ${item.variantId}` },
          { status: 400 }
        );
      }

      const unitPrice = parseFloat(variant.price);
      const lineTotal = unitPrice * item.quantity;
      const sachetEq = variant.sachet_equivalent;

      subtotal += lineTotal;
      totalSachetsNeeded += item.quantity * sachetEq;

      orderItemsToInsert.push({
        variant_id: variant.id,
        variant_name: `JETTEA® - ${variant.name}`,
        unit_price: unitPrice,
        quantity: item.quantity,
        sachet_equivalent: sachetEq,
        line_total: lineTotal,
      });
    }

    // Verify stock
    if (currentStock < totalSachetsNeeded) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected quantity exceeds current stock availability.",
        },
        { status: 400 }
      );
    }

    // 3. Determine authoritative Delivery Zone & Fee
    const { data: zones } = await supabase
      .from("delivery_zones")
      .select("*")
      .eq("is_active", true);

    let matchedZone = null;
    let deliveryFee = 3500; // Default nationwide standard

    if (zones && zones.length > 0) {
      matchedZone = zones.find((z) =>
        z.states.some(
          (s: string) => s.toLowerCase() === deliveryState.toLowerCase()
        )
      );

      if (!matchedZone) {
        // Default to nationwide or pickup
        matchedZone = zones.find((z) => !z.states.includes("Pickup")) || zones[0];
      }

      if (matchedZone) {
        deliveryFee = parseFloat(matchedZone.fee);
      }
    }

    const discountAmount = 0;
    const totalAmount = subtotal + deliveryFee - discountAmount;
    const orderNumber = generateOrderNumber();

    // 4. Insert Order into Supabase
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_whatsapp: customerWhatsapp || null,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_state: deliveryState,
        delivery_instructions: deliveryInstructions || null,
        delivery_zone_id: matchedZone?.id || null,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        currency: "NGN",
        payment_status: "pending",
        fulfillment_status: "unfulfilled",
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error("Order creation database error:", orderError);
      return NextResponse.json(
        { success: false, error: "Failed to initialize order record" },
        { status: 500 }
      );
    }

    // 5. Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
    }

    // 6. Initiate Payment Gateway (NOWPayments)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jettea.ng";
    const paymentResult = await nowPaymentsGateway.createInvoice({
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      amount: totalAmount,
      currency: "NGN",
      customerEmail: customerEmail,
      customerName: customerName,
      successUrl: `${siteUrl}/order-success/${newOrder.order_number}?token=${newOrder.access_token}`,
      cancelUrl: `${siteUrl}/checkout?order=${newOrder.order_number}`,
    });

    // Record Payment Entry in DB
    await supabase.from("payments").insert({
      order_id: newOrder.id,
      provider: "nowpayments",
      provider_payment_id: paymentResult.providerPaymentId || null,
      payment_reference: paymentResult.paymentReference,
      pay_amount: totalAmount,
      pay_currency: "NGN",
      status: "created",
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.order_number,
      orderId: newOrder.id,
      accessToken: newOrder.access_token,
      checkoutUrl: paymentResult.checkoutUrl,
      paymentReference: paymentResult.paymentReference,
    });
  } catch (err: unknown) {
    console.error("Unexpected checkout error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during checkout" },
      { status: 500 }
    );
  }
}
