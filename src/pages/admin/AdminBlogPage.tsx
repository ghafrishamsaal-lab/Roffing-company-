import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BlogPost } from '../../types';
import { INITIAL_BLOG_POSTS } from '../../services/seedData';
import { ImageUpload } from '../../components/common/ImageUpload';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [authorName, setAuthorName] = useState('PeakShield Technical Team');
  const [published, setPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Delete
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'blogPosts'));
      if (!snap.empty) {
        const list: BlogPost[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as BlogPost), id: d.id });
        });
        setPosts(list);
      } else {
        setPosts(INITIAL_BLOG_POSTS as BlogPost[]);
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setPosts(INITIAL_BLOG_POSTS as BlogPost[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80');
    setCategory('Maintenance');
    setAuthorName('PeakShield Technical Team');
    setPublished(true);
    setSeoTitle('');
    setSeoDescription('');
    setModalOpen(true);
  };

  const openEditModal = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setCoverImage(p.coverImage);
    setCategory(p.category);
    setAuthorName(p.authorName || 'PeakShield Technical Team');
    setPublished(p.published !== false);
    setSeoTitle(p.seoTitle || '');
    setSeoDescription(p.seoDescription || '');
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) return;

    setIsSubmitting(true);
    try {
      const postData: Omit<BlogPost, 'id'> = {
        title,
        slug,
        excerpt: excerpt || content.slice(0, 140) + '...',
        content,
        coverImage:
          coverImage ||
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        category,
        authorName,
        published,
        publishedAt: editingPost?.publishedAt || new Date().toISOString().split('T')[0],
        seoTitle: seoTitle || `${title} | PeakShield Roofing`,
        seoDescription: seoDescription || excerpt,
        createdAt: editingPost?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingPost?.id) {
        await updateDoc(doc(db, 'blogPosts', editingPost.id), postData);
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPost.id ? { ...postData, id: p.id } : p))
        );
      } else {
        const ref = await addDoc(collection(db, 'blogPosts'), postData);
        setPosts((prev) => [...prev, { ...postData, id: ref.id }]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Error saving post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'blogPosts', postToDelete.id));
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Blog Article Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish educational guides, material comparisons, and homeowner roofing tips.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No blog posts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Article</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Published Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {filtered.map((p) => (
                  <tr key={p.id || p.slug} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{p.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/blog/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{p.authorName || 'PeakShield'}</td>
                    <td className="py-4 px-6 text-slate-400">{p.publishedAt || 'Draft'}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          p.published !== false
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {p.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPostToDelete(p)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-200 hover:bg-red-900/60 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-black text-white">
                {editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. 5 Maintenance Steps to Prevent Roof Rot"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. 5-maintenance-steps-roof-rot"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Materials Guide">Materials Guide</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Energy & Efficiency">Energy & Efficiency</option>
                    <option value="Gutters & Drainage">Gutters & Drainage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Author Display Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. PeakShield Technical Team"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Excerpt (Summary for Search & Preview Cards)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short, engaging summary shown in previews and search engines..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Article Content (Markdown supported) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Use ### for headers, - for bullets, and blank lines between paragraphs..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div>
                <ImageUpload
                  label="Cover Photo"
                  value={coverImage}
                  onChange={(url) => setCoverImage(url)}
                  folder="blog"
                />
              </div>

              {/* SEO settings */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  SEO Custom Meta (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Leave blank to use article title"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">SEO Meta Description</label>
                    <input
                      type="text"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Leave blank to use excerpt"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded-sm border-slate-700 text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span className="font-bold text-white">Publish Immediately (Visible to Public)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingPost ? 'Save Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(postToDelete)}
        title="Delete Blog Post?"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"?`}
        confirmLabel="Delete Post"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};
