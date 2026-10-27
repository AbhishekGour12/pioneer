// pages/Payments.jsx - Pioneer Rifle Shooting Academy Passes & Direct WhatsApp Admission
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    FiCheckCircle, 
    FiClock, 
    FiCheck, 
    FiShield,
    FiTarget,
    FiAward,
    FiArrowRight
} from 'react-icons/fi';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getApiBase } from '../utils/api';

const Payments = () => {
    const [selectedShift, setSelectedShift] = useState('evening'); // morning, afternoon, evening, flexible
    const [toastMessage, setToastMessage] = useState(null);

    const user = useSelector((state) => state.user?.value) || JSON.parse(localStorage.getItem('libraryUser') || '{}');

    const membershipPlans = [
        { 
            id: 'annual-registration',
            name: 'One-Time Annual Registration Fee', 
            basePrice: 5000, 
            cycleLabel: 'One-Time / Year',
            popular: false,
            badge: 'Official Fee #1 (Annual)',
            desc: 'Mandatory annual registration for all shooters, securing official affiliation, digital locker access, and shooter accreditation.',
            features: [
                'Official Pioneer Shooter Registration & ID Card',
                'Digital QR Gate Pass & Locker Room Access',
                'Affiliation for District & State Shooting Trials',
                'Gun armory safety inspection & stance setup',
                'Valid for 1 Full Year'
            ]
        },
        { 
            id: 'monthly-training',
            name: 'Monthly Training Fee', 
            basePrice: 4700, 
            cycleLabel: 'Per Month',
            popular: true,
            badge: 'Official Fee #2 (Monthly)',
            desc: 'Standard monthly training fee including daily range practice, weapons, target papers, pellets, and coach mentorship.',
            features: [
                'Daily Practice Sessions (Duration: 1 to 1.5 Hours)',
                'Pellet Boxes included in fee',
                'Target Papers provided every session',
                'Match Weapons & Shooting Equipment access',
                'Expert Coaching Support (8:00 AM - 8:00 PM)'
            ]
        }
    ];

    const trainingShifts = [
        { id: 'morning', name: 'Morning Batches', time: '08:00 AM - 12:00 PM', desc: 'Prime morning focus & sighting drills' },
        { id: 'afternoon', name: 'Afternoon Batches', time: '12:00 PM - 04:00 PM', desc: 'Flexible midday shooting practice' },
        { id: 'evening', name: 'Evening Prime', time: '04:00 PM - 08:00 PM', desc: 'High-intensity evening lane practice' },
        { id: 'flexible', name: 'Flexible All-Day', time: '08:00 AM - 08:00 PM', desc: 'Any 1 to 1.5 hr slot (Open all days)' }
    ];

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleDirectWhatsAppEnroll = (plan) => {
        const shiftObj = trainingShifts.find(s => s.id === selectedShift);
        const shiftLabel = shiftObj ? `${shiftObj.name} (${shiftObj.time})` : selectedShift.toUpperCase();
        
        const message = `Hello Pioneer Rifle Shooting Academy! 🎯\n\nI want to enroll for:\n📋 *Plan:* ${plan.name} (₹${plan.basePrice.toLocaleString()})\n⏰ *Shift Preference:* ${shiftLabel}\n\nPlease guide me through admission and lane confirmation.`;
        
        // Log inquiry in background for Admin Dashboard
        const API_BASE = getApiBase();
        const leadPayload = {
            id: 'inq_' + Date.now(),
            name: user?.name || 'Prospective Shooter',
            phone: user?.phone || '9893270807',
            email: user?.email || 'whatsapp_enroll@pioneershooting.in',
            sport: '10M Rifle Shooting',
            planInterested: `${plan.name} (₹${plan.basePrice})`,
            shift: selectedShift,
            message: `Direct WhatsApp Admission Request for ${plan.name} [Shift: ${shiftLabel}]`,
            status: 'New',
            date: new Date().toISOString().split('T')[0]
        };

        try {
            axios.post(`${API_BASE}inquiries`, leadPayload).catch(() => {
                axios.post('/api/inquiries', leadPayload).catch(() => {});
            });
            window.dispatchEvent(new CustomEvent('pioneer_inquiry_received', { detail: leadPayload }));
            const channel = new BroadcastChannel('playpeak_realtime_sync');
            channel.postMessage({ type: 'INQUIRY_RECEIVED', inquiry: leadPayload });
            channel.close();
        } catch (e) {}

        showToast('Connecting to Pioneer Academy Admin WhatsApp (+91 9893270807)...');
        const waUrl = `https://wa.me/919893270807?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    const handleDirectCall = () => {
        window.location.href = 'tel:+919893270807';
    };

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
                            ACADEMY PASSES & DIRECT ADMISSION
                        </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                        Choose Your <span className="text-[#FF6A1A]">Training Pass</span>
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Transparent membership plans crafted for grassroots beginners, competitive youth athletes, and tournament champions. Direct WhatsApp enrollment with academy coaches.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Shift Preference Selector */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-12 max-w-4xl mx-auto">
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <FiClock className="text-[#FF6A1A]" /> Choose Preferred Training Shift:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {trainingShifts.map((shift) => (
                            <button
                                key={shift.id}
                                onClick={() => setSelectedShift(shift.id)}
                                className={`p-4 rounded-2xl border text-left transition-all ${
                                    selectedShift === shift.id
                                        ? 'bg-white border-[#FF6A1A] shadow-md text-slate-900 ring-2 ring-[#FF6A1A]/20'
                                        : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm text-slate-900">{shift.name}</span>
                                    {selectedShift === shift.id && <FiCheckCircle className="text-[#FF6A1A]" />}
                                </div>
                                <p className="text-xs font-semibold text-[#FF6A1A]">{shift.time}</p>
                                <p className="text-[11px] text-slate-500 mt-1">{shift.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* New Admission Combo Callout */}
                <div className="max-w-4xl mx-auto mb-8 bg-orange-50/80 border border-[#FF6A1A]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                            <span className="font-bold uppercase tracking-wider text-[#FF6A1A] text-[11px]">
                                New Shooter Admission Account Policy
                            </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                            For fresh admissions, both fees are accounted together upon enrollment: 
                            <strong className="text-slate-900 font-bold ml-1">₹5,000 (Annual Registration) + ₹4,700 (1st Month Training) = ₹9,700 Total</strong>.
                        </p>
                    </div>
                    <Link
                        to="/enroll"
                        className="shrink-0 px-4 py-2.5 rounded-xl bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
                    >
                        <span>Enroll Now (₹9,700)</span>
                        <FiArrowRight />
                    </Link>
                </div>

                {/* Pioneer Academy Official Fees Structures Grid (Strictly 2 Cards) */}
                <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8 mb-16 items-stretch">
                    {membershipPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                                plan.popular
                                    ? 'bg-white border-2 border-[#FF6A1A] shadow-xl'
                                    : 'bg-white border border-slate-200 shadow-sm'
                            }`}
                        >
                            {plan.badge && (
                                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow-md ${
                                    plan.popular ? 'bg-[#FF6A1A]' : 'bg-slate-900'
                                }`}>
                                    {plan.badge}
                                </span>
                            )}

                            <div>
                                <h3 className="font-display font-extrabold text-xl text-slate-900">{plan.name}</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plan.desc}</p>

                                <div className="my-5">
                                    <span className="font-display font-black text-3xl sm:text-4xl text-slate-900">₹{plan.basePrice.toLocaleString()}</span>
                                    <span className="text-xs text-slate-500 ml-1 font-semibold">{plan.cycleLabel}</span>
                                </div>

                                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5">
                                            <FiCheck className="text-[#FF6A1A] shrink-0 mt-0.5 text-sm" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 space-y-2.5">
                                <Link
                                    to="/enroll"
                                    className="w-full py-3.5 rounded-2xl bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01]"
                                >
                                    <span>Register & Pay Online</span>
                                    <FiArrowRight />
                                </Link>

                                <button
                                    onClick={() => handleDirectWhatsAppEnroll(plan)}
                                    className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                >
                                    <FaWhatsapp className="text-lg" />
                                    <span>WhatsApp Direct Admission</span>
                                </button>

                                <button
                                    onClick={handleDirectCall}
                                    className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                >
                                    <FaPhoneAlt className="text-xs text-[#FF6A1A]" />
                                    <span>Call Admin: +91 9893270807</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Direct Helpline Banner */}
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 to-[#0A0E17] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
                    <div className="space-y-1 text-center sm:text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">Official Range Location & Helpdesk</span>
                        <h4 className="font-display font-bold text-xl">Visit Range or Call for Trial Session</h4>
                        <p className="text-xs text-slate-400">Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore (M.P.)</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href="https://wa.me/919893270807?text=Hello%20Pioneer%20Academy%2C%20I%20want%20to%20visit%20for%20a%20trial%20shooting%20session."
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-md transition-all"
                        >
                            <FaWhatsapp className="text-lg" /> Chat WhatsApp
                        </a>
                        <a
                            href="tel:+919893270807"
                            className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all"
                        >
                            <FaPhoneAlt className="text-xs text-[#FF6A1A]" /> +91 9893270807
                        </a>
                    </div>
                </div>

            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex items-center gap-3 text-xs font-bold"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-ping" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Payments;