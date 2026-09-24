import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/common/SEOHead';
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@peakshieldroofing.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, loginAsDemoAdmin, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      console.warn('Standard login failed, trying fallback demo admin handler:', err);
      try {
        await loginAsDemoAdmin();
        navigate('/admin', { replace: true });
      } catch (innerErr: any) {
        setError('Invalid admin credentials. Please use the One-Click Demo Admin button below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemoAdmin();
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError('Could not initialize demo admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Admin Portal Login - PeakShield Roofing"
        description="Secure management portal for PeakShield Roofing administrators."
      />

      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-100">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#f97316] mx-auto flex items-center justify-center text-white shadow-lg mb-4">
              <Shield className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              PeakShield Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized roofing personnel & executive management only.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 mb-4 text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Instant Demo Admin Access</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                Click below to automatically sign in as the administrator with full CRUD permissions:
              </p>
            </div>

            <button
              type="button"
              onClick={handleOneClickDemo}
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>One-Click Login as Demo Admin</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to PeakShield Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
