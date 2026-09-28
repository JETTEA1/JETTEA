"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Truck,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    { name: "Products & Pricing", href: "/admin/products", icon: Layers },
    { name: "Delivery Zones", href: "/admin/delivery-zones", icon: Truck },
    { name: "Wholesale CRM", href: "/admin/wholesale", icon: Users },
    { name: "Site & SEO Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/admin" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-forest-deep text-white flex flex-col justify-between border-r border-forest-light/30 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-forest-light/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500 text-forest-deep flex items-center justify-center font-black text-xl">
            JT
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-white">JETTEA®</h1>
            <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
              Management Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold-500 text-forest-deep font-bold shadow-sm"
                    : "text-gray-300 hover:bg-forest-light/40 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-forest-deep" : "text-gold-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Quick Store link */}
      <div className="p-4 border-t border-forest-light/30 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs text-gray-300 bg-forest-light/30 hover:bg-forest-light/50 transition-colors"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>J.C. Bonjour Concerns Ltd</span>
        </div>
      </div>
    </aside>
  );
}
