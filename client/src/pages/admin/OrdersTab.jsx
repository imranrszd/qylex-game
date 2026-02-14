import { Search } from 'lucide-react';

import { ADMIN_ORDERS } from '../../data/MockData';

const OrdersTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="flex gap-4">
      <div className="relative flex-1">
        <input type="text" placeholder="Search orders..." className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white" />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
      </div>
    </div>
    <div className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-400">
        <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
          <tr><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">User</th><th className="px-6 py-3">Status</th></tr>
        </thead>
        <tbody>
          {ADMIN_ORDERS.map((order, idx) => (
            <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="px-6 py-4 font-mono text-white">{order.id}</td>
              <td className="px-6 py-4">{order.user}</td>
              <td className="px-6 py-4"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{order.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersTab;