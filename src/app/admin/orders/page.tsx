"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  Clock,
  Save,
  Loader2,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Order, OrderItem } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatDate, formatNumber } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const fetchOrders = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;
    const matchesFulfillment =
      fulfillmentFilter === "all" || order.fulfillment_status === fulfillmentFilter;

    return matchesSearch && matchesPayment && matchesFulfillment;
  });

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.fulfillment_status);
    setEditNotes(order.admin_notes || "");
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentStatus: editStatus,
          adminNotes: editNotes,
        }),
      });

      if (res.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? { ...o, fulfillment_status: editStatus as Order["fulfillment_status"], admin_notes: editNotes }
              : o
          )
        );
        setSelectedOrder((prev) =>
          prev ? { ...prev, fulfillment_status: editStatus as Order["fulfillment_status"], admin_notes: editNotes } : null
        );
      }
    } catch (e) {
      console.error("Error updating order status:", e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-500 text-sm">
            Track customer orders, verify payments, and update dispatch/fulfillment stages.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by order #, name, phone, email, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid Only</option>
              <option value="pending">Pending Payment</option>
              <option value="failed">Failed / Cancelled</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Items / Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 text-sm">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest mb-2" />
                    <span>Loading orders...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 text-sm">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-700">
                      {order.delivery_city}, {order.delivery_state}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-forest block">
                        {formatNaira(order.total_amount)}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {order.order_items?.length || 0} item format(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="inline-flex items-center gap-1 bg-forest/10 hover:bg-forest hover:text-white text-forest text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-forest-deep text-white flex justify-between items-center">
              <div>
                <span className="text-xs text-gold-400 font-bold uppercase">Order Inspection</span>
                <h3 className="font-display font-black text-2xl text-white">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-forest-light/40 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-gray-700">
              {/* Customer and Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-tea-bg p-5 rounded-2xl border border-tea-border">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase block">Customer Details</span>
                  <p className="font-bold text-gray-900 text-base">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-forest" /> {selectedOrder.customer_email}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-forest" /> {selectedOrder.customer_phone}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase block">Delivery Destination</span>
                  <p className="font-medium text-gray-900">{selectedOrder.delivery_address}</p>
                  <p className="text-xs text-gray-600">
                    {selectedOrder.delivery_city}, {selectedOrder.delivery_state} State
                  </p>
                  {selectedOrder.delivery_instructions && (
                    <p className="text-xs text-amber-900 bg-amber-50 p-1.5 rounded mt-1">
                      <strong>Note:</strong> {selectedOrder.delivery_instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Purchased */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase block">Purchased Items</span>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl p-4 bg-white">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-gray-900">{item.variant_name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {formatNaira(item.unit_price)} ({item.sachet_equivalent * item.quantity} sachets)
                        </p>
                      </div>
                      <span className="font-extrabold text-forest">{formatNaira(item.line_total)}</span>
                    </div>
                  ))}

                  <div className="pt-3 flex justify-between text-xs text-gray-600">
                    <span>Subtotal: {formatNaira(selectedOrder.subtotal)}</span>
                    <span>Delivery Fee: {formatNaira(selectedOrder.delivery_fee)}</span>
                  </div>
                  <div className="pt-2 flex justify-between font-extrabold text-forest-deep text-base">
                    <span>Total Amount:</span>
                    <span className="text-forest text-lg">{formatNaira(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Fulfillment & Notes updater */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Update Fulfillment Status:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
                  >
                    <option value="unfulfilled">Unfulfilled</option>
                    <option value="processing">Processing (Preparing for Dispatch)</option>
                    <option value="shipped">Shipped (In Transit with Courier)</option>
                    <option value="delivered">Delivered to Customer</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Internal Dispatch / Admin Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Waybill reference, courier tracking code, or dispatch remarks..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 text-xs font-bold uppercase transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-colors disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
