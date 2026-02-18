import { useEffect, useState, useRef } from 'react';
import { X, Edit, Trash2, Save, PlusCircle, RefreshCw, } from 'lucide-react';
import { uploadImage } from '../api/product.api';

const ProductEditorModal = ({ product, currentPackages, onSave, onClose, onSyncSupplier, onLoadPackages }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [packages, setPackages] = useState(currentPackages || []);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const contentRef = useRef(null);

  // Product Details State
  const [details, setDetails] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    publisher: product?.publisher || '',
    category: product?.category || 'MOBA',
    platform: product?.platform || 'mobile',
    type: product?.type || 'topup',
    image_url: product?.image_url || '',
    provider: product?.provider || 'moogold', // Supplier Settings
    provider_product_id: product?.provider_product_id || '',      // Supplier Product ID
    markupPercent: 20,
    requires_validation: product?.requires_validation || false,
    validation_provider: product?.validation_provider || '',
    validation_game_code: product?.validation_game_code || '',
  });

  // Packages State

  useEffect(() => {
    setPackages(currentPackages || []);
  }, [currentPackages, product?.product_id]);

  useEffect(() => {
    if (activeTab === "packages" && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // ✅ Fetch latest from DB when user switches to Packages tab
  useEffect(() => {
    const load = async () => {
      if (activeTab !== "packages") return;
      if (!product?.product_id) return;
      if (!onLoadPackages) return;
      if (isPreviewMode) return;   // ✅ prevent overwrite

      try {
        const rows = await onLoadPackages(product.product_id);
        setPackages(
          rows.map((r, index) => ({
            id: null,
            name: cleanPackageName(r.item_label) || r.provider_variation_id || `Package ${index + 1}`,
            provider: details.provider,
            provider_variation_id: r.provider_variation_id,
            sku: `${details.provider}_${r.provider_variation_id}`,
            price: Number(r.price || 0),
            original: Number(r.original_price || 0),
            cost_price: Number(r.cost_price || 0),
            is_active: true,
            sort_order: 0,
          }))
        );
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, [activeTab, product?.product_id, onLoadPackages, isPreviewMode]);


  useEffect(() => {
    if (!product) return;

    setDetails({
      title: product.title || "",
      slug: product.slug || "",
      publisher: product.publisher || "",
      category: product.category || "MOBA",
      platform: product.platform || "mobile",
      type: product.type || "topup",
      image_url: product.image_url || "",
      provider: product.provider || "moogold",
      provider_product_id: product.provider_product_id || "",
      markupPercent: 20,
      requires_validation: product.requires_validation || false,
      validation_provider: product.validation_provider || "",
      validation_game_code: product.validation_game_code || "",
    });
  }, [product]);

  const cleanPackageName = (rawName) => {
    if (!rawName) return "";
    // 1. Remove SKU/ID like (#123456)
    let clean = rawName.replace(/\s\(#\d+\)/g, "").trim();
    // 2. Remove Game Title before the dash
    if (clean.includes(" - ")) {
      const parts = clean.split(" - ");
      clean = parts.slice(1).join(" - ");
    }
    return clean;
  };

  const handlePackageChange = (index, field, value) => {
    const updated = [...packages];

    const numFields = new Set(["price", "original", "cost_price", "sort_order"]);

    updated[index] = {
      ...updated[index],
      [field]: numFields.has(field)
        ? (value === "" ? "" : Number(value))
        : value
    };

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
    if (!details.provider_product_id) return alert("Please enter a Provider Product ID first.");

    const confirmFetch = window.confirm(`Fetch variations from ${details.provider} for ID ${details.provider_product_id}? This is a simulation.`);
    if (confirmFetch) {
      alert(`Successfully fetched 5 variations from ${details.provider}!`);
    }
  };
  const handleSyncPriceCards = async () => {
    if (!details.provider_product_id)
      return alert("Please enter Provider Product ID first.");

    try {
      const rows = await onSyncSupplier({
        provider_product_id: Number(details.provider_product_id),
        productId: Number(product.product_id),
        markupPercent: details.markupPercent,
        preview: true 
      });

      // Just update UI (no DB write)
      setPackages(
        rows.map((r, index) => ({
          id: null, // ✅ important
          name: cleanPackageName(r.item_label) || r.provider_variation_id || `Package ${index + 1}`,
          sku: `${details.provider}_${r.provider_variation_id}`,
          price: Number(r.price || 0),
          original: Number(r.original_price || 0),
          cost_price: Number(r.cost_price || 0),
          is_active: true,
          sort_order: 0
        }))
      );
      console.log("sync payload", {
  productId: product.product_id,
  provider: details.provider,
  provider_product_id: details.provider_product_id,
  markupPercent: details.markupPercent,
  preview: true
});
      setIsPreviewMode(true);
      setActiveTab("packages");

    } catch (e) {
      alert(`❌ Sync failed: ${e.message}`);
    }
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await uploadImage(file);
      setDetails({ ...details, image_url: data.url });
      alert("Image uploaded!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(details, packages, {
        fromSyncPreview: isPreviewMode
      });

      setIsPreviewMode(false);
      onClose();

    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#131122] rounded-2xl w-full max-w-4xl border border-[#282442] shadow-2xl relative max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#282442]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-cyan-400" /> {product ? `Edit ${product.title}` : "Create New Product"}
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
        <div ref={contentRef} className="overflow-y-auto flex-1 p-6">

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
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Product Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="/images/example.png"
                        value={details.image_url}
                        onChange={(e) => setDetails({ ...details, image_url: e.target.value })}
                        className="flex-1 bg-black border border-[#282442] rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                      />
                      <label className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap flex items-center">
                        <span>Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
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
                        <option value="moogold">MooGold</option>
                        <option value="smile.one">Smile.One</option>
                        <option value="lapakgaming">LapakGaming</option>
                        <option value="apigames">Apigames</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Provider Product ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={details.provider_product_id}
                          onChange={(e) => setDetails({ ...details, provider_product_id: e.target.value })}
                          placeholder="e.g. 4690648"
                          className="flex-1 bg-[#131122] border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                        />
                        <button onClick={handleFetchVariations} className="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg text-xs font-bold whitespace-nowrap">
                          Test / Fetch
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Markup %</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={details.markupPercent}
                        onChange={(e) => setDetails({ ...details, markupPercent: Number(e.target.value) })}
                        className="w-full bg-[#131122] border border-[#282442] rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                        placeholder="e.g. 20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-[#1d1936] p-3 rounded-lg border border-[#282442]">
                    <div>
                      <p className="text-white text-sm font-bold">Sync Price Cards</p>
                      <p className="text-slate-500 text-xs">Auto-import variations & prices from supplier.</p>
                    </div>
                    <button
                      disabled={!product?.product_id}
                      onClick={handleSyncPriceCards}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2
                        ${product?.product_id ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-slate-700 text-slate-400 cursor-not-allowed"}`}
                    >
                      <RefreshCw className="w-3 h-3" /> Sync Now
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 mb-2 items-end">
                    {/* Checkbox Input */}
                    <div className="flex flex-col h-full justify-center">
                      <span className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">
                        Validation Status
                      </span>

                      <label
                        className={`flex items-center h-[38px] px-3 rounded-lg border transition-all cursor-pointer ${details.requires_validation
                          ? 'border-orange-500 bg-orange-500/5'
                          : 'border-[#282442] bg-[#131122] hover:border-slate-700'}`}
                      >
                        <input
                          type="checkbox"
                          checked={details.requires_validation}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setDetails({
                              ...details,
                              requires_validation: checked,
                              validation_provider: checked ? details.validation_provider : "",
                              validation_game_code: checked ? details.validation_game_code : "",
                            });
                          }}
                          className="w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                        <span className={`ml-3 text-sm font-medium transition-colors ${details.requires_validation ? 'text-white' : 'text-slate-400'}`}>
                          Requires Validation
                        </span>
                      </label>
                    </div>

                    {/* Validation Provider - Disabled if checkbox is unticked */}
                    <div>
                      <label className={`block text-xs mb-1 uppercase tracking-wider ${!details.requires_validation ? 'text-slate-600' : 'text-slate-400'}`}>
                        Validation Provider
                      </label>
                      <input
                        type="text"
                        disabled={!details.requires_validation}
                        value={details.validation_provider}
                        onChange={(e) => setDetails({ ...details, validation_provider: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${!details.requires_validation
                          ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-[#131122] border-[#282442] text-white focus:border-orange-500'}`}
                      />
                    </div>

                    {/* Validation Game Code - Disabled if checkbox is unticked */}
                    <div>
                      <label className={`block text-xs mb-1 uppercase tracking-wider ${!details.requires_validation ? 'text-slate-600' : 'text-slate-400'}`}>
                        Validation Game Code
                      </label>
                      <input
                        type="text"
                        disabled={!details.requires_validation}
                        value={details.validation_game_code}
                        onChange={(e) => setDetails({ ...details, validation_game_code: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${!details.requires_validation
                          ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-[#131122] border-[#282442] text-white focus:border-orange-500'}`}
                      />
                    </div>
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
                      <th className="p-3">Profit (RM)</th>
                      <th className="p-3">Margin %</th>
                      <th className="p-3 text-center">Action</th>
                      <th className="p-3">Order</th>
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
                          <input type="number" step="0.01" value={pkg.cost_price || 0} onChange={(e) => handlePackageChange(idx, 'cost_price', e.target.value)} className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-slate-500 w-20" />
                        </td>
                        <td className="p-2 text-white">
                          {(Number(pkg.price || 0) - Number(pkg.cost_price || 0)).toFixed(2)}
                        </td>

                        <td className="p-2 text-white">
                          {Number(pkg.cost_price || 0) > 0
                            ? (((Number(pkg.price || 0) - Number(pkg.cost_price || 0)) / Number(pkg.cost_price)) * 100).toFixed(1)
                            : "0.0"}
                        </td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleDeletePackage(idx)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={pkg.sort_order || 0}
                            onChange={(e) => handlePackageChange(idx, 'sort_order', parseInt(e.target.value))}
                            className="bg-transparent border-b border-transparent focus:border-cyan-500 outline-none text-white w-12"
                          />
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