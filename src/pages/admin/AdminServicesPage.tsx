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
import { Service } from '../../types';
import { INITIAL_SERVICES } from '../../services/seedData';
import { ImageUpload } from '../../components/common/ImageUpload';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  Eye,
  Loader2,
} from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startingPrice, setStartingPrice] = useState<number | string>(1500);
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [features, setFeatures] = useState<string[]>(['']);

  // Delete confirm
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'services'));
      if (!snap.empty) {
        const list: Service[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as Service), id: d.id });
        });
        setServices(list);
      } else {
        setServices(INITIAL_SERVICES as Service[]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices(INITIAL_SERVICES as Service[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setShortDesc('');
    setDesc('');
    setImageUrl('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80');
    setStartingPrice(1500);
    setActive(true);
    setFeatured(false);
    setFeatures(['Certified Master Installation', '50-Year Non-Prorated Warranty', 'Free Drone Inspection']);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setSlug(service.slug);
    setShortDesc(service.shortDescription);
    setDesc(service.description);
    setImageUrl(service.imageUrl);
    setStartingPrice(service.startingPrice || 0);
    setActive(service.active !== false);
    setFeatured(Boolean(service.featured));
    setFeatures(service.features?.length ? service.features : ['']);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingService) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  const handleFeatureChange = (index: number, val: string) => {
    const copy = [...features];
    copy[index] = val;
    setFeatures(copy);
  };

  const addFeatureRow = () => {
    setFeatures([...features, '']);
  };

  const removeFeatureRow = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !shortDesc) return;

    setIsSubmitting(true);
    try {
      const cleanFeatures = features.filter((f) => f.trim().length > 0);

      const serviceData: Omit<Service, 'id'> = {
        title,
        slug,
        shortDescription: shortDesc,
        description: desc || shortDesc,
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        features: cleanFeatures,
        startingPrice: Number(startingPrice) || 0,
        active,
        featured,
        updatedAt: new Date().toISOString(),
      };

      if (editingService?.id) {
        // Update existing
        await updateDoc(doc(db, 'services', editingService.id), serviceData);
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? { ...serviceData, id: s.id } : s))
        );
      } else {
        // Create new
        const docRef = await addDoc(collection(db, 'services'), {
          ...serviceData,
          createdAt: new Date().toISOString(),
        });
        setServices((prev) => [...prev, { ...serviceData, id: docRef.id }]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save service:', err);
      alert('Error saving service to Firestore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'services', serviceToDelete.id));
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      console.error('Failed to delete service:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Services Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, update, and manage public roofing offerings and starting prices.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
          />
        </div>
      </div>

      {/* Services Grid/Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No services match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Starting Price</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {filtered.map((s) => (
                  <tr key={s.id || s.slug} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{s.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                            {s.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">/{s.slug}</td>
                    <td className="py-4 px-6 font-bold text-white">
                      ${Number(s.startingPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      {s.featured ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          s.active !== false
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {s.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setServiceToDelete(s)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-200 hover:bg-red-900/60 transition-colors"
                        title="Delete Service"
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

      {/* Edit / Create Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-black text-white">
                {editingService ? 'Edit Roofing Service' : 'Add New Roofing Service'}
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
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Copper Flashing & Valleys"
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
                    placeholder="e.g. copper-flashing"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Short Summary (Shown on Cards) *
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="One sentence overview for cards and meta descriptions..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Service Description
                </label>
                <textarea
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Comprehensive technical details, process, and standards..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Starting Price ($)
                  </label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded-sm border-slate-700 text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <span className="font-bold text-white">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded-sm border-slate-700 text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <span className="font-bold text-white">Featured on Home</span>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <ImageUpload
                  label="Service Hero Photo"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  folder="services"
                />
              </div>

              {/* Features List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Service Features & Highlights
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="text-[11px] font-bold text-[#ea580c] hover:underline"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature #${idx + 1} (e.g. 50-Year Non-Prorated Warranty)`}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureRow(idx)}
                          className="p-2 text-slate-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                  <span>{editingService ? 'Save Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(serviceToDelete)}
        title="Delete Service Offering?"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? It will no longer appear on the website.`}
        confirmLabel="Delete Service"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
};
