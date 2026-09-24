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
import { Project } from '../../types';
import { INITIAL_PROJECTS } from '../../services/seedData';
import { ImageUpload } from '../../components/common/ImageUpload';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  MapPin,
  Calendar,
  Loader2,
} from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal / form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('Denver, CO');
  const [serviceType, setServiceType] = useState('Roof Replacement');
  const [description, setDescription] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [completedDate, setCompletedDate] = useState('2025-11-01');
  const [featured, setFeatured] = useState(true);

  // Delete state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'projects'));
      if (!snap.empty) {
        const list: Project[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as Project), id: d.id });
        });
        setProjects(list);
      } else {
        setProjects(INITIAL_PROJECTS as Project[]);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects(INITIAL_PROJECTS as Project[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setLocation('Denver, CO');
    setServiceType('Roof Replacement');
    setDescription('');
    setBeforeImage('');
    setAfterImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80');
    setCompletedDate(new Date().toISOString().split('T')[0]);
    setFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setLocation(proj.location);
    setServiceType(proj.serviceType);
    setDescription(proj.description);
    setBeforeImage(proj.beforeImage || '');
    setAfterImage(proj.afterImage);
    setCompletedDate(proj.completedDate);
    setFeatured(Boolean(proj.featured));
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
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
    if (!title || !slug || !afterImage) return;

    setIsSubmitting(true);
    try {
      const projData: Omit<Project, 'id'> = {
        title,
        slug,
        location,
        serviceType,
        description,
        beforeImage: beforeImage || undefined,
        afterImage,
        gallery: [afterImage, ...(beforeImage ? [beforeImage] : [])],
        completedDate,
        featured,
        updatedAt: new Date().toISOString(),
      };

      if (editingProject?.id) {
        await updateDoc(doc(db, 'projects', editingProject.id), projData);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...projData, id: p.id } : p))
        );
      } else {
        const ref = await addDoc(collection(db, 'projects'), {
          ...projData,
          createdAt: new Date().toISOString(),
        });
        setProjects((prev) => [...prev, { ...projData, id: ref.id }]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Error saving project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'projects', projectToDelete.id));
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Project Case Studies</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage completed residential & commercial project showcases with before & after photos.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-6">Service Type</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Before / After</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {filtered.map((p) => (
                  <tr key={p.id || p.slug} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.afterImage}
                          alt={p.title}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{p.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-200">{p.serviceType}</td>
                    <td className="py-4 px-6 text-slate-300 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>{p.location}</span>
                    </td>
                    <td className="py-4 px-6">
                      {p.beforeImage ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          Dual Images
                        </span>
                      ) : (
                        <span className="text-slate-500">After only</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {p.featured ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProjectToDelete(p)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-200 hover:bg-red-900/60 transition-colors"
                        title="Delete Project"
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
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-black text-white">
                {editingProject ? 'Edit Project Case Study' : 'Add New Project Case Study'}
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
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Aspen Ridge Residence"
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
                    placeholder="e.g. aspen-ridge-residence"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  >
                    <option value="Roof Replacement">Roof Replacement</option>
                    <option value="Roof Installation">Roof Installation</option>
                    <option value="Roof Repair">Roof Repair</option>
                    <option value="Gutter Services">Gutter Services</option>
                    <option value="Commercial Roofing">Commercial Roofing</option>
                    <option value="Storm Damage Repair">Storm Damage Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Denver, CO"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Completed Date
                  </label>
                  <input
                    type="date"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Project Description & Challenges Overcome
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the materials used, challenges overcome, and homeowner satisfaction..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              {/* After Photo (Required) */}
              <div>
                <ImageUpload
                  label="Completed / After Photo *"
                  value={afterImage}
                  onChange={(url) => setAfterImage(url)}
                  folder="projects"
                />
              </div>

              {/* Before Photo (Optional for Before/After Slider) */}
              <div>
                <ImageUpload
                  label="Original / Before Photo (Optional for comparison slider)"
                  value={beforeImage}
                  onChange={(url) => setBeforeImage(url)}
                  folder="projects"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded-sm border-slate-700 text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span className="font-bold text-white">Feature in Homepage Showcase</span>
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
                  <span>{editingProject ? 'Save Project' : 'Publish Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        title="Delete Project Case Study?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"?`}
        confirmLabel="Delete Project"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
};
