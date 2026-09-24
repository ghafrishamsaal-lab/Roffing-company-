import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Service } from '../../types';
import { INITIAL_SERVICES } from '../../services/seedData';
import { SEOHead } from '../../components/common/SEOHead';
import { Search, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'services')));
        if (!snap.empty) {
          const list: Service[] = [];
          snap.forEach((doc) => {
            const data = doc.data() as Service;
            if (data.active !== false) {
              list.push({ ...data, id: doc.id });
            }
          });
          setServices(list);
        } else {
          setServices(INITIAL_SERVICES as Service[]);
        }
      } catch (err) {
        setServices(INITIAL_SERVICES as Service[]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEOHead
        title="Our Roofing Services - PeakShield Roofing | Denver, CO"
        description="Explore PeakShield's complete roofing solutions: installation, replacement, emergency repairs, gutters, drone inspections, and storm restoration."
      />

      {/* Hero Header */}
      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
            Professional Roofing Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Crafted for Longevity. Engineered for Protection.
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Whether your home requires a high-performance architectural replacement or emergency storm tarping, PeakShield delivers certified master craftsmanship on every square foot.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services (e.g. replacement, gutters, emergency)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#ea580c] shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <div
                key={service.id || idx}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {service.startingPrice && (
                      <div className="absolute bottom-3 right-3 bg-[#0d3b2e]/95 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                        From ${Number(service.startingPrice).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {service.features.slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/quote?service=${encodeURIComponent(service.title)}`}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
              <p className="text-sm font-semibold text-slate-700">No services found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs font-bold text-[#ea580c] hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
