import React from 'react';
import { ShieldCheck, Layers, ThumbsUp, Users, Award, Star, CheckCircle2 } from 'lucide-react';

export const TrustBenefits: React.FC = () => {
  const credentials = [
    { name: 'GAF Master Elite®', note: 'Top 2% in North America' },
    { name: 'CertainTeed 5-Star', note: 'Select ShingleMaster™' },
    { name: 'Owens Corning', note: 'Preferred Contractor' },
    { name: 'BBB Accredited', note: 'A+ Highest Rating' },
    { name: 'NRCA Member', note: 'Natl Roofing Contractors' },
    { name: '4.9 ★ Rating', note: '350+ Verified Reviews' },
  ];

  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#ea580c]" />,
      title: 'Licensed & $2M Insured',
      description: 'Class A General Roofing Contractor with complete $2M liability coverage and full workers’ compensation for zero homeowner risk.',
    },
    {
      icon: <Layers className="w-6 h-6 text-[#ea580c]" />,
      title: 'Premium Materials',
      description: 'Factory-certified partner with GAF, CertainTeed, and Owens Corning using heavy-duty Class 4 impact shingles and synthetic ice barriers.',
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-[#ea580c]" />,
      title: 'Satisfaction Guaranteed',
      description: 'Zero final invoice until your thorough walkthrough is signed off and our double magnetic sweep leaves your lawn 100% nail-free.',
    },
    {
      icon: <Users className="w-6 h-6 text-[#ea580c]" />,
      title: '15+ Years Master Crews',
      description: 'Full-time, certified in-house craftsmen with over 15 years of Colorado weather experience. Never handed off to unvetted subcontractors.',
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200/80">
      {/* Credential / Accreditation Bar */}
      <div className="bg-[#f7f4ed] border-b border-stone-200/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left mb-4 md:mb-0 md:flex md:items-center md:justify-between">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#0d3b2e]">
              <Award className="w-4 h-4 text-[#ea580c]" />
              <span>Certified Industry Accreditations & Standards</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Ranked #1 for Roofing Customer Service in Denver</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {credentials.map((cred, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 border border-stone-200/90 text-center shadow-2xs hover:border-[#ea580c]/50 transition-colors"
              >
                <div className="text-xs font-extrabold text-slate-900 tracking-tight">
                  {cred.name}
                </div>
                <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                  {cred.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core 4 Benefit Cards */}
      <div className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-7 rounded-3xl bg-[#faf7f2] border border-stone-200/80 hover:border-emerald-700/40 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100/70 group-hover:bg-[#ea580c] group-hover:text-white flex items-center justify-center transition-colors mb-5 text-[#ea580c]">
                  <span className="group-hover:text-white transition-colors">{benefit.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {benefit.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
