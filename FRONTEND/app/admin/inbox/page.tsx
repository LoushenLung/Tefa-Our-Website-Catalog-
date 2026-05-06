import { Inbox } from "lucide-react";

export default function AdminInboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kotak Masuk</h2>
          <p className="text-sm text-slate-500">Baca dan kelola pesan dari formulir kontak.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Action buttons could go here */}
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center text-slate-500">
        <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <p>Halaman kotak masuk pesan sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}
