import React, { useEffect, useState } from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { HeroSection } from '../../components/public/HeroSection';
import { TrustBenefits } from '../../components/public/TrustBenefits';
import { AboutSection } from '../../components/public/AboutSection';
import { ServicesGrid } from '../../components/public/ServicesGrid';
import { WhyChooseUs } from '../../components/public/WhyChooseUs';
import { ProjectShowcase } from '../../components/public/ProjectShowcase';
import { BeforeAfterSlider } from '../../components/public/BeforeAfterSlider';
import { ProcessSection } from '../../components/public/ProcessSection';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { FAQSection } from '../../components/public/FAQSection';
import { FreeEstimateCTA } from '../../components/public/FreeEstimateCTA';
import { BlogPreview } from '../../components/public/BlogPreview';
import { FinalCTASection } from '../../components/public/FinalCTASection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { CompanySettings } from '../../types';

export const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'company'));
        if (snap.exists()) {
          setSettings(snap.data() as CompanySettings);
        }
      } catch (err) {
        console.warn('Could not fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <SEOHead
        title="PeakShield Roofing - Stronger Roofs. Stronger Homes. Built to Last."
        description="Professional roofing solutions using quality materials, skilled craftsmanship, and dependable service. 15+ years of trusted experience in Colorado."
      />
      <div className="flex flex-col min-h-screen">
        <HeroSection
          heroTitle={settings?.heroTitle}
          heroDescription={settings?.heroDescription}
        />
        <TrustBenefits />
        <AboutSection />
        <ServicesGrid />
        <WhyChooseUs />
        <ProjectShowcase />
        <BeforeAfterSlider />
        <ProcessSection />
        <TestimonialsSection />
        <FAQSection />
        <FreeEstimateCTA />
        <BlogPreview />
        <FinalCTASection />
      </div>
    </>
  );
};
