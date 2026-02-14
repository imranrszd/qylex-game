import { Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo, useRef } from 'react';

import {
  Trophy, Plus, Package, Users, X, PlusCircle, ShoppingBag, LayoutDashboard, Settings, LogOut, TrendingUp, Download
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
const AdminDashboard = ({ games, setGames }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const basePath = '/admin/dashboard';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: `${basePath}/overview` },
    { id: 'strategy', label: 'Strategy', icon: TrendingUp, path: `${basePath}/strategy` },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: `${basePath}/orders` },
    { id: 'products', label: 'Products', icon: Package, path: `${basePath}/products` },
    { id: 'customers', label: 'Customers', icon: Users, path: `${basePath}/customers` },
    { id: 'settings', label: 'Settings', icon: Settings, path: `${basePath}/settings` },
  ];

  // Helper to format title based on current path
  const getHeaderTitle = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'strategy') return 'Strategy & Growth';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };


  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    publisher: '',
    category: 'Mobile Games',
    type: 'topup',
    platform: 'mobile',
    image: '',
    icon: '🎮'
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: Math.floor(Math.random() * 100000)
    };
    setGames([...games, productToAdd]);
    setIsAddProductModalOpen(false);
    setNewProduct({
      name: '',
      publisher: '',
      category: 'Mobile Games',
      type: 'topup',
      platform: 'mobile',
      image: ''
    });
    alert("Product added successfully!");
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
                    to={`../${tab.path}`}
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
                  <button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-500 flex items-center gap-2"
                  >
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
              <Route path="products/*" element={<ProductsTab games={games} setGames={setGames} />} />
              <Route path="customers/*" element={<CustomersTab />} />
              <Route path="settings/*" element={<SettingsTab />} />
            </Routes>

          </div>
          {/* ADD PRODUCT MODAL */}
          {isAddProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#131122] rounded-2xl p-6 w-full max-w-lg border border-[#282442] shadow-2xl relative">
                <button onClick={() => setIsAddProductModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-[#1d1936]"><X className="w-5 h-5" /></button>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <PlusCircle className="w-6 h-6 text-cyan-400" /> Add New Product
                </h2>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                        placeholder="e.g. Valorant"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Publisher</label>
                      <input
                        type="text"
                        required
                        value={newProduct.publisher}
                        onChange={e => setNewProduct({ ...newProduct, publisher: e.target.value })}
                        className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                        placeholder="e.g. Riot Games"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                      >
                        <option>MOBA</option>
                        <option>FPS</option>
                        <option>Battle Royale</option>
                        <option>RPG</option>
                        <option>Sandbox</option>
                        <option>Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Platform</label>
                      <select
                        value={newProduct.platform}
                        onChange={e => setNewProduct({ ...newProduct, platform: e.target.value })}
                        className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                      >
                        <option value="mobile">Mobile</option>
                        <option value="pc">PC</option>
                        <option value="service">Service</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Type</label>
                    <select
                      value={newProduct.type}
                      onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                      className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                    >
                      <option value="topup">Direct Top Up (ID)</option>
                      <option value="login">Login Method</option>
                      <option value="joki">Joki / Boosting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Image URL (Optional)</label>
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave empty for default gradient.</p>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="flex-1 py-3 bg-[#1d1936] text-slate-300 rounded-xl text-sm font-bold hover:bg-[#282442]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-500"
                    >
                      Create Product
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;