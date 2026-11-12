import React from 'react';
import { Watch } from '../../types/watch';
import { Watch3DViewer } from '../three/Watch3DViewer';
import { formatPKR } from '../../utils/currency';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Shield,
  Award,
  Zap,
  Clock,
  Layers
} from 'lucide-react';

interface HeroShowroomProps {
  heroWatch: Watch;
  onOpenShowroom: () => void;
  onExploreCollection: () => void;
  onSelectWatch: (watch: Watch) => void;
}

export const HeroShowroom: React.FC<HeroShowroomProps> = ({
  heroWatch,
  onOpenShowroom,
  onExploreCollection,
  onSelectWatch,
}) => {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center bg-[#070709] overflow-hidden pt-6 pb-12">
      {/* Background Subtle Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Luxury Typography & Copy */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-none" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300">
                SWISS HAUTE HORLOGERIE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-luxury font-black text-white tracking-tight leading-[1.1]">
              MASTER <br />
              <span className="gold-gradient-text">THE ART OF</span> <br />
              ETERNITY.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-lg">
              Welcome to <strong className="text-white">LUXORA WATCHES</strong>. An extraordinary confluence of Rolex, Patek Philippe, and Audemars Piguet craftsmanship. Discover real-time 360° interactive 3D timepieces delivered with armored insured security across Pakistan.
            </p>

            {/* Price Badge for Featured Timepiece */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-md">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-neutral-400 uppercase tracking-wider">Featured Timepiece</span>
                <span className="text-[#d4af37] font-semibold">{heroWatch.brand}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-luxury font-bold text-white">{heroWatch.name}</span>
                <span className="text-xl font-luxury font-bold text-amber-300">
                  {formatPKR(heroWatch.discountedPricePKR)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenShowroom}
                className="py-4 px-7 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-luxury font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all"
              >
                <Compass className="w-4 h-4" /> Enter 3D Showroom
              </button>

              <button
                onClick={onExploreCollection}
                className="py-4 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs tracking-widest uppercase flex items-center justify-center gap-2 border border-white/15 transition-all"
              >
                Browse Collection <ArrowRight className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-neutral-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] leading-tight">Armored Courier in Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] leading-tight">5-Year Global Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] leading-tight">100% Swiss Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Live 3D Interactive Timepiece Stage */}
          <div className="lg:col-span-7 h-[520px] sm:h-[600px] lg:h-[680px] w-full relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#111018] to-[#050508]">
            <Watch3DViewer
              initialConfig={heroWatch.model3DConfig}
              watchName={heroWatch.name}
              brandName={heroWatch.brand}
              autoRotateDefault={true}
              className="w-full h-full"
              showAllControls={true}
            />

            {/* Corner Badge */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Live 3D Render • Click & Drag 360°
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
