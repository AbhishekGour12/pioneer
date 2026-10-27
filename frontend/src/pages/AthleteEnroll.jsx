// pages/AthleteEnroll.jsx - PlayPeak Sports Academy Public Athlete Self-Enrollment Form
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiUser,
    FiPhone,
    FiMail,
    FiCalendar,
    FiCheckCircle,
    FiShield,
    FiArrowRight,
    FiArrowLeft,
    FiCheck,
    FiClock,
    FiAward,
    FiDollarSign,
    FiAlertCircle,
    FiActivity,
    FiMapPin,
    FiDownload,
    FiPrinter
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import { GiWhistle, GiMedal } from 'react-icons/gi';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import axios from 'axios';
import { PioneerLogoBrand } from '../components/PioneerLogo';
import { getApiBase } from '../utils/api';

const AthleteEnroll = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [enrolledPass, setEnrolledPass] = useState(null);
    const [passQrDataUrl, setPassQrDataUrl] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: 15,
        gender: 'Male',
        sport: '10M Rifle Shooting',
        batchTime: 'Evening Prime Shift (04:00 PM - 07:00 PM)',
        coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
        planType: 'Combo', // 'Combo' (9700) | 'Monthly' (4700) | 'Registration' (5000)
        membership: 'New Shooter Admission (Annual Reg ₹5,000 + 1st Month Training ₹4,700)',
        amountPaid: 9700,
        paymentMode: 'Cash', // 'Cash' | 'Online'
        utrNumber: '',
        emergencyContact: '',
        bloodGroup: 'B+',
        notes: ''
    });

    const [isCustomSport, setIsCustomSport] = useState(false);
    const [isCustomTiming, setIsCustomTiming] = useState(false);

    const timingShifts = [
        'Morning Shift (06:00 AM - 09:00 AM)',
        'Forenoon Shift (09:00 AM - 12:00 PM)',
        'Afternoon Shift (12:00 PM - 04:00 PM)',
        'Evening Prime Shift (04:00 PM - 07:00 PM)',
        'Night Training Shift (07:00 PM - 09:30 PM)',
        'Flexible Open Slot'
    ];

    const sportsOptions = [
        { name: '10M Rifle Shooting', coach: 'Coach Rajesh Sharma (ISSF / NRAI)' },
        { name: '10M Pistol Shooting', coach: 'Coach Vikram Singh (National Medalist)' },
        { name: 'Beginner Training Course', coach: 'Coach Ananya Sen (Shooting Lead)' },
        { name: 'Competitive Match Prep', coach: 'Master Coach & NRAI Mentors' }
    ];

    // Strictly TWO Official Academy Fees
    const [selectedFees, setSelectedFees] = useState({
        registration: true, // One-Time Annual Registration Fee (₹5,000)
        monthly: true       // Monthly Training Fee (₹4,700)
    });

    const regFee = selectedFees.registration ? 5000 : 0;
    const monthlyFee = selectedFees.monthly ? 4700 : 0;
    const totalFee = regFee + monthlyFee;
    const paidAmt = Number(formData.amountPaid !== undefined && formData.amountPaid !== '' ? formData.amountPaid : totalFee);
    const dueAmount = Math.max(0, totalFee - paidAmt);

    const toggleFeeSelection = (feeType) => {
        const next = { ...selectedFees, [feeType]: !selectedFees[feeType] };
        // At least one fee must remain active
        if (!next.registration && !next.monthly) return;

        setSelectedFees(next);

        const newTotal = (next.registration ? 5000 : 0) + (next.monthly ? 4700 : 0);
        const planKey = (next.registration && next.monthly) ? 'Combo' : (next.registration ? 'Registration' : 'Monthly');
        const planLabel = (next.registration && next.monthly)
            ? 'Annual Reg (₹5,000) + Monthly Training (₹4,700)'
            : next.registration
            ? 'One-Time Annual Registration Fee (₹5,000)'
            : 'Monthly Training Fee (₹4,700/mo)';

        setFormData(prev => ({
            ...prev,
            planType: planKey,
            membership: `${prev.sport} - ${planLabel}`,
            amountPaid: newTotal
        }));
    };

    const handleSportChange = (sportName) => {
        const selected = sportsOptions.find(s => s.name === sportName) || sportsOptions[0];
        setFormData({
            ...formData,
            sport: selected.name,
            coach: selected.coach,
            membership: `${selected.name} - ${formData.planType || 'Membership'}`
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) {
            alert('Please enter your full name and contact number.');
            return;
        }

        if (formData.paymentMode === 'Online' && !formData.utrNumber.trim()) {
            alert('Please enter your 12-digit UTR Number / Transaction ID for Online Payment.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        const newId = `ATH-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
        const newAthlete = {
            id: newId,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: `${formData.name.toLowerCase().replace(/\s+/g, '')}@pioneershooting.in`,
            age: Number(formData.age),
            gender: formData.gender,
            sport: formData.sport,
            batchTime: formData.batchTime,
            coach: formData.coach,
            planType: formData.planType,
            membership: `${formData.sport} ${formData.planType} Pass`,
            feeAmount: totalFee,
            amountPaid: paidAmt,
            dueAmount: dueAmount,
            paymentStatus: dueAmount === 0 ? 'Paid' : dueAmount === totalFee ? 'Due' : 'Partial',
            monthlyFee: 4700,
            registrationFee: 5000,
            nextDueDate: (() => {
                const nd = new Date();
                nd.setMonth(nd.getMonth() + 1);
                return nd.toISOString().split('T')[0];
            })(),
            lastPaymentDate: new Date().toISOString().split('T')[0],
            paidMonthsCount: (formData.planType === 'Combo' || formData.planType === 'Monthly') ? 1 : 0,
            paymentMode: formData.paymentMode,
            utrNumber: formData.paymentMode === 'Online' ? formData.utrNumber.trim() : '',
            joinDate: new Date().toISOString().split('T')[0],
            emergencyContact: formData.emergencyContact || formData.phone,
            bloodGroup: formData.bloodGroup,
            status: 'Active'
        };

        try {
            const API_BASE = getApiBase();
            let finalAthlete = newAthlete;
            let savedToDb = false;

            // Send to MongoDB Atlas API & AWAIT verified response
            try {
                const res = await axios.post(`${API_BASE}athletes`, newAthlete, { timeout: 15000 });
                if (res.data?.data) {
                    finalAthlete = res.data.data;
                    savedToDb = true;
                }
            } catch (apiErr) {
                console.warn('Primary API endpoint failed, attempting fallback...', apiErr);
                const fallbackUrl = API_BASE.includes('onrender.com') ? '/api/athletes' : 'https://pioneer-gvve.onrender.com/api/athletes';
                try {
                    const fallbackRes = await axios.post(fallbackUrl, newAthlete, { timeout: 15000 });
                    if (fallbackRes.data?.data) {
                        finalAthlete = fallbackRes.data.data;
                        savedToDb = true;
                    }
                } catch (e2) {
                    console.error('Fallback endpoint also failed:', e2);
                }
            }

            if (!savedToDb) {
                throw new Error('Database server connection timed out. Please check your internet connection and try again.');
            }

            // If amount was paid, also create payment record in MongoDB Atlas
            if (paidAmt > 0) {
                const newPay = {
                    id: `PAY-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
                    athleteId: finalAthlete.id,
                    athleteName: finalAthlete.name,
                    sport: finalAthlete.sport,
                    plan: finalAthlete.membership,
                    amount: paidAmt,
                    paymentMode: formData.paymentMode,
                    utrNumber: formData.paymentMode === 'Online' ? formData.utrNumber.trim() : '',
                    date: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    method: formData.paymentMode === 'Online' ? `Online UPI (UTR: ${formData.utrNumber.trim()})` : 'Reception Cash Desk',
                    status: 'Completed',
                    receiptNo: `RCP-2026-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`
                };

                axios.post(`${API_BASE}payments`, newPay).catch(() => {
                    axios.post('/api/payments', newPay).catch(err => console.warn(err));
                });
            }

            // Generate QR code for athlete gate pass
            const passData = `https://playpeak.vercel.app/enroll?ref=${finalAthlete.id}&sport=${encodeURIComponent(finalAthlete.sport)}`;
            try {
                const qrUrl = await QRCode.toDataURL(passData, { width: 320, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } });
                setPassQrDataUrl(qrUrl);
            } catch (e) {
                setPassQrDataUrl('');
            }

            // Dispatch instant real-time sync events
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('playpeak_athlete_enrolled', { detail: finalAthlete }));

            try {
                const channel = new BroadcastChannel('playpeak_realtime_sync');
                channel.postMessage({ type: 'ATHLETE_ENROLLED', athlete: finalAthlete });
                channel.close();
            } catch (e) {}

            setEnrolledPass(finalAthlete);
            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission failed:', err);
            setSubmitError(err.response?.data?.message || 'Could not connect to server database. Please check your internet connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPassImage = () => {
        if (!passQrDataUrl) return;
        const link = document.createElement('a');
        link.href = passQrDataUrl;
        link.download = `Pioneer_Shooter_Pass_${(enrolledPass?.name || 'Shooter').replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPassPdf = () => {
        if (!enrolledPass) return;
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Header
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, 48, 'F');
            doc.setFillColor(255, 106, 26);
            doc.rect(0, 48, 210, 3, 'F');

            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("PIONEER RIFLE SHOOTING ACADEMY", 105, 22, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(255, 106, 26);
            doc.text("OFFICIAL SHOOTER ADMISSION & RANGE PASS", 105, 32, { align: "center" });

            // Pass Card Box
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 58, 170, 200, 4, 4, 'FD');

            doc.setFontSize(18);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(enrolledPass.name.toUpperCase(), 105, 75, { align: "center" });

            doc.setFontSize(11);
            doc.setTextColor(255, 106, 26);
            doc.text(`PASS ID: ${enrolledPass.id} • ${enrolledPass.sport} Arena`, 105, 83, { align: "center" });

            // QR Code in center
            if (passQrDataUrl) {
                doc.addImage(passQrDataUrl, 'PNG', 65, 92, 80, 80);
            }

            // Athlete Details
            const details = [
                { label: "Sport Discipline", val: enrolledPass.sport },
                { label: "Admission Plan", val: enrolledPass.membership || enrolledPass.planType },
                { label: "Training Schedule", val: enrolledPass.batchTime },
                { label: "Assigned Head Coach", val: enrolledPass.coach },
                { label: "Contact / Phone", val: enrolledPass.phone },
                { label: "Fee Settlement", val: `${enrolledPass.paymentStatus} (Paid: ₹${(enrolledPass.amountPaid !== undefined ? enrolledPass.amountPaid : enrolledPass.feeAmount).toLocaleString()} of ₹${Number(enrolledPass.feeAmount).toLocaleString()})` }
            ];

            doc.setFontSize(9);
            details.forEach(d => {
                doc.setTextColor(71, 85, 105);
                doc.setFont('helvetica', 'bold');
                doc.text(`${d.label}:`, 35, yPos);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(15, 23, 42);
                doc.text(`${d.val}`, 85, yPos);
                yPos += 7;
            });

            // Instructions
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text("Present this QR admission pass at academy turnstiles for automatic gate check-in.", 105, 245, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore | Helpline: +91 9893270807 / 9294771208", 105, 287, { align: "center" });

            doc.save(`Pioneer_Admission_Pass_${enrolledPass.name.replace(/\s+/g, '_')}.pdf`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6A1A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10">
                
                {/* Brand Header */}
                <div className="text-center space-y-2 mb-6">
                    <Link to="/" className="inline-block group">
                        <PioneerLogoBrand isDark={true} showTagline={true} />
                    </Link>

                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                        Student & Athlete Registration
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400">
                        Official Pioneer Rifle Shooting Academy Admission & Gate Pass Enrollment Portal
                    </p>
                </div>

                {/* Prominent Official Fee Structure Banner */}
                <div className="bg-slate-850/90 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md mb-6 shadow-xl text-left">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2.5">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A1A] animate-pulse" />
                            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-white">
                                Pioneer Academy Official Fee Policy
                            </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF6A1A]/20 text-[#FF6A1A] text-[10px] font-bold uppercase tracking-wider">
                            Official Rates
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-900/85 p-3.5 rounded-xl border border-slate-700/70">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-white font-bold text-xs">1. One-Time Annual Registration Fee</span>
                                <span className="font-display font-black text-sm text-[#FF6A1A]">₹5,000</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Mandatory 1-year registration fee. Includes official shooter accreditation, Shooter ID card, digital QR gate pass, locker room access, weapon inspection & state/district trials affiliation.
                            </p>
                        </div>

                        <div className="bg-slate-900/85 p-3.5 rounded-xl border border-slate-700/70">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-white font-bold text-xs">2. Monthly Training Fee</span>
                                <span className="font-display font-black text-sm text-emerald-400">₹4,700 <span className="text-[10px] font-normal text-slate-400">/ mo</span></span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Covers daily 1 to 1.5 hr training sessions (Open 8:00 AM - 8:00 PM), match air rifles & pistols access, high-precision pellet boxes, target papers, and certified coach guidance included.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SUCCESS PASS CARD */}
                {isSubmitted && enrolledPass ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2 pb-4 border-b border-slate-100">
                            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                                <FiCheckCircle />
                            </div>
                            <h2 className="font-display font-extrabold text-2xl text-slate-900">
                                Enrollment Successful!
                            </h2>
                            <p className="text-xs text-slate-500">
                                Welcome to Pioneer Rifle Shooting Academy! Your digital shooter pass is active.
                            </p>
                        </div>

                        {/* Digital ID Pass */}
                        <div className="bg-slate-950 rounded-2xl p-5 text-white space-y-4 relative overflow-hidden shadow-lg">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">DIGITAL ATHLETE PASS</span>
                                    <h3 className="font-display font-bold text-lg">{enrolledPass.name}</h3>
                                </div>
                                <span className="px-2.5 py-1 rounded-full bg-[#FF6A1A]/20 text-[#FF6A1A] text-xs font-mono font-bold">
                                    {enrolledPass.id}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Sport & Discipline</span>
                                    <strong className="text-white font-bold">{enrolledPass.sport}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Admission Plan</span>
                                    <strong className="text-emerald-400 font-bold">{enrolledPass.membership || `${enrolledPass.planType} Plan`}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Batch Schedule</span>
                                    <strong className="text-slate-200">{enrolledPass.batchTime}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[11px] block">Assigned Mentor</span>
                                    <strong className="text-slate-200">{enrolledPass.coach}</strong>
                                </div>
                            </div>

                            {/* QR Code Graphic in Pass */}
                            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div className="text-left space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Arena Access Code</span>
                                    <span className="text-xs font-semibold text-emerald-400">Verified Member Pass</span>
                                </div>
                                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                                    {passQrDataUrl ? (
                                        <img src={passQrDataUrl} alt="Pass QR" className="w-full h-full" />
                                    ) : (
                                        <FaQrcode className="text-slate-900 text-3xl" />
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Fee Status: <strong className="text-white">{enrolledPass.paymentStatus} (₹{enrolledPass.feeAmount})</strong></span>
                                <span className="text-[11px] text-emerald-400 font-semibold">Active Member</span>
                            </div>
                        </div>

                        {/* Download Buttons: PNG and PDF */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadPassImage}
                                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <FiDownload /> Download Pass (PNG)
                            </button>
                            <button
                                onClick={downloadPassPdf}
                                className="py-3 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
                            >
                                <FiPrinter /> Download PDF Slip
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                            <Link
                                to="/"
                                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center transition-colors"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => { setIsSubmitted(false); }}
                                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors"
                            >
                                Register Another Student
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    /* ENROLLMENT FORM */
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl space-y-5">
                        
                        {/* Section 1: Personal Details */}
                        <div className="space-y-4">
                            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span>1. Athlete Information</span>
                            </h3>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Aarav Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98932 70807"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Emergency / Guardian Contact</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 92947 71208"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        min="5"
                                        max="60"
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    >
                                        <option value="A+">A+</option>
                                        <option value="B+">B+</option>
                                        <option value="O+">O+</option>
                                        <option value="AB+">AB+</option>
                                        <option value="O-">O-</option>
                                        <option value="A-">A-</option>
                                        <option value="B-">B-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Sport & Membership Duration */}
                        <div className="space-y-4 pt-2">
                            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span>2. Sport & Membership Plan</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-bold text-slate-700">Sport Discipline *</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = !isCustomSport;
                                                setIsCustomSport(next);
                                                if (!next && !formData.sport) {
                                                    setFormData({ ...formData, sport: '10M Rifle Shooting', coach: 'Coach Rajesh Sharma (ISSF / NRAI)' });
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
                                            value={formData.sport}
                                            onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                                            placeholder="Type custom discipline / sport..."
                                            className="w-full px-3.5 py-3 bg-slate-50 border border-[#FF6A1A] rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF6A1A]"
                                            required
                                        />
                                    ) : (
                                        <select
                                            value={formData.sport}
                                            onChange={(e) => {
                                                if (e.target.value === 'custom_manual') {
                                                    setIsCustomSport(true);
                                                    setFormData({ ...formData, sport: '' });
                                                } else {
                                                    handleSportChange(e.target.value);
                                                }
                                            }}
                                            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        >
                                            {sportsOptions.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                            <option value="custom_manual">✎ Enter Manually (Custom Discipline)...</option>
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-xs font-bold text-slate-700">Batch Timing & Shift *</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const next = !isCustomTiming;
                                                setIsCustomTiming(next);
                                                if (!next && !formData.batchTime) {
                                                    setFormData({ ...formData, batchTime: 'Evening Prime Shift (04:00 PM - 07:00 PM)' });
                                                }
                                            }}
                                            className="text-[11px] text-[#FF6A1A] font-bold hover:underline"
                                        >
                                            {isCustomTiming ? "← Choose from List" : "+ Enter Manually"}
                                        </button>
                                    </div>
                                    {isCustomTiming ? (
                                        <input
                                            type="text"
                                            value={formData.batchTime}
                                            onChange={(e) => setFormData({ ...formData, batchTime: e.target.value })}
                                            placeholder="e.g. 05:00 PM - 06:30 PM (Daily Shift)..."
                                            className="w-full px-3.5 py-3 bg-slate-50 border border-[#FF6A1A] rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF6A1A]"
                                            required
                                        />
                                    ) : (
                                        <select
                                            value={formData.batchTime}
                                            onChange={(e) => {
                                                if (e.target.value === 'custom_manual_time') {
                                                    setIsCustomTiming(true);
                                                    setFormData({ ...formData, batchTime: '' });
                                                } else {
                                                    setFormData({ ...formData, batchTime: e.target.value });
                                                }
                                            }}
                                            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        >
                                            {timingShifts.map(t => <option key={t} value={t}>{t}</option>)}
                                            <option value="custom_manual_time">✎ Enter Manually (Custom Timing & Shift)...</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Fee Structure: ONLY TWO OFFICIAL FEES */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Academy Fee Structure (Select Fees to Include) *
                                    </label>
                                    <span className="text-[10px] text-slate-400 font-semibold">
                                        Default: Both Fees (New Admission)
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mb-3">
                                    The academy operates on strictly two official fees. For new admissions, both fees are accounted together (₹9,700). You may toggle either fee as needed:
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {/* Fee 1: One-Time Annual Registration Fee */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => toggleFeeSelection('registration')}
                                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                            selectedFees.registration
                                                ? 'bg-blue-50/70 border-blue-500 text-slate-900 shadow-md ring-2 ring-blue-500/20'
                                                : 'bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="px-2 py-0.5 rounded-full text-white font-bold text-[9px] uppercase tracking-wide bg-blue-600">
                                                Official Fee #1 (Annual)
                                            </span>
                                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                                                selectedFees.registration ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                                            }`}>
                                                {selectedFees.registration ? '✓' : ''}
                                            </span>
                                        </div>

                                        <div className="space-y-0.5">
                                            <h4 className="font-display font-bold text-sm text-slate-900">
                                                One-Time Annual Registration Fee
                                            </h4>
                                            <p className="text-[11px] font-semibold text-blue-600">
                                                Mandatory Shooter Accreditation
                                            </p>
                                        </div>

                                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                                            <div>
                                                <span className="font-display font-black text-xl text-slate-900">
                                                    ₹5,000
                                                </span>
                                                <span className="text-[10px] text-slate-500 ml-1">
                                                    / Valid 1 Year
                                                </span>
                                            </div>
                                            <span className={`text-[10px] font-bold ${selectedFees.registration ? 'text-blue-700' : 'text-slate-400'}`}>
                                                {selectedFees.registration ? 'Included in Total' : 'Click to Include'}
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                                            Official Pioneer Shooter ID card, digital QR gate pass, locker room access, weapon safety check, and state/district trials affiliation.
                                        </p>
                                    </div>

                                    {/* Fee 2: Monthly Training Fee */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => toggleFeeSelection('monthly')}
                                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                            selectedFees.monthly
                                                ? 'bg-orange-50/70 border-[#FF6A1A] text-slate-900 shadow-md ring-2 ring-[#FF6A1A]/30'
                                                : 'bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="px-2 py-0.5 rounded-full text-white font-bold text-[9px] uppercase tracking-wide bg-[#FF6A1A]">
                                                Official Fee #2 (Monthly)
                                            </span>
                                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                                                selectedFees.monthly ? 'bg-[#FF6A1A] border-[#FF6A1A] text-white' : 'border-slate-300 bg-white'
                                            }`}>
                                                {selectedFees.monthly ? '✓' : ''}
                                            </span>
                                        </div>

                                        <div className="space-y-0.5">
                                            <h4 className="font-display font-bold text-sm text-slate-900">
                                                Monthly Training Fee
                                            </h4>
                                            <p className="text-[11px] font-semibold text-[#FF6A1A]">
                                                Regular Practice & Coaching
                                            </p>
                                        </div>

                                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                                            <div>
                                                <span className="font-display font-black text-xl text-slate-900">
                                                    ₹4,700
                                                </span>
                                                <span className="text-[10px] text-slate-500 ml-1">
                                                    / Per Month
                                                </span>
                                            </div>
                                            <span className={`text-[10px] font-bold ${selectedFees.monthly ? 'text-orange-600' : 'text-slate-400'}`}>
                                                {selectedFees.monthly ? 'Included in Total' : 'Click to Include'}
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                                            Daily 1 to 1.5 hr training sessions (Open 8 AM - 8 PM), match weapons, pellet boxes, target papers & coach guidance included.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Calculation Summary Box with Transparent Itemization */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                                <div className="flex justify-between items-center text-slate-600 border-b border-slate-200/60 pb-2">
                                    <span>Selected Discipline & Coach:</span>
                                    <strong className="text-slate-900 font-bold">{formData.sport} ({formData.coach})</strong>
                                </div>

                                {selectedFees.registration && (
                                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                                        <span>• One-Time Annual Registration Fee (1 Year):</span>
                                        <span className="font-bold text-slate-900">₹5,000</span>
                                    </div>
                                )}

                                {selectedFees.monthly && (
                                    <div className="flex justify-between items-center text-slate-600 text-[11px]">
                                        <span>• Monthly Training Fee (Per Month):</span>
                                        <span className="font-bold text-slate-900">₹4,700</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-800">
                                    <span className="font-bold text-slate-900">
                                        {selectedFees.registration && selectedFees.monthly
                                            ? 'Total Admission Fee (Dono Ka Hisab Ek Sath):'
                                            : 'Total Payable Fee:'}
                                    </span>
                                    <strong className="text-[#FF6A1A] font-extrabold text-base">₹{totalFee.toLocaleString()}</strong>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                            Amount Paying Now (₹):
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.amountPaid}
                                            onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value === '' ? '' : Number(e.target.value) })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none focus:border-[#FF6A1A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                            Due / Pending Balance (₹):
                                        </label>
                                        <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-600">
                                            ₹{dueAmount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 pt-1">
                                    * Fees can be paid now via UPI or upon arrival at the academy reception desk.
                                </p>
                            </div>
                        </div>

                        {/* Section 3: Payment Mode & Fee Settlement */}
                        <div className="space-y-4 pt-2">
                            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span>3. Payment Mode & Verification</span>
                            </h3>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Select Payment Mode *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMode: 'Cash' })}
                                        className={`p-3 rounded-2xl border text-center transition-all ${
                                            formData.paymentMode === 'Cash'
                                                ? 'bg-white border-[#FF6A1A] shadow-md ring-2 ring-[#FF6A1A]/20 text-slate-900'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div className="font-bold text-xs">Cash at Reception</div>
                                        <span className="text-[10px] text-slate-500">Pay directly at range counter</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMode: 'Online' })}
                                        className={`p-3 rounded-2xl border text-center transition-all ${
                                            formData.paymentMode === 'Online'
                                                ? 'bg-white border-[#FF6A1A] shadow-md ring-2 ring-[#FF6A1A]/20 text-slate-900'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <div className="font-bold text-xs text-emerald-600">Online (UPI / QR / Bank)</div>
                                        <span className="text-[10px] text-slate-500">Instant transfer with UTR</span>
                                    </button>
                                </div>
                            </div>

                            {/* If Online is selected, show UPI details and require UTR number */}
                            {formData.paymentMode === 'Online' && (
                                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                                        <span className="font-bold text-emerald-900">Official Pioneer Academy UPI ID:</span>
                                        <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                                            9893270807@upi
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-emerald-800">
                                        Please scan range UPI QR or transfer ₹{totalFee.toLocaleString()} to <strong className="font-mono">9893270807@upi</strong> and enter the 12-digit UTR number below.
                                    </p>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-800 mb-1">
                                            UTR Number / Transaction Reference ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 429812903421 (12-digit UPI / IMPS UTR)"
                                            value={formData.utrNumber}
                                            onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submission Error Banner */}
                        {submitError && (
                            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-semibold">
                                <FiAlertCircle className="text-lg shrink-0 text-red-500" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6A1A] via-orange-500 to-amber-500 text-white font-display font-bold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-transform ${
                                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-95 active:scale-98'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Saving to Database & Enrolling...</span>
                                </>
                            ) : (
                                <>
                                    <span>Complete Athlete Registration</span>
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default AthleteEnroll;
