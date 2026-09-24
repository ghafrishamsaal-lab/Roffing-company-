import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, KeyRound, CheckCircle2, User, Loader2 } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user, userProfile, updateProfileData, resetPassword } = useAuth();
  const [name, setName] = useState(userProfile?.name || 'Administrator');
  const [phone, setPhone] = useState(userProfile?.phone || '(123) 456-7890');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfileData({ name, phone });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white">Administrator Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage administrator account information and security credentials.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {resetSent && (
        <div className="p-4 rounded-2xl bg-blue-950/70 border border-blue-800 text-xs font-semibold text-blue-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>Password reset email dispatched to {user?.email}!</span>
        </div>
      )}

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#f97316] text-white flex items-center justify-center font-black text-2xl shadow-lg">
            {userProfile?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h3 className="text-base font-black text-white">{userProfile?.name || 'Administrator'}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
              System Super Admin
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Admin Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Admin Email</label>
            <input
              type="email"
              disabled
              value={user?.email || 'admin@peakshieldroofing.com'}
              className="w-full px-3.5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Emergency Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-[#ea580c]"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Admin Profile</span>
            </button>

            <button
              type="button"
              onClick={handlePasswordReset}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Reset Password via Email</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
