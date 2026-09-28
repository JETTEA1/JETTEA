import React from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface StockBadgeProps {
  totalSachets: number;
  lowStockThreshold?: number;
  showExact?: boolean;
}

export default function StockBadge({
  totalSachets,
  lowStockThreshold = 1000,
  showExact = true,
}: StockBadgeProps) {
  if (totalSachets <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
        <XCircle className="w-3.5 h-3.5 text-red-500" />
        <span>Out of Stock</span>
      </span>
    );
  }

  if (totalSachets < lowStockThreshold) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        <span>Low Stock: {formatNumber(totalSachets)} sachets remaining</span>
      </span>
    );
  }

  const cartons = Math.floor(totalSachets / 288);
  const packets = Math.floor(totalSachets / 24);

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>
        In Stock {showExact && `(${formatNumber(totalSachets)} sachets / ${cartons} cartons)`}
      </span>
    </span>
  );
}
