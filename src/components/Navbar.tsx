"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ShieldCheck, PhoneCall, Sparkles } from "lucide-react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "How to Prepare", href: "/how-to-prepare" },
    { name: "Wholesale", href: "/wholesale" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-forest-deep text-gold-400 text-xs py-2 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" /> Official JCBC Store
            </span>
            <span className="hidden sm:inline text-gray-200">
              Authentic JETTEA® Green Tea • Fast Nationwide Delivery Across Nigeria
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <Link
              href="/order-lookup"
              className="flex items-center gap-1 hover:text-gold-400 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <span className="hidden md:inline text-gray-500">|</span>
            <Link
              href="/wholesale"
              className="hidden md:inline hover:text-gold-400 transition-colors font-medium text-gold-400"
            >
              Distributor Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tea-border shadow-soft transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center text-gold-accent font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
                JT
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-forest-deep flex items-center gap-1">
                  JETTEA<span className="text-gold-500 text-sm font-semibold">®</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600 -mt-1">
                  FOR HEALTHY LIVING
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-forest ${
                    isActive(link.href)
                      ? "text-forest font-semibold border-b-2 border-forest pb-1"
                      : "text-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-brand hover:opacity-95 text-white text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Shop Now
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-lg text-forest-deep hover:bg-tea-muted transition-colors"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-gold-500 text-forest-deep text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-forest-deep hover:bg-tea-muted"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-tea-border bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "bg-brand-50 text-forest font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-forest text-white py-3 rounded-lg font-bold text-sm"
              >
                Shop JETTEA®
              </Link>
              <Link
                href="/order-lookup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gray-100 text-gray-800 py-2.5 rounded-lg font-medium text-sm"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
