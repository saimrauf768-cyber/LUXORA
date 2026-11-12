import React, { useState } from 'react';
import { Watch } from '../../types/watch';
import { formatPKR } from '../../utils/currency';
import { generateWatchImage } from '../../utils/watchImageGenerator';
import { Sparkles, Compass, ShoppingBag, ArrowRight, Check } from 'lucide-react';

interface HorologyAdvisorProps {
  watches: Watch[];
  onOpenShowroom: (watch: Watch) => void;
  onOpenDetails: (watch: Watch) => void;
  onAddToCart: (watch: Watch, color: string, strap: string) => void;
}

export const HorologyAdvisor: React.FC<HorologyAdvisorProps> = ({
  watches,
  onOpenShowroom,
  onOpenDetails,
  onAddToCart,
}) => {
  const [occasion, setOccasion] = useState<'boardroom' | 'gala' | 'sport' | 'daily'>('boardroom');
  const [metalPref, setMetalPref] = useState<'gold' | 'rose' | 'steel' | 'carbon'>('gold');
  const [sizePref, setSizePref] = useState<'compact' | 'classic' | 'bold'>('classic');

  // Match algorithm
  const matchedWatch = React.useMemo(() => {
    let best = watches[0];
    let maxScore = -1;

    watches.forEach((w) => {
      let score = 0;
      // Occasion
      if (occasion === 'boardroom' && (w.category === 'Luxury Watches' || w.category === 'Automatic Watches')) score += 3;
      if (occasion === 'gala' && (w.isLimitedEdition || w.category === 'Luxury Watches')) score += 3;
      if (occasion === 'sport' && (w.category === 'Sports Watches' || w.category === 'Chronograph Watches')) score += 3;
      if (occasion === 'daily' && (w.category === 'Casual Watches' || w.category === 'Smart Watches')) score += 3;

      // Metal
      if (metalPref === 'gold' && w.model3DConfig.metalFinish === 'yellow-gold') score += 3;
      if (metalPref === 'rose' && w.model3DConfig.metalFinish === 'rose-gold') score += 3;
      if (metalPref === 'steel' && (w.model3DConfig.metalFinish === 'steel' || w.model3DConfig.metalFinish === 'platinum')) score += 3;
      if (metalPref === 'carbon' && w.model3DConfig.metalFinish === 'black-dlc') score += 3;

      // Size
      const diam = parseInt(w.watchSize) || 41;
      if (sizePref === 'compact' && diam <= 40) score += 2;
      if (sizePref === 'classic' && diam >= 40 && diam <= 42) score += 2;
      if (sizePref === 'bold' && diam >= 43) score += 2;

      if (score > maxScore) {
        maxScore = score;
        best = w;
      }
    });

    return best || watches[0];
  }, [watches, occasion, metalPref, sizePref]);

  const img =
    matchedWatch.images && matchedWatch.images.length > 0
      ? matchedWatch.images[0]
      : generateWatchImage(matchedWatch.name, matchedWatch.model3DConfig, 'front', 400, 400);

  return (
    <section id="advisor" className="py-20 bg-[#070709] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] uppercase tracking-widest text-amber-300 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> LUXORA Bespoke Matchmaker
          </div>
          <h2 className="text-3xl font-luxury font-bold text-white tracking-wide">
            FIND YOUR PERFECT TIMEPIECE
          </h2>
          <p className="text-xs text-neutral-400 mt-2">
            Select your lifestyle preferences to find the horological creation that best mirrors your persona.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Preferences Selector */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Occasion */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                1. Primary Occasion & Lifestyle
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'boardroom', label: 'Executive Boardroom' },
                  { id: 'gala', label: 'Black Tie Gala & Ceremony' },
                  { id: 'sport', label: 'Motorsport & Deep Dive' },
                  { id: 'daily', label: 'Casual Elegance / Smart' },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOccasion(o.id as typeof occasion)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      occasion === o.id
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-amber-200 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                2. Preferred Material Finish
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'gold', label: '18K Yellow Gold' },
                  { id: 'rose', label: '18K Rose / Pink Gold' },
                  { id: 'steel', label: '904L Steel & Platinum' },
                  { id: 'carbon', label: 'Carbon TPT & DLC Black' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMetalPref(m.id as typeof metalPref)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      metalPref === m.id
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-amber-200 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                3. Wrist Silhouette & Diameter
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'compact', label: 'Subtle (38-40mm)' },
                  { id: 'classic', label: 'Classic (41-42mm)' },
                  { id: 'bold', label: 'Commanding (44mm+)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSizePref(s.id as typeof sizePref)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      sizePref === s.id
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-amber-200 font-semibold'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Matched Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#13121b] to-[#09090f] border border-[#d4af37]/40 rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(212,175,55,0.15)] relative">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
              ★ YOUR IDEAL HOROLOGICAL MATCH
            </span>

            <div className="w-48 h-48 mx-auto my-3 flex items-center justify-center">
              <img src={img} alt="" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              {matchedWatch.brand}
            </div>
            <h3 className="font-luxury font-bold text-lg text-white mb-1">
              {matchedWatch.name}
            </h3>

            <div className="font-luxury font-bold text-2xl text-amber-300 mb-4">
              {formatPKR(matchedWatch.discountedPricePKR)}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onOpenShowroom(matchedWatch)}
                className="w-full py-3 rounded-xl bg-[#d4af37] text-neutral-950 font-luxury font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                <Compass className="w-4 h-4" /> Inspect in 3D Showroom
              </button>

              <button
                onClick={() => onOpenDetails(matchedWatch)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-medium uppercase tracking-wider border border-white/10"
              >
                View Full Specifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
