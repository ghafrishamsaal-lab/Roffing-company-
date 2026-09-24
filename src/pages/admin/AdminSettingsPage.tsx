import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { CompanySettings } from '../../types';
import { INITIAL_SETTINGS } from '../../services/seedData';
import { ImageUpload } from '../../components/common/ImageUpload';
import {
  Settings,
  CheckCircle2,
  Loader2,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, 'settings', 'company'));
        if (snap.exists()) {
          setSettings(snap.data() as CompanySettings);
        } else {
          setSettings(INITIAL_SETTINGS);
        }
      } catch (err) {
        console.error('Error fetching company settings:', err);
        setSettings(INITIAL_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'settings', 'company'), settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      console.error('Failed to update company settings:', err);
      setError('Could not save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Company & Website Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify brand name, contact numbers, addresses, social channels, and homepage copy. Changes reflect live.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Company settings saved to Firestore! Live website updated dynamically.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-800 text-xs text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#ea580c]" />
            <span>Company Brand Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Name</label>
              <input
                type="text"
                required
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Direct Phone</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Official Email</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">HQ Address</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Operating Hours</label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) => handleChange('businessHours', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
            />
          </div>
        </div>

        {/* Hero Section & Copy */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            <span>Homepage Copy & Headlines</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Hero Section Headline
            </label>
            <input
              type="text"
              required
              value={settings.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Hero Supporting Description
            </label>
            <textarea
              rows={3}
              required
              value={settings.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Footer Description Text
            </label>
            <textarea
              rows={2}
              value={settings.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Social Media Handles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={settings.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">YouTube URL</label>
              <input
                type="url"
                value={settings.youtube || ''}
                onChange={(e) => handleChange('youtube', e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#ea580c]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Company Settings...</span>
              </>
            ) : (
              <span>Save & Publish Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
