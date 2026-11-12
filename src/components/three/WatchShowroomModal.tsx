import React, { useState } from 'react';
import { Watch, WatchColorOption } from '../../types/watch';
import { Watch3DViewer } from './Watch3DViewer';
import { formatPKR, getDiscountPercentage } from '../../utils/currency';
import {
  X,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

interface WatchShowroomModalProps {
  watch: Watch;
  allWatches: Watch[];
  onClose: () => void;
  onAddToCart: (watch: Watch, color: string, strap: string) => void;
  onInstantBuy: (watch: Watch, color: string, strap: string) => void;
  onSelectDifferentWatch: (watch: Watch) => void;
  isWishlisted: boolean;
  onToggleWishlist: (watchId: string) => void;
}

export const WatchShowroomModal: React.FC<WatchShowroomModalProps> = ({
  watch,
  allWatches,
  onClose,
  onAddToCart,
  onInstantBuy,
  onSelectDifferentWatch,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState<WatchColorOption>(
    watch.availableColors[0] || { name: 'Signature', hex: '#d4af37' }
  );
  const [selectedStrap, setSelectedStrap] = useState<string>(watch.strapMaterial);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const discountPercent = getDiscountPercentage(watch.originalPricePKR, watch.discountedPricePKR);

  const handleAddToCart = () => {
    onAddToCart(watch, selectedColor.name, selectedStrap);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = () => {
    onInstantBuy(watch, selectedColor.name, selectedStrap);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Top Floating Luxury Header */}
      <div className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-semibold font-luxury">
              LUXORA 3D SHOWROOM
            </span>
          </div>

          {/* Quick Watch Selector Dropdown */}
          <select
            value={watch.id}
            onChange={(e) => {
              const found = allWatches.find((w) => w.id === e.target.value);
              if (found) onSelectDifferentWatch(found);
            }}
            className="hidden md:block bg-black/80 border border-white/15 text-xs text-neutral-200 rounded-lg px-3 py-1.5 focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
          >
            {allWatches.map((w) => (
              <option key={w.id} value={w.id} className="bg-neutral-900 text-white">
                {w.brand} - {w.name} ({formatPKR(w.discountedPricePKR)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-neutral-300 hover:text-white hover:border-[#d4af37]/50 transition-colors backdrop-blur-md"
          >
            {isSidebarOpen ? 'Hide Spec Sheet' : 'Show Spec Sheet'}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/80 border border-white/15 text-neutral-400 hover:text-white hover:border-[#d4af37] transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col md:flex-row relative">
        {/* 3D Viewport - Takes full or partial width */}
        <div className={`relative h-full transition-all duration-300 ${isSidebarOpen ? 'w-full md:w-[68%]' : 'w-full'}`}>
          <Watch3DViewer
            key={watch.id + selectedColor.name}
            initialConfig={{
              ...watch.model3DConfig,
              dialColor: selectedColor.dialColor || watch.model3DConfig.dialColor,
            }}
            watchName={watch.name}
            brandName={watch.brand}
            autoRotateDefault={true}
            className="w-full h-full"
            showAllControls={true}
          />
        </div>

        {/* Collapsible Luxury Product Specs & Purchasing Sidebar */}
        {isSidebarOpen && (
          <div className="w-full md:w-[32%] h-full bg-[#0a0a0f]/95 border-l border-white/10 p-6 overflow-y-auto flex flex-col justify-between backdrop-blur-xl z-20">
            <div>
              {/* Limited Edition Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  {watch.brand}
                </span>
                {watch.isLimitedEdition && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold tracking-wider">
                    {watch.editionLimit || 'Limited Edition'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-luxury font-bold text-white tracking-wide mb-3">
                {watch.name}
              </h1>

              {/* Price in PKR */}
              <div className="flex items-baseline gap-3 mb-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-2xl md:text-3xl font-luxury font-bold text-amber-300">
                  {formatPKR(watch.discountedPricePKR)}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-sm text-neutral-500 line-through">
                      {formatPKR(watch.originalPricePKR)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300 leading-relaxed mb-5">
                {watch.description}
              </p>

              {/* Color Variations */}
              {watch.availableColors && watch.availableColors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Dial Color Option: <span className="text-amber-300">{selectedColor.name}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {watch.availableColors.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor.name === col.name
                            ? 'border-amber-400 scale-110 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Table */}
              <div className="mb-6 space-y-2 pt-2 border-t border-white/5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  Horological Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase block">Calibre</span>
                    <span className="font-medium text-neutral-200">{watch.specs.calibre}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase block">Power Reserve</span>
                    <span className="font-medium text-amber-300">{watch.specs.powerReserve}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase block">Water Resistance</span>
                    <span className="font-medium text-neutral-200">{watch.specs.waterResistance}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase block">Case Diameter</span>
                    <span className="font-medium text-neutral-200">{watch.watchSize}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase block">Case Material</span>
                    <span className="font-medium text-neutral-200">{watch.caseMaterial}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase block">Strap</span>
                    <span className="font-medium text-neutral-200">{watch.strapMaterial}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Insured Armored Courier Delivery across Pakistan</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <Award className="w-4 h-4 text-[#d4af37]" />
                  <span>5-Year LUXORA International Warranty & Certificate</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              {addedToast && (
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Added to your LUXORA Cart
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all border border-white/15"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                <button
                  onClick={() => onToggleWishlist(watch.id)}
                  title="Save to Wishlist"
                  className={`p-3 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-luxury font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                Instant Purchase (VIP Checkout) <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
