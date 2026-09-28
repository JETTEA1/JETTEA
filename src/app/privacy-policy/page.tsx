import React from "react";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | JETTEA® Nigeria",
  description: "How J.C. Bonjour Concerns Limited collects, uses, and safeguards customer data on JETTEA® platforms.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm">
            Last Updated: September 2026 • J.C. Bonjour Concerns Limited (JCBC)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-tea-border shadow-soft space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">1. Information We Collect</h2>
            <p>
              When you purchase or submit inquiries on our website, we collect necessary fulfillment information including your full name, email address, phone number, and physical delivery address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">2. How We Use Your Information</h2>
            <p>
              Your data is strictly utilized to process transactions, dispatch parcels, provide order tracking notifications, respond to customer care inquiries, and evaluate wholesale applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">3. Payment Information Security</h2>
            <p>
              We never store your credit/debit card numbers on our servers. All financial transactions are processed securely through certified payment gateways operating under industry-standard encryption protocols.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">4. Contact Us</h2>
            <p>
              For privacy-related inquiries, please email us at <strong>support@jettea.ng</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
