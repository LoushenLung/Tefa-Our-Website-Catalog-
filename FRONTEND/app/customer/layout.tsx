"use client";

import CustomerHeader from "@/components/appsidebar-customer"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* 
          Header Bar di atas. 
          Karena di komponen Header kita pakai 'sticky' atau 'fixed', 
          maka dia akan tetap di atas saat di-scroll.
      */}
      <CustomerHeader />

      {/* 
          MAIN CONTENT 
          - flex-1: Mengambil sisa tinggi layar.
          - p-6 atau p-8: Memberikan ruang agar konten tidak mepet ke pinggir.
          - max-w-screen-xl: Menjaga lebar konten agar tetap rapi di layar lebar (opsional).
      */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}