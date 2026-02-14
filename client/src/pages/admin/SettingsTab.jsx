import { ShieldCheck, CreditCard, CheckCircle2, Key, Settings, Save } from 'lucide-react';

const SettingsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
    {/* General Settings */}
    <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Settings className="w-5 h-5 text-cyan-400" /> General Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Site Name</label>
          <input type="text" defaultValue="QylexGame" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Support WhatsApp</label>
          <input type="text" defaultValue="+60198313202" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Announcement Banner</label>
          <textarea rows="3" defaultValue="Double 11 Sale is LIVE! Get 50% Bonus Diamonds." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"></textarea>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-500 flex items-center gap-2 mt-4">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>

    {/* Payment & Security */}
    <div className="space-y-8">
      <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-400" /> Payment Gateways</h3>
        <div className="space-y-4">
          {['Touch \'n Go eWallet', 'GrabPay', 'FPX Banking', 'Credit Card (Stripe)'].map((gw, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
              <span className="text-white font-medium">{gw}</span>
              <button className="text-emerald-400"><CheckCircle2 className="w-6 h-6 fill-current opacity-80" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-red-400" /> Admin Security</h3>
        <button className="w-full py-3 bg-slate-800 text-white rounded-xl border border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-2">
          <Key className="w-4 h-4" /> Change Admin Password
        </button>
      </div>
    </div>
  </div>
);

export default SettingsTab;