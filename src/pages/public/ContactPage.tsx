import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { SEOHead } from '../../components/common/SEOHead';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { ContactMessage } from '../../types';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const msgData: Omit<ContactMessage, 'id'> = {
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
        status: 'unread',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'messages'), msgData);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to submit message:', err);
      setError('Could not send message right now. Please call us directly at (123) 456-7890.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us - PeakShield Roofing | Denver, CO"
        description="Get in touch with PeakShield Roofing for inspections, inquiries, storm emergency dispatch, or financing questions."
      />

      <div className="bg-[#0d3b2e] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f97316] mb-3 inline-block">
            We are Here to Help
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Contact PeakShield Roofing
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Have questions about your roof, want to schedule an on-site visit, or experiencing a storm leak? Our team responds within 2 hours during normal hours.
          </p>
        </div>
      </div>

      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Information & Hours */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-[#0d3b2e]">Direct Contact Information</h3>

                <div className="space-y-4">
                  <a
                    href="tel:1234567890"
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf7f2] hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Phone (Direct & Emergency)
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">(123) 456-7890</p>
                      <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                        24/7 Storm Response
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@peakshieldroofing.com"
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf7f2] hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        General Inquiries
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        info@peakshieldroofing.com
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Replies within 2 hours</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf7f2]">
                    <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Headquarters Office
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        123 Roofing Lane, Denver, CO 80202
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Serving the entire front range</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf7f2]">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Operating Hours
                      </p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        Monday – Friday: 7:00 AM – 6:00 PM
                      </p>
                      <p className="text-xs font-semibold text-slate-800">
                        Saturday: 8:00 AM – 3:00 PM
                      </p>
                      <p className="text-xs font-bold text-[#ea580c]">Sunday: Emergency Dispatch Only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-sm">
              <h3 className="text-2xl font-black text-[#0d3b2e] tracking-tight mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-8">
                Fill out the form below and a licensed roofing advisor will get back to you promptly.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950">Message Sent Successfully!</h4>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. We have logged your message in our support queue and will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs font-bold text-[#ea580c] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="(123) 456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Roof Inspection, Hail Assessment"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can our roofing team help you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ea580c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-bold text-xs sm:text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
