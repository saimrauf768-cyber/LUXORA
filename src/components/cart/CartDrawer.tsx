import React, { useState } from 'react';
import { CartItem } from '../../types/watch';
import { formatPKR } from '../../utils/currency';
import { generateWatchImage } from '../../utils/watchImageGenerator';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Shield,
  Tag,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: (appliedDiscountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.watch.discountedPricePKR * item.quantity,
    0
  );

  const discountPercent = appliedPromo === 'LUXORA10' ? 10 : (appliedPromo === 'VIP2026' ? 15 : 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUXORA10' || code === 'VIP2026') {
      setAppliedPromo(code);
      setPromoCode('');
    } else {
      setPromoError('Invalid promotional voucher code. Try LUXORA10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#09090e] border-l border-white/10 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-luxury font-bold text-lg text-white">Your Vault Cart</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-[#d4af37]/30 mx-auto mb-3" />
                <h3 className="font-luxury font-bold text-white text-base mb-1">Your Cart is Empty</h3>
                <p className="text-xs text-neutral-400 mb-4">Discover our collection of handcrafted luxury timepieces.</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-neutral-950 font-bold text-xs uppercase tracking-wider"
                >
                  Explore Timepieces
                </button>
              </div>
            ) : (
              items.map((item) => {
                const img =
                  item.watch.images && item.watch.images.length > 0
                    ? item.watch.images[0]
                    : generateWatchImage(item.watch.name, item.watch.model3DConfig, 'front', 250, 250);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3.5 items-center relative group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-white/10 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                      <img src={img} alt={item.watch.name} className="max-w-full max-h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold truncate">
                        {item.watch.brand}
                      </div>
                      <h4 className="font-luxury font-bold text-xs text-white truncate mb-1">
                        {item.watch.name}
                      </h4>
                      <div className="text-[11px] text-neutral-400 truncate mb-1.5">
                        Dial: <span className="text-neutral-200">{item.selectedColor}</span>
                      </div>
                      <div className="text-xs font-luxury font-bold text-amber-300">
                        {formatPKR(item.watch.discountedPricePKR)}
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col items-end justify-between h-20">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-medium text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-black/50 space-y-4">
              {/* Promo code field */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo Voucher (e.g. LUXORA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wider uppercase border border-white/10"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Code {appliedPromo} applied (-{discountPercent}%)
                    </span>
                    <button onClick={() => setAppliedPromo(null)} className="text-neutral-400 hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">{formatPKR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Promotion ({discountPercent}%)</span>
                    <span className="font-mono">-{formatPKR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Armored Insured Delivery</span>
                  <span className="text-emerald-400 font-medium">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10 text-white">
                  <span className="font-luxury">Total (PKR)</span>
                  <span className="text-amber-300 font-luxury font-bold text-lg">
                    {formatPKR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 justify-center">
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Protected by LUXORA VIP Armored Escort Guarantee</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onProceedToCheckout(discountPercent)}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-luxury font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
