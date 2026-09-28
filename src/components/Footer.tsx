import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Phone, Mail, MapPin, ExternalLink, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-white border-t border-forest-light/40">
      {/* Brand Value Banner */}
      <div className="bg-forest-light/30 border-b border-forest-light/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Pure Botanical Quality</h4>
              <p className="text-gray-300 text-xs">Carefully harvested and processed green tea leaves</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Authentic JCBC Production</h4>
              <p className="text-gray-300 text-xs">Direct from J.C. Bonjour Concerns Limited</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">FOR HEALTHY LIVING</h4>
              <p className="text-gray-300 text-xs">Natural antioxidant rich infusion for daily vitality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-500 text-forest-deep flex items-center justify-center font-black text-xl">
              JT
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">JETTEA®</h3>
              <p className="text-[10px] font-bold text-gold-400 tracking-widest uppercase">FOR HEALTHY LIVING</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
            JETTEA® is a premier botanical green tea beverage crafted to promote natural vitality, antioxidant support, and daily wholesome wellness across Nigeria.
          </p>

          <div className="pt-2 text-xs text-gray-400">
            <p className="font-semibold text-gray-200">A Product of:</p>
            <p className="text-gold-300 font-medium">J.C. Bonjour Concerns Limited (JCBC)</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-gold-300 transition-colors">Home</Link></li>
            <li><Link href="/shop" className="hover:text-gold-300 transition-colors">Shop Products</Link></li>
            <li><Link href="/about" className="hover:text-gold-300 transition-colors">About JETTEA & JCBC</Link></li>
            <li><Link href="/how-to-prepare" className="hover:text-gold-300 transition-colors">How to Prepare</Link></li>
            <li><Link href="/wholesale" className="hover:text-gold-300 transition-colors">Become a Distributor</Link></li>
            <li><Link href="/order-lookup" className="hover:text-gold-300 transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div>
          <h4 className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm text-gray-300">
            <li><Link href="/faq" className="hover:text-gold-300 transition-colors">Frequently Asked Questions</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300 transition-colors">Contact Support</Link></li>
            <li><Link href="/delivery-policy" className="hover:text-gold-300 transition-colors">Delivery Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold-300 transition-colors">Refund & Return Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Direct Contact & Wholesale */}
        <div>
          <h4 className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-4">Get in Touch</h4>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
              <span>support@jettea.ng</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
              <span>+234 800 JETTEA HQ</span>
            </div>
            <div className="pt-2">
              <Link
                href="/wholesale"
                className="inline-block w-full text-center bg-gold-500 hover:bg-gold-400 text-forest-deep font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-lg transition-colors shadow-sm"
              >
                Wholesale Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer & Copyright */}
      <div className="border-t border-forest-light/40 bg-forest-deep py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-400 space-y-3">
          <p className="leading-relaxed text-gray-300 bg-forest-light/20 p-3 rounded-lg border border-forest-light/30">
            <strong className="text-gold-400">Compliance & Regulatory Notice:</strong> JETTEA® Green Tea is formulated as a natural beverage for general wellness and healthy living. This product is not intended to diagnose, treat, cure, or prevent any medical disease or specific health condition. Statements regarding this herbal infusion have not been evaluated as medical claims.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-gray-400">
            <p>© {new Date().getFullYear()} JETTEA® - A Registered Brand of J.C. Bonjour Concerns Limited (JCBC). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/admin/login" className="text-gray-400 hover:text-gold-400 transition-colors">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
