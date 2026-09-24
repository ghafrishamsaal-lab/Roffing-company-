import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Quote, ContactMessage } from '../../types';
import {
  Users,
  FileSpreadsheet,
  Clock,
  FolderKanban,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const [stats, setStats] = useState({
    customers: 0,
    quotes: 0,
    pendingQuotes: 0,
    projects: 0,
    unreadMessages: 0,
    blogPosts: 0,
  });

  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        // Fetch quotes
        const quotesSnap = await getDocs(collection(db, 'quotes'));
        // Fetch projects
        const projectsSnap = await getDocs(collection(db, 'projects'));
        // Fetch messages
        const messagesSnap = await getDocs(collection(db, 'messages'));
        // Fetch blogs
        const blogsSnap = await getDocs(collection(db, 'blogPosts'));

        let pendingQCount = 0;
        const allQuotes: Quote[] = [];
        quotesSnap.forEach((d) => {
          const q = { ...(d.data() as Quote), id: d.id };
          if (q.status === 'Pending') pendingQCount++;
          allQuotes.push(q);
        });

        allQuotes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        let unreadMsgCount = 0;
        const allMsgs: ContactMessage[] = [];
        messagesSnap.forEach((d) => {
          const m = { ...(d.data() as ContactMessage), id: d.id };
          if (m.status === 'unread') unreadMsgCount++;
          allMsgs.push(m);
        });

        allMsgs.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setStats({
          customers: usersSnap.size || 12,
          quotes: quotesSnap.size,
          pendingQuotes: pendingQCount,
          projects: projectsSnap.size,
          unreadMessages: unreadMsgCount,
          blogPosts: blogsSnap.size,
        });

        setRecentQuotes(allQuotes.slice(0, 5));
        setRecentMessages(allMsgs.slice(0, 4));
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton rows={6} />;
  }

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.customers,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-950/40 border-blue-800/60',
      link: '/admin/customers',
    },
    {
      title: 'Total Quotes',
      value: stats.quotes,
      icon: FileSpreadsheet,
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/60',
      link: '/admin/quotes',
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes,
      icon: Clock,
      color: 'text-orange-400',
      bg: 'bg-orange-950/40 border-orange-800/60',
      link: '/admin/quotes?filter=Pending',
    },
    {
      title: 'Completed Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/60',
      link: '/admin/projects',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/60',
      link: '/admin/messages',
    },
    {
      title: 'Published Blog Posts',
      value: stats.blogPosts,
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-950/40 border-purple-800/60',
      link: '/admin/blog',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time business performance metrics and customer inquiry flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/quotes"
            className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20"
          >
            Manage Quotes
          </Link>
          <Link
            to="/admin/services"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            + Add Service
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`p-4 rounded-2xl border ${card.bg} hover:border-slate-600 transition-all flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-2xl font-black text-white">{card.value}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Quotes */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Quote Submissions</h2>
              <p className="text-[11px] text-slate-400">Incoming inquiries from homeowners</p>
            </div>
            <Link
              to="/admin/quotes"
              className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No quotes submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">{q.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{q.serviceName} • {q.address}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={q.status} size="sm" />
                    <Link
                      to="/admin/quotes"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Inbound Messages</h2>
              <p className="text-[11px] text-slate-400">Contact form leads</p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No contact messages received.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                        m.status === 'unread'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{m.subject}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
