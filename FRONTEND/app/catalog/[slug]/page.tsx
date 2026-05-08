"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  CheckCircle2, 
  Globe, 
  Github, 
  Share2,
  Loader2,
  ChevronRight
} from "lucide-react";
import { getProjectBySlug } from "@/lib/actions/public-catalog";
import { addToCart } from "@/lib/cart-store";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const data = await getProjectBySlug(slug as string);
      if (!data) {
        // router.push("/catalog"); // Or show 404
      } else {
        setProject(data);
      }
      setLoading(false);
    };
    fetchProject();
  }, [slug, router]);

  const handleAddToCart = () => {
    if (project) {
      addToCart({
        id: project.id,
        name: project.title,
        price: project.price,
        image: project.thumbnail,
      });
      alert(`${project.title} berhasil ditambahkan ke keranjang!`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 size={48} className="text-red-600 animate-spin" />
        <p className="text-slate-500 font-medium">Memuat detail inovasi...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Proyek Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-6">Maaf, proyek yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/catalog" className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold text-sm">
            <ArrowLeft size={18} />
            Kembali ke Katalog
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Share2 size={20} />
            </button>
            <Link href="/customer/cart" className="p-2 text-slate-400 hover:text-red-600 transition-colors relative">
              <ShoppingCart size={20} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/catalog" className="hover:text-red-600">Catalog</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">{project.category?.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-2xl shadow-slate-200/50">
              <Image 
                src={project.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"} 
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Gallery Thumbnails (Static for now based on mediaUrls if available) */}
            <div className="grid grid-cols-4 gap-4">
               <div className="aspect-square rounded-2xl bg-red-50 border-2 border-red-600 overflow-hidden cursor-pointer">
                  <Image src={project.thumbnail || ""} alt="thumb" width={100} height={100} className="object-cover w-full h-full" />
               </div>
               {/* Placeholders for more images */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                    <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-[10px]">No Image</div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4 w-fit">
               {project.category?.name}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
              {project.title}
            </h1>

            <div className="flex items-center gap-6 mb-8">
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={18} className={s <= Math.round(project.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{Number(project.averageRating).toFixed(1)}</span>
                  <span className="text-slate-400 text-sm">({project.totalReviews} Reviews)</span>
               </div>
               <div className="h-4 w-px bg-slate-200" />
               <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                  <CheckCircle2 size={18} />
                  Verified Product
               </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 mb-8">
               <div className="text-sm text-slate-500 mb-1">Harga Lisensi / Jasa</div>
               <div className="text-4xl font-black text-slate-900">{formatIDR(project.price)}</div>
               <p className="text-xs text-slate-400 mt-2">*Harga dapat berubah sewaktu-waktu tergantung kustomisasi.</p>
            </div>

            <p className="text-slate-600 leading-relaxed text-lg mb-8">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
               <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-red-200"
               >
                 <ShoppingCart size={24} />
                 Tambah ke Keranjang
               </button>
               <button className="flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 rounded-2xl font-black text-lg transition-all active:scale-95">
                 Konsultasi Dulu
               </button>
            </div>

            {/* Project Specs / Features */}
            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Project Highlights</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Globe size={18} />, label: "Live Preview", value: "Available" },
                    { icon: <Github size={18} />, label: "Source Code", value: "Included" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-red-100 transition-colors">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          {item.icon}
                       </div>
                       <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{item.label}</div>
                          <div className="text-sm font-bold text-slate-800">{item.value}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Recommended Section (Static Placeholder) */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Inovasi <span className="text-red-600">Terkait</span></h2>
            <Link href="/catalog" className="text-red-600 font-bold hover:underline">Lihat Semua &rarr;</Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-3xl bg-slate-100 border border-slate-200" />
            ))}
         </div>
      </section>
    </div>
  );
}
