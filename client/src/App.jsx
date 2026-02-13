import { useState } from 'react';
import { Trophy, Flame } from 'lucide-react';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import {
  GAMES,
  CATEGORIES,
} from './data/Others';

import PromoCarousel from './components/PromoCarousel';
import WhyQylexSection from './content/WhyQylexSelection';
import FAQSection from './content/FAQSection';
import LiveSalesNotification from './components/LiveSalesNotification';
import WhatsAppFloat from './components/WhatsAppFloat';
import GameCard from './components/GameCard';
import Navbar from './layout/Navbar';
import Footer from './layout/footer';
import TrackOrderView from './components/TrackOrderView';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import LoginPage from './components/login';
import CheckoutView from './components/CheckoutView';

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

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qylex_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 1. Create the Logout function
  const handleLogout = () => {
    localStorage.removeItem('qylex_user'); // Clear storage
    setUser(null); // Clear state
    navigate('/login'); // Redirect to login
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('qylex_user', JSON.stringify(userData));
    setUser(userData);
  };

  const navigate = useNavigate();
  const filteredGames = GAMES.filter(game => {
    if (activeCategory === 'all') return true;
    return game.platform === activeCategory || (activeCategory === 'mobile' && game.category !== 'Service' && game.platform !== 'pc');
  });

  return (
    <div className="bg-[#0B1D3A] min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar user={user} onLogout={handleLogout} />
      {/* {view === 'home' ? ( */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (<GameCard key={game.id} game={game} onClick={() => navigate(`/checkout/${game.id}`)} />))}
                </div>
              </div>
              {/* Promo Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-blue-900 to-[#0B1D3A] border border-blue-800 mb-20">
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
                    <div className="w-32 h-32 bg-linear-to-tr from-cyan-400 to-blue-600 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
                      <Trophy className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </main>

            <WhyQylexSection />
            <FAQSection />

            <Footer />
          </>
        } />

        <Route path="/login" element={<LoginPage onLogin={handleLoginSuccess} />} />

        {/* TRACK */}
        <Route path="/track" element={<TrackOrderView />} />

        {/* CHECKOUT */}
        <Route path="/checkout/:gameId" element={<CheckoutView />} />

        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminLogin onSuccess={() => setIsAdminAuthenticated(true)} />} />

        <Route
          path="/admin/dashboard/*"
          element={
            isAdminAuthenticated
              ? <AdminDashboard onBack={() => setIsAdminAuthenticated(false)} />
              : <Navigate to="/admin" replace />
          }
        />
      </Routes>

      <LiveSalesNotification />
      <WhatsAppFloat />
    </div>
  );
}