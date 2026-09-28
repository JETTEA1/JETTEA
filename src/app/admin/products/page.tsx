"use client";

import React, { useState, useEffect } from "react";
import { Layers, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ProductVariant } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";

export default function AdminProductsPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchVariants = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("product_variants")
      .select("*")
      .order("display_order", { ascending: true });

    if (data) {
      setVariants(data as ProductVariant[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const handlePriceChange = (id: string, field: "price" | "compare_at_price" | "wholesale_price", val: string) => {
    const num = val === "" ? null : parseFloat(val);
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: num } : v))
    );
  };

  const handleActiveToggle = (id: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, is_active: !v.is_active } : v))
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: variants[0]?.product_id || "a0000000-0000-0000-0000-000000000001",
          variants: variants.map((v) => ({
            id: v.id,
            price: v.price,
            compareAtPrice: v.compare_at_price,
            wholesalePrice: v.wholesale_price,
            isActive: v.is_active,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({ type: "error", text: data.error || "Failed to update pricing." });
      } else {
        setStatusMessage({ type: "success", text: "Product pricing and variants updated successfully!" });
        fetchVariants();
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error saving pricing." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-gray-900">
            Products & Pricing
          </h1>
          <p className="text-gray-500 text-sm">
            Configure retail prices, packet discounts, and B2B wholesale rates stored in Supabase.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving || isLoading}
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold-400" />
              <span>Save All Pricing</span>
            </>
          )}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Product Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-forest uppercase">
            <Layers className="w-4 h-4" />
            <span>Primary Catalogue Item</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-gray-900 mt-1">
            JETTEA® Green Tea (FOR HEALTHY LIVING)
          </h2>
          <p className="text-xs text-gray-500">
            Manufactured by J.C. Bonjour Concerns Limited (JCBC)
          </p>
        </div>

        {/* Variants List Editor */}
        <div className="space-y-6">
          {variants.map((v) => (
            <div
              key={v.id}
              className="p-6 rounded-2xl bg-tea-bg border border-tea-border space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-forest-deep">{v.name}</h3>
                  <p className="text-xs text-gray-500">
                    SKU: <code>{v.sku}</code> • {v.sachet_equivalent} Sachet Equivalent
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">Active:</label>
                  <input
                    type="checkbox"
                    checked={v.is_active}
                    onChange={() => handleActiveToggle(v.id)}
                    className="w-4 h-4 text-forest rounded border-gray-300 focus:ring-forest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Retail Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={v.price || ""}
                    onChange={(e) => handlePriceChange(v.id, "price", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm font-extrabold text-forest bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Compare-At / Strike-Through Price (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional original price"
                    value={v.compare_at_price || ""}
                    onChange={(e) => handlePriceChange(v.id, "compare_at_price", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Wholesale B2B Rate (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Distributor rate"
                    value={v.wholesale_price || ""}
                    onChange={(e) => handlePriceChange(v.id, "wholesale_price", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {v.unit_type === "carton" ? "Special rate for registered distributors" : "Not applicable for sachet"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
