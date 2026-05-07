"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store, ChevronLeft } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Format email tidak valid.";
    if (!form.password) newErrors.password = "Password wajib diisi.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrors({ api: data?.message || "Email atau password salah." });
      } else {
        const data = await res.json();
        // TODO: simpan token ke cookie/localStorage sesuai auth strategy
        if (data?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
      }
    } catch {
      setErrors({ api: "Tidak dapat terhubung ke server." });
    } finally {
      setLoading(false);
    }
  };

  // TODO: aktifkan saat NextAuth/OAuth sudah dikonfigurasi
  const handleGoogleSignIn = () => {
    alert("[DEV MODE] Google Sign-In belum terhubung ke backend.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-6 lg:px-12 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <ChevronLeft size={15} />
            Home
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
            <span className="font-black text-xl tracking-tighter text-slate-900">TEFA</span>
          </Link>
        </div>
        <span className="text-slate-500 text-sm">
          Belum punya akun?{" "}
          <Link href="/sign-up" className="text-red-600 font-bold hover:underline">
            Daftar
          </Link>
        </span>
      </nav>

      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-red-100 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-slate-200 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 relative z-10">
        <div className="w-full max-w-md">

          {/* CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">

            {/* TOP ACCENT */}
            <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

            <div className="p-8 space-y-6">

              {/* HEADER */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 mb-4">
                  <Store size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sign in to access the SMK Telkom<br />Malang Student Project Marketplace.
                </p>
              </div>

              {/* API ERROR */}
              {errors.api && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium">
                  {errors.api}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 focus-within:bg-white focus-within:border-red-400 focus-within:shadow-sm focus-within:shadow-red-100 transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="email"
                      placeholder="student@smktelkom-mlg.sch.id"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="flex-1 bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-red-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 focus-within:bg-white focus-within:border-red-400 focus-within:shadow-sm focus-within:shadow-red-100 transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
                    <Lock size={16} className="text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="flex-1 bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password}</p>}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      Login to Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-slate-400 text-xs font-medium">ATAU</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* GOOGLE SIGN IN */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4068 3.78409 7.8299 3.96409 7.29V4.9581H0.957273C0.347727 6.1731 0 7.5477 0 9C0 10.4522 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8917 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9581L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-slate-500">
            New to the TEFA?{" "}
            <Link href="/sign-up" className="font-bold text-red-600 hover:underline">
              Create a new account
            </Link>
          </p>
        </div>

        {/* Bottom Secure Tag */}
        <div className="flex items-center justify-center gap-2 border-t border-slate-50 bg-slate-50/50 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-tight">
          <Lock size={12} />
          Secure Institutional Login Gateway
        </div>
      </main>
    </div>
  );
}