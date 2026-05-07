"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "-",
    address: "-",
    image: null,
    role: "CUSTOMER"
  });

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const data = JSON.parse(session);
        setUser(prev => ({ ...prev, ...data }));
      } catch (e) {
        console.error("Failed to load user session");
      }
    }
  }, []);

  const handleSave = () => {
    // Simpan ke localStorage
    localStorage.setItem("user_session", JSON.stringify(user));
    setIsEditing(false);
    // Di sini nanti bisa ditambah fetch ke API PATCH /users/:id
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500">Kelola informasi pribadi dan pengaturan akun kamu.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-red-50 border-4 border-white shadow-xl overflow-hidden mb-4 flex items-center justify-center">
                {user.image ? (
                  <Image src={user.image} alt="Profile" fill className="object-cover" />
                ) : (
                  <User size={64} className="text-red-200" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-4 right-0 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all">
                  <Camera size={16} />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name || "User Name"}</h2>
            <div className="mt-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100 flex items-center gap-1.5">
              <ShieldCheck size={12} /> {user.role}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                   <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isEditing ? 'bg-white border-red-200' : 'bg-slate-50 border-transparent text-slate-500'}`}>
                    <User size={18} />
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      className="bg-transparent outline-none w-full text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border-transparent text-slate-500">
                    <Mail size={18} />
                    <input 
                      disabled={true} // Email typically not editable
                      type="email" 
                      value={user.email}
                      className="bg-transparent outline-none w-full text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isEditing ? 'bg-white border-red-200' : 'bg-slate-50 border-transparent text-slate-500'}`}>
                    <Phone size={18} />
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      placeholder="+62 8xx xxxx xxxx"
                      value={user.phone}
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      className="bg-transparent outline-none w-full text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isEditing ? 'bg-white border-red-200' : 'bg-slate-50 border-transparent text-slate-500'}`}>
                    <MapPin size={18} />
                    <input 
                      disabled={!isEditing}
                      type="text" 
                      placeholder="City, Province"
                      value={user.address}
                      onChange={(e) => setUser({...user, address: e.target.value})}
                      className="bg-transparent outline-none w-full text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
