import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Quote, QuoteStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminQuotesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [serviceFilter, setServiceFilter] = useState('All');

  // Modal / Detail state
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'quotes'));
      const list: Quote[] = [];
      snap.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as Quote), id: docSnap.id });
      });
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setQuotes(list);
    } catch (err) {
      console.error('Error fetching admin quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (quoteId: string, newStatus: QuoteStatus) => {
    setStatusUpdating(true);
    try {
      await updateDoc(doc(db, 'quotes', quoteId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Failed to update quote status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!quoteToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'quotes', quoteToDelete.id));
      setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
      setQuoteToDelete(null);
      if (selectedQuote?.id === quoteToDelete.id) {
        setSelectedQuote(null);
      }
    } catch (err) {
      console.error('Failed to delete quote:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter quotes
  const filtered = quotes.filter((q) => {
    const matchesSearch =
      q.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || q.status === statusFilter;

    const matchesService =
      serviceFilter === 'All' || q.serviceName === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Paginated quotes
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedQuotes = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statuses: QuoteStatus[] = [
    'Pending',
    'Contacted',
    'Approved',
    'In Progress',
    'Completed',
    'Rejected',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Quote Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review incoming estimates, schedule field visits, and update project workflow.
          </p>
        </div>
        <button
          onClick={fetchQuotes}
          className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors border border-slate-700"
        >
          Refresh Quotes
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotes by client, email, phone, address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-[#ea580c] w-full md:w-auto"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<FileSpreadsheet className="w-8 h-8" />}
              title="No Quotes Found"
              description="No quote requests matched your active filters or search terms."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setServiceFilter('All');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Quote ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {paginatedQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-400">
                      #{q.id?.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{q.fullName}</div>
                      <div className="text-[11px] text-slate-400">{q.email} • {q.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-200">{q.serviceName}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(q)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors inline-flex items-center gap-1"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuoteToDelete(q)}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-200 hover:bg-red-900/60 transition-colors inline-flex items-center gap-1"
                        title="Delete Quote"
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

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                  Admin Inspection File
                </span>
                <h3 className="text-lg font-black text-white">
                  #{selectedQuote.id?.slice(0, 8).toUpperCase()} • {selectedQuote.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Status Update Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-slate-400 block mb-1">Update Status:</span>
                  <select
                    disabled={statusUpdating}
                    value={selectedQuote.status}
                    onChange={(e) =>
                      selectedQuote.id &&
                      handleStatusChange(selectedQuote.id, e.target.value as QuoteStatus)
                    }
                    className="bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#ea580c]"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Call Customer</span>
                  </a>
                  <a
                    href={`mailto:${selectedQuote.email}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>

              {/* Client & Address Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Customer Details
                  </span>
                  <p className="font-bold text-white text-sm">{selectedQuote.fullName}</p>
                  <p className="text-slate-400">{selectedQuote.email}</p>
                  <p className="text-slate-400">{selectedQuote.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">
                    Property & Requested Date
                  </span>
                  <p className="font-bold text-white text-sm flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                    <span>{selectedQuote.address}</span>
                  </p>
                  <p className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedQuote.preferredDate || 'Flexible / As soon as possible'}</span>
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedQuote.message && (
                <div>
                  <span className="text-slate-400 font-bold block mb-1.5 uppercase text-[10px]">
                    Customer Description
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                    {selectedQuote.message}
                  </div>
                </div>
              )}

              {/* Photos */}
              {selectedQuote.photoUrls && selectedQuote.photoUrls.length > 0 && (
                <div>
                  <span className="text-slate-400 font-bold block mb-2 uppercase text-[10px]">
                    Uploaded Property Photos ({selectedQuote.photoUrls.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedQuote.photoUrls.map((p, i) => (
                      <a
                        key={i}
                        href={p}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl overflow-hidden aspect-video border border-slate-800 group relative block"
                      >
                        <img src={p} alt="Upload" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                          <ExternalLink className="w-4 h-4 mr-1" /> View Full
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setQuoteToDelete(selectedQuote)}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Delete This Quote
              </button>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(quoteToDelete)}
        title="Delete Quote Request?"
        message={`Are you sure you want to permanently delete the quote for ${quoteToDelete?.fullName}? This action cannot be reversed.`}
        confirmLabel="Yes, Delete Quote"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setQuoteToDelete(null)}
      />
    </div>
  );
};
