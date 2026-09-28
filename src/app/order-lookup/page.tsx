"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Order } from "@/lib/types";
import { formatNaira, formatDate } from "@/lib/utils";

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderNumber || !phoneOrEmail) {
      setError("Please fill in both your Order Number and Email or Phone Number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phoneOrEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Order not found. Please verify your details.");
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      setError("Failed to reach order lookup service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Order Self-Service</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep tracking-tight">
            Track Your JETTEA® Order
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your order reference number and associated email or phone number to view real-time payment and dispatch status.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tea-border shadow-card max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Order Reference Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., JT-2026-XXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm font-mono uppercase text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Email Address or Phone Number used at checkout *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 08012345678 or you@domain.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow transition-all text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Searching Orders...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-gold-400" />
                  <span>Look Up Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Found Order Details */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tea-border shadow-card space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-gray-500 font-medium block">Order Reference</span>
                <span className="font-mono font-black text-forest text-xl">{order.order_number}</span>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Payment Status</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase mt-0.5 ${
                      order.payment_status === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Fulfillment</span>
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase mt-0.5 bg-blue-100 text-blue-800">
                    {order.fulfillment_status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase block">Delivery To</span>
                <p className="font-bold text-gray-900">{order.customer_name}</p>
                <p className="text-gray-600">{order.delivery_address}</p>
                <p className="text-gray-600">{order.delivery_city}, {order.delivery_state} State</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase block">Timeline & Date</span>
                <p className="text-gray-700"><strong>Ordered On:</strong> {formatDate(order.created_at)}</p>
                <p className="text-gray-700"><strong>Total Paid:</strong> {formatNaira(order.total_amount)}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <span className="text-xs font-bold text-gray-500 uppercase block">Items In This Order</span>
              <div className="divide-y divide-gray-100">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-900">{item.variant_name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatNaira(item.unit_price)}</p>
                    </div>
                    <span className="font-extrabold text-forest">{formatNaira(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
