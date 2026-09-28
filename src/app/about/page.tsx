import React from "react";
import Link from "next/link";
import { ShieldCheck, Leaf, Building2, Heart, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About JETTEA® & J.C. Bonjour Concerns Limited",
  description:
    "Learn about JETTEA® Green Tea, crafted for healthy living by J.C. Bonjour Concerns Limited (JCBC) in Nigeria.",
};

export default function AboutPage() {
  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Our Heritage & Vision</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-forest-deep tracking-tight">
            About JETTEA® & JCBC
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Committed to providing authentic, botanical green tea for daily wellness, vitality, and wholesome living across Nigeria.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-tea-border shadow-soft space-y-6 text-gray-700 leading-relaxed">
          <h2 className="font-display font-extrabold text-2xl text-forest-deep">
            The Brand: JETTEA® - FOR HEALTHY LIVING
          </h2>
          <p>
            JETTEA® was born out of a passion for natural wellness and wholesome daily revitalization. Recognizing the essential role that natural antioxidants play in sustaining cellular vitality and metabolic harmony, J.C. Bonjour Concerns Limited created a premium green tea formulation that combines supreme botanical purity with an impeccably smooth, refreshing taste.
          </p>
          <p>
            Unlike conventional teas that lose their aromatic strength and volatile active compounds during bulk storage, each JETTEA® sachet is individually sealed to preserve its botanical potency until the moment it meets hot water.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-forest-deep text-white rounded-3xl p-8 sm:p-12 border border-forest-light/40 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-500 text-forest-deep flex items-center justify-center font-black text-xl">
              JC
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white">J.C. Bonjour Concerns Limited</h2>
              <p className="text-xs text-gold-400 font-bold uppercase tracking-wider">Manufacturer & Brand Owner</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            J.C. Bonjour Concerns Limited (JCBC) is an indigenous Nigerian enterprise driven by uncompromising quality, ethical enterprise, and dedicated consumer care. All JETTEA® batches are produced and packaged under stringent quality assurance guidelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-forest-light/40">
            <div className="space-y-1">
              <span className="text-gold-400 text-xs uppercase font-bold">Standard</span>
              <p className="font-bold text-white text-sm">Hygiene & Quality Assured</p>
            </div>
            <div className="space-y-1">
              <span className="text-gold-400 text-xs uppercase font-bold">Origin</span>
              <p className="font-bold text-white text-sm">Proudly Nigerian</p>
            </div>
            <div className="space-y-1">
              <span className="text-gold-400 text-xs uppercase font-bold">Philosophy</span>
              <p className="font-bold text-white text-sm">FOR HEALTHY LIVING</p>
            </div>
          </div>
        </div>

        {/* Compliance Notice Box */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
          <p className="font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Compliance & Responsible Health Communication</span>
          </p>
          <p>
            At JCBC, we strictly adhere to truthful and compliant communication. JETTEA® Green Tea is marketed strictly as a wholesome nutritional beverage for daily healthy living. We make no medical claims that this product treats, cures, or prevents any disease or illness.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-xl shadow text-sm uppercase tracking-wider transition-all"
          >
            <span>Explore JETTEA® Formats</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
