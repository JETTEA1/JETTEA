import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nowPaymentsGateway } from "@/lib/payments/nowpayments";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers = req.headers;

    const verification = await nowPaymentsGateway.verifyWebhook(headers, rawBody);

    const supabase = createAdminClient();

    // Log the incoming webhook event
    await supabase.from("payment_events").insert({
      provider: "nowpayments",
      event_type: verification.status,
      payload: verification.rawPayload,
      signature_valid: verification.isValid,
    });

    if (!verification.isValid) {
      console.warn("Invalid NOWPayments webhook signature received");
      return NextResponse.json(
        { error: "Invalid signature", message: verification.errorMessage },
        { status: 401 }
      );
    }

    const { orderId, paymentReference, status } = verification;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id in payload" }, { status: 400 });
    }

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update payment record
    const { data: paymentRecord } = await supabase
      .from("payments")
      .select("id")
      .eq("order_id", orderId)
      .single();

    if (status === "paid") {
      // Execute atomic transition: marks order paid, decrements inventory safely, logs movement
      const { data: result, error: rpcError } = await supabase.rpc(
        "mark_order_paid_atomic",
        {
          p_order_id: order.id,
          p_payment_id: paymentRecord?.id || null,
          p_provider_ref: paymentReference || "NOWPAYMENTS-WEBHOOK",
        }
      );

      if (rpcError) {
        console.error("RPC mark_order_paid_atomic error:", rpcError);
        return NextResponse.json(
          { error: "Failed to mark order as paid atomically" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, result });
    } else if (status === "failed" || status === "expired") {
      await supabase
        .from("orders")
        .update({ payment_status: "failed", updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (paymentRecord?.id) {
        await supabase
          .from("payments")
          .update({ status: status, updated_at: new Date().toISOString() })
          .eq("id", paymentRecord.id);
      }

      return NextResponse.json({ success: true, message: `Order status updated to ${status}` });
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal server error processing webhook" },
      { status: 500 }
    );
  }
}
