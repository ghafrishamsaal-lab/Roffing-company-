import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/common/SEOHead';
import { ImageUpload } from '../../components/common/ImageUpload';
import { Quote } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  Camera,
  X,
} from 'lucide-react';

export const QuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || 'Roof Replacement';
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState('');
  const [serviceName, setServiceName] = useState(preselectedService);
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      if (!fullName) setFullName(userProfile.name);
      if (!phone && userProfile.phone) setPhone(userProfile.phone);
    }
    if (user && !email) {
      setEmail(user.email || '');
    }
  }, [user, userProfile]);

  const handleAddPhoto = (url: string) => {
    if (url && photoUrls.length < 5) {
      setPhotoUrls((prev) => [...prev, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) {
      setError('Please complete all required fields (Name, Email, Phone, and Address).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quotePayload: Omit<Quote, 'id'> = {
        customerId: user?.uid || undefined,
        fullName,
        email,
        phone,
        address,
        serviceName,
        preferredDate: preferredDate || undefined,
        message: message || undefined,
        photoUrls,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'quotes'), quotePayload);
      setSubmittedQuoteId(docRef.id);
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      setError('Failed to submit quote. Please try again or call us at (123) 456-7890.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Get a Free Quote - PeakShield Roofing"
        description="Request a free, comprehensive roof estimate online. 21-point drone inspections, transparent pricing, and 50-year warranties."
      />

      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
            Free Comprehensive Estimate
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Schedule Your Roofing Quote
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Fast, zero-obligation estimate backed by 4K drone photography, itemized transparent pricing, and factory manufacturer certification.
          </p>
        </div>
      </div>

      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submittedQuoteId ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-xl text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                Quote Reference #{submittedQuoteId.slice(0, 8).toUpperCase()}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Quote Request is In Good Hands!
              </h2>

              <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mt-3 leading-relaxed">
                Thank you, <span className="font-bold text-slate-800">{fullName}</span>. We have assigned your file to our senior Denver roofing technician. We will review your property at{' '}
                <span className="font-semibold text-slate-800">{address}</span> and follow up within 24 hours.
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="bg-[#0d3b2e] hover:bg-[#124d3d] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>View in Customer Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to={`/register?email=${encodeURIComponent(email)}`}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Create Free Account to Track Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedQuoteId(null);
                    setAddress('');
                    setMessage('');
                    setPhotoUrls([]);
                  }}
                  className="px-5 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition-colors"
                >
                  Submit Another Quote
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-xl">
              <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0d3b2e]">Property & Project Details</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Please provide accurate property information for our satellite and drone estimators.
                  </p>
                </div>
                {!user && (
                  <div className="text-xs text-slate-600 bg-[#faf7f2] p-3 rounded-xl border border-stone-200">
                    <span>Already have an account? </span>
                    <Link to="/login" className="font-bold text-[#ea580c] hover:underline">
                      Log In
                    </Link>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    1. Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Property & Service Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    2. Service & Property Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Property Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="1234 Highland Blvd, Denver, CO 80202"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Service Required *
                      </label>
                      <select
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#ea580c]"
                      >
                        <option value="Roof Installation">Roof Installation (New Construction)</option>
                        <option value="Roof Replacement">Roof Replacement (Full Tear-Off)</option>
                        <option value="Roof Repair">Roof Repair (Leaks, Missing Shingles)</option>
                        <option value="Gutter Services">Gutter Services (Seamless & Guards)</option>
                        <option value="Roof Inspection">Roof Inspection (Drone & Certified)</option>
                        <option value="Emergency Roofing">Emergency Roofing 24/7</option>
                        <option value="Commercial Roofing">Commercial Roofing (TPO/Metal)</option>
                        <option value="Storm Damage Repair">Storm Damage & Hail Claim</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Inspection Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                {/* Additional Description & Photos */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    3. Description & Photos
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Describe the condition or issues (age of roof, active leaks, hail history)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please share any helpful details regarding leaks, ceiling water marks, missing shingles, or insurance claims..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Upload Photos of Roof / Leaks (Optional, up to 5 photos)
                    </label>

                    {/* Photo previews list */}
                    {photoUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {photoUrls.map((url, idx) => (
                          <div key={idx} className="relative rounded-xl overflow-hidden aspect-video border border-slate-200">
                            <img src={url} alt="Upload preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {photoUrls.length < 5 && (
                      <ImageUpload
                        folder="quote-uploads"
                        onChange={handleAddPhoto}
                        helperText="Upload photos from your yard or attic (PNG, JPG up to 5MB)"
                      />
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Your Estimate Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Free Quote Request</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 mt-3">
                    By submitting, you agree to receive communications from PeakShield Roofing. We never sell your data.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
