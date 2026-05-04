import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Rocket, ShieldCheck, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
      
      {/* SECTION 1: HERO (Modern & Clean) */}
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
                href="#products"
                className="group flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
              >
                <ShoppingCart size={20} />
                Mulai Belanja
              </Link>
              <Link 
                href="#about"
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                About TEFA
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100">
              <Image 
                src="/hero.png" // Pastikan gambar ini tersedia di folder public
                alt="Product Showcase" 
                width={600} 
                height={600} 
                className="rounded-[2rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT TEFA (Value Proposition) */}
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

      {/* SECTION 3: JURUSAN & SHOWCASE (Product Portfolio) */}
      <section id="majors" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-red-600 font-bold text-sm uppercase tracking-[0.2em]">Divisi Produksi</h2>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900">Ekosistem Digital Kami</h3>
            </div>
            <p className="text-slate-500 max-w-md">
              Tiga pilar keahlian utama yang menjadi motor penggerak inovasi di TEFA SMK Telkom Malang.
            </p>
          </div>

          <div className="space-y-20">
            {/* RPL - Software */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-red-600 font-bold uppercase text-xs tracking-widest bg-red-50 px-3 py-1 rounded-full">Web & App Development</span>
                  <h4 className="text-3xl font-black">Rekayasa Perangkat Lunak</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Divisi RPL fokus pada pengembangan solusi perangkat lunak yang *user-centric*. Siswa kami terlatih menggunakan *tech-stack* modern seperti Next.js, NestJS, dan Flutter.
                  </p>
                  <div className="space-y-4">
                    <p className="font-bold text-slate-900">Yang Telah Dibuat:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Sistem Absensi Real-time", "App PDAM", "Parking System", "E-Commerce Mockup"].map((tag) => (
                        <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href="/catalog?major=rpl" className="inline-flex items-center gap-2 text-red-600 font-bold hover:gap-4 transition-all">
                    Lihat Produk RPL <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-600 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                  <Image src="/rpl.png" alt="RPL Showcase" width={600} height={400} className="relative z-10 rounded-2xl shadow-lg object-cover" />
                </div>
              </div>
            </div>

            {/* TKJ - Infrastructure */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative group">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl -rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                  <Image src="/tkj.png" alt="TKJ Showcase" width={600} height={400} className="relative z-10 rounded-2xl shadow-lg object-cover" />
                </div>
                <div className="order-1 lg:order-2 space-y-6">
                  <span className="text-blue-600 font-bold uppercase text-xs tracking-widest bg-blue-50 px-3 py-1 rounded-full">Networking & IoT</span>
                  <h4 className="text-3xl font-black">Teknik Komputer Jaringan</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Membangun tulang punggung infrastruktur digital. Mulai dari instalasi server hingga solusi otomasi rumah berbasis IoT.
                  </p>
                  <div className="space-y-4">
                    <p className="font-bold text-slate-900">Yang Telah Dibuat:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Smart Home Controller", "Custom Linux Router", "Server Monitoring Tool"].map((tag) => (
                        <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href="/catalog?major=tkj" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                    Lihat Produk TKJ <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
              <span className="font-black text-xl tracking-tighter text-slate-900">TEFA MOKLET</span>
            </div>
            <p className="text-slate-400 text-sm italic">"The Future is Ours"</p>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 SMK Telkom Malang. Dibuat dengan dedikasi tinggi.
          </div>
          <div className="flex gap-6">
            {["Instagram", "Website", "LinkedIn"].map((social) => (
              <Link key={social} href="#" className="text-slate-400 hover:text-red-600 font-bold transition-colors">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}