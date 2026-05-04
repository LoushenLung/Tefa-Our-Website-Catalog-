"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, EyeOff, ArrowRight, ArrowLeft, Store } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log("Signing in with:", { email, password });
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      {/* Tombol Kembali ke Beranda */}
      <Link 
        href="/" 
        className="fixed left-4 top-4 flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-red-600 md:left-8 md:top-8"
      >
        <ArrowLeft size={18} />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Dekoratif Garis Merah Atas */}
        <div className="h-1.5 w-full bg-red-600" />

        <div className="p-8">
          {/* Logo Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-200">
              <Store size={28} />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Sign in to access the SMK Telkom <br /> Malang Student Project Marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="student@smktelkom-mlg.sch.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <a href="#" className="text-[11px] font-bold text-red-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10"
                />
                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                  <EyeOff size={16} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              Login to Account
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-slate-400">Or</span>
            </div>
          </div>

          {/* Google Sign In (Optional, disesuaikan ke gaya gambar) */}
          <button 
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.312 2.696-7.84 2.696-7.032 0-12.76-5.704-12.76-12.728s5.728-12.728 12.76-12.728c3.84 0 6.536 1.504 8.512 3.384l2.36-2.36c-2.336-2.224-5.4-3.912-10.872-3.912-9.696 0-17.76 8.064-17.76 17.76s8.064 17.76 17.76 17.76c5.224 0 9.176-1.728 12.264-4.936 3.192-3.192 4.192-7.64 4.192-11.232 0-1.072-.08-2.096-.24-3.072h-16.216z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-slate-500">
            New to the marketplace?{" "}
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
      </div>
    </div>
  );
}