import { ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function GameCard({ game, onClick }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/checkout/${game.slug}`)} className="group relative bg-[#1F2937] rounded-2xl overflow-hidden cursor-pointer border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
      <div className="h-48 relative overflow-hidden bg-white">
        {game.image_url ? (
          <img
            src={game.image_url}
            alt={game.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full white flex items-center justify-center">
            {/* Optional: Add a placeholder icon or game title here */}
            <span className="text-slate-500">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#1F2937] to-transparent opacity-90"></div>
        {/* <div className="absolute bottom-4 left-4"><div className="text-4xl mb-2">{game.icon}</div></div> */}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{game.title}</h3>
        <p className="text-slate-400 text-sm mt-1">{game.publisher}</p>
        <div className="mt-4 flex gap-3 md:gap-0 items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs font-medium border border-slate-700 ${game.category === 'Service' ? 'bg-purple-900/50 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400'}`}>{game.category}</span>
          <span className="text-cyan-400 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-auto">
            {game.type === 'joki' ? 'Boost' : 'Top Up'} <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}