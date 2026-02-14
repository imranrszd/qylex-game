import { Edit } from 'lucide-react';

const ProductsTab = ({ games }) => (

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
    {games.map((game) => (
      <div key={game.id} className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all">
        <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${game.image_url})` }}>
          <div key={game.product_id} className="bg-[#1F2937] rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all">
            <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${game.image_url})` }}>
              <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-lg text-white backdrop-blur-md">
                <Edit className="w-4 h-4" />
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold text-lg">{game.title}</h3>
                <h3 className="text-white font-bold text-lg">{game.title}</h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-600">{game.category}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Publisher: {game.publisher}</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 border border-slate-600">Edit Price</button>
                <button className="flex-1 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500/20 border border-red-500/30">Disable</button>
              </div>
            </div>
          </div>
    ))}
        </div>
        );

        export default ProductsTab;