import React from "react";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | JETTEA® Nigeria",
  description: "Terms and conditions governing the use of JETTEA® online services and store.",
};

export default function TermsPage() {
  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-gray-600 text-sm">
            Last Updated: September 2026 • J.C. Bonjour Concerns Limited (JCBC)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-tea-border shadow-soft space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">2. Brand & Product Representation</h2>
            <p>
              JETTEA® is a registered trademark of J.C. Bonjour Concerns Limited. All products are sold strictly for general wellness and healthy living. No medical claims or disease treatment promises are made or implied.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">3. Pricing & Orders</h2>
            <p>
              All prices are listed in Nigerian Naira (₦). We reserve the right to adjust product pricing, delivery fees, and inventory availability without prior notice. An order is deemed confirmed only after successful payment verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">4. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
