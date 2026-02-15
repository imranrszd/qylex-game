import {
  Sword, Users, Target, Trophy
} from 'lucide-react';


// --- Helpers & Logic ---
const CrownIcon = Trophy;
const operationalCost = 350;
const targetProfit = 10000;
const currentRevenue = 12450;
const estimatedMargin = 0.12;
const currentGrossProfit = currentRevenue * estimatedMargin;
const currentNetProfit = currentGrossProfit - operationalCost;
const profitProgress = Math.min((currentNetProfit / targetProfit) * 100, 100);

const STRATEGY_INSIGHTS = [
  { title: "High Margin Opportunity", desc: "Joki Services have a 90% profit margin.", action: "Add 'Joki' popup on MLBB page.", impact: "Potential +RM 1,200/mo", icon: Sword, color: "text-purple-400", bg: "bg-purple-500/10" },
  { title: "Reseller Dormancy", desc: "12 Resellers inactive for 7 days.", action: "Send automated WhatsApp discount.", impact: "Recover ~RM 800 Revenue", icon: Users, color: "text-orange-400", bg: "bg-orange-500/10" },
  { title: "Whale Retention", desc: "Top 5 customers contribute 25% profit.", action: "Assign dedicated VIP support.", impact: "Secure RM 3,000/mo", icon: CrownIcon, color: "text-yellow-400", bg: "bg-yellow-500/10" }
];

const StrategyTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div className="bg-linear-to-r from-slate-900 to-[#1F2937] rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
      <h2 className="text-white text-2xl font-bold mb-1 flex items-center gap-2"><Target className="w-6 h-6 text-red-500" /> Road to RM 10k Net Profit</h2>
      <p className="text-4xl font-bold text-emerald-400 mt-4">RM {currentNetProfit.toLocaleString()}</p>
      <div className="h-4 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${profitProgress}%` }}></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STRATEGY_INSIGHTS.map((insight, idx) => (
        <div key={idx} className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${insight.bg} ${insight.color}`}><insight.icon /></div>
          <h4 className="text-white font-bold mb-2">{insight.title}</h4>
          <p className="text-slate-400 text-sm">{insight.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default StrategyTab;