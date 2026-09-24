import React from 'react';
import {
  Users2,
  Gem,
  Calculator,
  Zap,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <Users2 className="w-6 h-6 text-[#ea580c]" />,
      title: 'Certified Master Crews',
      desc: 'Our in-house master craftsmen average 14+ years of Colorado roofing experience. Zero casual day laborers or unvetted third-party crews.',
    },
    {
      icon: <Gem className="w-6 h-6 text-[#0d3b2e]" />,
      title: 'Class 4 Impact Materials',
      desc: 'Top-tier architectural asphalt, standing seam metal, and synthetic slate built to resist 130 mph winds and golf ball-sized hail.',
    },
    {
      icon: <Calculator className="w-6 h-6 text-emerald-800" />,
      title: 'Transparent Fixed Pricing',
      desc: 'Fully itemized proposals with digital drone measurements. We guarantee zero surprise change orders or unexpected add-on costs.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#f97316]" />,
      title: '24/7 Rapid Response',
      desc: 'Immediate emergency tarping dispatch within 60 minutes of active storm damage to prevent indoor ceiling and insulation flooding.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0d3b2e]" />,
      title: '50-Year Non-Prorated Warranty',
      desc: 'Direct factory lifetime material protection paired with PeakShield’s 10-year ironclad workmanship guarantee on every roof.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#ea580c]" />,
      title: 'Zero Deposit & Claim Advocacy',
      desc: 'Zero payment required until work is fully complete and approved. We meet directly with insurance adjusters on your roof.',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2.5">
            <span className="w-5 h-0.5 bg-[#ea580c]" />
            <span>Why PeakShield Stands Apart</span>
            <span className="w-5 h-0.5 bg-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b2e] tracking-tight">
            Built on Integrity. Engineered for Colorado.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            We don’t cut corners or substitute sub-par underlayment. Discover why over 3,500 property owners across the region rely on PeakShield Roofing.
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#faf7f2] border border-stone-200/90 hover:border-emerald-600/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center mb-5 border border-stone-100">
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>PeakShield Guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
