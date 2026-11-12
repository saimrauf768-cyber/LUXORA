import React from 'react';
import { Watch } from '../../types/watch';
import { formatPKR } from '../../utils/currency';
import { generateWatchImage } from '../../utils/watchImageGenerator';
import { X, Compass, ShoppingBag, Trash2, CheckCircle2 } from 'lucide-react';

interface WatchComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedWatches: Watch[];
  onRemoveWatch: (watchId: string) => void;
  onOpenShowroom: (watch: Watch) => void;
  onAddToCart: (watch: Watch, color: string, strap: string) => void;
}

export const WatchComparisonModal: React.FC<WatchComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedWatches,
  onRemoveWatch,
  onOpenShowroom,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
          <div>
            <h2 className="font-luxury font-bold text-lg text-white">Horological Comparison</h2>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
              Side-by-side technical specification analysis
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 text-left">
          {comparedWatches.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400">
              Select timepieces to compare from the collection using the compare icon on any watch card.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-neutral-500 uppercase tracking-wider text-[10px] w-40 text-left">
                      Specification
                    </th>
                    {comparedWatches.map((w) => (
                      <th key={w.id} className="p-3 text-center min-w-[220px]">
                        <div className="relative group p-2">
                          <button
                            onClick={() => onRemoveWatch(w.id)}
                            className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-neutral-400 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={
                              w.images && w.images.length > 0
                                ? w.images[0]
                                : generateWatchImage(w.name, w.model3DConfig, 'front', 200, 200)
                            }
                            alt=""
                            className="w-24 h-24 object-contain mx-auto mb-2"
                          />
                          <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                            {w.brand}
                          </div>
                          <div className="font-luxury font-bold text-white text-sm line-clamp-1">
                            {w.name}
                          </div>
                          <div className="font-mono text-amber-300 font-bold mt-1">
                            {formatPKR(w.discountedPricePKR)}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Category</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-white">{w.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Movement Calibre</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-amber-300 font-medium">{w.specs.calibre}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Power Reserve</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-neutral-200">{w.specs.powerReserve}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Water Resistance</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-neutral-200">{w.specs.waterResistance}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Case Diameter</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-neutral-200">{w.watchSize}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Case Material</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-neutral-200">{w.caseMaterial}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Strap Architecture</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center text-neutral-200">{w.strapMaterial}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">3D Showroom & Cart</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-center space-y-2">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenShowroom(w);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" /> 3D View
                        </button>
                        <button
                          onClick={() => {
                            onAddToCart(w, w.availableColors[0]?.name || 'Signature', w.strapMaterial);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
