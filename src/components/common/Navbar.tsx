import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Phone,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const servicesList = [
    { title: 'Roof Installation', slug: 'roof-installation' },
    { title: 'Roof Replacement', slug: 'roof-replacement' },
    { title: 'Roof Repair', slug: 'roof-repair' },
    { title: 'Gutter Services', slug: 'gutter-services' },
    { title: 'Roof Inspection', slug: 'roof-inspection' },
    { title: 'Emergency Roofing', slug: 'emergency-roofing' },
    { title: 'Commercial Roofing', slug: 'commercial-roofing' },
    { title: 'Storm Damage Repair', slug: 'storm-damage-repair' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b382c]/95 backdrop-blur-md shadow-lg py-3.5'
          : 'bg-[#0d3b2e] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                PeakShield
              </span>
              <span className="text-[10px] tracking-[0.25em] font-bold text-emerald-300 block uppercase mt-1">
                Roofing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-[#f97316]' : 'text-slate-100 hover:text-[#f97316]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/about' ? 'text-[#f97316]' : 'text-slate-100 hover:text-[#f97316]'
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/services')
                    ? 'text-[#f97316]'
                    : 'text-slate-100 hover:text-[#f97316]'
                }`}
              >
                Services
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Our Solutions
                      </span>
                      <Link
                        to="/services"
                        className="text-xs font-semibold text-[#ea580c] hover:underline"
                      >
                        View All →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {servicesList.map((svc) => (
                        <Link
                          key={svc.slug}
                          to={`/services/${svc.slug}`}
                          className="px-3 py-2 text-xs font-medium rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-center justify-between"
                        >
                          <span>{svc.title}</span>
                          <span className="text-emerald-600 font-bold opacity-0 hover:opacity-100">
                            ›
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/projects"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/projects')
                  ? 'text-[#f97316]'
                  : 'text-slate-100 hover:text-[#f97316]'
              }`}
            >
              Projects
            </Link>

            <Link
              to="/blog"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/blog')
                  ? 'text-[#f97316]'
                  : 'text-slate-100 hover:text-[#f97316]'
              }`}
            >
              Blog
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/contact'
                  ? 'text-[#f97316]'
                  : 'text-slate-100 hover:text-[#f97316]'
              }`}
            >
              Contact
            </Link>

            <Link
              to="/faq"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/faq'
                  ? 'text-[#f97316]'
                  : 'text-slate-100 hover:text-[#f97316]'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Phone Quick Link */}
            <a
              href="tel:1234567890"
              className="flex items-center gap-2 text-xs font-semibold text-emerald-100 bg-emerald-900/60 hover:bg-emerald-900 px-3 py-2 rounded-xl border border-emerald-700/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#f97316]" />
              <span>(123) 456-7890</span>
            </a>

            {/* Auth Dropdown or Login */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700 px-3 py-2 rounded-xl border border-emerald-600/30 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {userProfile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">
                    {userProfile?.name || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {userProfile?.name || 'User'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                        {isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          My Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          My Profile
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold text-emerald-200 hover:text-white px-2 py-1 transition-colors"
              >
                Log In
              </Link>
            )}

            {/* Get a Free Quote Button */}
            <Link
              to="/quote"
              className="bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Get a Free Quote</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/quote"
              className="bg-[#ea580c] text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white hover:bg-emerald-900 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c3328] border-t border-emerald-800/60 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              All Services
            </Link>
            <div className="pl-4 space-y-1">
              {servicesList.slice(0, 4).map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="block px-3 py-1 text-xs text-emerald-200 hover:text-white"
                >
                  • {s.title}
                </Link>
              ))}
            </div>
            <Link
              to="/projects"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              Projects
            </Link>
            <Link
              to="/blog"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900 rounded-lg"
            >
              FAQ
            </Link>
          </div>

          <div className="pt-3 border-t border-emerald-800/60 flex flex-col gap-2">
            <a
              href="tel:1234567890"
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-100 bg-emerald-900 rounded-xl"
            >
              <Phone className="w-4 h-4 text-[#f97316]" />
              <span>(123) 456-7890</span>
            </a>

            {user ? (
              <div className="flex flex-col gap-1">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="w-full text-center py-2 text-xs font-bold text-white bg-emerald-700 rounded-xl"
                  >
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="w-full text-center py-2 text-xs font-bold text-white bg-emerald-700 rounded-xl"
                  >
                    Customer Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-xs font-semibold text-red-300 hover:text-red-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="text-center py-2 text-xs font-semibold text-white bg-emerald-900 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2 text-xs font-semibold text-white bg-emerald-700 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
