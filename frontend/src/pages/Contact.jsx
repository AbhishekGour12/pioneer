// pages/Contact.jsx - PlayPeak Sports Academy Contact & Enquiries
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiArrowRight,
  FiCheckCircle,
  FiPlus,
  FiMinus
} from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';

import axios from 'axios';
import { getApiBase } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    sport: '10M Rifle Shooting',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isCustomSport, setIsCustomSport] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const API_BASE = getApiBase();
    const leadPayload = {
      id: 'inq_' + Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      sport: formData.sport,
      planInterested: formData.sport,
      message: formData.message.trim(),
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };

    // 1. Post to MongoDB Atlas API
    axios.post(`${API_BASE}inquiries`, leadPayload)
      .then(() => {
        console.log("Inquiry submitted to MongoDB Atlas");
      })
      .catch((err) => console.warn('Inquiry API note:', err.message));

    // 2. Save to local storage for offline cache & multi-tab recovery
    try {
      const existing = JSON.parse(localStorage.getItem('playpeak_inquiries') || '[]');
      localStorage.setItem('playpeak_inquiries', JSON.stringify([leadPayload, ...existing]));

      const pioneerExisting = JSON.parse(localStorage.getItem('pioneer_inquiries') || '[]');
      localStorage.setItem('pioneer_inquiries', JSON.stringify([leadPayload, ...pioneerExisting]));
    } catch (err) {}

    // 3. Instant cross-tab real-time sync with Admin Dashboard
    try {
      window.dispatchEvent(new CustomEvent('pioneer_inquiry_received', { detail: leadPayload }));
      const channel = new BroadcastChannel('playpeak_realtime_sync');
      channel.postMessage({ type: 'INQUIRY_RECEIVED', inquiry: leadPayload });
      channel.close();
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        sport: '10M Rifle Shooting',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 7000);
    }, 600);
  };

  const faqs = [
    {
      q: "How do I book a Trial Practice Session at the Range?",
      a: "Fill out the enquiry form on this page with your preferred discipline (10M Rifle, Pistol, or Beginner Course). Our coaching desk will call or WhatsApp you to schedule your session between 8:00 AM and 8:00 PM."
    },
    {
      q: "What age groups does Pioneer Rifle Shooting Academy cater to?",
      a: "We train aspiring shooters from beginner level (ages 8+) to junior, youth, and open competitive categories for state and national championships."
    },
    {
      q: "What is the membership fee structure at Pioneer Shooting Academy?",
      a: "Our official fee structure consists of a One-Time Annual Registration Fee of ₹5,000 (mandatory annual admission for shooter accreditation, official ID card, digital QR gate pass, locker access, and state/district trial affiliation) and an All-Inclusive Monthly Training Fee of ₹4,700 per month (covers daily 1 to 1.5 hr practice sessions 8 AM - 8 PM, match rifles/pistols access, high-grade pellet boxes, target papers, and certified coach mentorship)."
    },
    {
      q: "What are the academy timings and session durations?",
      a: "We are open all days from 8:00 AM to 8:00 PM. Each practice session generally lasts 1 to 1.5 hours to provide flexible training for every shooter."
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800">
      
      {/* Header Banner */}
      <div className="relative bg-[#0A0E17] text-white py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url('/images/shooting/shooting-winners-podium.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/80 to-[#070A0F]/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A1A]">
              GET IN TOUCH
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Enquire & Book <span className="text-[#FF6A1A]">Free Trial</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Take the first step towards a healthier, stronger and brighter future. Our coaching coordinators are here to guide you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start mb-20">
          
          {/* Left Column: Academy Campus Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-2xl text-slate-900">
                Academy Campus Info
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiMapPin />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Campus Location:</strong>
                    <span>Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore, MP - 452010</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiPhone />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Direct Phone & WhatsApp:</strong>
                    <span>+91 9893270807 / +91 9294771208</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiMail />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Admissions & Enquiries:</strong>
                    <span>pioneershootingindore@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-lg shrink-0">
                    <FiClock />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-display">Academy Timings:</strong>
                    <span>8:00 AM TO 8:00 PM (Open all days • Practice Duration: 1 to 1.5 Hours)</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">
                  Follow Pioneer Shooting Academy
                </span>
                <div className="flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaInstagram />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaYoutube />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#FF6A1A] hover:border-[#FF6A1A] transition-colors">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>

            {/* Photo Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md relative group">
              <img src="/images/shooting/shooting-squad-outdoor.jpg" alt="Pioneer Shooting Academy Athletes & Coach" className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">SHOOT TODAY, THEN LEAD TOMORROW</span>
                <h4 className="font-display font-bold text-white text-base">We don't just teach shooting, we build champions.</h4>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Query Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                DIRECT ACADEMY INQUIRY
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
                Send Your Contact Query
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Connect directly with the Pioneer Rifle Shooting Academy coaching desk. We will answer your questions and arrange range visits.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6A1A] flex items-center justify-center mx-auto text-3xl shadow-sm">
                  <FiCheckCircle />
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900">Query Received!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you! Your query has been logged and routed to the Academy Admin panel. Our coach coordinator will call or WhatsApp you shortly.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/919893270807?text=Hello%20Pioneer%20Rifle%20Shooting%20Academy,%20I%20just%20submitted%20a%20query%20on%20your%20website.%20Please%20connect%20with%20me."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs shadow-md transition-all"
                  >
                    <FaWhatsapp className="text-base" /> Chat Directly on WhatsApp (+91 9893270807)
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    Full Name <span className="text-[#FF6A1A]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Aryan Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">
                      Phone Number / WhatsApp <span className="text-[#FF6A1A]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      placeholder="e.g. +91 98932 70807"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">
                      Email Address <span className="text-[#FF6A1A]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="e.g. shooter@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold block">
                      Sport Discipline / Course Preference
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isCustomSport;
                        setIsCustomSport(next);
                        if (!next && !formData.sport) {
                          setFormData(prev => ({ ...prev, sport: '10M Rifle Shooting' }));
                        }
                      }}
                      className="text-[11px] text-[#FF6A1A] font-bold hover:underline"
                    >
                      {isCustomSport ? "← Choose from List" : "+ Enter Manually"}
                    </button>
                  </div>
                  {isCustomSport ? (
                    <input
                      type="text"
                      name="sport"
                      placeholder="Type custom discipline (e.g. 10M Air Rifle Match Grade)..."
                      value={formData.sport}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-[#FF6A1A] text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#FF6A1A]"
                      required
                    />
                  ) : (
                    <select
                      name="sport"
                      value={formData.sport}
                      onChange={(e) => {
                        if (e.target.value === 'custom_manual') {
                          setIsCustomSport(true);
                          setFormData(prev => ({ ...prev, sport: '' }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-[#FF6A1A]"
                    >
                      <option value="10M Rifle Shooting">10M Rifle Shooting</option>
                      <option value="10M Pistol Shooting">10M Pistol Shooting</option>
                      <option value="Beginner Training Course">Beginner Training Course</option>
                      <option value="Competitive Match Training">Competitive Match Training</option>
                      <option value="Target Biomechanics & Stance">Target Biomechanics & Stance</option>
                      <option value="Daily Practice (1 - 1.5 Hrs)">Daily Practice (1 - 1.5 Hrs)</option>
                      <option value="custom_manual">✎ Enter Manually (Custom Discipline)...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">
                    Contact Query / Description <span className="text-[#FF6A1A]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    name="message"
                    placeholder="Describe your inquiry, trial requirements, training schedule preferences, or questions..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <span>Sending Query to Academy Desk...</span>
                    ) : (
                      <>
                        <span>Submit Contact Query</span>
                        <FiSend />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* FAQs */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Common questions answered for parents and student athletes.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 cursor-pointer transition-all hover:border-[#FF6A1A]"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                  <span>{faq.q}</span>
                  {openFaq === idx ? <FiMinus className="text-[#FF6A1A]" /> : <FiPlus className="text-slate-400" />}
                </div>

                {openFaq === idx && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Contact;
