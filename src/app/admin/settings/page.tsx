"use client";

import React, { useState, useEffect } from "react";
import { Settings, Globe, Search, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    brand_name: "JETTEA®",
    brand_tagline: "FOR HEALTHY LIVING",
    company_name: "J.C. Bonjour Concerns Limited",
    company_abbreviation: "JCBC",
    support_email: "support@jettea.ng",
    contact_phone: "+2348000000000",
    whatsapp_number: "+2348000000000",
    currency_symbol: "₦",
    currency_code: "NGN",
    announcement: "Order authentic JETTEA® Green Tea directly from J.C. Bonjour Concerns Limited. Fast nationwide delivery across Nigeria.",
  });

  const [seoSettings, setSeoSettings] = useState({
    meta_title: "JETTEA® Green Tea | FOR HEALTHY LIVING | Official Store",
    meta_description: "Discover authentic JETTEA® Green Tea by J.C. Bonjour Concerns Limited (JCBC). Rich in natural antioxidants for healthy living. Order sachets, packets, or wholesale cartons with nationwide delivery.",
    google_site_verification: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const gen = data.find((d) => d.id === "general");
        const seo = data.find((d) => d.id === "seo");
        if (gen?.value) setGeneralSettings((prev) => ({ ...prev, ...gen.value }));
        if (seo?.value) setSeoSettings((prev) => ({ ...prev, ...seo.value }));
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          general: generalSettings,
          seo: seoSettings,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatusMessage({ type: "error", text: data.error || "Failed to save settings." });
      } else {
        setStatusMessage({ type: "success", text: "Site and SEO settings saved successfully!" });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error saving settings." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-black text-3xl text-gray-900">
          Website & SEO Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Configure business contact info, announcement message, and Google Search Console tags.
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Business Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-xl text-forest-deep border-b border-gray-100 pb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-forest" />
            <span>Business Information & Brand Copy</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Name</label>
              <input
                type="text"
                value={generalSettings.brand_name}
                onChange={(e) => setGeneralSettings({ ...generalSettings, brand_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Slogan</label>
              <input
                type="text"
                value={generalSettings.brand_tagline}
                onChange={(e) => setGeneralSettings({ ...generalSettings, brand_tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900 font-bold text-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Company Entity</label>
              <input
                type="text"
                value={generalSettings.company_name}
                onChange={(e) => setGeneralSettings({ ...generalSettings, company_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Support Email</label>
              <input
                type="email"
                value={generalSettings.support_email}
                onChange={(e) => setGeneralSettings({ ...generalSettings, support_email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Top Announcement Banner</label>
              <input
                type="text"
                value={generalSettings.announcement}
                onChange={(e) => setGeneralSettings({ ...generalSettings, announcement: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* SEO & Search Console */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-xl text-forest-deep border-b border-gray-100 pb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-forest" />
            <span>Search Engine Optimization & Google Search Console</span>
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default Meta Title</label>
              <input
                type="text"
                value={seoSettings.meta_title}
                onChange={(e) => setSeoSettings({ ...seoSettings, meta_title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default Meta Description</label>
              <textarea
                rows={3}
                value={seoSettings.meta_description}
                onChange={(e) => setSeoSettings({ ...seoSettings, meta_description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Google Search Console HTML Verification Code (Meta Tag / Content Value)
              </label>
              <input
                type="text"
                placeholder="e.g. google-site-verification=abc123xyz456"
                value={seoSettings.google_site_verification}
                onChange={(e) => setSeoSettings({ ...seoSettings, google_site_verification: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest text-sm font-mono text-gray-900"
              />
              <span className="text-xs text-gray-500 block mt-1">
                Paste your verification token from Google Search Console to verify ownership upon deployment.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold-400" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
