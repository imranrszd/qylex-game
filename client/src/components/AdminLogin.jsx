import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { SITE_CONFIG } from '../data/Others';

const AdminLogin = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === SITE_CONFIG.adminPin) {
      // Check if onSuccess exists before calling it
      if (typeof onSuccess === 'function') {
        onSuccess();
        navigate('/admin/dashboard/overview');
      } else {
        console.error("onSuccess prop was not passed to AdminLogin!");
      }
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
          <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all">
            Unlock Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-slate-500 text-sm hover:text-white"
          >
            Return Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
