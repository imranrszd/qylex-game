import tng from '../assets/tng-logo.png';
import grabpay from '../assets/grabpay-logo.png';
import fpx from '../assets/fpx-logo.png';
export default function Footer() {
  return (
    <footer className="bg-[#050f1e] border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Qylex<span className="text-cyan-400">Game</span></h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              The #1 Trusted Gaming Marketplace in Malaysia. Secure, fast, and affordable.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-cyan-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-cyan-400">FAQ</a></li>
              <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            {/* <h4 className="text-white font-bold mb-4">Partnership</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-cyan-400">Reseller Login</a></li>
              <li><a href="#" className="hover:text-cyan-400">API Documentation</a></li>
            </ul> */}
          </div>
          <div>
            <h4 className=" font-bold mb-4">Payment Methods</h4>
            <div className="flex gap-2 justify-center md:justify-start">
              <div className="w-10 rounded border border-slate-900">
                <img src={tng} alt="" />
              </div>
              <div className="w-10 rounded border border-slate-900">
                <img src={grabpay} alt="" />

              </div>
              <div className="w-14 rounded border border-slate-900">
                <img src={fpx} alt="" />

              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-600 text-sm">
          &copy; 2026 Qylex Solution (SSM: 202503226171). All rights reserved.
        </div>
      </div>
    </footer>
  );
}