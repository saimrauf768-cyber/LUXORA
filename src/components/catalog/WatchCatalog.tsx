import React, { useState, useMemo } from 'react';
import { Watch, WatchCategory } from '../../types/watch';
import { WatchCard } from './WatchCard';
import { formatPKR } from '../../utils/currency';
import {
  Filter,
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  Compass,
  Check
} from 'lucide-react';

interface WatchCatalogProps {
  watches: Watch[];
  onOpenDetails: (watch: Watch) => void;
  onOpenShowroom: (watch: Watch) => void;
  onAddToCart: (watch: Watch, color: string, strap: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (watchId: string) => void;
  comparedIds: string[];
  onToggleCompare: (watchId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: ('All Timepieces' | WatchCategory)[] = [
  'All Timepieces',
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

export const WatchCatalog: React.FC<WatchCatalogProps> = ({
  watches,
  onOpenDetails,
  onOpenShowroom,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  comparedIds,
  onToggleCompare,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All Timepieces' | WatchCategory>('All Timepieces');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    watches.forEach((w) => set.add(w.brand));
    return ['All', ...Array.from(set)];
  }, [watches]);

  // Filter and sort logic
  const filteredWatches = useMemo(() => {
    return watches
      .filter((watch) => {
        // Category filter
        if (selectedCategory !== 'All Timepieces') {
          const matchesMain = watch.category === selectedCategory;
          const matchesSecondary = watch.secondaryCategories?.includes(selectedCategory);
          if (!matchesMain && !matchesSecondary) return false;
        }

        // Brand filter
        if (selectedBrand !== 'All' && watch.brand !== selectedBrand) {
          return false;
        }

        // Price filter
        if (watch.discountedPricePKR > maxPrice) {
          return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = watch.name.toLowerCase().includes(q);
          const matchBrand = watch.brand.toLowerCase().includes(q);
          const matchDesc = watch.description.toLowerCase().includes(q);
          const matchCategory = watch.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.discountedPricePKR - b.discountedPricePKR;
        if (sortBy === 'price-desc') return b.discountedPricePKR - a.discountedPricePKR;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') {
          const discA = a.originalPricePKR - a.discountedPricePKR;
          const discB = b.originalPricePKR - b.discountedPricePKR;
          return discB - discA;
        }
        // Default featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [watches, selectedCategory, selectedBrand, maxPrice, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All Timepieces');
    setSelectedBrand('All');
    setMaxPrice(50000000);
    setSortBy('featured');
    onSearchChange('');
  };

  return (
    <section id="catalog" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
            <Sparkles className="w-4 h-4" /> CURATED LUXURY TIMEPIECES
          </div>
          <h2 className="text-3xl md:text-4xl font-luxury font-bold text-white tracking-wide">
            THE MASTER COLLECTION
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Explore authentic Swiss mechanical, automatic, tourbillon, and chronograph timepieces with 360° interactive 3D inspection.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-neutral-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-neutral-900">Featured Masterworks</option>
              <option value="price-asc" className="bg-neutral-900">Price: Low to High (PKR)</option>
              <option value="price-desc" className="bg-neutral-900">Price: High to Low (PKR)</option>
              <option value="rating" className="bg-neutral-900">Highest Customer Rating</option>
              <option value="discount" className="bg-neutral-900">Biggest Savings (PKR)</option>
            </select>
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white"
          >
            <Filter className="w-3.5 h-3.5 text-[#d4af37]" /> Filters
          </button>
        </div>
      </div>

      {/* Horizontal Category Scroll Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar (Brand & Price Slider) */}
      <div className={`mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5 md:flex md:items-center md:justify-between gap-6 ${showFiltersMobile ? 'block' : 'hidden md:flex'}`}>
        {/* Brand Selector */}
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Brand:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-[#d4af37]"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price Range Slider */}
        <div className="flex items-center gap-3 flex-1 max-w-md mb-3 md:mb-0">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium shrink-0">
            Max Price:
          </span>
          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
          <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
            {formatPKR(maxPrice)}
          </span>
        </div>

        {/* Results Count & Reset */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-neutral-400">
          <span>Showing <strong className="text-white">{filteredWatches.length}</strong> timepieces</span>
          {(selectedCategory !== 'All Timepieces' || selectedBrand !== 'All' || maxPrice < 50000000 || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Watches Grid */}
      {filteredWatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWatches.map((watch) => (
            <WatchCard
              key={watch.id}
              watch={watch}
              onOpenDetails={onOpenDetails}
              onOpenShowroom={onOpenShowroom}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(watch.id)}
              onToggleWishlist={onToggleWishlist}
              isCompared={comparedIds.includes(watch.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-white/[0.01] border border-white/5 p-8">
          <Sparkles className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-3" />
          <h3 className="text-lg font-luxury font-bold text-white mb-2">No Matching Luxury Timepieces Found</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
            Try adjusting your search criteria, price range, or category filter to discover the full collection.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs uppercase tracking-wider"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
