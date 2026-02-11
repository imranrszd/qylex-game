import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Zap,
  ShieldCheck,
  Headphones,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Smartphone,
  CheckCircle2,
  Trophy,
  Flame,
  Star,
  Sword,
  Lock,
  Minus,
  Plus,
  AlertTriangle,
  Monitor,
  Gamepad2,
  Ticket,
  ArrowRight,
  Package,
  Clock,
  Calendar,
  Copy,
  User,
  Key,
  Award,
  Users,
  Wallet,
  ThumbsUp,
  MessageCircle,
  ShoppingBag,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Activity,
  Filter,
  Download,
  Edit,
  Trash2,
  Save,
  Target,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';

// --- Configuration & Data ---

const THEME = {
  colors: {
    primary: '#0B1D3A',    // Midnight Blue
    secondary: '#2563EB',  // Electric Blue
    accent: '#22D3EE',     // Neon Cyan
    neutral: '#F8FAFC',    // Soft White
    panel: '#1F2937',      // Slate Gray
    success: '#10B981',    // Emerald
  }
};

const SITE_CONFIG = {
  whatsapp: "60198313202", // Q Store Number
  adminPin: "1234" // Simple PIN for MVP Protection
};

const PROMO_SLIDES = [
  {
    id: 1,
    title: "Double 11 Mega Sale",
    description: "Get up to 50% Bonus Diamonds on all Mobile Legends top-ups this weekend only!",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
    color: "from-blue-600 to-purple-600",
    cta: "Top Up Now"
  },
  {
    id: 2,
    title: "Roblox Restocked",
    description: "Premium Robux packs now available via Login method. Safer, cheaper, and reliable.",
    image: "https://images.unsplash.com/photo-1628238202528-912b704c7712?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
    color: "from-red-600 to-orange-600",
    cta: "Buy Robux"
  },
  {
    id: 3,
    title: "Joki Service Available",
    description: "Stuck in Epic? Let our Pro Players boost your rank. Secure, Fast, and Win Rate guaranteed.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2671&ixlib=rb-4.0.3",
    color: "from-purple-600 to-pink-600",
    cta: "Boost Rank"
  }
];

// TYPES: 'topup' (ID only), 'joki' (Rank Calc), 'login' (Account Credentials)
const GAMES = [
  { id: 1, name: "Mobile Legends", publisher: "Moonton", category: "MOBA", type: "topup", platform: "mobile", image: "linear-gradient(135deg, #4f46e5, #06b6d4)", icon: "⚔️" },
  { id: 100, name: "MLBB (Via Login)", publisher: "Moonton", category: "MOBA", type: "login", platform: "mobile", image: "linear-gradient(135deg, #3b82f6, #8b5cf6)", icon: "🔑" },
  { id: 101, name: "Roblox", publisher: "Roblox Corp", category: "Sandbox", type: "login", platform: "mobile", image: "linear-gradient(135deg, #ef4444, #f97316)", icon: "🟥" },
  { id: 99, name: "MLBB Rank Boost", publisher: "Qylex Pro Team", category: "Service", type: "joki", platform: "service", image: "linear-gradient(135deg, #7c3aed, #db2777)", icon: "🚀" },
  { id: 2, name: "PUBG Mobile", publisher: "Tencent", category: "Battle Royale", type: "topup", platform: "mobile", image: "linear-gradient(135deg, #ea580c, #facc15)", icon: "🔫" },
  { id: 3, name: "Valorant", publisher: "Riot Games", category: "FPS", type: "topup", platform: "pc", image: "linear-gradient(135deg, #dc2626, #f87171)", icon: "🎯" },
  { id: 4, name: "Genshin Impact", publisher: "HoYoverse", category: "RPG", type: "topup", platform: "mobile", image: "linear-gradient(135deg, #9333ea, #c084fc)", icon: "✨" },
];

// --- ADMIN MOCK DATA ---
const ADMIN_STATS = [
  { label: "Total Revenue", value: "RM 12,450", change: "+15%", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Orders Today", value: "145", change: "+8%", icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Joki Queue", value: "12 Pending", change: "-2", icon: Sword, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Active Resellers", value: "48", change: "+3", icon: Users, color: "text-orange-400", bg: "bg-orange-500/10" },
];

const ADMIN_ORDERS = [
  { id: "QX-8812", user: "Aiman Hakim", item: "Weekly Pass", price: "RM 8.60", status: "Success", date: "Just now", method: "TNG" },
  { id: "QX-8811", user: "Sarah L.", item: "1155 Diamonds", price: "RM 71.00", status: "Processing", date: "5 mins ago", method: "FPX" },
  { id: "QX-8810", user: "GamingKing", item: "Epic -> Legend", price: "RM 45.00", status: "In Progress", date: "1 hour ago", method: "Grab" },
  { id: "QX-8809", user: "Wong Wei", item: "500 Robux", price: "RM 19.90", status: "Success", date: "2 hours ago", method: "TNG" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
];

const ADMIN_CUSTOMERS = [
  { id: 1, name: "Aiman Hakim", phone: "012-3456789", spent: "RM 450.00", orders: 12, status: "Active" },
  { id: 2, name: "Sarah L.", phone: "017-8889999", spent: "RM 1,200.50", orders: 35, status: "VIP" },
  { id: 3, name: "GamingKing", phone: "019-1112222", spent: "RM 85.00", orders: 4, status: "Active" },
  { id: 4, name: "Wong Wei", phone: "011-2223333", spent: "RM 19.90", orders: 1, status: "New" },
  { id: 5, name: "Siti Nur", phone: "013-4445555", spent: "RM 380.00", orders: 8, status: "Active" },
];

// --- Helpers ---
const CrownIcon = Trophy; // Fallback

const STRATEGY_INSIGHTS = [
  {
    title: "High Margin Opportunity",
    desc: "Joki Services have a 90% profit margin but only make up 5% of total orders.",
    action: "Add a 'Joki' popup on the MLBB Diamond checkout page.",
    impact: "Potential +RM 1,200/mo",
    icon: Sword,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    title: "Reseller Dormancy",
    desc: "12 Resellers haven't purchased stock in the last 7 days.",
    action: "Send an automated WhatsApp broadcast with a 2% discount code.",
    impact: "Recover ~RM 800 Revenue",
    icon: Users,
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  },
  {
    title: "Whale Retention",
    desc: "Top 5 customers contribute 25% of total profit.",
    action: "Assign a dedicated support agent to these 5 VIPs.",
    impact: "Secure RM 3,000/mo Recurring",
    icon: CrownIcon,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10"
  }
];

// --- FAKE REVIEW DATA ---
const REVIEWS_DATA = [
  { id: 1, user: "Amirul H.", text: "Mantap bossku! Diamonds masuk dalam 5 saat je. Trusted seller!", rating: 5, date: "5 mins ago", tag: "Mobile Legends" },
  { id: 2, user: "Sarah L.", text: "First time beli sini, ingatkan scam rupanya legit. Will repeat soon!", rating: 5, date: "12 mins ago", tag: "Mobile Legends" },
  { id: 3, user: "Gary T.", text: "Fast delivery, cheaper than Codashop. Recommended.", rating: 5, date: "25 mins ago", tag: "Valorant" },
  { id: 4, user: "Irfan Gaming", text: "Joki padu mat! Winstreak 10 game straight. Player pro gila.", rating: 5, date: "1 hour ago", tag: "MLBB Rank Boost" },
  { id: 5, user: "Siti A.", text: "Robux murah gila banding kedai lain. Anak buah happy dapat skin baru.", rating: 5, date: "2 hours ago", tag: "Roblox" },
  { id: 6, user: "Kevin K.", text: "PUBG UC received instantly. Safe and secure payment via TNG.", rating: 4, date: "3 hours ago", tag: "PUBG Mobile" },
  { id: 7, user: "Aiman_X", text: "Servis laju, admin reply WhatsApp pun cepat. Terbaik Qylex!", rating: 5, date: "4 hours ago", tag: "MLBB (Via Login)" },
  { id: 8, user: "Nurul Izzah", text: "Senang je nak topup, tak payah pening2. Masuk ID terus dapat.", rating: 5, date: "Yesterday", tag: "Genshin Impact" },
];

// --- FAKE NOTIFICATION DATA ---
const FAKE_NOTIFICATIONS = [
  { user: "Aiman**", item: "Weekly Diamond Pass", time: "Just now" },
  { user: "Nurul**", item: "1155 Diamonds", time: "2 mins ago" },
  { user: "Haziq**", item: "Epic Rank Boost", time: "1 min ago" },
  { user: "Wong**", item: "500 Robux", time: "Just now" },
  { user: "Irfan**", item: "Valorant Points", time: "5 mins ago" },
  { user: "Sarah**", item: "Twilight Pass", time: "Just now" }
];

// --- FAQ DATA ---
const FAQ_ITEMS = [
  { q: "Is it safe to give my password for Joki/Login Topup?", a: "Yes. QylexGame is an SSM registered company (202503226171). We use AES-256 encryption and our Joki players are verified professionals. We recommend changing your password after the service is completed." },
  { q: "How long does the top-up take?", a: "For direct ID top-ups (MLBB, PUBG, Valorant), it is instant (1-5 seconds). For Login methods and Joki services, it depends on the queue, usually 5-10 minutes for top-ups and 1-3 days for rank boosting." },
  { q: "What payment methods do you accept?", a: "We accept all major Malaysian payment methods including Touch 'n Go eWallet, GrabPay, DuitNow QR, and FPX Online Banking." },
  { q: "Can I request a refund?", a: "Refunds are processed if the item is out of stock or if the service cannot be completed. Please contact our WhatsApp support for assistance." }
];

// --- PACKAGE DATA ---

const PACKAGES_MLBB = [
  { id: 'wdp', name: "Weekly Diamond Pass", bonus: "x1", price: 8.60, original: 9.30, tag: "BEST SELLER" },
  { id: 'd14', name: "14 Diamonds", bonus: "13 + 1 Bonus", price: 1.00, original: 1.10, tag: null },
  { id: 'd284', name: "284 Diamonds", bonus: "254 + 30 Bonus", price: 19.90, original: 21.20, tag: "HOT" },
  { id: 'tp', name: "Twilight Pass", bonus: "Instant", price: 38.00, original: 45.00, tag: "PREMIUM" },
  { id: 'd750', name: "750 Diamonds", bonus: "675 + 75 Bonus", price: 52.50, original: 55.00, tag: null },
  { id: 'd2976', name: "2976 Diamonds", bonus: "2501 + 475 Bonus", price: 195.00, original: 212.00, tag: "WHALE" },
];

const PACKAGES_MLBB_LOGIN = [
  { id: 'ml_log_1155', name: "1155 Diamonds", bonus: "Process 1-3 Hours", price: 71.00, original: 80.00, tag: "PROMO" },
  { id: 'ml_log_1765', name: "1765 Diamonds", bonus: "Process 1-3 Hours", price: 106.00, original: 120.00, tag: null },
  { id: 'ml_log_2975', name: "2975 Diamonds", bonus: "Process 1-3 Hours", price: 174.00, original: 190.00, tag: "HOT" },
  { id: 'ml_log_3540', name: "3540 Diamonds", bonus: "Process 1-3 Hours", price: 212.00, original: 230.00, tag: null },
  { id: 'ml_log_6000', name: "6000 Diamonds", bonus: "Process 1-3 Hours", price: 343.00, original: 380.00, tag: "BIG SAVING" },
  { id: 'ml_log_18000', name: "18,000 Diamonds", bonus: "Manual Process", price: 1030.00, original: 1100.00, tag: "WHALE" },
];

const PACKAGES_ROBLOX = [
  { id: 'rbx_80', name: "80 Robux", bonus: "Small Pack", price: 4.50, original: 5.00, tag: null },
  { id: 'rbx_160', name: "160 Robux", bonus: "Small Pack", price: 8.50, original: 10.00, tag: null },
  { id: 'rbx_500', name: "500 Robux", bonus: "Normal Pack", price: 19.90, original: 25.00, tag: "POPULAR" },
  { id: 'rbx_1000', name: "1000 Robux", bonus: "Normal Pack", price: 39.90, original: 45.00, tag: "HOT" },
  { id: 'rbx_2000', name: "2000 Robux", bonus: "Normal Pack", price: 78.90, original: 85.00, tag: null },
  { id: 'rbx_prem_450', name: "450 + Premium", bonus: "Premium Pack", price: 19.90, original: 25.00, tag: "PREMIUM" },
  { id: 'rbx_prem_2100', name: "2100 + Premium", bonus: "Premium Pack", price: 79.90, original: 90.00, tag: "BEST VALUE" },
];

const JOKI_PACKAGES = [
  { id: 'j_gm', name: "Grandmaster Rank", unit: "Per Star", price: 3.50, original: 5.00, tag: "FAST" },
  { id: 'j_epic', name: "Epic Rank", unit: "Per Star", price: 5.00, original: 7.00, tag: "POPULAR" },
  { id: 'j_legend', name: "Legend Rank", unit: "Per Star", price: 6.50, original: 9.00, tag: "HOT" },
  { id: 'j_mythic', name: "Mythic Grading", unit: "10 Matches", price: 50.00, original: 65.00, tag: "PLACEMENT" },
];

// --- JOKI LOGIC ENGINE ---
const RANK_CONF = {
  'Grandmaster': { starsPerTier: 5, price: 3.50, tiers: ['V', 'IV', 'III', 'II', 'I'] },
  'Epic': { starsPerTier: 5, price: 5.00, tiers: ['V', 'IV', 'III', 'II', 'I'] },
  'Legend': { starsPerTier: 5, price: 6.50, tiers: ['V', 'IV', 'III', 'II', 'I'] },
  'Mythic': { starsPerTier: 25, price: 10.00, tiers: ['Grading', 'Honor', 'Glory'] }
};
const RANK_ORDER = ['Grandmaster', 'Epic', 'Legend', 'Mythic'];

const PAYMENTS = [
  { id: 'tng', name: "Touch 'n Go", type: "E-Wallet", fee: "0%", icon: "🔵" },
  { id: 'grab', name: "GrabPay", type: "E-Wallet", fee: "0%", icon: "🟢" },
  { id: 'fpx', name: "FPX Banking", type: "Direct Debit", fee: "RM 1.00", icon: "🏦" },
];

const CATEGORIES = [
  { id: 'all', label: 'All Games', icon: Gamepad2 },
  { id: 'mobile', label: 'Mobile Games', icon: Smartphone },
  { id: 'pc', label: 'PC Games', icon: Monitor },
  { id: 'vouchers', label: 'Vouchers', icon: Ticket },
  { id: 'service', label: 'Services', icon: Sword },
];

// --- Components ---

const Navbar = ({ onViewChange, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-700/50 backdrop-blur-md bg-[#0B1D3A]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onViewChange('home')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">Qylex<span className="text-cyan-400">Game</span></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Premium TopUp</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => onViewChange('home')} className={`${currentView === 'home' ? 'text-cyan-400' : 'text-slate-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Home</button>
              <button onClick={() => onViewChange('track')} className={`${currentView === 'track' ? 'text-cyan-400' : 'text-slate-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}>Track Order</button>
              <button onClick={() => { }} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Reseller Rates</button>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => onViewChange('admin_login')} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium border border-slate-700 transition-all flex items-center gap-2">
              <Lock className="w-3 h-3" /> Admin
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#0B1D3A] border-b border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { onViewChange('home'); setIsOpen(false) }} className="text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Home</button>
            <button onClick={() => { onViewChange('track'); setIsOpen(false) }} className="text-slate-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Track Order</button>
            <button onClick={() => { onViewChange('admin_login'); setIsOpen(false) }} className="text-slate-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Admin Login</button>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- ADMIN LOGIN GATE ---
const AdminLogin = ({ onSuccess, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === SITE_CONFIG.adminPin) {
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
      <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
        <p className="text-slate-400 mb-6 text-sm">Enter security PIN to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="Enter PIN"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-white tracking-widest text-lg focus:outline-none focus:border-cyan-500"
            maxLength={4}
          />
          {error && <p className="text-red-400 text-xs animate-pulse">Invalid PIN code</p>}
          <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all">Unlock Dashboard</button>
          <button type="button" onClick={onBack} className="text-slate-500 text-sm hover:text-white">Return Home</button>
        </form>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- STRATEGY CALCULATIONS ---
  const operationalCost = 350; // RM 350/mo
  const targetProfit = 10000; // RM 10k/mo

  // Dummy Calculation for Strategy Tab
  const currentRevenue = 12450;
  const estimatedMargin = 0.12; // 12% avg margin
  const currentGrossProfit = currentRevenue * estimatedMargin; // ~RM 1,494
  const currentNetProfit = currentGrossProfit - operationalCost; // ~RM 1,144

  const profitProgress = Math.min((currentNetProfit / targetProfit) * 100, 100);
  const profitGap = targetProfit - currentNetProfit;

  return (
    <div className="min-h-screen bg-[#0B1D3A] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-[#1F2937] rounded-2xl border border-slate-700 p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Qylex Admin</h2>
                  <p className="text-xs text-slate-400">v1.0.0 (Beta)</p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'strategy', label: 'Strategy & Growth', icon: TrendingUp },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'customers', label: 'Customers', icon: Users },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-slate-700">
                <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-white capitalize">{activeTab.replace('strategy', 'Strategy & Growth')} Overview</h1>
              <div className="flex gap-3">
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm border border-slate-700 hover:bg-slate-700 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Report
                </button>
                {activeTab === 'products' && (
                  <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-500 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                )}
              </div>
            </div>

            {/* STRATEGY TAB (New) */}
            {activeTab === 'strategy' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

                {/* 1. Road to 10k Card */}
                <div className="bg-gradient-to-r from-slate-900 to-[#1F2937] rounded-3xl p-8 border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

                  <div className="flex flex-col md:flex-row justify-between items-end mb-6 relative z-10">
                    <div>
                      <h2 className="text-white text-2xl font-bold mb-1 flex items-center gap-2">
                        <Target className="w-6 h-6 text-red-500" /> Road to RM 10k Net Profit
                      </h2>
                      <p className="text-slate-400">Monthly Operational Cost: <span className="text-red-400 font-mono">RM {operationalCost}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm mb-1">Current Net Profit</p>
                      <p className="text-4xl font-bold text-emerald-400 font-mono">RM {currentNetProfit.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative z-10">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>RM 0</span>
                      <span>Target: RM 10,000</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000"
                        style={{ width: `${profitProgress}%` }}
                      ></div>
                    </div>
                    <div className="mt-4 flex gap-4 text-sm">
                      <div className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                        Gap: RM {profitGap.toLocaleString()}
                      </div>
                      <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                        {profitProgress.toFixed(1)}% Achieved
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Strategic Insights Cards */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> AI Strategic Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STRATEGY_INSIGHTS.map((insight, idx) => (
                      <div key={idx} className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${insight.bg} ${insight.color}`}>
                            <insight.icon className="w-6 h-6" />
                          </div>
                          <button className="text-slate-500 hover:text-white"><ArrowUpRight className="w-5 h-5" /></button>
                        </div>
                        <h4 className="text-white font-bold mb-2">{insight.title}</h4>
                        <p className="text-slate-400 text-sm mb-4 min-h-[40px]">{insight.desc}</p>
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Recommended Action:</p>
                          <p className="text-emerald-400 text-xs font-semibold">{insight.action}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                          <span className="text-xs text-slate-500">Est. Impact</span>
                          <span className="text-xs font-bold text-white bg-emerald-500/20 px-2 py-1 rounded">{insight.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Data Reframing (Profit vs Volume) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Profit Generators (Margin Analysis)</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400"><Sword className="w-4 h-4" /></div>
                          <div>
                            <p className="text-white text-sm font-bold">Joki Services</p>
                            <p className="text-xs text-slate-500">Margin: <span className="text-emerald-400">40%</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">RM 4,500</p>
                          <p className="text-xs text-slate-500">Profit Contrib.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400"><Zap className="w-4 h-4" /></div>
                          <div>
                            <p className="text-white text-sm font-bold">Small Packs (diamonds)</p>
                            <p className="text-xs text-slate-500">Margin: <span className="text-orange-400">5%</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">RM 800</p>
                          <p className="text-xs text-slate-500">Profit Contrib.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" /> Operational Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-4 rounded-xl text-center">
                        <p className="text-slate-400 text-xs mb-1">Cost Efficiency</p>
                        <p className="text-2xl font-bold text-white">92%</p>
                        <span className="text-[10px] text-emerald-400">Excellent</span>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl text-center">
                        <p className="text-slate-400 text-xs mb-1">Daily Profit Need</p>
                        <p className="text-2xl font-bold text-white">RM 333</p>
                        <span className="text-[10px] text-slate-500">To hit RM10k</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ADMIN_STATS.map((stat, idx) => (
                    <div key={idx} className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue Chart (Mock) */}
                <div className="bg-[#1F2937] p-6 rounded-2xl border border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" /> Revenue Trend</h3>
                    <select className="bg-slate-900 text-white text-xs border border-slate-700 rounded px-2 py-1">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                      <div key={i} className="w-full bg-slate-800 rounded-t-lg relative group">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${h}%` }}></div>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded transition-opacity">RM {h * 100}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-cyan-400 text-sm hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                      <thead className="text-xs text-slate-300 uppercase bg-slate-800">
                        <tr>
                          <th className="px-6 py-3">Order ID</th>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Item</th>
                          <th className="px-6 py-3">Price</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ADMIN_ORDERS.slice(0, 5).map((order, idx) => (
                          <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono font-medium text-white">{order.id}</td>
                            <td className="px-6 py-4">{order.user}</td>
                            <td className="px-6 py-4">{order.item}</td>
                            <td className="px-6 py-4 text-white font-bold">{order.price}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' :
                                  order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-orange-500/10 text-orange-400'
                                }`}>
                                {order.status}
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
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input type="text" placeholder="Search Order ID, User..." className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-cyan-500" />
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                  </div>
                  <button className="bg-[#1F2937] border border-slate-700 text-slate-300 px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800"><Filter className="w-5 h-5" /> Filter</button>
                </div>

                <div className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                      <thead className="text-xs text-slate-300 uppercase bg-slate-800">
                        <tr>
                          <th className="px-6 py-3">Order ID</th>
                          <th className="px-6 py-3">User</th>
                          <th className="px-6 py-3">Item</th>
                          <th className="px-6 py-3">Method</th>
                          <th className="px-6 py-3">Price</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...ADMIN_ORDERS, ...ADMIN_ORDERS].map((order, idx) => ( // Duplicate for length
                          <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono font-medium text-white">{order.id}</td>
                            <td className="px-6 py-4">{order.user}</td>
                            <td className="px-6 py-4">{order.item}</td>
                            <td className="px-6 py-4 text-xs font-mono">{order.method}</td>
                            <td className="px-6 py-4 text-white font-bold">{order.price}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' :
                                  order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-orange-500/10 text-orange-400'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                              <button className="text-blue-400 hover:text-blue-300"><Edit className="w-4 h-4" /></button>
                              <button className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                {GAMES.map((game) => (
                  <div key={game.id} className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all">
                    <div className="h-32 bg-cover bg-center relative" style={{ background: game.image }}>
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
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
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
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
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
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const PromoCarousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % PROMO_SLIDES.length); }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {PROMO_SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80 mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A] via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 uppercase tracking-wider">{slide.title.includes("Joki") ? "Pro Service" : "Featured Event"}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">{slide.title}</h2>
                <p className="text-lg text-slate-200 mb-8 max-w-xl">{slide.description}</p>
                <button className="w-fit px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transform hover:-translate-y-1 transition-all flex items-center gap-2">{slide.cta} <ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {PROMO_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-500/50 hover:bg-slate-400'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ game, onClick }) => (
  <div onClick={onClick} className="group relative bg-[#1F2937] rounded-2xl overflow-hidden cursor-pointer border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
    <div className="h-48 w-full relative" style={{ background: game.image }}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] to-transparent opacity-90"></div>
      <div className="absolute bottom-4 left-4"><div className="text-4xl mb-2">{game.icon}</div></div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{game.name}</h3>
      <p className="text-slate-400 text-sm mt-1">{game.publisher}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-medium border border-slate-700 ${game.category === 'Service' ? 'bg-purple-900/50 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400'}`}>{game.category}</span>
        <span className="text-cyan-400 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          {game.type === 'joki' ? 'Boost' : game.type === 'login' ? 'Login' : 'Top Up'} <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </div>
);

// --- NEW STRATEGY 1: LIVE NOTIFICATIONS ---
const LiveSalesNotification = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const trigger = () => {
      const randomTx = FAKE_NOTIFICATIONS[Math.floor(Math.random() * FAKE_NOTIFICATIONS.length)];
      setData(randomTx);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000); // Hide after 4s
    };
    const interval = setInterval(trigger, 8000); // Trigger every 8s
    return () => clearInterval(interval);
  }, []);

  if (!visible || !data) return null;

  return (
    <div className="fixed bottom-24 left-4 z-50 animate-in slide-in-from-left duration-500">
      <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-2xl flex items-center gap-3 pr-6">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400">{data.time}</p>
          <p className="text-sm font-bold text-white"><span className="text-cyan-400">{data.user}</span> bought {data.item}</p>
        </div>
      </div>
    </div>
  );
};

// --- NEW STRATEGY 2: FLOATING WHATSAPP BUTTON ---
const WhatsAppFloat = () => (
  <a href="https://wa.me/60198313202" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/40 transition-all hover:scale-110 flex items-center justify-center group">
    <MessageCircle className="w-7 h-7 fill-current" />
    <span className="absolute right-full mr-4 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Chat with Q Store</span>
  </a>
);

// --- NEW STRATEGY 3: FAQ SECTION ---
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-slate-900/30 border-t border-slate-800 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2"><HelpCircle className="w-6 h-6 text-cyan-400" /> Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Got questions? We've got answers.</p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-[#1F2937] rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-bold text-slate-200">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="p-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 bg-slate-800/20">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENT: Joki Rank Selector ---
const JokiRankSelector = ({ label, value, onChange }) => {
  const currentRankConfig = RANK_CONF[value.rank];
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        <select value={value.rank} onChange={(e) => onChange({ ...value, rank: e.target.value, tier: RANK_CONF[e.target.value].tiers[0], star: 0 })} className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
          {RANK_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={value.tier} onChange={(e) => onChange({ ...value, tier: e.target.value })} className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
          {currentRankConfig.tiers.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={value.star} onChange={(e) => onChange({ ...value, star: parseInt(e.target.value) })} className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
          {[...Array(currentRankConfig.starsPerTier + 1).keys()].map(s => <option key={s} value={s}>{s} Star</option>)}
        </select>
      </div>
    </div>
  );
};


// --- Checkout Page Component ---

const CheckoutView = ({ game, onBack }) => {
  const isJoki = game.type === 'joki';
  const isLogin = game.type === 'login'; // For Roblox & MLBB Login
  const isRoblox = game.id === 101;
  const isMLBBLogin = game.id === 100;

  // Package Loading
  let currentPackages = PACKAGES_MLBB;
  if (isRoblox) currentPackages = PACKAGES_ROBLOX;
  if (isMLBBLogin) currentPackages = PACKAGES_MLBB_LOGIN;
  if (isJoki) currentPackages = JOKI_PACKAGES;

  // Filter Reviews for this game or default
  const productReviews = useMemo(() => {
    // If we have specific reviews for this exact game name, filter them.
    // Otherwise, show general reviews or mix.
    const specific = REVIEWS_DATA.filter(r => r.tag === game.name);
    return specific.length > 0 ? specific : REVIEWS_DATA.slice(0, 3); // Fallback to first 3 generic if none specific
  }, [game]);

  // State
  const [selectedPayment, setSelectedPayment] = useState(PAYMENTS[0]);
  const [selectedPackage, setSelectedPackage] = useState(currentPackages[0]);

  // Form State
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');

  // Login/Joki Fields
  const [loginMethod, setLoginMethod] = useState('Moonton');
  const [username, setUsername] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [backupCode, setBackupCode] = useState(''); // For Roblox
  const [nickname, setNickname] = useState(''); // For MLBB Login

  // Joki Calculator State
  const [startRank, setStartRank] = useState({ rank: 'Epic', tier: 'II', star: 2 });
  const [targetRank, setTargetRank] = useState({ rank: 'Legend', tier: 'IV', star: 3 });
  const [starQty, setStarQty] = useState(1);

  // Validation
  let isValid = false;
  if (game.type === 'topup') isValid = userId.length > 4;
  if (isJoki) isValid = username.length > 3 && password.length > 3 && phone.length > 8;
  if (isRoblox) isValid = username.length > 2 && password.length > 3 && backupCode.length > 3 && phone.length > 8;
  if (isMLBBLogin) isValid = username.length > 3 && password.length > 3 && phone.length > 8 && nickname.length > 2;

  // Joki Calculator Logic
  const jokiStats = useMemo(() => {
    if (!isJoki) return { price: 0, stars: 0 };
    let allSteps = [];
    RANK_ORDER.forEach(rankName => {
      const conf = RANK_CONF[rankName];
      conf.tiers.forEach(tier => {
        for (let s = 0; s < conf.starsPerTier; s++) allSteps.push({ rank: rankName, tier, star: s, price: conf.price });
      });
    });
    const findStepIndex = (rState) => allSteps.findIndex(s => s.rank === rState.rank && s.tier === rState.tier) + rState.star;
    const startIndex = findStepIndex(startRank);
    const targetIndex = findStepIndex(targetRank);
    if (targetIndex <= startIndex) return { price: 0, stars: 0, error: "Target > Start" };
    const stepsToTraverse = allSteps.slice(startIndex, targetIndex);
    return { price: stepsToTraverse.reduce((sum, step) => sum + step.price, 0), stars: stepsToTraverse.length, error: null };
  }, [startRank, targetRank, isJoki]);

  const totalAmount = isJoki
    ? (selectedPackage.unit === 'Per Star' ? (jokiStats.error ? 0 : jokiStats.price) : selectedPackage.price)
    : selectedPackage.price;

  return (
    <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Games
      </button>

      {/* Special Warnings for Login Services */}
      {(isJoki || isLogin) && (
        <div className="mb-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
            {isJoki ? <Sword className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-1">
              {isJoki ? "Rank Booster Service" : "Login Method Top-Up"}
            </h3>
            <p className="text-slate-400 text-sm">
              {isRoblox && "Login using Username + Password. Process time: 5–10 Minutes. No Rush Order."}
              {isMLBBLogin && "Manual Process (1-3 Hours). Do NOT login during process. Turn off 2nd Verification."}
              {isJoki && "Professional boosting service. We guarantee account safety and speed."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Account Details */}
          <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${isJoki || isLogin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isJoki || isLogin ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>1</div>
              <h2 className="text-xl font-bold text-white">Enter Account Details</h2>
            </div>

            {/* DIRECT TOPUP FORM */}
            {game.type === 'topup' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">User ID</label>
                  <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="e.g. 12345678" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Zone ID</label>
                  <input type="text" value={zoneId} onChange={(e) => setZoneId(e.target.value)} placeholder="(1234)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-3 text-xs text-slate-500 mt-2"><ShieldCheck className="w-3 h-3 inline mr-1" /> No password needed.</div>
              </div>
            )}

            {/* LOGIN / JOKI FORM */}
            {(isJoki || isLogin) && (
              <div className="space-y-4">
                {/* Login Method for MLBB */}
                {(isMLBBLogin || isJoki) && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">Login Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Moonton', 'TikTok', 'Facebook'].map(method => (
                        <button key={method} onClick={() => setLoginMethod(method)} className={`py-2 rounded-lg text-sm font-medium border transition-all ${loginMethod === method ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>{method}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nickname for MLBB Login */}
                {isMLBBLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">In-Game Nickname</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Your Name" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">{isRoblox ? "Username" : "Email / Username"}</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={isRoblox ? "RobloxUser123" : "example@email.com"} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">Password</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>

                {isRoblox && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">Backup Code (Required)</label>
                    <input type="text" value={backupCode} onChange={(e) => setBackupCode(e.target.value)} placeholder="123456" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                    <p className="text-[10px] text-slate-500 mt-1">Get this from Roblox Settings {'>'} Security {'>'} Backup Codes.</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase text-xs tracking-wider">Phone Number (WhatsApp)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="012-3456789" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                </div>

                {/* WARNINGS */}
                <div className="mt-6 space-y-3">
                  {isMLBBLogin && (
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-400 uppercase">Warning: Off 2nd Verification</p>
                        <p className="text-xs text-red-400/70">Login will fail if verification code is needed. Interrupting process = burn payment.</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3 h-3" /> Credentials encrypted via AES-256
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Select Package */}
          <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">2</div>
              <h2 className="text-xl font-bold text-white">{isJoki && selectedPackage.unit === 'Per Star' ? "Select Target Rank" : "Select Package"}</h2>
            </div>

            {isJoki && selectedPackage.unit === 'Per Star' ? (
              // JOKI RANK CALCULATOR
              <div className="space-y-6">
                <JokiRankSelector label="Current Rank" value={startRank} onChange={setStartRank} />
                <div className="flex justify-center"><ArrowRight className="text-slate-500 rotate-90 sm:rotate-0" /></div>
                <JokiRankSelector label="Target Rank" value={targetRank} onChange={setTargetRank} />
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 mt-4">
                  {jokiStats.error ? <span className="text-red-400 font-bold">{jokiStats.error}</span> :
                    <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Required Stars:</span><span className="text-white font-bold text-xl">{jokiStats.stars}</span></div>}
                </div>
              </div>
            ) : (
              // GRID PACKAGES
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentPackages.map((pkg) => (
                  <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedPackage.id === pkg.id ? 'bg-cyan-900/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] transform -translate-y-1' : 'bg-slate-800 border-transparent hover:bg-slate-750 hover:border-slate-600'}`}>
                    {pkg.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide whitespace-nowrap">{pkg.tag}</div>}
                    <div className="flex flex-col items-center text-center mt-2">
                      <div className="w-10 h-10 mb-2 flex items-center justify-center text-2xl">{isJoki ? '🏆' : isRoblox ? '🟥' : '💎'}</div>
                      <h3 className="text-white font-bold text-sm">{pkg.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">{pkg.bonus}</p>
                      <div className="mt-3 w-full pt-3 border-t border-slate-700/50">
                        <p className="text-cyan-400 font-bold">RM {pkg.price.toFixed(2)}</p>
                        {pkg.original > pkg.price && <p className="text-slate-500 text-xs line-through decoration-slate-500">RM {pkg.original.toFixed(2)}</p>}
                      </div>
                    </div>
                    {selectedPackage.id === pkg.id && <div className="absolute top-2 right-2 text-cyan-400"><CheckCircle2 className="w-4 h-4" /></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Payment */}
          <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">3</div>
              <h2 className="text-xl font-bold text-white">Select Payment Method</h2>
            </div>
            <div className="space-y-3">
              {PAYMENTS.map((method) => (
                <div key={method.id} onClick={() => setSelectedPayment(method)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment.id === method.id ? 'bg-purple-900/10 border-purple-400' : 'bg-slate-800 border-transparent hover:border-slate-600'}`}>
                  <div className="flex items-center gap-4"><div className="text-2xl">{method.icon}</div><div><h4 className="text-white font-medium">{method.name}</h4><p className="text-slate-500 text-xs">{method.type}</p></div></div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Customer Reviews (Fake Strategy) */}
          <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-emerald-400" /> Recent Customer Reviews</h3>
            <div className="space-y-4">
              {productReviews.map((review) => (
                <div key={review.id} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="text-white text-sm font-bold mr-2">{review.user}</span>
                      <span className="text-slate-500 text-xs">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-snug">"{review.text}"</p>
                  <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-wide bg-slate-800/50 inline-block px-2 py-0.5 rounded">
                    Verified Purchase • {review.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-cyan-400" /> Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Product:</span><span className="text-white font-medium text-right">{game.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">{isJoki ? 'Service:' : 'Item:'}</span><span className="text-white font-medium text-right">{isJoki && selectedPackage.unit === 'Per Star' ? `${jokiStats.stars} Stars Boost` : selectedPackage.name}</span></div>
                <div className="flex justify-between text-sm items-center"><span className="text-slate-400">Account:</span>{isValid ? <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-mono">{isLogin || isJoki ? 'Form Filled' : userId}</span> : <span className="text-red-400 text-xs">Required</span>}</div>
              </div>
              <div className="border-t border-slate-700 pt-4 mb-6">
                <div className="flex justify-between items-end"><span className="text-slate-400 text-sm">Total Pay</span><div className="text-right"><span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">RM {totalAmount.toFixed(2)}</span></div></div>
              </div>
              <button disabled={!isValid} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isValid ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-cyan-400/30 transform hover:-translate-y-1' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}><Zap className="w-5 h-5 fill-current" /> Pay Instantly</button>
            </div>
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-800 rounded-xl p-4 border border-blue-500/20 flex items-center gap-4"><div className="bg-blue-600/20 p-3 rounded-full text-blue-400"><Headphones className="w-5 h-5" /></div><div><p className="text-white text-sm font-bold">Need Help?</p><p className="text-slate-400 text-xs">WhatsApp Support 24/7</p></div></div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1F2937] border-t border-slate-700 p-4 lg:hidden z-40 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div><span className="text-xs text-slate-400 block">Total</span><span className="text-xl font-bold text-white">RM {totalAmount.toFixed(2)}</span></div>
          <button disabled={!isValid} className={`flex-1 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${isValid ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' : 'bg-slate-700 text-slate-500'}`}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

// --- New Component: TrackOrderView ---
const TrackOrderView = ({ onBack }) => {
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mb-6 shadow-lg shadow-cyan-500/20"><Search className="w-8 h-8 text-white" /></div>
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

// --- New Component: WhyChooseUs ---
const WhyQylexSection = () => (
  <div className="bg-slate-900/50 border-t border-slate-800 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold tracking-wide uppercase mb-4 border border-blue-500/20">The Gamer's Choice</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Why Gamers Choose QylexGame?</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Join thousands of Malaysian gamers who rely on us for seamless top-ups, rank boosting, and exclusive reseller rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Feature 1 */}
        <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all group">
          <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Instant Automated Delivery</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our 24/7 API system ensures your Diamonds, UC, and credits are delivered within seconds of payment. No waiting, just gaming.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all group">
          <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">100% Safe & Legitimate</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We are a registered business (SSM: 202503226171). All products are sourced directly from official game publishers and authorized distributors.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 hover:bg-slate-800/80 transition-all group">
          <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
            <Wallet className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Convenient Local Payment</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Pay securely using Malaysia's favorite methods including Touch 'n Go eWallet, GrabPay, FPX Banking, and DuitNow QR.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 hover:bg-slate-800/80 transition-all group">
          <div className="w-14 h-14 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Dedicated Support & Joki</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            From troubleshooting orders to professional Rank Boosting (Joki), our verified team is ready to assist via WhatsApp support.
          </p>
        </div>

      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setView('checkout');
    window.scrollTo(0, 0);
  };

  const filteredGames = GAMES.filter(game => {
    if (activeCategory === 'all') return true;
    return game.platform === activeCategory || (activeCategory === 'mobile' && game.category !== 'Service' && game.platform !== 'pc');
  });

  return (
    <div className="bg-[#0B1D3A] min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar onViewChange={setView} currentView={view} />
      {view === 'home' ? (
        <>
          <PromoCarousel />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'}`}><cat.icon className="w-4 h-4" />{cat.label}</button>
              ))}
            </div>
            <div className="mb-16">
              <div className="flex items-end justify-between mb-8">
                <div><h2 className="text-3xl font-bold text-white flex items-center gap-2"><Flame className="text-orange-500 fill-orange-500" /> Popular Now</h2><p className="text-slate-400 mt-2">Top selling games in Malaysia this week.</p></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredGames.map((game) => (<GameCard key={game.id} game={game} onClick={() => handleGameClick(game)} />))}
              </div>
            </div>
            {/* Promo Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-[#0B1D3A] border border-blue-800 mb-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full"></div>
              <div className="relative z-10 px-8 py-12 md:px-16 md:flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-4">RESELLER PROGRAM</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Own Top-Up Business</h2>
                  <p className="text-slate-300 max-w-lg mb-8 text-lg">
                    Join QylexGame Partner Program. Get wholesale rates (up to 20% off) and automated API access.
                  </p>
                  <button className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                    Apply for Partnership
                  </button>
                </div>
                <div className="hidden md:block mt-8 md:mt-0">
                  <div className="w-32 h-32 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </main>

          <WhyQylexSection />
          <FAQSection />

          <footer className="bg-[#050f1e] border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Qylex<span className="text-cyan-400">Game</span></h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    The #1 Trusted Gaming Marketplace in Malaysia. Secure, fast, and affordable.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-cyan-400">Contact Us</a></li>
                    <li><a href="#" className="hover:text-cyan-400">FAQ</a></li>
                    <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4">Partnership</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#" className="hover:text-cyan-400">Reseller Login</a></li>
                    <li><a href="#" className="hover:text-cyan-400">API Documentation</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4">Payment Methods</h4>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700"></div>
                    <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700"></div>
                    <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700"></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-8 text-center text-slate-600 text-sm">
                &copy; 2026 Qylex Solution (SSM: 202503226171). All rights reserved.
              </div>
            </div>
          </footer>
        </>
      ) : view === 'track' ? (
        <TrackOrderView onBack={() => setView('home')} />
      ) : view === 'admin_login' ? (
        <AdminLogin onSuccess={() => { setIsAdminAuthenticated(true); setView('admin'); }} onBack={() => setView('home')} />
      ) : view === 'admin' ? (
        isAdminAuthenticated ? <AdminDashboard onBack={() => { setIsAdminAuthenticated(false); setView('home'); }} /> : <AdminLogin onSuccess={() => { setIsAdminAuthenticated(true); setView('admin'); }} onBack={() => setView('home')} />
      ) : (
        <CheckoutView game={selectedGame} onBack={() => setView('home')} />
      )}

      <LiveSalesNotification />
      <WhatsAppFloat />
    </div>
  );
}