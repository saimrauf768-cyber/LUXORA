import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  SlidersHorizontal,
  Compass,
  Menu,
  X,
  Volume2,
  VolumeX,
  Shield,
  Layers
} from 'lucide-react';
import { horologyAudio } from '../../utils/audio';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  comparisonCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenComparison: () => void;
  onOpenShowroom: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  comparisonCount,
  onOpenCart,
  onOpenWishlist,
  onOpenComparison,
  onOpenShowroom,
  onOpenAdmin,
  onNavigateSection,
  searchQuery,
  onSearchChange,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(horologyAudio.getMuted());

  const handleToggleSound = () => {
    const muted = horologyAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070709]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0d0d12] via-[#1a1813] to-[#0d0d12] border-b border-[#d4af37]/20 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-neutral-300">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Shield className="w-3.5 h-3.5" /> Armored Insured Courier Across Pakistan
            </span>
            <span className="text-neutral-500">•</span>
            <span>All Prices in PKR with 5-Year Global Warranty</span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center gap-3">
            <span className="text-amber-200/90 font-medium">VIP Concierge: Use code <strong className="text-amber-300 underline font-mono">LUXORA10</strong> for 10% Off</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-amber-300 transition-colors"
              title="Toggle Swiss escapement mechanical ticking"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isMuted ? 'Muted' : 'Tick On'}</span>
            </button>
            <span className="text-neutral-500">•</span>
            <span className="text-amber-300 font-mono">PKR (₨)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigateSection('hero')}
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#aa8420] to-[#5a430c] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all">
            <div className="w-full h-full bg-[#09090d] rounded-[10px] flex items-center justify-center">
              <span className="font-luxury font-black text-amber-300 text-lg tracking-tighter">
                LX
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-luxury font-black text-xl md:text-2xl tracking-[0.2em] gold-gradient-text">
                LUXORA
              </span>
            </div>
            <span className="block text-[9px] uppercase tracking-[0.35em] text-neutral-400 -mt-1 font-sans">
              HAUTE HORLOGERIE
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => onNavigateSection('catalog')}
            className="text-xs uppercase tracking-widest text-neutral-300 hover:text-amber-300 transition-colors font-medium"
          >
            Watch Collection
          </button>

          <button
            onClick={onOpenShowroom}
            className="text-xs uppercase tracking-widest text-amber-300 hover:text-amber-200 transition-all font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Compass className="w-3.5 h-3.5" /> 3D Showroom
          </button>

          <button
            onClick={() => onNavigateSection('heritage')}
            className="text-xs uppercase tracking-widest text-neutral-300 hover:text-amber-300 transition-colors font-medium"
          >
            Heritage
          </button>

          <button
            onClick={() => onNavigateSection('advisor')}
            className="text-xs uppercase tracking-widest text-neutral-300 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Watch Matchmaker
          </button>

          <button
            onClick={onOpenAdmin}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10"
          >
            <Layers className="w-3.5 h-3.5" /> Admin Studio
          </button>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar Input or Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search Rolex, Tourbillon, Chrono..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-64 bg-black/80 border border-[#d4af37]/50 rounded-full px-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="p-1.5 text-neutral-400 hover:text-white ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-neutral-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
                title="Search Watches"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Comparison Action */}
          <button
            onClick={onOpenComparison}
            className="relative p-2.5 rounded-full text-neutral-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
            title="Compare Watches"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {comparisonCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                {comparisonCount}
              </span>
            )}
          </button>

          {/* Wishlist Action */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-full text-neutral-300 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Saved Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-semibold text-xs tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:opacity-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-luxury">Cart</span>
            {cartCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-neutral-950 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0f] border-b border-white/10 px-6 py-4 space-y-3">
          <button
            onClick={() => {
              onNavigateSection('catalog');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-xs uppercase tracking-widest text-neutral-300 py-2 border-b border-white/5"
          >
            Watch Collection
          </button>

          <button
            onClick={() => {
              onOpenShowroom();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-xs uppercase tracking-widest text-amber-300 py-2 border-b border-white/5 font-semibold"
          >
            ★ Enter 3D Showroom (Full 360°)
          </button>

          <button
            onClick={() => {
              onNavigateSection('heritage');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-xs uppercase tracking-widest text-neutral-300 py-2 border-b border-white/5"
          >
            Heritage & Craft
          </button>

          <button
            onClick={() => {
              onNavigateSection('advisor');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-xs uppercase tracking-widest text-neutral-300 py-2 border-b border-white/5"
          >
            Timepiece Matchmaker
          </button>

          <button
            onClick={() => {
              onOpenAdmin();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-xs uppercase tracking-widest text-neutral-400 py-2"
          >
            Admin Studio (Add & Manage Watches)
          </button>
        </div>
      )}
    </header>
  );
};
