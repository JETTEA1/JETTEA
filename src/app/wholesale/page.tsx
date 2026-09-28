"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Send,
  Loader2,
  AlertCircle,
  Phone,
  Sparkles,
} from "lucide-react";

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    quantityInterested: "10-25 Cartons (Small Distributor)",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit distributor form. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMessage("Network error submitting distributor form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Commercial Partnership</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-forest-deep tracking-tight">
            Become a JETTEA® Retailer / Distributor
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Partner directly with <strong>J.C. Bonjour Concerns Limited (JCBC)</strong> to distribute authentic JETTEA® Green Tea across pharmacies, retail chains, supermarkets, and regional channels in Nigeria.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-tea-border shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-forest-deep">Tiered Wholesale Margins</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Attractive commercial margins and volume pricing on carton and pallet orders designed to maximize retailer profitability.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-tea-border shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-forest-deep">Guaranteed Fresh Factory Stock</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Direct factory supply from JCBC ensures sealed freshness sachets, long shelf life, and strict brand authenticity.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-tea-border shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-forest-deep">Priority Regional Logistics</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Expedited bulk freight dispatch to key state capitals, distribution depots, and commercial logistics hubs across Nigeria.
            </p>
          </div>
        </div>

        {/* Form and Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-forest-deep text-white rounded-3xl p-8 border border-forest-light/40 space-y-6 shadow-card">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Sales Desk</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                How Distributor Onboarding Works
              </h3>
              <ol className="space-y-4 text-sm text-gray-300 list-decimal list-inside leading-relaxed">
                <li><strong className="text-gold-300">Submit Application:</strong> Fill out the distributor profile form with your business location and volume.</li>
                <li><strong className="text-gold-300">Verification & Quote:</strong> Our sales manager reviews your territory and issues official wholesale price sheets.</li>
                <li><strong className="text-gold-300">Invoice & Dispatch:</strong> Upon order confirmation, your master cartons are dispatched directly from JCBC.</li>
              </ol>

              <div className="pt-4 border-t border-forest-light/40 space-y-2 text-xs text-gray-400">
                <p><strong>Company:</strong> J.C. Bonjour Concerns Limited (JCBC)</p>
                <p><strong>Sales Email:</strong> wholesale@jettea.ng</p>
                <p><strong>Hotline:</strong> +234 800 JETTEA HQ</p>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-tea-border shadow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-forest-deep">
                  Application Submitted Successfully!
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in distributing JETTEA®. Our commercial sales desk will contact you via email and phone within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        businessName: "",
                        email: "",
                        phone: "",
                        whatsapp: "",
                        location: "",
                        quantityInterested: "10-25 Cartons (Small Distributor)",
                        message: "",
                      });
                    }}
                    className="text-forest font-bold text-sm hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display font-bold text-xl text-forest-deep border-b border-gray-100 pb-3">
                  Distributor & Retailer Application Form
                </h2>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Chief Adebayo"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Business / Store Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      placeholder="e.g. HealthCare Pharmacy Ltd"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="info@business.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="080 1234 5678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      placeholder="080 1234 5678"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Location / State of Operation *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="e.g., Ikeja, Lagos State"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Estimated Initial Order Volume *
                    </label>
                    <select
                      name="quantityInterested"
                      required
                      value={formData.quantityInterested}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900 bg-white"
                    >
                      <option value="5-10 Cartons (Store Starter)">5 - 10 Cartons (Store Starter)</option>
                      <option value="10-25 Cartons (Small Distributor)">10 - 25 Cartons (Small Distributor)</option>
                      <option value="25-50 Cartons (Regional Retailer)">25 - 50 Cartons (Regional Retailer)</option>
                      <option value="50-100+ Cartons (Major Wholesale Distributor)">50 - 100+ Cartons (Major Wholesale Distributor)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Additional Message / Distribution Territory Details
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Tell us about your distribution channels, outlets, or retail presence..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                        <span>Sending Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-gold-400" />
                        <span>Submit Wholesale Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
