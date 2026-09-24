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
import { FAQ } from '../../types';
import { INITIAL_FAQS } from '../../services/seedData';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle,
  EyeOff,
  Eye,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';

export const AdminFAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [order, setOrder] = useState<number>(1);
  const [active, setActive] = useState(true);

  // Delete
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'faqs'));
      if (!snap.empty) {
        const list: FAQ[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as FAQ), id: d.id });
        });
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setFaqs(list);
      } else {
        setFaqs(INITIAL_FAQS as FAQ[]);
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setFaqs(INITIAL_FAQS as FAQ[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setOrder(faqs.length + 1);
    setActive(true);
    setModalOpen(true);
  };

  const openEditModal = (f: FAQ) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category || 'General');
    setOrder(f.order || 1);
    setActive(f.active !== false);
    setModalOpen(true);
  };

  const toggleActive = async (f: FAQ) => {
    if (!f.id) return;
    const newActive = !f.active;
    try {
      await updateDoc(doc(db, 'faqs', f.id), { active: newActive });
      setFaqs((prev) =>
        prev.map((item) => (item.id === f.id ? { ...item, active: newActive } : item))
      );
    } catch (err) {
      console.error('Error toggling FAQ:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    setIsSubmitting(true);
    try {
      const data: Omit<FAQ, 'id'> = {
        question,
        answer,
        category,
        order: Number(order) || 1,
        active,
      };

      if (editingFaq?.id) {
        await updateDoc(doc(db, 'faqs', editingFaq.id), data);
        setFaqs((prev) =>
          prev
            .map((item) => (item.id === editingFaq.id ? { ...data, id: item.id } : item))
            .sort((a, b) => a.order - b.order)
        );
      } else {
        const ref = await addDoc(collection(db, 'faqs'), data);
        setFaqs((prev) => [...prev, { ...data, id: ref.id }].sort((a, b) => a.order - b.order));
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save FAQ:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'faqs', faqToDelete.id));
      setFaqs((prev) => prev.filter((item) => item.id !== faqToDelete.id));
      setFaqToDelete(null);
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">FAQ Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize knowledge base questions, answers, categories, and display hierarchy.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
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
            No FAQs found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6 w-16">Order</th>
                  <th className="py-4 px-6">Question</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {filtered.map((f) => (
                  <tr key={f.id || f.question} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#ea580c]">#{f.order}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-sm">{f.question}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-xl">
                        {f.answer}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[11px] font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                        {f.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          f.active !== false
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {f.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => toggleActive(f)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title={f.active !== false ? 'Deactivate' : 'Activate'}
                      >
                        {f.active !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                      <button
                        onClick={() => openEditModal(f)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFaqToDelete(f)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-black text-white">
                {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How long does a roof replacement take?"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Detailed Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a thorough, reassuring answer with specifications..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
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
                    <option value="General">General</option>
                    <option value="Process">Process</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Warranties">Warranties</option>
                    <option value="Pricing & Financing">Pricing & Financing</option>
                    <option value="Safety & Licensing">Safety & Licensing</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Display Order (Rank)
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded-sm border-slate-700 text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span className="font-bold text-white">Active (Visible on FAQ page & Homepage)</span>
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
                  <span>{editingFaq ? 'Save FAQ' : 'Create FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(faqToDelete)}
        title="Delete FAQ Item?"
        message={`Are you sure you want to permanently delete this FAQ: "${faqToDelete?.question}"?`}
        confirmLabel="Delete FAQ"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setFaqToDelete(null)}
      />
    </div>
  );
};
