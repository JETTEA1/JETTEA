import React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  ShieldAlert,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira, formatNumber, formatDate } from "@/lib/utils";

export const revalidate = 0; // Always fresh for admin

async function getDashboardMetrics() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: inventory }, { data: wholesale }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("inventory").select("*").single(),
    supabase.from("wholesale_enquiries").select("*"),
  ]);

  const allOrders = orders || [];
  const paidOrders = allOrders.filter((o) => o.payment_status === "paid");
  const pendingOrders = allOrders.filter((o) => o.payment_status === "pending");

  const totalRevenue = paidOrders.reduce(
    (sum, o) => sum + parseFloat(o.total_amount || "0"),
    0
  );

  const totalSachetsInStock = inventory?.total_sachets_in_stock || 0;
  const lowStockThreshold = inventory?.low_stock_threshold || 1000;
  const isLowStock = totalSachetsInStock < lowStockThreshold;

  const cartonsInStock = Math.floor(totalSachetsInStock / 288);
  const packetsInStock = Math.floor(totalSachetsInStock / 24);

  const newWholesaleCount = (wholesale || []).filter((w) => w.status === "new").length;

  return {
    allOrders,
    paidOrdersCount: paidOrders.length,
    pendingOrdersCount: pendingOrders.length,
    totalRevenue,
    totalSachetsInStock,
    cartonsInStock,
    packetsInStock,
    isLowStock,
    newWholesaleCount,
    recentOrders: allOrders.slice(0, 6),
  };
}

export default async function AdminDashboardPage() {
  const {
    paidOrdersCount,
    pendingOrdersCount,
    totalRevenue,
    totalSachetsInStock,
    cartonsInStock,
    packetsInStock,
    isLowStock,
    newWholesaleCount,
    recentOrders,
  } = await getDashboardMetrics();

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-gray-900">
            Executive Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Live business performance, inventory reserves, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Package className="w-4 h-4 text-forest" />
            <span>Adjust Stock</span>
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-gold-400" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {isLowStock && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Low Inventory Alert</h4>
              <p className="text-xs text-amber-800">
                Current warehouse inventory is at {formatNumber(totalSachetsInStock)} sachets ({cartonsInStock} cartons), which is below your safety threshold.
              </p>
            </div>
          </div>
          <Link
            href="/admin/inventory"
            className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg shrink-0"
          >
            Restock Now
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Paid Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₦
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
              {formatNaira(totalRevenue)}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              From {paidOrdersCount} verified transactions
            </p>
          </div>
        </div>

        {/* Current Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Warehouse Stock
            </span>
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
              {formatNumber(totalSachetsInStock)}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {cartonsInStock} Cartons • {packetsInStock} Packets
            </p>
          </div>
        </div>

        {/* Paid & Pending Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Paid Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
              {paidOrdersCount}
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-1">
              {pendingOrdersCount} pending payment verification
            </p>
          </div>
        </div>

        {/* Wholesale Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Wholesale Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-gray-900">
              {newWholesaleCount}
            </h3>
            <p className="text-xs text-purple-600 font-medium mt-1">
              New distributor applications
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500">Real-time transactions submitted through the platform.</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-xs">
                    No orders submitted yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-forest">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{order.delivery_state}</td>
                    <td className="py-3 px-4 font-extrabold text-gray-900">
                      {formatNaira(order.total_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                          order.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
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
