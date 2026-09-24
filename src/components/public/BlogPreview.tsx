import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BlogPost } from '../../types';
import { INITIAL_BLOG_POSTS } from '../../services/seedData';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

export const BlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
          setPosts(list.slice(0, 3));
        } else {
          setPosts(INITIAL_BLOG_POSTS.slice(0, 3) as BlogPost[]);
        }
      } catch (err) {
        setPosts(INITIAL_BLOG_POSTS.slice(0, 3) as BlogPost[]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-2">
              <span className="w-6 h-0.5 bg-[#ea580c]" />
              <span>Roofing Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0d3b2e] tracking-tight">
              Latest News & Tips
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl">
              Expert advice on shingle selection, storm preparedness, maintenance schedules, and energy efficiency.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#ea580c] hover:text-[#c2410c] transition-colors self-start md:self-auto"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <article
              key={post.id || idx}
              className="bg-[#faf7f2] rounded-3xl overflow-hidden border border-stone-200/80 hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
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

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors leading-snug">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200/60">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
