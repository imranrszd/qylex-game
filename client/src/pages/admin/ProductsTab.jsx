import { useState } from "react";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

const ProductsTab = ({ games, onEdit, onDelete, onDisable, onEnable }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
        {games.map((game) => (
          <div
            key={game.product_id}
            className={`bg-[#1F2937] rounded-2xl border overflow-hidden transition-all ${
              game.is_active
                ? "border-slate-700 hover:border-cyan-500/50"
                : "border-red-500/40 opacity-75"
            }`}
          >
            <div
              className="h-32 bg-cover bg-center bg-white relative"
              style={{ backgroundImage: `url(${game.image_url})` }}
            >
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEdit?.(game)}
                className="absolute top-2 right-12 bg-black/50 p-2 rounded-lg text-white backdrop-blur-md hover:bg-black/70 transition"
                aria-label={`Edit ${game.title}`}
              >
                <Edit className="w-4 h-4" />
              </button>

              {/* More menu */}
              <button
                type="button"
                onClick={() =>
                  setOpenMenuId(openMenuId === game.product_id ? null : game.product_id)
                }
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-lg text-white backdrop-blur-md hover:bg-black/70 transition"
                aria-label={`More actions for ${game.title}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {openMenuId === game.product_id && (
                <div className="absolute top-12 right-2 w-52 bg-[#131122] border border-[#282442] rounded-xl shadow-xl overflow-hidden z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      onEdit?.(game);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#1d1936]"
                  >
                    Edit Product
                  </button>

                  {/* ✅ Disable / Enable inside menu (correct styling) */}
                  {game.is_active ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onDisable?.(game);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onEnable?.(game);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-green-300 hover:bg-green-500/10"
                    >
                      Enable
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuId(null);
                      setConfirmDelete(game);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete permanently
                  </button>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold text-lg">{game.title}</h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-600">
                  {game.category}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-4">Publisher: {game.publisher}</p>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 border border-slate-600">
                  Edit Price
                </button>

                {/* ✅ Bottom button also toggles */}
                {game.is_active ? (
                  <button
                    type="button"
                    onClick={() => onDisable?.(game)}
                    className="flex-1 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded hover:bg-red-500/20 border border-red-500/30"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEnable?.(game)}
                    className="flex-1 py-2 bg-green-500/10 text-green-400 text-xs font-bold rounded hover:bg-green-500/20 border border-green-500/30"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#131122] rounded-2xl p-6 w-full max-w-md border border-[#282442] shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">
              Delete “{confirmDelete.title}”?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently remove the product. This action can’t be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 bg-[#1d1936] text-slate-300 rounded-xl text-sm font-bold hover:bg-[#282442]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete?.(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsTab;
