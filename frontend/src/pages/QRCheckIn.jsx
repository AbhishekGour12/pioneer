// pages/QRCheckIn.jsx - PlayPeak Sports Academy Digital Arena QR Gate & Scanner
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';
import { 
    FiCamera, 
    FiCheckCircle, 
    FiClock, 
    FiMapPin, 
    FiLogIn, 
    FiLogOut, 
    FiX, 
    FiRefreshCw, 
    FiVideo, 
    FiZap, 
    FiShield, 
    FiUserCheck, 
    FiAlertTriangle,
    FiDownloadCloud,
    FiActivity,
    FiDownload,
    FiCopy
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { attendanceinfo } from '../features/attendance';
import jsPDF from 'jspdf';

const url = import.meta.env.VITE_API_URL;
const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
const qrReaderId = "qr-code-reader";
const PIONEER_QR_URL = typeof window !== 'undefined' ? `${window.location.origin}/qr-checkin` : "https://pioneershooting.in/qr-checkin";

const QRCheckIn = () => {
    const [scanResult, setScanResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: 22.7569, lng: 75.8697 });
    const [actionType, setActionType] = useState('checkin');
    const [selectedSector, setSelectedSector] = useState('10M Rifle Shooting Range (Lane 1-8)');
    const [cameraActive, setCameraActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gateQrDataUrl, setGateQrDataUrl] = useState('');
    const [copiedLink, setCopiedLink] = useState(false);

    const [attendanceHistory, setAttendanceHistory] = useState([
        { id: 1, type: 'checkin', sector: '10M Rifle Shooting Range (Lane 1-8)', time: 'Today, 08:15 AM', status: 'Verified' },
        { id: 2, type: 'checkout', sector: '10M Pistol Shooting Range (Lane 9-16)', time: 'Yesterday, 07:30 PM', status: 'Completed' },
        { id: 3, type: 'checkin', sector: 'Beginner Training Bay & Simulator', time: 'Yesterday, 04:00 PM', status: 'Verified' }
    ]);

    const qrScannerRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.value) || JSON.parse(localStorage.getItem('libraryUser') || '{}');

    const arenaSectors = [
        '10M Rifle Shooting Range (Lane 1-8)',
        '10M Pistol Shooting Range (Lane 9-16)',
        'Beginner Training Bay & Simulator',
        'Electronic Target System (SIUS)',
        'Armory & Weapon Maintenance Bay',
        'Physical Conditioning & Biomechanics Area'
    ];

    // Generate Gate Entry QR Code for pioneer shooting checkin
    useEffect(() => {
        const fullLink = `${PIONEER_QR_URL}?athlete=${encodeURIComponent(user.name || 'Pioneer Shooter')}&sector=${encodeURIComponent(selectedSector)}`;
        QRCode.toDataURL(fullLink, {
            width: 320,
            margin: 2,
            color: { dark: '#0F172A', light: '#FFFFFF' }
        })
        .then((url) => setGateQrDataUrl(url))
        .catch(() => setGateQrDataUrl(''));
    }, [user.name, selectedSector]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    console.log("GPS Location default:", err.message);
                }
            );
        }
    }, []);

    const startScanner = async () => {
        try {
            setIsScanning(true);
            setCameraActive(true);

            setTimeout(() => {
                const scanner = new Html5Qrcode(qrReaderId);
                qrScannerRef.current = scanner;

                scanner.start(
                    { facingMode: "environment" },
                    qrConfig,
                    (decodedText) => {
                        handleScanSuccess(decodedText);
                    },
                    (errorMessage) => {
                        // scanning in progress
                    }
                ).catch((err) => {
                    console.error("Camera start error:", err);
                    setIsScanning(false);
                    setCameraActive(false);
                });
            }, 300);
        } catch (error) {
            console.error("Scanner init error:", error);
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (qrScannerRef.current) {
            try {
                await qrScannerRef.current.stop();
                qrScannerRef.current.clear();
            } catch (err) {
                console.warn("Stop scanner error:", err);
            }
        }
        setIsScanning(false);
        setCameraActive(false);
    };

    const handleScanSuccess = (decodedText) => {
        stopScanner();
        setScanResult(decodedText);
        processGateVerification(decodedText);
    };

    const handleManualSimulatedCheckin = () => {
        const simCode = `${PLAYPEAK_QR_URL}?gate=pass-${Date.now()}`;
        setScanResult(simCode);
        processGateVerification(simCode);
    };

    const processGateVerification = (code) => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            const newRecord = {
                id: Date.now(),
                type: actionType,
                sector: selectedSector,
                time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                status: 'Verified'
            };
            setAttendanceHistory([newRecord, ...attendanceHistory]);
            setAttendanceStatus({
                success: true,
                message: `Gate turnstile unlocked! ${actionType === 'checkin' ? 'Welcome to' : 'Checked out of'} ${selectedSector}.`,
                time: new Date().toLocaleTimeString()
            });
        }, 800);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(PIONEER_QR_URL);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
    };

    const handleDownloadQr = () => {
        if (!gateQrDataUrl) return;
        const link = document.createElement('a');
        link.href = gateQrDataUrl;
        link.download = `Pioneer_Shooting_Range_Pass.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-[#080C14] min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-[#FF6A1A]/30">
                    <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A1A]">
                        PIONEER RIFLE SHOOTING ACADEMY - RANGE GATE ACCESS
                    </span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                    Shooter Digital Turnstile Gate
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                    Official Range Access URL: <span className="font-mono text-[#FF6A1A] font-bold">{PIONEER_QR_URL}</span>
                </p>
            </div>

            {/* Main Action Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
                
                {/* Left Column: QR Scanner & Controls */}
                <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                    
                    {/* Action Toggle (Check In / Check Out) */}
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setActionType('checkin')}
                            className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                actionType === 'checkin'
                                    ? 'bg-[#FF6A1A] text-white shadow-lg shadow-orange-500/20 font-black'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <FiLogIn /> Arena Check-In
                        </button>

                        <button
                            onClick={() => setActionType('checkout')}
                            className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                actionType === 'checkout'
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 font-black'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <FiLogOut /> Arena Check-Out
                        </button>
                    </div>

                    {/* Arena Sector Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300">Select Arena Sector / Facility</label>
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="w-full bg-slate-950 border border-white/15 rounded-2xl p-3 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-[#FF6A1A]"
                        >
                            {arenaSectors.map((sector) => (
                                <option key={sector} value={sector}>{sector}</option>
                            ))}
                        </select>
                    </div>

                    {/* Camera Scanner Viewport */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/15 min-h-[280px] flex flex-col items-center justify-center p-4">
                        <div id={qrReaderId} className="w-full max-w-sm rounded-xl overflow-hidden"></div>

                        {!cameraActive && (
                            <div className="text-center space-y-4 py-8">
                                <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#FF6A1A] text-2xl mx-auto">
                                    <FiCamera />
                                </div>
                                <div>
                                    <p className="font-display font-bold text-white text-base">Range Turnstile Camera Scanner</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                         Scan the official Pioneer Shooting Range QR code mounted on turnstile or shooter pass to record entry.
                                     </p>
                                 </div>
                                 <div className="flex flex-wrap gap-3 justify-center pt-2">
                                     <button
                                         onClick={startScanner}
                                         className="px-6 py-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-black text-xs shadow-lg shadow-orange-500/20 hover:opacity-90 transition-all"
                                     >
                                         Launch Scanner Camera
                                     </button>
                                     <button
                                         onClick={handleManualSimulatedCheckin}
                                         className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs transition-colors"
                                     >
                                         One-Tap Gate Unlock
                                     </button>
                                 </div>
                            </div>
                        )}

                        {cameraActive && (
                            <button
                                onClick={stopScanner}
                                className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs transition-all"
                            >
                                Stop Camera
                            </button>
                        )}
                    </div>

                    {/* Attendance Verification Status */}
                    {attendanceStatus && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center gap-3 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/10"
                        >
                            <FiCheckCircle className="text-xl shrink-0" />
                            <span>{attendanceStatus.message}</span>
                        </motion.div>
                    )}

                </div>

                {/* Right Column: Digital Athlete Badge & Live Gate QR Code */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* Digital Athlete Pass Card with QR Code */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-3xl p-6 border border-orange-500/40 shadow-xl relative overflow-hidden text-center space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A1A] animate-ping" />
                                <span className="text-xs font-black text-[#FF6A1A] uppercase tracking-widest">
                                    PIONEER RANGE PASS QR
                                </span>
                            </div>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-500/20 text-[#FF6A1A] border border-orange-500/30 font-bold">
                                ACTIVE PASS
                            </span>
                        </div>

                        {/* Generated QR Code Image */}
                        <div className="bg-white p-3 rounded-2xl inline-block shadow-xl my-2">
                            {gateQrDataUrl ? (
                                <img src={gateQrDataUrl} alt="Gate QR Access Pass" className="w-44 h-44 mx-auto rounded-lg" />
                            ) : (
                                <div className="w-44 h-44 bg-slate-100 flex items-center justify-center">
                                    <FaQrcode className="text-6xl text-slate-800" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-display font-black text-xl text-white">
                                {user.name || 'Pioneer Shooter Pass'}
                            </h3>
                            <p className="text-xs font-mono text-[#FF6A1A] truncate">
                                {PIONEER_QR_URL}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                                onClick={handleCopyLink}
                                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <FiCopy /> {copiedLink ? 'Copied!' : 'Copy Link'}
                            </button>
                            <button
                                onClick={handleDownloadQr}
                                className="py-2.5 px-3 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                                <FiDownload /> Download QR
                            </button>
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4">
                        <h4 className="font-display font-black text-base text-white flex items-center gap-2">
                            <FiActivity className="text-[#FF6A1A]" /> Recent Sector Check-Ins
                        </h4>
                        <div className="space-y-3">
                            {attendanceHistory.map((item) => (
                                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs">
                                    <div>
                                        <p className="font-bold text-white flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${item.type === 'checkin' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                            <span>{item.sector}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-emerald-400 font-bold border border-emerald-500/20">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default QRCheckIn;