"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Minus,
  AlertTriangle,
  History,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Inventory, InventoryMovement } from "@/lib/types";
import { formatNumber, formatDate } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Adjustment form
  const [unitType, setUnitType] = useState<"carton" | "packet" | "sachet">("carton");
  const [quantity, setQuantity] = useState<number>(1);
  const [direction, setDirection] = useState<"add" | "deduct">("add");
  const [reason, setReason] = useState<"admin_restock" | "damage_adjustment" | "return_restock">("admin_restock");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchInventoryData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const [{ data: inv }, { data: mov }] = await Promise.all([
      supabase.from("inventory").select("*").single(),
      supabase
        .from("inventory_movements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (inv) setInventory(inv as Inventory);
    if (mov) setMovements(mov as InventoryMovement[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const totalSachets = inventory?.total_sachets_in_stock || 0;
  const cartons = Math.floor(totalSachets / 288);
  const packets = Math.floor(totalSachets / 24);

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!notes.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a reason / note for this adjustment." });
      return;
    }

    // Calculate sachet multiplier
    let multiplier = 1;
    if (unitType === "carton") multiplier = 288;
    if (unitType === "packet") multiplier = 24;

    const changeSachets = (direction === "add" ? 1 : -1) * (quantity * multiplier);

    if (direction === "deduct" && totalSachets + changeSachets < 0) {
      setStatusMessage({ type: "error", text: "Cannot deduct more stock than currently available." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changeSachets,
          reason,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({ type: "error", text: data.error || "Failed to adjust inventory." });
      } else {
        setStatusMessage({
          type: "success",
          text: `Successfully updated inventory. New balance: ${formatNumber(data.newBalance)} sachets.`,
        });
        setNotes("");
        setQuantity(1);
        fetchInventoryData();
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error adjusting inventory." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-3xl text-gray-900">
          Inventory Control
        </h1>
        <p className="text-gray-500 text-sm">
          Warehouse stock balances across Cartons, Packets, and Sachets with audit logging.
        </p>
      </div>

      {/* Live Inventory Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Master Cartons
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-forest">{formatNumber(cartons)}</span>
            <span className="text-xs text-gray-500 font-medium">Cartons (12 pkts / 288 sachets)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Retail Packets Equivalent
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-forest">{formatNumber(packets)}</span>
            <span className="text-xs text-gray-500 font-medium">Packets (24 sachets each)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Total Sachets In Stock
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-forest-deep">{formatNumber(totalSachets)}</span>
            <span className="text-xs text-gray-500 font-medium">Single Sachets</span>
          </div>
        </div>
      </div>

      {/* Manual Stock Adjustment Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-display font-bold text-xl text-gray-900">
            Manual Inventory Adjustment
          </h2>
          <p className="text-xs text-gray-500">
            Record batch restocks from JCBC factory, damaged items write-offs, or returned shipments.
          </p>
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

        <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Action Type
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as "add" | "deduct")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
              >
                <option value="add">+ Restock / Add Stock</option>
                <option value="deduct">- Deduct / Write-Off</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Unit Type
              </label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value as "carton" | "packet" | "sachet")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
              >
                <option value="carton">Cartons (288 sachets each)</option>
                <option value="packet">Packets (24 sachets each)</option>
                <option value="sachet">Single Sachets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Quantity Count
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Reason Category
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as "admin_restock" | "damage_adjustment" | "return_restock")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
              >
                <option value="admin_restock">Factory Production Restock</option>
                <option value="damage_adjustment">Damaged / Expired Adjustment</option>
                <option value="return_restock">Customer Return Restock</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Adjustment Explanation & Notes *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Received fresh batch from JCBC factory line #4..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-gold-400" />
                  <span>Apply Stock Adjustment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Movement History Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="font-display font-bold text-lg text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-forest" />
            <span>Inventory Movement History (Audit Trail)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Change</th>
                <th className="py-3 px-4">Balance After</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                    No movement records found.
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs text-gray-500">{formatDate(m.created_at)}</td>
                    <td className="py-3 px-4 font-black">
                      <span className={m.change_sachets > 0 ? "text-emerald-600" : "text-red-600"}>
                        {m.change_sachets > 0 ? `+${formatNumber(m.change_sachets)}` : formatNumber(m.change_sachets)} sachets
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {formatNumber(m.balance_after)} sachets
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-gray-100 text-gray-800">
                        {m.reason.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate">{m.notes || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
