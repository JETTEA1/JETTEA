import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | JETTEA®",
  description:
    "Got questions about JETTEA® Green Tea, pricing, packets, delivery, and wholesale orders? Find all answers here.",
};

const FAQS = [
  {
    q: "What is JETTEA® Green Tea?",
    a: "JETTEA® is a specially selected botanical green tea crafted for healthy living and daily revitalization. Produced in Nigeria by J.C. Bonjour Concerns Limited (JCBC), it delivers rich natural antioxidants, clean energy, and a smooth taste.",
  },
  {
    q: "How many sachets are in a packet and in a carton?",
    a: "One Retail Packet contains 24 individually sealed sachets (₦9,600). One Master Carton contains 12 packets, which equals 288 sachets in total (₦115,200). Single trial sachets are available for ₦400.",
  },
  {
    q: "How fast is delivery across Nigeria?",
    a: "Lagos Metropolitan deliveries take 1 to 2 business days. South-West states and Abuja (FCT) arrive within 2 to 4 business days. Other states across Nigeria take 3 to 5 business days via reliable express freight partners.",
  },
  {
    q: "What payment methods are supported on this website?",
    a: "We accept secure payments via debit cards, crypto, and direct bank transfers through our automated payment infrastructure with real-time verification.",
  },
  {
    q: "How can I purchase in wholesale or become a distributor?",
    a: "Supermarkets, pharmacies, retail stores, and regional distributors can apply directly through our Wholesale Portal to receive commercial distributor pricing and bulk delivery.",
  },
  {
    q: "Does JETTEA® cure or treat diabetes or any disease?",
    a: "No. JETTEA® is a natural botanical green tea beverage crafted FOR HEALTHY LIVING and antioxidant nutrition. It is not a drug, cure, or medical solution for diabetes or any illness.",
  },
  {
    q: "How should I store my JETTEA® sachets?",
    a: "Keep your sachets in a cool, dry place away from direct sunlight and moisture. Because every sachet is individually sealed, its freshness and botanical potency remain protected until opened.",
  },
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <JsonLd data={faqSchema} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & FAQ</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-forest-deep tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about purchasing, brewing, and enjoying JETTEA® Green Tea.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((item, index) => (
            <details
              key={index}
              className="group bg-white rounded-2xl border border-tea-border p-6 shadow-soft [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-bold text-forest-deep text-base sm:text-lg">
                <span>{item.q}</span>
                <ChevronDown className="w-5 h-5 transition duration-300 group-open:-rotate-180 text-forest shrink-0" />
              </summary>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* Support Help Box */}
        <div className="bg-forest-deep text-white rounded-3xl p-8 sm:p-10 border border-forest-light/40 shadow-card text-center space-y-4">
          <h2 className="font-display font-bold text-2xl text-white">Have More Questions?</h2>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            Our customer care team is happy to assist you with order inquiries, product guidance, or wholesale information.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-forest-deep font-bold px-7 py-3 rounded-xl text-sm uppercase tracking-wider transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-forest-light/60 hover:bg-forest-light text-white font-bold px-7 py-3 rounded-xl text-sm border border-forest-light transition-colors"
            >
              Shop JETTEA®
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
