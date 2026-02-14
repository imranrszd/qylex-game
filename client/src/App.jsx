import { useState } from 'react';
import {
  Trophy,
  Flame,
} from 'lucide-react';
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
import AdminDashboard from './pages/admin/AdminDashboard';
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

// --- JOKI LOGIC ENGINE ---
// const RANK_CONF = {
//   'Grandmaster': { starsPerTier: 5, price: 3.50, tiers: ['V', 'IV', 'III', 'II', 'I'] },
//   'Epic': { starsPerTier: 5, price: 5.00, tiers: ['V', 'IV', 'III', 'II', 'I'] },
//   'Legend': { starsPerTier: 5, price: 6.50, tiers: ['V', 'IV', 'III', 'II', 'I'] },
//   'Mythic': { starsPerTier: 25, price: 10.00, tiers: ['Grading', 'Honor', 'Glory'] }
// };
// const RANK_ORDER = ['Grandmaster', 'Epic', 'Legend', 'Mythic'];

// --- HELPER COMPONENT: Joki Rank Selector ---
// const JokiRankSelector = ({ label, value, onChange }) => {
//   const currentRankConfig = RANK_CONF[value.rank];
//   return (
//     <div className="space-y-3">
//       <label className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">{label}</label>
//       <div className="grid grid-cols-3 gap-2">
//         <select value={value.rank} onChange={(e) => onChange({ ...value, rank: e.target.value, tier: RANK_CONF[e.target.value].tiers[0], star: 0 })} className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
//           {RANK_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
//         </select>
//         <select value={value.tier} onChange={(e) => onChange({ ...value, tier: e.target.value })} className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
//           {currentRankConfig.tiers.map(t => <option key={t} value={t}>{t}</option>)}
//         </select>
//         <select value={value.star} onChange={(e) => onChange({ ...value, star: parseInt(e.target.value) })} className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
//           {[...Array(currentRankConfig.starsPerTier + 1).keys()].map(s => <option key={s} value={s}>{s} Star</option>)}
//         </select>
//       </div>
//     </div>
//   );
// };


// --- Checkout Page Component ---

// const CheckoutView = () => {
//   const { gameId } = useParams();
//   const navigate = useNavigate();

//   const game = GAMES.find(g => g.id === Number(gameId));

//   if (!game) {
//     return <div className="text-white pt-28">Game not found</div>;
//   }

//   const onBack = () => {
//     navigate(-1); // goes back one step in history
//     // or navigate('/games') if you want a specific route
//   };

//   const isJoki = game.type === 'joki';
//   const isLogin = game.type === 'login'; // For Roblox & MLBB Login
//   const isRoblox = game.id === 101;
//   const isMLBBLogin = game.id === 100;
//   // Package Loading
//   let currentPackages = PACKAGES_MLBB;
//   if (isRoblox) currentPackages = PACKAGES_ROBLOX;
//   if (isMLBBLogin) currentPackages = PACKAGES_MLBB_LOGIN;
//   if (isJoki) currentPackages = JOKI_PACKAGES;

//   // Filter Reviews for this game or default
//   const productReviews = useMemo(() => {
//     // If we have specific reviews for this exact game name, filter them.
//     // Otherwise, show general reviews or mix.
//     const specific = REVIEWS_DATA.filter(r => r.tag === game.name);
//     return specific.length > 0 ? specific : REVIEWS_DATA.slice(0, 3); // Fallback to first 3 generic if none specific
//   }, [game]);

//   // State
//   const [selectedPayment, setSelectedPayment] = useState(PAYMENTS[0]);
//   const [selectedPackage, setSelectedPackage] = useState(currentPackages[0]);

//   // Form State
//   const [userId, setUserId] = useState('');
//   const [zoneId, setZoneId] = useState('');

//   // Login/Joki Fields
//   const [loginMethod, setLoginMethod] = useState('Moonton');
//   const [username, setUsername] = useState(''); // Email or Username
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [backupCode, setBackupCode] = useState(''); // For Roblox
//   const [nickname, setNickname] = useState(''); // For MLBB Login

//   // Joki Calculator State
//   const [startRank, setStartRank] = useState({ rank: 'Epic', tier: 'II', star: 2 });
//   const [targetRank, setTargetRank] = useState({ rank: 'Legend', tier: 'IV', star: 3 });
//   const [starQty, setStarQty] = useState(1);

//   // Validation
//   let isValid = false;
//   if (game.type === 'topup') isValid = userId.length > 4;
//   if (isJoki) isValid = username.length > 3 && password.length > 3 && phone.length > 8;
//   if (isRoblox) isValid = username.length > 2 && password.length > 3 && backupCode.length > 3 && phone.length > 8;
//   if (isMLBBLogin) isValid = username.length > 3 && password.length > 3 && phone.length > 8 && nickname.length > 2;

//   // Joki Calculator Logic
//   const jokiStats = useMemo(() => {
//     if (!isJoki) return { price: 0, stars: 0 };
//     let allSteps = [];
//     RANK_ORDER.forEach(rankName => {
//       const conf = RANK_CONF[rankName];
//       conf.tiers.forEach(tier => {
//         for (let s = 0; s < conf.starsPerTier; s++) allSteps.push({ rank: rankName, tier, star: s, price: conf.price });
//       });
//     });
//     const findStepIndex = (rState) => allSteps.findIndex(s => s.rank === rState.rank && s.tier === rState.tier) + rState.star;
//     const startIndex = findStepIndex(startRank);
//     const targetIndex = findStepIndex(targetRank);
//     if (targetIndex <= startIndex) return { price: 0, stars: 0, error: "Target > Start" };
//     const stepsToTraverse = allSteps.slice(startIndex, targetIndex);
//     return { price: stepsToTraverse.reduce((sum, step) => sum + step.price, 0), stars: stepsToTraverse.length, error: null };
//   }, [startRank, targetRank, isJoki]);

//   const totalAmount = isJoki
//     ? (selectedPackage.unit === 'Per Star' ? (jokiStats.error ? 0 : jokiStats.price) : selectedPackage.price)
//     : selectedPackage.price;

//   return (
//     <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
//       <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors">
//         <ChevronRight className="w-4 h-4 rotate-180" /> Back to Games
//       </button>

//       {/* Special Warnings for Login Services */}
//       {(isJoki || isLogin) && (
//         <div className="mb-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
//           <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
//             {isJoki ? <Sword className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
//           </div>
//           <div>
//             <h3 className="text-white font-bold text-lg mb-1">
//               {isJoki ? "Rank Booster Service" : "Login Method Top-Up"}
//             </h3>
//             <p className="text-slate-400 text-sm">
//               {isRoblox && "Login using Username + Password. Process time: 5–10 Minutes. No Rush Order."}
//               {isMLBBLogin && "Manual Process (1-3 Hours). Do NOT login during process. Turn off 2nd Verification."}
//               {isJoki && "Professional boosting service. We guarantee account safety and speed."}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* LEFT COLUMN */}
//         <div className="lg:col-span-2 space-y-6">

//           {/* 1. Account Details */}
//           <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
//             <div className={`absolute top-0 left-0 w-1 h-full ${isJoki || isLogin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
//             <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isJoki || isLogin ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>1</div>
//               <h2 className="text-xl font-bold text-white">Enter Account Details</h2>
//             </div>

//             {/* DIRECT TOPUP FORM */}
//             {game.type === 'topup' && (
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-slate-400 mb-2">User ID</label>
//                   <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="e.g. 12345678" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-400 mb-2">Zone ID</label>
//                   <input type="text" value={zoneId} onChange={(e) => setZoneId(e.target.value)} placeholder="(1234)" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
//                 </div>
//                 <div className="col-span-3 text-xs text-slate-500 mt-2"><ShieldCheck className="w-3 h-3 inline mr-1" /> No password needed.</div>
//               </div>
//             )}

//             {/* LOGIN / JOKI FORM */}
//             {(isJoki || isLogin) && (
//               <div className="space-y-4">
//                 {/* Login Method for MLBB */}
//                 {(isMLBBLogin || isJoki) && (
//                   <div>
//                     <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Login Method</label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {['Moonton', 'TikTok', 'Facebook'].map(method => (
//                         <button key={method} onClick={() => setLoginMethod(method)} className={`py-2 rounded-lg text-sm font-medium border transition-all ${loginMethod === method ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>{method}</button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Nickname for MLBB Login */}
//                 {isMLBBLogin && (
//                   <div>
//                     <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">In-Game Nickname</label>
//                     <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Your Name" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{isRoblox ? "Username" : "Email / Username"}</label>
//                     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={isRoblox ? "RobloxUser123" : "example@email.com"} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
//                     <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
//                   </div>
//                 </div>

//                 {isRoblox && (
//                   <div>
//                     <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Backup Code (Required)</label>
//                     <input type="text" value={backupCode} onChange={(e) => setBackupCode(e.target.value)} placeholder="123456" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
//                     <p className="text-[10px] text-slate-500 mt-1">Get this from Roblox Settings {'>'} Security {'>'} Backup Codes.</p>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Phone Number (WhatsApp)</label>
//                   <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="012-3456789" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
//                 </div>

//                 {/* WARNINGS */}
//                 <div className="mt-6 space-y-3">
//                   {isMLBBLogin && (
//                     <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
//                       <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-sm font-bold text-red-400 uppercase">Warning: Off 2nd Verification</p>
//                         <p className="text-xs text-red-400/70">Login will fail if verification code is needed. Interrupting process = burn payment.</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <Lock className="w-3 h-3" /> Credentials encrypted via AES-256
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* 2. Select Package */}
//           <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
//             <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
//               <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">2</div>
//               <h2 className="text-xl font-bold text-white">{isJoki && selectedPackage.unit === 'Per Star' ? "Select Target Rank" : "Select Package"}</h2>
//             </div>

//             {isJoki && selectedPackage.unit === 'Per Star' ? (
//               // JOKI RANK CALCULATOR
//               <div className="space-y-6">
//                 <JokiRankSelector label="Current Rank" value={startRank} onChange={setStartRank} />
//                 <div className="flex justify-center"><ArrowRight className="text-slate-500 rotate-90 sm:rotate-0" /></div>
//                 <JokiRankSelector label="Target Rank" value={targetRank} onChange={setTargetRank} />
//                 <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 mt-4">
//                   {jokiStats.error ? <span className="text-red-400 font-bold">{jokiStats.error}</span> :
//                     <div className="flex justify-between items-center"><span className="text-slate-400 text-sm">Required Stars:</span><span className="text-white font-bold text-xl">{jokiStats.stars}</span></div>}
//                 </div>
//               </div>
//             ) : (
//               // GRID PACKAGES
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {currentPackages.map((pkg) => (
//                   <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedPackage.id === pkg.id ? 'bg-cyan-900/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] transform -translate-y-1' : 'bg-slate-800 border-transparent hover:bg-slate-750 hover:border-slate-600'}`}>
//                     {pkg.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-linear-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide whitespace-nowrap">{pkg.tag}</div>}
//                     <div className="flex flex-col items-center text-center mt-2">
//                       <div className="w-10 h-10 mb-2 flex items-center justify-center text-2xl">{isJoki ? '🏆' : isRoblox ? '🟥' : '💎'}</div>
//                       <h3 className="text-white font-bold text-sm">{pkg.name}</h3>
//                       <p className="text-slate-400 text-xs mt-1">{pkg.bonus}</p>
//                       <div className="mt-3 w-full pt-3 border-t border-slate-700/50">
//                         <p className="text-cyan-400 font-bold">RM {pkg.price.toFixed(2)}</p>
//                         {pkg.original > pkg.price && <p className="text-slate-500 text-xs line-through decoration-slate-500">RM {pkg.original.toFixed(2)}</p>}
//                       </div>
//                     </div>
//                     {selectedPackage.id === pkg.id && <div className="absolute top-2 right-2 text-cyan-400"><CheckCircle2 className="w-4 h-4" /></div>}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* 3. Payment */}
//           <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
//             <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
//               <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">3</div>
//               <h2 className="text-xl font-bold text-white">Select Payment Method</h2>
//             </div>
//             <div className="space-y-3">
//               {PAYMENTS.map((method) => (
//                 <div key={method.id} onClick={() => setSelectedPayment(method)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment.id === method.id ? 'bg-purple-900/10 border-purple-400' : 'bg-slate-800 border-transparent hover:border-slate-600'}`}>
//                   <div className="flex items-center gap-4"><div className="text-2xl"><span><img className='h-8' src={method.logo} alt="" /></span></div><div><h4 className="text-white font-medium">{method.name}</h4><p className="text-slate-500 text-xs">{method.type}</p></div></div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* 4. Customer Reviews (Fake Strategy) */}
//           <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700">
//             <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-emerald-400" /> Recent Customer Reviews</h3>
//             <div className="space-y-4">
//               {productReviews.map((review) => (
//                 <div key={review.id} className="border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
//                   <div className="flex justify-between items-start mb-1">
//                     <div>
//                       <span className="text-white text-sm font-bold mr-2">{review.user}</span>
//                       <span className="text-slate-500 text-xs">{review.date}</span>
//                     </div>
//                     <div className="flex text-yellow-400 text-xs">
//                       {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
//                     </div>
//                   </div>
//                   <p className="text-slate-300 text-sm leading-snug">"{review.text}"</p>
//                   <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-wide bg-slate-800/50 inline-block px-2 py-0.5 rounded">
//                     Verified Purchase • {review.tag}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>

//         {/* RIGHT COLUMN - SUMMARY */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-28 space-y-4">
//             <div className="bg-[#1F2937] rounded-2xl p-6 border border-slate-700 shadow-xl">
//               <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-cyan-400" /> Order Summary</h3>
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between text-sm"><span className="text-slate-400">Product:</span><span className="text-white font-medium text-right">{game.name}</span></div>
//                 <div className="flex justify-between text-sm"><span className="text-slate-400">{isJoki ? 'Service:' : 'Item:'}</span><span className="text-white font-medium text-right">{isJoki && selectedPackage.unit === 'Per Star' ? `${jokiStats.stars} Stars Boost` : selectedPackage.name}</span></div>
//                 <div className="flex justify-between text-sm items-center"><span className="text-slate-400">Account:</span>{isValid ? <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-mono">{isLogin || isJoki ? 'Form Filled' : userId}</span> : <span className="text-red-400 text-xs">Required</span>}</div>
//               </div>
//               <div className="border-t border-slate-700 pt-4 mb-6">
//                 <div className="flex justify-between items-end"><span className="text-slate-400 text-sm">Total Pay</span><div className="text-right"><span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">RM {totalAmount.toFixed(2)}</span></div></div>
//               </div>
//               <button disabled={!isValid} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isValid ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white hover:shadow-cyan-400/30 transform hover:-translate-y-1' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}><Zap className="w-5 h-5 fill-current" /> Pay Instantly</button>
//             </div>
//             <div className="bg-linear-to-br from-blue-900/20 to-slate-800 rounded-xl p-4 border border-blue-500/20 flex items-center gap-4"><div className="bg-blue-600/20 p-3 rounded-full text-blue-400"><Headphones className="w-5 h-5" /></div><div><p className="text-white text-sm font-bold">Need Help?</p><p className="text-slate-400 text-xs">WhatsApp Support 24/7</p></div></div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Sticky Action Bar */}
//       <div className="fixed bottom-0 left-0 w-full bg-[#1F2937] border-t border-slate-700 p-4 lg:hidden z-40 pb-6">
//         <div className="flex items-center justify-between gap-4">
//           <div><span className="text-xs text-slate-400 block">Total</span><span className="text-xl font-bold text-white">RM {totalAmount.toFixed(2)}</span></div>
//           <button disabled={!isValid} className={`flex-1 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${isValid ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white' : 'bg-slate-700 text-slate-500'}`}>Pay Now</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// --- Main App ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [games, setGames] = useState(GAMES);

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
  const filteredGames = games.filter(game => {
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
                  {filteredGames.map((game) => (<GameCard key={game.id} game={game} onClick={() => navigate(`/checkout/${game.slug}`)} />))}
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
        <Route path="/checkout/:slug" element={<CheckoutView games={games} />} />

        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminLogin onSuccess={() => setIsAdminAuthenticated(true)} />} />

        <Route
          path="/admin/dashboard/*"
          element={
            isAdminAuthenticated
              ? <AdminDashboard onBack={() => setIsAdminAuthenticated(false)} games={games} setGames={setGames} />
              : <Navigate to="/admin" replace />
          }
        />
      </Routes>

      <LiveSalesNotification />
      <WhatsAppFloat />
    </div>
  );
}