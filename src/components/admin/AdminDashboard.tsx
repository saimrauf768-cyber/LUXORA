import React, { useState } from 'react';
import { Watch, Order, WatchCategory, Model3DConfig } from '../../types/watch';
import { formatPKR } from '../../utils/currency';
import { generateWatchImage } from '../../utils/watchImageGenerator';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Sparkles,
  TrendingUp,
  Package,
  FileText,
  RefreshCw,
  Search,
  Eye
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  watches: Watch[];
  orders: Order[];
  onAddWatch: (watch: Watch) => void;
  onUpdateWatch: (watch: Watch) => void;
  onDeleteWatch: (watchId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onResetDefaults: () => void;
}

const CATEGORIES: WatchCategory[] = [
  'Luxury Watches',
  "Men's Watches",
  "Women's Watches",
  'Sports Watches',
  'Smart Watches',
  'Automatic Watches',
  'Chronograph Watches',
  'Casual Watches',
  'Limited Edition Watches',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  watches,
  orders,
  onAddWatch,
  onUpdateWatch,
  onDeleteWatch,
  onUpdateOrderStatus,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'watches' | 'add' | 'orders' | 'analytics'>('watches');
  const [editingWatchId, setEditingWatchId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State for Adding / Editing Watch
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('LUXORA Bespoke');
  const [category, setCategory] = useState<WatchCategory>('Luxury Watches');
  const [originalPricePKR, setOriginalPricePKR] = useState<number>(8500000);
  const [discountedPricePKR, setDiscountedPricePKR] = useState<number>(7200000);
  const [description, setDescription] = useState('');
  const [heritageStory, setHeritageStory] = useState('');
  const [strapMaterial, setStrapMaterial] = useState('18K Solid Gold Link Bracelet');
  const [caseMaterial, setCaseMaterial] = useState('18K Yellow Gold with Mirror Bevels');
  const [watchSize, setWatchSize] = useState('41mm');
  const [stockAvailability, setStockAvailability] = useState<number>(3);
  const [isLimitedEdition, setIsLimitedEdition] = useState<boolean>(false);
  const [editionLimit, setEditionLimit] = useState<string>('01 / 25 Pieces');

  // Specs
  const [calibre, setCalibre] = useState('LX-9000 Perpetual Chronometer');
  const [powerReserve, setPowerReserve] = useState('72 Hours');
  const [waterResistance, setWaterResistance] = useState('100m');
  const [movementType, setMovementType] = useState<Watch['specs']['movement']>('Automatic');

  // 3D Config
  const [caseStyle, setCaseStyle] = useState<Model3DConfig['caseStyle']>('classic-round');
  const [bezelType, setBezelType] = useState<Model3DConfig['bezelType']>('fluted');
  const [dialColor, setDialColor] = useState<string>('#064e3b');
  const [metalFinish, setMetalFinish] = useState<Model3DConfig['metalFinish']>('yellow-gold');
  const [strapType, setStrapType] = useState<Model3DConfig['strapType']>('metal-bracelet');
  const [hasTourbillon, setHasTourbillon] = useState<boolean>(false);
  const [hasChronographSubdials, setHasChronographSubdials] = useState<boolean>(true);

  // Uploaded Images
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  if (!isOpen) return null;

  // Handle local image file upload (converts to base64 so it works without server upload!)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setUploadedImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const resetForm = () => {
    setEditingWatchId(null);
    setName('');
    setBrand('LUXORA Bespoke');
    setCategory('Luxury Watches');
    setOriginalPricePKR(8500000);
    setDiscountedPricePKR(7200000);
    setDescription('');
    setHeritageStory('');
    setStrapMaterial('18K Solid Gold Link Bracelet');
    setCaseMaterial('18K Yellow Gold with Mirror Bevels');
    setWatchSize('41mm');
    setStockAvailability(3);
    setIsLimitedEdition(false);
    setCalibre('LX-9000 Perpetual Chronometer');
    setPowerReserve('72 Hours');
    setWaterResistance('100m');
    setMovementType('Automatic');
    setCaseStyle('classic-round');
    setBezelType('fluted');
    setDialColor('#064e3b');
    setMetalFinish('yellow-gold');
    setStrapType('metal-bracelet');
    setHasTourbillon(false);
    setHasChronographSubdials(true);
    setUploadedImages([]);
  };

  const startEditWatch = (watch: Watch) => {
    setEditingWatchId(watch.id);
    setName(watch.name);
    setBrand(watch.brand);
    setCategory(watch.category);
    setOriginalPricePKR(watch.originalPricePKR);
    setDiscountedPricePKR(watch.discountedPricePKR);
    setDescription(watch.description);
    setHeritageStory(watch.heritageStory || '');
    setStrapMaterial(watch.strapMaterial);
    setCaseMaterial(watch.caseMaterial);
    setWatchSize(watch.watchSize);
    setStockAvailability(watch.stockAvailability);
    setIsLimitedEdition(!!watch.isLimitedEdition);
    setEditionLimit(watch.editionLimit || '');
    setCalibre(watch.specs.calibre);
    setPowerReserve(watch.specs.powerReserve);
    setWaterResistance(watch.specs.waterResistance);
    setMovementType(watch.specs.movement);
    setCaseStyle(watch.model3DConfig.caseStyle);
    setBezelType(watch.model3DConfig.bezelType);
    setDialColor(watch.model3DConfig.dialColor);
    setMetalFinish(watch.model3DConfig.metalFinish);
    setStrapType(watch.model3DConfig.strapType);
    setHasTourbillon(watch.model3DConfig.hasTourbillon);
    setHasChronographSubdials(watch.model3DConfig.hasChronographSubdials);
    setUploadedImages(watch.images || []);
    setActiveTab('add');
  };

  const handleSubmitWatch = (e: React.FormEvent) => {
    e.preventDefault();

    const watchData: Watch = {
      id: editingWatchId || 'watch-' + Date.now(),
      name,
      brand,
      category,
      secondaryCategories: [category],
      originalPricePKR,
      discountedPricePKR,
      description: description || `Masterfully executed ${name} by ${brand}, designed with uncompromising attention to chronometric precision.`,
      heritageStory: heritageStory || 'Crafted with Swiss horological tradition.',
      availableColors: [
        { name: 'Signature Dial', hex: dialColor, dialColor: dialColor },
        { name: 'Onyx Midnight', hex: '#09090b', dialColor: '#09090b' },
      ],
      strapMaterial,
      caseMaterial,
      watchSize,
      stockAvailability,
      rating: 5.0,
      reviews: [
        {
          id: 'admin-rev-1',
          author: 'VIP Client Review',
          city: 'Karachi',
          rating: 5,
          date: 'Just now',
          title: 'Unbelievable mechanical presence',
          comment: 'The finishing and 3D precision are truly exemplary.',
          verified: true,
        },
      ],
      images: uploadedImages,
      model3DConfig: {
        caseStyle,
        bezelType,
        dialPattern: hasChronographSubdials ? 'chronograph' : (hasTourbillon ? 'skeleton' : 'sunray'),
        dialColor,
        metalFinish,
        strapType,
        hasTourbillon,
        hasChronographSubdials,
        accentColor: '#f59e0b',
      },
      specs: {
        calibre,
        powerReserve,
        waterResistance,
        movement: movementType,
        crystal: 'Antireflective Sapphire Crystal',
        jewels: 35,
        thickness: '11.5mm',
        frequency: '28,800 vph',
        caseDiameter: watchSize,
      },
      isLimitedEdition,
      editionLimit: isLimitedEdition ? editionLimit : undefined,
      featured: true,
      isNewArrival: true,
    };

    if (editingWatchId) {
      onUpdateWatch(watchData);
      setActionNotice(`Successfully updated "${name}" in catalog!`);
    } else {
      onAddWatch(watchData);
      setActionNotice(`Successfully added "${name}" to catalog & 3D showroom!`);
    }

    setTimeout(() => setActionNotice(''), 3000);
    resetForm();
    setActiveTab('watches');
  };

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPKR, 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#09090e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-amber-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-luxury font-bold text-lg text-white">LUXORA Admin Studio</h2>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                Watch Inventory, 3D Engine & Order Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDefaults}
              title="Reset to Curated Sample Watches"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 flex items-center gap-1.5 border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" /> Reset Defaults
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs py-2 px-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {actionNotice}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/30">
          <button
            onClick={() => setActiveTab('watches')}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'watches'
                ? 'border-[#d4af37] text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Watches ({watches.length})
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveTab('add');
            }}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'add'
                ? 'border-[#d4af37] text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> {editingWatchId ? 'Edit Watch' : 'Add New Watch'}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#d4af37] text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Live Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-[#d4af37] text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Revenue & Analytics
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-6 flex-1 text-left">
          {/* TAB 1: WATCHES LIST */}
          {activeTab === 'watches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search watches by name or brand..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('add');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  <Plus className="w-4 h-4" /> Add Watch
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-black/60 text-neutral-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Watch</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (PKR)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {watches
                      .filter((w) =>
                        searchFilter
                          ? w.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            w.brand.toLowerCase().includes(searchFilter.toLowerCase())
                          : true
                      )
                      .map((w) => {
                        const img =
                          w.images && w.images.length > 0
                            ? w.images[0]
                            : generateWatchImage(w.name, w.model3DConfig, 'front', 80, 80);

                        return (
                          <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 flex items-center gap-3">
                              <img src={img} alt="" className="w-10 h-10 object-contain rounded bg-neutral-900 p-0.5" />
                              <div>
                                <div className="font-luxury font-bold text-white">{w.name}</div>
                                <div className="text-[10px] text-[#d4af37] uppercase">{w.brand}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-neutral-300">{w.category}</td>
                            <td className="py-3 px-4">
                              <div className="font-mono text-amber-300 font-bold">
                                {formatPKR(w.discountedPricePKR)}
                              </div>
                              <div className="text-[10px] text-neutral-500 line-through">
                                {formatPKR(w.originalPricePKR)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  w.stockAvailability > 0
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {w.stockAvailability} Left
                              </span>
                            </td>
                            <td className="py-3 px-4 text-amber-300 font-bold">★ {w.rating}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => startEditWatch(w)}
                                className="p-1.5 text-neutral-400 hover:text-amber-300 transition-colors"
                                title="Edit Watch"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${w.name}?`)) {
                                    onDeleteWatch(w.id);
                                  }
                                }}
                                className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                                title="Delete Watch"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD / EDIT WATCH FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmitWatch} className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-luxury font-bold text-lg text-white">
                  {editingWatchId ? `Edit Timepiece: ${name}` : 'Add Unlimited New Watch to LUXORA'}
                </h3>
                <span className="text-xs text-neutral-400">All fields automatically sync with 3D Viewer & Catalog</span>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Watch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Chrono Perpetual Gold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patek Philippe Masterwork / Rolex / LUXORA"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Primary Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WatchCategory)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Watch Size (Case Diameter)</label>
                  <input
                    type="text"
                    placeholder="e.g. 41mm"
                    value={watchSize}
                    onChange={(e) => setWatchSize(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Original Price (PKR ₨) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 9500000"
                    value={originalPricePKR}
                    onChange={(e) => setOriginalPricePKR(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Discounted Price (PKR ₨) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8200000"
                    value={discountedPricePKR}
                    onChange={(e) => setDiscountedPricePKR(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Case Material</label>
                  <input
                    type="text"
                    placeholder="e.g. 18K Solid Yellow Gold"
                    value={caseMaterial}
                    onChange={(e) => setCaseMaterial(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Strap Material</label>
                  <input
                    type="text"
                    placeholder="e.g. Hand-stitched Alligator Leather"
                    value={strapMaterial}
                    onChange={(e) => setStrapMaterial(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Vault Stock Available</label>
                  <input
                    type="number"
                    value={stockAvailability}
                    onChange={(e) => setStockAvailability(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLimitedEdition}
                      onChange={(e) => setIsLimitedEdition(e.target.checked)}
                      className="rounded accent-[#d4af37]"
                    />
                    <span className="text-neutral-300 font-semibold">Is Limited Edition?</span>
                  </label>
                  {isLimitedEdition && (
                    <input
                      type="text"
                      placeholder="e.g. 05 / 20 Editions"
                      value={editionLimit}
                      onChange={(e) => setEditionLimit(e.target.value)}
                      className="bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                    />
                  )}
                </div>
              </div>

              {/* Description & Story */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Product Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter luxurious horological description highlighting the complication, movement, and finishing..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Heritage Story</label>
                  <input
                    type="text"
                    placeholder="Historic backstory or design inspiration..."
                    value={heritageStory}
                    onChange={(e) => setHeritageStory(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* 3D Model Configuration (Configures how Three.js renders this watch in the 3D Showroom!) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-luxury font-bold text-sm text-white">
                    3D Three.js Procedural Watch Engine Configuration
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">3D Case Geometry Style</label>
                    <select
                      value={caseStyle}
                      onChange={(e) => setCaseStyle(e.target.value as Model3DConfig['caseStyle'])}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white"
                    >
                      <option value="classic-round">Classic Round (Rolex Daytona / Submariner)</option>
                      <option value="royal-oak">Octagonal 8-Screw (Audemars Piguet Royal Oak)</option>
                      <option value="tonneau">Tonneau Curved (Richard Mille RM 11)</option>
                      <option value="cushion">Cushion / Square (Cartier Santos / Monaco)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Precious Metal Finish</label>
                    <select
                      value={metalFinish}
                      onChange={(e) => setMetalFinish(e.target.value as Model3DConfig['metalFinish'])}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white"
                    >
                      <option value="yellow-gold">18K Solid Yellow Gold</option>
                      <option value="rose-gold">18K Pink / Rose Gold</option>
                      <option value="steel">904L Oystersteel</option>
                      <option value="black-dlc">DLC Carbon / Stealth Ceramic</option>
                      <option value="platinum">Platinum 950 High Lustre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Bezel Style</label>
                    <select
                      value={bezelType}
                      onChange={(e) => setBezelType(e.target.value as Model3DConfig['bezelType'])}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white"
                    >
                      <option value="fluted">Fluted Coin Edge</option>
                      <option value="screwed-octagonal">Octagonal Screwed Bezel</option>
                      <option value="smooth">Mirror Polished Smooth</option>
                      <option value="tachymeter">Ceramic Tachymeter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Sunray Dial Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={dialColor}
                        onChange={(e) => setDialColor(e.target.value)}
                        className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={dialColor}
                        onChange={(e) => setDialColor(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Strap Type in 3D</label>
                    <select
                      value={strapType}
                      onChange={(e) => setStrapType(e.target.value as Model3DConfig['strapType'])}
                      className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-white"
                    >
                      <option value="metal-bracelet">Articulated 3-Link Metal Bracelet</option>
                      <option value="leather-stitch">Curved Alligator Leather with Stitching</option>
                      <option value="rubber-sport">Textured FKM Sport Rubber</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasTourbillon}
                        onChange={(e) => setHasTourbillon(e.target.checked)}
                        className="rounded accent-[#d4af37]"
                      />
                      <span className="text-white">Active Oscillating Tourbillon</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasChronographSubdials}
                        onChange={(e) => setHasChronographSubdials(e.target.checked)}
                        className="rounded accent-[#d4af37]"
                      />
                      <span className="text-white">Chronograph Triple Subdials</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload Product Images */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-luxury font-bold text-sm text-white">Upload Product Images</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* File Upload (Converts directly to DataURL) */}
                  <div className="p-4 rounded-xl border border-dashed border-white/20 text-center flex flex-col items-center justify-center bg-black/30">
                    <Upload className="w-6 h-6 text-[#d4af37] mb-2" />
                    <span className="text-white font-medium block">Upload Image Files</span>
                    <span className="text-[11px] text-neutral-500 mb-2">PNG, JPG, WEBP (Instant Local Preview)</span>
                    <label className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer font-semibold">
                      Select Files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or Direct Image URL */}
                  <div className="flex flex-col justify-center space-y-2">
                    <label className="text-neutral-400">Or Paste Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-xl p-2 text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Current Images */}
                {uploadedImages.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 bg-neutral-900 shrink-0">
                        <img src={img} alt="" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-black/80 rounded-full text-rose-400 hover:text-rose-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('watches');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#d4af37] text-neutral-950 font-luxury font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  {editingWatchId ? 'Save Watch Changes' : 'Publish Watch to Store'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-luxury font-bold text-base text-white">Live Customer Orders & Escrow</h3>
                <span className="text-xs text-neutral-400">Total Orders: {orders.length}</span>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 text-xs">
                  No orders placed yet. Test the checkout flow from the cart to generate live orders!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <div className="font-luxury font-bold text-sm text-white">
                            Order {ord.id} • <span className="text-amber-300 font-mono">{formatPKR(ord.totalPKR)}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Client: {ord.customer.fullName} ({ord.customer.city}) • {ord.date}
                          </div>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="bg-neutral-900 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Quality Inspection">Quality Inspection</option>
                            <option value="In Armored Transit">In Armored Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Delivery Address</span>
                          <div className="text-neutral-300">{ord.customer.address}, {ord.customer.city}</div>
                          <div className="text-neutral-400">Phone: {ord.customer.phone}</div>
                          {ord.customer.notes && (
                            <div className="text-amber-300/80 text-[11px] mt-1">{ord.customer.notes}</div>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Ordered Pieces</span>
                          <div className="space-y-1">
                            {ord.items.map((it) => (
                              <div key={it.id} className="text-neutral-300">
                                {it.watch.name} ({it.selectedColor}) x {it.quantity}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVENUE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                    Total Gross Revenue (PKR)
                  </span>
                  <div className="text-2xl font-luxury font-bold text-amber-300">
                    {formatPKR(totalRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Live transactions in Pakistan</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                    Total Timepieces in Vault
                  </span>
                  <div className="text-2xl font-luxury font-bold text-white">
                    {watches.length} Models
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Rolex, Patek, AP, RM, Bespoke</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">
                    Pieces Delivered / In Transit
                  </span>
                  <div className="text-2xl font-luxury font-bold text-emerald-400">
                    {totalItemsSold} Sold
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Armored Courier Dispatched</span>
                </div>
              </div>

              {/* Security & Warranty Status */}
              <div className="p-6 rounded-2xl bg-[#0d0d12] border border-[#d4af37]/30 space-y-3">
                <h4 className="font-luxury font-bold text-base text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#d4af37]" />
                  LUXORA High-Security Vault Status
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  All watches in the database are synchronized with physical timekeeping precision standards, waterproof testing apparatus, and armored transit insurance certificates. Website owners can add unlimited new timepieces at any time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
