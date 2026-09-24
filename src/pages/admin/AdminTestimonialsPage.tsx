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
import { Testimonial } from '../../types';
import { INITIAL_TESTIMONIALS } from '../../services/seedData';
import { ImageUpload } from '../../components/common/ImageUpload';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Star,
  CheckCircle,
  EyeOff,
  Eye,
  Loader2,
} from 'lucide-react';

export const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhoto, setCustomerPhoto] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [service, setService] = useState('Roof Replacement');
  const [approved, setApproved] = useState(true);

  // Delete
  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'testimonials'));
      if (!snap.empty) {
        const list: Testimonial[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as Testimonial), id: d.id });
        });
        setTestimonials(list);
      } else {
        setTestimonials(INITIAL_TESTIMONIALS as Testimonial[]);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setTestimonials(INITIAL_TESTIMONIALS as Testimonial[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setCustomerName('');
    setCustomerPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80');
    setRating(5);
    setText('');
    setService('Roof Replacement');
    setApproved(true);
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setCustomerName(t.customerName);
    setCustomerPhoto(t.customerPhoto || '');
    setRating(t.rating || 5);
    setText(t.text);
    setService(t.service);
    setApproved(t.approved !== false);
    setModalOpen(true);
  };

  const toggleApproval = async (t: Testimonial) => {
    if (!t.id) return;
    const newStatus = !t.approved;
    try {
      await updateDoc(doc(db, 'testimonials', t.id), {
        approved: newStatus,
      });
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, approved: newStatus } : item))
      );
    } catch (err) {
      console.error('Failed to update testimonial status:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !text) return;

    setIsSubmitting(true);
    try {
      const data: Omit<Testimonial, 'id'> = {
        customerName,
        customerPhoto,
        rating: Number(rating),
        text,
        service,
        approved,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
      };

      if (editingItem?.id) {
        await updateDoc(doc(db, 'testimonials', editingItem.id), data);
        setTestimonials((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...data, id: item.id } : item))
        );
      } else {
        const ref = await addDoc(collection(db, 'testimonials'), data);
        setTestimonials((prev) => [...prev, { ...data, id: ref.id }]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'testimonials', itemToDelete.id));
      setTestimonials((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Testimonial Moderation</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer feedback, ratings, and approve testimonials for public display.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full">
            <LoadingSkeleton rows={4} />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-3xl border border-slate-800">
            No testimonials found.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id || t.customerName}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors ${
                t.approved
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/60 border-dashed border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (t.rating || 5) ? 'fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      t.approved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t.approved ? 'Live On Site' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic mb-6 leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      t.customerPhoto ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                    }
                    alt={t.customerName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.customerName}</h4>
                    <p className="text-[10px] text-emerald-400 font-semibold">{t.service}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleApproval(t)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title={t.approved ? 'Hide from public site' : 'Approve for public site'}
                  >
                    {t.approved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(t)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-black text-white">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
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
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Service Performed
                  </label>
                  <input
                    type="text"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. Roof Replacement"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Customer's exact words regarding workmanship and cleanup..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div>
                <ImageUpload
                  label="Customer Photo (Optional)"
                  value={customerPhoto}
                  onChange={(url) => setCustomerPhoto(url)}
                  folder="testimonials"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                    className="rounded-sm border-slate-700 text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span className="font-bold text-white">Approve Immediately for Public Display</span>
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
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Testimonial?"
        message={`Are you sure you want to remove the review by "${itemToDelete?.customerName}"?`}
        confirmLabel="Delete Review"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
