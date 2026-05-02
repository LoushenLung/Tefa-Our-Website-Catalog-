import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-red-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">T</div>
              <span className="font-bold text-xl tracking-tighter">TEFA <span className="text-red-500">MOKLET</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link href="#about" className="hover:text-white transition-colors">About</Link>
              <Link href="#tefa" className="hover:text-white transition-colors">TEFA</Link>
              <Link href="#majors" className="hover:text-white transition-colors">Majors</Link>
              <Link href="#products" className="hover:text-white transition-colors">Products</Link>
            </div>
            <Link 
              href="/sign-in"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="SMK Telkom Malang Hero"
            fill
            className="object-cover opacity-60 scale-105 animate-pulse-slow"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
            Teaching Factory <br />
            <span className="text-red-600">SMK Telkom Malang</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Menghubungkan dunia pendidikan dengan standar industri global. 
            Mencetak talenta digital masa depan melalui pengalaman kerja nyata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#products"
              className="px-8 py-4 bg-red-600 rounded-xl font-bold text-lg hover:bg-red-700 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95"
            >
              Lihat Karya Siswa
            </Link>
            <Link 
              href="#about"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95"
            >
              Tentang Kami
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-sm font-bold tracking-widest uppercase">
                School of Global Digitalent
              </div>
              <h2 className="text-4xl font-bold tracking-tight">SMK Telkom Malang</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                SMK Telkom Malang adalah sekolah kejuruan TI pertama di Indonesia. 
                Dikenal dengan sebutan "Moklet", sekolah ini berkomitmen melahirkan 
                lulusan unggul di bidang teknologi informasi dan komunikasi yang 
                siap bersaing di kancah global.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-3xl font-black text-red-500 mb-1">#1</div>
                  <div className="text-sm text-zinc-500 font-medium uppercase tracking-tighter">Pioneer TI</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-3xl font-black text-red-500 mb-1">90%+</div>
                  <div className="text-sm text-zinc-500 font-medium uppercase tracking-tighter">Serapan Industri</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image src="/hero.png" alt="Moklet Campus" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TEFA Explanation */}
      <section id="tefa" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Konsep Teaching Factory</h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-12">
            TEFA (Teaching Factory) adalah model pembelajaran berbasis produksi/jasa yang mengacu pada standar dan prosedur yang berlaku di industri. Siswa tidak hanya belajar teori, tetapi langsung mengerjakan proyek nyata dari mitra industri kami.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              { title: "Kualitas Industri", desc: "Produk yang dihasilkan memenuhi standar pasar profesional." },
              { title: "Mindset Kerja", desc: "Membentuk etos kerja, kedisiplinan, dan tanggung jawab." },
              { title: "Kolaborasi Mitra", desc: "Bekerja sama langsung dengan perusahaan IT terkemuka." }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors">
                <h3 className="text-xl font-bold mb-2 text-red-500">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Majors & Products Section */}
      <section id="majors" className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Karya & Produk Unggulan</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Jelajahi berbagai inovasi hasil karya siswa-siswi terbaik dari tiga jurusan utama di SMK Telkom Malang.
            </p>
          </div>

          <div className="space-y-24">
            {/* RPL */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                <Image src="/rpl.png" alt="RPL Product" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="text-red-500 font-bold tracking-widest uppercase text-sm">Rekayasa Perangkat Lunak</div>
                <h3 className="text-3xl font-bold">Software & Web Development</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Siswa RPL menciptakan solusi perangkat lunak mulai dari aplikasi mobile, platform e-learning, hingga sistem manajemen perusahaan yang kompleks.
                </p>
                <ul className="space-y-3 text-zinc-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Fullstack Web Applications
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Android & iOS Apps
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Enterprise Resource Planning (ERP)
                  </li>
                </ul>
              </div>
            </div>

            {/* TKJ */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="text-blue-500 font-bold tracking-widest uppercase text-sm">Teknik Komputer Jaringan</div>
                <h3 className="text-3xl font-bold">Networking & IoT Solutions</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Mengembangkan infrastruktur jaringan yang handal dan inovasi Internet of Things (IoT) untuk smart city dan otomasi industri.
                </p>
                <ul className="space-y-3 text-zinc-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Smart Home Systems
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Cyber Security Audits
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Cloud Computing Infrastructure
                  </li>
                </ul>
              </div>
              <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                <Image src="/tkj.png" alt="TKJ Product" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>

            {/* PG */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                <Image src="/pg.png" alt="PG Product" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="text-purple-500 font-bold tracking-widest uppercase text-sm">Pengembangan Gim</div>
                <h3 className="text-3xl font-bold">Game Development & Art</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Menghidupkan imajinasi melalui pengembangan game 2D/3D, aset visual yang memukau, serta pengalaman interaktif yang imersif.
                </p>
                <ul className="space-y-3 text-zinc-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Indie Game Titles
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> 3D Modeling & Animation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> VR/AR Experiences
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">T</div>
            <span className="font-bold text-xl tracking-tighter">TEFA MOKLET</span>
          </div>
          <div className="text-zinc-500 text-sm">
            © 2026 SMK Telkom Malang. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">Website</a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

