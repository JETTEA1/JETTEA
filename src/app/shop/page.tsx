import React from "react";
import Link from "next/link";
import { Leaf, ShieldCheck, Sparkles, ShoppingBag, ArrowRight, Truck, Check } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Product, ProductVariant, Inventory } from "@/lib/types";
import JsonLd from "@/components/JsonLd";
import StockBadge from "@/components/StockBadge";
import ShopVariantCard from "@/components/ShopVariantCard";
import { formatNaira } from "@/lib/utils";

export const metadata = {
  title: "Shop JETTEA® Green Tea | Retail Packets & Master Cartons",
  description:
    "Order authentic JETTEA® Green Tea by J.C. Bonjour Concerns Limited. Available in retail packets of 24 sachets (₦9,600) and master cartons of 12 packets / 288 sachets (₦115,200). Fast nationwide delivery.",
};

export const revalidate = 60;

async function getShopData() {
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
      .eq("is_active", true)
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
    console.error("Shop data fetch error:", e);
    return {
      product: null,
      variants: [],
      inventory: { total_sachets_in_stock: 25920, low_stock_threshold: 1000 },
    };
  }
}

export default async function ShopPage() {
  const { product, variants, inventory } = await getShopData();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "JETTEA® Green Tea",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
    description: "JETTEA® Green Tea formulated for healthy living by J.C. Bonjour Concerns Limited.",
    brand: {
      "@type": "Brand",
      name: "JETTEA®",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NGN",
      lowPrice: "9600",
      highPrice: "115200",
      offerCount: variants.length.toString(),
      offers: variants.map((v) => ({
        "@type": "Offer",
        name: v.name,
        price: v.price.toString(),
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        url: "https://jettea.ng/shop",
      })),
    },
  };

  return (
    <div className="bg-tea-bg min-h-screen py-12">
      <JsonLd data={productSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" />
            <span>Official Catalogue</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-forest-deep tracking-tight">
            Shop JETTEA® Green Tea
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Order authentic JETTEA® formulated <strong>FOR HEALTHY LIVING</strong>. Choose your packaging tier below with instant checkout and nationwide express delivery.
          </p>
          <div className="flex justify-center pt-2">
            <StockBadge totalSachets={inventory.total_sachets_in_stock} />
          </div>
        </div>

        {/* Product Variant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
          {variants.map((variant) => (
            <ShopVariantCard key={variant.id} variant={variant} />
          ))}
        </div>

        {/* Wholesale Promotion Banner */}
        <div className="bg-forest-deep rounded-3xl p-8 sm:p-12 text-white border border-forest-light/40 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commercial & Distributor Pricing</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Interested in Bulk or Wholesale Distribution?
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                Partner directly with J.C. Bonjour Concerns Limited (JCBC) to stock JETTEA® in your supermarket, pharmacy, wellness store, or regional distributorship at tiered B2B wholesale rates.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/wholesale"
                className="inline-flex items-center justify-center gap-2 bg-gradient-gold hover:opacity-95 text-forest-deep font-black px-8 py-4 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider"
              >
                <span>Wholesale Application</span>
                <ArrowRight className="w-4 h-4 text-forest-deep" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
