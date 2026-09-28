import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Thermometer,
  CupSoda,
  Truck,
  Building2,
  Award,
  ChevronDown,
  Star,
  Users,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Product, ProductVariant, Inventory } from "@/lib/types";
import QuickBuyCard from "@/components/QuickBuyCard";
import JsonLd from "@/components/JsonLd";
import StockBadge from "@/components/StockBadge";

// Revalidate every 60 seconds
export const revalidate = 60;

async function getHomeData() {
  try {
    const supabase = createAdminClient();

    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("slug", "jettea-green-tea")
      .single();

    const { data: variants } = await supabase
      .from("product_variants")
      .select("*")
      .order("display_order", { ascending: true });

    const { data: inventory } = await supabase
      .from("inventory")
      .select("*")
      .single();

    return {
      product: (product as Product) || null,
      variants: (variants as ProductVariant[]) || [],
      inventory: (inventory as Inventory) || { total_sachets_in_stock: 25920, low_stock_threshold: 1000 },
    };
  } catch (e) {
    console.error("Error loading home data:", e);
    return {
      product: null,
      variants: [],
      inventory: { total_sachets_in_stock: 25920, low_stock_threshold: 1000 },
    };
  }
}

export default async function HomePage() {
  const { product, variants, inventory } = await getHomeData();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is JETTEA® Green Tea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JETTEA® is a specially crafted premium green tea blend produced by J.C. Bonjour Concerns Limited (JCBC) in Nigeria, designed for healthy living and daily revitalization.",
        },
      },
      {
        "@type": "Question",
        name: "What are the available purchase options for JETTEA®?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JETTEA® is available as Single Sachets (₦400), Retail Packets containing 24 sachets (₦9,600), and Master Cartons containing 12 packets / 288 sachets (₦115,200). Wholesale distributor pricing is also available.",
        },
      },
      {
        "@type": "Question",
        name: "How should JETTEA® Green Tea be prepared?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Steep one JETTEA® sachet in 200ml-250ml of freshly boiled water (80°C–90°C) for 3 to 5 minutes. Enjoy warm in the morning or evening.",
        },
      },
      {
        "@type": "Question",
        name: "Does JETTEA® deliver nationwide in Nigeria?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, JETTEA® orders are dispatched nationwide across all 36 states and the Federal Capital Territory (Abuja) via fast express logistics.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden gradient-hero pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-tea-border">
        {/* Subtle Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 border border-forest/20 text-forest-deep text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-forest" />
                <span>100% Pure Botanical Green Tea</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-forest-deep tracking-tight leading-[1.1]">
                JETTEA<span className="text-gold-500">®</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-forest font-extrabold mt-2 tracking-normal">
                  FOR HEALTHY LIVING
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Elevate your daily wellness with the rich botanical antioxidant power of authentic <strong>JETTEA® Green Tea</strong>. Crafted to perfection by <strong>J.C. Bonjour Concerns Limited (JCBC)</strong> for vitality, metabolic balance, and natural refreshment.
              </p>

              {/* Verified Stock Badge */}
              <div className="flex items-center justify-center lg:justify-start">
                <StockBadge totalSachets={inventory?.total_sachets_in_stock || 25920} />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-brand hover:opacity-95 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl text-base uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
                >
                  <span>SHOP JETTEA NOW</span>
                  <ArrowRight className="w-5 h-5 text-gold-400" />
                </Link>

                <Link
                  href="/wholesale"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-tea-muted text-forest-deep border-2 border-forest/20 font-bold px-7 py-3.5 rounded-xl text-base transition-colors"
                >
                  <span>Wholesale / Distribute</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-tea-border max-w-md mx-auto lg:mx-0 text-left">
                <div className="space-y-1">
                  <p className="font-display font-bold text-forest-deep text-lg">₦400</p>
                  <p className="text-xs text-gray-500 font-medium">Per Sachet</p>
                </div>
                <div className="space-y-1 border-x border-tea-border px-4">
                  <p className="font-display font-bold text-forest-deep text-lg">24 Sachets</p>
                  <p className="text-xs text-gray-500 font-medium">Per Retail Packet</p>
                </div>
                <div className="space-y-1 pl-2">
                  <p className="font-display font-bold text-forest-deep text-lg">Nationwide</p>
                  <p className="text-xs text-gray-500 font-medium">Fast Dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual & Quick Buy Panel */}
            <div className="lg:col-span-5">
              <QuickBuyCard variants={variants} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / 4 PILLARS */}
      <section className="py-20 bg-white border-b border-tea-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Pure Wellness</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep">
              Why Discerning Drinkers Choose JETTEA®
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Every sachet of JETTEA® is crafted under strict quality standards to deliver an authentic, refreshing cup of health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-tea-bg border border-tea-border tea-card-hover space-y-4">
              <div className="w-14 h-14 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-forest-deep">Rich in Antioxidants</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Packed with natural polyphenols that support metabolic health, body vitality, and natural free-radical defense.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-tea-bg border border-tea-border tea-card-hover space-y-4">
              <div className="w-14 h-14 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-forest-deep">Individually Sealed</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Each sachet is sealed to lock in volatile botanicals, rich natural aroma, and peak freshness until the moment you brew.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-tea-bg border border-tea-border tea-card-hover space-y-4">
              <div className="w-14 h-14 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
                <CupSoda className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-forest-deep">Smooth & Refreshing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A delicate, balanced infusion with a clean, golden hue and naturally uplifting taste without harsh bitterness.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-tea-bg border border-tea-border tea-card-hover space-y-4">
              <div className="w-14 h-14 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-forest-deep">JCBC Quality Assurance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Authentic Nigerian manufacturing by J.C. Bonjour Concerns Limited, adhering to strict hygiene and regulatory standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SPECIFICATIONS & PACKAGING TIERS */}
      <section className="py-20 bg-tea-bg border-b border-tea-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Product Packages</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep">
              Available Formats & Pricing
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Choose the size that fits your routine—from individual daily sachets to family packets and wholesale cartons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Single Sachet */}
            <div className="bg-white rounded-2xl p-8 border border-tea-border shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase">
                  Daily Trial
                </div>
                <h3 className="font-display font-extrabold text-2xl text-forest-deep">Single Sachet</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  1 individually sealed sachet for on-the-go brewing or first-time tasting.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-forest">₦400</span>
                  <span className="text-gray-500 text-xs font-medium ml-2">/ 1 Sachet</span>
                </div>
              </div>

              <Link
                href="/shop"
                className="w-full text-center bg-tea-muted hover:bg-forest hover:text-white text-forest-deep font-bold py-3 rounded-xl transition-all text-sm"
              >
                Select Sachet
              </Link>
            </div>

            {/* Retail Packet - Most Popular */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gold-500 shadow-card relative flex flex-col justify-between space-y-6 transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-gold text-forest-deep font-black text-xs uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                Most Popular Retail Choice
              </div>

              <div className="space-y-4 pt-2">
                <div className="inline-block px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase">
                  Monthly Routine (24 Sachets)
                </div>
                <h3 className="font-display font-extrabold text-2xl text-forest-deep">Retail Packet</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  24 individually sealed freshness sachets. Ideal for maintaining a consistent daily morning or evening wellness regimen.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-forest">₦9,600</span>
                  <span className="text-gray-500 text-xs font-medium ml-2">/ 24 Sachets (₦400/sachet)</span>
                </div>
              </div>

              <Link
                href="/shop"
                className="w-full text-center bg-gradient-brand text-white font-bold py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all text-sm uppercase tracking-wider"
              >
                Buy Retail Packet
              </Link>
            </div>

            {/* Master Carton */}
            <div className="bg-white rounded-2xl p-8 border border-tea-border shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold uppercase">
                  Master Carton (288 Sachets)
                </div>
                <h3 className="font-display font-extrabold text-2xl text-forest-deep">Master Carton</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  12 full packets containing 288 sachets total. Ideal for offices, families, or commercial supply.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-forest">₦115,200</span>
                  <span className="text-gray-500 text-xs font-medium ml-2">/ 12 Packets</span>
                </div>
              </div>

              <Link
                href="/wholesale"
                className="w-full text-center bg-tea-muted hover:bg-forest hover:text-white text-forest-deep font-bold py-3 rounded-xl transition-all text-sm"
              >
                Wholesale Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW TO PREPARE JETTEA (BREWING RITUAL) */}
      <section className="py-20 bg-white border-b border-tea-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase">
                <Clock className="w-3.5 h-3.5 text-gold-600" />
                <span>Optimal Infusion Guide</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep leading-tight">
                How to Prepare the Perfect Cup of JETTEA®
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Brewing green tea with the right water temperature ensures maximum extraction of healthy botanical antioxidants without compromising its delicate flavor.
              </p>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Brew Master Tip:</strong> Never use boiling water directly from a rolling boil. Allow it to sit for 1 minute so the water reaches approximately 80°C–90°C for optimal smoothness.
              </div>
              <Link
                href="/how-to-prepare"
                className="inline-flex items-center gap-2 text-forest font-bold text-sm hover:text-forest-deep"
              >
                <span>Read detailed brewing tips & guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-tea-bg border border-tea-border space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h4 className="font-bold text-forest-deep">Hot Water (80°C)</h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Boil fresh water and allow it to cool slightly for 60 seconds before pouring.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-tea-bg border border-tea-border space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h4 className="font-bold text-forest-deep">Steep Sachet</h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Place 1 JETTEA® sachet in your mug. Pour 200ml–250ml of hot water over it.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-tea-bg border border-tea-border space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest text-gold-accent flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h4 className="font-bold text-forest-deep">3-5 Mins & Enjoy</h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Allow to steep for 3 to 5 minutes to release the rich golden infusion. Sip warm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPANY & REGULATORY INTEGRITY SECTION */}
      <section className="py-16 bg-forest-deep text-white border-b border-forest-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>Corporate Integrity & Manufacturing</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Produced by J.C. Bonjour Concerns Limited (JCBC)
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                J.C. Bonjour Concerns Limited is dedicated to producing trustworthy, high-grade wellness beverages. JETTEA® is manufactured in accordance with strict Nigerian hygiene and quality benchmarks.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/about"
                className="w-full text-center bg-gold-500 hover:bg-gold-400 text-forest-deep font-bold py-3 px-6 rounded-xl transition-colors text-sm uppercase tracking-wider"
              >
                Learn About JCBC
              </Link>
              <Link
                href="/wholesale"
                className="w-full text-center bg-forest-light/60 hover:bg-forest-light text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm border border-forest-light"
              >
                Distributor Applications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GENUINE REVIEWS PLACEHOLDER SECTION */}
      <section className="py-20 bg-tea-bg border-b border-tea-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Customer Feedback</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep">
              Verified Customer Reviews
            </h2>
            <p className="text-gray-600 text-sm">
              We uphold transparency. We only publish genuine reviews submitted by verified purchasers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 border border-tea-border text-center max-w-2xl mx-auto space-y-4 shadow-soft">
            <div className="w-16 h-16 rounded-full bg-gold-50 text-gold-500 flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 fill-gold-400 text-gold-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Be the First to Review JETTEA®</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Have you experienced the refreshing vitality of JETTEA® Green Tea? Share your feedback after receiving your order.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-white font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider shadow"
              >
                Order & Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NATIONWIDE DELIVERY & LOGISTICS */}
      <section className="py-20 bg-white border-b border-tea-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>Nationwide Shipping</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep leading-tight">
                Swift, Reliable Delivery Across All 36 States & FCT
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you are in Lagos, Abuja, Port Harcourt, Ibadan, Kano, or anywhere in Nigeria, our dispatch network ensures your JETTEA® orders arrive fresh and prompt.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>Lagos Metro:</strong> 1-2 business days express delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>South-West & Abuja (FCT):</strong> 2-4 business days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>Nationwide & Depot Pickup:</strong> Fast regional hubs</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/delivery-policy"
                  className="text-forest font-bold text-sm hover:underline"
                >
                  View full delivery zones and rates →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-tea-bg rounded-2xl p-8 border border-tea-border space-y-6">
              <h3 className="font-bold text-forest-deep text-lg">Estimated Delivery Zone Pricing</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-white rounded-lg border border-tea-border">
                  <span className="font-medium text-gray-800">Lagos Metropolitan</span>
                  <span className="font-bold text-forest">₦2,000</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg border border-tea-border">
                  <span className="font-medium text-gray-800">South-West States</span>
                  <span className="font-bold text-forest">₦3,500</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg border border-tea-border">
                  <span className="font-medium text-gray-800">Abuja (FCT) & Central Region</span>
                  <span className="font-bold text-forest">₦4,000</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg border border-tea-border">
                  <span className="font-medium text-gray-800">South-East & South-South</span>
                  <span className="font-bold text-forest">₦4,500</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg border border-tea-border">
                  <span className="font-medium text-gray-800">Northern States</span>
                  <span className="font-bold text-forest">₦5,000</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Exact delivery fee is calculated at checkout once you select your delivery state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 bg-tea-bg border-b border-tea-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Answers to Your Questions</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-deep">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <details className="group bg-white rounded-xl border border-tea-border p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-forest-deep text-base">
                <span>What makes JETTEA® Green Tea unique?</span>
                <ChevronDown className="w-5 h-5 transition duration-300 group-open:-rotate-180 text-forest" />
              </summary>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                JETTEA® is formulated with high-potency green tea botanicals rich in natural polyphenols and antioxidants. Manufactured by J.C. Bonjour Concerns Limited (JCBC), it delivers a clean, smooth, invigorating infusion with no artificial preservatives.
              </p>
            </details>

            <details className="group bg-white rounded-xl border border-tea-border p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-forest-deep text-base">
                <span>Can I buy in wholesale or become a distributor?</span>
                <ChevronDown className="w-5 h-5 transition duration-300 group-open:-rotate-180 text-forest" />
              </summary>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Yes! We welcome retailers, pharmacies, supermarkets, wellness centers, and regional distributors across Nigeria. Visit our Wholesale Portal to submit an inquiry, and our commercial sales desk will get back to you with wholesale carton pricing.
              </p>
            </details>

            <details className="group bg-white rounded-xl border border-tea-border p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-forest-deep text-base">
                <span>How many sachets are in a packet and carton?</span>
                <ChevronDown className="w-5 h-5 transition duration-300 group-open:-rotate-180 text-forest" />
              </summary>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Each Retail Packet contains 24 individually sealed sachets (₦9,600). A Master Carton contains 12 packets, which equals 288 sachets total (₦115,200).
              </p>
            </details>

            <details className="group bg-white rounded-xl border border-tea-border p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-forest-deep text-base">
                <span>What payment methods are supported?</span>
                <ChevronDown className="w-5 h-5 transition duration-300 group-open:-rotate-180 text-forest" />
              </summary>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                We support secure automated online payments via our integrated payment gateway (including card, crypto, and direct transfer options) with instant server-verified confirmation.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 9. FINAL PURCHASE CALL TO ACTION */}
      <section className="py-20 bg-forest text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FOR HEALTHY LIVING</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Start Your Daily Wellness Journey with JETTEA® Today
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Order authentic sachets, retail packets, or master cartons directly from the official store of J.C. Bonjour Concerns Limited.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-gold hover:opacity-95 text-forest-deep font-black px-8 py-4 rounded-xl shadow-xl text-base uppercase tracking-wider transition-all"
            >
              <span>ORDER JETTEA NOW</span>
              <ArrowRight className="w-5 h-5 text-forest-deep" />
            </Link>

            <Link
              href="/wholesale"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-light/60 hover:bg-forest-light text-white font-bold px-7 py-3.5 rounded-xl text-base border border-forest-light"
            >
              <span>Distributor Inquiries</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
