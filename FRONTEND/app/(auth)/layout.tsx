"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="w-full max-w-screen-xl mx-auto p-6 pt-24 lg:p-8 lg:pt-24">
        {children}
      </main>
    </div>
  );
}
