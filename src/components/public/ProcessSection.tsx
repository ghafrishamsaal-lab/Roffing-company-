import React from 'react';
import { Search, FileSpreadsheet, CalendarCheck2, HardHat, CheckCircle2 } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Free Drone Inspection',
      icon: <Search className="w-5 h-5 text-[#f97316]" />,
      desc: 'Comprehensive 21-point structural assessment and 4K aerial drone scan of decking, flashing, and valleys.',
    },
    {
      num: '02',
      title: 'Itemized Digital Proposal',
      icon: <FileSpreadsheet className="w-5 h-5 text-[#f97316]" />,
      desc: 'Transparent, upfront estimate with material options, 3D shingle previews, and direct insurance assistance.',
    },
    {
      num: '03',
      title: 'Permitting & Staging',
      icon: <CalendarCheck2 className="w-5 h-5 text-[#f97316]" />,
      desc: 'We secure city permits, schedule material delivery, and safeguard your landscaping and driveway.',
    },
    {
      num: '04',
      title: 'Precision Master Install',
      icon: <HardHat className="w-5 h-5 text-[#f97316]" />,
      desc: 'Tear-off, synthetic underlayment, and expert installation completed in 1–2 days by certified crews.',
    },
    {
      num: '05',
      title: 'Cleanup & Lifetime Warranty',
      icon: <CheckCircle2 className="w-5 h-5 text-[#f97316]" />,
      desc: 'Double magnetic nail sweep of your grounds, attic moisture audit, and 50-year warranty certificate delivery.',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#0d3b2e] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f97316] mb-2.5">
            <span className="w-5 h-0.5 bg-[#f97316]" />
            <span>How It Works</span>
            <span className="w-5 h-0.5 bg-[#f97316]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our 5-Step Roofing Workflow
          </h2>
          <p className="text-emerald-100/80 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            From your complimentary aerial drone evaluation to final magnetic lawn sweep, we deliver predictable timelines, master craftsmanship, and zero surprises.
          </p>
        </div>

        {/* 5-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#124d3d] rounded-3xl p-6 border border-emerald-700/40 relative flex flex-col justify-between hover:bg-[#165a48] transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-black text-[#f97316] tracking-tight">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-emerald-200 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-emerald-100/75 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-emerald-700/30 text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">
                Step {idx + 1} of 5
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
