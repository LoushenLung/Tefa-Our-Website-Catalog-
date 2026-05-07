import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Rocket, ShoppingCart, Globe, ArrowRight } from "lucide-react";

export default async function Home() {


  // ── VIEW UNTUK GUEST (LANDING PAGE) ────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider">
              <Rocket size={14} /> Future Digital Talent
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
              Inovasi Siswa <br />
              <span className="text-red-600 underline decoration-red-200 underline-offset-8">Siap Dipasarkan.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Jelajahi berbagai produk digital dan fisik hasil karya terbaik siswa SMK Telkom Malang yang dikembangkan dengan standar industri profesional.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/catalog"
                className="group flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
              >
                <ShoppingCart size={20} />
                Mulai Belanja
              </Link>
              <Link 
                href="/sign-in"
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
            <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100">
              <Image 
                src="/hero.png"
                alt="Product Showcase" 
                width={600} 
                height={600} 
                className="rounded-[2rem] object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-red-600 font-bold text-sm uppercase tracking-[0.2em]">Tentang Kami</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900">
              Apa itu Teaching Factory (TEFA)?
            </h3>
            <p className="text-slate-500 text-lg">
              Model pembelajaran di SMK Telkom Malang yang membawa atmosfer industri langsung ke dalam sekolah untuk mencetak lulusan kompeten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <ShieldCheck className="text-red-600" size={32} />, 
                title: "Standar Industri", 
                desc: "Setiap produk melalui proses quality control ketat yang setara dengan standar perusahaan teknologi global." 
              },
              { 
                icon: <Globe className="text-red-600" size={32} />, 
                title: "Akses Global", 
                desc: "Kami memasarkan produk hingga ke pasar internasional, membuktikan kualitas talenta lokal Moklet." 
              },
              { 
                icon: <ShoppingCart className="text-red-600" size={32} />, 
                title: "Dukung Karya Lokal", 
                desc: "Setiap pembelian Anda berkontribusi langsung pada pengembangan fasilitas pendidikan dan beasiswa siswa." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:border-red-100 transition-all duration-300">
                <div className="mb-4 p-3 bg-white w-fit rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-slate-500 text-sm">
           © 2026 TEFA MOKLET - SMK Telkom Malang. All rights reserved.
        </div>
      </footer>
    </div>
  );
}