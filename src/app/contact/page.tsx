"use client";

import React, { useState } from "react";
import { Mail, Phone, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/2348000000000?text=${encodeURIComponent(
    "Hello JETTEA / JCBC Customer Support, I would like to make an inquiry about JETTEA® Green Tea."
  )}`;

  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Care</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-forest-deep tracking-tight">
            Get in Touch With Us
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Have questions about an order, wholesale partnership, or brewing instructions? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-forest-deep text-white rounded-3xl p-8 border border-forest-light/40 shadow-card space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold-500 text-forest-deep flex items-center justify-center font-black text-xl">
                  JT
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">JETTEA® Support Desk</h3>
                  <p className="text-xs text-gold-400 font-bold uppercase">J.C. Bonjour Concerns Limited</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-white text-xs uppercase">Email Address</span>
                    <span>support@jettea.ng</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-white text-xs uppercase">Telephone & WhatsApp</span>
                    <span>+234 800 JETTEA HQ</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-bold text-white text-xs uppercase">Operating Hours</span>
                    <span>Monday – Friday: 8:00 AM – 5:00 PM (WAT)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-forest-light/40">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow transition-colors text-xs uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat Live on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-tea-border shadow-card">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-forest-deep">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Thank you for reaching out to the JETTEA® team. We will review your message and reply promptly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-forest font-bold text-sm hover:underline"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display font-bold text-xl text-forest-deep border-b border-gray-100 pb-3">
                  Send Customer Care a Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Okafor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="080 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900 bg-white"
                    >
                      <option value="Order Inquiry">Order Inquiry / Tracking</option>
                      <option value="Product Information">Product Information</option>
                      <option value="Wholesale Inquiry">Wholesale / Distribution</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we assist you today?..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:border-forest text-sm text-gray-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow transition-all text-sm uppercase tracking-wider"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
