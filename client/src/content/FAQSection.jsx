import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

// --- FAQ DATA ---
const FAQ_ITEMS = [
  { q: "Is it safe to give my password for Joki/Login Topup?", a: "Yes. QylexGame is an SSM registered company (202503226171). We use AES-256 encryption and our Joki players are verified professionals. We recommend changing your password after the service is completed." },
  { q: "How long does the top-up take?", a: "For direct ID top-ups (MLBB, PUBG, Valorant), it is instant (1-5 seconds). For Login methods and Joki services, it depends on the queue, usually 5-10 minutes for top-ups and 1-3 days for rank boosting." },
  { q: "What payment methods do you accept?", a: "We accept all major Malaysian payment methods including Touch 'n Go eWallet, GrabPay, DuitNow QR, and FPX Online Banking." },
  { q: "Can I request a refund?", a: "Refunds are processed if the item is out of stock or if the service cannot be completed. Please contact our WhatsApp support for assistance." }
];

// --- NEW STRATEGY 3: FAQ SECTION ---
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-slate-900/30 border-t border-slate-800 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2"><HelpCircle className="w-6 h-6 text-cyan-400" /> Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Got questions? We've got answers.</p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-[#1F2937] rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-bold text-slate-200">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="p-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 bg-slate-800/20">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};