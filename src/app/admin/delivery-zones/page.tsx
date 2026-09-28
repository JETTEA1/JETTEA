"use client";

import React, { useState, useEffect } from "react";
import { Truck, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { DeliveryZone } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchZones = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("delivery_zones")
      .select("*")
      .order("fee", { ascending: true });

    if (data) {
      setZones(data as DeliveryZone[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleFeeChange = (id: string, val: string) => {
    const feeNum = parseFloat(val) || 0;
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, fee: feeNum } : z))
    );
  };

  const handleDaysChange = (id: string, val: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, estimated_days: val } : z))
    );
  };

  const handleActiveToggle = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, is_active: !z.is_active } : z))
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/delivery-zones/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zones: zones.map((z) => ({
            id: z.id,
            fee: z.fee,
            estimated_days: z.estimated_days,
            is_active: z.is_active,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({ type: "error", text: data.error || "Failed to update delivery zones." });
      } else {
        setStatusMessage({ type: "success", text: "Delivery zones and fees updated successfully!" });
        fetchZones();
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error saving delivery zones." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-gray-900">
            Delivery Zones & Pricing
          </h1>
          <p className="text-gray-500 text-sm">
            Configure regional shipping rates, courier estimates, and supported states across Nigeria.
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
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold-400" />
              <span>Save Changes</span>
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

      <div className="space-y-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-6 items-center"
          >
            <div className="sm:col-span-5 space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-forest" />
                <h3 className="font-bold text-base text-gray-900">{zone.name}</h3>
              </div>
              <p className="text-xs text-gray-500">
                <strong>Covered:</strong> {zone.states.join(", ")}
              </p>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Delivery Fee (₦) *
              </label>
              <input
                type="number"
                step="50"
                required
                value={zone.fee}
                onChange={(e) => handleFeeChange(zone.id, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm font-bold text-forest"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Estimated Delivery Days
              </label>
              <input
                type="text"
                required
                value={zone.estimated_days}
                onChange={(e) => handleDaysChange(zone.id, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div className="sm:col-span-1 flex justify-center">
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Active</span>
                <input
                  type="checkbox"
                  checked={zone.is_active}
                  onChange={() => handleActiveToggle(zone.id)}
                  className="w-4 h-4 text-forest rounded border-gray-300 focus:ring-forest"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
