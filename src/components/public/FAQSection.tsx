import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FAQ } from '../../types';
import { INITIAL_FAQS } from '../../services/seedData';
import { ChevronDown, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const q = query(collection(db, 'faqs'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: FAQ[] = [];
          snap.forEach((doc) => {
            const data = doc.data() as FAQ;
            if (data.active !== false) {
              list.push({ ...data, id: doc.id });
            }
          });
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setFaqs(list);
        } else {
          setFaqs(INITIAL_FAQS as FAQ[]);
        }
      } catch (err) {
        setFaqs(INITIAL_FAQS as FAQ[]);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category || 'General')))];

  const filteredFaqs =
    selectedCategory === 'All'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-24 bg-[#faf7f2] border-t border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2.5">
            <span className="w-5 h-0.5 bg-[#ea580c]" />
            <span>Got Questions?</span>
            <span className="w-5 h-0.5 bg-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b2e] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Clear answers about warranties, insurance claim handling, pricing, and project turnaround.
          </p>
        </div>

        {/* Category Tabs (Segmented filter control) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-stone-200/60 rounded-2xl max-w-xl mx-auto mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0d3b2e] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-[#ea580c] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#0d3b2e] text-white rotate-180' : 'bg-stone-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Prompt Footer */}
        <div className="mt-12 text-center bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900">Have a question not listed here?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Our certified roofing specialists are available 24/7 to help.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:1234567890"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>(123) 456-7890</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0d3b2e] hover:bg-[#124d3d] text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
