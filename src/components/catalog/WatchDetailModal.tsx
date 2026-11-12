import React, { useState } from 'react';
import { Watch, WatchColorOption, WatchReview } from '../../types/watch';
import { formatPKR, getDiscountPercentage } from '../../utils/currency';
import { generateWatchImage } from '../../utils/watchImageGenerator';
import { Watch3DViewer } from '../three/Watch3DViewer';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Compass,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronRight,
  Clock,
  Layers
} from 'lucide-react';

interface WatchDetailModalProps {
  watch: Watch;
  onClose: () => void;
  onOpenShowroom: (watch: Watch) => void;
  onAddToCart: (watch: Watch, color: string, strap: string) => void;
  onInstantBuy: (watch: Watch, color: string, strap: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (watchId: string) => void;
  isCompared: boolean;
  onToggleCompare: (watchId: string) => void;
  onAddReview: (watchId: string, review: Omit<WatchReview, 'id' | 'date' | 'verified'>) => void;
}

export const WatchDetailModal: React.FC<WatchDetailModalProps> = ({
  watch,
  onClose,
  onOpenShowroom,
  onAddToCart,
  onInstantBuy,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onAddReview,
}) => {
  const [activeTab, setActiveTab] = useState<'3d' | 'gallery' | 'reviews'>('3d');
  const [selectedColor, setSelectedColor] = useState<WatchColorOption>(
    watch.availableColors[0] || { name: 'Signature', hex: '#d4af37' }
  );
  const [selectedStrap, setSelectedStrap] = useState<string>(watch.strapMaterial);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // New Review Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const discountPercent = getDiscountPercentage(watch.originalPricePKR, watch.discountedPricePKR);

  // Generate 3 sample gallery angles if not provided
  const galleryImages =
    watch.images && watch.images.length > 0
      ? watch.images
      : [
          generateWatchImage(watch.name, watch.model3DConfig, 'front', 700, 700),
          generateWatchImage(watch.name, watch.model3DConfig, 'angled', 700, 700),
          generateWatchImage(watch.name, watch.model3DConfig, 'detail', 700, 700),
        ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToCart = () => {
    onAddToCart(watch, selectedColor.name, selectedStrap);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    onAddReview(watch.id, {
      author: newAuthor,
      city: newCity || 'Pakistan',
      rating: newRating,
      title: newTitle || 'Exceptional Horology',
      comment: newComment,
    });

    setReviewSubmitted(true);
    setNewAuthor('');
    setNewCity('');
    setNewTitle('');
    setNewComment('');
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#09090e] border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              {watch.brand}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs text-neutral-400 font-medium">{watch.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenShowroom(watch)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-amber-300 text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              <Compass className="w-3.5 h-3.5" /> Fullscreen 3D Showroom
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Visual Area: 3D Stage / Image Gallery */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Visual Tabs */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase flex items-center gap-1.5 transition-colors ${
                    activeTab === '3d'
                      ? 'bg-[#d4af37] text-neutral-950 font-bold'
                      : 'bg-white/5 text-neutral-300 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" /> Interactive 3D
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase flex items-center gap-1.5 transition-colors ${
                    activeTab === 'gallery'
                      ? 'bg-[#d4af37] text-neutral-950 font-bold'
                      : 'bg-white/5 text-neutral-300 hover:text-white'
                  }`}
                >
                  Studio Photographs ({galleryImages.length})
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wider uppercase flex items-center gap-1.5 transition-colors ${
                    activeTab === 'reviews'
                      ? 'bg-[#d4af37] text-neutral-950 font-bold'
                      : 'bg-white/5 text-neutral-300 hover:text-white'
                  }`}
                >
                  Reviews ({watch.reviews.length})
                </button>
              </div>

              {/* Display Canvas or Gallery */}
              <div className="w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#13121b] to-[#060609] relative flex items-center justify-center">
                {activeTab === '3d' && (
                  <Watch3DViewer
                    key={watch.id + selectedColor.name}
                    initialConfig={{
                      ...watch.model3DConfig,
                      dialColor: selectedColor.dialColor || watch.model3DConfig.dialColor,
                    }}
                    watchName={watch.name}
                    brandName={watch.brand}
                    autoRotateDefault={false}
                    className="w-full h-full"
                    showAllControls={true}
                  />
                )}

                {activeTab === 'gallery' && (
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <img
                      src={galleryImages[selectedImageIndex] || galleryImages[0]}
                      alt={watch.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="w-full h-full p-6 overflow-y-auto text-left">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                      <div>
                        <div className="text-xl font-bold font-luxury text-white">Verified Collector Reviews</div>
                        <div className="flex items-center gap-1 text-amber-300 text-xs">
                          <Star className="w-4 h-4 fill-amber-300" />
                          <span className="font-bold">{watch.rating} out of 5.0</span>
                          <span className="text-neutral-500">({watch.reviews.length} authentic purchases)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {watch.reviews.map((rev) => (
                        <div key={rev.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-neutral-200">{rev.author} <span className="text-neutral-500 font-normal">({rev.city})</span></span>
                            <span className="text-neutral-500 text-[10px]">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-300 mb-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-300" />
                            ))}
                            {rev.verified && (
                              <span className="text-[10px] text-emerald-400 ml-2 font-medium flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-white mb-1">{rev.title}</p>
                          <p className="text-xs text-neutral-400">{rev.comment}</p>
                        </div>
                      ))}
                    </div>

                    {/* Submit Review */}
                    <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Write a Collector's Review
                      </div>

                      {reviewSubmitted && (
                        <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Thank you! Your review has been published.
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          required
                          className="bg-neutral-900 border border-white/10 rounded-lg p-2 text-white"
                        />
                        <input
                          type="text"
                          placeholder="City (e.g. Lahore, Karachi, Islamabad)"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="bg-neutral-900 border border-white/10 rounded-lg p-2 text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <span>Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              type="button"
                              key={num}
                              onClick={() => setNewRating(num)}
                              className="p-1 text-amber-300"
                            >
                              <Star className={`w-4 h-4 ${num <= newRating ? 'fill-amber-300' : 'text-neutral-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Review Headline"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />

                      <textarea
                        rows={2}
                        placeholder="Share your experience regarding timekeeping accuracy, wrist presence, and finishing..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />

                      <button
                        type="submit"
                        className="py-2 px-4 rounded-lg bg-[#d4af37] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Review
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails if Gallery tab is active */}
              {activeTab === 'gallery' && (
                <div className="flex items-center gap-2 mt-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 bg-neutral-900 transition-all ${
                        selectedImageIndex === idx ? 'border-[#d4af37]' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Specifications & Purchase Details */}
            <div className="lg:col-span-5 flex flex-col justify-between text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-luxury font-bold text-white mb-2">
                  {watch.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center justify-between text-xs mb-4">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Star className="w-4 h-4 fill-amber-300" />
                    <span className="font-semibold">{watch.rating}</span>
                    <span className="text-neutral-500">({watch.reviews.length} reviews)</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    watch.stockAvailability > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {watch.stockAvailability > 0 ? `${watch.stockAvailability} In Stock (Vault Ready)` : 'Sold Out'}
                  </span>
                </div>

                {/* Price in PKR */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-4">
                  <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Price in PKR</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-luxury font-bold text-amber-300">
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
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  {watch.description}
                </p>

                {/* Color Selector */}
                {watch.availableColors && watch.availableColors.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                      Dial Variant: <span className="text-amber-300">{selectedColor.name}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {watch.availableColors.map((col) => (
                        <button
                          key={col.name}
                          onClick={() => setSelectedColor(col)}
                          title={col.name}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            selectedColor.name === col.name
                              ? 'border-amber-400 scale-110 shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                              : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications */}
                <div className="mb-4 pt-3 border-t border-white/10">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Horology Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-neutral-500 block uppercase">Calibre</span>
                      <span className="font-medium text-white">{watch.specs.calibre}</span>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-neutral-500 block uppercase">Power Reserve</span>
                      <span className="font-medium text-amber-300">{watch.specs.powerReserve}</span>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-neutral-500 block uppercase">Water Resistance</span>
                      <span className="font-medium text-white">{watch.specs.waterResistance}</span>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-neutral-500 block uppercase">Case & Size</span>
                      <span className="font-medium text-white">{watch.watchSize} • {watch.caseMaterial}</span>
                    </div>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="space-y-1.5 mb-5 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Free Armored Delivery across Pakistan (Karachi, Lahore, Islamabad, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Includes LUXORA Wooden Presentation Box & Global Warranty Card</span>
                  </div>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                {addedToast && (
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Added to your LUXORA Cart!
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all border border-white/15"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>

                  <button
                    onClick={() => onToggleWishlist(watch.id)}
                    title="Wishlist"
                    className={`p-3 rounded-xl border transition-all ${
                      isWishlisted
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => onToggleCompare(watch.id)}
                    title="Compare"
                    className={`p-3 rounded-xl border transition-all ${
                      isCompared
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onInstantBuy(watch, selectedColor.name, selectedStrap)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-luxury font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  Buy Now with VIP Concierge <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
