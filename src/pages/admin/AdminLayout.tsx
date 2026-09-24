import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Wrench,
  FolderKanban,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Bell,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Quotes', path: '/admin/quotes', icon: FileSpreadsheet },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Services', path: '/admin/services', icon: Wrench },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Blog Posts', path: '/admin/blog', icon: BookOpen },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'FAQ', path: '/admin/faq', icon: HelpCircle },
    { label: 'Contact Messages', path: '/admin/messages', icon: Bell },
    { label: 'Company Settings', path: '/admin/settings', icon: Settings },
    { label: 'Admin Profile', path: '/admin/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between z-30">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ea580c] flex items-center justify-center text-white font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-white">PeakShield</span>
            <span className="text-[10px] font-bold text-emerald-400 block -mt-1 uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-black text-white leading-none block">
                  PeakShield
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mt-0.5">
                  Business Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Quick link to live public site */}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-emerald-300 border border-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>View Live Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#ea580c] text-white shadow-md shadow-orange-600/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User / Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center text-xs">
              {userProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {userProfile?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-semibold transition-colors border border-red-900/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0 bg-slate-900 text-slate-100 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>PeakShield Command Center</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-semibold capitalize">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Firestore Sync Active
            </span>
            <Link
              to="/admin/settings"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Company Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
