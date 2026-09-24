import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/common/SEOHead';
import { Shield, Mail, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your account email.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Reset Your Password - PeakShield Roofing"
        description="Reset your PeakShield customer portal account password."
      />

      <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#faf7f2]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email to receive a password reset link.
            </p>
          </div>

          {sent ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-950">Reset Email Sent!</h4>
              <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                We sent instructions to <span className="font-semibold">{email}</span>. Please check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block text-xs font-bold text-[#ea580c] hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0d3b2e] hover:bg-[#124d3d] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending email...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-900 font-semibold">
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
