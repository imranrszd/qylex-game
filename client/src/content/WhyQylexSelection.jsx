import { Zap, ShieldCheck, Wallet, Users } from 'lucide-react';

export default function WhyQylexSection() {
  return (
    <div className="bg-slate-900/50 border-t border-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold tracking-wide uppercase mb-4 border border-blue-500/20">The Gamer's Choice</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Why Gamers Choose QylexGame?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of Malaysian gamers who rely on us for seamless top-ups, rank boosting, and exclusive reseller rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Feature 1 */}
          <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all group">
            <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Automated Delivery</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our 24/7 API system ensures your Diamonds, UC, and credits are delivered within seconds of payment. No waiting, just gaming.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all group">
            <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">100% Safe & Legitimate</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We are a registered business (SSM: 202503226171). All products are sourced directly from official game publishers and authorized distributors.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 hover:bg-slate-800/80 transition-all group">
            <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Convenient Local Payment</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pay securely using Malaysia's favorite methods including Touch 'n Go eWallet, GrabPay, FPX Banking, and DuitNow QR.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#1F2937] p-8 rounded-3xl border border-slate-800 hover:border-orange-500/30 hover:bg-slate-800/80 transition-all group">
            <div className="w-14 h-14 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Dedicated Support & Joki</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              From troubleshooting orders to professional Rank Boosting (Joki), our verified team is ready to assist via WhatsApp support.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};