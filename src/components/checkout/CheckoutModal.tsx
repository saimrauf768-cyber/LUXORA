import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order, OrderCustomer } from '../../types/watch';
import { formatPKR } from '../../utils/currency';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Building2,
  Banknote,
  Printer,
  Sparkles,
  Award,
  ChevronRight,
  PackageCheck
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  onOrderSuccess: (order: Order) => void;
}

const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Multan',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'International / Overseas',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  onOrderSuccess,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 3');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [postalCode, setPostalCode] = useState('44000');
  const [notes, setNotes] = useState('');

  // Luxury Add-ons
  const [luxuryGiftBox, setLuxuryGiftBox] = useState(true);
  const [vipInsurance, setVipInsurance] = useState(true);
  const [engravingText, setEngravingText] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>(
    'Cash on Delivery (VIP Inspection)'
  );

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.watch.discountedPricePKR * item.quantity,
    0
  );
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const totalPKR = subtotal - discountAmount;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = 'LX-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'PK-LUX-' + Math.floor(10000000 + Math.random() * 90000000);

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      items: [...items],
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        notes: engravingText ? `Caseback Engraving: "${engravingText}". ${notes}` : notes,
      },
      subtotalPKR: subtotal,
      discountPKR: discountAmount,
      taxPKR: 0, // Luxury tax included in MSRP
      shippingPKR: 0, // Complimentary armored courier
      totalPKR,
      paymentMethod,
      status: 'Order Placed',
      trackingNumber,
      luxuryGiftBox,
      vipInsurance,
    };

    setCompletedOrder(newOrder);
    onOrderSuccess(newOrder);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#ffffff', '#aa8420'],
      });
    } catch {
      // Confetti not supported in testing environment
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <h2 className="font-luxury font-bold text-lg text-white">
              {completedOrder ? 'Official LUXORA Invoice & Order Confirmation' : 'LUXORA VIP Concierge Checkout'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {completedOrder ? (
            /* =========================================
               ORDER CONFIRMATION & PRINTABLE INVOICE
               ========================================= */
            <div className="space-y-6 text-left max-w-2xl mx-auto">
              <div className="text-center space-y-2 pb-6 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center mx-auto text-[#d4af37]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-luxury font-bold text-white">Order Confirmed with VIP Priority</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Your luxury timepiece has been reserved and queued for horological inspection in our vault before armored dispatch.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-amber-300">
                  Order ID: <strong className="text-white">{completedOrder.id}</strong> • Tracking: {completedOrder.trackingNumber}
                </div>
              </div>

              {/* Printable Invoice Card */}
              <div id="luxora-printable-invoice" className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="font-luxury font-black text-xl gold-gradient-text tracking-widest">
                      LUXORA GENÈVE
                    </span>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Haute Horlogerie Pakistan</p>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-neutral-400">Date: {completedOrder.date}</div>
                    <div className="text-emerald-400 font-semibold">{completedOrder.status}</div>
                  </div>
                </div>

                {/* Recipient info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Delivered To</span>
                    <div className="font-bold text-white">{completedOrder.customer.fullName}</div>
                    <div className="text-neutral-400">{completedOrder.customer.address}</div>
                    <div className="text-neutral-400">{completedOrder.customer.city}, {completedOrder.customer.postalCode}</div>
                    <div className="text-neutral-400">{completedOrder.customer.phone}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Payment & Delivery</span>
                    <div className="text-neutral-200">{completedOrder.paymentMethod}</div>
                    <div className="text-emerald-400 font-semibold mt-1">Armored Security Transit</div>
                    {completedOrder.luxuryGiftBox && (
                      <div className="text-amber-300/80 text-[11px]">Includes Mahogany Presentation Box</div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Ordered Timepieces</span>
                  {completedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs py-1">
                      <div>
                        <span className="font-luxury font-bold text-white">{item.watch.brand} - {item.watch.name}</span>
                        <span className="text-neutral-400 block text-[11px]">Dial: {item.selectedColor} • Qty: {item.quantity}</span>
                      </div>
                      <span className="font-mono text-amber-300 font-semibold">
                        {formatPKR(item.watch.discountedPricePKR * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                  <span className="font-luxury font-bold text-base text-white">Grand Total (PKR)</span>
                  <span className="font-luxury font-bold text-2xl text-amber-300">
                    {formatPKR(completedOrder.totalPKR)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintInvoice}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10"
                >
                  <Printer className="w-4 h-4" /> Print Official Invoice
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-[#d4af37] text-neutral-950 font-luxury font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          ) : (
            /* =========================================
               CHECKOUT INPUT FORM
               ========================================= */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              {/* Left Column: Customer details and shipping */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-base font-luxury font-bold text-white mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    1. Recipient & Armored Delivery Address
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-neutral-400 mb-1">Full Legal Name (For Delivery Verification)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shahmir Khan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="client@luxury.pk"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Contact Phone (Pakistan)</label>
                        <input
                          type="tel"
                          required
                          placeholder="+92 300 1234567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">Complete Street Address (Villa / Apartment / Sector)</label>
                      <input
                        type="text"
                        required
                        placeholder="House #, Street #, Sector / Phase (e.g. DHA Phase 5 / F-7)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">Destination City</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                        >
                          {PAKISTANI_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 44000"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Luxury Bespoke Options */}
                <div className="pt-3 border-t border-white/10">
                  <h3 className="text-base font-luxury font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    2. Bespoke Packaging & Engraving
                  </h3>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={luxuryGiftBox}
                        onChange={(e) => setLuxuryGiftBox(e.target.checked)}
                        className="rounded accent-[#d4af37]"
                      />
                      <div>
                        <span className="font-semibold text-white block">Complimentary Mahogany Wood Presentation Box</span>
                        <span className="text-neutral-400 text-[11px]">Handcrafted case with velvet interior and brass plaque</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vipInsurance}
                        onChange={(e) => setVipInsurance(e.target.checked)}
                        className="rounded accent-[#d4af37]"
                      />
                      <div>
                        <span className="font-semibold text-white block">100% Insured Armored Courier Handover</span>
                        <span className="text-neutral-400 text-[11px]">Armed security escort until signature verification</span>
                      </div>
                    </label>

                    <div>
                      <label className="block text-neutral-400 mb-1">Complimentary Caseback Engraving (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 'To Saim With Love 2026' or Family Initials"
                        maxLength={28}
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-3 border-t border-white/10">
                  <h3 className="text-base font-luxury font-bold text-white mb-3 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#d4af37]" />
                    3. Payment Protocol
                  </h3>

                  <div className="space-y-2 text-xs">
                    {[
                      {
                        id: 'Cash on Delivery (VIP Inspection)',
                        title: 'Cash on Delivery (VIP In-Person Verification)',
                        desc: 'Inspect the timepiece in the presence of our armored courier before completing payment.',
                        icon: Banknote,
                      },
                      {
                        id: 'Bank Transfer Wire',
                        title: 'Bank Wire Transfer (Direct to LUXORA Escrow)',
                        desc: 'Official invoice provided with IBAN for Meezan Bank, HBL, or Standard Chartered.',
                        icon: Building2,
                      },
                      {
                        id: 'Direct Card (Visa / Mastercard)',
                        title: 'Encrypted Credit / Debit Card',
                        desc: 'Seamless 256-bit encrypted checkout via Visa, Mastercard, or UnionPay.',
                        icon: CreditCard,
                      },
                    ].map((p) => {
                      const Icon = p.icon;
                      const isSelected = paymentMethod === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setPaymentMethod(p.id as typeof paymentMethod)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-[#d4af37]/10 border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'bg-white/[0.02] border-white/5 text-neutral-300 hover:border-white/15'
                          }`}
                        >
                          <div className={`mt-0.5 p-1 rounded-full ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">{p.title}</div>
                            <div className="text-neutral-400 text-[11px] mt-0.5">{p.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Confirmation Button */}
              <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-luxury font-bold text-sm uppercase tracking-wider text-neutral-300 mb-4 pb-2 border-b border-white/10">
                    Order Summary ({items.length} {items.length === 1 ? 'Piece' : 'Pieces'})
                  </h3>

                  <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                        <div className="pr-2 min-w-0">
                          <div className="font-luxury font-bold text-white truncate">{item.watch.name}</div>
                          <div className="text-[10px] text-neutral-400">
                            {item.selectedColor} • Qty {item.quantity}
                          </div>
                        </div>
                        <div className="font-mono text-amber-300 font-semibold shrink-0">
                          {formatPKR(item.watch.discountedPricePKR * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs text-neutral-400 pt-2 border-t border-white/10">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-white font-mono">{formatPKR(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>VIP Discount ({discountPercent}%)</span>
                        <span className="font-mono">-{formatPKR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Armored Transit across Pakistan</span>
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                      <span className="font-luxury">Total in PKR</span>
                      <span className="text-amber-300 font-luxury text-xl">
                        {formatPKR(totalPKR)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8420] text-neutral-950 font-luxury font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:opacity-95 transition-all"
                  >
                    Confirm & Dispatch Order <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="text-center text-[10px] text-neutral-500">
                    By confirming, you agree to LUXORA's 5-Year Mastercraft Warranty & Private Delivery Protocol.
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
