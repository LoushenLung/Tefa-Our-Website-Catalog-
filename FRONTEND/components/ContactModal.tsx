"use client";

import { useState } from "react";
import { X, Send, User, Mail, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulasi submit ke backend (sesuai request user)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({ name: "", email: "", phone: "", message: "" });
        }, 3000);
      } else {
        alert("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Positioning Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div className="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10 bg-white/80 backdrop-blur-md"
          >
            <X size={20} />
          </button>

          <div className="p-8 md:p-12">
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Pesan Terkirim!</h3>
                <p className="text-slate-500">Permintaan Anda telah kami terima. Admin akan segera menghubungi Anda via Email/WhatsApp.</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-3">
                    🚀 Join as Creator
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight">
                    Mau Jual <span className="text-red-600">Produk?</span>
                  </h3>
                  <p className="text-slate-500 mt-2">Isi form di bawah ini, admin kami akan segera membantu proses nitip project kamu!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        placeholder="Masukkan nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          required
                          type="email"
                          placeholder="email@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">No. HP / WA</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          required
                          type="tel"
                          placeholder="0812..."
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Pesan / Project</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                      <textarea 
                        required
                        placeholder="Halo Min, saya mau nitip project..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmitting ? "Mengirim..." : (
                      <>
                        Kirim Request <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
