import { useState } from 'react';
import { Zap, Menu, X, Lock } from 'lucide-react';
import qylexLogo from '../assets/qylex-logo.png';

export default function Navbar({ onViewChange, currentView }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-700/50 backdrop-blur-md bg-[#0B1D3A]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onViewChange('home')}>
            <div className="w-20 h-10 bg-linear-to-tr pt-1 from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              {/* <Zap className="text-white w-6 h-6 fill-current" /> */}
              <img src={qylexLogo} alt="Qylex logo" />

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
              {/* <button onClick={() => { }} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Reseller Rates</button> */}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onViewChange('admin_login')}
              disabled
              className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium border border-slate-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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