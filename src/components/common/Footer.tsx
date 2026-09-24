import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#08291f] text-slate-300 pt-20 pb-14 border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-emerald-900/50">
          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-md shadow-orange-600/30">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  PeakShield
                </span>
                <span className="text-[10px] tracking-[0.25em] font-bold text-emerald-300 block uppercase mt-1">
                  Roofing
                </span>
              </div>
            </Link>

            <p className="text-sm text-emerald-100/75 leading-relaxed max-w-sm font-normal">
              Building strong roofs and lasting relationships across Denver and Colorado. Certified master roofing contractors providing unmatched warranties, premium materials, and honest craftsmanship.
            </p>

            <div className="pt-1">
              <div className="flex items-center gap-3 text-xs text-emerald-200">
                <Clock className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>Mon - Fri: 7am - 6pm | Sat: 8am - 3pm | 24/7 Emergency</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Roofing Care & Maintenance Tips
              </p>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-900/50 px-3.5 py-2.5 rounded-xl border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-emerald-400/50 focus:outline-hidden focus:border-[#ea580c]"
                  />
                  <button
                    type="submit"
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Projects Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Roofing Blog
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-[#ea580c] font-semibold hover:underline">
                  Get a Free Quote
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/services/roof-installation" className="hover:text-white transition-colors">
                  Roof Installation
                </Link>
              </li>
              <li>
                <Link to="/services/roof-replacement" className="hover:text-white transition-colors">
                  Roof Replacement
                </Link>
              </li>
              <li>
                <Link to="/services/roof-repair" className="hover:text-white transition-colors">
                  Roof Repair
                </Link>
              </li>
              <li>
                <Link to="/services/gutter-services" className="hover:text-white transition-colors">
                  Gutter Services
                </Link>
              </li>
              <li>
                <Link to="/services/roof-inspection" className="hover:text-white transition-colors">
                  Drone Roof Inspection
                </Link>
              </li>
              <li>
                <Link to="/services/emergency-roofing" className="hover:text-white transition-colors">
                  Emergency Roofing 24/7
                </Link>
              </li>
              <li>
                <Link to="/services/commercial-roofing" className="hover:text-white transition-colors">
                  Commercial Roofing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="tel:1234567890"
                className="flex items-center gap-2.5 text-emerald-200 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>(123) 456-7890</span>
              </a>
              <a
                href="mailto:info@peakshieldroofing.com"
                className="flex items-center gap-2.5 text-emerald-200 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>info@peakshieldroofing.com</span>
              </a>
              <div className="flex items-start gap-2.5 text-emerald-200">
                <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                <span>123 Roofing Lane, Denver, CO 80202</span>
              </div>
            </div>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-white mb-2">
                Follow Us
              </h5>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-950 hover:bg-[#ea580c] text-emerald-200 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-950 hover:bg-[#ea580c] text-emerald-200 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-950 hover:bg-[#ea580c] text-emerald-200 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-950 hover:bg-[#ea580c] text-emerald-200 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and admin link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 gap-4">
          <p>© {new Date().getFullYear()} PeakShield Roofing LLC. All Rights Reserved. Fully Licensed & Insured.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-emerald-100 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Built with AI Studio & Start building Bar */}
        <div className="pt-6 mt-6 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#ea580c]/20 border border-[#ea580c]/40 flex items-center justify-center text-[#ea580c]">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
            <h2 className="text-xs font-semibold text-emerald-200/90 tracking-normal m-0 inline">
              Built with AI Studio
            </h2>
          </div>

          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-700/50 text-[11px] font-semibold transition-all"
          >
            <span>Start building</span>
            <ExternalLink className="w-3 h-3 text-[#ea580c]" />
          </a>
        </div>
      </div>
    </footer>
  );
};
