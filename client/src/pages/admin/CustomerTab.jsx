import { MoreHorizontal } from 'lucide-react';

import { ADMIN_CUSTOMERS } from '../../data/MockData';


const CustomersTab = () => (
  <div className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-400">
        <thead className="text-xs text-slate-300 uppercase bg-slate-800">
          <tr>
            <th className="px-6 py-3">Customer Name</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Total Spent</th>
            <th className="px-6 py-3">Total Orders</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {ADMIN_CUSTOMERS.map((cust, idx) => (
            <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">{cust.name.charAt(0)}</div>
                {cust.name}
              </td>
              <td className="px-6 py-4 font-mono">{cust.phone}</td>
              <td className="px-6 py-4 text-emerald-400 font-bold">{cust.spent}</td>
              <td className="px-6 py-4">{cust.orders}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${cust.status === 'VIP' ? 'bg-purple-500/10 text-purple-400' :
                  cust.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                  {cust.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-slate-400 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


export default CustomersTab;