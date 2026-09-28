import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Delivery Policy | JETTEA® Nigeria",
  description: "Official delivery timeframes, zones, rates, and dispatch guidelines across Nigeria.",
};

export default function DeliveryPolicyPage() {
  return (
    <div className="bg-tea-bg min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipping & Logistics</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-deep tracking-tight">
            Delivery Policy & Shipping Information
          </h1>
          <p className="text-gray-600 text-sm">
            Last Updated: September 2026 • J.C. Bonjour Concerns Limited (JCBC)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-tea-border shadow-soft space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">1. Nationwide Coverage</h2>
            <p>
              JETTEA® orders placed on our official store are fulfilled from our central Nigerian distribution hubs and dispatched to all 36 states and the Federal Capital Territory (Abuja).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">2. Delivery Timeframes & Pricing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-tea-bg text-forest-deep font-bold">
                    <th className="p-3 border border-gray-200">Zone / Region</th>
                    <th className="p-3 border border-gray-200">Estimated Delivery Time</th>
                    <th className="p-3 border border-gray-200">Standard Delivery Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">Lagos Metropolitan</td>
                    <td className="p-3 border border-gray-200">1 – 2 Business Days</td>
                    <td className="p-3 border border-gray-200 font-bold text-forest">₦2,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">South-West Zone (Ogun, Oyo, Osun, Ondo, Ekiti)</td>
                    <td className="p-3 border border-gray-200">2 – 3 Business Days</td>
                    <td className="p-3 border border-gray-200 font-bold text-forest">₦3,500</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">Abuja (FCT) & North-Central States</td>
                    <td className="p-3 border border-gray-200">2 – 4 Business Days</td>
                    <td className="p-3 border border-gray-200 font-bold text-forest">₦4,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">South-East & South-South States</td>
                    <td className="p-3 border border-gray-200">3 – 5 Business Days</td>
                    <td className="p-3 border border-gray-200 font-bold text-forest">₦4,500</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-medium">Northern States</td>
                    <td className="p-3 border border-gray-200">3 – 6 Business Days</td>
                    <td className="p-3 border border-gray-200 font-bold text-forest">₦5,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">3. Order Confirmation & Tracking</h2>
            <p>
              Once your payment is verified, you will immediately receive an Order Reference Number (e.g. <code>JT-XXXX-XXXX</code>). You can track your dispatch status anytime through our online <Link href="/order-lookup" className="text-forest font-bold underline">Order Lookup Tool</Link> or by contacting our WhatsApp support line.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-forest-deep">4. Packaging Integrity</h2>
            <p>
              Every parcel is sealed in tamper-evident protective outer packaging to ensure your JETTEA® boxes and sachets reach you in pristine, factory-fresh condition.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
