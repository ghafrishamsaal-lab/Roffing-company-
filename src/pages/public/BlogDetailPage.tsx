import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BlogPost } from '../../types';
import { INITIAL_BLOG_POSTS } from '../../services/seedData';
import { SEOHead } from '../../components/common/SEOHead';
import { Calendar, User, ChevronRight, ArrowRight, Share2, ShieldCheck } from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data() as BlogPost;
          setPost({ ...docData, id: snap.docs[0].id });
        } else {
          const found = INITIAL_BLOG_POSTS.find((p) => p.slug === slug);
          if (found) setPost(found as BlogPost);
        }
      } catch (err) {
        const found = INITIAL_BLOG_POSTS.find((p) => p.slug === slug);
        if (found) setPost(found as BlogPost);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-[#faf7f2]">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-24 text-center px-4 bg-[#faf7f2]">
        <h2 className="text-2xl font-bold text-slate-900">Post Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The requested blog post could not be located.</p>
        <Link
          to="/blog"
          className="mt-4 inline-block px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          View All Articles
        </Link>
      </div>
    );
  }

  // Render markdown-like sections cleanly
  const renderFormattedContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      if (block.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-bold text-[#0d3b2e] mt-6 mb-3">
            {block.replace('### ', '')}
          </h3>
        );
      }
      if (block.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-black text-[#0d3b2e] mt-8 mb-4">
            {block.replace('## ', '')}
          </h2>
        );
      }
      if (block.startsWith('- ')) {
        const items = block.split('\n').map((line) => line.replace('- ', ''));
        return (
          <ul key={idx} className="space-y-2 my-4 pl-4 list-disc text-slate-700 text-sm leading-relaxed">
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
          {block}
        </p>
      );
    });
  };

  return (
    <>
      <SEOHead
        title={post.seoTitle || `${post.title} | PeakShield Roofing`}
        description={post.seoDescription || post.excerpt}
        ogImage={post.coverImage}
      />

      <div className="bg-[#0d3b2e] text-white py-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-emerald-200/80 mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#f97316] font-semibold truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          <span className="bg-[#ea580c] text-white text-xs font-bold px-3 py-1 rounded-lg inline-block mb-3">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-emerald-200 mt-4">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#f97316]" />
              {post.authorName || 'PeakShield Editorial'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
              {post.publishedAt || 'Published recently'}
            </span>
          </div>
        </div>
      </div>

      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Article Body */}
            <article className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm">
              <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-8 bg-slate-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-slate max-w-none">
                {renderFormattedContent(post.content)}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/blog"
                  className="text-xs font-bold text-[#0d3b2e] hover:text-[#ea580c] flex items-center gap-1"
                >
                  ← Back to All Articles
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Article link copied to clipboard!');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Article</span>
                </button>
              </div>
            </article>

            {/* Sidebar */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              {/* Inspection CTA card */}
              <div className="bg-[#0d3b2e] rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-orange-600/30 text-[#f97316] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">Suspect Storm Damage?</h3>
                <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed">
                  PeakShield provides 100% free 21-point drone roof inspections with photo documentation.
                </p>
                <Link
                  to="/quote"
                  className="mt-5 block w-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-center text-xs font-bold py-3.5 rounded-xl shadow-md transition-all"
                >
                  Book Free Inspection
                </Link>
              </div>

              {/* Other Recent Articles */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                  Recent Guides
                </h4>
                <div className="space-y-4">
                  {INITIAL_BLOG_POSTS.filter((p) => p.slug !== slug)
                    .slice(0, 3)
                    .map((item) => (
                      <Link
                        key={item.slug}
                        to={`/blog/${item.slug}`}
                        className="group block space-y-1"
                      >
                        <span className="text-[10px] font-bold text-[#ea580c] uppercase">
                          {item.category}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#ea580c] transition-colors line-clamp-2">
                          {item.title}
                        </h5>
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
