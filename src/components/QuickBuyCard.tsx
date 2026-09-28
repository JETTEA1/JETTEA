"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { ProductVariant } from "@/lib/types";
import { useCart } from "./CartContext";
import { formatNaira } from "@/lib/utils";

interface QuickBuyCardProps {
  variants: ProductVariant[];
}

export default function QuickBuyCard({ variants }: QuickBuyCardProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();

  // Default to Retail Packet (24 sachets) if found, otherwise first variant
  const defaultVariant =
    variants.find((v) => v.unit_type === "packet") || variants[0] || null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!variants || variants.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-tea-border shadow-card text-center">
        <p className="text-gray-500 text-sm">Product variants loading...</p>
      </div>
    );
  }

  const currentVariant = selectedVariant || variants[0];
  const totalPrice = currentVariant ? currentVariant.price * quantity : 0;

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addItem(
      {
        variantId: currentVariant.id,
        variantName: `JETTEA® - ${currentVariant.name}`,
        unitType: currentVariant.unit_type,
        sachetEquivalent: currentVariant.sachet_equivalent,
        unitPrice: currentVariant.price,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleInstantBuy = () => {
    if (!currentVariant) return;
    addItem(
      {
        variantId: currentVariant.id,
        variantName: `JETTEA® - ${currentVariant.name}`,
        unitType: currentVariant.unit_type,
        sachetEquivalent: currentVariant.sachet_equivalent,
        unitPrice: currentVariant.price,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-forest/10 shadow-card relative overflow-hidden">
      {/* Popular Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Quick Purchase</span>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
          Official Direct Price
        </span>
      </div>

      <h3 className="font-display font-extrabold text-2xl text-forest-deep">
        JETTEA® Green Tea
      </h3>
      <p className="text-xs text-gold-600 font-bold uppercase tracking-widest mt-0.5">
        FOR HEALTHY LIVING
      </p>

      {/* Variant Selector Tabs */}
      <div className="mt-6 space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Select Packaging Format:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {variants.map((v) => {
            const isSelected = currentVariant?.id === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelectedVariant(v);
                  setQuantity(1);
                }}
                className={`p-3 rounded-xl text-center border-2 transition-all flex flex-col items-center justify-between ${
                  isSelected
                    ? "border-forest bg-brand-50/70 text-forest-deep shadow-sm"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300 text-gray-700"
                }`}
              >
                <span className="text-xs font-bold capitalize">
                  {v.unit_type}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {v.sachet_equivalent} {v.sachet_equivalent === 1 ? "sachet" : "sachets"}
                </span>
                <span className="text-xs font-extrabold text-forest mt-1">
                  {formatNaira(v.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Variant Detail Card */}
      <div className="mt-5 p-4 rounded-xl bg-tea-bg border border-tea-border space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-gray-800">{currentVariant?.name}</span>
          <span className="font-extrabold text-forest text-base">
            {formatNaira(currentVariant?.price || 0)}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          {currentVariant?.unit_type === "sachet" && "1 individual botanical freshness sachet."}
          {currentVariant?.unit_type === "packet" && "Contains 24 sealed sachets for daily wellness (₦400 per sachet)."}
          {currentVariant?.unit_type === "carton" && "12 full packets = 288 sachets total. Best value supply."}
        </p>
      </div>

      {/* Quantity Stepper & Price Calculation */}
      <div className="mt-5 flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700 uppercase">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 hover:bg-gray-100 text-gray-700 font-bold"
            >
              -
            </button>
            <span className="px-3 text-sm font-bold text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 hover:bg-gray-100 text-gray-700 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 block">Total Price</span>
          <span className="text-xl font-black text-forest">{formatNaira(totalPrice)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-md transition-all ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-gradient-brand hover:opacity-95 text-white"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5 text-gold-400" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleInstantBuy}
          className="w-full flex items-center justify-center gap-2 bg-gradient-gold hover:opacity-95 text-forest-deep py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-sm transition-all"
        >
          <span>Buy Now / Fast Checkout</span>
          <ArrowRight className="w-4 h-4 text-forest-deep" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Authentic J.C. Bonjour Concerns Limited Stock</span>
      </div>
    </div>
  );
}
