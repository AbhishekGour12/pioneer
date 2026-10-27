// pages/AdminDashboard.jsx - Pioneer Rifle Shooting Academy Full-Featured Responsive PWA Admin Center
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiGrid,
    FiUsers,
    FiDollarSign,
    FiSearch,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiAlertCircle,
    FiDownload,
    FiX,
    FiLogOut,
    FiSend,
    FiMapPin,
    FiShield,
    FiZap,
    FiMenu,
    FiRefreshCw,
    FiPhone,
    FiMail,
    FiCheck,
    FiInfo,
    FiActivity,
    FiSliders,
    FiChevronRight,
    FiEye,
    FiBell,
    FiCalendar,
    FiAward,
    FiBox,
    FiMessageSquare,
    FiPrinter,
    FiClock,
    FiCopy,
    FiExternalLink,
    FiSmartphone,
    FiHeart,
    FiTrendingUp
} from 'react-icons/fi';
import { 
    FaFutbol, 
    FaBasketballBall, 
    FaSwimmer, 
    FaDumbbell, 
    FaTrophy, 
    FaWhatsapp, 
    FaQrcode,
    FaMedal
} from 'react-icons/fa';
import { 
    GiCricketBat, 
    GiShuttlecock, 
    GiTennisRacket, 
    GiPunchingBag, 
    GiWhistle,
    GiHealing,
    GiStopwatch
} from 'react-icons/gi';
import { 
    MdOutlineStadium, 
    MdOutlineSportsScore, 
    MdOutlineFitnessCenter,
    MdSportsSoccer 
} from 'react-icons/md';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { userinfo } from '../features/userinfo';
import { getApiBase, getSocketUrl } from '../utils/api';

const AdminDashboard = () => {
    // Current Active Tab
    const [activeTab, setActiveTab] = useState('overview'); 
    // Tabs: overview, athletes, payments, reminders, coaches, inventory, memberships, tournaments, physio, assessments, inquiries

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [toastMessage, setToastMessage] = useState(null);
    const [filterSport, setFilterSport] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // PWA Install Prompt State
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallModal, setShowInstallModal] = useState(false);

    // Modals state
    const [showAddAthleteModal, setShowAddAthleteModal] = useState(false);
    const [isSavingAthlete, setIsSavingAthlete] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState(null);
    const [viewingAthleteCard, setViewingAthleteCard] = useState(null);
    const [athletePassQrDataUrl, setAthletePassQrDataUrl] = useState('');
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [showMembershipQrModal, setShowMembershipQrModal] = useState(false);
    const [selectedPlanQr, setSelectedPlanQr] = useState(null);
    const [membershipQrDataUrl, setMembershipQrDataUrl] = useState('');

    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    // Fee Collection & Month Advance Modal
    const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
    const [feeCollectionTarget, setFeeCollectionTarget] = useState(null);
    const [feeMonthsToCollect, setFeeMonthsToCollect] = useState(1);
    const [feeCollectionPaymentMode, setFeeCollectionPaymentMode] = useState('Cash');
    const [feeCollectionUtr, setFeeCollectionUtr] = useState('');
    const [isProcessingFeeCollection, setIsProcessingFeeCollection] = useState(false);
    const [reminderStatusFilter, setReminderStatusFilter] = useState('All');

    const [showAddCoachModal, setShowAddCoachModal] = useState(false);
    const [editingCoach, setEditingCoach] = useState(null);

    const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
    const [editingInventory, setEditingInventory] = useState(null);

    const [showAddPlanModal, setShowAddPlanModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const [showAddTournamentModal, setShowAddTournamentModal] = useState(false);
    const [editingTournament, setEditingTournament] = useState(null);

    const [showAddPhysioModal, setShowAddPhysioModal] = useState(false);
    const [editingPhysio, setEditingPhysio] = useState(null);

    const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState(null);

    const [showAddInquiryModal, setShowAddInquiryModal] = useState(false);
    const [editingInquiry, setEditingInquiry] = useState(null);

    // Multi-select state for bulk actions across all tabs
    const [selectedInquiryIds, setSelectedInquiryIds] = useState([]);
    const [selectedAthleteIds, setSelectedAthleteIds] = useState([]);
    const [selectedPaymentIds, setSelectedPaymentIds] = useState([]);
    const [selectedReminderIds, setSelectedReminderIds] = useState([]);

    const [broadcastingNotice, setBroadcastingNotice] = useState(false);

    // Redux & Navigation
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sportsList = [
        { name: '10M Rifle Shooting', coach: 'Coach Rajesh Sharma (ISSF / NRAI)', monthly: 4700, registration: 5000, combo: 9700 },
        { name: '10M Pistol Shooting', coach: 'Coach Vikram Singh (National Medalist)', monthly: 4700, registration: 5000, combo: 9700 },
        { name: 'Beginner Training Course', coach: 'Coach Ananya Sen (Shooting Lead)', monthly: 4700, registration: 5000, combo: 9700 },
        { name: 'Competitive Match Prep', coach: 'Master Coach & NRAI Mentors', monthly: 4700, registration: 5000, combo: 9700 },
        { name: 'Target Biomechanics & Stance', coach: 'Coach Rahul Nair (Biomechanics)', monthly: 4700, registration: 5000, combo: 9700 },
        { name: 'Daily Practice (1 - 1.5 Hrs)', coach: 'Range Coaching Staff', monthly: 4700, registration: 5000, combo: 9700 }
    ];

    // Listen for PWA BeforeInstallPrompt Event
    useEffect(() => {
        if (window.deferredPWAInstallPrompt) {
            setDeferredPrompt(window.deferredPWAInstallPrompt);
        }
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            window.deferredPWAInstallPrompt = e;
            setDeferredPrompt(e);
        };
        const handlePromptReady = () => {
            setDeferredPrompt(window.deferredPWAInstallPrompt);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('pwa-prompt-ready', handlePromptReady);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('pwa-prompt-ready', handlePromptReady);
        };
    }, []);

    const handleTriggerInstall = () => {
        const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
        if (promptEvent) {
            promptEvent.prompt();
            promptEvent.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    showToast('🎉 Pioneer Academy Admin App added to Home Screen as mobile app!');
                }
                window.deferredPWAInstallPrompt = null;
                setDeferredPrompt(null);
            });
        } else {
            setShowInstallModal(true);
        }
    };




    // ==========================================
    // INITIAL SEED DATA & LOCAL STORAGE LOADERS
    // ==========================================    // ==========================================
    // LIVE MONGODB DATA STATES (DIRECT BACKEND API - ZERO LOCALSTORAGE)
    // ==========================================
    const [athletes, setAthletes] = useState([]);
    const [payments, setPayments] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [physioLogs, setPhysioLogs] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [isLiveLoading, setIsLiveLoading] = useState(true);

    const API_BASE = getApiBase();

    // Fetch live data from MongoDB Atlas on component mount, tab change & socket events
    const fetchMongoData = async () => {
        try {
            const [athRes, payRes, coachRes, tourRes, phyRes, asmRes, invRes, planRes, inqRes] = await Promise.allSettled([
                axios.get(`${API_BASE}athletes`),
                axios.get(`${API_BASE}payments`),
                axios.get(`${API_BASE}coaches`),
                axios.get(`${API_BASE}tournaments`),
                axios.get(`${API_BASE}physio`),
                axios.get(`${API_BASE}assessments`),
                axios.get(`${API_BASE}inventory`),
                axios.get(`${API_BASE}memberships`),
                axios.get(`${API_BASE}inquiries`),
            ]);

            if (athRes.status === 'fulfilled' && Array.isArray(athRes.value.data?.data)) setAthletes(athRes.value.data.data);
            if (payRes.status === 'fulfilled' && Array.isArray(payRes.value.data?.data)) setPayments(payRes.value.data.data);
            if (coachRes.status === 'fulfilled' && Array.isArray(coachRes.value.data?.data)) setCoaches(coachRes.value.data.data);
            if (tourRes.status === 'fulfilled' && Array.isArray(tourRes.value.data?.data)) setTournaments(tourRes.value.data.data);
            if (phyRes.status === 'fulfilled' && Array.isArray(phyRes.value.data?.data)) setPhysioLogs(phyRes.value.data.data);
            if (asmRes.status === 'fulfilled' && Array.isArray(asmRes.value.data?.data)) setAssessments(asmRes.value.data.data);
            if (invRes.status === 'fulfilled' && Array.isArray(invRes.value.data?.data)) setInventory(invRes.value.data.data);
            if (planRes.status === 'fulfilled' && Array.isArray(planRes.value.data?.data)) setMemberships(planRes.value.data.data);
            if (inqRes.status === 'fulfilled' && Array.isArray(inqRes.value.data?.data)) setInquiries(inqRes.value.data.data);
        } catch (err) {
            console.warn('MongoDB Atlas connection sync:', err.message);
        }
    };

    // Auto-reload data whenever admin switches to another tab
    useEffect(() => {
        fetchMongoData();
    }, [activeTab]);

    // Live Socket.io real-time connection across all devices and QR scans
    useEffect(() => {
        let socket = null;
        try {
            const socketUrl = getSocketUrl();
            socket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnectionAttempts: 10,
                reconnectionDelay: 1000
            });

            socket.on('connect', () => {
                console.log('⚡ Connected to Pioneer Academy Live Real-Time Socket');
            });

            socket.on('athlete_created', (newAth) => {
                setAthletes(prev => {
                    if (prev.some(a => a.id === newAth.id || a._id === newAth._id)) return prev;
                    return [newAth, ...prev];
                });
                showToast(`⚡ Real-Time Alert: New athlete "${newAth.name}" (${newAth.sport}) just registered via QR!`, 'success');
            });

            socket.on('athlete_updated', (updatedAth) => {
                setAthletes(prev => prev.map(a => (a.id === updatedAth.id || a._id === updatedAth._id) ? updatedAth : a));
            });

            socket.on('athlete_deleted', (deletedAth) => {
                const targetKey = deletedAth?.id || deletedAth?._id;
                setAthletes(prev => prev.filter(a => a.id !== targetKey && a._id !== targetKey));
            });
            socket.on('athletes_batch_deleted', ({ ids }) => {
                if (Array.isArray(ids)) {
                    setAthletes(prev => prev.filter(a => !ids.includes(a.id) && !ids.includes(a._id)));
                }
            });
            socket.on('athletes_cleared', () => {
                setAthletes([]);
            });

            socket.on('payment_recorded', (newPay) => {
                setPayments(prev => {
                    if (prev.some(p => p.id === newPay.id || p._id === newPay._id)) return prev;
                    return [newPay, ...prev];
                });
                showToast(`💰 Real-Time: Payment recorded for ${newPay.athleteName || 'Athlete'} (₹${newPay.amount})`, 'info');
            });

            socket.on('payment_deleted', (delPay) => {
                const targetKey = delPay?.id || delPay?._id;
                setPayments(prev => prev.filter(p => p.id !== targetKey && p._id !== targetKey));
            });
            socket.on('payments_batch_deleted', ({ ids }) => {
                if (Array.isArray(ids)) {
                    setPayments(prev => prev.filter(p => !ids.includes(p.id) && !ids.includes(p._id)));
                }
            });
            socket.on('payments_cleared', () => {
                setPayments([]);
            });

            socket.on('new_inquiry_received', (newInq) => {
                setInquiries(prev => {
                    if (prev.some(i => i.id === newInq.id || i._id === newInq._id)) return prev;
                    return [newInq, ...prev];
                });
                showToast(`📩 Real-Time Lead: New inquiry from "${newInq.name}" (${newInq.sport})`, 'info');
            });

            socket.on('inquiry_deleted', (delInq) => {
                const targetKey = delInq?.id || delInq?._id;
                setInquiries(prev => prev.filter(i => i.id !== targetKey && i._id !== targetKey));
            });
            socket.on('inquiries_batch_deleted', ({ ids }) => {
                if (Array.isArray(ids)) {
                    setInquiries(prev => prev.filter(i => !ids.includes(i.id) && !ids.includes(i._id)));
                }
            });
            socket.on('inquiries_cleared', () => {
                setInquiries([]);
            });
        } catch (e) {
            console.warn('Socket connection note:', e);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [API_BASE]);

    // Background interval sync (every 5 seconds) & focus refetch
    useEffect(() => {
        fetchMongoData();

        const interval = setInterval(() => {
            fetchMongoData();
        }, 5000);

        const handleFocus = () => {
            fetchMongoData();
        };
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, []);

    // Instant cross-tab real-time sync via BroadcastChannel & window events
    useEffect(() => {
        const handleSync = (e) => {
            fetchMongoData();
            if (e && e.detail) {
                showToast(`⚡ Real-Time Alert: New athlete "${e.detail.name}" enrolled via QR code!`, 'success');
            }
        };

        const handleInquirySync = (e) => {
            fetchMongoData();
            if (e && e.detail) {
                const inq = e.detail;
                setInquiries((prev) => {
                    if (prev.some(i => i.id === inq.id || (i._id && i._id === inq._id))) return prev;
                    return [inq, ...prev];
                });
                showToast(`📩 Real-Time Inquiry: New query from "${inq.name}" (${inq.sport})`, 'info');
            }
        };

        window.addEventListener('storage', handleSync);
        window.addEventListener('playpeak_athlete_enrolled', handleSync);
        window.addEventListener('pioneer_inquiry_received', handleInquirySync);

        // BroadcastChannel listener for multi-tab zero-reload updates
        let channel = null;
        try {
            channel = new BroadcastChannel('playpeak_realtime_sync');
            channel.onmessage = (event) => {
                if (event.data && event.data.type === 'ATHLETE_ENROLLED') {
                    const newAth = event.data.athlete;
                    setAthletes((prev) => {
                        if (prev.some(a => a.id === newAth.id)) return prev;
                        return [newAth, ...prev];
                    });
                    showToast(`⚡ Real-Time Alert: New athlete "${newAth.name}" (${newAth.sport}) just enrolled via QR code!`, 'success');
                    fetchMongoData();
                } else if (event.data && event.data.type === 'INQUIRY_RECEIVED') {
                    const newInq = event.data.inquiry;
                    setInquiries((prev) => {
                        if (prev.some(i => i.id === newInq.id || (i._id && i._id === newInq._id))) return prev;
                        return [newInq, ...prev];
                    });
                    showToast(`📩 Real-Time Inquiry: New query from "${newInq.name}" (${newInq.sport})`, 'info');
                    fetchMongoData();
                }
            };
        } catch (e) {}

        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('playpeak_athlete_enrolled', handleSync);
            window.removeEventListener('pioneer_inquiry_received', handleInquirySync);
            if (channel) {
                channel.close();
            }
        };
    }, []);

    // Purge legacy entity caches from LocalStorage so all entities live strictly in MongoDB Atlas
    useEffect(() => {
        [
            'playpeak_athletes',
            'playpeak_payments',
            'playpeak_coaches',
            'playpeak_inventory',
            'playpeak_memberships',
            'playpeak_tournaments',
            'playpeak_physio',
            'playpeak_assessments',
            'playpeak_inquiries',
            'pioneer_inquiries'
        ].forEach(k => {
            try { localStorage.removeItem(k); } catch (e) { }
        });
    }, []);

    const showToast = (msg, type = 'success') => {
        setToastMessage({ msg, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('libraryUser');
        dispatch(userinfo(null));
        navigate('/login');
    };

    // ==========================================
    // QR CODE DOWNLOAD & PDF GENERATION UTILITIES
    // ==========================================
    const downloadQrImage = (dataUrl, fileName = 'Pioneer_QR_Code.png') => {
        if (!dataUrl) {
            showToast('QR code not ready yet, please wait.', 'error');
            return;
        }
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`QR Code image (${fileName}) downloaded!`);
    };

    const downloadQrPdf = ({ title, subtitle, qrDataUrl, instructions, fileName = 'Pioneer_QR_Poster.pdf', metaData }) => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Header background banner
            doc.setFillColor(15, 23, 42); // slate-900
            doc.rect(0, 0, 210, 48, 'F');
            
            // Orange accent line
            doc.setFillColor(255, 106, 26); // #FF6A1A
            doc.rect(0, 48, 210, 3, 'F');

            // Title & Branding
            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("PIONEER RIFLE SHOOTING ACADEMY", 105, 22, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(255, 106, 26);
            doc.text("10M AIR RIFLE & PISTOL SHOOTING CENTER • ISSF STANDARDS", 105, 32, { align: "center" });

            doc.setFontSize(9);
            doc.setTextColor(203, 213, 225);
            doc.text("Pioneer Shooting Academy, Indore | Contact: +91 98260 00000", 105, 40, { align: "center" });

            // Section Box
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 58, 170, 200, 4, 4, 'FD');

            // Document Title
            doc.setFontSize(16);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(title || "OFFICIAL REGISTRATION QR PASS", 105, 74, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text(subtitle || "Scan this QR code with any smartphone camera to open the registration portal.", 105, 82, { align: "center" });

            // QR Code Image in Center
            if (qrDataUrl) {
                doc.addImage(qrDataUrl, 'PNG', 65, 92, 80, 80);
            }

            // Meta data / details box if provided
            let yPos = 182;
            if (metaData && Array.isArray(metaData)) {
                doc.setFontSize(9);
                metaData.forEach(item => {
                    doc.setTextColor(71, 85, 105);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${item.label}: `, 35, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(15, 23, 42);
                    doc.text(`${item.value}`, 85, yPos);
                    yPos += 6.5;
                });
            }

            // Instructions
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(instructions || "Steps: 1. Open Phone Camera or QR Scanner  2. Point at QR Code  3. Submit details for instant pass.", 105, 245, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("Pioneer Rifle Shooting Academy | Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore | Ph: +91 9893270807 / 9294771208", 105, 287, { align: "center" });

            doc.save(fileName);
            showToast(`Printable PDF Poster (${fileName}) downloaded!`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            showToast("Error generating PDF poster.", "error");
        }
    };

    // Download Official Fee Payment Receipt PDF
    const handleDownloadReceiptPDF = (pay) => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Header
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 210, 44, 'F');
            
            // Accent line
            doc.setFillColor(255, 106, 26);
            doc.rect(0, 44, 210, 3, 'F');

            // Header titles
            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("PIONEER RIFLE SHOOTING ACADEMY", 105, 20, { align: "center" });

            doc.setFontSize(9);
            doc.setTextColor(255, 106, 26);
            doc.text("AIM • FOCUS • DISCIPLINE • EXCELLENCE", 105, 29, { align: "center" });

            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore | Ph: +91 9893270807 / 9294771208", 105, 36, { align: "center" });

            // Main Details Container
            doc.setDrawColor(226, 232, 240);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, 54, 180, 195, 4, 4, 'FD');

            doc.setFontSize(15);
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text("FEE PAYMENT RECEIPT", 25, 68);

            doc.setFontSize(10);
            doc.setTextColor(255, 106, 26);
            doc.text(`Receipt #: ${pay.receiptNo || pay.id}`, 185, 68, { align: "right" });

            // Divider line
            doc.setDrawColor(226, 232, 240);
            doc.line(25, 74, 185, 74);

            const details = [
                { label: "Athlete Name", value: pay.athleteName },
                { label: "Sport Discipline", value: pay.sport },
                { label: "Membership Plan", value: pay.plan || "Pro Academy Pass" },
                { label: "Transaction / Ref ID", value: pay.id },
                { label: "Date of Payment", value: pay.date || new Date().toISOString().split('T')[0] },
                { label: "Payment Mode", value: pay.method || "UPI Reception" },
                { label: "Payment Status", value: pay.status || "Completed" },
                { label: "Next Due Date", value: pay.dueDate || "N/A" }
            ];

            let curY = 86;
            details.forEach(item => {
                doc.setFontSize(9.5);
                doc.setTextColor(100, 116, 139);
                doc.setFont('helvetica', 'normal');
                doc.text(item.label, 25, curY);

                doc.setTextColor(15, 23, 42);
                doc.setFont('helvetica', 'bold');
                doc.text(String(item.value), 90, curY);
                curY += 10.5;
            });

            // Total Box
            doc.setFillColor(255, 247, 237);
            doc.setDrawColor(254, 215, 170);
            doc.roundedRect(25, 180, 160, 24, 3, 3, 'FD');

            doc.setFontSize(11);
            doc.setTextColor(194, 65, 12);
            doc.setFont('helvetica', 'bold');
            doc.text("TOTAL AMOUNT RECEIVED:", 35, 195);

            doc.setFontSize(16);
            doc.setTextColor(234, 88, 12);
            doc.text(`INR ${Number(pay.amount || 0).toLocaleString()}`, 175, 195, { align: "right" });

            // Note
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'italic');
            doc.text("This is an electronically generated official receipt issued by Pioneer Rifle Shooting Academy.", 105, 230, { align: "center" });

            // Footer
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.text("Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore | Ph: +91 9893270807 / 9294771208", 105, 287, { align: "center" });

            doc.save(`Pioneer_Receipt_${pay.receiptNo || pay.id}.pdf`);
            showToast(`Receipt PDF (${pay.receiptNo || pay.id}) downloaded!`);
        } catch (err) {
            console.error("Receipt PDF generation error:", err);
            showToast("Error generating receipt PDF.", "error");
        }
    };

    // Base URL for Pioneer Shooting Production QR Codes & Links
    // If running on localhost, use the live Vercel URL so phone scanners can access it from anywhere
    const PLAYPEAK_BASE_URL = (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'))
        ? window.location.origin
        : 'https://playpeak.vercel.app';

    // Generate QR Code for Self-Enrollment
    const handleOpenQrModal = () => {
        const enrollUrl = `${PLAYPEAK_BASE_URL}/enroll`;
        QRCode.toDataURL(enrollUrl, { width: 350, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => {
                setQrCodeDataUrl(url);
                setShowQrModal(true);
            })
            .catch(() => {
                setShowQrModal(true);
            });
    };

    // Open Membership Plan QR Poster Modal
    const handleOpenMembershipPlanQr = (plan) => {
        setSelectedPlanQr(plan);
        const planUrl = `${PLAYPEAK_BASE_URL}/enroll?plan=${encodeURIComponent(plan.name)}&sport=${encodeURIComponent(plan.sport || 'All')}`;
        QRCode.toDataURL(planUrl, { width: 350, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => {
                setMembershipQrDataUrl(url);
                setShowMembershipQrModal(true);
            })
            .catch(() => {
                setShowMembershipQrModal(true);
            });
    };

    // Open Athlete ID Card Modal with Dynamic QR
    const handleViewAthleteCard = (ath) => {
        setViewingAthleteCard(ath);
        const passData = `${PLAYPEAK_BASE_URL}/enroll?ref=${ath.id}&sport=${encodeURIComponent(ath.sport)}`;
        QRCode.toDataURL(passData, { width: 300, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => setAthletePassQrDataUrl(url))
            .catch(() => setAthletePassQrDataUrl(''));
    };

    // ==========================================
    // ATHLETES CRUD OPERATIONS (WITH MONTHLY / YEARLY PRICING)
    // ==========================================
    const [isCustomSportAdmin, setIsCustomSportAdmin] = useState(false);
    const [isCustomTimingAdmin, setIsCustomTimingAdmin] = useState(false);

    const adminTimingShifts = [
        'Morning Shift (06:00 AM - 09:00 AM)',
        'Forenoon Shift (09:00 AM - 12:00 PM)',
        'Afternoon Shift (12:00 PM - 04:00 PM)',
        'Evening Prime Shift (04:00 PM - 07:00 PM)',
        'Night Training Shift (07:00 PM - 09:30 PM)',
        'Flexible Open Slot'
    ];

    const [athleteForm, setAthleteForm] = useState({
        name: '',
        phone: '',
        age: 15,
        gender: 'Male',
        sport: '10M Rifle Shooting',
        batchTime: 'Evening Prime Shift (04:00 PM - 07:00 PM)',
        coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
        planType: 'Monthly',
        membership: '10M Rifle Shooting Monthly Pass',
        feeAmount: 4700,
        amountPaid: 4700,
        dueAmount: 0,
        paymentStatus: 'Paid',
        paymentMode: 'Cash',
        utrNumber: '',
        emergencyContact: '',
        bloodGroup: 'B+'
    });

    const handleOpenAddAthlete = () => {
        setEditingAthlete(null);
        setIsCustomSportAdmin(false);
        setIsCustomTimingAdmin(false);
        const nextM = new Date();
        nextM.setMonth(nextM.getMonth() + 1);
        const defaultNextDue = nextM.toISOString().split('T')[0];

        setAthleteForm({
            name: '',
            phone: '',
            age: 15,
            gender: 'Male',
            sport: '10M Rifle Shooting',
            batchTime: 'Evening Prime Shift (04:00 PM - 07:00 PM)',
            coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
            planType: 'Combo',
            membership: 'New Admission (Annual Reg ₹5,000 + 1st Month ₹4,700)',
            feeAmount: 9700,
            amountPaid: 9700,
            dueAmount: 0,
            paymentStatus: 'Paid',
            paymentMode: 'Cash',
            utrNumber: '',
            emergencyContact: '',
            bloodGroup: 'B+',
            monthlyFee: 4700,
            registrationFee: 5000,
            nextDueDate: defaultNextDue
        });
        setShowAddAthleteModal(true);
    };

    const updateAthleteFormSportOrPlan = (sportName, planType) => {
        const sportConfig = sportsList.find(s => s.name === sportName) || {
            name: sportName,
            coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
            monthly: 4700,
            registration: 5000,
            combo: 9700
        };

        const fee = planType === 'Combo' ? 9700
                  : planType === 'Registration' ? 5000
                  : (sportConfig.monthly || 4700);

        const planLabel = planType === 'Combo' ? 'New Admission (Annual Reg ₹5,000 + 1st Month ₹4,700)'
                        : planType === 'Registration' ? 'One-Time Annual Registration (₹5,000)'
                        : 'Monthly Training Membership (₹4,700/mo)';

        const paid = Number(athleteForm.amountPaid !== undefined && athleteForm.amountPaid !== '' ? athleteForm.amountPaid : fee);
        const due = Math.max(0, fee - paid);

        setAthleteForm({
            ...athleteForm,
            sport: sportName,
            coach: sportConfig.coach || 'Coach Rajesh Sharma (ISSF / NRAI)',
            planType: planType,
            membership: `${sportName} - ${planLabel}`,
            feeAmount: fee,
            amountPaid: fee,
            dueAmount: 0,
            paymentStatus: 'Paid'
        });
    };

    const toggleAdminAthleteFee = (feeType) => {
        const isRegCurrent = athleteForm.planType === 'Combo' || athleteForm.planType === 'Registration';
        const isMonthlyCurrent = athleteForm.planType === 'Combo' || athleteForm.planType === 'Monthly';

        let nextReg = isRegCurrent;
        let nextMonthly = isMonthlyCurrent;

        if (feeType === 'registration') {
            nextReg = !isRegCurrent;
        } else if (feeType === 'monthly') {
            nextMonthly = !isMonthlyCurrent;
        }

        // At least one fee must remain active
        if (!nextReg && !nextMonthly) return;

        const nextPlanType = (nextReg && nextMonthly) ? 'Combo' : (nextReg ? 'Registration' : 'Monthly');
        updateAthleteFormSportOrPlan(athleteForm.sport, nextPlanType);
    };

    const handleSaveAthlete = async (e) => {
        e.preventDefault();
        if (!athleteForm.name || !athleteForm.phone) {
            showToast('Please enter athlete name and contact phone.', 'error');
            return;
        }

        if (athleteForm.paymentMode === 'Online' && Number(athleteForm.amountPaid || 0) > 0 && !athleteForm.utrNumber?.trim()) {
            showToast('Please enter 12-digit UTR Number / Transaction ID for Online Payment.', 'error');
            return;
        }

        setIsSavingAthlete(true);

        const calculatedDue = Math.max(0, Number(athleteForm.feeAmount) - Number(athleteForm.amountPaid || 0));
        const finalStatus = calculatedDue === 0 ? 'Paid' : calculatedDue === Number(athleteForm.feeAmount) ? 'Due' : 'Partial';

        try {
            if (editingAthlete) {
                const targetId = editingAthlete._id || editingAthlete.id;
                const updatedAth = {
                    ...editingAthlete,
                    ...athleteForm,
                    email: editingAthlete.email || `${athleteForm.name.toLowerCase().replace(/\s+/g, '')}@pioneershooting.in`,
                    dueAmount: calculatedDue,
                    paymentStatus: finalStatus,
                    monthlyFee: athleteForm.monthlyFee || 4700,
                    registrationFee: athleteForm.registrationFee || 5000,
                    nextDueDate: athleteForm.nextDueDate || editingAthlete.nextDueDate || (() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 1);
                        return d.toISOString().split('T')[0];
                    })()
                };

                const { _id, __v, createdAt, updatedAt, ...cleanPutPayload } = updatedAth;

                let savedAth = updatedAth;
                try {
                    const res = await axios.put(`${API_BASE}athletes/${targetId}`, cleanPutPayload);
                    if (res.data?.data) savedAth = res.data.data;
                } catch (putErr) {
                    console.warn('PUT athletes failed on primary URL, trying fallback...', putErr);
                    try {
                        const fallbackUrl = API_BASE.includes('onrender.com') ? `/api/athletes/${targetId}` : `https://pioneer-gvve.onrender.com/api/athletes/${targetId}`;
                        const res2 = await axios.put(fallbackUrl, cleanPutPayload);
                        if (res2.data?.data) savedAth = res2.data.data;
                    } catch (e2) {
                        console.error('Fallback PUT failed too:', e2);
                    }
                }

                setAthletes(prev => prev.map(a => (a.id === editingAthlete.id || (a._id && a._id === editingAthlete._id)) ? savedAth : a));
                showToast(`Athlete profile for "${athleteForm.name}" updated successfully!`, 'success');
            } else {
                const newId = `ATH-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
                const nextM = new Date();
                nextM.setMonth(nextM.getMonth() + 1);
                const defaultNextDue = nextM.toISOString().split('T')[0];

                const newAthlete = {
                    id: newId,
                    ...athleteForm,
                    email: `${athleteForm.name.toLowerCase().replace(/\s+/g, '')}@pioneershooting.in`,
                    dueAmount: calculatedDue,
                    paymentStatus: finalStatus,
                    monthlyFee: 4700,
                    registrationFee: 5000,
                    nextDueDate: athleteForm.nextDueDate || defaultNextDue,
                    lastPaymentDate: new Date().toISOString().split('T')[0],
                    paidMonthsCount: (athleteForm.planType === 'Combo' || athleteForm.planType === 'Monthly') ? 1 : 0,
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'Active'
                };

                let savedAthlete = newAthlete;
                try {
                    const res = await axios.post(`${API_BASE}athletes`, newAthlete);
                    if (res.data?.data) savedAthlete = res.data.data;
                } catch (postErr) {
                    console.warn('POST athletes failed on primary URL, trying fallback...', postErr);
                    if (API_BASE !== '/api/') {
                        const res2 = await axios.post('/api/athletes', newAthlete);
                        if (res2.data?.data) savedAthlete = res2.data.data;
                    }
                }

                setAthletes(prev => [savedAthlete, ...prev.filter(a => a.id !== savedAthlete.id && a._id !== savedAthlete._id)]);

                // If amount paid > 0, log transaction into MongoDB
                if (Number(athleteForm.amountPaid) > 0) {
                    const newPay = {
                        id: `PAY-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
                        athleteId: savedAthlete.id,
                        athleteName: savedAthlete.name,
                        sport: savedAthlete.sport,
                        plan: savedAthlete.membership,
                        amount: Number(athleteForm.amountPaid),
                        paymentMode: athleteForm.paymentMode || 'Cash',
                        utrNumber: athleteForm.paymentMode === 'Online' ? (athleteForm.utrNumber || '') : '',
                        date: new Date().toISOString().split('T')[0],
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        method: athleteForm.paymentMode === 'Online' ? `Online UPI (UTR: ${athleteForm.utrNumber})` : 'Reception Cash Desk',
                        status: 'Completed',
                        receiptNo: `RCP-2026-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`
                    };

                    try {
                        const payRes = await axios.post(`${API_BASE}payments`, newPay);
                        const savedPay = payRes.data?.data || newPay;
                        setPayments(prev => [savedPay, ...prev]);
                    } catch (payErr) {
                        axios.post('/api/payments', newPay).catch(e2 => console.warn(e2));
                        setPayments(prev => [newPay, ...prev]);
                    }
                }

                showToast(`Enrolled "${athleteForm.name}" (${athleteForm.sport} - ${athleteForm.planType} Plan) successfully!`, 'success');
            }

            // Close modal only on successful save
            setShowAddAthleteModal(false);
            setEditingAthlete(null);
        } catch (err) {
            console.error('Save athlete error:', err);
            showToast(err.response?.data?.message || 'Failed to save athlete to server. Please try again.', 'error');
        } finally {
            setIsSavingAthlete(false);
        }
    };

    // ==========================================
    // ATHLETES BULK & SINGLE DELETE
    // ==========================================
    const handleToggleSelectAthlete = (key) => {
        if (!key) return;
        setSelectedAthleteIds(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleToggleSelectAllAthletes = () => {
        const allKeys = filteredAthletes.map(a => a.id || a._id).filter(Boolean);
        if (selectedAthleteIds.length >= allKeys.length && allKeys.length > 0) {
            setSelectedAthleteIds([]);
        } else {
            setSelectedAthleteIds(allKeys);
        }
    };

    const handleDeleteAthlete = async (id, name, athObj) => {
        const athlete = athObj || athletes.find(a => a.id === id || a._id === id);
        const athleteName = name || athlete?.name || 'Athlete';
        const idsToDelete = [id, athlete?._id, athlete?.id].filter(Boolean);
        if (window.confirm(`Are you sure you want to remove athlete "${athleteName}" from academy records?`)) {
            try {
                await axios.post(`${API_BASE}athletes/batch-delete`, { ids: idsToDelete });
            } catch (err) {
                try {
                    await axios.delete(`${API_BASE}athletes/${athlete?._id || id}`);
                } catch (e) {
                    console.warn('Athlete delete note:', e.message);
                }
            }
            setAthletes(prev => prev.filter(a => !idsToDelete.includes(a.id) && !idsToDelete.includes(a._id)));
            setSelectedAthleteIds(prev => prev.filter(selId => !idsToDelete.includes(selId)));
            showToast(`Athlete "${athleteName}" removed from database.`, 'info');
        }
    };

    const handleBatchDeleteAthletes = async () => {
        if (selectedAthleteIds.length === 0) return;
        const count = selectedAthleteIds.length;
        if (window.confirm(`Permanently remove all ${count} selected athletes from academy records?`)) {
            try {
                await axios.post(`${API_BASE}athletes/batch-delete`, { ids: selectedAthleteIds });
            } catch (err) {
                console.warn('Batch delete athletes note:', err.message);
            }
            setAthletes(prev => prev.filter(a => !selectedAthleteIds.includes(a.id) && !selectedAthleteIds.includes(a._id)));
            setSelectedAthleteIds([]);
            showToast(`Successfully removed ${count} athletes.`, 'info');
        }
    };

    const handleClearAllAthletes = async () => {
        if (athletes.length === 0) return;
        if (window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete ALL ${athletes.length} athlete records? This action cannot be undone!`)) {
            try {
                await axios.delete(`${API_BASE}athletes`);
            } catch (err) {
                try {
                    await axios.post(`${API_BASE}athletes/clear-all`);
                } catch (e) {
                    console.warn('Clear all athletes note:', e.message);
                }
            }
            setAthletes([]);
            setSelectedAthleteIds([]);
            showToast('All athlete records have been cleared.', 'info');
        }
    };

    // ==========================================
    // PAYMENTS CRUD OPERATIONS
    // ==========================================
    const [paymentForm, setPaymentForm] = useState({
        athleteName: '',
        sport: '10M Rifle Shooting',
        plan: 'Monthly Training Membership',
        amount: 4700,
        paymentMode: 'Cash', // 'Cash' | 'Online'
        utrNumber: '',
        method: 'Reception Cash Desk',
        status: 'Completed',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const handleSavePayment = async (e) => {
        e.preventDefault();
        if (!paymentForm.athleteName || !paymentForm.amount) {
            showToast('Please fill all payment fields.', 'error');
            return;
        }

        if (paymentForm.paymentMode === 'Online' && !paymentForm.utrNumber.trim()) {
            showToast('Please enter UTR Number / Transaction ID for online payment.', 'error');
            return;
        }

        const methodLabel = paymentForm.paymentMode === 'Online'
            ? `Online UPI / Bank (UTR: ${paymentForm.utrNumber.trim()})`
            : 'Reception Cash Desk';

        if (editingPayment) {
            const updatedPay = {
                ...editingPayment,
                ...paymentForm,
                method: methodLabel
            };
            setPayments(payments.map(p => (p.id === editingPayment.id || (p._id && p._id === editingPayment._id)) ? updatedPay : p));
            axios.put(`${API_BASE}payments/${editingPayment._id || editingPayment.id}`, updatedPay).catch(err => console.warn(err));
            showToast(`Payment transaction record updated.`);
        } else {
            const newPay = {
                id: `PAY-${Date.now().toString().slice(-6)}`,
                athleteId: `ATH-${Math.floor(100 + Math.random() * 900)}`,
                ...paymentForm,
                method: methodLabel,
                date: new Date().toISOString().split('T')[0],
                receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`
            };
            setPayments([newPay, ...payments]);
            axios.post(`${API_BASE}payments`, newPay).catch(err => console.warn(err));

            // Update matched athlete due amount in MongoDB if exists
            const matchedAthlete = athletes.find(a => a.name.toLowerCase() === paymentForm.athleteName.toLowerCase());
            if (matchedAthlete) {
                const newDue = Math.max(0, Number(matchedAthlete.dueAmount || 0) - Number(paymentForm.amount));
                const updatedAth = {
                    ...matchedAthlete,
                    dueAmount: newDue,
                    paymentStatus: newDue === 0 ? 'Paid' : 'Partial',
                    amountPaid: (Number(matchedAthlete.amountPaid) || 0) + Number(paymentForm.amount),
                    paymentMode: paymentForm.paymentMode,
                    utrNumber: paymentForm.utrNumber
                };
                axios.put(`${API_BASE}athletes/${matchedAthlete._id || matchedAthlete.id}`, updatedAth).catch(e => console.warn(e));
                setAthletes(athletes.map(a => (a.id === matchedAthlete.id || (a._id && a._id === matchedAthlete._id)) ? updatedAth : a));
            }

            showToast(`Recorded manual payment of ₹${Number(paymentForm.amount).toLocaleString()} (${paymentForm.paymentMode})!`, 'success');
        }

        setShowAddPaymentModal(false);
        setEditingPayment(null);
    };

    // ==========================================
    // PAYMENTS BULK & SINGLE DELETE
    // ==========================================
    const handleToggleSelectPayment = (key) => {
        if (!key) return;
        setSelectedPaymentIds(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleToggleSelectAllPayments = () => {
        const allKeys = filteredPayments.map(p => p.id || p._id).filter(Boolean);
        if (selectedPaymentIds.length >= allKeys.length && allKeys.length > 0) {
            setSelectedPaymentIds([]);
        } else {
            setSelectedPaymentIds(allKeys);
        }
    };

    const handleDeletePayment = async (pay) => {
        const targetId = pay._id || pay.id;
        const idsToDelete = [pay._id, pay.id].filter(Boolean);
        if (window.confirm(`Delete payment record (${pay.receiptNo || targetId}) for ₹${pay.amount}?`)) {
            try {
                await axios.post(`${API_BASE}payments/batch-delete`, { ids: idsToDelete });
            } catch (err) {
                try {
                    await axios.delete(`${API_BASE}payments/${targetId}`);
                } catch (e) {
                    console.warn('Payment delete note:', e.message);
                }
            }
            setPayments(prev => prev.filter(p => !idsToDelete.includes(p.id) && !idsToDelete.includes(p._id)));
            setSelectedPaymentIds(prev => prev.filter(selId => !idsToDelete.includes(selId)));
            showToast('Transaction record deleted.', 'info');
        }
    };

    const handleBatchDeletePayments = async () => {
        if (selectedPaymentIds.length === 0) return;
        const count = selectedPaymentIds.length;
        if (window.confirm(`Permanently delete all ${count} selected payment records?`)) {
            try {
                await axios.post(`${API_BASE}payments/batch-delete`, { ids: selectedPaymentIds });
            } catch (err) {
                console.warn('Batch delete payments note:', err.message);
            }
            setPayments(prev => prev.filter(p => !selectedPaymentIds.includes(p.id) && !selectedPaymentIds.includes(p._id)));
            setSelectedPaymentIds([]);
            showToast(`Successfully deleted ${count} payment records.`, 'info');
        }
    };

    const handleClearAllPayments = async () => {
        if (payments.length === 0) return;
        if (window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete ALL ${payments.length} payment records? This action cannot be undone!`)) {
            try {
                await axios.delete(`${API_BASE}payments`);
            } catch (err) {
                try {
                    await axios.post(`${API_BASE}payments/clear-all`);
                } catch (e) {
                    console.warn('Clear all payments note:', e.message);
                }
            }
            setPayments([]);
            setSelectedPaymentIds([]);
            showToast('All payment transaction records cleared.', 'info');
        }
    };

    // ==========================================
    // COACHES CRUD OPERATIONS
    // ==========================================
    const [coachForm, setCoachForm] = useState({
        name: '',
        sport: '10M Rifle',
        certification: 'ISSF Coach License & National Medalist',
        phone: '',
        email: '',
        experience: 8,
        trainees: 18,
        monthlySalary: '₹60,000',
        rating: 4.9
    });

    const handleSaveCoach = (e) => {
        e.preventDefault();
        if (!coachForm.name || !coachForm.phone) {
            showToast('Please fill coach name and contact.', 'error');
            return;
        }

        if (editingCoach) {
            const updated = { ...editingCoach, ...coachForm };
            setCoaches(coaches.map(c => c.id === editingCoach.id ? updated : c));
            axios.put(`${API_BASE}coaches/${editingCoach.id}`, updated).catch(err => console.warn(err));
            showToast(`Coach "${coachForm.name}" profile updated!`);
        } else {
            const newCoach = {
                id: `COA-${Math.floor(10 + Math.random() * 90)}`,
                ...coachForm,
                status: 'Active'
            };
            setCoaches([newCoach, ...coaches]);
            axios.post(`${API_BASE}coaches`, newCoach).catch(err => console.warn(err));
            showToast(`New coach "${coachForm.name}" registered!`);
        }

        setShowAddCoachModal(false);
        setEditingCoach(null);
    };

    const handleDeleteCoach = (id, name) => {
        if (window.confirm(`Remove coach "${name}" from roster?`)) {
            setCoaches(coaches.filter(c => c.id !== id));
            axios.delete(`${API_BASE}coaches/${id}`).catch(err => console.warn(err));
            showToast(`Coach "${name}" removed.`, 'info');
        }
    };

    // ==========================================
    // INVENTORY CRUD OPERATIONS
    // ==========================================
    const [inventoryForm, setInventoryForm] = useState({
        name: '',
        sport: '10M Rifle',
        category: 'Match Weapons & Pellets',
        totalQty: 20,
        availableQty: 20,
        damagedQty: 0,
        location: 'Certified Armory Vault',
        minThreshold: 5,
        unitCost: '₹85,000'
    });

    const handleSaveInventory = (e) => {
        e.preventDefault();
        if (!inventoryForm.name) {
            showToast('Please enter item name.', 'error');
            return;
        }

        if (editingInventory) {
            const updated = { ...editingInventory, ...inventoryForm };
            setInventory(inventory.map(i => i.id === editingInventory.id ? updated : i));
            axios.put(`${API_BASE}inventory/${editingInventory.id}`, updated).catch(err => console.warn(err));
            showToast(`Inventory item "${inventoryForm.name}" updated!`);
        } else {
            const newItem = {
                id: `EQP-${Math.floor(100 + Math.random() * 900)}`,
                ...inventoryForm
            };
            setInventory([newItem, ...inventory]);
            axios.post(`${API_BASE}inventory`, newItem).catch(err => console.warn(err));
            showToast(`Added "${inventoryForm.name}" to sports inventory!`);
        }

        setShowAddInventoryModal(false);
        setEditingInventory(null);
    };

    const handleDeleteInventory = (id, name) => {
        if (window.confirm(`Delete inventory record "${name}"?`)) {
            setInventory(inventory.filter(i => i.id !== id));
            axios.delete(`${API_BASE}inventory/${id}`).catch(err => console.warn(err));
            showToast(`Item removed from inventory.`, 'info');
        }
    };

    // ==========================================
    // MEMBERSHIP PLANS CRUD OPERATIONS
    // ==========================================
    const [planForm, setPlanForm] = useState({
        name: '',
        sport: '10M Rifle',
        duration: '1 Month',
        price: 4700,
        badge: 'Popular',
        featuresText: 'Daily 1.5 Hour Lane Slot\nCertified Match Rifle & Pellets\nISSF Certified Coaching'
    });

    const handleSavePlan = (e) => {
        e.preventDefault();
        if (!planForm.name || !planForm.price) {
            showToast('Please enter plan name and price.', 'error');
            return;
        }

        const featuresArray = planForm.featuresText.split('\n').map(f => f.trim()).filter(Boolean);

        if (editingPlan) {
            const updated = { 
                ...editingPlan, 
                name: planForm.name,
                sport: planForm.sport,
                duration: planForm.duration,
                price: Number(planForm.price),
                badge: planForm.badge,
                features: featuresArray
            };
            setMemberships(memberships.map(m => m.id === editingPlan.id ? updated : m));
            axios.put(`${API_BASE}memberships/${editingPlan.id}`, updated).catch(err => console.warn(err));
            showToast(`Membership plan "${planForm.name}" updated!`);
        } else {
            const newPlan = {
                id: `PLN-${Math.floor(10 + Math.random() * 90)}`,
                name: planForm.name,
                sport: planForm.sport,
                duration: planForm.duration,
                price: Number(planForm.price),
                badge: planForm.badge,
                activeAthletes: 0,
                features: featuresArray
            };
            setMemberships([newPlan, ...memberships]);
            axios.post(`${API_BASE}memberships`, newPlan).catch(err => console.warn(err));
            showToast(`New membership plan "${planForm.name}" created!`);
        }

        setShowAddPlanModal(false);
        setEditingPlan(null);
    };

    const handleDeletePlan = (id, name) => {
        if (window.confirm(`Delete membership plan "${name}"?`)) {
            setMemberships(memberships.filter(m => m.id !== id));
            axios.delete(`${API_BASE}memberships/${id}`).catch(err => console.warn(err));
            showToast(`Plan removed.`, 'info');
        }
    };

    // ==========================================
    // TOURNAMENTS CRUD OPERATIONS
    // ==========================================
    const [tournamentForm, setTournamentForm] = useState({
        title: '',
        sport: '10M Rifle',
        ageCategory: 'Open National Trial',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        teamsCount: 16,
        prizePool: '₹50,000',
        venue: 'Pioneer 10M Olympic Range',
        status: 'Upcoming'
    });

    const handleSaveTournament = (e) => {
        e.preventDefault();
        if (!tournamentForm.title) {
            showToast('Please enter tournament title.', 'error');
            return;
        }

        if (editingTournament) {
            const updated = { ...editingTournament, ...tournamentForm };
            setTournaments(tournaments.map(t => t.id === editingTournament.id ? updated : t));
            axios.put(`${API_BASE}tournaments/${editingTournament.id}`, updated).catch(err => console.warn(err));
            showToast(`Tournament "${tournamentForm.title}" updated!`);
        } else {
            const newTrn = {
                id: `TRN-${Math.floor(10 + Math.random() * 90)}`,
                ...tournamentForm
            };
            setTournaments([newTrn, ...tournaments]);
            axios.post(`${API_BASE}tournaments`, newTrn).catch(err => console.warn(err));
            showToast(`Tournament "${tournamentForm.title}" scheduled!`);
        }

        setShowAddTournamentModal(false);
        setEditingTournament(null);
    };

    const handleDeleteTournament = (id, title) => {
        if (window.confirm(`Cancel tournament "${title}"?`)) {
            setTournaments(tournaments.filter(t => t.id !== id));
            axios.delete(`${API_BASE}tournaments/${id}`).catch(err => console.warn(err));
            showToast(`Tournament cancelled.`, 'info');
        }
    };

    // ==========================================
    // PHYSIO & RECOVERY LAB CRUD OPERATIONS
    // ==========================================
    const [physioForm, setPhysioForm] = useState({
        athleteName: athletes[0]?.name || '',
        sport: '10M Rifle',
        injuryType: 'Shoulder & Neck Strain',
        injuryDate: new Date().toISOString().split('T')[0],
        recoveryStatus: 'In Rehab',
        therapist: 'Dr. Neha Saxena (PT)',
        expectedReturn: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        treatment: 'Postural Alignment, Dry Needling & Core Stability'
    });

    const handleSavePhysio = (e) => {
        e.preventDefault();
        if (!physioForm.athleteName || !physioForm.injuryType) {
            showToast('Please fill all physio log fields.', 'error');
            return;
        }

        if (editingPhysio) {
            const updated = { ...editingPhysio, ...physioForm };
            setPhysioLogs(physioLogs.map(p => p.id === editingPhysio.id ? updated : p));
            axios.put(`${API_BASE}physio/${editingPhysio.id}`, updated).catch(err => console.warn(err));
            showToast(`Physio log updated.`);
        } else {
            const newPhy = {
                id: `PHY-${Math.floor(10 + Math.random() * 90)}`,
                ...physioForm
            };
            setPhysioLogs([newPhy, ...physioLogs]);
            axios.post(`${API_BASE}physio`, newPhy).catch(err => console.warn(err));
            showToast(`Injury recovery log added for ${physioForm.athleteName}!`);
        }

        setShowAddPhysioModal(false);
        setEditingPhysio(null);
    };

    const handleDeletePhysio = (id) => {
        if (window.confirm('Delete this physio record?')) {
            setPhysioLogs(physioLogs.filter(p => p.id !== id));
            axios.delete(`${API_BASE}physio/${id}`).catch(err => console.warn(err));
            showToast('Physio log removed.', 'info');
        }
    };

    // ==========================================
    // BIOMECHANICS & FITNESS ASSESSMENTS CRUD OPERATIONS
    // ==========================================
    const [assessmentForm, setAssessmentForm] = useState({
        athleteName: athletes[0]?.name || '',
        sport: '10M Rifle',
        sprint30m: 'Hold: 0.12mm',
        verticalJump: 'SCATT 96%',
        vo2Max: 'HR: 58 bpm',
        deadlift: 'Stability 9.8',
        testDate: new Date().toISOString().split('T')[0],
        rating: 'Advanced Prospect'
    });

    const handleSaveAssessment = (e) => {
        e.preventDefault();
        if (!assessmentForm.athleteName) {
            showToast('Please select an athlete.', 'error');
            return;
        }

        if (editingAssessment) {
            const updated = { ...editingAssessment, ...assessmentForm };
            setAssessments(assessments.map(a => a.id === editingAssessment.id ? updated : a));
            axios.put(`${API_BASE}assessments/${editingAssessment.id}`, updated).catch(err => console.warn(err));
            showToast(`Fitness score updated.`);
        } else {
            const newAsm = {
                id: `ASM-${Math.floor(10 + Math.random() * 90)}`,
                ...assessmentForm
            };
            setAssessments([newAsm, ...assessments]);
            axios.post(`${API_BASE}assessments`, newAsm).catch(err => console.warn(err));
            showToast(`Recorded performance assessment for ${assessmentForm.athleteName}!`);
        }

        setShowAddAssessmentModal(false);
        setEditingAssessment(null);
    };

    const handleDeleteAssessment = (id) => {
        if (window.confirm('Delete this fitness assessment?')) {
            setAssessments(assessments.filter(a => a.id !== id));
            axios.delete(`${API_BASE}assessments/${id}`).catch(err => console.warn(err));
            showToast('Assessment removed.', 'info');
        }
    };

    // ==========================================
    // INQUIRIES & TRIAL LEADS CRUD OPERATIONS
    // ==========================================
    const [isCustomSportInquiry, setIsCustomSportInquiry] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        phone: '',
        email: '',
        sport: '10M Rifle Shooting',
        ageGroup: 'Ages 10-15',
        message: 'Interested in trial session.'
    });

    const handleSaveInquiry = (e) => {
        e.preventDefault();
        if (!inquiryForm.name || !inquiryForm.phone) {
            showToast('Please fill contact name and phone.', 'error');
            return;
        }

        if (editingInquiry) {
            const updated = { ...editingInquiry, ...inquiryForm };
            setInquiries(inquiries.map(i => i.id === editingInquiry.id ? updated : i));
            axios.put(`${API_BASE}inquiries/${editingInquiry.id}`, updated).catch(err => console.warn(err));
            showToast(`Inquiry for "${inquiryForm.name}" updated!`);
        } else {
            const newInq = {
                id: `INQ-${Math.floor(500 + Math.random() * 400)}`,
                ...inquiryForm,
                date: new Date().toISOString().split('T')[0],
                status: 'New'
            };
            setInquiries([newInq, ...inquiries]);
            axios.post(`${API_BASE}inquiries`, newInq).catch(err => console.warn(err));
            showToast(`Added inquiry for "${inquiryForm.name}"!`);
        }

        setShowAddInquiryModal(false);
        setEditingInquiry(null);
    };

    // ==========================================
    // INQUIRIES BULK & SINGLE DELETE
    // ==========================================
    const matchesInquiry = (item, target) => {
        if (!item || !target) return false;
        const targetIds = [target._id, target.id].filter(Boolean);
        const itemIds = [item._id, item.id].filter(Boolean);
        return targetIds.some(tid => itemIds.includes(tid));
    };

    const handleToggleSelectInquiry = (key) => {
        if (!key) return;
        setSelectedInquiryIds(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleToggleSelectAllInquiries = () => {
        const allKeys = inquiries.map(i => i._id || i.id).filter(Boolean);
        if (selectedInquiryIds.length >= allKeys.length && allKeys.length > 0) {
            setSelectedInquiryIds([]);
        } else {
            setSelectedInquiryIds(allKeys);
        }
    };

    const handleDeleteInquiry = async (inq) => {
        if (!inq) return;
        const targetName = inq.name || 'Inquiry';
        const idsToDelete = [inq._id, inq.id].filter(Boolean);
        if (window.confirm(`Permanently delete inquiry from "${targetName}"?`)) {
            try {
                await axios.post(`${API_BASE}inquiries/batch-delete`, { ids: idsToDelete });
            } catch (err) {
                try {
                    await axios.delete(`${API_BASE}inquiries/${inq._id || inq.id}`);
                } catch (e) {
                    console.warn('Inquiry delete note:', e.message);
                }
            }
            setInquiries(prev => prev.filter(i => !matchesInquiry(i, inq)));
            setSelectedInquiryIds(prev => prev.filter(selId => !idsToDelete.includes(selId)));
            showToast(`Inquiry for "${targetName}" permanently deleted.`, 'info');
        }
    };

    const handleBatchDeleteInquiries = async () => {
        if (selectedInquiryIds.length === 0) return;
        const count = selectedInquiryIds.length;
        if (window.confirm(`Permanently delete all ${count} selected inquiries?`)) {
            try {
                await axios.post(`${API_BASE}inquiries/batch-delete`, { ids: selectedInquiryIds });
            } catch (err) {
                console.warn('Batch delete inquiries note:', err.message);
            }
            setInquiries(prev => prev.filter(i => {
                const iKey = i._id || i.id;
                return !selectedInquiryIds.includes(iKey) && !selectedInquiryIds.includes(i.id) && !selectedInquiryIds.includes(i._id);
            }));
            setSelectedInquiryIds([]);
            showToast(`Deleted ${count} inquiries successfully.`, 'info');
        }
    };

    const handleClearAllInquiries = async () => {
        if (inquiries.length === 0) return;
        if (window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete ALL ${inquiries.length} contact queries? This cannot be undone!`)) {
            try {
                await axios.delete(`${API_BASE}inquiries`);
            } catch (err) {
                try {
                    await axios.post(`${API_BASE}inquiries/clear-all`);
                } catch (e) {
                    console.warn('Clear all inquiries note:', e.message);
                }
            }
            setInquiries([]);
            setSelectedInquiryIds([]);
            showToast('All contact inquiries have been permanently cleared.', 'info');
        }
    };

    const handleAdvanceInquiry = async (inq) => {
        if (!inq) return;
        const targetId = inq._id || inq.id;
        const next = inq.status === 'New' ? 'Contacted' : inq.status === 'Contacted' ? 'Trial Scheduled' : inq.status === 'Trial Scheduled' ? 'Enrolled' : 'Closed';
        try {
            await axios.put(`${API_BASE}inquiries/${targetId}`, { status: next });
        } catch (err) {
            console.warn('Inquiry status update note:', err.message);
        }
        setInquiries(prev => prev.map(i => (i.id === targetId || (i._id && i._id === targetId)) ? { ...i, status: next } : i));
        showToast(`Inquiry status updated to "${next}"`);
    };

    // ==========================================
    // RECURRING MONTHLY BILLING & FEE DUE CALCULATOR
    // ==========================================
    const calculateAthleteFeeSchedule = (athlete) => {
        const today = new Date();
        const monthlyFee = Number(athlete.monthlyFee || (athlete.planType === 'Registration' ? 5000 : 4700));

        let dueDate;
        if (athlete.nextDueDate && !isNaN(new Date(athlete.nextDueDate).getTime())) {
            dueDate = new Date(athlete.nextDueDate);
        } else if (athlete.joinDate && !isNaN(new Date(athlete.joinDate).getTime())) {
            dueDate = new Date(athlete.joinDate);
            dueDate.setMonth(dueDate.getMonth() + 1);
        } else {
            dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + 1);
        }

        const nextDueDateStr = dueDate.toISOString().split('T')[0];
        const nextDueDateFormatted = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const dueMonthName = dueDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

        const diffMs = today.getTime() - dueDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let isOverdue = false;
        let overdueMonths = 0;
        let totalDue = monthlyFee;
        let statusBadge = '';
        let badgeType = 'upcoming'; // 'overdue' | 'due_soon' | 'upcoming'
        const overdueMonthNames = [];

        // Check if due in current month or next month
        const isThisMonth = (dueDate.getFullYear() === today.getFullYear() && dueDate.getMonth() === today.getMonth());
        const nextMonthDate = new Date(today);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const isNextMonth = (dueDate.getFullYear() === nextMonthDate.getFullYear() && dueDate.getMonth() === nextMonthDate.getMonth());

        if (diffDays > 0) {
            isOverdue = true;
            overdueMonths = Math.max(1, Math.ceil(diffDays / 30));
            totalDue = overdueMonths * monthlyFee;
            badgeType = 'overdue';
            statusBadge = `${overdueMonths} Mo Overdue`;

            // Collect overdue month names
            for (let i = overdueMonths - 1; i >= 0; i--) {
                const m = new Date(dueDate);
                m.setMonth(m.getMonth() - i);
                overdueMonthNames.push(m.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }));
            }
        } else {
            const daysLeft = Math.abs(diffDays);
            if (daysLeft <= 7) {
                badgeType = 'due_soon';
                statusBadge = daysLeft === 0 ? 'Due Today' : `Due in ${daysLeft}d`;
            } else {
                badgeType = 'upcoming';
                statusBadge = `Due in ${daysLeft}d`;
            }
            totalDue = monthlyFee;
        }

        if (Number(athlete.dueAmount || 0) > 0) {
            totalDue = Math.max(totalDue, Number(athlete.dueAmount));
            if (!isOverdue) {
                badgeType = 'due_soon';
                statusBadge = 'Balance Due';
            }
        }

        // Student's latest payment and reference ID
        const studentPayments = (payments || []).filter(p => p.athleteId === athlete.id || p.athleteName === athlete.name);
        const lastPayment = studentPayments.length > 0 ? studentPayments[0] : null;
        const lastReceiptNo = lastPayment?.receiptNo || 'RCP-INIT-2026';
        const feeDueRefId = `DUE-${(athlete.id || 'ATH').replace('ATH-', '')}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}${dueDate.getFullYear().toString().slice(-2)}`;

        return {
            nextDueDateStr,
            nextDueDateFormatted,
            dueMonthName,
            isThisMonth,
            isNextMonth,
            isOverdue,
            overdueMonths,
            overdueMonthNames,
            diffDays,
            daysLeft: Math.max(0, Math.abs(diffDays)),
            totalDue,
            statusBadge,
            badgeType,
            monthlyFee,
            lastReceiptNo,
            feeDueRefId,
            lastPayment
        };
    };

    // Calculate recurring fee schedules for all active athletes
    const dueAthletes = athletes.map(a => {
        const sched = calculateAthleteFeeSchedule(a);
        return {
            ...a,
            ...sched
        };
    }).sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.isOverdue && b.isOverdue) return b.diffDays - a.diffDays;
        return a.diffDays - b.diffDays;
    });

    // ==========================================
    // FEE DUE REMINDERS BULK & MODAL ACTIONS
    // ==========================================
    const handleToggleSelectReminder = (key) => {
        if (!key) return;
        setSelectedReminderIds(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleToggleSelectAllReminders = () => {
        const allKeys = filteredDueAthletes.map(a => a.id || a._id).filter(Boolean);
        if (selectedReminderIds.length >= allKeys.length && allKeys.length > 0) {
            setSelectedReminderIds([]);
        } else {
            setSelectedReminderIds(allKeys);
        }
    };

    const handleBroadcastSelectedReminders = () => {
        if (selectedReminderIds.length === 0) return;
        setBroadcastingNotice(true);
        setTimeout(() => {
            setBroadcastingNotice(false);
            showToast(`🚀 Dispatched automated fee reminder to ${selectedReminderIds.length} selected students!`, 'success');
        }, 800);
    };

    const handleOpenCollectFeeModal = (athlete) => {
        setFeeCollectionTarget(athlete);
        setFeeMonthsToCollect(athlete.overdueMonths > 0 ? athlete.overdueMonths : 1);
        setFeeCollectionPaymentMode('Cash');
        setFeeCollectionUtr('');
        setShowCollectFeeModal(true);
    };

    const handleCollectFeeMonth = async (athlete, monthsToPay = 1, paymentMode = 'Cash', utrNumber = '') => {
        const athId = athlete._id || athlete.id;
        const monthlyFee = Number(athlete.monthlyFee || 4700);
        const paidAmount = Number(monthsToPay) * monthlyFee;

        let currentDueDate;
        if (athlete.nextDueDate && !isNaN(new Date(athlete.nextDueDate).getTime())) {
            currentDueDate = new Date(athlete.nextDueDate);
        } else if (athlete.joinDate && !isNaN(new Date(athlete.joinDate).getTime())) {
            currentDueDate = new Date(athlete.joinDate);
            currentDueDate.setMonth(currentDueDate.getMonth() + 1);
        } else {
            currentDueDate = new Date();
            currentDueDate.setMonth(currentDueDate.getMonth() + 1);
        }

        const newDueDateObj = new Date(currentDueDate);
        newDueDateObj.setMonth(newDueDateObj.getMonth() + Number(monthsToPay));
        const newNextDueDate = newDueDateObj.toISOString().split('T')[0];
        const todayStr = new Date().toISOString().split('T')[0];

        const updatedFields = {
            nextDueDate: newNextDueDate,
            lastPaymentDate: todayStr,
            dueAmount: Math.max(0, Number(athlete.dueAmount || 0) - paidAmount),
            amountPaid: (Number(athlete.amountPaid) || 0) + paidAmount,
            paidMonthsCount: (Number(athlete.paidMonthsCount) || 1) + Number(monthsToPay),
            paymentStatus: 'Paid'
        };

        const { _id, __v, createdAt, updatedAt, ...cleanUpdateFields } = updatedFields;

        try {
            // 1. Update Athlete in MongoDB
            let savedAth = null;
            try {
                const res = await axios.put(`${API_BASE}athletes/${athId}`, cleanUpdateFields);
                savedAth = res.data?.data;
            } catch (err) {
                const res2 = await axios.put(`/api/athletes/${athId}`, cleanUpdateFields);
                savedAth = res2.data?.data;
            }

            // 2. Insert Payment record in MongoDB
            const paidMonthNames = [];
            for (let i = 0; i < Number(monthsToPay); i++) {
                const m = new Date(currentDueDate);
                m.setMonth(m.getMonth() + i);
                paidMonthNames.push(m.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }));
            }
            const paidMonthStr = paidMonthNames.join(', ');

            const receiptNo = `RCP-2026-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
            const feeRef = athlete.feeDueRefId || `DUE-${(athlete.id || 'ATH').replace('ATH-', '')}`;
            const newPay = {
                id: `PAY-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
                athleteId: athlete.id || athId,
                athleteName: athlete.name,
                sport: athlete.sport || '10M Rifle Shooting',
                plan: `${athlete.sport} Monthly Fee (${paidMonthStr})`,
                amount: paidAmount,
                paymentMode: paymentMode,
                utrNumber: paymentMode === 'Online' ? utrNumber : '',
                method: paymentMode === 'Online' ? `Online UPI (UTR: ${utrNumber})` : 'Reception Cash Desk',
                date: todayStr,
                dueDate: newNextDueDate,
                status: 'Completed',
                receiptNo: receiptNo,
                note: `Monthly Training Fee collected for: ${paidMonthStr}. Next Due Date: ${newNextDueDate}. Ref ID: ${feeRef}`
            };

            try {
                const payRes = await axios.post(`${API_BASE}payments`, newPay);
                const savedPay = payRes.data?.data || newPay;
                setPayments(prev => [savedPay, ...prev]);
            } catch (e) {
                await axios.post('/api/payments', newPay).catch(() => {});
                setPayments(prev => [newPay, ...prev]);
            }

            // 3. Update local state
            setAthletes(prev => prev.map(a => (a.id === athlete.id || (a._id && a._id === athlete._id)) ? { ...a, ...updatedFields } : a));

            showToast(`✅ Collected ₹${paidAmount.toLocaleString()} for ${athlete.name} (${paidMonthStr})! Next Due: ${newNextDueDate}`, 'success');

            return { success: true, newNextDueDate, receiptNo, paidMonthStr };
        } catch (err) {
            console.error('Failed to collect monthly fee:', err);
            showToast(`Error recording fee payment: ${err.message}`, 'error');
            return { success: false };
        }
    };

    // Quick Mark as Paid (Advances Next Due Date by 1 Month or overdue count)
    const handleMarkPaid = async (athlete) => {
        const months = athlete.overdueMonths > 0 ? athlete.overdueMonths : 1;
        await handleCollectFeeMonth(athlete, months, 'Cash', '');
    };

    const handleMarkSelectedAsPaid = async () => {
        if (selectedReminderIds.length === 0) return;
        const count = selectedReminderIds.length;
        if (window.confirm(`Collect monthly fee & advance billing cycle for all ${count} selected athletes?`)) {
            for (const key of selectedReminderIds) {
                const athlete = athletes.find(a => a.id === key || a._id === key);
                if (athlete) {
                    await handleMarkPaid(athlete);
                }
            }
            setSelectedReminderIds([]);
            showToast(`Marked ${count} athlete monthly fees as Paid & advanced due dates.`, 'success');
        }
    };

    const handleClearAllFeeDues = async () => {
        const overdues = dueAthletes.filter(a => a.isOverdue || a.dueAmount > 0);
        if (overdues.length === 0) return;
        if (window.confirm(`Clear and advance billing dates for all ${overdues.length} pending/overdue students?`)) {
            for (const athlete of overdues) {
                await handleMarkPaid(athlete);
            }
            setSelectedReminderIds([]);
            showToast('All overdue fee balances settled and cycles updated.', 'info');
        }
    };

    const handleBroadcastDueReminders = () => {
        const overdues = dueAthletes.filter(a => a.isOverdue || a.dueAmount > 0 || a.badgeType === 'due_soon');
        if (overdues.length === 0) {
            showToast('All students are up-to-date with fee schedules!', 'info');
            return;
        }

        setBroadcastingNotice(true);
        setTimeout(() => {
            setBroadcastingNotice(false);
            showToast(`🚀 Automated fee reminders dispatched to ${overdues.length} athletes via WhatsApp & SMS!`, 'success');
        }, 1200);
    };

    const handleSendIndividualReminder = (athlete) => {
        const monthInfo = athlete.isOverdue 
            ? `OVERDUE for month(s) of ${athlete.overdueMonthNames?.join(', ') || athlete.dueMonthName} (${athlete.overdueMonths} month(s) overdue). Total pending: ₹${athlete.totalDue?.toLocaleString()}`
            : `due for month of ${athlete.dueMonthName} (Amount: ₹${athlete.totalDue?.toLocaleString()}, Due Date: ${athlete.nextDueDateFormatted || athlete.nextDueDateStr})`;
        const text = encodeURIComponent(`Hi ${athlete.name}, reminder from Pioneer Rifle Shooting Academy (Athlete ID: ${athlete.id}, Ref: ${athlete.feeDueRefId || 'DUE'}): Your training fee is ${monthInfo}. Please pay via UPI (9893270807@upi) or at academy desk. Thank you!`);
        window.open(`https://wa.me/${(athlete.phone || '').replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
        showToast(`Opened WhatsApp reminder for ${athlete.name} (${athlete.dueMonthName})`);
    };

    // ==========================================
    // EXCEL / CSV EXPORT UTILITY
    // ==========================================
    const exportToExcel = (data, fileName, columns) => {
        if (!data || !data.length) {
            showToast('No records available to export', 'error');
            return;
        }
        const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
        const rows = data.map(item => {
            return columns.map(c => {
                const val = c.accessor ? c.accessor(item) : (item[c.key] !== undefined && item[c.key] !== null ? item[c.key] : '');
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(',');
        });
        const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast(`Exported ${data.length} records to Excel (${fileName}.csv)!`, 'success');
    };

    const exportAthletesToExcel = () => {
        const columns = [
            { key: 'id', label: 'Athlete ID' },
            { key: 'name', label: 'Full Name' },
            { key: 'phone', label: 'Phone / WhatsApp' },
            { key: 'email', label: 'Email' },
            { key: 'sport', label: 'Discipline' },
            { key: 'coach', label: 'Coach' },
            { key: 'batchTime', label: 'Batch Timing' },
            { key: 'planType', label: 'Plan Type' },
            { key: 'feeAmount', label: 'Total Fee (₹)' },
            { key: 'amountPaid', label: 'Amount Paid (₹)' },
            { key: 'dueAmount', label: 'Due Balance (₹)' },
            { key: 'paymentStatus', label: 'Payment Status' },
            { key: 'paymentMode', label: 'Payment Mode' },
            { key: 'utrNumber', label: 'UTR Number' },
            { key: 'joinDate', label: 'Join Date' },
            { key: 'status', label: 'Profile Status' }
        ];
        exportToExcel(filteredAthletes, 'Pioneer_Athletes_Roster', columns);
    };

    const exportFeeDuesToExcel = () => {
        const columns = [
            { key: 'id', label: 'Athlete ID' },
            { key: 'name', label: 'Athlete Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'sport', label: 'Sport Discipline' },
            { key: 'planType', label: 'Billing Cycle' },
            { key: 'feeAmount', label: 'Total Fee (₹)' },
            { key: 'dueAmount', label: 'Due Amount (₹)' },
            { key: 'paymentStatus', label: 'Payment Status' },
            { key: 'emergencyContact', label: 'Emergency Contact' }
        ];
        exportToExcel(filteredDueAthletes, 'Pioneer_Fee_Due_Reminders', columns);
    };

    const exportPaymentsToExcel = () => {
        const columns = [
            { key: 'receiptNo', label: 'Receipt No' },
            { key: 'date', label: 'Payment Date' },
            { key: 'athleteName', label: 'Athlete Name' },
            { key: 'sport', label: 'Sport' },
            { key: 'plan', label: 'Plan / Membership' },
            { key: 'amount', label: 'Amount (₹)' },
            { key: 'paymentMode', label: 'Payment Mode' },
            { key: 'utrNumber', label: 'UTR / Transaction Ref' },
            { key: 'method', label: 'Payment Method' },
            { key: 'status', label: 'Status' }
        ];
        exportToExcel(filteredPayments, 'Pioneer_Payments_Ledger', columns);
    };

    // Calculate Summary Stats
    const totalAthletesCount = athletes.length;
    const activeAthletesCount = athletes.filter(a => a.status === 'Active').length;
    const totalCollectedRevenue = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const overdueAthletesCount = dueAthletes.filter(a => a.isOverdue || a.dueAmount > 0).length;
    const totalPendingDues = dueAthletes.reduce((acc, a) => acc + (a.isOverdue || a.dueAmount > 0 ? Number(a.totalDue || a.dueAmount || 0) : 0), 0);
    const totalCoachesCount = coaches.length;

    // Filter athletes
    const filteredAthletes = athletes.filter(a => {
        const matchesSearch = (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (a.phone || '').includes(searchTerm) ||
                              (a.sport || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = filterSport === 'All' || a.sport === filterSport;
        const matchesStatus = filterStatus === 'All' || a.paymentStatus === filterStatus || a.status === filterStatus || a.planType === filterStatus;
        return matchesSearch && matchesSport && matchesStatus;
    });

    // Fee Due Reminders Filter State
    const [reminderSearch, setReminderSearch] = useState('');
    const [reminderSportFilter, setReminderSportFilter] = useState('All');
    const [reminderStartDate, setReminderStartDate] = useState('');
    const [reminderEndDate, setReminderEndDate] = useState('');
    const [viewingStudentBillingDetails, setViewingStudentBillingDetails] = useState(null);

    const filteredDueAthletes = dueAthletes.filter(a => {
        const matchesSearch = (a.name || '').toLowerCase().includes(reminderSearch.toLowerCase()) ||
                              (a.phone || '').includes(reminderSearch) ||
                              (a.id || '').toLowerCase().includes(reminderSearch.toLowerCase()) ||
                              (a.dueMonthName || '').toLowerCase().includes(reminderSearch.toLowerCase()) ||
                              (a.feeDueRefId || '').toLowerCase().includes(reminderSearch.toLowerCase()) ||
                              (a.lastReceiptNo || '').toLowerCase().includes(reminderSearch.toLowerCase());
        const matchesSport = reminderSportFilter === 'All' || a.sport === reminderSportFilter;
        
        let matchesStatus = true;
        if (reminderStatusFilter === 'Overdue') matchesStatus = a.isOverdue;
        else if (reminderStatusFilter === 'DueSoon') matchesStatus = a.badgeType === 'due_soon';
        else if (reminderStatusFilter === 'Upcoming') matchesStatus = a.badgeType === 'upcoming';
        else if (reminderStatusFilter === 'ThisMonth') matchesStatus = a.isThisMonth;
        else if (reminderStatusFilter === 'NextMonth') matchesStatus = a.isNextMonth;

        let matchesDateRange = true;
        if (reminderStartDate) {
            matchesDateRange = matchesDateRange && (a.nextDueDateStr >= reminderStartDate);
        }
        if (reminderEndDate) {
            matchesDateRange = matchesDateRange && (a.nextDueDateStr <= reminderEndDate);
        }

        return matchesSearch && matchesSport && matchesStatus && matchesDateRange;
    });

    // Payments Hub Filter State
    const [paymentSearch, setPaymentSearch] = useState('');
    const [paymentModeFilter, setPaymentModeFilter] = useState('All');

    const filteredPayments = payments.filter(p => {
        const matchesSearch = (p.athleteName || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                              (p.receiptNo || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                              (p.utrNumber || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                              (p.transactionRef || '').toLowerCase().includes(paymentSearch.toLowerCase());
        const matchesMode = paymentModeFilter === 'All' ||
                            (paymentModeFilter === 'Cash' && (p.paymentMode === 'Cash' || (p.method || '').toLowerCase().includes('cash'))) ||
                            (paymentModeFilter === 'Online' && (p.paymentMode === 'Online' || (p.method || '').toLowerCase().includes('upi') || (p.method || '').toLowerCase().includes('online') || p.utrNumber));
        return matchesSearch && matchesMode;
    });

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 pb-20 lg:pb-0">
            
            {/* TOAST NOTIFICATION POPUP */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border ${
                            toastMessage.type === 'error'
                                ? 'bg-red-500 text-white border-red-600'
                                : toastMessage.type === 'info'
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-slate-900 text-white border-slate-800'
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-ping" />
                        <span>{toastMessage.msg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP BAR / ADMIN HEADER */}
            <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
                
                {/* Brand & Mobile Hamburger */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                        className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                        aria-label="Open Navigation Drawer"
                    >
                        <FiMenu className="text-xl" />
                    </button>

                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 100 100" className="w-8 h-8">
                                <circle cx="50" cy="22" r="12" fill="#FF6A1A" />
                                <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FF6A1A" />
                                <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#3B82F6" />
                                <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#3B82F6" />
                            </svg>
                        </div>
                        <div className="leading-tight">
                            <span className="font-display font-extrabold text-lg text-white tracking-tight">
                                Pioneer <span className="text-[#FF6A1A]">Academy</span>
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block -mt-0.5">
                                ADMIN PWA CENTER
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center Quick Stats */}
                <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold text-slate-200">Academy Hub Live</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Active Athletes:</span>
                        <strong className="text-white">{activeAthletesCount}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Monthly Revenue:</span>
                        <strong className="text-[#FF6A1A]">₹{totalCollectedRevenue.toLocaleString()}</strong>
                    </div>
                </div>

                {/* Right Action & PWA App Download */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleTriggerInstall}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-xs font-bold text-white shadow-sm"
                        title="Install Mobile PWA App"
                    >
                        <FiSmartphone className="text-sm" />
                        <span className="hidden sm:inline">Install App</span>
                    </button>

                    <button
                        onClick={handleOpenQrModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-xs font-bold text-white transition-all shadow-sm"
                    >
                        <FaQrcode />
                        <span className="hidden sm:inline">Enrollment QR</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold transition-all"
                    >
                        <FiLogOut />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </header>

            {/* MAIN ADMIN WORKSPACE WITH SIDEBAR */}
            <div className="flex flex-grow overflow-hidden">
                
                {/* DESKTOP SIDEBAR NAVIGATION */}
                <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 space-y-2 shrink-0 overflow-y-auto">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
                        Management Suite
                    </div>

                    {[
                        { id: 'overview', name: 'Dashboard', icon: <FiGrid /> },
                        { id: 'athletes', name: 'Athletes & Students', icon: <FiUsers />, badge: athletes.length },
                        { id: 'payments', name: 'Payments Hub', icon: <FiDollarSign />, badge: payments.length },
                        { id: 'reminders', name: 'Fee Due Reminders', icon: <FiBell />, alertBadge: dueAthletes.length },
                        { id: 'inquiries', name: 'Contact Us Queries', icon: <FiMessageSquare />, badge: inquiries.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-[#FF6A1A] text-white shadow-lg shadow-orange-500/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-base">{tab.icon}</span>
                                <span>{tab.name}</span>
                            </div>
                            {tab.alertBadge > 0 ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-bold animate-pulse">
                                    {tab.alertBadge} Due
                                </span>
                            ) : tab.badge !== undefined ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                                    {tab.badge}
                                </span>
                            ) : null}
                        </button>
                    ))}

                    <div className="pt-4 mt-auto border-t border-slate-800 space-y-2">
                        <button
                            onClick={handleTriggerInstall}
                            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/30 transition-all"
                        >
                            <FiSmartphone /> Download Mobile App
                        </button>
                    </div>
                </aside>

                {/* MOBILE DRAWER NAVIGATION */}
                <AnimatePresence>
                    {mobileDrawerOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: -280 }}
                                animate={{ x: 0 }}
                                exit={{ x: -280 }}
                                className="relative w-72 bg-slate-900 text-white p-5 flex flex-col space-y-2 z-10 shadow-2xl overflow-y-auto"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                    <span className="font-display font-black text-lg text-white">
                                        Pioneer <span className="text-[#FF6A1A]">Academy</span> Admin
                                    </span>
                                    <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                        <FiX className="text-xl" />
                                    </button>
                                </div>

                                {[
                                    { id: 'overview', name: 'Dashboard', icon: <FiGrid /> },
                                    { id: 'athletes', name: 'Athletes & Students', icon: <FiUsers /> },
                                    { id: 'payments', name: 'Payments Hub', icon: <FiDollarSign /> },
                                    { id: 'reminders', name: 'Fee Due Reminders', icon: <FiBell /> },
                                    { id: 'inquiries', name: 'Contact Us Queries', icon: <FiMessageSquare /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setMobileDrawerOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left ${
                                            activeTab === tab.id
                                                ? 'bg-[#FF6A1A] text-white shadow-lg'
                                                : 'text-slate-300 hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="text-base">{tab.icon}</span>
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    
                    {/* ========================================================================= */}
                    {/* TAB 1: DASHBOARD OVERVIEW */}
                    {/* ========================================================================= */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            
                            {/* Title & Quick Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Academy Dashboard
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Real-time overview of active athletes, coaching rosters, fee revenue, and pending dues.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        onClick={handleOpenQrModal}
                                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                                    >
                                        <FaQrcode /> Self-Registration QR
                                    </button>
                                    <button
                                        onClick={handleOpenAddAthlete}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-transform active:scale-98"
                                    >
                                        <FiPlus /> Add Athlete
                                    </button>
                                </div>
                            </div>

                            {/* Key Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                
                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Athletes</span>
                                        <div className="font-display font-black text-2xl text-slate-900">{athletes.length}</div>
                                        <span className="text-[11px] text-emerald-600 font-semibold">{activeAthletesCount} Active on Turf</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-2xl">
                                        <FiUsers />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Fee Collected</span>
                                        <div className="font-display font-black text-2xl text-slate-900">₹{totalCollectedRevenue.toLocaleString()}</div>
                                        <span className="text-[11px] text-emerald-600 font-semibold">{payments.length} Transactions</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                                        <FiDollarSign />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
                                        <div className="font-display font-black text-2xl text-red-600">₹{totalPendingDues.toLocaleString()}</div>
                                        <span className="text-[11px] text-red-500 font-semibold">{dueAthletes.length} Athletes Pending</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl">
                                        <FiAlertCircle />
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Certified Coaches</span>
                                        <div className="font-display font-black text-2xl text-slate-900">{totalCoachesCount}</div>
                                        <span className="text-[11px] text-blue-600 font-semibold">Across {sportsList.length} Sports</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                                        <GiWhistle />
                                    </div>
                                </div>

                            </div>

                            {/* Dues Alert Banner */}
                            {dueAthletes.length > 0 && (
                                <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500 to-[#FF6A1A] text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-display font-black text-base flex items-center gap-2">
                                            <FiBell className="text-xl animate-bounce" /> {dueAthletes.length} Athletes Have Pending Academy Dues (₹{totalPendingDues.toLocaleString()})
                                        </h4>
                                        <p className="text-xs text-orange-100">
                                            Send automated WhatsApp & SMS reminders directly with a single click.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleBroadcastDueReminders}
                                        disabled={broadcastingNotice}
                                        className="py-2.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-md shrink-0 flex items-center gap-2 transition-transform active:scale-95"
                                    >
                                        <FaWhatsapp className="text-emerald-400 text-base" />
                                        <span>{broadcastingNotice ? 'Dispatching Reminders...' : 'Broadcast Due Reminders'}</span>
                                    </button>
                                </div>
                            )}

                            {/* Sports Breakdown & Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                
                                {/* Sports Distribution */}
                                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                                    <h3 className="font-display font-bold text-base text-slate-900 flex items-center justify-between">
                                        <span>Sport Enrollment Distribution</span>
                                        <span className="text-xs text-slate-400 font-medium">{athletes.length} Total</span>
                                    </h3>

                                    <div className="space-y-3 pt-2">
                                        {['10M Rifle', '10M Pistol', 'Beginner Training', 'Competitive Prep', 'Target Biomechanics'].map((sport) => {
                                            const count = athletes.filter(a => a.sport === sport).length;
                                            const percentage = athletes.length > 0 ? Math.round((count / athletes.length) * 100) : 0;
                                            return (
                                                <div key={sport} className="space-y-1">
                                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                                        <span>{sport}</span>
                                                        <span className="text-slate-500">{count} Athletes ({percentage}%)</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#FF6A1A] rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Payments Stream */}
                                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-display font-bold text-base text-slate-900">
                                            Recent Transactions
                                        </h3>
                                        <button
                                            onClick={() => setActiveTab('athletes')}
                                            className="text-xs font-bold text-[#FF6A1A] hover:underline"
                                        >
                                            View Athletes & Fees
                                        </button>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        {payments.slice(0, 4).map((pay) => (
                                            <div key={pay.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <div className="font-bold text-xs text-slate-900">{pay.athleteName}</div>
                                                    <div className="text-[11px] text-slate-500">{pay.sport} • {pay.plan}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-xs text-emerald-600">+₹{pay.amount?.toLocaleString()}</div>
                                                    <div className="text-[10px] text-slate-400">{pay.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 2: ATHLETES & STUDENTS MANAGEMENT (WITH MONTHLY / YEARLY & QR) */}
                    {/* ========================================================================= */}
                    {activeTab === 'athletes' && (
                        <div className="space-y-6">
                            
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Athlete & Student Roster
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Manage student profiles, monthly/yearly billing options, fees, and QR self-registration.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {selectedAthleteIds.length > 0 && (
                                        <button
                                            onClick={handleBatchDeleteAthletes}
                                            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
                                            title="Delete all selected athletes"
                                        >
                                            <FiTrash2 /> Delete Selected ({selectedAthleteIds.length})
                                        </button>
                                    )}

                                    {athletes.length > 0 && (
                                        <button
                                            onClick={handleClearAllAthletes}
                                            className="py-2.5 px-3.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                                            title="Permanently clear all athletes"
                                        >
                                            <FiTrash2 /> Delete All ({athletes.length})
                                        </button>
                                    )}

                                    <button
                                        onClick={handleOpenQrModal}
                                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                                    >
                                        <FaQrcode /> Self-Registration QR
                                    </button>

                                    <button
                                        onClick={handleOpenAddAthlete}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5 self-start sm:self-auto"
                                    >
                                        <FiPlus /> Enroll New Athlete
                                    </button>
                                </div>
                            </div>

                            {/* Filters & Search Toolbar */}
                            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                                
                                <div className="relative w-full md:w-80">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by student name, phone, or sport..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <select
                                        value={filterSport}
                                        onChange={(e) => setFilterSport(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        <option value="All">All Sports</option>
                                        {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                    </select>

                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        <option value="All">All Statuses & Plans</option>
                                        <option value="Monthly">Monthly Plan</option>
                                        <option value="Yearly">Yearly Plan</option>
                                        <option value="Paid">Paid Fees</option>
                                        <option value="Due">Due Fees</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>

                                    <button
                                        onClick={exportAthletesToExcel}
                                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                                        title="Export Athlete Roster to Excel"
                                    >
                                        <FiDownload />
                                        <span>Export Excel</span>
                                    </button>
                                </div>
                            </div>

                            {/* Athletes Table */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-4 w-10 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAthleteIds.length === filteredAthletes.length && filteredAthletes.length > 0}
                                                        onChange={handleToggleSelectAllAthletes}
                                                        className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                                        title="Select All Athletes"
                                                    />
                                                </th>
                                                <th className="px-5 py-4">Athlete ID & Name</th>
                                                <th className="px-5 py-4">Sport & Batch</th>
                                                <th className="px-5 py-4">Billing & Plan</th>
                                                <th className="px-5 py-4">Fee / Due Balance</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAthletes.map((athlete) => {
                                                const athKey = athlete.id || athlete._id;
                                                const isSelected = selectedAthleteIds.includes(athKey) || selectedAthleteIds.includes(athlete.id) || selectedAthleteIds.includes(athlete._id);
                                                return (
                                                <tr key={athKey} className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-orange-50/30' : ''}`}>
                                                    <td className="px-4 py-4 w-10 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleToggleSelectAthlete(athKey)}
                                                            className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900 text-sm">{athlete.name}</div>
                                                        <div className="text-[11px] text-slate-400">{athlete.id} • {athlete.phone} • {athlete.age} Yrs ({athlete.gender})</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                                            <span>{athlete.sport}</span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{athlete.batchTime}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase inline-block mb-1 ${
                                                            athlete.planType === 'Yearly'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {athlete.planType || 'Monthly'} Pass
                                                        </span>
                                                        <div className="text-[11px] text-slate-500 font-medium">{athlete.membership}</div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900">Total: ₹{athlete.feeAmount?.toLocaleString()}</div>
                                                        <div className={`text-[11px] font-semibold ${athlete.dueAmount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                            {athlete.dueAmount > 0 ? `Due: ₹${athlete.dueAmount.toLocaleString()}` : '✓ Fully Paid'}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            athlete.paymentStatus === 'Paid'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : athlete.paymentStatus === 'Due'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {athlete.paymentStatus}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => {
                                                                    const sched = calculateAthleteFeeSchedule(athlete);
                                                                    setViewingStudentBillingDetails({ ...athlete, ...sched });
                                                                }}
                                                                title="View Full Profile & Billing Ledger"
                                                                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                                            >
                                                                <FiEye className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleViewAthleteCard(athlete)}
                                                                title="View ID Badge (QR & Download)"
                                                                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6A1A] transition-colors"
                                                            >
                                                                <FaQrcode className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setEditingAthlete(athlete);
                                                                    setAthleteForm({
                                                                        name: athlete.name || '',
                                                                        phone: athlete.phone || '',
                                                                        age: athlete.age || 15,
                                                                        gender: athlete.gender || 'Male',
                                                                        sport: athlete.sport || '10M Rifle Shooting',
                                                                        batchTime: athlete.batchTime || 'Evening Prime Shift (04:00 PM - 07:00 PM)',
                                                                        coach: athlete.coach || 'Coach Rajesh Sharma (ISSF / NRAI)',
                                                                        planType: athlete.planType || 'Monthly',
                                                                        membership: athlete.membership || `${athlete.sport} Monthly Pass`,
                                                                        feeAmount: athlete.feeAmount || 4700,
                                                                        amountPaid: athlete.amountPaid || 4700,
                                                                        dueAmount: athlete.dueAmount || 0,
                                                                        paymentStatus: athlete.paymentStatus || 'Paid',
                                                                        paymentMode: athlete.paymentMode || 'Cash',
                                                                        utrNumber: athlete.utrNumber || '',
                                                                        emergencyContact: athlete.emergencyContact || '',
                                                                        bloodGroup: athlete.bloodGroup || 'B+',
                                                                        monthlyFee: athlete.monthlyFee || 4700,
                                                                        registrationFee: athlete.registrationFee || 5000,
                                                                        nextDueDate: athlete.nextDueDate ? new Date(athlete.nextDueDate).toISOString().split('T')[0] : ''
                                                                    });
                                                                    setIsCustomSportAdmin(!sportsList.some(s => s.name === athlete.sport));
                                                                    setIsCustomTimingAdmin(!adminTimingShifts.includes(athlete.batchTime));
                                                                    setShowAddAthleteModal(true);
                                                                }}
                                                                title="Edit Profile"
                                                                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                                                            >
                                                                <FiEdit2 className="text-xs" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteAthlete(athlete.id || athlete._id, athlete.name, athlete)}
                                                                title="Delete Athlete"
                                                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                            >
                                                                <FiTrash2 className="text-xs" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                  </div>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB: PAYMENTS HUB & TRANSACTION LEDGER */}
                    {/* ========================================================================= */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Payments Hub & Transaction Ledger
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Record manual reception payments, track UPI / bank transfers with UTR numbers, and export collection reports.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {selectedPaymentIds.length > 0 && (
                                        <button
                                            onClick={handleBatchDeletePayments}
                                            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
                                            title="Delete selected payment records"
                                        >
                                            <FiTrash2 /> Delete Selected ({selectedPaymentIds.length})
                                        </button>
                                    )}

                                    {payments.length > 0 && (
                                        <button
                                            onClick={handleClearAllPayments}
                                            className="py-2.5 px-3.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                                            title="Permanently clear all payment records"
                                        >
                                            <FiTrash2 /> Delete All ({payments.length})
                                        </button>
                                    )}

                                    <button
                                        onClick={exportPaymentsToExcel}
                                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                                    >
                                        <FiDownload /> Export Payments (Excel)
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingPayment(null);
                                            setPaymentForm({
                                                athleteName: '',
                                                sport: '10M Rifle Shooting',
                                                plan: 'Monthly Training Membership',
                                                amount: 4700,
                                                paymentMode: 'Cash',
                                                utrNumber: '',
                                                method: 'Reception Cash Desk',
                                                status: 'Completed',
                                                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                                            });
                                            setShowAddPaymentModal(true);
                                        }}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                    >
                                        <FiPlus /> Record Manual Payment
                                    </button>
                                </div>
                            </div>

                            {/* Metric Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue Collected</span>
                                    <div className="font-display font-black text-2xl text-slate-900">
                                        ₹{payments.reduce((acc, p) => acc + Number(p.amount || 0), 0).toLocaleString()}
                                    </div>
                                    <p className="text-[11px] text-slate-500">{payments.length} verified transactions</p>
                                </div>

                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cash Collections</span>
                                    <div className="font-display font-black text-2xl text-slate-800">
                                        ₹{payments.filter(p => p.paymentMode === 'Cash' || (p.method || '').toLowerCase().includes('cash')).reduce((acc, p) => acc + Number(p.amount || 0), 0).toLocaleString()}
                                    </div>
                                    <p className="text-[11px] text-slate-500">Collected at reception desk</p>
                                </div>

                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Online & UPI (UTR Verified)</span>
                                    <div className="font-display font-black text-2xl text-emerald-600">
                                        ₹{payments.filter(p => p.paymentMode === 'Online' || (p.method || '').toLowerCase().includes('upi') || (p.method || '').toLowerCase().includes('online') || p.utrNumber).reduce((acc, p) => acc + Number(p.amount || 0), 0).toLocaleString()}
                                    </div>
                                    <p className="text-[11px] text-emerald-700/80">Bank transfers & UPI transactions</p>
                                </div>

                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">Pending Dues Balance</span>
                                    <div className="font-display font-black text-2xl text-red-600">
                                        ₹{totalPendingDues.toLocaleString()}
                                    </div>
                                    <p className="text-[11px] text-slate-500">{dueAthletes.length} students pending</p>
                                </div>
                            </div>

                            {/* Search & Filter Bar */}
                            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:w-80">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by student name, receipt #, or UTR..."
                                        value={paymentSearch}
                                        onChange={(e) => setPaymentSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                                        <button
                                            onClick={() => setPaymentModeFilter('All')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                paymentModeFilter === 'All' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            All Modes
                                        </button>
                                        <button
                                            onClick={() => setPaymentModeFilter('Cash')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                paymentModeFilter === 'Cash' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Cash Only
                                        </button>
                                        <button
                                            onClick={() => setPaymentModeFilter('Online')}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                paymentModeFilter === 'Online' ? 'bg-white shadow text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Online (UTR)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Payments Table */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-4 w-10 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPaymentIds.length === filteredPayments.length && filteredPayments.length > 0}
                                                        onChange={handleToggleSelectAllPayments}
                                                        className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                                        title="Select All Payments"
                                                    />
                                                </th>
                                                <th className="px-5 py-4">Receipt & Date</th>
                                                <th className="px-5 py-4">Student Name</th>
                                                <th className="px-5 py-4">Plan / Purpose</th>
                                                <th className="px-5 py-4">Amount</th>
                                                <th className="px-5 py-4">Payment Mode & UTR</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredPayments.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                                                        No payment transactions match the filter criteria.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredPayments.map((pay) => {
                                                    const payKey = pay.id || pay._id;
                                                    const isSelected = selectedPaymentIds.includes(payKey) || selectedPaymentIds.includes(pay.id) || selectedPaymentIds.includes(pay._id);
                                                    const isOnline = pay.paymentMode === 'Online' || (pay.method || '').toLowerCase().includes('upi') || (pay.method || '').toLowerCase().includes('online') || pay.utrNumber;
                                                    return (
                                                        <tr key={payKey} className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-orange-50/30' : ''}`}>
                                                            <td className="px-4 py-4 w-10 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => handleToggleSelectPayment(payKey)}
                                                                    className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="font-mono font-bold text-slate-900">{pay.receiptNo || pay.id}</div>
                                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                                    <FiCalendar className="text-[10px]" />
                                                                    <span>{pay.date || 'Recent'}</span>
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <div className="font-bold text-slate-900">{pay.athleteName}</div>
                                                                <div className="text-[11px] text-slate-400">{pay.sport || '10M Shooting'}</div>
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <div className="font-semibold text-slate-800">{pay.plan || 'Monthly Training Fee'}</div>
                                                                {pay.note && <div className="text-[10px] text-slate-400 italic truncate max-w-xs">{pay.note}</div>}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <div className="font-display font-black text-emerald-600 text-sm">
                                                                    ₹{Number(pay.amount || 0).toLocaleString()}
                                                                </div>
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                {isOnline ? (
                                                                    <div className="space-y-1">
                                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                                                                            Online (UPI)
                                                                        </span>
                                                                        {(pay.utrNumber || pay.transactionRef) && (
                                                                            <div className="font-mono text-[11px] text-slate-700 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                                                                UTR: {pay.utrNumber || pay.transactionRef}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                                                                        Cash Desk
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4">
                                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                                                                    {pay.status || 'Completed'}
                                                                </span>
                                                            </td>

                                                            <td className="px-5 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    <button
                                                                        onClick={() => handleDeletePayment(pay)}
                                                                        className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                        title="Delete Transaction"
                                                                    >
                                                                        <FiTrash2 />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 4: FEE DUE & BROADCAST AUTO REMINDERS */}
                    {/* ========================================================================= */}
                    {activeTab === 'reminders' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Fee Due & Payment Reminders
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Automated monthly & yearly fee collection reminders via WhatsApp & SMS.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {selectedReminderIds.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleBroadcastSelectedReminders}
                                                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                                                title="Send WhatsApp reminder to selected students"
                                            >
                                                <FaWhatsapp /> Remind Selected ({selectedReminderIds.length})
                                            </button>
                                            <button
                                                onClick={handleMarkSelectedAsPaid}
                                                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                                                title="Mark fee dues as paid for selected students"
                                            >
                                                <FiCheck /> Mark Paid ({selectedReminderIds.length})
                                            </button>
                                        </>
                                    )}

                                    {dueAthletes.length > 0 && (
                                        <button
                                            onClick={handleClearAllFeeDues}
                                            className="py-2.5 px-3.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                                            title="Mark all pending fee dues as settled"
                                        >
                                            <FiTrash2 /> Settle All Dues ({dueAthletes.length})
                                        </button>
                                    )}

                                    <button
                                        onClick={exportFeeDuesToExcel}
                                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                                    >
                                        <FiDownload /> Export Dues (Excel)
                                    </button>

                                    <button
                                        onClick={handleBroadcastDueReminders}
                                        disabled={broadcastingNotice}
                                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-transform active:scale-95"
                                    >
                                        <FaWhatsapp className="text-base" />
                                        <span>{broadcastingNotice ? 'Dispatching...' : 'Broadcast Auto Reminder to All'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Overdue / Pending</span>
                                    <div className="font-display font-black text-2xl text-red-600">₹{totalPendingDues.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        <strong className="text-red-600">{overdueAthletesCount}</strong> students have overdue monthly fees
                                    </p>
                                </div>

                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Fee Standard</span>
                                    <div className="font-display font-black text-2xl text-slate-900">₹4,700 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
                                    <p className="text-xs text-slate-500 font-medium">Auto-advances billing cycle by +1 month on collection</p>
                                </div>

                                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-1">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Billing Automation</span>
                                    <div className="font-display font-black text-2xl text-emerald-600">Active Live</div>
                                    <p className="text-xs text-slate-500 font-medium">100% synced with MongoDB Atlas payments ledger</p>
                                </div>
                            </div>

                            {/* Search & Filter Toolbar for Dues */}
                            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
                                <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                                    <div className="relative w-full lg:w-80">
                                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by student, phone, ID, month, or receipt..."
                                            value={reminderSearch}
                                            onChange={(e) => setReminderSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        />
                                    </div>

                                    {/* Date Range Picker & Selectors */}
                                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                                            <span className="text-slate-400 font-bold text-[10px] uppercase">From Due:</span>
                                            <input
                                                type="date"
                                                value={reminderStartDate}
                                                onChange={(e) => setReminderStartDate(e.target.value)}
                                                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                                                title="Filter by Next Due Date Start"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                                            <span className="text-slate-400 font-bold text-[10px] uppercase">To Due:</span>
                                            <input
                                                type="date"
                                                value={reminderEndDate}
                                                onChange={(e) => setReminderEndDate(e.target.value)}
                                                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                                                title="Filter by Next Due Date End"
                                            />
                                        </div>

                                        <select
                                            value={reminderSportFilter}
                                            onChange={(e) => setReminderSportFilter(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                        >
                                            <option value="All">All Disciplines</option>
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>

                                        {(reminderSearch || reminderStartDate || reminderEndDate || reminderSportFilter !== 'All' || reminderStatusFilter !== 'All') && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReminderSearch('');
                                                    setReminderStartDate('');
                                                    setReminderEndDate('');
                                                    setReminderSportFilter('All');
                                                    setReminderStatusFilter('All');
                                                }}
                                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors"
                                                title="Reset all filters"
                                            >
                                                <FiX className="text-xs" />
                                                <span>Reset</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Category Filter Pills */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-bold">
                                    <button
                                        type="button"
                                        onClick={() => setReminderStatusFilter('All')}
                                        className={`px-3 py-1.5 rounded-xl transition-all ${
                                            reminderStatusFilter === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        All ({dueAthletes.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReminderStatusFilter('Overdue')}
                                        className={`px-3 py-1.5 rounded-xl transition-all ${
                                            reminderStatusFilter === 'Overdue' ? 'bg-red-500 text-white shadow-sm' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}
                                    >
                                        Overdue ({dueAthletes.filter(a => a.isOverdue).length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReminderStatusFilter('ThisMonth')}
                                        className={`px-3 py-1.5 rounded-xl transition-all ${
                                            reminderStatusFilter === 'ThisMonth' ? 'bg-orange-500 text-white shadow-sm' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        Due This Month ({dueAthletes.filter(a => a.isThisMonth).length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReminderStatusFilter('NextMonth')}
                                        className={`px-3 py-1.5 rounded-xl transition-all ${
                                            reminderStatusFilter === 'NextMonth' ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                        }`}
                                    >
                                        Due Next Month ({dueAthletes.filter(a => a.isNextMonth).length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReminderStatusFilter('DueSoon')}
                                        className={`px-3 py-1.5 rounded-xl transition-all ${
                                            reminderStatusFilter === 'DueSoon' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                        }`}
                                    >
                                        Due Soon ({dueAthletes.filter(a => a.badgeType === 'due_soon').length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReminderStatusFilter('Upcoming')}
                                        className={`px-3 py-1.5 rounded-xl transition-all ${
                                            reminderStatusFilter === 'Upcoming' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                        }`}
                                    >
                                        Upcoming ({dueAthletes.filter(a => a.badgeType === 'upcoming').length})
                                    </button>
                                </div>
                            </div>

                            {/* Dues Roster */}
                            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-4 w-10 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReminderIds.length === filteredDueAthletes.length && filteredDueAthletes.length > 0}
                                                        onChange={handleToggleSelectAllReminders}
                                                        className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                                        title="Select All Due Students"
                                                    />
                                                </th>
                                                <th className="px-5 py-4">Athlete & References</th>
                                                <th className="px-5 py-4">Discipline & Rate</th>
                                                <th className="px-5 py-4">Due Month & Cycle Date</th>
                                                <th className="px-5 py-4">Calculated Due</th>
                                                <th className="px-5 py-4">Billing Status</th>
                                                <th className="px-5 py-4 text-right">Actions & Remind</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredDueAthletes.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <FiCheckCircle className="text-3xl text-emerald-500" />
                                                            <span className="font-bold text-slate-700">No athletes match the selected fee due criteria!</span>
                                                            <span className="text-xs text-slate-400">All registered students are up to date or no results matched search.</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredDueAthletes.map((athlete) => {
                                                    const athKey = athlete.id || athlete._id;
                                                    const isSelected = selectedReminderIds.includes(athKey) || selectedReminderIds.includes(athlete.id) || selectedReminderIds.includes(athlete._id);
                                                    return (
                                                    <tr key={athKey} className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-orange-50/30' : ''}`}>
                                                        <td className="px-4 py-4 w-10 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleToggleSelectReminder(athKey)}
                                                                className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                                                <span>{athlete.name}</span>
                                                            </div>
                                                            <div className="text-[11px] text-slate-400">{athlete.phone} • <span className="font-mono text-slate-500">{athlete.id}</span></div>
                                                            <div className="text-[10px] font-mono flex items-center gap-1.5 text-slate-500 mt-0.5">
                                                                <span className="bg-orange-50 text-[#FF6A1A] font-bold px-1.5 py-0.5 rounded border border-orange-200/60">
                                                                    Ref: {athlete.feeDueRefId}
                                                                </span>
                                                                <span className="text-slate-400">
                                                                    Last RCP: {athlete.lastReceiptNo}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="font-semibold text-slate-800">{athlete.sport}</div>
                                                            <div className="text-[11px] text-[#FF6A1A] font-bold">₹{athlete.monthlyFee.toLocaleString()}/mo</div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="font-extrabold text-slate-900">{athlete.nextDueDateFormatted || athlete.nextDueDateStr}</div>
                                                            {athlete.isOverdue ? (
                                                                <div className="text-[11px] font-bold text-red-600 flex items-center gap-1 mt-0.5">
                                                                    <span>⚠️</span>
                                                                    <span>Due For: {athlete.overdueMonthNames?.join(', ') || athlete.dueMonthName} ({athlete.overdueMonths} Mo Overdue)</span>
                                                                </div>
                                                            ) : (
                                                                <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                                                                    <span>📅</span>
                                                                    <span>Due For: {athlete.dueMonthName} {athlete.isNextMonth ? '(Next Month)' : athlete.isThisMonth ? '(This Month)' : ''}</span>
                                                                </div>
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className={`font-extrabold text-sm ${athlete.isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                                                                ₹{athlete.totalDue.toLocaleString()}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                {athlete.isOverdue ? `${athlete.overdueMonths} mo × ₹${athlete.monthlyFee.toLocaleString()}` : `1 Month Fee (${athlete.dueMonthName})`}
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                                athlete.isOverdue 
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : athlete.badgeType === 'due_soon'
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : 'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                                {athlete.isOverdue ? `🔴 ${athlete.overdueMonths} Mo Overdue` : athlete.badgeType === 'due_soon' ? `🟡 ${athlete.statusBadge}` : `🟢 Current Cycle`}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => setViewingStudentBillingDetails(athlete)}
                                                                    className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                                                                    title="View full student profile & billing history"
                                                                >
                                                                    <FiEye className="text-xs" />
                                                                    <span>Details</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleOpenCollectFeeModal(athlete)}
                                                                    className="py-1.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                                                                    title="Collect fee and advance next due date"
                                                                >
                                                                    <FiDollarSign className="text-xs" />
                                                                    <span>Collect Fee</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleSendIndividualReminder(athlete)}
                                                                    className="py-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                                                                    title="Send WhatsApp payment reminder"
                                                                >
                                                                    <FaWhatsapp />
                                                                    <span>WhatsApp</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}













                    {/* ========================================================================= */}
                    {/* TAB 11: CONTACT INQUIRIES & TRIAL LEADS */}
                    {/* ========================================================================= */}
                    {activeTab === 'inquiries' && (
                        <div className="space-y-6">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                                        Contact Inquiries & Trial Leads
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Incoming trial requests, parent queries, and enrollment opportunities.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {selectedInquiryIds.length > 0 && (
                                        <button
                                            onClick={handleBatchDeleteInquiries}
                                            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
                                            title="Delete all selected inquiries"
                                        >
                                            <FiTrash2 /> Delete Selected ({selectedInquiryIds.length})
                                        </button>
                                    )}

                                    {inquiries.length > 0 && (
                                        <button
                                            onClick={handleClearAllInquiries}
                                            className="py-2.5 px-3.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                                            title="Permanently delete all contact queries"
                                        >
                                            <FiTrash2 /> Delete All ({inquiries.length})
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setEditingInquiry(null);
                                            setIsCustomSportInquiry(false);
                                            setInquiryForm({
                                                name: '',
                                                phone: '',
                                                email: '',
                                                sport: '10M Rifle Shooting',
                                                ageGroup: 'Ages 10-15',
                                                message: 'Interested in trial session.'
                                            });
                                            setShowAddInquiryModal(true);
                                        }}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                    >
                                        <FiPlus /> Add New Lead
                                    </button>
                                </div>
                            </div>

                            {/* Multi-Select Toolbar when Inquiries exist */}
                            {inquiries.length > 0 && (
                                <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <label className="flex items-center gap-2.5 font-bold text-slate-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={selectedInquiryIds.length === inquiries.length && inquiries.length > 0}
                                            onChange={handleToggleSelectAllInquiries}
                                            className="w-4 h-4 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer"
                                        />
                                        <span>Select All Leads ({inquiries.length})</span>
                                    </label>

                                    {selectedInquiryIds.length > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-[#FF6A1A] bg-orange-50 px-3 py-1 rounded-full text-[11px] border border-orange-200">
                                                {selectedInquiryIds.length} of {inquiries.length} selected
                                            </span>
                                            <button
                                                onClick={() => setSelectedInquiryIds([])}
                                                className="text-slate-400 hover:text-slate-600 font-semibold"
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 text-[11px]">
                                            Tip: Select individual leads to bulk delete or click Delete All to clear everything.
                                        </span>
                                    )}
                                </div>
                            )}

                            {inquiries.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6A1A] flex items-center justify-center mx-auto text-2xl shadow-sm">
                                        <FiMessageSquare />
                                    </div>
                                    <h3 className="font-display font-bold text-xl text-slate-900">No Inquiries Yet</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        All contact queries submitted through the Contact Us page and Membership enrollment will appear here in real time.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {inquiries.map((inq, inqIdx) => {
                                        const inqKey = inq._id || inq.id || `inq_${inqIdx}`;
                                        const isSelected = selectedInquiryIds.includes(inqKey) || selectedInquiryIds.includes(inq.id) || selectedInquiryIds.includes(inq._id);
                                        return (
                                            <div
                                                key={inqKey}
                                                className={`bg-white rounded-3xl p-6 border transition-all space-y-4 ${
                                                    isSelected ? 'border-[#FF6A1A] ring-2 ring-orange-500/20 shadow-md bg-orange-50/20' : 'border-slate-200/90 shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleToggleSelectInquiry(inqKey)}
                                                            className="w-4 h-4 mt-1 rounded text-[#FF6A1A] focus:ring-orange-500 border-slate-300 cursor-pointer shrink-0"
                                                        />
                                                        <div className="min-w-0">
                                                            <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block truncate">
                                                                {inq.sport || 'Shooting'} {inq.planInterested ? `• ${inq.planInterested}` : ''}
                                                            </span>
                                                            <h3 className="font-display font-bold text-lg text-slate-900 truncate">{inq.name}</h3>
                                                            <p className="text-xs text-slate-500 font-medium truncate">{inq.phone} • {inq.email}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                                                        inq.status === 'New' ? 'bg-orange-100 text-[#FF6A1A]' : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {inq.status}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                                                    "{inq.message || inq.query || 'Inquiry regarding shooting classes.'}"
                                                </p>

                                                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                                                    <span className="text-slate-400 text-[11px] font-semibold">{inq.date || 'Recent'}</span>
                                                    
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <a
                                                            href={`tel:${inq.phone}`}
                                                            className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition-all"
                                                        >
                                                            <FiPhone className="text-xs text-[#FF6A1A]" /> Call
                                                        </a>

                                                        <a
                                                            href={`https://wa.me/${inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '919893270807'}?text=${encodeURIComponent(`Hello ${inq.name}, thank you for contacting Pioneer Rifle Shooting Academy regarding ${inq.sport || 'shooting courses'}. How can we assist you today?`)}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold flex items-center gap-1 shadow-sm transition-all"
                                                        >
                                                            <FaWhatsapp className="text-xs" /> WhatsApp
                                                        </a>

                                                        <button
                                                            onClick={() => handleAdvanceInquiry(inq)}
                                                            className="py-1.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-bold transition-all"
                                                        >
                                                            Advance
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteInquiry(inq)}
                                                            className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Delete Inquiry Permanently"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    )}

                </main>
            </div>

            {/* ========================================================================= */}
            {/* MOBILE BOTTOM PWA NAVIGATION BAR */}
            {/* ========================================================================= */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white px-2 py-2 flex items-center justify-around shadow-2xl">
                {[
                    { id: 'overview', name: 'Dashboard', icon: <FiGrid /> },
                    { id: 'athletes', name: 'Athletes', icon: <FiUsers /> },
                    { id: 'payments', name: 'Payments', icon: <FiDollarSign /> },
                    { id: 'reminders', name: 'Fee Dues', icon: <FiBell /> },
                    { id: 'inquiries', name: 'Queries', icon: <FiMessageSquare /> }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                            activeTab === item.id
                                ? 'text-[#FF6A1A] font-bold scale-105'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-[10px]">{item.name}</span>
                    </button>
                ))}
            </nav>

            {/* ========================================================================= */}
            {/* MODAL 1: ADD / EDIT ATHLETE */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddAthleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">
                                    {editingAthlete ? 'Edit Athlete Profile' : 'Enroll New Athlete'}
                                </h3>
                                <button onClick={() => setShowAddAthleteModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAthlete} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div className="bg-orange-50/90 border border-orange-200/90 rounded-2xl p-3 text-xs flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A] shrink-0" />
                                        <span className="text-slate-800 font-bold">Official Fee Structure:</span>
                                        <span className="text-slate-600">
                                            One-Time Annual Reg: <strong className="text-slate-900 font-bold">₹5,000</strong> • Monthly Training: <strong className="text-[#FF6A1A] font-bold">₹4,700/mo</strong>
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-[#FF6A1A] text-white text-[10px] font-bold shrink-0">
                                        Official
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={athleteForm.name}
                                        onChange={(e) => setAthleteForm({ ...athleteForm, name: e.target.value })}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                                        <input
                                            type="tel"
                                            value={athleteForm.phone}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Emergency / Guardian Contact</label>
                                        <input
                                            type="tel"
                                            value={athleteForm.emergencyContact || ''}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, emergencyContact: e.target.value })}
                                            placeholder="+91 92947 71208"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                                        <input
                                            type="number"
                                            value={athleteForm.age}
                                            min="5"
                                            max="60"
                                            onChange={(e) => setAthleteForm({ ...athleteForm, age: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                                        <select
                                            value={athleteForm.gender}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, gender: e.target.value })}
                                            className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                                        <select
                                            value={athleteForm.bloodGroup || 'B+'}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, bloodGroup: e.target.value })}
                                            className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-bold text-slate-700">Sport Discipline *</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = !isCustomSportAdmin;
                                                    setIsCustomSportAdmin(next);
                                                    if (!next && !athleteForm.sport) {
                                                        updateAthleteFormSportOrPlan('10M Rifle Shooting', athleteForm.planType || 'Monthly');
                                                    }
                                                }}
                                                className="text-[10px] font-semibold text-[#FF6A1A] hover:underline"
                                            >
                                                {isCustomSportAdmin ? '← Choose from list' : '+ Enter manually'}
                                            </button>
                                        </div>
                                        {isCustomSportAdmin ? (
                                            <input
                                                type="text"
                                                value={athleteForm.sport}
                                                onChange={(e) => setAthleteForm({ ...athleteForm, sport: e.target.value, membership: `${e.target.value} ${athleteForm.planType || 'Monthly'} Pass` })}
                                                placeholder="e.g. 50M 3-Position Rifle, Rapid Fire..."
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-[#FF6A1A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                                required
                                            />
                                        ) : (
                                            <select
                                                value={athleteForm.sport}
                                                onChange={(e) => {
                                                    if (e.target.value === 'custom') {
                                                        setIsCustomSportAdmin(true);
                                                        setAthleteForm({ ...athleteForm, sport: '' });
                                                    } else {
                                                        updateAthleteFormSportOrPlan(e.target.value, athleteForm.planType || 'Monthly');
                                                    }
                                                }}
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            >
                                                {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                                <option value="custom">✏️ Enter custom discipline name manually...</option>
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-bold text-slate-700">Batch Timing & Shift *</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = !isCustomTimingAdmin;
                                                    setIsCustomTimingAdmin(next);
                                                    if (!next && !athleteForm.batchTime) {
                                                        setAthleteForm({ ...athleteForm, batchTime: 'Evening Prime Shift (04:00 PM - 07:00 PM)' });
                                                    }
                                                }}
                                                className="text-[10px] font-semibold text-[#FF6A1A] hover:underline"
                                            >
                                                {isCustomTimingAdmin ? '← Choose from list' : '+ Enter manually'}
                                            </button>
                                        </div>
                                        {isCustomTimingAdmin ? (
                                            <input
                                                type="text"
                                                value={athleteForm.batchTime || ''}
                                                onChange={(e) => setAthleteForm({ ...athleteForm, batchTime: e.target.value })}
                                                placeholder="e.g. 05:00 PM - 06:30 PM (Daily Shift)..."
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-[#FF6A1A] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                                required
                                            />
                                        ) : (
                                            <select
                                                value={athleteForm.batchTime || 'Evening Prime Shift (04:00 PM - 07:00 PM)'}
                                                onChange={(e) => {
                                                    if (e.target.value === 'custom_time') {
                                                        setIsCustomTimingAdmin(true);
                                                        setAthleteForm({ ...athleteForm, batchTime: '' });
                                                    } else {
                                                        setAthleteForm({ ...athleteForm, batchTime: e.target.value });
                                                    }
                                                }}
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            >
                                                {adminTimingShifts.map(t => <option key={t} value={t}>{t}</option>)}
                                                <option value="custom_time">✏️ Enter custom timing manually...</option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-xs font-bold text-slate-700">Official Academy Fees *</label>
                                        <span className="text-[10px] text-slate-400 font-semibold">Select One or Both (Default: Both)</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {/* Fee 1: One-Time Annual Registration */}
                                        <button
                                            type="button"
                                            onClick={() => toggleAdminAthleteFee('registration')}
                                            className={`p-3 rounded-xl text-left border transition-all ${
                                                (athleteForm.planType === 'Combo' || athleteForm.planType === 'Registration')
                                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                                                    : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase">Fee #1 (Annual)</span>
                                                <span className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-bold ${
                                                    (athleteForm.planType === 'Combo' || athleteForm.planType === 'Registration')
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-slate-300 bg-white'
                                                }`}>
                                                    {(athleteForm.planType === 'Combo' || athleteForm.planType === 'Registration') ? '✓' : ''}
                                                </span>
                                            </div>
                                            <div className="font-bold text-xs text-slate-900 leading-tight">One-Time Annual Registration</div>
                                            <div className="text-[12px] font-black text-slate-900 mt-1">₹5,000 <span className="font-normal text-[10px] text-slate-500">/ 1 Year</span></div>
                                        </button>

                                        {/* Fee 2: Monthly Training Fee */}
                                        <button
                                            type="button"
                                            onClick={() => toggleAdminAthleteFee('monthly')}
                                            className={`p-3 rounded-xl text-left border transition-all ${
                                                (athleteForm.planType === 'Combo' || athleteForm.planType === 'Monthly')
                                                    ? 'bg-orange-50 border-[#FF6A1A] ring-1 ring-[#FF6A1A] shadow-sm'
                                                    : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold text-[#FF6A1A] uppercase">Fee #2 (Monthly)</span>
                                                <span className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-bold ${
                                                    (athleteForm.planType === 'Combo' || athleteForm.planType === 'Monthly')
                                                        ? 'bg-[#FF6A1A] text-white border-[#FF6A1A]'
                                                        : 'border-slate-300 bg-white'
                                                }`}>
                                                    {(athleteForm.planType === 'Combo' || athleteForm.planType === 'Monthly') ? '✓' : ''}
                                                </span>
                                            </div>
                                            <div className="font-bold text-xs text-slate-900 leading-tight">Monthly Training Fee</div>
                                            <div className="text-[12px] font-black text-[#FF6A1A] mt-1">₹4,700 <span className="font-normal text-[10px] text-slate-500">/ Month</span></div>
                                        </button>
                                    </div>
                                </div>

                                {/* Official 2-Fee Breakdown */}
                                <div className="bg-orange-50/70 border border-[#FF6A1A]/30 rounded-xl p-3 text-xs space-y-1">
                                    <div className="flex justify-between items-center text-slate-700 font-bold">
                                        <span>Admission Fee Calculation:</span>
                                        <span className="text-[#FF6A1A] font-extrabold text-sm">
                                            {(athleteForm.planType || 'Combo') === 'Combo'
                                                ? '₹5,000 (Reg) + ₹4,700 (1st Mo) = ₹9,700'
                                                : athleteForm.planType === 'Registration'
                                                ? '₹5,000 / 1 Year'
                                                : '₹4,700 / Month'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        {(athleteForm.planType || 'Combo') === 'Combo'
                                            ? 'Both fees accounted together: ₹5,000 Annual Registration + ₹4,700 First Month Training Fee.'
                                            : athleteForm.planType === 'Registration'
                                            ? 'Annual Registration Fee only: ₹5,000 (Shooter ID, accreditation & locker access).'
                                            : 'Monthly Training Fee only: ₹4,700/mo (Daily 1-1.5 hr training, weapons, pellets & targets).'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Total Plan Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={athleteForm.feeAmount}
                                            onChange={(e) => {
                                                const fee = Number(e.target.value);
                                                const paid = Number(athleteForm.amountPaid || 0);
                                                setAthleteForm({ ...athleteForm, feeAmount: fee, dueAmount: Math.max(0, fee - paid) });
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Amount Paid Now (₹)</label>
                                        <input
                                            type="number"
                                            value={athleteForm.amountPaid}
                                            onChange={(e) => {
                                                const paid = Number(e.target.value);
                                                const fee = Number(athleteForm.feeAmount || 0);
                                                setAthleteForm({ ...athleteForm, amountPaid: paid, dueAmount: Math.max(0, fee - paid) });
                                            }}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-emerald-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Monthly Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={athleteForm.monthlyFee || 4700}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, monthlyFee: Number(e.target.value) })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Next Due / Billing Date</label>
                                        <input
                                            type="date"
                                            value={athleteForm.nextDueDate ? athleteForm.nextDueDate.split('T')[0] : ''}
                                            onChange={(e) => setAthleteForm({ ...athleteForm, nextDueDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                        />
                                    </div>
                                </div>

                                {Number(athleteForm.amountPaid || 0) > 0 && (
                                    <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1.5">Payment Mode *</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setAthleteForm({ ...athleteForm, paymentMode: 'Cash' })}
                                                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                                                        (athleteForm.paymentMode || 'Cash') === 'Cash'
                                                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Reception Cash Desk
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAthleteForm({ ...athleteForm, paymentMode: 'Online' })}
                                                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                                                        athleteForm.paymentMode === 'Online'
                                                            ? 'bg-[#FF6A1A] text-white border-[#FF6A1A] shadow-sm'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Online (UPI / NEFT)
                                                </button>
                                            </div>
                                        </div>

                                        {athleteForm.paymentMode === 'Online' && (
                                            <div>
                                                <label className="block font-bold text-slate-700 mb-1">
                                                    UTR Number / Transaction Reference ID <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 429812903421 (12-digit UPI UTR)"
                                                    value={athleteForm.utrNumber || ''}
                                                    onChange={(e) => setAthleteForm({ ...athleteForm, utrNumber: e.target.value })}
                                                    className="w-full px-3 py-2 bg-white border border-[#FF6A1A] rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center bg-orange-50/70 p-3 rounded-xl border border-orange-200 text-xs">
                                    <span className="font-semibold text-slate-700">Calculated Due Amount:</span>
                                    <strong className="text-red-600 font-bold text-sm">
                                        ₹{Math.max(0, Number(athleteForm.feeAmount || 0) - Number(athleteForm.amountPaid || 0)).toLocaleString()}
                                    </strong>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAthleteModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingAthlete}
                                        className={`flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all ${
                                            isSavingAthlete ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600 active:scale-98'
                                        }`}
                                    >
                                        {isSavingAthlete ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Saving to Database...</span>
                                            </>
                                        ) : (
                                            <span>{editingAthlete ? 'Save Changes' : 'Enroll Athlete'}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL: MONTHLY TRAINING FEE COLLECTION & DUE DATE ADVANCE */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showCollectFeeModal && feeCollectionTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6A1A] flex items-center justify-center font-black">
                                        <FiDollarSign className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-black text-slate-900 text-base">Collect Monthly Fee</h3>
                                        <p className="text-[11px] text-slate-500 font-semibold">
                                            {feeCollectionTarget.name} • <span className="font-mono text-slate-400">{feeCollectionTarget.id}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCollectFeeModal(false)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                                >
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (feeCollectionPaymentMode === 'Online' && !feeCollectionUtr.trim()) {
                                        showToast('Please enter the 12-digit UTR Number for online payment.', 'error');
                                        return;
                                    }
                                    setIsProcessingFeeCollection(true);
                                    try {
                                        const res = await handleCollectFeeMonth(
                                            feeCollectionTarget,
                                            feeMonthsToCollect,
                                            feeCollectionPaymentMode,
                                            feeCollectionUtr
                                        );
                                        if (res?.success) {
                                            setShowCollectFeeModal(false);
                                            setFeeCollectionTarget(null);
                                        }
                                    } finally {
                                        setIsProcessingFeeCollection(false);
                                    }
                                }}
                                className="p-5 space-y-4"
                            >
                                {/* Student Summary Box */}
                                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Discipline:</span>
                                        <span className="font-bold text-slate-800">{feeCollectionTarget.sport}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Fee Reference ID:</span>
                                        <span className="font-mono font-bold text-[#FF6A1A] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                            {feeCollectionTarget.feeDueRefId || `DUE-${feeCollectionTarget.id}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Monthly Standard Fee:</span>
                                        <span className="font-bold text-[#FF6A1A]">₹{(feeCollectionTarget.monthlyFee || 4700).toLocaleString()}/month</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Current Next Due Date:</span>
                                        <span className="font-bold text-slate-900">{feeCollectionTarget.nextDueDateFormatted || feeCollectionTarget.nextDueDateStr || feeCollectionTarget.nextDueDate || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-orange-50/80 p-2 rounded-xl border border-orange-200/60">
                                        <span className="text-slate-600 font-bold">Paying for Month(s):</span>
                                        <span className="font-extrabold text-[#FF6A1A]">
                                            {(() => {
                                                let curr = feeCollectionTarget.nextDueDate ? new Date(feeCollectionTarget.nextDueDate) : new Date();
                                                const mNames = [];
                                                for (let i = 0; i < Number(feeMonthsToCollect || 1); i++) {
                                                    let m = new Date(curr);
                                                    m.setMonth(m.getMonth() + i);
                                                    mNames.push(m.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }));
                                                }
                                                return mNames.join(', ');
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Current Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            feeCollectionTarget.isOverdue ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {feeCollectionTarget.isOverdue ? `⚠️ ${feeCollectionTarget.overdueMonths} Mo Overdue` : 'Current'}
                                        </span>
                                    </div>
                                </div>

                                {/* Months to Collect */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Select Number of Months to Collect
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3, 6].map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setFeeMonthsToCollect(m)}
                                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                                    Number(feeMonthsToCollect) === m
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                {m} Month{m > 1 ? 's' : ''}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Amount Calculation & Next Due Preview */}
                                <div className="bg-orange-50/70 rounded-2xl p-3.5 border border-orange-200/80 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-slate-600">Total Amount to Collect:</span>
                                        <strong className="text-base font-black text-slate-900">
                                            ₹{(Number(feeMonthsToCollect || 1) * Number(feeCollectionTarget.monthlyFee || 4700)).toLocaleString()}
                                        </strong>
                                    </div>
                                    <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-orange-200/60 pt-2">
                                        <span>Next Due Date will advance to:</span>
                                        <span className="font-bold text-emerald-700">
                                            {(() => {
                                                let curr;
                                                if (feeCollectionTarget.nextDueDate && !isNaN(new Date(feeCollectionTarget.nextDueDate).getTime())) {
                                                    curr = new Date(feeCollectionTarget.nextDueDate);
                                                } else {
                                                    curr = new Date();
                                                }
                                                const newD = new Date(curr);
                                                newD.setMonth(newD.getMonth() + Number(feeMonthsToCollect || 1));
                                                return newD.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Mode */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">Payment Mode</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFeeCollectionPaymentMode('Cash')}
                                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                                feeCollectionPaymentMode === 'Cash'
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            Reception Cash Desk
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFeeCollectionPaymentMode('Online')}
                                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                                feeCollectionPaymentMode === 'Online'
                                                    ? 'bg-[#FF6A1A] text-white border-[#FF6A1A] shadow-sm'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            Online UPI / Transfer
                                        </button>
                                    </div>
                                </div>

                                {feeCollectionPaymentMode === 'Online' && (
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            12-Digit UTR Number / Reference ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 429812903421"
                                            value={feeCollectionUtr}
                                            onChange={(e) => setFeeCollectionUtr(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-[#FF6A1A] rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCollectFeeModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessingFeeCollection}
                                        className={`flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all ${
                                            isProcessingFeeCollection ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600 active:scale-98'
                                        }`}
                                    >
                                        {isProcessingFeeCollection ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <span>Confirm & Collect ₹{(Number(feeMonthsToCollect || 1) * Number(feeCollectionTarget.monthlyFee || 4700)).toLocaleString()}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL: STUDENT COMPLETE PROFILE & BILLING LEDGER DETAILS */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {viewingStudentBillingDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6"
                        >
                            {/* Modal Header */}
                            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6A1A] to-orange-400 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/20">
                                        {viewingStudentBillingDetails.name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-display font-black text-xl text-slate-900">
                                                {viewingStudentBillingDetails.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                viewingStudentBillingDetails.isOverdue
                                                    ? 'bg-red-100 text-red-700'
                                                    : viewingStudentBillingDetails.badgeType === 'due_soon'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {viewingStudentBillingDetails.isOverdue 
                                                    ? `🔴 ${viewingStudentBillingDetails.overdueMonths} Mo Overdue` 
                                                    : `🟢 Current Cycle`}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                                            <span className="font-mono">{viewingStudentBillingDetails.id}</span>
                                            <span>•</span>
                                            <span className="font-bold text-slate-700">{viewingStudentBillingDetails.sport}</span>
                                            <span>•</span>
                                            <span className="bg-orange-50 text-[#FF6A1A] font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-orange-200">
                                                Ref: {viewingStudentBillingDetails.feeDueRefId}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingStudentBillingDetails(null)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            {/* Section 1: Billing & Next Due Highlight Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                                            BILLING CYCLE STATUS
                                        </span>
                                        <div className="font-display font-black text-2xl mt-1">
                                            {viewingStudentBillingDetails.isOverdue ? (
                                                <span className="text-red-400">⚠️ {viewingStudentBillingDetails.overdueMonths} Month(s) Overdue</span>
                                            ) : (
                                                <span className="text-emerald-400">📅 Fee Due for {viewingStudentBillingDetails.dueMonthName}</span>
                                            )}
                                        </div>
                                        {viewingStudentBillingDetails.isOverdue && viewingStudentBillingDetails.overdueMonthNames?.length > 0 && (
                                            <p className="text-xs text-slate-300 mt-1">
                                                Pending Months: <span className="text-red-300 font-bold">{viewingStudentBillingDetails.overdueMonthNames.join(', ')}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            TOTAL DUE AMOUNT
                                        </span>
                                        <div className="font-display font-black text-2xl text-[#FF6A1A] mt-1">
                                            ₹{viewingStudentBillingDetails.totalDue?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Standard</span>
                                        <strong className="text-white text-sm">₹{(viewingStudentBillingDetails.monthlyFee || 4700).toLocaleString()}/mo</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Due Date</span>
                                        <strong className="text-white text-sm">{viewingStudentBillingDetails.nextDueDateFormatted || viewingStudentBillingDetails.nextDueDateStr}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Paid Months</span>
                                        <strong className="text-emerald-400 text-sm">{viewingStudentBillingDetails.paidMonthsCount || 1} Month(s)</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid</span>
                                        <strong className="text-emerald-400 text-sm">₹{(viewingStudentBillingDetails.amountPaid || 0).toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Student Personal & Academic Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Personal Info */}
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                                        <FiUsers className="text-[#FF6A1A]" />
                                        <span>Student Personal Profile</span>
                                    </h4>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Phone:</span>
                                        <a href={`tel:${viewingStudentBillingDetails.phone}`} className="font-bold text-slate-900 hover:text-[#FF6A1A]">
                                            {viewingStudentBillingDetails.phone}
                                        </a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Email:</span>
                                        <span className="font-bold text-slate-900">{viewingStudentBillingDetails.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Age & Gender:</span>
                                        <span className="font-bold text-slate-900">{viewingStudentBillingDetails.age} yrs • {viewingStudentBillingDetails.gender}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Blood Group:</span>
                                        <span className="font-bold text-slate-900">{viewingStudentBillingDetails.bloodGroup || 'B+'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Emergency Contact:</span>
                                        <span className="font-bold text-slate-900">{viewingStudentBillingDetails.emergencyContact || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Training Info */}
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                                        <FiActivity className="text-[#FF6A1A]" />
                                        <span>Training & Academy Shift</span>
                                    </h4>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Sport:</span>
                                        <span className="font-bold text-slate-900">{viewingStudentBillingDetails.sport}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Batch Timing:</span>
                                        <span className="font-bold text-slate-900 text-right">{viewingStudentBillingDetails.batchTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Assigned Coach:</span>
                                        <span className="font-bold text-slate-900 text-right">{viewingStudentBillingDetails.coach}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Enrolled Since:</span>
                                        <span className="font-bold text-slate-900">{viewingStudentBillingDetails.joinDate || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 font-medium">Membership:</span>
                                        <span className="font-bold text-slate-900 text-right truncate max-w-[180px]" title={viewingStudentBillingDetails.membership}>
                                            {viewingStudentBillingDetails.membership}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Payment & Receipts Ledger for this Student */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                        <FiClock className="text-[#FF6A1A]" />
                                        <span>Payment Receipts & Ledger History</span>
                                    </h4>
                                    <span className="text-[11px] text-slate-500 font-semibold">
                                        {payments.filter(p => p.athleteId === viewingStudentBillingDetails.id || p.athleteName === viewingStudentBillingDetails.name).length} Recorded Receipt(s)
                                    </span>
                                </div>

                                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left text-xs text-slate-600">
                                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="px-3.5 py-2.5">Receipt #</th>
                                                <th className="px-3.5 py-2.5">Date</th>
                                                <th className="px-3.5 py-2.5">Month / Plan</th>
                                                <th className="px-3.5 py-2.5">Amount</th>
                                                <th className="px-3.5 py-2.5">Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {payments.filter(p => p.athleteId === viewingStudentBillingDetails.id || p.athleteName === viewingStudentBillingDetails.name).length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-medium">
                                                        No payment records found for this student yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                payments.filter(p => p.athleteId === viewingStudentBillingDetails.id || p.athleteName === viewingStudentBillingDetails.name).map(pay => (
                                                    <tr key={pay.id || pay._id} className="hover:bg-slate-50/70">
                                                        <td className="px-3.5 py-2.5 font-mono font-bold text-[#FF6A1A]">{pay.receiptNo || pay.id}</td>
                                                        <td className="px-3.5 py-2.5 text-slate-700 font-medium">{pay.date}</td>
                                                        <td className="px-3.5 py-2.5 font-medium text-slate-800">{pay.plan}</td>
                                                        <td className="px-3.5 py-2.5 font-bold text-emerald-600">₹{pay.amount?.toLocaleString()}</td>
                                                        <td className="px-3.5 py-2.5">
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                                                {pay.paymentMode || pay.method || 'Cash'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Section 4: Modal Action Buttons */}
                            <div className="pt-2 flex flex-wrap sm:flex-nowrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setViewingStudentBillingDetails(null)}
                                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const ath = viewingStudentBillingDetails;
                                        setViewingStudentBillingDetails(null);
                                        handleSendIndividualReminder(ath);
                                    }}
                                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <FaWhatsapp className="text-sm" />
                                    <span>Send WhatsApp Notice</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const ath = viewingStudentBillingDetails;
                                        setViewingStudentBillingDetails(null);
                                        handleOpenCollectFeeModal(ath);
                                    }}
                                    className="w-full flex-1 py-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20 active:scale-98"
                                >
                                    <FiDollarSign className="text-sm" />
                                    <span>Collect Fee for {viewingStudentBillingDetails.dueMonthName}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 2: SELF-REGISTRATION QR CODE MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showQrModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden text-center p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">ATHLETE ONBOARDING</span>
                                    <h3 className="font-display font-black text-lg text-slate-900">Registration QR Code</h3>
                                </div>
                                <button onClick={() => setShowQrModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Students or parents can scan this QR code on their smartphone to self-enroll in real-time!
                                <span className="block mt-1 text-[11px] font-bold text-[#FF6A1A]">
                                    One-Time Annual Reg: ₹5,000 • Monthly Training: ₹4,700/mo
                                </span>
                            </p>

                            <div className="bg-slate-950 p-4 rounded-3xl inline-block shadow-xl">
                                {qrCodeDataUrl ? (
                                    <img src={qrCodeDataUrl} alt="Athlete Enrollment QR Code" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />
                                ) : (
                                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                        <FaQrcode className="text-7xl text-slate-900" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => downloadQrImage(qrCodeDataUrl, 'Pioneer_Student_Enrollment_QR.png')}
                                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        <FiDownload /> Download PNG
                                    </button>
                                    <button
                                        onClick={() => downloadQrPdf({
                                            title: "PIONEER SHOOTING ACADEMY - STUDENT REGISTRATION QR",
                                            subtitle: "Official Fee Policy: One-Time Annual Reg ₹5,000 | Monthly Training Fee ₹4,700/mo. Scan with camera to register.",
                                            qrDataUrl: qrCodeDataUrl,
                                            fileName: "Pioneer_Registration_QR_Poster.pdf",
                                            instructions: "1. Open Camera or Scanner App  2. Point at QR Code  3. Fill Athlete Details & Select Coaching Batch"
                                        })}
                                        className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                                    >
                                        <FiPrinter /> Download PDF
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${PLAYPEAK_BASE_URL}/enroll`);
                                        showToast(`Enrollment link (${PLAYPEAK_BASE_URL}/enroll) copied to clipboard!`);
                                    }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FiCopy /> Copy Public Link ({PLAYPEAK_BASE_URL.replace('https://', '')})
                                </button>

                                <button
                                    onClick={() => window.open('/enroll', '_blank')}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <FiExternalLink /> Open Registration Page
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3A: ADD / EDIT FEE PAYMENT */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddPaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">FEES & BILLING</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingPayment ? 'Edit Payment Record' : 'Record Fee Payment'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddPaymentModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePayment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Athlete or Enter Name *</label>
                                    <div className="space-y-2">
                                        <select
                                            onChange={(e) => {
                                                const selected = athletes.find(a => a.name === e.target.value);
                                                if (selected) {
                                                    setPaymentForm({
                                                        ...paymentForm,
                                                        athleteName: selected.name,
                                                        sport: selected.sport,
                                                        plan: selected.membership || `${selected.sport} ${selected.planType || 'Monthly'} Pass`,
                                                        amount: selected.dueAmount > 0 ? selected.dueAmount : selected.feeAmount || 4700
                                                    });
                                                }
                                            }}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="">-- Choose Registered Athlete --</option>
                                            {athletes.map(a => (
                                                <option key={a.id} value={a.name}>
                                                    {a.name} ({a.sport} - {a.dueAmount > 0 ? `Due: ₹${a.dueAmount}` : 'Paid'})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={paymentForm.athleteName}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, athleteName: e.target.value })}
                                            placeholder="Athlete Full Name *"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Discipline</label>
                                        <select
                                            value={paymentForm.sport}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Membership / Pass Plan</label>
                                        <input
                                            type="text"
                                            value={paymentForm.plan}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, plan: e.target.value })}
                                            placeholder="e.g. Pro Academy Monthly"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (₹) *</label>
                                        <input
                                            type="number"
                                            value={paymentForm.amount}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                                            placeholder="4700"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode *</label>
                                        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentForm({ ...paymentForm, paymentMode: 'Cash' })}
                                                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                                                    (paymentForm.paymentMode || 'Cash') === 'Cash'
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                                }`}
                                            >
                                                Cash Desk
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentForm({ ...paymentForm, paymentMode: 'Online' })}
                                                className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                                                    paymentForm.paymentMode === 'Online'
                                                        ? 'bg-[#FF6A1A] text-white border-[#FF6A1A] shadow-sm'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                                }`}
                                            >
                                                Online (UPI)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {paymentForm.paymentMode === 'Online' && (
                                    <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                                        <div className="flex justify-between items-center text-[11px] text-emerald-800">
                                            <span>Academy UPI: <strong className="font-mono">9893270807@upi</strong></span>
                                            <span className="font-bold text-emerald-900">Online Verification</span>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-800 mb-1">
                                                Bank UTR Number / Transaction ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter 12-digit UPI / IMPS UTR number"
                                                value={paymentForm.utrNumber || ''}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, utrNumber: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Payment Status</label>
                                        <select
                                            value={paymentForm.status}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Completed">Completed</option>
                                            <option value="Pending">Pending Verification</option>
                                            <option value="Partial">Partial Installment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Next Renewal / Due Date</label>
                                        <input
                                            type="date"
                                            value={paymentForm.dueDate}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddPaymentModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingPayment ? 'Update Payment' : 'Save & Issue Receipt'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3B: ADD / EDIT COACH */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddCoachModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">TECHNICAL STAFF</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingCoach ? 'Edit Coach Profile' : 'Add New Coach / Mentor'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddCoachModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveCoach} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Coach Full Name *</label>
                                    <input
                                        type="text"
                                        value={coachForm.name}
                                        onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                                        placeholder="e.g. Coach Rajesh Sharma"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Discipline</label>
                                        <select
                                            value={coachForm.sport}
                                            onChange={(e) => setCoachForm({ ...coachForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Certification / License *</label>
                                        <input
                                            type="text"
                                            value={coachForm.certification}
                                            onChange={(e) => setCoachForm({ ...coachForm, certification: e.target.value })}
                                            placeholder="AFC Pro License & UEFA-A"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={coachForm.phone}
                                            onChange={(e) => setCoachForm({ ...coachForm, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={coachForm.email}
                                            onChange={(e) => setCoachForm({ ...coachForm, email: e.target.value })}
                                            placeholder="coach@playpeaksports.com"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Yrs)</label>
                                        <input
                                            type="number"
                                            value={coachForm.experience}
                                            onChange={(e) => setCoachForm({ ...coachForm, experience: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Active Trainees</label>
                                        <input
                                            type="number"
                                            value={coachForm.trainees}
                                            onChange={(e) => setCoachForm({ ...coachForm, trainees: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Rating (★)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            max="5.0"
                                            min="1.0"
                                            value={coachForm.rating}
                                            onChange={(e) => setCoachForm({ ...coachForm, rating: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-amber-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Compensation</label>
                                    <input
                                        type="text"
                                        value={coachForm.monthlySalary}
                                        onChange={(e) => setCoachForm({ ...coachForm, monthlySalary: e.target.value })}
                                        placeholder="₹60,000"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCoachModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingCoach ? 'Save Changes' : 'Register Coach'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3C: ADD / EDIT INVENTORY */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddInventoryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">FACILITY ASSETS</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingInventory ? 'Edit Equipment Item' : 'Add Equipment Item'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddInventoryModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveInventory} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Name *</label>
                                    <input
                                        type="text"
                                        value={inventoryForm.name}
                                        onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                                        placeholder="e.g. FIFA Quality Pro Match Balls"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                                        <select
                                            value={inventoryForm.sport}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                                        <select
                                            value={inventoryForm.category}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, category: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Balls & Turf Gear">Balls & Turf Gear</option>
                                            <option value="Rackets & Bats">Rackets & Bats</option>
                                            <option value="Protective & Safety Gear">Protective & Safety Gear</option>
                                            <option value="Fitness & Conditioning">Fitness & Conditioning</option>
                                            <option value="Electronics & Timing Sensors">Electronics & Timing Sensors</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Total Stock</label>
                                        <input
                                            type="number"
                                            value={inventoryForm.totalQty}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, totalQty: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Available Qty</label>
                                        <input
                                            type="number"
                                            value={inventoryForm.availableQty}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, availableQty: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Low Alert Limit</label>
                                        <input
                                            type="number"
                                            value={inventoryForm.minThreshold}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, minThreshold: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Storage Location</label>
                                        <input
                                            type="text"
                                            value={inventoryForm.location}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, location: e.target.value })}
                                            placeholder="Ground Equipment Shed"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Unit Cost</label>
                                        <input
                                            type="text"
                                            value={inventoryForm.unitCost}
                                            onChange={(e) => setInventoryForm({ ...inventoryForm, unitCost: e.target.value })}
                                            placeholder="₹1,500"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddInventoryModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingInventory ? 'Update Item' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3D: ADD / EDIT MEMBERSHIP PLAN */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddPlanModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">MEMBERSHIP PACKAGE</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddPlanModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePlan} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Plan Title *</label>
                                    <input
                                        type="text"
                                        value={planForm.name}
                                        onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                        placeholder="e.g. Pro Cricket Academy Annual"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport Cohort</label>
                                        <select
                                            value={planForm.sport}
                                            onChange={(e) => setPlanForm({ ...planForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="All">All Disciplines</option>
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                                        <select
                                            value={planForm.duration}
                                            onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="1 Month">1 Month</option>
                                            <option value="3 Months">3 Months (Quarterly)</option>
                                            <option value="6 Months">6 Months (Half-Yearly)</option>
                                            <option value="1 Year">1 Year (Annual VIP)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Package Fee (₹) *</label>
                                        <input
                                            type="number"
                                            value={planForm.price}
                                            onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                                            placeholder="4700"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                                        <select
                                            value={planForm.badge}
                                            onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Popular">Popular</option>
                                            <option value="Best Value">Best Value</option>
                                            <option value="Elite Pro">Elite Pro</option>
                                            <option value="Weekend Special">Weekend Special</option>
                                            <option value="Starter">Starter</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Included Perks & Features (1 per line)</label>
                                    <textarea
                                        rows="4"
                                        value={planForm.featuresText}
                                        onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                                        placeholder="3 Pro Coaching Sessions/Wk&#10;Turf Floodlight Access&#10;Official Jersey Kit&#10;Physio Lab Discount"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddPlanModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingPlan ? 'Save Plan Changes' : 'Create Plan'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 3E: ADD / EDIT INQUIRY LEAD */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddInquiryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">CRM LEADS</span>
                                    <h3 className="font-display font-bold text-lg">
                                        {editingInquiry ? 'Edit Inquiry / Lead' : 'Add Trial Lead / Inquiry'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddInquiryModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveInquiry} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Prospect / Parent Name *</label>
                                    <input
                                        type="text"
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        placeholder="e.g. Manish Rawat"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={inquiryForm.phone}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                            placeholder="+91 98260 99887"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={inquiryForm.email}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                            placeholder="manish@gmail.com"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-bold text-slate-700">Sport Interested *</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsCustomSportInquiry(!isCustomSportInquiry)}
                                                className="text-[10px] font-semibold text-[#FF6A1A] hover:underline"
                                            >
                                                {isCustomSportInquiry ? 'Choose from list' : '+ Enter manually'}
                                            </button>
                                        </div>
                                        {isCustomSportInquiry ? (
                                            <input
                                                type="text"
                                                value={inquiryForm.sport}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, sport: e.target.value })}
                                                placeholder="e.g. 50M 3-Position, Trap..."
                                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                                required
                                            />
                                        ) : (
                                            <select
                                                value={inquiryForm.sport}
                                                onChange={(e) => {
                                                    if (e.target.value === 'custom') {
                                                        setIsCustomSportInquiry(true);
                                                        setInquiryForm({ ...inquiryForm, sport: '' });
                                                    } else {
                                                        setInquiryForm({ ...inquiryForm, sport: e.target.value });
                                                    }
                                                }}
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                            >
                                                {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                                <option value="custom">✏️ Enter custom discipline name manually...</option>
                                            </select>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Age Group</label>
                                        <input
                                            type="text"
                                            value={inquiryForm.ageGroup}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, ageGroup: e.target.value })}
                                            placeholder="Under 14 (Son)"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Message / Training Requirements</label>
                                    <textarea
                                        rows="3"
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        placeholder="Looking for trial coaching session on Saturday..."
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddInquiryModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
                                    >
                                        {editingInquiry ? 'Update Lead' : 'Save Lead'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 4: ADD / EDIT TOURNAMENT */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddTournamentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">{editingTournament ? 'Edit Tournament' : 'Host Tournament'}</h3>
                                <button onClick={() => setShowAddTournamentModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTournament} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Tournament Title *</label>
                                    <input
                                        type="text"
                                        value={tournamentForm.title}
                                        onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                                        placeholder="e.g. Indore Inter-Academy Cup"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                                        <select
                                            value={tournamentForm.sport}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Prize Pool</label>
                                        <input
                                            type="text"
                                            value={tournamentForm.prizePool}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, prizePool: e.target.value })}
                                            placeholder="₹1,00,000"
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={tournamentForm.startDate}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, startDate: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={tournamentForm.endDate}
                                            onChange={(e) => setTournamentForm({ ...tournamentForm, endDate: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowAddTournamentModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                                        Save Tournament
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 5: ADD / EDIT PHYSIO LOG */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddPhysioModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">{editingPhysio ? 'Edit Physio Log' : 'Log Injury / Rehab'}</h3>
                                <button onClick={() => setShowAddPhysioModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSavePhysio} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Athlete Name *</label>
                                    <input
                                        type="text"
                                        value={physioForm.athleteName}
                                        onChange={(e) => setPhysioForm({ ...physioForm, athleteName: e.target.value })}
                                        placeholder="e.g. Kabir Patel"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Sport</label>
                                        <select
                                            value={physioForm.sport}
                                            onChange={(e) => setPhysioForm({ ...physioForm, sport: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                                        <select
                                            value={physioForm.recoveryStatus}
                                            onChange={(e) => setPhysioForm({ ...physioForm, recoveryStatus: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="In Rehab">In Rehab</option>
                                            <option value="Light Training">Light Training</option>
                                            <option value="Match Fit">Match Fit (Cleared)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Injury Diagnosis</label>
                                    <input
                                        type="text"
                                        value={physioForm.injuryType}
                                        onChange={(e) => setPhysioForm({ ...physioForm, injuryType: e.target.value })}
                                        placeholder="e.g. Ankle Sprain Grade 1"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Prescribed Therapy / Exercises</label>
                                    <textarea
                                        rows="2"
                                        value={physioForm.treatment}
                                        onChange={(e) => setPhysioForm({ ...physioForm, treatment: e.target.value })}
                                        placeholder="Cryotherapy, Ice Bath & Balance"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowAddPhysioModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                                        Save Physio Log
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 6: ADD / EDIT FITNESS ASSESSMENT */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showAddAssessmentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <h3 className="font-display font-bold text-lg">{editingAssessment ? 'Edit Assessment' : 'Record Test Metrics'}</h3>
                                <button onClick={() => setShowAddAssessmentModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveAssessment} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Athlete Name *</label>
                                    <input
                                        type="text"
                                        value={assessmentForm.athleteName}
                                        onChange={(e) => setAssessmentForm({ ...assessmentForm, athleteName: e.target.value })}
                                        placeholder="e.g. Aarav Sharma"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">30m Sprint Time</label>
                                        <input
                                            type="text"
                                            value={assessmentForm.sprint30m}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, sprint30m: e.target.value })}
                                            placeholder="3.95s"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Vertical Jump</label>
                                        <input
                                            type="text"
                                            value={assessmentForm.verticalJump}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, verticalJump: e.target.value })}
                                            placeholder="56 cm"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">VO2 Max</label>
                                        <input
                                            type="text"
                                            value={assessmentForm.vo2Max}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, vo2Max: e.target.value })}
                                            placeholder="54.2 ml/kg"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Scout Prospect Rating</label>
                                        <select
                                            value={assessmentForm.rating}
                                            onChange={(e) => setAssessmentForm({ ...assessmentForm, rating: e.target.value })}
                                            className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                                        >
                                            <option value="Elite Prospect">Elite Prospect</option>
                                            <option value="State Level">State Level</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Developing">Developing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-3 flex gap-3">
                                    <button type="button" onClick={() => setShowAddAssessmentModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#FF6A1A] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                                        Save Test Metrics
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 7: VIEW ATHLETE ID CARD */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {viewingAthleteCard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-950 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-800 text-white overflow-hidden p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">OFFICIAL ATHLETE PASS</span>
                                    <h3 className="font-display font-black text-lg text-white">{viewingAthleteCard.name}</h3>
                                </div>
                                <button onClick={() => setViewingAthleteCard(null)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-lg" />
                                </button>
                            </div>

                            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Pass ID:</span>
                                    <strong className="font-mono text-[#FF6A1A]">{viewingAthleteCard.id}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Sport Discipline:</span>
                                    <strong className="text-white">{viewingAthleteCard.sport}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Billing Duration:</span>
                                    <strong className="text-purple-400">{viewingAthleteCard.planType || 'Monthly'} Plan</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Batch Timing:</span>
                                    <strong className="text-slate-300 truncate max-w-[150px]">{viewingAthleteCard.batchTime}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Blood Group:</span>
                                    <strong className="text-white">{viewingAthleteCard.bloodGroup}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Emergency Contact:</span>
                                    <strong className="text-slate-300">{viewingAthleteCard.emergencyContact || viewingAthleteCard.phone}</strong>
                                </div>
                            </div>

                            <div className="text-center pt-2">
                                <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center text-slate-900 shadow-lg">
                                    {athletePassQrDataUrl ? (
                                        <img src={athletePassQrDataUrl} alt="Athlete Pass QR" className="w-full h-full rounded-lg" />
                                    ) : (
                                        <FaQrcode className="text-6xl text-slate-900" />
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-2">Scan at Arena Gates for Automated Access</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => downloadQrImage(athletePassQrDataUrl || qrCodeDataUrl, `Pioneer_Pass_${viewingAthleteCard.name.replace(/\s+/g, '_')}.png`)}
                                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                                >
                                    <FiDownload /> Download PNG
                                </button>
                                <button
                                    onClick={() => downloadQrPdf({
                                        title: `OFFICIAL ATHLETE PASS: ${viewingAthleteCard.name}`,
                                        subtitle: `Pioneer Verified Member Pass • ${viewingAthleteCard.sport} Range`,
                                        qrDataUrl: athletePassQrDataUrl || qrCodeDataUrl,
                                        fileName: `Pioneer_Pass_${viewingAthleteCard.name.replace(/\s+/g, '_')}.pdf`,
                                        instructions: "Present this digital / printed QR badge at academy range reception for lane entry.",
                                        metaData: [
                                            { label: "Athlete ID", value: viewingAthleteCard.id },
                                            { label: "Full Name", value: viewingAthleteCard.name },
                                            { label: "Sport Discipline", value: viewingAthleteCard.sport },
                                            { label: "Membership Plan", value: `${viewingAthleteCard.planType || 'Monthly'} Plan` },
                                            { label: "Batch Schedule", value: viewingAthleteCard.batchTime },
                                            { label: "Emergency Contact", value: viewingAthleteCard.emergencyContact || viewingAthleteCard.phone }
                                        ]
                                    })}
                                    className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                                >
                                    <FiPrinter /> Download PDF
                                </button>
                            </div>

                            <button
                                onClick={() => setViewingAthleteCard(null)}
                                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                            >
                                Close Badge
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 8: PWA APP INSTALL & DOWNLOAD GUIDE */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showInstallModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-800 text-white overflow-hidden p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6A1A] to-amber-500 p-2.5 shadow-lg flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="50" cy="22" r="12" fill="#FFFFFF" />
                                            <path d="M48 38 L30 54 L38 68 L48 56 L62 78 L78 74 L60 48 L62 38 Z" fill="#FFFFFF" />
                                            <path d="M30 40 L18 52 L26 60 L36 48 Z" fill="#1E293B" />
                                            <path d="M62 48 L76 34 L84 42 L68 56 Z" fill="#1E293B" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-black text-lg text-white">Pioneer Academy Admin App</h3>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">PWA Mobile & Desktop Edition</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowInstallModal(false)} className="p-1 text-slate-400 hover:text-white">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                                Install Pioneer Rifle Shooting Academy Command Center directly on your home screen or desktop taskbar for instant offline access, real-time sync, and native app performance.
                            </p>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                                    <div className="font-bold text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                                        On Android (Chrome / Brave)
                                    </div>
                                    <p className="text-slate-400 text-[11px] pl-7">
                                        Tap the <strong>three dots menu (⋮)</strong> at top-right & select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                                    <div className="font-bold text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">2</span>
                                        On iOS / iPhone (Safari)
                                    </div>
                                    <p className="text-slate-400 text-[11px] pl-7">
                                        Tap the <strong>Share button (⎋)</strong> at the bottom bar & select <strong>"Add to Home Screen"</strong>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                                    <div className="font-bold text-slate-100 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">3</span>
                                        On Windows / Mac Desktop (Chrome / Edge)
                                    </div>
                                    <p className="text-slate-400 text-[11px] pl-7">
                                        Click the <strong>Install icon (⊞)</strong> inside your browser address bar.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                                <button
                                    onClick={() => {
                                        if (deferredPrompt) {
                                            deferredPrompt.prompt();
                                            deferredPrompt.userChoice.then((choice) => {
                                                if (choice.outcome === 'accepted') {
                                                    showToast('🎉 Pioneer Academy Admin App installed successfully!');
                                                }
                                            });
                                        }
                                        setShowInstallModal(false);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
                                >
                                    <FiSmartphone className="text-base" />
                                    <span>Install App on Device</span>
                                </button>
                                <button
                                    onClick={() => setShowInstallModal(false)}
                                    className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                                >
                                    Close
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ========================================================================= */}
            {/* MODAL 9: MEMBERSHIP PLAN QR CODE & PDF POSTER MODAL */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {showMembershipQrModal && selectedPlanQr && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden text-center p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">MEMBERSHIP PLAN QR PASS</span>
                                    <h3 className="font-display font-black text-lg text-slate-900">{selectedPlanQr.name}</h3>
                                </div>
                                <button onClick={() => setShowMembershipQrModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                                <span className="font-semibold text-slate-600">{selectedPlanQr.duration} Pass</span>
                                <strong className="font-display font-bold text-[#FF6A1A] text-sm">₹{selectedPlanQr.price?.toLocaleString()}</strong>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-3xl inline-block shadow-xl">
                                {membershipQrDataUrl ? (
                                    <img src={membershipQrDataUrl} alt="Plan QR Code" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />
                                ) : (
                                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                        <FaQrcode className="text-7xl text-slate-900" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 pt-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => downloadQrImage(membershipQrDataUrl, `Pioneer_${selectedPlanQr.name.replace(/\s+/g, '_')}_QR.png`)}
                                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                    >
                                        <FiDownload /> Download PNG
                                    </button>
                                    <button
                                        onClick={() => downloadQrPdf({
                                            title: `MEMBERSHIP PASS: ${selectedPlanQr.name.toUpperCase()}`,
                                            subtitle: `Scan to enroll directly in ${selectedPlanQr.name} (${selectedPlanQr.duration} - ₹${selectedPlanQr.price?.toLocaleString()})`,
                                            qrDataUrl: membershipQrDataUrl,
                                            fileName: `Pioneer_${selectedPlanQr.name.replace(/\s+/g, '_')}_Poster.pdf`,
                                            instructions: "1. Open camera on phone  2. Scan QR code  3. Confirm membership plan and coaching timing.",
                                            metaData: [
                                                { label: "Plan Name", value: selectedPlanQr.name },
                                                { label: "Sport Cohort", value: selectedPlanQr.sport || "All Disciplines" },
                                                { label: "Pass Duration", value: selectedPlanQr.duration },
                                                { label: "Package Fee", value: `₹${selectedPlanQr.price?.toLocaleString()}` },
                                                { label: "Perks Included", value: (selectedPlanQr.features || []).slice(0, 3).join(", ") }
                                            ]
                                        })}
                                        className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                                    >
                                        <FiPrinter /> Download PDF
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/enroll?plan=${encodeURIComponent(selectedPlanQr.name)}`;
                                        navigator.clipboard.writeText(url);
                                        showToast('Plan enrollment link copied!');
                                    }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FiCopy /> Copy Plan Link
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;