import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Project } from '../../types';
import { INITIAL_PROJECTS } from '../../services/seedData';
import { SEOHead } from '../../components/common/SEOHead';
import { BeforeAfterSlider } from '../../components/public/BeforeAfterSlider';
import {
  MapPin,
  Calendar,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const q = query(collection(db, 'projects'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data() as Project;
          setProject({ ...docData, id: snap.docs[0].id });
          setActiveImage(docData.afterImage);
        } else {
          const found = INITIAL_PROJECTS.find((p) => p.slug === slug);
          if (found) {
            setProject(found as Project);
            setActiveImage(found.afterImage);
          }
        }
      } catch (err) {
        const found = INITIAL_PROJECTS.find((p) => p.slug === slug);
        if (found) {
          setProject(found as Project);
          setActiveImage(found.afterImage);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-[#faf7f2]">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-24 text-center px-4 bg-[#faf7f2]">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The requested project case study could not be found.</p>
        <Link
          to="/projects"
          className="mt-4 inline-block px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          View All Projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${project.title} - PeakShield Roofing Case Study`}
        description={project.description}
        ogImage={project.afterImage}
      />

      {/* Header Banner */}
      <div className="bg-[#0d3b2e] text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/projects" className="hover:text-white">
              Projects
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#f97316] font-semibold">{project.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-lg">
              {project.serviceType}
            </span>
            <span className="text-xs text-emerald-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#f97316]" />
              {project.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{project.title}</h1>
        </div>
      </div>

      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Before & After Interactive Slider (if both exist) */}
          {project.beforeImage && (
            <BeforeAfterSlider
              beforeImage={project.beforeImage}
              afterImage={project.afterImage}
              title={project.title}
              location={project.location}
            />
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#0d3b2e] tracking-tight">Project Summary</h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {project.description}
              </p>

              <h3 className="text-lg font-bold text-slate-900 pt-4 border-t border-slate-100">
                Craftsmanship Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '100% Tear-off and Decking Re-nailing',
                  'High-Wind Starter Strip Shingles',
                  'Ice and Water Shield in all Valleys & Eaves',
                  'Custom Fabricated Drip Edge Metal',
                  'Magnetic Ground Nail Sweep Guaranteed',
                  'Full Manufacturer Warranty Registered',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Gallery thumbnails */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Project Photo Gallery</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {project.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`rounded-2xl overflow-hidden aspect-video bg-slate-100 border-2 cursor-pointer transition-all ${
                          activeImage === img ? 'border-[#ea580c] scale-[1.02]' : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img src={img} alt="Gallery thumb" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Specifications */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-md space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Project Specifications
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Service Type</span>
                    <span className="text-slate-900 font-bold">{project.serviceType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Location</span>
                    <span className="text-slate-900 font-bold">{project.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Completed Date</span>
                    <span className="text-slate-900 font-bold">{project.completedDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Warranty</span>
                    <span className="text-emerald-800 font-bold">50-Year Non-Prorated</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-slate-500 font-medium">Wind Rating</span>
                    <span className="text-slate-900 font-bold">130 MPH Wind Resistant</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/quote?service=${encodeURIComponent(project.serviceType)}`}
                    className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-center text-xs font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Similar Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
