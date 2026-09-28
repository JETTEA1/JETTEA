"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { formatNaira, formatNumber } from "@/lib/utils";

const NIGERIAN_STATES = [
  "Lagos",
  "Federal Capital Territory",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalSachets, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerWhatsapp: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryState: "Lagos",
    deliveryInstructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate estimated delivery fee based on state
  const getDeliveryFee = (state: string) => {
    if (state.toLowerCase() === "lagos") return 2000;
    if (["ogun", "oyo", "osun", "ondo", "ekiti"].includes(state.toLowerCase())) return 3500;
    if (["federal capital territory", "abuja", "nasarawa", "niger", "kogi", "kwara", "plateau", "benue"].includes(state.toLowerCase())) return 4000;
    if (["rivers", "delta", "edo", "enugu", "anambra", "imo", "abia", "akwa ibom", "cross river", "bayelsa", "ebonyi"].includes(state.toLowerCase())) return 4500;
    return 5000;
  };

  const deliveryFee = getDeliveryFee(formData.deliveryState);
  const totalAmount = subtotal + deliveryFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.deliveryAddress || !formData.deliveryCity) {
      setErrorMessage("Please complete all required delivery and contact fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerWhatsapp: formData.customerWhatsapp || formData.customerPhone,
          deliveryAddress: formData.deliveryAddress,
          deliveryCity: formData.deliveryCity,
          deliveryState: formData.deliveryState,
          deliveryInstructions: formData.deliveryInstructions,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to initialize order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Clear cart on successful submission
      clearCart();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/order-success/${data.orderNumber}?token=${data.accessToken}`);
      }
    } catch (err: unknown) {
      setErrorMessage("Network error processing your checkout. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-tea-bg min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 border border-tea-border shadow-card max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-tea-muted flex items-center justify-center text-forest mx-auto">
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-forest-deep">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 text-sm">
            Add authentic JETTEA® Green Tea to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-gradient-brand text-white font-bold px-6 py-3 rounded-xl shadow transition-all text-sm uppercase tracking-wider"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tea-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-sm">
            Complete your delivery and payment details to receive your JETTEA® order.
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact & Delivery Information */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Contact Info Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tea-border shadow-soft space-y-4">
                <h2 className="font-display font-bold text-lg text-forest-deep border-b border-gray-100 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-gold-accent text-xs flex items-center justify-center font-bold">1</span>
                  <span>Customer Contact Details</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      placeholder="e.g., Emeka Johnson"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      placeholder="you@domain.com"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      placeholder="080 1234 5678"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      WhatsApp Number (Optional for order updates)
                    </label>
                    <input
                      type="tel"
                      name="customerWhatsapp"
                      placeholder="080 1234 5678"
                      value={formData.customerWhatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tea-border shadow-soft space-y-4">
                <h2 className="font-display font-bold text-lg text-forest-deep border-b border-gray-100 pb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-gold-accent text-xs flex items-center justify-center font-bold">2</span>
                  <span>Delivery Destination</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      required
                      placeholder="Plot / House number, Street name, Area"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      name="deliveryCity"
                      required
                      placeholder="e.g., Ikeja, Lekki, Wuse 2"
                      value={formData.deliveryCity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      State *
                    </label>
                    <select
                      name="deliveryState"
                      required
                      value={formData.deliveryState}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900 bg-white"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Special Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="deliveryInstructions"
                      rows={2}
                      placeholder="Landmarks, preferred delivery hours, or gate security notes..."
                      value={formData.deliveryInstructions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tea-border shadow-card space-y-6 sticky top-28">
                <h2 className="font-display font-bold text-lg text-forest-deep border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                    {formatNumber(totalSachets)} Sachets
                  </span>
                </h2>

                {/* Items List */}
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto space-y-2 pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="pt-2 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-gray-900">{item.variantName}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × {formatNaira(item.unitPrice)}
                        </p>
                      </div>
                      <span className="font-extrabold text-forest">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-gray-200 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Products Subtotal</span>
                    <span className="font-bold text-gray-900">{formatNaira(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-forest" />
                      <span>Delivery Fee ({formData.deliveryState})</span>
                    </span>
                    <span className="font-bold text-forest">{formatNaira(deliveryFee)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-forest-deep pt-3 border-t border-gray-200">
                    <span>Total Due</span>
                    <span className="text-2xl font-black text-forest">{formatNaira(totalAmount)}</span>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2.5 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Your order is protected with secure server verification and official JCBC fulfillment.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-black py-4 px-6 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gold-400" />
                      <span>Complete Order ({formatNaira(totalAmount)})</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-gray-400">
                  By completing this purchase, you agree to our Terms of Service and Delivery Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
