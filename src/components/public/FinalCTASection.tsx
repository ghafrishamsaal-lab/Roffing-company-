import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="relative bg-[#0d3b2e] text-white py-20 lg:py-24 overflow-hidden">
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Decorative warm accent corner */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ea580c]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3">
          <ShieldCheck className="w-4 h-4" />
          <span>Start Your Roofing Project Today</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight text-balance">
          Ready to Protect Your Home with Colorado’s Master Roofers?
        </h2>

        <p className="text-base sm:text-lg text-emerald-100/85 mt-4 max-w-2xl mx-auto leading-relaxed">
          Book your complimentary 21-point drone inspection today. Receive an itemized digital estimate within 24 hours with zero sales pressure and no deposit required.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/quote"
            className="w-full sm:w-auto bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Get Your Free Estimate</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="tel:1234567890"
            className="w-full sm:w-auto bg-emerald-950/80 hover:bg-emerald-900 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-xl border border-emerald-600/40 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#f97316]" />
            <span>Call (123) 456-7890</span>
          </a>
        </div>

        {/* Quiet Trust Proof Points */}
        <div className="mt-10 pt-8 border-t border-emerald-800/60 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
            <span>Class A Licensed & Insured ($2M Liability)</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
            <span>50-Year Non-Prorated Warranty</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
            <span>24/7 Rapid Emergency Dispatch</span>
          </div>
        </div>
      </div>
    </section>
  );
};
