import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Service } from '../../types';
import { INITIAL_SERVICES } from '../../services/seedData';
import { SEOHead } from '../../components/common/SEOHead';
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const q = query(collection(db, 'services'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data() as Service;
          setService({ ...docData, id: snap.docs[0].id });
        } else {
          // Fallback to initial services
          const found = INITIAL_SERVICES.find((s) => s.slug === slug);
          if (found) setService(found as Service);
        }
      } catch (err) {
        const found = INITIAL_SERVICES.find((s) => s.slug === slug);
        if (found) setService(found as Service);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-[#faf7f2]">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen py-24 text-center px-4 bg-[#faf7f2]">
        <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The requested service could not be located.</p>
        <Link
          to="/services"
          className="mt-4 inline-block px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${service.title} - PeakShield Roofing`}
        description={service.shortDescription}
        ogImage={service.imageUrl}
      />

      {/* Header Banner with Breadcrumbs */}
      <div className="bg-[#0d3b2e] text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/services" className="hover:text-white">
              Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#f97316] font-semibold">{service.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{service.title}</h1>
          <p className="text-emerald-100/80 text-sm sm:text-base mt-3 max-w-2xl">
            {service.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Body */}
      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[16/9] bg-slate-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-white rounded-3xl p-8 border border-stone-200/80 space-y-6">
                <h2 className="text-2xl font-black text-[#0d3b2e] tracking-tight">
                  Overview & Engineering Excellence
                </h2>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>

                <h3 className="text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                  Included Features & Standards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#faf7f2] border border-stone-200/70"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-800 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      PeakShield Double-Shield Warranty
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Every {service.title.toLowerCase()} includes our comprehensive 10-Year Workmanship Warranty and up to 50-year manufacturer material warranty. Zero guesswork, 100% peace of mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: Sticky Quote Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] block mb-1">
                  Estimated Investment
                </span>
                <div className="text-3xl font-black text-[#0d3b2e]">
                  From ${Number(service.startingPrice || 0).toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  *Final price determined by roof pitch, square footage, and chosen materials.
                </p>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                  <Link
                    to={`/quote?service=${encodeURIComponent(service.title)}`}
                    className="w-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-center text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Free {service.title} Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="tel:1234567890"
                    className="w-full bg-[#0d3b2e] hover:bg-[#124d3d] text-white text-center text-xs font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#f97316]" />
                    <span>Call (123) 456-7890</span>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ea580c]" />
                    <span>Same-day estimate turnaround</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>0% APR financing available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0d3b2e]" />
                    <span>Zero upfront deposit required</span>
                  </div>
                </div>
              </div>

              {/* Quick links to other services */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Other Services
                </h4>
                <div className="space-y-2">
                  {INITIAL_SERVICES.filter((s) => s.slug !== slug)
                    .slice(0, 4)
                    .map((other) => (
                      <Link
                        key={other.slug}
                        to={`/services/${other.slug}`}
                        className="block text-xs font-medium text-slate-600 hover:text-[#ea580c] hover:translate-x-1 transition-all"
                      >
                        → {other.title}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
