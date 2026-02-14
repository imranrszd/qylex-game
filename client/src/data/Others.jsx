import {
  Smartphone,
  Sword,
  Monitor,
  Gamepad2,
  Ticket,
} from 'lucide-react';

import mlbbImg from '../assets/mlbb-logo.png';
import robloxImg from '../assets/roblox-logo.jpg';
import valorantImg from '../assets/valorant-logo.jpg';
import genshinImg from '../assets/genshin-logo.png';
import pubgImg from '../assets/pubgmobile-logo.jpg';

import tng from '../assets/tng-logo.png';
import grabpay from '../assets/grabpay-logo.png';
import fpx from '../assets/fpx-logo.png';

export const SITE_CONFIG = {
  whatsapp: "60198313202", // Q Store Number
  adminPin: "1234" // Simple PIN for MVP Protection
};

// TYPES: 'topup' (ID only), 'joki' (Rank Calc), 'login' (Account Credentials)
export const GAMES = [
  { id: 1, name: "Mobile Legends", slug: "mobile-legends", publisher: "Moonton", category: "MOBA", type: "topup", platform: "mobile", image: mlbbImg },
  { id: 100, name: "MLBB (Via Login)", slug: "mlbb-login", publisher: "Moonton", category: "MOBA", type: "login", platform: "mobile", image: mlbbImg },
  { id: 101, name: "Roblox", slug: "roblox", publisher: "Roblox Corp", category: "Sandbox", type: "login", platform: "mobile", image: robloxImg },
  { id: 99, name: "MLBB Rank Boost", slug: "mlbb-rank-boost", publisher: "Qylex Pro Team", category: "Service", type: "joki", platform: "service", image: mlbbImg },
  { id: 2, name: "PUBG Mobile", slug: "pubg-mobile", publisher: "Tencent", category: "Battle Royale", type: "topup", platform: "mobile", image: pubgImg },
  { id: 3, name: "Valorant", slug: "valorant", publisher: "Riot Games", category: "FPS", type: "topup", platform: "pc", image: valorantImg },
  { id: 4, name: "Genshin Impact", slug: "genshin-impact", publisher: "HoYoverse", category: "RPG", type: "topup", platform: "mobile", image: genshinImg },
];

export const PAYMENTS = [
  { id: 'tng', name: "Touch 'n Go", type: "E-Wallet", fee: "0%", logo: tng, icon: "🔵" },
  { id: 'grab', name: "GrabPay", type: "E-Wallet", fee: "0%", logo: grabpay, icon: "🟢" },
  { id: 'fpx', name: "FPX Banking", type: "Direct Debit", fee: "RM 1.00", logo: fpx, icon: "🏦" },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Games', icon: Gamepad2 },
  { id: 'mobile', label: 'Mobile Games', icon: Smartphone },
  { id: 'pc', label: 'PC Games', icon: Monitor },
  { id: 'vouchers', label: 'Vouchers', icon: Ticket },
  { id: 'service', label: 'Services', icon: Sword },
];