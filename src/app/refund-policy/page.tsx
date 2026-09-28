import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Refund & Return Policy | JETTEA® Nigeria",
  description: "Official return and refund guidelines for JETTEA® Green Tea orders.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Protection</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep tracking-tight">
            Refund & Returns Policy
          </h1>
          <p className="text-gray-600 text-sm">
            Last Updated: September 2026 • J.C. Bonjour Concerns Limited (JCBC)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-tea-border shadow-soft space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">1. Eligibility for Returns</h2>
            <p>
              Due to hygiene and food-safety regulations concerning consumable botanical beverages, JETTEA® products can only be returned if:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>The outer carton or packet packaging was visibly damaged during transit.</li>
              <li>An incorrect item or variant format was delivered by our logistics partners.</li>
              <li>The item remains unopened, sealed in its original manufacturer packaging, and reported within <strong>48 hours</strong> of delivery.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">2. Return Process</h2>
            <p>
              To initiate a return or replacement, contact our customer care team via email at <strong>support@jettea.ng</strong> or via WhatsApp with your Order Reference Number and clear photographs of the delivered parcel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">3. Refunds & Replacements</h2>
            <p>
              Approved claims will be offered an immediate free replacement dispatch or a full refund processed back to the original payment source within 3–5 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
