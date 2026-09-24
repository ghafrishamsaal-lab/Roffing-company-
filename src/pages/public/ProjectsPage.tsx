import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Project } from '../../types';
import { INITIAL_PROJECTS } from '../../services/seedData';
import { SEOHead } from '../../components/common/SEOHead';
import { MapPin, Calendar, ArrowRight, Layers } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'projects')));
        if (!snap.empty) {
          const list: Project[] = [];
          snap.forEach((doc) => {
            list.push({ ...(doc.data() as Project), id: doc.id });
          });
          setProjects(list);
        } else {
          setProjects(INITIAL_PROJECTS as Project[]);
        }
      } catch (err) {
        setProjects(INITIAL_PROJECTS as Project[]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const types = ['All', 'Roof Replacement', 'Roof Installation', 'Storm Damage Repair', 'Commercial Roofing'];

  const filtered =
    filterType === 'All'
      ? projects
      : projects.filter((p) => p.serviceType === filterType);

  return (
    <>
      <SEOHead
        title="Completed Projects Gallery - PeakShield Roofing"
        description="Browse our portfolio of completed residential and commercial roofing projects across Colorado with before and after comparisons."
      />

      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
            Our Work Speaks For Itself
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Completed Projects Showcase
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Take an in-depth tour of custom architectural shingles, standing seam metal roofs, and commercial TPO membranes completed by PeakShield.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterType === t
                    ? 'bg-[#ea580c] text-white shadow-md'
                    : 'bg-[#124d3d] text-emerald-100 hover:bg-[#165a48]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                  <img
                    src={proj.afterImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0d3b2e]/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                    {proj.serviceType}
                  </div>
                  {proj.beforeImage && (
                    <div className="absolute bottom-3 right-3 bg-white/95 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
                      Before/After Included
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                        {proj.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {proj.completedDate}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
              <p className="text-sm font-semibold text-slate-700">No projects found for {filterType}</p>
              <button
                onClick={() => setFilterType('All')}
                className="mt-3 text-xs font-bold text-[#ea580c] hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
