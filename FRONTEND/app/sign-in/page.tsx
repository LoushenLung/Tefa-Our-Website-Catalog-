"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Pastikan sudah instal: npm install lucide-react
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store, ChevronLeft } from "lucide-react";
// Sesuaikan path import dengan lokasi file cookie kamu
import { storeCookie } from "@/lib/client-cookies";

export default function SignInPage() {
  const router = useRouter();
  
  // State Logika
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Handler Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const requestBody = JSON.stringify({ email, password });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result?.message || "Email atau password salah.");
        return;
      }

      const responseData = result.data;

      // Jika backend meminta 2FA / OTP
      if (responseData?.requires2FA) {
        setError(responseData.message || "Kode OTP telah dikirim ke email Anda.");
        return;
      }

      // Simpan token ke cookie
      const token = responseData?.access_token;
      if (!token) {
        setError("Login gagal: token tidak ditemukan.");
        return;
      }

      await storeCookie("accessToken", token);

      // Decode role dari JWT payload untuk redirect
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/customer");
        }
      } catch {
        router.push("/customer");
      }
      
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
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
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-md">T</div>
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

          {/* CARD UTAMA */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
            
            {/* GRADIENT ACCENT */}
            <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

            <div className="p-8 space-y-6">

              {/* HEADER SECTION */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 mb-4 transition-transform hover:scale-110 duration-300">
                  <Store size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sign in to access the SMK Telkom<br />Malang Student Project Marketplace.
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium animate-shake">
                  {error}
                </div>
              )}

              {/* LOGIN FORM */}
              <form onSubmit={handleSignIn} className="space-y-4">
                
                {/* EMAIL INPUT */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 focus-within:bg-white focus-within:border-red-400 focus-within:shadow-sm focus-within:shadow-red-100 transition-all ${error ? 'border-red-400' : 'border-slate-200'}`}>
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-bold text-red-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-slate-50 focus-within:bg-white focus-within:border-red-400 focus-within:shadow-sm focus-within:shadow-red-100 transition-all ${error ? 'border-red-400' : 'border-slate-200'}`}>
                    <Lock size={16} className="text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
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
                <span className="text-slate-400 text-xs font-medium">OR</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* SECONDARY ACTION */}
              <p className="text-center text-sm text-slate-500">
                New to the marketplace?{" "}
                <Link href="/sign-up" className="text-red-600 font-bold hover:underline">
                  Create a new account
                </Link>
              </p>

              {/* SECURITY BADGE */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs">
                <Lock size={11} />
                <span className="uppercase tracking-wider font-medium">Secure Institutional Login Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}