"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ChevronLeft, RefreshCcw } from "lucide-react";
import { storeCookie } from "@/lib/client-cookies";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      const nextInput = element.parentElement?.nextElementSibling?.querySelector("input");
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = (e.currentTarget.parentElement?.previousElementSibling?.querySelector("input") as HTMLInputElement);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Invalid or expired OTP.");
        return;
      }

      const token = result.data?.access_token;
      if (!token) {
        setError("Verification successful, but token not received.");
        return;
      }

      await storeCookie("accessToken", token);
      
      // Decode role and redirect
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("user_session", JSON.stringify({
        name: payload.name || "User",
        email: payload.email,
        role: payload.role
      }));

      if (payload.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setTimer(60);
      setError("");
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-red-500 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 px-6 lg:px-12 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
            <ChevronLeft size={15} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-md">T</div>
            <span className="font-black text-xl tracking-tighter text-slate-900">TEFA</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 mb-4 transition-transform hover:scale-110 duration-300">
                  <ShieldCheck size={26} className="text-red-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verify Identity</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-bold text-slate-700">{email}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <div key={index} className="w-12 h-14">
                      <input
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-full h-full text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100 outline-none transition-all"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                    {!loading && <ArrowRight size={18} />}
                  </button>

                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-xs text-slate-400 font-medium">
                        Resend code in <span className="text-red-600">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                      >
                        <RefreshCcw size={12} /> Resend Verification Code
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-slate-50 bg-slate-50/50 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-tight">
              Two-Factor Authentication Enabled
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
