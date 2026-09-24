import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/common/SEOHead';
import { User, Mail, Phone, Calendar, ShieldCheck, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user, userProfile, updateProfileData, resetPassword } = useAuth();

  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await updateProfileData({ name, phone });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendResetPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      setPasswordEmailSent(true);
      setTimeout(() => setPasswordEmailSent(false), 5000);
    } catch (err: any) {
      setError('Could not send password reset email.');
    }
  };

  return (
    <>
      <SEOHead
        title="My Account Profile - PeakShield Roofing"
        description="Manage your contact details, phone number, and password security."
      />

      <div className="bg-[#faf7f2] min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              Account Settings
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Personal Information
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ensure your phone and address details are accurate for estimate scheduling.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm space-y-8">
            {savedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {passwordEmailSent && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Password reset link sent to {user?.email}.</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Profile Overview Card */}
            <div className="flex items-center gap-5 pb-6 border-b border-stone-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl font-black shadow-md">
                {userProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{userProfile?.name || 'Customer'}</h3>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                    {userProfile?.role === 'admin' ? 'Administrator' : 'Verified Customer'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : '2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address (Linked to Account)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email cannot be modified directly for security reasons.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#faf7f2] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#0d3b2e] hover:bg-[#124d3d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendResetPassword}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-stone-200 hover:bg-stone-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4 text-[#ea580c]" />
                  <span>Send Password Reset Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
