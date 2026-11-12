import React from 'react';
import { Shield, Award, Compass, Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenShowroom: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenShowroom,
  onOpenAdmin,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-[#050507] border-t border-white/10 text-neutral-400 text-xs">
      {/* Top Banner */}
      <div className="border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#d4af37]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider">Armored Insured Courier</div>
              <div className="text-[11px] text-neutral-400">Guaranteed safe handover anywhere in Pakistan</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#d4af37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider">5-Year Global Warranty</div>
              <div className="text-[11px] text-neutral-400">Swiss certified chronometric accuracy guarantee</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#d4af37]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider">3D Showroom Technology</div>
              <div className="text-[11px] text-neutral-400">Full 360° interactive exploded micro-inspection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-neutral-950 font-black font-luxury flex items-center justify-center text-sm">
              LX
            </div>
            <span className="font-luxury font-black text-xl gold-gradient-text tracking-widest">
              LUXORA
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The standard of high horology in Pakistan. Bridging Swiss ancestral engineering with real-time 3D technology and private armored security.
          </p>
          <div className="text-[11px] text-neutral-500">
            Registered Swiss Horological Guild Member #LX-9481
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-luxury font-bold text-xs uppercase tracking-widest text-white">
            Timepiece Collections
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#catalog" className="hover:text-amber-300 transition-colors">
                Luxury Watches
              </a>
            </li>
            <li>
              <a href="#catalog" className="hover:text-amber-300 transition-colors">
                Men's & Women's Timepieces
              </a>
            </li>
            <li>
              <a href="#catalog" className="hover:text-amber-300 transition-colors">
                Sports & Chronograph References
              </a>
            </li>
            <li>
              <a href="#catalog" className="hover:text-amber-300 transition-colors">
                Limited Edition Masterworks
              </a>
            </li>
            <li>
              <a href="#catalog" className="hover:text-amber-300 transition-colors">
                Smart Connected Titan Series
              </a>
            </li>
          </ul>
        </div>

        {/* Boutiques in Pakistan */}
        <div className="space-y-3">
          <h4 className="font-luxury font-bold text-xs uppercase tracking-widest text-white">
            Private Boutiques
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
              <span>Islamabad: Beverly Centre, Blue Area</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
              <span>Karachi: Ocean Mall, Clifton Block 9</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
              <span>Lahore: Mall 1, Main Boulevard, Gulberg III</span>
            </li>
            <li className="flex items-center gap-2 pt-1 text-amber-300">
              <Phone className="w-3.5 h-3.5" />
              <span>VIP Direct: +92 51 8899770</span>
            </li>
          </ul>
        </div>

        {/* Showroom & Admin */}
        <div className="space-y-3">
          <h4 className="font-luxury font-bold text-xs uppercase tracking-widest text-white">
            Curator Access
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={onOpenShowroom}
                className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 font-semibold"
              >
                <Compass className="w-3.5 h-3.5" /> Enter 3D Showroom
              </button>
            </li>
            <li>
              <button
                onClick={onOpenAdmin}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Owner Admin Dashboard
              </button>
            </li>
            <li>
              <span className="text-neutral-500 block text-[11px]">
                Currency: Pakistani Rupee (₨ PKR)
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="border-t border-white/5 py-6 text-center text-[11px] text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} LUXORA WATCHES GENÈVE. All rights reserved.</span>
          <span>Rolex, Patek Philippe, Audemars Piguet, and Richard Mille are registered trademarks of their respective owners.</span>
        </div>
      </div>
    </footer>
  );
};
