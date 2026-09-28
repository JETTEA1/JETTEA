"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  Save,
  Loader2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { WholesaleEnquiry } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

export default function AdminWholesalePage() {
  const [enquiries, setEnquiries] = useState<WholesaleEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<WholesaleEnquiry | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("wholesale_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setEnquiries(data as WholesaleEnquiry[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter(
    (e) =>
      e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: WholesaleEnquiry) => {
    setSelectedEnquiry(item);
    setEditStatus(item.status);
    setEditNotes(item.admin_notes || "");
  };

  const handleSave = async () => {
    if (!selectedEnquiry) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/wholesale/${selectedEnquiry.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editNotes,
        }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === selectedEnquiry.id
              ? { ...item, status: editStatus as WholesaleEnquiry["status"], admin_notes: editNotes }
              : item
          )
        );
        setSelectedEnquiry((prev) =>
          prev ? { ...prev, status: editStatus as WholesaleEnquiry["status"], admin_notes: editNotes } : null
        );
      }
    } catch (e) {
      console.error("Error saving wholesale lead:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display font-black text-3xl text-gray-900">
          Wholesale & Distributor CRM
        </h1>
        <p className="text-gray-500 text-sm">
          Review commercial applications from supermarkets, pharmacies, and regional distributors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by business name, applicant, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
            />
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest mb-2" />
                <span>Loading applications...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No distributor inquiries found.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedEnquiry?.id === item.id
                      ? "border-forest bg-brand-50/50 shadow-sm"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.business_name}</h3>
                      <p className="text-xs text-gray-600 font-medium">{item.full_name} • {item.location}</p>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                        item.status === "new"
                          ? "bg-purple-100 text-purple-800"
                          : item.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                    <span><strong>Volume:</strong> {item.quantity_interested}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Selected Lead Details */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6 sticky top-28">
          {selectedEnquiry ? (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-gold-600 uppercase">Distributor Profile</span>
                <h2 className="font-display font-bold text-2xl text-forest-deep">
                  {selectedEnquiry.business_name}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Applied: {formatDate(selectedEnquiry.created_at)}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block">Contact Person</span>
                  <p className="font-bold text-gray-900">{selectedEnquiry.full_name}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-forest" /> {selectedEnquiry.email}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-forest" /> {selectedEnquiry.phone}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block">Operating Territory</span>
                  <p className="text-sm font-medium text-gray-800">{selectedEnquiry.location}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block">Requested Volume</span>
                  <p className="text-sm font-bold text-forest">{selectedEnquiry.quantity_interested}</p>
                </div>

                {selectedEnquiry.message && (
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block">Message / Channels</span>
                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                      "{selectedEnquiry.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status updater */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Pipeline Status:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 bg-white"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted / Call Placed</option>
                    <option value="qualified">Qualified Distributor</option>
                    <option value="approved">Approved & Account Created</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Internal Sales Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Discussion notes, pricing tier offered, or account code..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-forest-deep text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                    ) : (
                      <Save className="w-4 h-4 text-gold-400" />
                    )}
                    <span>Save Lead Progress</span>
                  </button>

                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl flex items-center justify-center shadow"
                    title="Chat on WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-2 opacity-50" />
              <span>Select an application from the list to view distributor details and update pipeline status.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
