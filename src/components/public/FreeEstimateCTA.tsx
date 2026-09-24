import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ArrowRight, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { Quote } from '../../types';
import luxuryHomeNightImg from '../../assets/images/luxury_home_night_1790268267513.jpg';

export const FreeEstimateCTA: React.FC = () => {
  const { user, userProfile } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [serviceName, setServiceName] = useState('Roof Replacement');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setError('Please fill out all required fields (Name, Phone, and Email).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quoteData: Omit<Quote, 'id'> = {
        customerId: user?.uid || undefined,
        fullName,
        email,
        phone,
        address: address || 'Not specified (Provided via quick form)',
        serviceName,
        message,
        photoUrls: [],
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'quotes'), quoteData);
      setSuccess(true);
      setMessage('');
    } catch (err: any) {
      console.error('Error submitting quote request:', err);
      setError('Could not submit your quote request right now. Please call us directly at (123) 456-7890.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Twilight Luxury House with Guarantee Overlay */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl relative min-h-[400px] lg:min-h-[540px] flex flex-col justify-end bg-slate-900 border border-stone-200">
            <img
              src={luxuryHomeNightImg}
              alt="Luxury residence with brand new PeakShield architectural roofing"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08291f]/95 via-[#08291f]/40 to-transparent" />

            <div className="relative z-10 p-8 sm:p-10 text-white">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#f97316] mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Free Drone Inspection</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Protecting Colorado Properties Since 2011
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-md leading-relaxed">
                Certified GAF Master Elite contractors with hundreds of verified 5-star reviews. Free itemized quote in under 24 hours.
              </p>

              <div className="mt-6 pt-5 border-t border-emerald-800/80 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
                  <span>No Obligation</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
                  <span>Zero Deposit</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
                  <span>50-Yr Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Get Your Free Estimate Form */}
          <div className="lg:col-span-6 bg-[#faf7f2] rounded-3xl p-8 sm:p-10 border border-stone-300/70 shadow-sm flex flex-col justify-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ea580c] mb-1.5">
                <span className="w-4 h-0.5 bg-[#ea580c]" />
                <span>Quick Online Estimate</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0d3b2e] tracking-tight">
                Get Your Free Estimate
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Complete this quick form and our master roofing team will provide an itemized assessment within 24 hours.
              </p>
            </div>

            {success ? (
              <div className="bg-white border border-emerald-300 rounded-2xl p-8 text-center shadow-xs animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-3.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <h4 className="text-lg font-bold text-emerald-950">Quote Request Received!</h4>
                <p className="text-xs sm:text-sm text-emerald-900/80 mt-2 leading-relaxed">
                  Thank you, <span className="font-semibold">{fullName}</span>. One of our master inspectors will contact you at <span className="font-semibold">{phone}</span> promptly.
                </p>
                {user && (
                  <p className="text-xs text-emerald-700 mt-3 font-medium">
                    You can track your estimate anytime in your Customer Dashboard.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-5 text-xs font-bold text-[#ea580c] hover:underline cursor-pointer"
                >
                  Submit another request →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(123) 456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Service Needed *
                    </label>
                    <select
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#ea580c] shadow-2xs"
                    >
                      <option value="Roof Installation">Roof Installation</option>
                      <option value="Roof Replacement">Roof Replacement</option>
                      <option value="Roof Repair">Roof Repair</option>
                      <option value="Gutter Services">Gutter Services</option>
                      <option value="Roof Inspection">Roof Inspection</option>
                      <option value="Emergency Roofing">Emergency Roofing</option>
                      <option value="Commercial Roofing">Commercial Roofing</option>
                      <option value="Storm Damage Repair">Storm Damage Repair</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Property Address (Street, City, Zip)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123 Oak Street, Denver, CO 80202"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project Details / Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about leaks, shingle age, hail storm date, or special requests..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c] shadow-2xs"
                  />
                </div>

                {/* Prominent Primary CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-sm sm:text-base font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform hover:-translate-y-0.5 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Your Estimate Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Get My Free Estimate Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Your information is strictly protected. We never sell or share your data.</span>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
