import { useState } from 'react';
import {
  X,
  Edit,
  Trash2,
  Save,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
const ProductEditorModal = ({ product, currentPackages, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');

  // Product Details State
  const [details, setDetails] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    publisher: product?.publisher || '',
    category: product?.category || 'MOBA',
    platform: product?.platform || 'mobile',
    type: product?.type || 'topup',
    image: product?.image_url || '',
    provider: product?.provider || 'MooGold', // Supplier Settings
    providerId: product?.providerId || ''      // Supplier Product ID
  });

  // Packages State
  const [packages, setPackages] = useState(currentPackages || []);

  const handlePackageChange = (index, field, value) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: field === 'price' || field === 'original' ? parseFloat(value) : value };
    setPackages(updated);
  };

  const handleAddNewPackage = () => {
    setPackages([...packages, { id: `new_${Date.now()}`, name: "New Package", price: 0, original: 0, bonus: "x0" }]);
  };

  const handleDeletePackage = (index) => {
    const updated = packages.filter((_, i) => i !== index);
    setPackages(updated);
  };

  // Simulate Fetching Variations from Supplier
  const handleFetchVariations = () => {
    if (!details.providerId) return alert("Please enter a Provider Product ID first.");

    const confirmFetch = window.confirm(`Fetch variations from ${details.provider} for ID ${details.providerId}? This is a simulation.`);
    if (confirmFetch) {
      alert(`Successfully fetched 5 variations from ${details.provider}!`);
    }
  };

  // Simulate Syncing (Auto-filling packages)
  const handleSyncPriceCards = () => {
    const dummySyncedPackages = [
      { id: `sync_1`, name: "Weekly Pass (Synced)", price: 8.50, original: 9.50, bonus: "Auto-synced" },
      { id: `sync_2`, name: "100 Diamonds (Synced)", price: 10.00, original: 12.00, bonus: "Auto-synced" },
      { id: `sync_3`, name: "500 Diamonds (Synced)", price: 45.00, original: 50.00, bonus: "Auto-synced" },
    ];

    if (window.confirm("This will replace current packages with data from supplier. Continue?")) {
      setPackages(dummySyncedPackages);
      setActiveTab('packages'); // Auto-switch to packages tab to see results
    }
  };

  const handleSave = async () => {
    await onSave(details, packages);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#131122] rounded-2xl w-full max-w-4xl border border-[#282442] shadow-2xl relative max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#282442]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-cyan-400" /> {product ? `Edit ${product.name}` : "Create New Product"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#282442] px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Product Details & Supplier
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'packages' ? 'border-cyan-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Packages & Pricing
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* TAB 1: DETAILS & SUPPLIER */}
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* General Section */}
              <div className="space-y-4">
                <h3 className="text-white font-bold border-l-4 border-blue-500 pl-3">General Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      value={details.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDetails({ ...details, title: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') });
                      }}
                      className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Slug (URL)</label>
                    <input type="text" value={details.slug} onChange={(e) => setDetails({ ...details, slug: e.target.value })} className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                    <select value={details.category} onChange={(e) => setDetails({ ...details, category: e.target.value })} className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm">
                      {['MOBA', 'FPS', 'Battle Royale', 'RPG', 'Sandbox', 'Service'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Platform</label>
                    <select value={details.platform} onChange={(e) => setDetails({ ...details, platform: e.target.value })} className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm">
                      {['mobile', 'pc', 'service'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Type</label>
                    <select value={details.type} onChange={(e) => setDetails({ ...details, type: e.target.value })} className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white text-sm">
                      <option value="topup">Direct ID</option>
                      <option value="login">Login Method</option>
                      <option value="joki">Joki</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Publisher</label>
                    <input type="text" value={details.publisher} onChange={(e) => setDetails({ ...details, publisher: e.target.value })} className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Image (URL)</label>
                    <input type="text" value={details.image} onChange={(e) => setDetails({ ...details, image: e.target.value })} className="w-full bg-black border border-[#282442] rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Supplier Section */}
              <div className="space-y-4 pt-4 border-t border-[#282442]">
                <h3 className="text-white font-bold border-l-4 border-orange-500 pl-3 flex items-center gap-2">
                  Supplier Settings <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">API Integration</span>
                </h3>
                <div className="bg-[#0a0913] p-4 rounded-xl border border-[#282442]">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Provider</label>
                      <select value={details.provider} onChange={(e) => setDetails({ ...details, provider: e.target.value })} className="w-full bg-[#131122] border border-[#282442] rounded-lg px-3 py-2 text-white text-sm">
                        <option>MooGold</option>
                        <option>Smile.One</option>
                        <option>LapakGaming</option>
                        <option>Apigames</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Provider Product ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={details.providerId}
                          onChange={(e) => setDetails({ ...details, providerId: e.target.value })}
                          placeholder="e.g. 4690648"
                          className="flex-1 bg-[#131122] border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                        />
                        <button onClick={handleFetchVariations} className="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg text-xs font-bold whitespace-nowrap">
                          Test / Fetch
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#1d1936] p-3 rounded-lg border border-[#282442]">
                    <div>
                      <p className="text-white text-sm font-bold">Sync Price Cards</p>
                      <p className="text-slate-500 text-xs">Auto-import variations & prices from supplier.</p>
                    </div>
                    <button onClick={handleSyncPriceCards} className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                      <RefreshCw className="w-3 h-3" /> Sync Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold border-l-4 border-cyan-500 pl-3">Package Variations</h3>
                <button onClick={handleAddNewPackage} className="text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1">
                  <PlusCircle className="w-4 h-4" /> Add Row
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#282442]">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-[#1d1936] text-xs uppercase font-bold text-white">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Desc/Bonus</th>
                      <th className="p-3">Price (RM)</th>
                      <th className="p-3">Original (RM)</th>
                      <th className="p-3">Supplier (RM)</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282442] bg-black">
                    {packages.map((pkg, idx) => (
                      <tr key={idx} className="hover:bg-[#131122]">
                        <td className="p-2">
                          <input type="text" value={pkg.name} onChange={(e) => handlePackageChange(idx, 'name', e.target.value)} className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-white w-full" />
                        </td>
                        <td className="p-2">
                          <input type="text" value={pkg.bonus || ''} onChange={(e) => handlePackageChange(idx, 'bonus', e.target.value)} className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-white w-full" />
                        </td>
                        <td className="p-2">
                          <input type="number" step="0.01" value={pkg.price} onChange={(e) => handlePackageChange(idx, 'price', e.target.value)} className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-white w-20" />
                        </td>
                        <td className="p-2">
                          <input type="number" step="0.01" value={pkg.original || 0} onChange={(e) => handlePackageChange(idx, 'original', e.target.value)} className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-slate-500 w-20" />
                        </td>
                        <td className="p-2">
                          <input type="number" step="0.01" value={pkg.original || 0} onChange={(e) => handlePackageChange(idx, 'original', e.target.value)} className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-slate-500 w-20" />
                        </td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleDeletePackage(idx)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {packages.length === 0 && <p className="text-center text-slate-500 text-sm py-4">No packages found. Sync from supplier or add manually.</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#282442] flex justify-end gap-3 bg-[#0a0913]">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white font-medium">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2">
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductEditorModal;