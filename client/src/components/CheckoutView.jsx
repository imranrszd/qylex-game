import { useState, useMemo } from 'react';
import {
  Zap,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  X,
  CheckCircle2,
  Sword,
  Lock,
  Minus,
  Plus,
  ArrowRight,
  Copy,
  UploadCloud,
  Check
} from 'lucide-react';

import { useNavigate, useParams } from "react-router-dom";

import {
  PACKAGES_MLBB,
  PACKAGES_MLBB_LOGIN,
  PACKAGES_ROBLOX
} from '../data/Packages';

import {
  GAMES,
  PAYMENTS,
} from '../data/Others';

const SITE_CONFIG = {
  whatsapp: "60198313202", // Q Store Number
  adminPin: "1234", // Simple PIN for MVP Protection
  qrCodeUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" // Replace with your actual DuitNow QR URL
};

// --- JOKI LOGIC ENGINE ---
const RANK_CONF = {
  'Grandmaster': { starsPerTier: 5, price: 3.50, tiers: ['V', 'IV', 'III', 'II', 'I'] },
  'Epic': { starsPerTier: 5, price: 5.00, tiers: ['V', 'IV', 'III', 'II', 'I'] },
  'Legend': { starsPerTier: 5, price: 6.50, tiers: ['V', 'IV', 'III', 'II', 'I'] },
  'Mythic': { starsPerTier: 25, price: 10.00, tiers: ['Grading', 'Honor', 'Glory'] }
};
const RANK_ORDER = ['Grandmaster', 'Epic', 'Legend', 'Mythic'];

// --- HELPER COMPONENT: Joki Rank Selector ---
const JokiRankSelector = ({ label, value, onChange }) => {
  const currentRankConfig = RANK_CONF[value.rank];
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        <select value={value.rank} onChange={(e) => onChange({ ...value, rank: e.target.value, tier: RANK_CONF[e.target.value].tiers[0], star: 0 })} className="bg-black border border-[#282442] text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
          {RANK_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={value.tier} onChange={(e) => onChange({ ...value, tier: e.target.value })} className="bg-black border border-[#282442] text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
          {currentRankConfig.tiers.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={value.star} onChange={(e) => onChange({ ...value, star: parseInt(e.target.value) })} className="bg-black border border-[#282442] text-white text-xs sm:text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5">
          {[...Array(currentRankConfig.starsPerTier + 1).keys()].map(s => <option key={s} value={s}>{s} Star</option>)}
        </select>
      </div>
    </div>
  );
};

// --- Checkout Page Component ---

const CheckoutView = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const game = GAMES.find(g => g.id === Number(gameId));

  if (!game) {
    return <div className="text-white pt-28">Game not found</div>;
  }

  const onBack = () => {
    navigate(-1); // goes back one step in history
    // or navigate('/games') if you want a specific route
  };
  const isJoki = game.type === 'joki';
  const isLogin = game.type === 'login';
  const isRoblox = game.id === 101;
  const isMLBBLogin = game.id === 100;

  let currentPackages = PACKAGES_MLBB;
  if (isRoblox) currentPackages = PACKAGES_ROBLOX;
  if (isMLBBLogin) currentPackages = PACKAGES_MLBB_LOGIN;

  const [selectedPayment, setSelectedPayment] = useState(PAYMENTS[0]);

  // Form State
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [contactInfo, setContactInfo] = useState(''); // New: WhatsApp/Email for direct topup

  // ID Validation State
  const [isValidating, setIsValidating] = useState(false);
  const [validatedName, setValidatedName] = useState(null);

  const [loginMethod, setLoginMethod] = useState('Moonton');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [nickname, setNickname] = useState('');

  const [startRank, setStartRank] = useState({ rank: 'Epic', tier: 'II', star: 2 });
  const [targetRank, setTargetRank] = useState({ rank: 'Legend', tier: 'IV', star: 3 });

  // NEW CART STATE: Allows multiple items (e.g. Weekly Pass x2, 14 Diamond x1)
  const [cart, setCart] = useState({});

  // Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState(''); // New: Generated Order ID

  // Add / Remove from Cart
  const handleAddQty = (pkgId) => {
    setCart(prev => ({ ...prev, [pkgId]: (prev[pkgId] || 0) + 1 }));
  };

  const handleSubQty = (pkgId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[pkgId] > 1) {
        newCart[pkgId] -= 1;
      } else {
        delete newCart[pkgId];
      }
      return newCart;
    });
  };

  // Validation
  let isAccountValid = false;
  if (game.type === 'topup') isAccountValid = validatedName !== null && contactInfo.length > 5;
  if (isJoki) isAccountValid = username.length > 3 && password.length > 3 && phone.length > 8;
  if (isRoblox) isAccountValid = username.length > 2 && password.length > 3 && backupCode.length > 3 && phone.length > 8;
  if (isMLBBLogin) isAccountValid = username.length > 3 && password.length > 3 && phone.length > 8 && nickname.length > 2;

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

  const isCartValid = isJoki ? (jokiStats.stars > 0 && !jokiStats.error) : Object.keys(cart).length > 0;
  const isFormValid = isAccountValid && isCartValid;

  const totalAmount = isJoki
    ? jokiStats.price
    : Object.entries(cart).reduce((sum, [pkgId, qty]) => {
      const pkg = currentPackages.find(p => p.id === pkgId);
      return sum + (pkg ? pkg.price * qty : 0);
    }, 0);

  // Handle Order Submit (Simulated Telegram Webhook)
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!receiptFile) return alert("Please upload payment receipt screenshot.");

    setIsUploading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 2000));

    setIsUploading(false);
    setIsPaymentModalOpen(false);
    // Generate Random Order ID (e.g. QX-8472910)
    setGeneratedOrderId('QX-' + Math.floor(1000000 + Math.random() * 9000000));
    setOrderSuccess(true);
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-[#0a0913]">
        <div className="bg-[#131122] p-8 rounded-3xl border border-[#282442] shadow-2xl max-w-md w-full text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Submitted!</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            We have received your payment screenshot via Telegram. Our admins are verifying it now. Your order will be processed shortly.
          </p>
          <div className="bg-[#1d1936] rounded-xl p-4 mb-6 text-left border border-[#282442]">
            <div className="mb-4 pb-4 border-b border-[#282442]">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID (Save for tracking)</p>
              <div className="flex items-center justify-between bg-black p-3 rounded-lg border border-[#282442]">
                <p className="text-xl font-mono font-bold text-white tracking-widest">{generatedOrderId}</p>
                <button
                  onClick={() => {
                    document.execCommand('copy');
                    // Note: Fallback for clipboard in iframe. Ideally use navigator.clipboard in prod.
                  }}
                  className="text-cyan-400 hover:text-cyan-300 p-2 bg-cyan-500/10 rounded-md transition-colors group relative"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-400 mb-4">RM {totalAmount.toFixed(2)}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Target Account</p>
            <p className="text-sm font-mono text-white break-all">{isJoki || isLogin ? username : `${userId} (${zoneId})`}</p>
          </div>
          <button onClick={onBack} className="w-full py-3 bg-[#1d1936] hover:bg-[#282442] border border-[#282442] text-white rounded-xl font-bold transition-all">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen relative">
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
          <div className="bg-[#131122] rounded-2xl p-6 border border-[#282442] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${isJoki || isLogin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
            <div className="flex items-center gap-4 mb-6 border-b border-[#282442] pb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isJoki || isLogin ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>1</div>
              <h2 className="text-xl font-bold text-white">Enter Account Details</h2>
            </div>

            {/* DIRECT TOPUP FORM */}
            {game.type === 'topup' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">User ID</label>
                    <input type="text" value={userId} onChange={(e) => { setUserId(e.target.value); setValidatedName(null); }} placeholder="e.g. 12345678" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Zone ID</label>
                    <input type="text" value={zoneId} onChange={(e) => { setZoneId(e.target.value); setValidatedName(null); }} placeholder="(1234)" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp Number / Email (For Receipt)</label>
                  <input type="text" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="0123456789 or email@example.com" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                  <p className="text-xs text-slate-500"><ShieldCheck className="w-3 h-3 inline mr-1" /> No password needed.</p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!userId) return;
                      setIsValidating(true);
                      // Simulate API delay fetching from Moonton Server
                      await new Promise(r => setTimeout(r, 1200));
                      setIsValidating(false);
                      setValidatedName("QylexPlayer01"); // In a real app, this is fetched via API
                    }}
                    disabled={!userId || isValidating || validatedName}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${validatedName ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : !userId ? 'bg-[#1d1936] text-slate-500 cursor-not-allowed border border-[#282442]' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'}`}
                  >
                    {isValidating ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Checking Server...</>
                    ) : validatedName ? (
                      <><CheckCircle2 className="w-4 h-4" /> Verified</>
                    ) : (
                      "Verify ID"
                    )}
                  </button>
                </div>

                {validatedName && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1d1936] flex items-center justify-center text-lg border border-[#282442]">🦁</div>
                      <div>
                        <p className="text-emerald-400 text-sm font-bold">{validatedName}</p>
                        <p className="text-emerald-500/60 text-xs">Region & ID Match Confirmed</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                  </div>
                )}
              </div>
            )}

            {/* LOGIN / JOKI FORM */}
            {(isJoki || isLogin) && (
              <div className="space-y-4">
                {(isMLBBLogin || isJoki) && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Login Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Moonton', 'TikTok', 'Facebook'].map(method => (
                        <button key={method} onClick={() => setLoginMethod(method)} className={`py-2 rounded-lg text-sm font-medium border transition-all ${loginMethod === method ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-black border-[#282442] text-slate-400 hover:border-slate-500'}`}>{method}</button>
                      ))}
                    </div>
                  </div>
                )}
                {isMLBBLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">In-Game Nickname</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Your Name" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">{isRoblox ? "Username" : "Email / Username"}</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={isRoblox ? "RobloxUser123" : "example@email.com"} className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Password</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                </div>
                {isRoblox && (
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Backup Code (Required)</label>
                    <input type="text" value={backupCode} onChange={(e) => setBackupCode(e.target.value)} placeholder="123456" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Phone Number (WhatsApp)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="012-3456789" className="w-full bg-black border border-[#282442] rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* 2. Select Package (CART SYSTEM ENABLED) */}
          <div className="bg-[#131122] rounded-2xl p-6 border border-[#282442] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <div className="flex items-center gap-4 mb-6 border-b border-[#282442] pb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">2</div>
              <h2 className="text-xl font-bold text-white">{isJoki ? "Select Target Rank" : "Select Packages (Multi-Cart)"}</h2>
            </div>

            {isJoki ? (
              <div className="space-y-6">
                <JokiRankSelector label="Current Rank" value={startRank} onChange={setStartRank} />
                <div className="flex justify-center"><ArrowRight className="text-slate-500 rotate-90 sm:rotate-0" /></div>
                <JokiRankSelector label="Target Rank" value={targetRank} onChange={setTargetRank} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentPackages.map((pkg) => {
                  const qty = cart[pkg.id] || 0;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => { if (qty === 0) handleAddQty(pkg.id) }}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${qty > 0 ? 'bg-cyan-900/10 border-cyan-400' : 'bg-black border-[#282442] cursor-pointer hover:border-slate-600'}`}
                    >
                      {pkg.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full shadow-md uppercase tracking-wide whitespace-nowrap">{pkg.tag}</div>}
                      <div className="flex flex-col items-center text-center mt-2">
                        <div className="w-10 h-10 mb-2 flex items-center justify-center text-2xl">{isRoblox ? '🟥' : '💎'}</div>
                        <h3 className="text-white font-bold text-sm">{pkg.name}</h3>
                        <p className="text-slate-400 text-xs mt-1">{pkg.bonus}</p>

                        {qty > 0 ? (
                          <div className="mt-3 flex items-center justify-between w-full bg-[#1d1936] rounded-lg p-1 border border-[#282442]">
                            <button onClick={(e) => { e.stopPropagation(); handleSubQty(pkg.id); }} className="w-8 h-8 flex items-center justify-center text-white hover:bg-black rounded"><Minus className="w-4 h-4" /></button>
                            <span className="text-white font-bold">{qty}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleAddQty(pkg.id); }} className="w-8 h-8 flex items-center justify-center text-white hover:bg-black rounded"><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="mt-3 w-full pt-3 border-t border-[#282442]">
                            <p className="text-cyan-400 font-bold">RM {pkg.price.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 3. Payment Info */}
          <div className="bg-[#131122] rounded-2xl p-6 pb-12 border border-[#282442] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-4 mb-4 border-b border-[#282442] pb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">3</div>
              <h2 className="text-xl font-bold text-white">Payment Method</h2>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/50 bg-emerald-900/10">
              <div className="flex items-center gap-4">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="text-white font-bold">DuitNow QR (Manual)</h4>
                  <p className="text-emerald-400 text-xs">0% Processing Fee</p>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <br />
            <div className="space-y-3">
              {PAYMENTS.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-slate-800 border-transparent opacity-50 pointer-events-none cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      <img className="h-8" src={method.logo} alt="" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{method.name}</h4>
                      <p className="text-slate-500 text-xs">{method.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <div className="bg-[#131122] rounded-2xl p-6 border border-[#282442] shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-cyan-400" /> Order Cart Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm pb-2 border-b border-[#282442]">
                  <span className="text-slate-400">Game:</span><span className="text-white font-medium text-right">{game.name}</span>
                </div>

                {/* CART ITEMS MAP */}
                <div className="py-2 space-y-2">
                  {isJoki ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Rank Boost ({jokiStats.stars} Stars)</span>
                      <span className="text-white font-medium">RM {jokiStats.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    Object.entries(cart).length === 0 ? (
                      <span className="text-slate-500 text-sm italic">Cart is empty</span>
                    ) : (
                      Object.entries(cart).map(([pkgId, qty]) => {
                        const pkg = currentPackages.find(p => p.id === pkgId);
                        return pkg ? (
                          <div key={pkgId} className="flex justify-between text-sm items-center">
                            <span className="text-slate-300">{pkg.name} <span className="text-cyan-400 font-bold ml-1">x{qty}</span></span>
                            <span className="text-white font-medium">RM {(pkg.price * qty).toFixed(2)}</span>
                          </div>
                        ) : null;
                      })
                    )
                  )}
                </div>

                <div className="flex justify-between text-sm items-center pt-2 border-t border-[#282442]">
                  <span className="text-slate-400">Account Valid:</span>
                  {isAccountValid ? <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-mono">Yes</span> : <span className="text-red-400 text-xs">Required Fields Missing</span>}
                </div>
              </div>

              <div className="border-t border-[#282442] pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 text-sm">Total to Pay</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">RM {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isFormValid ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-cyan-400/30 transform hover:-translate-y-1' : 'bg-[#1d1936] text-slate-500 cursor-not-allowed'}`}
              >
                <Zap className="w-5 h-5 fill-current" /> Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MANUAL QR PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#131122] rounded-3xl p-6 md:p-8 max-w-md w-full border border-[#282442] shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-[#1d1936] p-1 rounded-full"><X className="w-5 h-5" /></button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manual Payment</h2>
              <p className="text-slate-400 text-sm mt-1">Scan QR, pay, and upload receipt.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl mb-6 mx-auto w-48 h-48 flex items-center justify-center border-4 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              {/* DUMMY QR CODE IMAGE */}
              <img src={SITE_CONFIG.qrCodeUrl} alt="DuitNow QR" className="w-full h-full object-contain" />
            </div>

            <div className="bg-[#1d1936] rounded-xl p-4 mb-6 text-center border border-[#282442]">
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Amount to Transfer</p>
              <p className="text-3xl font-bold text-cyan-400">RM {totalAmount.toFixed(2)}</p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Upload Payment Receipt</label>
                <div className="relative border-2 border-dashed border-[#282442] rounded-xl p-4 hover:border-cyan-500/50 transition-colors bg-black text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {receiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium truncate px-2">{receiptFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                      <span className="text-sm">Tap to upload screenshot</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!receiptFile || isUploading}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${!receiptFile ? 'bg-[#1d1936] text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
              >
                {isUploading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending to Admin...</>
                ) : (
                  "Confirm & Send to Admin"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


export default CheckoutView;