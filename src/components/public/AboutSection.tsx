import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import rooferCraftsmanImg from '../../assets/images/roofer_workmanship_1790268253621.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-[#faf7f2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c]">
              <span className="w-5 h-0.5 bg-[#ea580c]" />
              <span>Welcome to PeakShield Roofing</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b2e] tracking-tight leading-tight">
              Quality Roofing. <br />
              <span className="text-[#ea580c]">Trusted Experts.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              We are a full-service residential and commercial roofing company committed to protecting properties with durable materials, transparent pricing, and master craftsmanship. Since our founding, we have protected and restored thousands of Colorado roofs against extreme hail and wind.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                'GAF Master Elite® Certified Installers',
                'Comprehensive 50-Year Warranties',
                'Same-Day Drone Aerial Surface Scans',
                'Zero-Nail Cleanup (Magnet Swept)',
                'Direct Insurance Adjuster Advocacy',
                'Flexible 0% APR Financing Options',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-5">
              <Link
                to="/about"
                className="bg-[#0d3b2e] hover:bg-[#124d3d] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 text-[#ea580c]" />
              </Link>
              <Link
                to="/quote"
                className="text-xs sm:text-sm font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline flex items-center gap-1"
              >
                <span>Schedule a Free Inspection →</span>
              </Link>
            </div>
          </div>

          {/* Right Image with floating social proof */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative border */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3]">
                <img
                  src={rooferCraftsmanImg}
                  alt="PeakShield Master Roofing Contractor conducting quality inspection"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
                />
              </div>

              {/* Floating review callout */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-stone-200/90 max-w-xs hidden sm:block">
                <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-900">4.9 / 5 Rating on Google</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Based on 350+ certified Colorado homeowner reviews.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
