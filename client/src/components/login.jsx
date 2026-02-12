import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";

import {
  MOCK_USERS
} from '../data/MockData';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Find user in mock database
    const foundUser = MOCK_USERS.find(
      u => u.username === username.toLowerCase() && u.pin === pin
    );

    if (foundUser) {
      onLogin({ name: foundUser.name, role: foundUser.role });
      navigate(foundUser.redirect); // Go to Admin or Customer dashboard
    } else {
      setError('Invalid Username or PIN');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D3A] px-4">
      <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Portal Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white focus:border-cyan-500 outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white focus:border-cyan-500 outline-none"
              maxLength={4}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;