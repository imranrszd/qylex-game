import { useState, useEffect } from 'react';
import {
  ChevronRight
} from 'lucide-react';

import robloxBg from '../assets/roblox-bg.jpeg';

const PROMO_SLIDES = [
  {
    id: 1,
    title: "Double 11 Mega Sale",
    description: "Get up to 50% Bonus Diamonds on all Mobile Legends top-ups this weekend only!",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
    color: "from-blue-600 to-purple-600",
    cta: "Top Up Now"
  },
  {
    id: 2,
    title: "Roblox Restocked",
    description: "Premium Robux packs now available via Login method. Safer, cheaper, and reliable.",
    image: robloxBg,
    color: "from-red-600 to-orange-600",
    cta: "Buy Robux"
  },
  {
    id: 3,
    title: "Joki Service Available",
    description: "Stuck in Epic? Let our Pro Players boost your rank. Secure, Fast, and Win Rate guaranteed.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2671&ixlib=rb-4.0.3",
    color: "from-purple-600 to-pink-600",
    cta: "Boost Rank"
  }
];

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % PROMO_SLIDES.length); }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative h-96 md:h-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 group">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {PROMO_SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className={`absolute inset-0 bg-linear-to-r ${slide.color} opacity-80 mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-linear-to-t from-[#0B1D3A] via-transparent to-transparent"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-3xl">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 uppercase tracking-wider">{slide.title.includes("Joki") ? "Pro Service" : "Featured Event"}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">{slide.title}</h2>
                <p className="text:xs leading-tight sm:leading-0 sm:text-lg text-slate-200 mb-8 max-w-xl">{slide.description}</p>
                <button className="w-fit px-4 sm:px-8 py-2 sm:py-4 bg-white text-slate-900 font-bold rounded sm:rounded-xl shadow-lg hover:bg-slate-100 transform hover:-translate-y-1 transition-all flex items-center gap-2">{slide.cta} <ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {PROMO_SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-500/50 hover:bg-slate-400'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};