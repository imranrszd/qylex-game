import {
  Sword,
  Users,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
// --- ADMIN MOCK DATA ---
export const ADMIN_STATS = [
  { label: "Total Revenue", value: "RM 12,450", change: "+15%", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Orders Today", value: "145", change: "+8%", icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Joki Queue", value: "12 Pending", change: "-2", icon: Sword, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Active Resellers", value: "48", change: "+3", icon: Users, color: "text-orange-400", bg: "bg-orange-500/10" },
];

export const ADMIN_ORDERS = [
  { id: "QX-8812", user: "Aiman Hakim", item: "Weekly Pass", price: "RM 8.60", status: "Success", date: "Just now", method: "TNG" },
  { id: "QX-8811", user: "Sarah L.", item: "1155 Diamonds", price: "RM 71.00", status: "Processing", date: "5 mins ago", method: "FPX" },
  { id: "QX-8810", user: "GamingKing", item: "Epic -> Legend", price: "RM 45.00", status: "In Progress", date: "1 hour ago", method: "Grab" },
  { id: "QX-8809", user: "Wong Wei", item: "500 Robux", price: "RM 19.90", status: "Success", date: "2 hours ago", method: "TNG" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
  { id: "QX-8808", user: "Siti Nur", item: "Twilight Pass", price: "RM 38.00", status: "Success", date: "3 hours ago", method: "Card" },
];

export const ADMIN_CUSTOMERS = [
  { id: 1, name: "Aiman Hakim", phone: "012-3456789", spent: "RM 450.00", orders: 12, status: "Active" },
  { id: 2, name: "Sarah L.", phone: "017-8889999", spent: "RM 1,200.50", orders: 35, status: "VIP" },
  { id: 3, name: "GamingKing", phone: "019-1112222", spent: "RM 85.00", orders: 4, status: "Active" },
  { id: 4, name: "Wong Wei", phone: "011-2223333", spent: "RM 19.90", orders: 1, status: "New" },
  { id: 5, name: "Siti Nur", phone: "013-4445555", spent: "RM 380.00", orders: 8, status: "Active" },
];

// --- FAKE REVIEW DATA ---
export const REVIEWS_DATA = [
  { id: 1, user: "Amirul H.", text: "Mantap bossku! Diamonds masuk dalam 5 saat je. Trusted seller!", rating: 5, date: "5 mins ago", tag: "Mobile Legends" },
  { id: 2, user: "Sarah L.", text: "First time beli sini, ingatkan scam rupanya legit. Will repeat soon!", rating: 5, date: "12 mins ago", tag: "Mobile Legends" },
  { id: 3, user: "Gary T.", text: "Fast delivery, cheaper than Codashop. Recommended.", rating: 5, date: "25 mins ago", tag: "Valorant" },
  { id: 4, user: "Irfan Gaming", text: "Joki padu mat! Winstreak 10 game straight. Player pro gila.", rating: 5, date: "1 hour ago", tag: "MLBB Rank Boost" },
  { id: 5, user: "Siti A.", text: "Robux murah gila banding kedai lain. Anak buah happy dapat skin baru.", rating: 5, date: "2 hours ago", tag: "Roblox" },
  { id: 6, user: "Kevin K.", text: "PUBG UC received instantly. Safe and secure payment via TNG.", rating: 4, date: "3 hours ago", tag: "PUBG Mobile" },
  { id: 7, user: "Aiman_X", text: "Servis laju, admin reply WhatsApp pun cepat. Terbaik Qylex!", rating: 5, date: "4 hours ago", tag: "MLBB (Via Login)" },
  { id: 8, user: "Nurul Izzah", text: "Senang je nak topup, tak payah pening2. Masuk ID terus dapat.", rating: 5, date: "Yesterday", tag: "Genshin Impact" },
];

export const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    pin: '1234',
    role: 'ADMIN',
    name: 'Q',
    redirect: '/admin/dashboard/overview'
  },
  {
    id: 2,
    username: 'cust',
    pin: '0000',
    role: 'CUSTOMER',
    name: 'John',
    redirect: '/'
  }
];