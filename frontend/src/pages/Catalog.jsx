// pages/Catalog.jsx - PlayPeak Sports Academy World-Class Facilities & Arenas
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
    FiSearch,
    FiFilter,
    FiStar,
    FiCheckCircle,
    FiClock,
    FiZap,
    FiLayers,
    FiX,
    FiArrowRight,
    FiCalendar,
    FiUsers,
    FiShield,
    FiMapPin,
    FiActivity,
    FiCheck,
    FiPhoneCall,
    FiHelpCircle,
    FiSliders,
    FiTarget
} from 'react-icons/fi';
import { 
    FaTrophy, 
    FaRegClock,
    FaLightbulb
} from 'react-icons/fa';
import { 
    GiWhistle,
    GiMedal,
    GiLaurelCrown
} from 'react-icons/gi';
import { 
    MdOutlineStadium, 
    MdOutlineSportsScore, 
    MdSecurity
} from 'react-icons/md';

const Catalog = () => {
    const [searchParams] = useSearchParams();
    const [facilities, setFacilities] = useState([]);
    const [filteredFacilities, setFilteredFacilities] = useState([]);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [selectedFacilityModal, setSelectedFacilityModal] = useState(null);
    const [bookingFacilityModal, setBookingFacilityModal] = useState(null);
    const [bookingSuccessNotice, setBookingSuccessNotice] = useState(null);

    // Booking form state
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookingSlot, setBookingSlot] = useState('Evening Prime (05:00 PM - 07:00 PM)');
    const [playerCount, setPlayerCount] = useState('1 Shooter');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const categories = [
        'All',
        '10M Ranges',
        'Target Systems',
        'Armory & Weapons',
        'Biomechanics Lab'
    ];

    useEffect(() => {
        const fullFacilities = [
            {
                id: 1,
                title: "10M Olympic Air Rifle & Air Pistol Range (12 Precision Lanes)",
                category: "10M Ranges",
                sport: "10M Precision Range",
                badgeIcon: <FiTarget className="text-[#FF6A1A]" />,
                rating: 4.9,
                reviews: 412,
                hourlyRate: "Included in Pass",
                monthlyPass: "₹4,700 / mo",
                availableSlots: 6,
                capacity: "12 Individual Shooting Lanes",
                dimensions: "10-Meter Olympic Standard Distance",
                surface: "Anti-Vibration Acoustic Modular Shooting Floor",
                lighting: "1000 Lux Target Paper Shadowless LED Illumination",
                certification: "ISSF & NRAI Technical Specification",
                openHours: "08:00 AM - 08:00 PM (All 7 Days)",
                image: "/images/shooting/shooting-squad-steps.jpg",
                amenities: ["Individual Lane Control", "Motorized Target Retrieval", "Weapon Racks", "Telescope Spotting Stands", "Air Conditioned"],
                summary: "Olympic-spec 10M shooting range equipped with precision lane dividers, adjustable shooting tables, spotting optics, and calibrated illumination.",
                highlights: [
                    "12 dedicated 10-meter shooting lanes with independent motorized paper target return pulleys",
                    "Calibrated 1000 Lux shadow-free lighting on target faces for crystal-clear sight pictures",
                    "Acoustic wall baffles reducing muzzle sound and enhancing deep mental concentration",
                    "Supervised daily by ISSF & NRAI certified coaches Rajesh Sharma and Vikram Singh"
                ],
                equipmentProvided: "Match-grade air rifles, match air pistols, pellet boxes, target papers, shooting stands, spotting scopes"
            },
            {
                id: 2,
                title: "Championship Target Paper & Electronic Scoring System",
                category: "Target Systems",
                sport: "Target Analysis",
                badgeIcon: <MdOutlineSportsScore className="text-[#FF6A1A]" />,
                rating: 4.9,
                reviews: 388,
                hourlyRate: "Included in Pass",
                monthlyPass: "₹4,700 / mo",
                availableSlots: 8,
                capacity: "Dual Paper & Electronic Analysis",
                dimensions: "10M Certified Precision Distance",
                surface: "Precision Backstop & Pellet Traps",
                lighting: "Target Bay Focused Daylight LEDs",
                certification: "National Rifle Association of India Spec",
                openHours: "08:00 AM - 08:00 PM (All 7 Days)",
                image: "/images/shooting/shooting-team-trophy.jpg",
                amenities: ["Official ISSF Target Papers", "Pellet Group Gauge Overlay", "Score Log Cards", "Optical Target Scopes"],
                summary: "High-accuracy scoring and evaluation system tracking shooter consistency, millimeter group size, and shot-by-shot ring statistics.",
                highlights: [
                    "Official ISSF certified 10M air rifle and air pistol target paper sheets provided every session",
                    "Precision transparent overlay gauges for decimal millimeter score adjudication",
                    "Match score tracking logs helping athletes prepare for district and state qualifiers",
                    "Target card retention archive for weekly performance curve analysis"
                ],
                equipmentProvided: "Target paper batches, scoring gauges, target mounting pins, shooter record cards"
            },
            {
                id: 3,
                title: "Match Weapons Armory & Fitting Station",
                category: "Armory & Weapons",
                sport: "Armory & Gear",
                badgeIcon: <FiShield className="text-[#FF6A1A]" />,
                rating: 4.9,
                reviews: 365,
                hourlyRate: "Included in Pass",
                monthlyPass: "₹4,700 / mo",
                availableSlots: 4,
                capacity: "Full Armory Suite",
                dimensions: "Biometrically Secured Armory",
                surface: "Custom Weapon Mounting & Workbench",
                lighting: "Detail Armory Workstation Lights",
                certification: "Gun Safety & Range Armor Standards",
                openHours: "08:00 AM - 08:00 PM (All 7 Days)",
                image: "/images/shooting/shooting-winners-podium.jpg",
                amenities: ["Match Air Rifles", "Match Air Pistols", "Cylinder Pressure Filling Station", "Shooting Jackets & Slings", "Cleaning Kits"],
                summary: "Secure on-site armory featuring competition match air rifles and air pistols, compressed air filling cylinders, and personalized ergonomic fittings.",
                highlights: [
                    "All trainees receive direct access to match air rifles and pistols with zero weapon rental fees",
                    "Cheekpiece, buttplate, and trigger reach adjustments customized to athlete stature",
                    "High-pressure 200/300 bar compressed air cylinder refilling station on premises",
                    "Shooting jackets, gloves, and rifle slings available for competition prep"
                ],
                equipmentProvided: "0.177 cal match air rifles, 0.177 match air pistols, compressed air fills, trigger gauges"
            },
            {
                id: 4,
                title: "SCATT Laser Sighting & Trigger Biomechanics Lab",
                category: "Biomechanics Lab",
                sport: "Sighting Biomechanics",
                badgeIcon: <FiActivity className="text-[#FF6A1A]" />,
                rating: 4.9,
                reviews: 320,
                hourlyRate: "Integrated Coaching",
                monthlyPass: "₹4,700 / mo",
                availableSlots: 5,
                capacity: "4 Sensor Stations",
                dimensions: "Digital Trajectory Lab",
                surface: "Static Hold Platform",
                lighting: "Glare-Free Optical Calibration",
                certification: "SCATT Optoelectronic Training Spec",
                openHours: "08:00 AM - 08:00 PM",
                image: "/images/shooting/shooting-squad-outdoor.jpg",
                amenities: ["SCATT MX-02 Sensors", "Barrel Trace Analytics", "Heartbeat Sync", "Trigger Pressure Graphs"],
                summary: "Optoelectronic trace training system capturing micro-movements of sight alignment 1 second before, during, and after trigger release.",
                highlights: [
                    "Visual trajectory plot displaying shooter hold stability and aiming trajectory in real-time",
                    "Identifies trigger jerking, sight anticipation, and follow-through flaws instantly",
                    "Helps athletes stabilize natural point of aim (NPA) to consistently shoot 10.5+ values",
                    "Weekly exportable bio-feedback reports for coaches and athletes"
                ],
                equipmentProvided: "SCATT optical sensors, mounting brackets, laptop analysis displays, calibration targets"
            },
            {
                id: 5,
                title: "Match-Grade Pellet Dispensing & Inspection Bay",
                category: "Armory & Weapons",
                sport: "Ammunition & Pellets",
                badgeIcon: <GiMedal className="text-[#FF6A1A]" />,
                rating: 4.8,
                reviews: 290,
                hourlyRate: "Included in Pass",
                monthlyPass: "₹4,700 / mo",
                availableSlots: 10,
                capacity: "Pellet Sorting & Ammunition Station",
                dimensions: "Precision Inspection Counter",
                surface: "Felt-Lined Inspection Trays",
                lighting: "Magnified LED Inspection Lamps",
                certification: "0.177 Cal (4.5mm) Match Grade Standard",
                openHours: "08:00 AM - 08:00 PM (All 7 Days)",
                image: "/images/shooting/shooting-podium-girls.jpg",
                amenities: ["Pellet Boxes Included", "Match Grade 4.5mm Wadcutter", "Weight Scale (0.001g)", "Felt Inspection Trays"],
                summary: "Quality-tested 0.177 caliber flat-head match pellets provided to all enrolled athletes for clean punch cuts in 10-ring target papers.",
                highlights: [
                    "High-purity match pellets provided as part of the monthly ₹4,700 training fee",
                    "Flat wadcutter head geometry creating razor-clean circular holes for undisputed scoring",
                    "Micro-balance pellet weighing scale to eliminate ballistic weight variance during finals",
                    "Safe pellet catch traps behind every shooting lane preventing ricochets"
                ],
                equipmentProvided: "Pellet tins (500 count), pellet holder blocks, digital balance scale, skirt inspection gauges"
            },
            {
                id: 6,
                title: "Shooter Breath Conditioning, Pulse Sync & Focus Lounge",
                category: "Biomechanics Lab",
                sport: "Mental Conditioning",
                badgeIcon: <GiLaurelCrown className="text-[#FF6A1A]" />,
                rating: 4.9,
                reviews: 315,
                hourlyRate: "Included in Pass",
                monthlyPass: "₹4,700 / mo",
                availableSlots: 8,
                capacity: "20 Shooters Lounge",
                dimensions: "Acoustic Quiet Conditioning Zone",
                surface: "Soft Carpet & Posture Mats",
                lighting: "Warm Ambient Relaxation Lighting",
                certification: "Sports Psychology Focus Protocols",
                openHours: "08:00 AM - 08:00 PM (All 7 Days)",
                image: "/images/shooting/shooting-squad-steps.jpg",
                amenities: ["Diaphragmatic Breathing Aids", "Heart Rate Monitors", "Quiet Visualization Zone", "Shooter Hydration Bar"],
                summary: "Dedicated focus zone designed for pre-match visualization, pulse-rate lowering routines, and mental resilience under tournament pressure.",
                highlights: [
                    "Breathing pacing protocols training shooters to execute shots comfortably during natural respiratory pause",
                    "Heart rate bio-monitors showing athletes how to shoot between heartbeats for zero tremor",
                    "Visualization cubicles for 60-shot competition mental walk-throughs",
                    "Hydration and recovery station maintaining optimal visual contrast and alertness"
                ],
                equipmentProvided: "Breathing trainers, pulse oximeters, posture alignment mirrors, hydration dispensers"
            }
        ];

        setFacilities(fullFacilities);
        setFilteredFacilities(fullFacilities);
    }, []);

    // Filter and Sort facilities
    useEffect(() => {
        let results = [...facilities];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(
                f => f.title.toLowerCase().includes(term) ||
                     f.sport.toLowerCase().includes(term) ||
                     f.category.toLowerCase().includes(term) ||
                     f.summary.toLowerCase().includes(term) ||
                     f.surface.toLowerCase().includes(term) ||
                     f.amenities.some(a => a.toLowerCase().includes(term))
            );
        }

        if (selectedCategory !== 'All') {
            results = results.filter(f => f.category === selectedCategory);
        }

        if (sortBy === 'popular') {
            results.sort((a, b) => b.reviews - a.reviews);
        } else if (sortBy === 'rating') {
            results.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'name') {
            results.sort((a, b) => a.title.localeCompare(b.title));
        }

        setFilteredFacilities(results);
    }, [searchTerm, selectedCategory, sortBy, facilities]);

    // Handle Quick Slot Booking Submission
    const handleConfirmBooking = (e) => {
        e.preventDefault();
        if (!userName.trim() || !userPhone.trim()) {
            alert('Please enter your full name and contact phone number.');
            return;
        }

        const facilityName = bookingFacilityModal ? bookingFacilityModal.title : 'Sports Arena';
        setBookingSuccessNotice({
            facility: facilityName,
            date: bookingDate,
            slot: bookingSlot,
            players: playerCount,
            name: userName,
            bookingId: `PPK-${Math.floor(100000 + Math.random() * 900000)}`
        });

        setBookingFacilityModal(null);
        setUserName('');
        setUserPhone('');
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
            
            {/* HERO BANNER SECTION */}
            <section className="relative bg-slate-950 text-white overflow-hidden pt-12 pb-16 lg:py-20 border-b border-slate-800">
                {/* Subtle Background Elements & Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#FF6A1A_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6A1A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
                        <Link to="/" className="hover:text-[#FF6A1A] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#FF6A1A]">Facilities & Arenas</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Hero Text */}
                        <div className="lg:col-span-8 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6A1A]/15 border border-[#FF6A1A]/30 text-[#FF6A1A] text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A] animate-pulse" />
                                <span>PIONEER RIFLE SHOOTING ACADEMY • WORLD-CLASS PRECISION INFRASTRUCTURE</span>
                            </div>

                            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                                Olympic Standard <br className="hidden sm:inline" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A1A] via-orange-400 to-amber-300">
                                    Shooting Ranges & Facilities
                                </span>
                            </h1>

                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                                Train on precision 10m target paper lanes with match-grade air rifles, air pistols, pellet boxes, and certified coach mentorship at Sector R Mahalaxmi Nagar, Indore.
                            </p>

                            {/* Quick Value Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                                    <div className="text-lg sm:text-xl font-display font-black text-white flex items-center gap-1.5">
                                        <MdOutlineStadium className="text-[#FF6A1A]" />
                                        <span>10M</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">Olympic Range Lanes</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                                    <div className="text-lg sm:text-xl font-display font-black text-white flex items-center gap-1.5">
                                        <FaLightbulb className="text-amber-400" />
                                        <span>1 to 1.5 Hrs</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">Daily Sessions</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                                    <div className="text-lg sm:text-xl font-display font-black text-white flex items-center gap-1.5">
                                        <GiMedal className="text-[#FF6A1A]" />
                                        <span>₹4,700</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">Monthly Training Fee</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                                    <div className="text-lg sm:text-xl font-display font-black text-white flex items-center gap-1.5">
                                        <FiClock className="text-emerald-400" />
                                        <span>8 AM - 8 PM</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">Open All Days</span>
                                </div>
                            </div>
                        </div>

                        {/* Fast Slot Inquiry Card */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-slate-900 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">
                                            Instant Booking
                                        </span>
                                        <h3 className="font-display font-bold text-base text-slate-900">
                                            Reserve A Court Slot
                                        </h3>
                                    </div>
                                    <span className="w-8 h-8 rounded-full bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-sm">
                                        <FiCalendar />
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Choose your favorite sports court or training lane. Slots can be booked hourly or through monthly academy passes.
                                </p>

                                <div className="space-y-2.5">
                                    <button
                                        onClick={() => {
                                            if (facilities.length > 0) {
                                                setBookingFacilityModal(facilities[0]);
                                            }
                                        }}
                                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-orange-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
                                    >
                                        <span>Book Hourly Slot</span>
                                        <FiArrowRight />
                                    </button>
                                    
                                    <Link
                                        to="/membership"
                                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                                    >
                                        <FiZap className="text-[#FF6A1A]" />
                                        <span>View Academy Memberships</span>
                                    </Link>
                                </div>

                                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                                    <span className="flex items-center gap-1">
                                        <FiCheckCircle className="text-emerald-500 text-xs" /> Clean Lockers
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiCheckCircle className="text-emerald-500 text-xs" /> Pro Gear Rental
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                
                {/* SUCCESS NOTIFICATION TOAST / BANNER */}
                <AnimatePresence>
                    {bookingSuccessNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <FiCheck className="text-xl" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm text-emerald-950">
                                            Booking Request Confirmed!
                                        </h4>
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-[10px] font-mono font-bold">
                                            ID: {bookingSuccessNotice.bookingId}
                                        </span>
                                    </div>
                                    <p className="text-xs text-emerald-800">
                                        Reserved <strong>{bookingSuccessNotice.facility}</strong> for <strong>{bookingSuccessNotice.name}</strong> on <strong>{bookingSuccessNotice.date}</strong> ({bookingSuccessNotice.slot}, {bookingSuccessNotice.players}). A confirmation SMS has been dispatched.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setBookingSuccessNotice(null)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-200/60 hover:bg-emerald-200 text-emerald-900 text-xs font-bold self-end sm:self-center transition-colors"
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SEARCH & CATEGORY FILTER TOOLBAR */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 mb-10 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        
                        {/* Live Search Input */}
                        <div className="relative w-full lg:w-96">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                type="text"
                                placeholder="Search arena, sport, turf type, or equipment..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6A1A] focus:ring-2 focus:ring-[#FF6A1A]/20 transition-all font-medium"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                >
                                    <FiX className="text-sm" />
                                </button>
                            )}
                        </div>

                        {/* Result Count and Sort Selector */}
                        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                            <span className="text-xs text-slate-500 font-semibold">
                                Showing <strong className="text-slate-900">{filteredFacilities.length}</strong> Arenas
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
                                    <FiSliders className="text-slate-400" /> Sort:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#FF6A1A]"
                                >
                                    <option value="popular">Most Booked / Reviews</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="name">Arena Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pt-2 pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-[#FF6A1A] text-white shadow-md shadow-orange-500/25 font-extrabold'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    {cat === 'All' && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {facilities.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* NO RESULTS FALLBACK */}
                {filteredFacilities.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6A1A] flex items-center justify-center text-2xl mx-auto">
                            <FiSearch />
                        </div>
                        <h3 className="font-display font-bold text-xl text-slate-900">
                            No Facilities Match Your Filter
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                            We couldn't find any sports arenas matching "{searchTerm}". Try clearing your search or picking a different category filter.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="px-5 py-2.5 rounded-xl bg-[#FF6A1A] text-white text-xs font-bold hover:opacity-95 transition-opacity"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

                {/* FACILITIES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {filteredFacilities.map((facility) => (
                        <motion.div
                            key={facility.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                        >
                            {/* Card Media Header */}
                            <div className="relative h-56 overflow-hidden bg-slate-900">
                                <img
                                    src={facility.image}
                                    alt={facility.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        // Fallback if image fails
                                        e.target.src = '/images/shooting/shooting-squad-steps.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                
                                {/* Top Sport Badge */}
                                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-sm">
                                        {facility.badgeIcon}
                                        <span>{facility.sport}</span>
                                    </span>
                                </div>

                                {/* Certification Tag */}
                                <div className="absolute top-3.5 right-3.5">
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
                                        <FiShield className="text-xs" />
                                        <span>{facility.certification.split(' ')[0]} Certified</span>
                                    </span>
                                </div>

                                {/* Bottom Image Overlay Info */}
                                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                                        <FiMapPin className="text-[#FF6A1A]" /> Indore Main Arena
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md font-mono font-bold text-[11px]">
                                        {facility.availableSlots} Slots Today
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-grow space-y-4">
                                
                                {/* Rating & Hours */}
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center text-amber-400">
                                            <FiStar className="fill-amber-400 text-sm" />
                                        </div>
                                        <span className="font-bold text-slate-800">{facility.rating}</span>
                                        <span className="text-slate-400">({facility.reviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                                        <FaRegClock className="text-slate-400 text-[11px]" />
                                        <span>{facility.openHours}</span>
                                    </div>
                                </div>

                                {/* Facility Name */}
                                <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-[#FF6A1A] transition-colors leading-snug">
                                    {facility.title}
                                </h3>

                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {facility.summary}
                                </p>

                                {/* Specification Pills */}
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="font-medium text-slate-500">Surface:</span>
                                        <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">{facility.surface.split('+')[0]}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="font-medium text-slate-500">Capacity:</span>
                                        <span className="font-bold text-slate-800">{facility.capacity}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <span className="font-medium text-slate-500">Lighting:</span>
                                        <span className="font-bold text-amber-700">{facility.lighting.split(' ')[0]} {facility.lighting.split(' ')[1]}</span>
                                    </div>
                                </div>

                                {/* Amenity Tags */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {facility.amenities.slice(0, 3).map((amenity, idx) => (
                                        <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60">
                                            {amenity}
                                        </span>
                                    ))}
                                    {facility.amenities.length > 3 && (
                                        <span className="text-[10px] font-semibold text-[#FF6A1A] bg-orange-50 px-1.5 py-0.5 rounded-lg">
                                            +{facility.amenities.length - 3} more
                                        </span>
                                    )}
                                </div>

                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Slot Pricing
                                    </span>
                                    <div className="font-display font-extrabold text-base text-slate-900">
                                        {facility.hourlyRate}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedFacilityModal(facility)}
                                        className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                                    >
                                        Specs
                                    </button>
                                    <button
                                        onClick={() => setBookingFacilityModal(facility)}
                                        className="py-2.5 px-4 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm shadow-orange-500/20 transition-all active:scale-98"
                                    >
                                        Book Slot
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ARENA STANDARDS & AMENITIES BANNER */}
                <section className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 mb-16 relative overflow-hidden shadow-xl">
                    <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#FF6A1A]/15 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 max-w-3xl space-y-4 mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A1A]/20 text-[#FF6A1A] text-xs font-bold uppercase tracking-wider">
                            <FiShield /> Certified Athletic Standards
                        </div>
                        <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                            Why Pioneer Shooting Range Infrastructure Outperforms Standard Facilities
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Every shooting lane at Pioneer Rifle Shooting Academy is constructed in strict adherence to international shooting sport federation (ISSF) standards for precision and safety.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2.5">
                            <div className="w-10 h-10 rounded-xl bg-[#FF6A1A]/20 text-[#FF6A1A] flex items-center justify-center text-xl">
                                <FiActivity />
                            </div>
                            <h4 className="font-bold text-sm text-white">Impact Absorption Floors</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Multilayer shockpads reduce knee, ankle, and joint fatigue by up to 64% compared to concrete or unpadded turfs.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2.5">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                                <FaLightbulb />
                            </div>
                            <h4 className="font-bold text-sm text-white">Anti-Glare Floodlights</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                500+ Lux vertical illumination arrays designed for zero-shadow night matches and high-speed live streaming.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2.5">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
                                <MdSecurity />
                            </div>
                            <h4 className="font-bold text-sm text-white">Locker Suites & Physio</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Sanitized dressing rooms, high-pressure hot showers, secure electronic lockers, and on-duty sports physiotherapists.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                                <FiUsers />
                            </div>
                            <h4 className="font-bold text-sm text-white">Coaches & Referees</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Official certified referees and sport-specific tactical coaches available for corporate leagues and youth batches.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION SECTION */}
                <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 mb-16 shadow-sm">
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6A1A] text-xs font-bold uppercase tracking-wider">
                            <FiHelpCircle /> FAQs
                        </div>
                        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                            Court Booking & Facility Rules
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Everything you need to know before stepping onto Pioneer shooting lanes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                What type of attire and footwear is required?
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed pl-4">
                                Flat-soled athletic shoes or shooting boots providing good ankle stability are recommended. Comfortable sportswear allowing natural shoulder and torso alignment is ideal.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                Is weapons & shooting equipment provided?
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed pl-4">
                                Yes! Match-grade 10M air rifles, air pistols, pellet boxes, and target papers are all included in your monthly training fee (₹4,700/mo) with certified coach guidance. Pioneer admission also includes a One-Time Annual Registration Fee of ₹5,000 for official shooter accreditation, shooter ID, and state/district trials affiliation.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                What are the academy practice timings?
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed pl-4">
                                The academy is open 7 days a week from 8:00 AM to 8:00 PM. Daily practice sessions typically last 1 to 1.5 hours, allowing flexible practice for school and working athletes.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                What is the cancellation and rescheduling policy?
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed pl-4">
                                You can reschedule your reserved slot up to 4 hours prior to the session via your dashboard or by calling reception at +91 9893270807 / 9294771208 with zero deduction.
                            </p>
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA BANNER */}
                <section className="bg-gradient-to-r from-[#FF6A1A] via-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-500/20">
                    <div className="space-y-2 max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-orange-100">
                            Ready to Elevate Your Game?
                        </span>
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                            Book a Free Trial Session or Campus Tour
                        </h3>
                        <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
                            Experience our Olympic surfaces firsthand. Meet our certified coaching panel and find the ideal training program.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                        <Link
                            to="/contact"
                            className="py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg transition-transform active:scale-98"
                        >
                            Schedule Free Tour
                        </Link>
                        <Link
                            to="/services"
                            className="py-3.5 px-6 rounded-xl bg-white text-slate-900 hover:bg-orange-50 font-bold text-xs uppercase tracking-wider text-center shadow-md transition-colors"
                        >
                            Explore Programs
                        </Link>
                    </div>
                </section>

            </div>

            {/* MODAL 1: FULL FACILITY SPECIFICATIONS */}
            <AnimatePresence>
                {selectedFacilityModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative my-8"
                        >
                            {/* Modal Header Media */}
                            <div className="relative h-48 sm:h-56 bg-slate-900">
                                <img
                                    src={selectedFacilityModal.image}
                                    alt={selectedFacilityModal.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                                
                                <button
                                    onClick={() => setSelectedFacilityModal(null)}
                                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors z-10"
                                >
                                    <FiX className="text-base" />
                                </button>

                                <div className="absolute bottom-4 left-6 right-6 text-white">
                                    <span className="text-[11px] font-bold text-[#FF6A1A] uppercase tracking-wider block">
                                        {selectedFacilityModal.sport} • {selectedFacilityModal.category}
                                    </span>
                                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                                        {selectedFacilityModal.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                                
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {selectedFacilityModal.summary}
                                </p>

                                {/* Technical Specs Grid */}
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Surface Specification</span>
                                        <strong className="text-slate-800 font-bold">{selectedFacilityModal.surface}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Court Dimensions</span>
                                        <strong className="text-slate-800 font-bold">{selectedFacilityModal.dimensions}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Lighting Lux Level</span>
                                        <strong className="text-slate-800 font-bold">{selectedFacilityModal.lighting}</strong>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Accreditation</span>
                                        <strong className="text-emerald-600 font-bold">{selectedFacilityModal.certification}</strong>
                                    </div>
                                </div>

                                {/* Key Highlights */}
                                <div className="space-y-2.5">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                                        Key Arena Features & Technology
                                    </h4>
                                    <ul className="space-y-2 text-xs text-slate-600">
                                        {selectedFacilityModal.highlights.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <FiCheckCircle className="text-[#FF6A1A] text-sm shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Equipment Provided */}
                                <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-4 space-y-1.5 text-xs text-slate-700">
                                    <strong className="font-bold text-slate-900 flex items-center gap-1.5">
                                        <GiWhistle className="text-[#FF6A1A] text-sm" /> Provided Onsite Equipment:
                                    </strong>
                                    <p className="text-slate-600">
                                        {selectedFacilityModal.equipmentProvided}
                                    </p>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Hourly Fee</span>
                                    <span className="font-display font-extrabold text-lg text-slate-900">
                                        {selectedFacilityModal.hourlyRate}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedFacilityModal(null)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            const f = selectedFacilityModal;
                                            setSelectedFacilityModal(null);
                                            setBookingFacilityModal(f);
                                        }}
                                        className="px-5 py-2.5 rounded-xl bg-[#FF6A1A] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                                    >
                                        Book This Arena
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL 2: INSTANT SLOT BOOKING FORM */}
            <AnimatePresence>
                {bookingFacilityModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative my-8"
                        >
                            {/* Header */}
                            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#FF6A1A] uppercase tracking-wider block">
                                        Slot Reservation
                                    </span>
                                    <h3 className="font-display font-bold text-lg text-white">
                                        {bookingFacilityModal.title}
                                    </h3>
                                    <span className="text-xs text-slate-400">
                                        {bookingFacilityModal.hourlyRate} • Indore Campus
                                    </span>
                                </div>
                                <button
                                    onClick={() => setBookingFacilityModal(null)}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                >
                                    <FiX />
                                </button>
                            </div>

                            {/* Booking Form */}
                            <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-4">
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Select Date
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Expected Players
                                        </label>
                                        <select
                                            value={playerCount}
                                            onChange={(e) => setPlayerCount(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                                        >
                                            <option value="1-2 Players">1 - 2 Players (Practice)</option>
                                            <option value="2-4 Players">2 - 4 Players (Doubles/Small)</option>
                                            <option value="5-10 Players">5 - 10 Players (Half Court)</option>
                                            <option value="11-22 Players">11 - 22 Players (Full Team Match)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Select Time Slot
                                    </label>
                                    <select
                                        value={bookingSlot}
                                        onChange={(e) => setBookingSlot(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF6A1A]"
                                    >
                                        <option value="Morning Dawn (06:00 AM - 08:00 AM)">Morning Dawn (06:00 AM - 08:00 AM)</option>
                                        <option value="Morning Batch (08:00 AM - 10:00 AM)">Morning Batch (08:00 AM - 10:00 AM)</option>
                                        <option value="Afternoon Session (02:00 PM - 04:00 PM)">Afternoon Session (02:00 PM - 04:00 PM)</option>
                                        <option value="Evening Prime (05:00 PM - 07:00 PM)">Evening Prime (05:00 PM - 07:00 PM)</option>
                                        <option value="Floodlight Night (07:30 PM - 09:30 PM)">Floodlight Night (07:30 PM - 09:30 PM)</option>
                                        <option value="Late Night Match (09:30 PM - 11:00 PM)">Late Night Match (09:30 PM - 11:00 PM)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Your Full Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Aryan Sharma"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+91 98932 70807"
                                            value={userPhone}
                                            onChange={(e) => setUserPhone(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6A1A]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                                    <div className="flex justify-between text-slate-700 font-semibold">
                                        <span>Arena:</span>
                                        <span className="text-slate-900">{bookingFacilityModal.title}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700 font-semibold">
                                        <span>Standard Rate:</span>
                                        <span className="text-[#FF6A1A]">{bookingFacilityModal.hourlyRate}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 pt-1">
                                        * Payment is settled upon arena arrival via Cash/UPI or auto-debited from your active Academy Pass.
                                    </p>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setBookingFacilityModal(null)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-98 transition-all"
                                    >
                                        Confirm Slot
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Catalog;