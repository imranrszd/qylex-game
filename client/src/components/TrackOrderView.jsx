import { useState } from 'react';
import {
  Search,
  Zap,
  CreditCard,
  CheckCircle2,
  Gamepad2,
  ArrowRight,
  Package,
} from 'lucide-react';
// --- New Component: TrackOrderView ---
export default function TrackOrderView({ onBack }) {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderData({ id: orderId.toUpperCase(), status: 'success', game: "Mobile Legends", item: "Weekly Diamond Pass", price: 8.60, userId: "12345678 (1234)", date: "10 Feb 2026, 08:45 PM", payment: "Touch 'n Go" });
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 max-w-xl mx-auto px-4 min-h-screen">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-cyan-500 to-blue-600 mb-6 shadow-lg shadow-cyan-500/20"><Search className="w-8 h-8 text-white" /></div>
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Order</h1>
        <p className="text-slate-400">Enter your Order ID (e.g. QX-882190) or Phone Number to check status.</p>
      </div>
      <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 shadow-xl mb-8">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Order ID / Phone No.</label>
            <div className="relative">
              <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="QX-XXXXXX" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-cyan-500" />
              <Package className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
            </div>
          </div>
          <button type="submit" disabled={loading || !orderId} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-700 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25'}`}>
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Checking...</> : <>Check Status <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
      {orderData && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#1F2937] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-6 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"><CheckCircle2 className="w-6 h-6 text-white" /></div><div><p className="text-emerald-400 font-bold uppercase tracking-wider text-sm">Order Completed</p><p className="text-white font-bold text-xl">Thank you for your purchase!</p></div></div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50"><span className="text-slate-400 text-sm flex items-center gap-2"><Package className="w-4 h-4" /> Order ID</span><span className="text-white font-mono font-bold">{orderData.id}</span></div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50"><span className="text-slate-400 text-sm flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> Game</span><span className="text-white font-medium">{orderData.game}</span></div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50"><span className="text-slate-400 text-sm flex items-center gap-2"><Zap className="w-4 h-4" /> Item</span><span className="text-cyan-400 font-bold">{orderData.item}</span></div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50"><span className="text-slate-400 text-sm flex items-center gap-2"><CreditCard className="w-4 h-4" /> Price</span><span className="text-white font-bold">RM {orderData.price.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};