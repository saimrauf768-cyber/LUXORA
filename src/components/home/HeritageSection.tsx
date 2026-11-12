import React from 'react';
import { Shield, Award, Compass, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  return (
    <section id="heritage" className="py-24 bg-gradient-to-b from-[#070709] via-[#0d0c13] to-[#070709] border-t border-white/[0.08] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] uppercase tracking-[0.25em] text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> THE GENEVA CONCORDAT
          </div>
          <h2 className="text-3xl sm:text-5xl font-luxury font-bold text-white tracking-tight">
            THE PURSUIT OF HOROLOGICAL PERFECTION
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            LUXORA was founded on an unyielding principle: that haute horlogerie should not merely be observed behind glass, but experienced through flawless 3D tactile interaction and uncompromising Swiss craftsmanship.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Compass,
              title: 'Real-Time 3D Showroom',
              desc: 'Engineered with WebGL & Three.js to provide 360° freedom, exploded anatomical disassembly, and true-to-life studio reflections on 18K metals and sapphire crystal.',
            },
            {
              icon: Award,
              title: 'Superlative Chronometer',
              desc: 'Every mechanical movement undergoes rigorous 15-day multi-axis chronometer testing to guarantee accuracy within -2/+2 seconds per day.',
            },
            {
              icon: Lock,
              title: 'Armored Vault Transit',
              desc: 'Bespoke delivery across Pakistan via insured armored courier. Every client inspects the timepiece in person before completing authorization.',
            },
            {
              icon: Shield,
              title: '5-Year Global Warranty',
              desc: 'Backed by an international horological certificate of authenticity, complimentary servicing, and heirloom presentation in solid mahogany.',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#d4af37]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-luxury font-bold text-base text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Boutiques in Pakistan Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#111018] via-[#161420] to-[#111018] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              PRIVATE CLIENT CONCIERGE
            </span>
            <h4 className="text-xl sm:text-2xl font-luxury font-bold text-white">
              Private Boutiques & Vaults Across Pakistan
            </h4>
            <p className="text-xs text-neutral-400">
              Islamabad (Blue Area) • Karachi (Clifton Block 4) • Lahore (Gulberg III)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#catalog"
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider uppercase border border-white/15 transition-colors"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
