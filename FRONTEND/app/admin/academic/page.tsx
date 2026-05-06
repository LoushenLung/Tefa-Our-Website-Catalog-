import { GraduationCap } from "lucide-react";

export default function AdminAcademicPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Data Akademik</h2>
          <p className="text-sm text-slate-500">Kelola master data siswa, jurusan, dan angkatan.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Action buttons could go here */}
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center text-slate-500">
        <GraduationCap className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <p>Halaman master data akademik sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}
