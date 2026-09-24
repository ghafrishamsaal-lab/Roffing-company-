import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Testimonial } from '../../types';
import { INITIAL_TESTIMONIALS } from '../../services/seedData';
import { Star, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'testimonials'), where('approved', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: Testimonial[] = [];
          snap.forEach((doc) => {
            list.push({ ...(doc.data() as Testimonial), id: doc.id });
          });
          setTestimonials(list);
        } else {
          setTestimonials(INITIAL_TESTIMONIALS as Testimonial[]);
        }
      } catch (err) {
        setTestimonials(INITIAL_TESTIMONIALS as Testimonial[]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2.5">
            <span className="w-5 h-0.5 bg-[#ea580c]" />
            <span>Verified Customer Reviews</span>
            <span className="w-5 h-0.5 bg-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b2e] tracking-tight">
            Trusted by 3,500+ Property Owners
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Read unedited reviews from Colorado homeowners and property managers who trust PeakShield Roofing.
          </p>
        </div>

        {/* Clean Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.slice(0, 6).map((t, idx) => (
            <div
              key={t.id || idx}
              className="bg-[#faf7f2] rounded-3xl p-8 border border-stone-200/90 hover:border-emerald-600/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Verified tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified Project</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-6">
                  "{t.text}"
                </p>
              </div>

              {/* Author & Service Footnote */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-stone-200/60">
                <img
                  src={
                    t.customerPhoto ||
                    `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80`
                  }
                  alt={t.customerName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{t.customerName}</h3>
                  <span className="text-[11px] text-emerald-800 font-semibold">{t.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
