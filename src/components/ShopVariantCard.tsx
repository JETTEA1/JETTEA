"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Check, Sparkles, ShieldCheck } from "lucide-react";
import { ProductVariant } from "@/lib/types";
import { useCart } from "./CartContext";
import { formatNaira, formatNumber } from "@/lib/utils";

interface ShopVariantCardProps {
  variant: ProductVariant;
}

export default function ShopVariantCard({ variant }: ShopVariantCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isPacket = variant.unit_type === "packet";
  const isCarton = variant.unit_type === "carton";

  const handleAddToCart = () => {
    addItem(
      {
        variantId: variant.id,
        variantName: `JETTEA® - ${variant.name}`,
        unitType: variant.unit_type,
        sachetEquivalent: variant.sachet_equivalent,
        unitPrice: variant.price,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleInstantBuy = () => {
    addItem(
      {
        variantId: variant.id,
        variantName: `JETTEA® - ${variant.name}`,
        unitType: variant.unit_type,
        sachetEquivalent: variant.sachet_equivalent,
        unitPrice: variant.price,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <div
      className={`bg-white rounded-3xl p-8 border shadow-soft flex flex-col justify-between space-y-6 relative transition-all ${
        isPacket
          ? "border-2 border-gold-500 shadow-card md:-translate-y-2"
          : "border-tea-border hover:border-gray-300"
      }`}
    >
      {isPacket && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-gold text-forest-deep font-black text-xs uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
          Most Popular Choice
        </div>
      )}

      {isCarton && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-forest text-gold-400 font-black text-xs uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
          Best Value Supply
        </div>
      )}

      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-start">
          <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase">
            {variant.unit_type}
          </div>
          <span className="text-xs font-bold text-gray-500">
            {variant.sachet_equivalent} {variant.sachet_equivalent === 1 ? "Sachet" : "Sachets"}
          </span>
        </div>

        <h3 className="font-display font-extrabold text-2xl text-forest-deep">
          {variant.name}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {variant.unit_type === "sachet" &&
            "1 individually sealed sachet for single-cup brewing, on-the-go wellness, or trial."}
          {variant.unit_type === "packet" &&
            "24 individually sealed sachets. Perfect for a full month of daily healthy morning rituals."}
          {variant.unit_type === "carton" &&
            "Master carton containing 12 packets (288 sachets total). Maximum value for families and bulk buyers."}
        </p>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-forest">
              {formatNaira(variant.price)}
            </span>
            {variant.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatNaira(variant.compare_at_price)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium block mt-0.5">
            {variant.unit_type === "packet" && "₦400 per sachet equivalent"}
            {variant.unit_type === "carton" && "₦400 per sachet equivalent (12 full packets)"}
            {variant.unit_type === "sachet" && "Direct retail rate"}
          </span>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
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

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-forest hover:bg-forest-deep text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-gold-400" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-gold-400" />
                <span>Add to Cart ({formatNaira(variant.price * quantity)})</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleInstantBuy}
            className="w-full flex items-center justify-center gap-2 bg-gradient-gold hover:opacity-95 text-forest-deep py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
