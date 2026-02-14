import { useState } from "react";
import { Lock, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import {
  MOCK_USERS
} from '../../data/MockData';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: pin
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      // Example user object
      const userData = {
        username: data.user.username,
        role: data.user.role,
        token: data.token,
      };

      // Trigger the callback
      console.log("User data sent to app:", userData);
      onLogin(userData);
      navigate('/'); // redirect after login

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

      localStorage.setItem('token', data.token);   // for auth check
      localStorage.setItem('role', data.role);     // for role-based redirect
      localStorage.setItem('email', username);     // optional: store email for display

    } catch (err) {
      setError("Server error");
    }

  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D3A] px-4">
      <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>

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
            Submit
          </button>
          <p className="text-slate-500 w-full flex justify-center">Don't have an account?
            <Link
              to='/signup'
              className="text-white text-sm hover:text-cyan-600 pl-2 underline"
            >
              Sign up
            </Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;