import React, { useState } from 'react';
import { Watch } from '../../types/watch';
import { formatPKR, getDiscountPercentage } from '../../utils/currency';
import { generateWatchImage } from '../../utils/watchImageGenerator';
import {
  Compass,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Star,
  Check,
  Eye,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  onOpenDetails: (watch: Watch) => void;
  onOpenShowroom: (watch: Watch) => void;
  onAddToCart: (watch: Watch, color: string, strap: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (watchId: string) => void;
  isCompared: boolean;
  onToggleCompare: (watchId: string) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({
  watch,
  onOpenDetails,
  onOpenShowroom,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = getDiscountPercentage(watch.originalPricePKR, watch.discountedPricePKR);
  const activeColor = watch.availableColors[selectedColorIndex] || { name: 'Signature', hex: '#d4af37' };

  // Use uploaded image or generate high-res procedural image
  const displayImage =
    watch.images && watch.images.length > 0
      ? watch.images[0]
      : generateWatchImage(
          watch.name,
          {
            ...watch.model3DConfig,
            dialColor: activeColor.dialColor || watch.model3DConfig.dialColor,
          },
          'front',
          600,
          600
        );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(watch, activeColor.name, watch.strapMaterial);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetails(watch)}
      className="group relative bg-[#0c0c11] border border-white/[0.08] hover:border-[#d4af37]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,0,0,0.8)] cursor-pointer flex flex-col justify-between"
    >
      {/* Top Badges & Quick Action Controls */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
              Save {discountPercent}%
            </span>
          )}
          {watch.isLimitedEdition && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
              Limited
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Comparison button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(watch.id);
            }}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isCompared
                ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(watch.id);
            }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isWishlisted
                ? 'bg-rose-500/30 border-rose-500 text-rose-400'
                : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Watch Visual Container */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-[#13131c] via-[#0d0d14] to-[#07070b] overflow-hidden flex items-center justify-center p-4">
        {displayImage ? (
          <img
            src={displayImage}
            alt={watch.name}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-48 h-48 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-xs text-neutral-500">
            Luxury Watch
          </div>
        )}

        {/* Floating "Inspect in 3D" Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShowroom(watch);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/85 hover:bg-[#d4af37] text-amber-300 hover:text-neutral-950 border border-[#d4af37]/50 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all z-10"
        >
          <Compass className="w-3.5 h-3.5" /> 3D Showroom
        </button>
      </div>

      {/* Watch Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">
              {watch.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-300 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span className="font-medium">{watch.rating}</span>
              <span className="text-neutral-500 text-[10px]">({watch.reviews.length})</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-luxury font-bold text-base md:text-lg text-white group-hover:text-amber-200 transition-colors line-clamp-1 mb-2">
            {watch.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
            {watch.description}
          </p>

          {/* Specs Snippets */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 mb-3 bg-white/[0.02] p-2 rounded-lg border border-white/5">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Case / Size</span>
              <span className="font-medium text-neutral-200">{watch.watchSize} • {watch.specs.caseDiameter}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Movement</span>
              <span className="font-medium text-amber-300/90">{watch.specs.movement}</span>
            </div>
          </div>

          {/* Available Colors */}
          {watch.availableColors && watch.availableColors.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Dial:</span>
              <div className="flex items-center gap-1.5">
                {watch.availableColors.map((col, idx) => (
                  <button
                    key={col.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIndex(idx);
                    }}
                    title={col.name}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      selectedColorIndex === idx
                        ? 'border-amber-400 scale-125 shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                        : 'border-white/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing in PKR & Add to Cart Action */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-luxury font-bold text-amber-300">
              {formatPKR(watch.discountedPricePKR)}
            </div>
            {discountPercent > 0 && (
              <div className="text-[11px] text-neutral-500 line-through">
                {formatPKR(watch.originalPricePKR)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-[#d4af37] text-white hover:text-neutral-950 border border-white/15 hover:border-[#d4af37]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
