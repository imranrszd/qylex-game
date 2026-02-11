import { MessageCircle } from 'lucide-react';

// --- NEW STRATEGY 2: FLOATING WHATSAPP BUTTON ---
export default function WhatsAppFloat() {
  return (
    <a href="https://wa.me/60198313202" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/40 transition-all hover:scale-110 flex items-center justify-center group">
      <MessageCircle className="w-7 h-7 fill-current" />
      <span className="absolute right-full mr-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Chat with Q Store</span>
    </a>
  );
}