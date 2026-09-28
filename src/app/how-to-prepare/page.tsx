import React from "react";
import Link from "next/link";
import { Clock, Thermometer, CupSoda, Leaf, Sparkles, ArrowRight, Sun, Moon } from "lucide-react";

export const metadata = {
  title: "How to Prepare JETTEA® Green Tea | Brewing Instructions",
  description:
    "Discover the best way to brew JETTEA® Green Tea for maximum antioxidant release, golden color, and smooth refreshing taste.",
};

export default function HowToPreparePage() {
  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-gold-600" />
            <span>The Brewing Ritual</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-forest-deep tracking-tight">
            How to Prepare JETTEA® Green Tea
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Follow our brew master guide to extract the delicate botanical polyphenols and vibrant taste in every single sachet.
          </p>
        </div>

        {/* 3 Step Visual Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-tea-border shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold-accent flex items-center justify-center font-black text-xl">
              1
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gold-600 uppercase">
              <Thermometer className="w-4 h-4" />
              <span>Water Temperature</span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-forest-deep">
              Heat Water to 80°C–90°C
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Boil fresh, filtered drinking water. Once boiled, allow the kettle to rest for about 60 seconds before pouring. Water that is too boiling hot can scorch delicate green tea leaves.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-tea-border shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold-accent flex items-center justify-center font-black text-xl">
              2
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gold-600 uppercase">
              <CupSoda className="w-4 h-4" />
              <span>Pour & Infuse</span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-forest-deep">
              Add 1 Sachet per 250ml
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Place one JETTEA® sachet into your favourite ceramic or glass cup. Pour 200ml–250ml of hot water gently over the sachet.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-tea-border shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold-accent flex items-center justify-center font-black text-xl">
              3
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gold-600 uppercase">
              <Clock className="w-4 h-4" />
              <span>Steeping Time</span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-forest-deep">
              Steep for 3 to 5 Minutes
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Let the infusion steep quietly for 3 to 5 minutes until a clear, golden-green hue develops. Gently swirl the sachet and remove. Sip warm and embrace healthy living.
            </p>
          </div>
        </div>

        {/* Daily Regimen Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-amber-50/60 border border-amber-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-forest-deep">Morning Revitalization</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Enjoy a cup of warm JETTEA® first thing in the morning alongside breakfast or your morning stretch to awaken your digestive system and kickstart your day with pure antioxidants.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-forest-deep">Evening Mindful Sip</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Unwind after a busy day with a soothing cup after dinner. Take time to breathe in the soothing aroma and support evening relaxation.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-brand hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-xl shadow text-sm uppercase tracking-wider transition-all"
          >
            <span>Order Fresh JETTEA® Sachets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
