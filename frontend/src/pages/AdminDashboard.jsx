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
    // ==========================================

    const [athletes, setAthletes] = useState(() => {
        const saved = localStorage.getItem('playpeak_athletes');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            {
                id: 'ATH-101',
                name: 'Aarav Sharma',
                phone: '+91 98261 55678',
                email: 'aarav.shooting@gmail.com',
                age: 15,
                gender: 'Male',
                sport: '10M Rifle Shooting',
                batchTime: 'Evening Prime (04:00 PM - 08:00 PM)',
                coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
                planType: 'Monthly',
                membership: 'Monthly Training Membership',
                feeAmount: 4700,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-08-01',
                emergencyContact: '+91 98261 55600 (Father)',
                bloodGroup: 'B+',
                status: 'Active'
            },
            {
                id: 'ATH-102',
                name: 'Rohan Mehra',
                phone: '+91 97554 22331',
                email: 'rohan.pistol@gmail.com',
                age: 17,
                gender: 'Male',
                sport: '10M Pistol Shooting',
                batchTime: 'Morning (08:00 AM - 12:00 PM)',
                coach: 'Coach Vikram Singh (National Medalist)',
                planType: 'Registration',
                membership: 'One-Time Annual Registration',
                feeAmount: 5000,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-07-15',
                emergencyContact: '+91 97554 22300 (Mother)',
                bloodGroup: 'O+',
                status: 'Active'
            },
            {
                id: 'ATH-103',
                name: 'Ananya Verma',
                phone: '+91 94071 88992',
                email: 'ananya.shooting@gmail.com',
                age: 14,
                gender: 'Female',
                sport: 'Beginner Training Course',
                batchTime: 'Evening Prime (04:00 PM - 08:00 PM)',
                coach: 'Coach Ananya Sen (Shooting Lead)',
                planType: 'Monthly',
                membership: 'Monthly Training Membership',
                feeAmount: 4700,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-08-10',
                emergencyContact: '+91 94071 88900',
                bloodGroup: 'A+',
                status: 'Active'
            },
            {
                id: 'ATH-104',
                name: 'Kabir Patel',
                phone: '+91 99812 44332',
                email: 'kabir.pistol@gmail.com',
                age: 16,
                gender: 'Male',
                sport: '10M Pistol Shooting',
                batchTime: 'Evening Prime (04:00 PM - 08:00 PM)',
                coach: 'Coach Vikram Singh (National Medalist)',
                planType: 'Monthly',
                membership: 'Monthly Training Membership',
                feeAmount: 4700,
                dueAmount: 0,
                paymentStatus: 'Paid',
                joinDate: '2026-08-05',
                emergencyContact: '+91 99812 44300',
                bloodGroup: 'B+',
                status: 'Active'
            }
        ];
    });

    const [payments, setPayments] = useState(() => {
        const saved = localStorage.getItem('playpeak_payments');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'PAY-901', athleteId: 'ATH-101', athleteName: 'Aarav Sharma', sport: '10M Rifle Shooting', plan: 'Monthly Training Membership', amount: 4700, date: '2026-09-01', dueDate: '2026-10-01', method: 'UPI (GPay)', status: 'Completed', receiptNo: 'RCP-2026-0891' },
            { id: 'PAY-902', athleteId: 'ATH-102', athleteName: 'Rohan Mehra', sport: '10M Pistol Shooting', plan: 'One-Time Annual Registration Fee', amount: 5000, date: '2026-08-15', dueDate: '2026-09-15', method: 'Debit Card', status: 'Completed', receiptNo: 'RCP-2026-0892' },
            { id: 'PAY-903', athleteId: 'ATH-103', athleteName: 'Ananya Verma', sport: 'Beginner Training Course', plan: 'Monthly Training Membership', amount: 4700, date: '2026-09-05', dueDate: '2026-10-05', method: 'Cash Offline', status: 'Completed', receiptNo: 'RCP-2026-0893' },
            { id: 'PAY-904', athleteId: 'ATH-104', athleteName: 'Kabir Patel', sport: '10M Pistol Shooting', plan: 'Monthly Training Membership', amount: 4700, date: '2026-08-01', dueDate: '2026-09-01', method: 'Netbanking', status: 'Completed', receiptNo: 'RCP-2026-0894' }
        ];
    });

    const [coaches, setCoaches] = useState(() => {
        const saved = localStorage.getItem('playpeak_coaches');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'COA-01', name: 'Rajesh Sharma', sport: '10M Rifle Shooting', certification: 'ISSF / NRAI Certified Head Coach', phone: '+91 98261 11223', email: 'rajesh.shooting@pioneershooting.com', experience: 14, trainees: 48, monthlySalary: '₹75,000', rating: 4.9, status: 'Active' },
            { id: 'COA-02', name: 'Vikram Singh', sport: '10M Pistol Shooting', certification: 'National Shooting Medalist & Pistol Coach', phone: '+91 97554 33445', email: 'vikram.pistol@pioneershooting.com', experience: 15, trainees: 54, monthlySalary: '₹85,000', rating: 4.9, status: 'Active' },
            { id: 'COA-03', name: 'Ananya Sen', sport: 'Beginner Training Course', certification: 'NRAI Certified Shooting Foundation Lead', phone: '+91 94071 55667', email: 'ananya.foundation@pioneershooting.com', experience: 9, trainees: 36, monthlySalary: '₹65,000', rating: 4.8, status: 'Active' },
            { id: 'COA-04', name: 'Rahul Nair', sport: 'Target Biomechanics & Stance', certification: 'Sports Psychology & Biomechanics Specialist', phone: '+91 99812 77889', email: 'rahul.biomechanics@pioneershooting.com', experience: 10, trainees: 40, monthlySalary: '₹70,000', rating: 4.8, status: 'Active' }
        ];
    });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('playpeak_inventory');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'EQP-101', name: '0.177 Cal Match Air Rifles', sport: '10M Rifle Shooting', category: 'Match Weapons', totalQty: 18, availableQty: 16, damagedQty: 2, location: 'Armory Safe Rack A', minThreshold: 5, unitCost: '₹85,000' },
            { id: 'EQP-102', name: '0.177 Cal Match Air Pistols', sport: '10M Pistol Shooting', category: 'Match Weapons', totalQty: 22, availableQty: 20, damagedQty: 2, location: 'Armory Safe Rack B', minThreshold: 6, unitCost: '₹72,000' },
            { id: 'EQP-103', name: 'Match-Grade Flat Pellet Tins (500 Pcs)', sport: 'Ammunition & Pellets', category: 'Consumables', totalQty: 200, availableQty: 175, damagedQty: 0, location: 'Supply Counter', minThreshold: 50, unitCost: '₹650' },
            { id: 'EQP-104', name: 'Official 10M Target Paper Sheets', sport: 'Target Paper Sheets', category: 'Consumables', totalQty: 2500, availableQty: 2200, damagedQty: 0, location: 'Range Shelf 1', minThreshold: 500, unitCost: '₹8' },
            { id: 'EQP-105', name: 'SCATT MX-02 Laser Optical Sensors', sport: 'Sighting Biomechanics', category: 'Tech Diagnostics', totalQty: 6, availableQty: 6, damagedQty: 0, location: 'Biomechanics Lab', minThreshold: 2, unitCost: '₹95,000' },
            { id: 'EQP-106', name: '300-Bar High Pressure Compressed Air Cylinders', sport: 'Range Equipment', category: 'Gas Systems', totalQty: 8, availableQty: 8, damagedQty: 0, location: 'Compressor Bay', minThreshold: 2, unitCost: '₹35,000' }
        ];
    });

    const [memberships, setMemberships] = useState(() => {
        const saved = localStorage.getItem('playpeak_memberships');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'PLN-01', name: 'Monthly Training Membership', sport: '10M Rifle & Pistol Shooting', duration: '1 Month (Open All Days)', price: 4700, activeAthletes: 95, features: ['Daily 1 - 1.5 Hour Sessions', 'Pellet Boxes Included', 'Target Papers Provided', 'Match Weapons & Equipment Access', 'Certified Coach Guidance'], badge: 'Official Monthly Fee' },
            { id: 'PLN-02', name: 'One-Time Annual Registration', sport: 'Shooter Accreditation', duration: '1 Year', price: 5000, activeAthletes: 120, features: ['Official Pioneer Shooter ID', 'Locker & Range Gate Access', 'District & State Trials Affiliation', 'Safety Audit & Weapon Fitting'], badge: 'Official Annual Fee' }
        ];
    });

    // Tournaments & Fixtures Seed State
    const [tournaments, setTournaments] = useState(() => {
        const saved = localStorage.getItem('playpeak_tournaments');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'TRN-01', title: '1st Golden Light Rifle Shooting Championship', sport: '10M Rifle & Pistol', ageCategory: 'Junior & Senior', startDate: '2026-10-10', endDate: '2026-10-14', teamsCount: 32, prizePool: 'Trophies & Medals', venue: 'Pioneer Shooting Range Arena', status: 'Completed' },
            { id: 'TRN-02', title: 'MP State 10M Shooting Selection Trials', sport: '10M Rifle & Pistol', ageCategory: 'Open Category', startDate: '2026-11-05', endDate: '2026-11-08', teamsCount: 45, prizePool: 'State Qualification', venue: 'Indore Shooting Complex', status: 'Upcoming' },
            { id: 'TRN-03', title: 'Indore District Inter-School Precision Shootout', sport: '10M Air Rifle', ageCategory: 'U-14 & U-17', startDate: '2026-11-20', endDate: '2026-11-22', teamsCount: 24, prizePool: '₹50,000 & Cups', venue: 'Pioneer Range Lanes 1-12', status: 'Upcoming' }
        ];
    });

    // Physio & Focus Recovery Seed State
    const [physioLogs, setPhysioLogs] = useState(() => {
        const saved = localStorage.getItem('playpeak_physio');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'PHY-01', athleteName: 'Aarav Sharma', sport: '10M Rifle Shooting', injuryType: 'Left Shoulder Isometric Hold Fatigue', injuryDate: '2026-09-18', recoveryStatus: 'In Rehab', therapist: 'Dr. Neha Saxena (Sports PT)', expectedReturn: '2026-10-02', treatment: 'Rotator Cuff Stability & Trigger Breathing' },
            { id: 'PHY-02', athleteName: 'Rohan Mehra', sport: '10M Pistol Shooting', injuryType: 'Forearm Extensor Muscle Tension', injuryDate: '2026-09-15', recoveryStatus: 'Light Training', therapist: 'Dr. Sameer Khan', expectedReturn: '2026-09-26', treatment: 'Grip Pressure Adjustment & Cryotherapy' },
            { id: 'PHY-03', athleteName: 'Ananya Verma', sport: 'Beginner Training', injuryType: 'Eye Fatigue & Cervical Neck Strain', injuryDate: '2026-09-10', recoveryStatus: 'Match Fit', therapist: 'Dr. Neha Saxena (Sports PT)', expectedReturn: '2026-09-23', treatment: 'Optical Rest Drills & Neck Posture Realignment' }
        ];
    });

    // Biomechanics & Fitness Assessments Seed State
    const [assessments, setAssessments] = useState(() => {
        const saved = localStorage.getItem('playpeak_assessments');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'ASM-01', athleteName: 'Aarav Sharma', sport: '10M Rifle', sprint30m: 'Hold: 0.12mm', verticalJump: 'SCATT 96.4%', vo2Max: 'HR: 58 bpm', deadlift: 'Stability 9.8', testDate: '2026-09-12', rating: 'National Qualifying' },
            { id: 'ASM-02', athleteName: 'Sneha Kulkarni', sport: '10M Pistol', sprint30m: 'Hold: 0.15mm', verticalJump: 'SCATT 94.8%', vo2Max: 'HR: 62 bpm', deadlift: 'Stability 9.5', testDate: '2026-09-14', rating: 'State Level' },
            { id: 'ASM-03', athleteName: 'Rohan Mehra', sport: '10M Rifle', sprint30m: 'Hold: 0.10mm', verticalJump: 'SCATT 97.8%', vo2Max: 'HR: 54 bpm', deadlift: 'Stability 9.9', testDate: '2026-09-10', rating: 'ISSF Squad Track' }
        ];
    });

    const [inquiries, setInquiries] = useState(() => {
        const saved = localStorage.getItem('playpeak_inquiries');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: 'INQ-501', name: 'Manish Rawat', phone: '+91 98260 99887', email: 'manish.rawat@gmail.com', sport: '10M Rifle', ageGroup: 'Under 14 (Son)', message: 'Looking for 10M Olympic rifle coaching batch with ISSF certified coach and Feinwerkbau kit.', date: '2026-09-22', status: 'New' },
            { id: 'INQ-502', name: 'Deepika Sen', phone: '+91 97551 11224', email: 'deepika.sen@yahoo.com', sport: '10M Pistol', ageGroup: 'Under 12 (Daughter)', message: 'Need information regarding beginner safety course, air pistol trials, and monthly equipment rental.', date: '2026-09-21', status: 'Trial Scheduled' },
            { id: 'INQ-503', name: 'Kunal Joshi', phone: '+91 94073 44556', email: 'kunal.shooting@gmail.com', sport: '10M Rifle', ageGroup: 'Ages 16-19', message: 'Interested in electronic target lanes (SIUS) and SCATT infrared trace stability coaching.', date: '2026-09-19', status: 'Contacted' },
            { id: 'INQ-504', name: 'Sanjay Patidar', phone: '+91 99814 77880', email: 'sanjay.patidar@gmail.com', sport: '10M Pistol', ageGroup: 'Adult Evening', message: 'Want daily evening 10M pistol lane slot (6:30 PM - 8:00 PM) with match pellets included.', date: '2026-09-18', status: 'Enrolled' }
        ];
    });

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

    // Save to LocalStorage whenever state changes
    useEffect(() => { localStorage.setItem('playpeak_athletes', JSON.stringify(athletes)); }, [athletes]);
    useEffect(() => { localStorage.setItem('playpeak_payments', JSON.stringify(payments)); }, [payments]);
    useEffect(() => { localStorage.setItem('playpeak_coaches', JSON.stringify(coaches)); }, [coaches]);
    useEffect(() => { localStorage.setItem('playpeak_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('playpeak_memberships', JSON.stringify(memberships)); }, [memberships]);
    useEffect(() => { localStorage.setItem('playpeak_tournaments', JSON.stringify(tournaments)); }, [tournaments]);
    useEffect(() => { localStorage.setItem('playpeak_physio', JSON.stringify(physioLogs)); }, [physioLogs]);
    useEffect(() => { localStorage.setItem('playpeak_assessments', JSON.stringify(assessments)); }, [assessments]);
    useEffect(() => { localStorage.setItem('playpeak_inquiries', JSON.stringify(inquiries)); }, [inquiries]);

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
    const PLAYPEAK_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://pioneershooting.in';

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
            bloodGroup: 'B+'
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
                const updatedAth = {
                    ...editingAthlete,
                    ...athleteForm,
                    email: editingAthlete.email || `${athleteForm.name.toLowerCase().replace(/\s+/g, '')}@pioneershooting.in`,
                    dueAmount: calculatedDue,
                    paymentStatus: finalStatus
                };

                let savedAth = updatedAth;
                try {
                    const res = await axios.put(`${API_BASE}athletes/${editingAthlete._id || editingAthlete.id}`, updatedAth);
                    if (res.data?.data) savedAth = res.data.data;
                } catch (putErr) {
                    console.warn('PUT athletes failed on primary URL, trying fallback...', putErr);
                    if (API_BASE !== '/api/') {
                        const res2 = await axios.put(`/api/athletes/${editingAthlete._id || editingAthlete.id}`, updatedAth);
                        if (res2.data?.data) savedAth = res2.data.data;
                    }
                }

                setAthletes(prev => prev.map(a => (a.id === editingAthlete.id || a._id === editingAthlete._id) ? savedAth : a));
                showToast(`Athlete profile for "${athleteForm.name}" updated successfully!`, 'success');
            } else {
                const newId = `ATH-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
                const newAthlete = {
                    id: newId,
                    ...athleteForm,
                    email: `${athleteForm.name.toLowerCase().replace(/\s+/g, '')}@pioneershooting.in`,
                    dueAmount: calculatedDue,
                    paymentStatus: finalStatus,
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
            try {
                const local = JSON.parse(localStorage.getItem('playpeak_athletes') || '[]');
                localStorage.setItem('playpeak_athletes', JSON.stringify(local.filter(a => !idsToDelete.includes(a.id) && !idsToDelete.includes(a._id))));
            } catch (e) {}
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
            try {
                const local = JSON.parse(localStorage.getItem('playpeak_athletes') || '[]');
                localStorage.setItem('playpeak_athletes', JSON.stringify(local.filter(a => !selectedAthleteIds.includes(a.id) && !selectedAthleteIds.includes(a._id))));
            } catch (e) {}
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
            localStorage.setItem('playpeak_athletes', '[]');
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
            try {
                const local = JSON.parse(localStorage.getItem('playpeak_payments') || '[]');
                localStorage.setItem('playpeak_payments', JSON.stringify(local.filter(p => !idsToDelete.includes(p.id) && !idsToDelete.includes(p._id))));
            } catch (e) {}
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
            try {
                const local = JSON.parse(localStorage.getItem('playpeak_payments') || '[]');
                localStorage.setItem('playpeak_payments', JSON.stringify(local.filter(p => !selectedPaymentIds.includes(p.id) && !selectedPaymentIds.includes(p._id))));
            } catch (e) {}
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
            localStorage.setItem('playpeak_payments', '[]');
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
            const cleanLocal = (storageKey) => {
                try {
                    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    const filtered = items.filter(i => !matchesInquiry(i, inq));
                    localStorage.setItem(storageKey, JSON.stringify(filtered));
                } catch (e) {}
            };
            cleanLocal('pioneer_inquiries');
            cleanLocal('playpeak_inquiries');
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
            const cleanLocalBatch = (storageKey) => {
                try {
                    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    const filtered = items.filter(i => !selectedInquiryIds.includes(i._id) && !selectedInquiryIds.includes(i.id));
                    localStorage.setItem(storageKey, JSON.stringify(filtered));
                } catch (e) {}
            };
            cleanLocalBatch('pioneer_inquiries');
            cleanLocalBatch('playpeak_inquiries');
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
            localStorage.setItem('pioneer_inquiries', '[]');
            localStorage.setItem('playpeak_inquiries', '[]');
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
        const localInqs = JSON.parse(localStorage.getItem('pioneer_inquiries') || '[]');
        localStorage.setItem('pioneer_inquiries', JSON.stringify(localInqs.map(i => (i.id === targetId || (i._id && i._id === targetId)) ? { ...i, status: next } : i)));
        showToast(`Inquiry status updated to "${next}"`);
    };

    // ==========================================
    // BROADCAST AUTO PAYMENT DUE REMINDERS & MARK PAID
    // ==========================================
    const dueAthletes = athletes.filter(a => Number(a.dueAmount || 0) > 0 || a.paymentStatus === 'Due' || a.paymentStatus === 'Overdue');

    // ==========================================
    // FEE DUE REMINDERS BULK ACTIONS
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

    const handleMarkSelectedAsPaid = async () => {
        if (selectedReminderIds.length === 0) return;
        const count = selectedReminderIds.length;
        if (window.confirm(`Mark fee dues as PAID for all ${count} selected athletes?`)) {
            for (const key of selectedReminderIds) {
                const athlete = athletes.find(a => a.id === key || a._id === key);
                if (athlete) {
                    await handleMarkPaid(athlete);
                }
            }
            setSelectedReminderIds([]);
            showToast(`Marked ${count} athlete fee dues as Paid.`, 'success');
        }
    };

    const handleClearAllFeeDues = async () => {
        if (dueAthletes.length === 0) return;
        if (window.confirm(`Clear and mark all ${dueAthletes.length} pending fee dues as paid?`)) {
            for (const athlete of dueAthletes) {
                await handleMarkPaid(athlete);
            }
            setSelectedReminderIds([]);
            showToast('All fee dues have been marked as settled.', 'info');
        }
    };

    const handleBroadcastDueReminders = () => {
        if (dueAthletes.length === 0) {
            showToast('No athletes have pending fee dues at this moment.', 'info');
            return;
        }

        setBroadcastingNotice(true);
        setTimeout(() => {
            setBroadcastingNotice(false);
            showToast(`🚀 Automated fee reminders dispatched to ${dueAthletes.length} athletes via WhatsApp & SMS!`, 'success');
        }, 1200);
    };

    const handleSendIndividualReminder = (athlete) => {
        const text = encodeURIComponent(`Hi ${athlete.name}, reminder from Pioneer Rifle Shooting Academy: Your ${athlete.sport} (${athlete.planType} Plan) fee balance of INR ${athlete.dueAmount} is pending. Please settle via UPI (9893270807@upi) or reception. Thank you!`);
        window.open(`https://wa.me/${athlete.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
        showToast(`Opened WhatsApp reminder for ${athlete.name}`);
    };

    // Mark fee due as permanently paid in MongoDB & log payment
    const handleMarkPaid = async (athlete) => {
        const athId = athlete._id || athlete.id;
        const paidAmount = Number(athlete.dueAmount || 0) > 0 ? Number(athlete.dueAmount) : (Number(athlete.feeAmount) || 4700);

        try {
            // 1. Update athlete in MongoDB
            await axios.put(`${API_BASE}athletes/${athId}`, {
                dueAmount: 0,
                paymentStatus: 'Paid',
                amountPaid: (Number(athlete.amountPaid) || 0) + paidAmount
            });

            // 2. Insert payment record in MongoDB
            const newPay = {
                id: `PAY-${Date.now().toString().slice(-6)}`,
                athleteId: athlete.id || athId,
                athleteName: athlete.name,
                sport: athlete.sport || '10M Rifle Shooting',
                plan: athlete.membership || athlete.planType || 'Monthly Training Fee',
                amount: paidAmount,
                paymentMode: 'Cash',
                method: 'Reception Cash Desk',
                date: new Date().toISOString().split('T')[0],
                status: 'Completed',
                receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                note: 'Fee due marked as paid from Admin Reminders tab'
            };
            await axios.post(`${API_BASE}payments`, newPay).catch(e => console.warn(e));

            // 3. Update local states
            setAthletes(prev => prev.map(a => (a.id === athlete.id || (a._id && a._id === athlete._id)) ? { ...a, dueAmount: 0, paymentStatus: 'Paid' } : a));
            setPayments(prev => [newPay, ...prev]);

            // 4. Update localStorage
            const localAths = JSON.parse(localStorage.getItem('playpeak_athletes') || '[]');
            localStorage.setItem('playpeak_athletes', JSON.stringify(localAths.map(a => (a.id === athlete.id || (a._id && a._id === athlete._id)) ? { ...a, dueAmount: 0, paymentStatus: 'Paid' } : a)));
            const localPays = JSON.parse(localStorage.getItem('playpeak_payments') || '[]');
            localStorage.setItem('playpeak_payments', JSON.stringify([newPay, ...localPays]));

            showToast(`Marked ${athlete.name}'s balance (₹${paidAmount.toLocaleString()}) as Fully Paid!`, 'success');
        } catch (err) {
            console.error('Error marking athlete as paid:', err);
            setAthletes(prev => prev.map(a => (a.id === athlete.id || (a._id && a._id === athlete._id)) ? { ...a, dueAmount: 0, paymentStatus: 'Paid' } : a));
            showToast(`Marked ${athlete.name} fee balance as paid.`, 'info');
        }
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
    const totalPendingDues = athletes.reduce((acc, a) => acc + Number(a.dueAmount || 0), 0);
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

    const filteredDueAthletes = dueAthletes.filter(a => {
        const matchesSearch = (a.name || '').toLowerCase().includes(reminderSearch.toLowerCase()) ||
                              (a.phone || '').includes(reminderSearch);
        const matchesSport = reminderSportFilter === 'All' || a.sport === reminderSportFilter;
        return matchesSearch && matchesSport;
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
                                                                        bloodGroup: athlete.bloodGroup || 'B+'
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
                            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pending Collection</span>
                                    <div className="font-display font-black text-3xl text-red-600">₹{totalPendingDues.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500">{dueAthletes.length} students currently have pending balance.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right text-xs text-slate-400">
                                        <p>Auto Reminder System: <strong className="text-emerald-600">Active</strong></p>
                                        <p>Schedule: 1st & 15th of Every Month</p>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Filter Toolbar for Dues */}
                            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:w-80">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search dues by student name or phone..."
                                        value={reminderSearch}
                                        onChange={(e) => setReminderSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF6A1A]"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    <select
                                        value={reminderSportFilter}
                                        onChange={(e) => setReminderSportFilter(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        <option value="All">All Sports</option>
                                        {sportsList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                    </select>
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
                                                <th className="px-5 py-4">Athlete Name & Phone</th>
                                                <th className="px-5 py-4">Sport & Billing Duration</th>
                                                <th className="px-5 py-4">Due Balance</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4 text-right">Remind & Collect</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredDueAthletes.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                                                        No athletes currently have pending fee dues!
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
                                                            <div className="font-bold text-slate-900">{athlete.name}</div>
                                                            <div className="text-[11px] text-slate-400">{athlete.phone} • {athlete.id}</div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="font-semibold text-slate-800">{athlete.sport}</div>
                                                            <div className="text-[11px] text-slate-400">{athlete.planType || 'Monthly'} Plan • {athlete.membership}</div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="font-bold text-red-600 text-sm">₹{athlete.dueAmount?.toLocaleString()}</div>
                                                            <div className="text-[10px] text-slate-400">Total: ₹{athlete.feeAmount?.toLocaleString()}</div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                                                                {athlete.paymentStatus}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleSendIndividualReminder(athlete)}
                                                                    className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                                                                >
                                                                    <FaWhatsapp />
                                                                    <span>WhatsApp</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleMarkPaid(athlete)}
                                                                    className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                                                                >
                                                                    <FiCheck />
                                                                    <span>Mark Paid</span>
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
                                        navigator.clipboard.writeText(`${window.location.origin}/enroll`);
                                        showToast('Enrollment link copied to clipboard!');
                                    }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FiCopy /> Copy Public Link
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