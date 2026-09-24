import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/common/SEOHead';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Quote } from '../../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  Hourglass,
  Plus,
  Eye,
  Calendar,
  MapPin,
  X,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchCustomerQuotes = async () => {
      if (!user) return;
      try {
        // Query by customerId or email
        const q = query(
          collection(db, 'quotes'),
          where('customerId', '==', user.uid)
        );
        const snap = await getDocs(q);

        let list: Quote[] = [];
        snap.forEach((doc) => {
          list.push({ ...(doc.data() as Quote), id: doc.id });
        });

        // Also query by email in case of guest submission prior to account creation
        if (user.email) {
          const emailQuery = query(
            collection(db, 'quotes'),
            where('email', '==', user.email)
          );
          const emailSnap = await getDocs(emailQuery);
          emailSnap.forEach((doc) => {
            if (!list.some((existing) => existing.id === doc.id)) {
              list.push({ ...(doc.data() as Quote), id: doc.id });
            }
          });
        }

        // Sort descending by createdAt
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setQuotes(list);
      } catch (err) {
        console.error('Error fetching customer quotes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCustomerQuotes();
    }
  }, [user, authLoading, navigate]);

  // Summary counts
  const totalRequests = quotes.length;
  const pendingRequests = quotes.filter((q) => q.status === 'Pending').length;
  const inProgressRequests = quotes.filter(
    (q) => q.status === 'In Progress' || q.status === 'Contacted' || q.status === 'Approved'
  ).length;
  const completedRequests = quotes.filter((q) => q.status === 'Completed').length;

  return (
    <>
      <SEOHead
        title="My Customer Dashboard - PeakShield Roofing"
        description="View your active roofing quotes, project progress, and scheduled inspections."
      />

      <div className="bg-[#faf7f2] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Customer Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome back, {userProfile?.name || 'Customer'}!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Track your active roofing estimates, scheduled repairs, and past projects.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="px-4 py-2.5 bg-white border border-stone-200 text-slate-700 hover:bg-stone-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Profile Settings
              </Link>
              <Link
                to="/quote"
                className="px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Request New Quote</span>
              </Link>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Requests
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalRequests}</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Pending Review
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-700">{pendingRequests}</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  In Progress
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Hourglass className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-700">{inProgressRequests}</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Completed
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800">{completedRequests}</div>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Quote Requests</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track estimates, inspections, and project milestones in real time.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-8">
                <LoadingSkeleton rows={4} />
              </div>
            ) : quotes.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<FileText className="w-8 h-8" />}
                  title="No Quote Requests Yet"
                  description="You have not submitted any roofing estimate requests. Get a 100% free comprehensive drone inspection quote today."
                  actionLabel="Get Free Quote Now"
                  onAction={() => navigate('/quote')}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf7f2] border-b border-stone-200 text-slate-600 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-6">Quote ID</th>
                      <th className="py-3.5 px-6">Service</th>
                      <th className="py-3.5 px-6">Submitted Date</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-[#0d3b2e]">
                          #{quote.id?.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {quote.serviceName}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {new Date(quote.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={quote.status} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedQuote(quote)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#faf7f2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Quote Details
                </span>
                <h3 className="text-lg font-black text-[#0d3b2e]">
                  #{selectedQuote.id?.slice(0, 8).toUpperCase()} • {selectedQuote.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Status and dates banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/70">
                <div>
                  <span className="text-slate-500 block mb-1">Current Status:</span>
                  <StatusBadge status={selectedQuote.status} size="md" />
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Submitted On:</span>
                  <span className="font-bold text-slate-900">
                    {new Date(selectedQuote.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ea580c]" /> Property Address
                  </span>
                  <p className="font-bold text-slate-800">{selectedQuote.address}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ea580c]" /> Preferred Date
                  </span>
                  <p className="font-bold text-slate-800">
                    {selectedQuote.preferredDate || 'Flexible / Earliest Available'}
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedQuote.message && (
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Customer Notes:</span>
                  <div className="p-4 rounded-2xl bg-slate-50 text-slate-700 leading-relaxed">
                    {selectedQuote.message}
                  </div>
                </div>
              )}

              {/* Photos */}
              {selectedQuote.photoUrls && selectedQuote.photoUrls.length > 0 && (
                <div>
                  <span className="text-slate-500 font-semibold block mb-2">Uploaded Property Photos:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedQuote.photoUrls.map((photo, i) => (
                      <a
                        key={i}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl overflow-hidden aspect-video border border-slate-200 group relative block"
                      >
                        <img src={photo} alt="Quote upload" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                          <ExternalLink className="w-4 h-4 mr-1" /> View Full
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Help & Support note */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-stone-200 text-slate-600 flex items-center justify-between">
                <span>Questions regarding this quote?</span>
                <a
                  href="tel:1234567890"
                  className="font-bold text-[#ea580c] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call (123) 456-7890
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
