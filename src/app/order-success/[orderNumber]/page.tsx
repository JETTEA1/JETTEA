import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Phone,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Order, OrderItem } from "@/lib/types";
import { formatNaira, formatDate, formatNumber } from "@/lib/utils";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string; simulated?: string; ref?: string }>;
}

export const revalidate = 0; // Dynamic check

export default async function OrderSuccessPage({ params, searchParams }: PageProps) {
  const { orderNumber } = await params;
  const { token, simulated, ref } = await searchParams;

  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) {
    notFound();
  }

  // If in simulated development mode and not paid, complete payment atomically for local testing
  if (simulated === "true" && order.payment_status === "pending") {
    const { data: paymentRecord } = await supabase
      .from("payments")
      .select("id")
      .eq("order_id", order.id)
      .single();

    await supabase.rpc("mark_order_paid_atomic", {
      p_order_id: order.id,
      p_payment_id: paymentRecord?.id || null,
      p_provider_ref: ref || `SIM-DEV-${Date.now()}`,
    });

    // Refresh order state
    order.payment_status = "paid";
    order.fulfillment_status = "processing";
  }

  const isPaid = order.payment_status === "paid";
  const items: OrderItem[] = order.order_items || [];

  const whatsappMessage = encodeURIComponent(
    `Hello JCBC / JETTEA Team! I have placed Order #${order.order_number} for ${formatNaira(
      order.total_amount
    )}. Please confirm fulfillment and delivery status.`
  );

  return (
    <div className="bg-tea-bg min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Confirmation Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-tea-border shadow-card text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span>Order Received Successfully</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Your order for authentic <strong>JETTEA® Green Tea</strong> has been recorded and is being prepared for dispatch.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="bg-tea-bg rounded-2xl p-6 border border-tea-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Order Number</span>
              <span className="font-mono font-black text-forest text-base">{order.order_number}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Order Date</span>
              <span className="text-xs font-bold text-gray-800 block mt-0.5">{formatDate(order.created_at)}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Payment Status</span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase mt-0.5 ${
                  isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.payment_status}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium block">Total Paid</span>
              <span className="font-extrabold text-forest text-base">{formatNaira(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Purchased Items */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tea-border shadow-soft space-y-4">
            <h3 className="font-display font-bold text-lg text-forest-deep border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <span>Purchased Items</span>
            </h3>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-gray-900">{item.variant_name}</p>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity} × {formatNaira(item.unit_price)} ({item.sachet_equivalent * item.quantity} sachets)
                    </p>
                  </div>
                  <span className="font-extrabold text-forest">{formatNaira(item.line_total)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-forest">{formatNaira(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-forest-deep pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-xl font-black text-forest">{formatNaira(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tea-border shadow-soft space-y-4">
            <h3 className="font-display font-bold text-lg text-forest-deep border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-forest" />
              <span>Delivery Details</span>
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase">Customer</span>
                <p className="font-bold text-gray-900">{order.customer_name}</p>
                <p className="text-xs text-gray-600">{order.customer_email} • {order.customer_phone}</p>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase">Delivery Address</span>
                <p className="font-medium text-gray-800">{order.delivery_address}</p>
                <p className="text-xs text-gray-600">{order.delivery_city}, {order.delivery_state} State</p>
              </div>

              {order.delivery_instructions && (
                <div>
                  <span className="text-xs text-gray-400 block font-bold uppercase">Special Instructions</span>
                  <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded">{order.delivery_instructions}</p>
                </div>
              )}

              <div className="pt-2">
                <span className="text-xs text-gray-400 block font-bold uppercase">Fulfillment Status</span>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-900 border border-brand-200 mt-1 uppercase">
                  {order.fulfillment_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <Link
            href="/order-lookup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-tea-muted text-forest-deep border border-tea-border font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
          >
            <span>Track Order Online</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
