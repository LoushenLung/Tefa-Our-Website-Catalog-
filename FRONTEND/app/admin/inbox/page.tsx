"use client";

import { useEffect, useState } from "react";
import { 
  Inbox, 
  Search, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Clock, 
  User,
  Loader2,
  X
} from "lucide-react";
import { getContacts, deleteContact } from "@/lib/actions/admin";

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await getContacts();
    setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteContact(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      fetchMessages();
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kotak Masuk</h2>
          <p className="text-sm text-slate-500">Pesan dari pengunjung dan calon pelanggan.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Message List */}
        <div className="flex w-1/3 flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari pesan..." 
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-red-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Inbox size={32} strokeWidth={1.5} />
                <p className="mt-2 text-xs">Tidak ada pesan</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => setSelectedMessage(msg)}
                  className={`cursor-pointer p-4 transition-all hover:bg-slate-50 ${
                    selectedMessage?.id === msg.id ? "bg-red-50/50 border-l-4 border-l-red-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${selectedMessage?.id === msg.id ? "text-red-700" : "text-slate-900"}`}>
                      {msg.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-600 line-clamp-1">{msg.subject}</p>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {selectedMessage ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-lg">
                    {selectedMessage.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedMessage.name}</h3>
                    <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleDelete(selectedMessage.id, e)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-6 rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Subjek</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{selectedMessage.subject || "No Subject"}</p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pesan</p>
                  <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95"
                >
                  <Mail size={16} />
                  Balas via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <div className="rounded-full bg-slate-50 p-6 mb-4">
                <MessageSquare size={48} strokeWidth={1} />
              </div>
              <p className="text-sm font-medium">Pilih pesan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
