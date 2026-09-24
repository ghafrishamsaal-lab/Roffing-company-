import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import rooferCraftsmanImg from '../../assets/images/roofer_workmanship_1790268253621.jpg';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="About Us - PeakShield Roofing | 15+ Years of Roofing Excellence"
        description="Learn about PeakShield Roofing's mission, certified team, workmanship warranties, and our commitment to Colorado homeowners."
      />

      {/* Header Banner */}
      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
              About PeakShield Roofing
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Honest Craftsmanship. <br />
              Uncompromising Standards.
            </h1>
            <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
              Founded in Colorado, PeakShield Roofing was built on a simple promise: provide homeowners with the finest roofing protection possible, backed by transparent pricing and lifelong accountability.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-black text-[#0d3b2e] tracking-tight">
                Our Story & Philosophy
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                After witnessing too many homeowners fall victim to out-of-town "storm chasers" and subpar installations that leaked after only three years, our founders established PeakShield Roofing. We set out to raise the bar for the entire residential and commercial roofing industry.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every member of our crew undergoes rigorous manufacturer certification. We refuse to cut corners on underlayment, ice and water shields, or proper attic ventilation. When you invest in a PeakShield roof, you receive peace of mind for the next half century.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-[#faf7f2] border border-stone-200">
                  <div className="text-3xl font-black text-[#ea580c]">3,500+</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Roofs Installed & Repaired</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#faf7f2] border border-stone-200">
                  <div className="text-3xl font-black text-[#0d3b2e]">100%</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Clean Grounds Guarantee</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] relative">
                <img
                  src={rooferCraftsmanImg}
                  alt="PeakShield roofing team reviewing plans"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 rounded-3xl bg-[#faf7f2] border border-stone-200/80">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Integrity First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your roof only needs a $300 seal repair, we will never try to sell you a $15,000 replacement. Honesty is why 60% of our business comes from word-of-mouth referrals.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#faf7f2] border border-stone-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Master Certification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We are certified installers for the nation’s leading shingle and metal manufacturers. This qualifies our clients for exclusive factory non-prorated 50-year warranty coverage.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#faf7f2] border border-stone-200/80">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dedicated Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                From meeting your insurance adjusters on the roof to conducting double magnetic sweeps for stray nails, our dedicated project managers are by your side every step.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-3xl bg-[#0d3b2e] p-8 sm:p-12 text-white text-center max-w-4xl mx-auto shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Protect Your Home?</h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl mx-auto mt-2 mb-6">
              Schedule a complimentary 21-point drone inspection today. No obligation, no sales pressure.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/quote"
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl border border-emerald-700 transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
