import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Project } from '../../types';
import { INITIAL_PROJECTS } from '../../services/seedData';
import { ArrowRight, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const ProjectShowcase: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: Project[] = [];
          snap.forEach((doc) => {
            list.push({ ...(doc.data() as Project), id: doc.id });
          });
          setProjects(list.slice(0, 3));
        } else {
          setProjects(INITIAL_PROJECTS.slice(0, 3) as Project[]);
        }
      } catch (err) {
        setProjects(INITIAL_PROJECTS.slice(0, 3) as Project[]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2.5">
              <span className="w-5 h-0.5 bg-[#ea580c]" />
              <span>Craftsmanship in Action</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d3b2e] tracking-tight">
              Featured Roofing Projects
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2.5 max-w-xl leading-relaxed">
              Explore real residential transformations and commercial installations completed across Colorado.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors self-start md:self-auto hover:underline"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                <img
                  src={proj.afterImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0d3b2e]/90 text-white text-[11px] font-bold px-3 py-1 rounded-md backdrop-blur-xs">
                  {proj.serviceType}
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mb-3">
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

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors tracking-tight">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2.5 leading-relaxed font-normal">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] inline-flex items-center gap-1 group/btn"
                  >
                    <span>View Before & After</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Work
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
