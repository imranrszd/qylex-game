
import { useState, useEffect } from "react";
import { Edit, Trash2, PlusCircle, Save, X } from "lucide-react";


// --- EDIT PACKAGE MODAL ---
const EditPackagesModal = ({ game, currentPackages, onSave, onClose }) => {
  const [packages, setPackages] = useState(currentPackages || []);
  useEffect(() => {
    setPackages(currentPackages || []);
  }, [currentPackages]);

  const handleChange = (index, field, value) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: field === 'price' || field === 'original' ? parseFloat(value) : value };
    setPackages(updated);
  };

  const handleAddNew = () => {
    setPackages([...packages, { id: `new_${Date.now()}`, name: "New Package", price: 0, original: 0, bonus: "x0" }]);
  };

  const handleDelete = (index) => {
    const updated = packages.filter((_, i) => i !== index);
    setPackages(updated);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#131122] rounded-2xl p-6 w-full max-w-4xl border border-[#282442] shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-cyan-400" /> Edit Packages: {game.name}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-[#1d1936] text-xs uppercase font-bold text-white sticky top-0">
              <tr>
                <th className="p-3">Package Name</th>
                <th className="p-3">Bonus/Desc</th>
                <th className="p-3">Price (RM)</th>
                <th className="p-3">Original (RM)</th>
                <th className="p-3">Supplier (RM)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282442]">
              {packages.map((pkg, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="p-2">
                    <input type="text" value={pkg.name} onChange={(e) => handleChange(idx, 'name', e.target.value)} className="bg-black border border-[#282442] rounded px-2 py-1 text-white w-full" />
                  </td>
                  <td className="p-2">
                    <input type="text" value={pkg.bonus || ''} onChange={(e) => handleChange(idx, 'bonus', e.target.value)} className="bg-black border border-[#282442] rounded px-2 py-1 text-white w-full" />
                  </td>
                  <td className="p-2">
                    <input type="number" step="0.01" value={pkg.price} onChange={(e) => handleChange(idx, 'price', e.target.value)} className="bg-black border border-[#282442] rounded px-2 py-1 text-white w-24" />
                  </td>
                  <td className="p-2">
                    <input type="number" step="0.01" value={pkg.original || 0} onChange={(e) => handleChange(idx, 'original', e.target.value)} className="bg-black border border-[#282442] rounded px-2 py-1 text-white w-24" />
                  </td>
                  <td className="p-2">
                    <input type="number" step="0.01" value={pkg.original || 0} onChange={(e) => handleChange(idx, 'original', e.target.value)} className="bg-black border border-[#282442] rounded px-2 py-1 text-white w-24" />
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={() => handleDelete(idx)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleAddNew} className="w-full py-3 mt-4 border border-dashed border-[#282442] rounded-xl text-slate-500 hover:text-white hover:border-cyan-500 transition-all flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add New Package Row
          </button>
        </div>

        <div className="pt-6 border-t border-[#282442] flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white font-medium">Cancel</button>
          <button onClick={() => onSave(packages)} className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackagesModal;