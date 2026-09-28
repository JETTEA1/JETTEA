"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";
import { formatNaira, formatNumber } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalSachets,
    subtotal,
    isCartOpen,
    closeCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-forest-deep text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">Your Shopping Cart</h2>
                <p className="text-xs text-gold-300">
                  {totalItems} item{totalItems === 1 ? "" : "s"} ({formatNumber(totalSachets)} total sachets)
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-forest-light/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-tea-muted flex items-center justify-center text-forest">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Your Cart is Empty</h3>
                  <p className="text-gray-500 text-sm max-w-xs mt-1">
                    Discover authentic JETTEA® Green Tea for daily healthy living.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-4 bg-forest hover:bg-forest-deep text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 rounded-xl bg-tea-bg border border-tea-border items-center"
                >
                  <div className="w-16 h-16 rounded-lg bg-white border border-tea-border flex items-center justify-center p-2 text-forest font-bold shrink-0">
                    <span className="text-xs text-center uppercase leading-tight font-black text-forest">
                      JETTEA<br />
                      <span className="text-[9px] text-gold-600 font-semibold">{item.unitType}</span>
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">
                      {item.variantName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {item.sachetEquivalent} sachet{item.sachetEquivalent === 1 ? "" : "s"} each
                    </p>
                    <p className="text-sm font-extrabold text-forest mt-1">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-tea-border bg-gray-50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Estimated Delivery Fee</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-extrabold text-forest-deep">
                  <span>Total Order</span>
                  <span className="text-forest font-black text-lg">{formatNaira(subtotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-xs font-medium border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Safe checkout with verified payment and genuine JCBC stock</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-gray-400 hover:text-red-500 py-1"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
