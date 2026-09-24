import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Service } from '../../types';
import { INITIAL_SERVICES } from '../../services/seedData';

export const ServicesGrid: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'));
        const snap = await getDocs(q);
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
        console.warn('Using initial services fallback:', err);
        setServices(INITIAL_SERVICES as Service[]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2.5">
            <span className="w-5 h-0.5 bg-[#ea580c]" />
            <span>Our Roofing Solutions</span>
            <span className="w-5 h-0.5 bg-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b2e] tracking-tight">
            Engineered Roofing Craftsmanship
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            From emergency hail storm repairs to custom architectural installations, our certified master technicians deliver lifetime durability and transparent upfront pricing.
          </p>
        </div>

        {/* Custom Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Starting Price or Featured Tag */}
                  {service.startingPrice && (
                    <div className="absolute bottom-3 left-3 bg-[#0d3b2e]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      From ${Number(service.startingPrice).toLocaleString()}
                    </div>
                  )}
                  {service.featured && (
                    <div className="absolute top-3 right-3 bg-[#ea580c] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                      Featured
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                    {service.shortDescription}
                  </p>

                  {/* Key Features Bullets */}
                  {service.features && service.features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5">
                      {service.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/services/${service.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-50 hover:bg-[#0d3b2e] text-slate-800 hover:text-white text-xs font-bold transition-all flex items-center justify-between group-hover:border-emerald-700"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Assessment Link */}
        <div className="mt-12 text-center">
          <Link
            to="/quote"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline"
          >
            <span>Need a custom roofing assessment? Request a free comprehensive drone inspection →</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
