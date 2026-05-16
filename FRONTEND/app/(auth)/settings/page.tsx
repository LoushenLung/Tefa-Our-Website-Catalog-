"use client";

import { Lock, Bell, LogOut } from "lucide-react";
import { deleteCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await deleteCookie("accessToken");
    localStorage.removeItem("user_session");
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500">Kelola preferensi dan keamanan akun kamu.</p>
      </div>

      <div className="space-y-6">
        {/* Security Settings */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Lock size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Security</h2>
          </div>

          <button className="w-full p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left font-bold text-slate-900">
            Change Password
          </button>
          <button className="w-full p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left font-bold text-slate-900">
            Two-Factor Authentication
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Bell size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
          </div>

          <label className="flex items-center gap-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-red-600" />
            <span className="text-slate-700 font-medium">Email Notifications</span>
          </label>
          <label className="flex items-center gap-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-red-600" />
            <span className="text-slate-700 font-medium">Order Updates</span>
          </label>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
