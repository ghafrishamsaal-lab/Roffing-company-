import React from 'react';
import { FAQSection } from '../../components/public/FAQSection';
import { SEOHead } from '../../components/common/SEOHead';

export const FAQPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Frequently Asked Questions - PeakShield Roofing"
        description="Find answers to common questions about roof replacement costs, insurance claims, warranties, timelines, and financing options."
      />

      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
            Clear Answers, Zero Pressure
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Roofing FAQ & Knowledge Base
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Everything you need to know about our certifications, manufacturer warranties, insurance claim negotiation, and day-of-installation logistics.
          </p>
        </div>
      </div>

      <FAQSection />
    </>
  );
};
