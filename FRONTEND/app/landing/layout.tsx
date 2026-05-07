"use client";

import CustomerHeader from "@/components/appsidebar-customer"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header Bar di atas */}
      <CustomerHeader />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
