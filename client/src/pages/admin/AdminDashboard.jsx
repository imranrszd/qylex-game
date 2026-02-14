import { Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  ShieldCheck, CreditCard, CheckCircle2, Trophy, Plus, Package, Key, Users,
  ShoppingBag, LayoutDashboard, Settings, LogOut, TrendingUp, Download, Save
} from 'lucide-react';

import { ADMIN_STATS } from '../../data/MockData';
import StrategyTab from './StrategyTab';
import OrdersTab from './OrdersTab';
import ProductsTab from './ProductsTab';
import CustomersTab from './CustomerTab';
import SettingsTab from './SettingsTab';

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
            <div className="absolute bottom-0 w-full bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: 'overview' },
    { id: 'strategy', label: 'Strategy', icon: TrendingUp, path: 'strategy' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: 'orders' },
    { id: 'products', label: 'Products', icon: Package, path: 'products' },
    { id: 'customers', label: 'Customers', icon: Users, path: 'customers' },
    { id: 'settings', label: 'Settings', icon: Settings, path: 'settings' },
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
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<DashboardTab />} />
              <Route path="strategy" element={<StrategyTab />} />
              <Route path="orders/*" element={<OrdersTab />} />
              <Route path="products/*" element={<ProductsTab />} />
              <Route path="customers/*" element={<CustomersTab />} />
              <Route path="settings/*" element={<SettingsTab />} />
            </Routes>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;