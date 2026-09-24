import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, ShieldCheck } from 'lucide-react';
import heroRoofingImg from '../../assets/images/hero_roofing_master_1790268236511.jpg';

interface HeroSectionProps {
  heroTitle?: string;
  heroDescription?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroTitle = 'Stronger Roofs. Stronger Homes. Built to Last.',
  heroDescription = 'Professional roofing solutions using quality materials, skilled craftsmanship, and dependable service. Your roof. Our responsibility.',
}) => {
  return (
    <section className="relative bg-[#0d3b2e] overflow-hidden text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Soft ambient light accents for subtle depth without excessive gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f97316]">
              <span className="w-5 h-0.5 bg-[#f97316]" />
              <span>Colorado’s Certified Master Roofing Contractors</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.12] text-white text-balance">
              {heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-xl font-normal">
              {heroDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/quote"
                className="bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold text-sm sm:text-base px-7 py-4 rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/services"
                className="bg-[#124d3d] hover:bg-[#165a48] text-white font-semibold text-sm sm:text-base px-7 py-4 rounded-xl border border-emerald-600/40 transition-all flex items-center gap-2"
              >
                <span>Our Services</span>
              </Link>
            </div>

            {/* Editorial Trust Proof Points - Clean Unboxed Typography */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-emerald-200/90 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#f97316]" />
                <span>Zero Deposit to Start</span>
              </div>
              <span className="text-emerald-700">·</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#f97316]" />
                <span>50-Year Warranty</span>
              </div>
              <span className="text-emerald-700">·</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#f97316]" />
                <span>Direct Insurance Claim Help</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Refined Orange Diagonal Accent */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Refined Orange Diagonal Accent Frame */}
              <div 
                className="absolute -top-3 -right-3 -bottom-3 -left-3 rounded-3xl bg-gradient-to-br from-[#ea580c] to-[#f97316] opacity-90 transform -rotate-1.5 -z-10 shadow-xl"
                style={{
                  clipPath: 'polygon(0 0, 100% 4%, 100% 100%, 0 96%)',
                }}
              />

              {/* Secondary architectural accent border */}
              <div className="absolute -inset-1 rounded-3xl border border-orange-400/40 transform rotate-1 -z-10" />

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-700/50 bg-[#092b21] aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={heroRoofingImg}
                  alt="Premium architectural roof installation by PeakShield Roofing"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />

                {/* Subtle bottom gradient to enhance badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#092b21]/75 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* "15+ Years of Experience" Badge - Clean and perfectly anchored */}
              <div className="absolute -bottom-5 left-4 sm:-bottom-6 sm:left-6 bg-[#0a2a20] border-2 border-emerald-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 backdrop-blur-md z-20">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-md">
                  <Award className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black leading-none text-white tracking-tight">
                    15+ Years
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200 mt-1">
                    Master Craftsmanship
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
