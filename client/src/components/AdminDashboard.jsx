import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Search, Zap, ShieldCheck, CreditCard, CheckCircle2, Trophy, Sword, Plus, Package, Key, Users,
  ShoppingBag, LayoutDashboard, Settings, LogOut, MoreHorizontal, TrendingUp, Activity, Filter,
  Download, Edit, Trash2, Save, Target, Lightbulb, ArrowUpRight
} from 'lucide-react';

import { ADMIN_STATS, ADMIN_ORDERS, ADMIN_CUSTOMERS } from '../data/MockData';
import { GAMES } from '../data/Others';

// --- Helpers & Logic ---
const CrownIcon = Trophy;
const operationalCost = 350;
const targetProfit = 10000;
const currentRevenue = 12450;
const estimatedMargin = 0.12;
const currentGrossProfit = currentRevenue * estimatedMargin;
const currentNetProfit = currentGrossProfit - operationalCost;
const profitProgress = Math.min((currentNetProfit / targetProfit) * 100, 100);
const profitGap = targetProfit - currentNetProfit;

const STRATEGY_INSIGHTS = [
  { title: "High Margin Opportunity", desc: "Joki Services have a 90% profit margin.", action: "Add 'Joki' popup on MLBB page.", impact: "Potential +RM 1,200/mo", icon: Sword, color: "text-purple-400", bg: "bg-purple-500/10" },
  { title: "Reseller Dormancy", desc: "12 Resellers inactive for 7 days.", action: "Send automated WhatsApp discount.", impact: "Recover ~RM 800 Revenue", icon: Users, color: "text-orange-400", bg: "bg-orange-500/10" },
  { title: "Whale Retention", desc: "Top 5 customers contribute 25% profit.", action: "Assign dedicated VIP support.", impact: "Secure RM 3,000/mo", icon: CrownIcon, color: "text-yellow-400", bg: "bg-yellow-500/10" }
];

// --- Sub-Components (Tabs) ---

const DashboardTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {ADMIN_STATS.map((stat, idx) => (
        <div key={idx} className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{stat.change}</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          <p className="text-sm text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
    <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6"><TrendingUp className="w-5 h-5 text-cyan-400" /> Revenue Trend</h3>
      <div className="h-48 flex items-end justify-between gap-2">
        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
          <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group">
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StrategyTab = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div className="bg-gradient-to-r from-slate-900 to-[#1F2937] rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
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
const ProductsTab = () => (

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">

    {GAMES.map((game) => (

      <div key={game.id} className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all">

        <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${game.image})` }}>



          <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-lg text-white backdrop-blur-md">

            <Edit className="w-4 h-4" />

          </div>

        </div>

        <div className="p-5">

          <div className="flex justify-between items-start mb-2">

            <h3 className="text-white font-bold text-lg">{game.name}</h3>

            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-600">{game.category}</span>

          </div>

          <p className="text-slate-400 text-sm mb-4">Publisher: {game.publisher}</p>

          <div className="flex gap-2">

            <button className="flex-1 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 border border-slate-600">Edit Price</button>

            <button className="flex-1 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500/20 border border-red-500/30">Disable</button>

          </div>

        </div>

      </div>

    ))}

  </div>

);

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
// --- MAIN DASHBOARD ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard/overview' },
    { id: 'strategy', label: 'Strategy', icon: TrendingUp, path: '/admin/dashboard/strategy' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/admin/dashboard/orders' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/dashboard/products' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/admin/dashboard/customers' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' },
  ];

  // Helper to format title based on current path
  const getHeaderTitle = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'strategy') return 'Strategy & Growth';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#0B1D3A] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-[#1F2937] rounded-2xl border border-slate-700 p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <NavLink
                    key={tab.id}
                    to={tab.path}
                    className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </NavLink>
                ))}
              </nav>
              <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 mt-8 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-white">{getHeaderTitle()} Overview</h1>
              <div className="flex gap-3">
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm border border-slate-700 hover:bg-slate-700 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export
                </button>
                {location.pathname.includes('products') && (
                  <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-500 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                )}
              </div>
            </div>

            <Routes>
              <Route path="overview" element={<DashboardTab />} />
              <Route path="strategy" element={<StrategyTab />} />
              <Route path="orders" element={<OrdersTab />} />
              <Route path="products" element={<ProductsTab />} />
              <Route path="customers" element={<CustomersTab />} />
              <Route path="settings" element={<SettingsTab />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;