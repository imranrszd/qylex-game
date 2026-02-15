import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

// --- FAKE NOTIFICATION DATA ---
const FAKE_NOTIFICATIONS = [
  { user: "Aiman**", item: "Weekly Diamond Pass", time: "Just now" },
  { user: "Nurul**", item: "1155 Diamonds", time: "2 mins ago" },
  { user: "Haziq**", item: "Epic Rank Boost", time: "1 min ago" },
  { user: "Wong**", item: "500 Robux", time: "Just now" },
  { user: "Irfan**", item: "Valorant Points", time: "5 mins ago" },
  { user: "Sarah**", item: "Twilight Pass", time: "Just now" }
];

// --- NEW STRATEGY 1: LIVE NOTIFICATIONS ---
export default function LiveSalesNotification() {
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
    <div className="fixed bottom-6 left-4 z-50 animate-in slide-in-from-left duration-500">
      <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-2 rounded-xl shadow-2xl flex items-center gap-3 pr-6">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400">{data.time}</p>
          <p className="text-xs sm:text-sm font-bold text-white"><span className="text-cyan-400">{data.user}</span> bought {data.item}</p>
        </div>
      </div>
    </div>
  );
};