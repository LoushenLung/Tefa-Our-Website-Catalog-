"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ChevronLeft, CreditCard } from "lucide-react";
import { getCart, removeFromCart, saveCart, CartItem } from "@/lib/cart-store";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(getCart());

    const handleCartUpdate = () => {
      setCart(getCart());
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    saveCart(updated);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Keranjang Belanja</h1>
        <p className="text-slate-500">Tinjau project yang ingin kamu beli sebelum melakukan pembayaran.</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* List Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm group hover:border-red-100 transition-all">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                  <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">{item.name}</h3>
                  <p className="text-red-600 font-black">Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white hover:text-red-600 rounded-lg transition-all text-slate-400">
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white hover:text-red-600 rounded-lg transition-all text-slate-400">
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <Link href="/catalog" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-red-600 transition-all pt-4">
               <ChevronLeft size={18} /> Lanjut Belanja
            </Link>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-6">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Layanan</span>
                  <span className="font-bold text-slate-900">Rp 0</span>
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between text-lg">
                  <span className="font-black text-slate-900">Total Harga</span>
                  <span className="font-black text-red-600 underline decoration-red-100 decoration-4">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-100 flex items-center justify-center gap-2 transition-all active:scale-95 group">
                Checkout Sekarang
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <CreditCard size={12} /> Secure Checkout Guaranteed
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center text-center gap-6 bg-white rounded-[3rem] border border-slate-100 border-dashed">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <ShoppingBag size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Keranjang Kosong</h3>
            <p className="text-slate-500">Sepertinya kamu belum memilih project impianmu.</p>
          </div>
          <Link href="/catalog" className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95">
            Jelajahi Katalog
          </Link>
        </div>
      )}
    </div>
  );
}
