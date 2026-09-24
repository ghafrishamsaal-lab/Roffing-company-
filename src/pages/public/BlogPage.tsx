import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BlogPost } from '../../types';
import { INITIAL_BLOG_POSTS } from '../../services/seedData';
import { SEOHead } from '../../components/common/SEOHead';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), where('published', '==', true));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: BlogPost[] = [];
          snap.forEach((doc) => {
            list.push({ ...(doc.data() as BlogPost), id: doc.id });
          });
          setPosts(list);
        } else {
          setPosts(INITIAL_BLOG_POSTS as BlogPost[]);
        }
      } catch (err) {
        setPosts(INITIAL_BLOG_POSTS as BlogPost[]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = ['All', 'Maintenance', 'Materials Guide', 'Insurance', 'Energy & Efficiency', 'Gutters & Drainage'];

  const filtered = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <SEOHead
        title="Roofing Blog & Guides - PeakShield Roofing"
        description="Read educational guides, material comparisons, and storm maintenance tips from licensed master roofing contractors."
      />

      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
            Roofing Knowledge Hub
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Advice, Insights & Industry News
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Protect your greatest investment with tips on shingle maintenance, storm claim advocacy, and energy-saving roofing systems.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roofing articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#ea580c] shadow-lg"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === c
                    ? 'bg-[#ea580c] text-white shadow-md'
                    : 'bg-[#124d3d] text-emerald-100 hover:bg-[#165a48]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, idx) => (
              <article
                key={post.id || idx}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0d3b2e]/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
                        {post.publishedAt || 'Recent'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        4 min read
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors leading-snug mb-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
                    >
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
              <p className="text-sm font-semibold text-slate-700">No blog posts found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className="mt-3 text-xs font-bold text-[#ea580c] hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
