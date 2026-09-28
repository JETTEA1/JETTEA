import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | JETTEA® Business Platform",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}
