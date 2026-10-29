// pages/Home.jsx - PlayPeak Sports Academy Official Landing Page
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiArrowRight,
    FiChevronLeft,
    FiChevronRight,
    FiPlay,
    FiPause,
    FiVolume2,
    FiVolumeX,
    FiUsers,
    FiUserCheck,
    FiAward,
    FiTarget,
    FiCheck,
    FiSearch,
    FiChevronDown
} from 'react-icons/fi';
import { 
    FaTrophy, 
    FaMedal
} from 'react-icons/fa';
import { 
    GiWhistle,
    GiLaurelCrown
} from 'react-icons/gi';
import { MdOutlineSportsScore, MdOutlineEmojiEvents } from 'react-icons/md';

const Home = () => {
    const videoRef = useRef(null);
    const heroSectionRef = useRef(null);
    const userWantsSound = useRef(true);
    const isHeroInView = useRef(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [activeHeroSlide, setActiveHeroSlide] = useState(1);
    const [galleryScrollIndex, setGalleryScrollIndex] = useState(0);

    // Initial Autoplay with Sound and User Gesture Handling
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Try playing with unmuted audio on load
        video.muted = false;
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsMuted(false);
                    setIsVideoPlaying(true);
                    userWantsSound.current = true;
                })
                .catch(() => {
                    // Browser policy fallback: play muted initially, then unmute on first gesture
                    video.muted = true;
                    setIsMuted(true);
                    video.play().catch(() => {});
                });
        }

        // Global gesture listener to immediately activate audio on first user tap/click
        const enableSoundOnGesture = () => {
            if (videoRef.current && isHeroInView.current && userWantsSound.current) {
                videoRef.current.muted = false;
                setIsMuted(false);
                videoRef.current.play().catch(() => {});
            }
        };

        window.addEventListener('click', enableSoundOnGesture, { once: true });
        window.addEventListener('touchstart', enableSoundOnGesture, { once: true });
        window.addEventListener('keydown', enableSoundOnGesture, { once: true });

        return () => {
            window.removeEventListener('click', enableSoundOnGesture);
            window.removeEventListener('touchstart', enableSoundOnGesture);
            window.removeEventListener('keydown', enableSoundOnGesture);
        };
    }, []);

    // IntersectionObserver: Automatically Stop Video & Audio when scrolling down, Restart when scrolling back up
    useEffect(() => {
        const heroEl = heroSectionRef.current;
        if (!heroEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = videoRef.current;
                    if (!video) return;

                    if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
                        // Hero section is visible on screen -> PLAY & UNMUTE
                        isHeroInView.current = true;
                        video.play().catch(() => {});
                        setIsVideoPlaying(true);

                        if (userWantsSound.current) {
                            video.muted = false;
                            setIsMuted(false);
                        }
                    } else {
                        // User scrolled away from Hero section -> STOP VIDEO & MUTE SOUND
                        isHeroInView.current = false;
                        video.pause();
                        video.muted = true;
                        setIsVideoPlaying(false);
                        setIsMuted(true);
                    }
                });
            },
            {
                threshold: [0, 0.15, 0.5]
            }
        );

        observer.observe(heroEl);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Explicit Audio & Video Controls
    const toggleAudio = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            const nextMuted = !isMuted;
            videoRef.current.muted = nextMuted;
            setIsMuted(nextMuted);
            userWantsSound.current = !nextMuted;
            if (!nextMuted) {
                videoRef.current.play().catch(() => {});
            }
        }
    };

    const toggleVideoPlay = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsVideoPlaying(true);
                if (userWantsSound.current) {
                    videoRef.current.muted = false;
                    setIsMuted(false);
                }
            } else {
                videoRef.current.pause();
                setIsVideoPlaying(false);
            }
        }
    };

    // 6 Shooting Programs
    const sportsPrograms = [
        {
            id: 'rifle',
            title: 'Rifle Shooting',
            subtitle: '10M Air Rifle Precision',
            icon: <FiTarget className="text-white text-base" />,
            image: '/images/shooting/program-rifle-10m.jpg',
            link: '/services'
        },
        {
            id: 'pistol',
            title: 'Pistol Shooting',
            subtitle: '10M Air Pistol Control',
            icon: <FiTarget className="text-white text-base" />,
            image: '/images/shooting/program-pistol-10m.jpg',
            link: '/services'
        },
        {
            id: 'beginner',
            title: 'Beginner Training',
            subtitle: 'Foundation & Safety',
            icon: <GiWhistle className="text-white text-base" />,
            image: '/images/shooting/program-beginner-course.jpg',
            link: '/services'
        },
        {
            id: 'competition',
            title: 'Championship Prep',
            subtitle: 'State & National Trials',
            icon: <FaTrophy className="text-white text-base" />,
            image: '/images/shooting/program-championship-prep.jpg',
            link: '/services'
        },
        {
            id: 'biomechanics',
            title: 'Stance & Focus',
            subtitle: 'Breath Control & IQ',
            icon: <FiTarget className="text-white text-base" />,
            image: '/images/shooting/program-stance-focus.jpg',
            link: '/services'
        },
        {
            id: 'daily-practice',
            title: 'Daily Practice',
            subtitle: '1 to 1.5 Hours Sessions',
            icon: <FiCheck className="text-white text-base" />,
            image: '/images/shooting/program-daily-practice.jpg',
            link: '/services'
        }
    ];

    // Gallery Images
    const galleryItems = [
        {
            id: 1,
            image: '/images/shooting/program-championship-prep.jpg',
            title: 'Pioneer Championship Victory & 1st Place Podium'
        },
        {
            id: 2,
            image: '/images/shooting/program-rifle-10m.jpg',
            title: '10M Precision Air Rifle Champion - Pioneer Squad'
        },
        {
            id: 3,
            image: '/images/shooting/program-pistol-10m.jpg',
            title: '10M Air Pistol State Medalist - Pioneer Shooter'
        },
        {
            id: 4,
            image: '/images/shooting/program-daily-practice.jpg',
            title: 'Pioneer Shooting Academy Daily Range Practice'
        },
        {
            id: 5,
            image: '/images/shooting/program-beginner-course.jpg',
            title: 'Expert Coach Mentoring Junior Shooter at Range'
        }
    ];

    return (
        <div className="bg-white text-slate-800 font-sans min-h-screen">
            
            {/* ========================================================================= */}
            {/* 1. HERO SECTION WITH CINEMATIC BACKGROUND VIDEO */}
            {/* ========================================================================= */}
            <section ref={heroSectionRef} className="relative min-h-[640px] lg:min-h-[720px] bg-[#070A0F] overflow-hidden flex items-center">
                
                {/* Background Hero Video */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
                >
                    <source src="/gemini_generated_video_bde3031e.mp4" type="video/mp4" />
                    {/* Fallback image if video cannot play */}
                    <img src="/images/shooting/program-championship-prep.jpg" alt="Pioneer Rifle Shooting Academy Champions" className="w-full h-full object-cover" />
                </video>

                {/* Dark Vignette and Gradient Overlays for High-Contrast Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/75 to-[#070A0F]/45 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-transparent to-[#070A0F]/40 pointer-events-none" />

                {/* Subtle Radial Glow */}
                <div className="absolute top-10 left-10 w-96 h-96 bg-[#FF6A1A]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Script Watermark in Background Right: "Shoot Then Lead" */}
                <div className="hidden lg:block absolute top-12 right-1/4 pointer-events-none select-none z-10 opacity-70">
                    <span className="font-script text-6xl xl:text-7xl text-white/40 tracking-wide rotate-[-8deg] block drop-shadow-md">
                        Shoot<br />Then<br />Lead
                    </span>
                </div>

                {/* Main Hero Container */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 z-20 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Left Hero Content */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Sub-heading kicker */}
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] sm:text-xs font-bold text-[#FF6A1A] tracking-[0.25em] uppercase">
                                    AIM • FOCUS • DISCIPLINE • EXCELLENCE
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight drop-shadow-sm">
                                Shoot Today, <br />
                                Then <span className="text-[#FF6A1A]">Lead</span> <br />
                                Tomorrow.
                            </h1>

                            {/* Paragraph description */}
                            <p className="text-slate-200 text-sm sm:text-base max-w-lg leading-relaxed font-normal drop-shadow-sm">
                                At Pioneer Rifle Shooting Academy, we provide a professional, disciplined and focused training environment for aspiring shooters.
                            </p>

                            {/* CTA Action Buttons & Video Controls */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-orange-500/25 hover:scale-105"
                                >
                                    Join Now <FiArrowRight className="text-base" />
                                </Link>

                                {/* Sound Toggle & Video Play Button */}
                                <button
                                    onClick={toggleAudio}
                                    className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full backdrop-blur-md border transition-all hover:scale-105 text-sm sm:text-base font-semibold ${
                                        isMuted
                                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                                            : 'bg-[#FF6A1A]/90 hover:bg-[#FF6A1A] text-white border-[#FF6A1A] shadow-lg shadow-orange-500/30'
                                    }`}
                                >
                                    <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs">
                                        {isMuted ? <FiVolumeX className="text-slate-900" /> : <FiVolume2 className="text-[#FF6A1A]" />}
                                    </div>
                                    <span>{isMuted ? 'Turn Sound On' : 'Audio Playing'}</span>
                                </button>

                                {/* Video Play/Pause Toggle */}
                                <button
                                    onClick={toggleVideoPlay}
                                    className="p-3.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/15 transition-transform hover:scale-110"
                                    title={isVideoPlaying ? "Pause Background Video" : "Play Background Video"}
                                >
                                    {isVideoPlaying ? <FiPause className="text-sm" /> : <FiPlay className="text-sm ml-0.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Right Hero Overlay Card & Play Widget */}
                        <div className="lg:col-span-5 flex flex-col items-end justify-between h-full space-y-12">
                            
                            {/* Glass Highlights Card on Right */}
                            <div className="w-full sm:w-80 bg-black/45 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4 shadow-2xl">
                                
                                <div className="flex items-start gap-3.5 pb-3 border-b border-white/10">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg shrink-0">
                                        <GiWhistle className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-tight">Academy Timings</h4>
                                        <p className="text-[11px] text-slate-300">8:00 AM TO 8:00 PM (All Days)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 pb-3 border-b border-white/10">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg shrink-0">
                                        <FiTarget className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-tight">Daily Practice Sessions</h4>
                                        <p className="text-[11px] text-slate-300">Duration: 1 to 1.5 Hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 pb-3 border-b border-white/10">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg shrink-0">
                                        <FaTrophy className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-tight">Fee Structure</h4>
                                        <p className="text-[11px] text-slate-300">Annual Reg: ₹5,000 | Monthly: ₹4,700</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg shrink-0">
                                        <FiCheck className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white leading-tight">Training Fee Includes</h4>
                                        <p className="text-[11px] text-slate-300">Pellets, Targets, Weapons & Coaching</p>
                                    </div>
                                </div>

                            </div>

                            {/* Floating Sound / Video interactive pill */}
                            <div 
                                onClick={toggleAudio}
                                className="hidden sm:flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 cursor-pointer hover:border-[#FF6A1A]/50 transition-all hover:scale-105"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#FF6A1A] flex items-center justify-center shadow-lg text-white">
                                    {isMuted ? <FiVolumeX className="text-sm" /> : <FiVolume2 className="text-sm" />}
                                </div>
                                <div className="text-left text-xs font-semibold text-white leading-tight">
                                    <p className="text-white font-bold">{isMuted ? 'Click to Listen' : 'Voice / Sound ON'}</p>
                                    <p className="text-slate-400 text-[10px]">{isMuted ? 'Audio currently muted' : 'Cinematic Soundtrack'}</p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Bottom Indicator Bar */}
                    <div className="pt-12 flex items-center justify-between border-t border-white/10 mt-12 text-xs text-slate-400">
                        {/* Down Chevron */}
                        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                            <FiChevronDown className="text-base animate-bounce" />
                            <span className="text-[11px] uppercase tracking-wider text-slate-400">Explore Academy</span>
                        </div>

                        {/* Scroll Pagination */}
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                            <span className="tracking-widest uppercase text-slate-400">SCROLL</span>
                            <div className="w-16 h-[1.5px] bg-slate-600 relative overflow-hidden rounded-full">
                                <div className="w-6 h-full bg-[#FF6A1A] rounded-full" />
                            </div>
                            <span className="font-bold text-white">01</span>
                            <span className="text-slate-500">02</span>
                            <span className="text-slate-500">03</span>
                        </div>
                    </div>

                </div>
            </section>


            {/* ========================================================================= */}
            {/* 2. SECTION: EXPLORE OUR SPORTS PROGRAMS */}
            {/* ========================================================================= */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">
                                    OUR PROGRAMS
                                </span>
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Explore Our Shooting Programs
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Train in precision shooting with expert coaching and structured programs for all age groups.
                            </p>
                        </div>

                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all"
                        >
                            View All Programs <FiArrowRight />
                        </Link>
                    </div>

                    {/* 6 Programs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                        {sportsPrograms.map((prog) => (
                            <Link
                                key={prog.id}
                                to="/services"
                                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block bg-slate-900 h-64 sm:h-72"
                            >
                                {/* Image with zoom on hover */}
                                <img
                                    src={prog.image}
                                    alt={prog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                                />

                                {/* Gradient shadow overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                {/* Icon top left watermark/circle */}
                                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    {prog.icon}
                                </div>

                                {/* Content bottom overlay */}
                                <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-end justify-between gap-1">
                                    <div>
                                        <h3 className="font-display font-extrabold text-white text-base leading-tight group-hover:text-[#FF6A1A] transition-colors">
                                            {prog.title}
                                        </h3>
                                        <p className="text-[10px] text-slate-300 mt-0.5 truncate">
                                            {prog.subtitle}
                                        </p>
                                    </div>

                                    {/* Circular arrow button */}
                                    <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-md group-hover:bg-[#FF6A1A] group-hover:text-white transition-colors">
                                        <FiChevronRight className="text-xs" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>


            {/* ========================================================================= */}
            {/* 3. SECTION: STATS RIBBON (NAVY + ORANGE SLICE) */}
            {/* ========================================================================= */}
            <section className="bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                        
                        {/* Left Navy 4 Stats */}
                        <div className="lg:col-span-8 py-6 sm:py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
                            
                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-slate-300">
                                    <FiUsers />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-2xl sm:text-3xl font-black text-white leading-none">500+</p>
                                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Shooters Trained</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-slate-300">
                                    <FiTarget />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-2xl sm:text-3xl font-black text-white leading-none">8 AM - 8 PM</p>
                                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Open All Days</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-slate-300">
                                    <FiAward />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-2xl sm:text-3xl font-black text-white leading-none">1 - 1.5 Hrs</p>
                                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Daily Practice</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-slate-300">
                                    <FaTrophy />
                                </div>
                                <div className="text-left">
                                    <p className="font-display text-2xl sm:text-3xl font-black text-white leading-none">₹4,700</p>
                                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Monthly All-Inclusive</p>
                                </div>
                            </div>

                        </div>

                        {/* Right Orange Ribbon Tab */}
                        <div className="lg:col-span-4 bg-[#FF6A1A] py-6 px-6 sm:px-8 flex items-center gap-4 rounded-t-2xl lg:rounded-t-none lg:rounded-l-3xl shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl shrink-0">
                                <GiLaurelCrown />
                            </div>
                            <div>
                                <h4 className="font-display font-black text-white text-lg leading-tight">
                                    Building Champions
                                </h4>
                                <p className="text-xs font-semibold text-orange-100">
                                    Discipline • Focus • Success
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ========================================================================= */}
            {/* 4. SECTION: ABOUT PLAYPEAK / MORE THAN AN ACADEMY */}
            {/* ========================================================================= */}
            <section className="py-16 sm:py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        
                        {/* Left Column: Heading & Description */}
                        <div className="lg:col-span-4 space-y-5">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">
                                    ABOUT PIONEER RIFLE SHOOTING ACADEMY
                                </span>
                            </div>

                            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                                Shoot Today, <br />
                                Then Lead Tomorrow
                            </h2>

                            <p className="text-slate-600 text-sm leading-relaxed">
                                At Pioneer Rifle Shooting Academy, we provide a professional, disciplined and focused training environment for aspiring shooters. We are committed to providing quality training and helping every shooter develop discipline, focus, and competitive shooting skills in a safe, professional and supportive environment.
                            </p>

                            <div className="pt-2">
                                <Link
                                    to="/about"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 font-semibold text-xs sm:text-sm transition-all"
                                >
                                    Know Our Story <FiArrowRight />
                                </Link>
                            </div>
                        </div>

                        {/* Academy Feature Cards */}
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                                    <FiTarget />
                                </div>
                                <div>
                                    <h4 className="font-display font-bold text-slate-900 text-sm">Weapons & Equipment Provided</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        Olympic-spec match rifles and pistols available for training.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                                    <FiCheck />
                                </div>
                                <div>
                                    <h4 className="font-display font-bold text-slate-900 text-sm">Pellet Boxes & Target Papers</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        All training consumables included in the monthly fee.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>


            {/* ========================================================================= */}
            {/* 5. SECTION: GALLERY / MOMENTS THAT INSPIRE */}
            {/* ========================================================================= */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">
                                    GALLERY
                                </span>
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Moments That Inspire
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                A glimpse into our training sessions, tournaments and academy life.
                            </p>
                        </div>

                        <Link
                            to="/gallery"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-all self-start sm:self-auto"
                        >
                            View Gallery <FiArrowRight />
                        </Link>
                    </div>

                    {/* Carousel Row with Arrows */}
                    <div className="relative">
                        
                        {/* Left Arrow */}
                        <button
                            onClick={() => setGalleryScrollIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-30 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#FF6A1A] hover:scale-110 transition-all"
                            aria-label="Previous Slide"
                        >
                            <FiChevronLeft className="text-lg" />
                        </button>

                        {/* Gallery 5 Images Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-hidden">
                            {galleryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl overflow-hidden shadow-sm group h-44 sm:h-52 bg-slate-100 relative"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={() => setGalleryScrollIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-30 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#FF6A1A] hover:scale-110 transition-all"
                            aria-label="Next Slide"
                        >
                            <FiChevronRight className="text-lg" />
                        </button>
                    </div>

                </div>
            </section>

            {/* ========================================================================= */}
            {/* 6. SECTION: BOTTOM CTA / YOUR SPORTING JOURNEY STARTS HERE */}
            {/* ========================================================================= */}
            <section className="relative overflow-hidden bg-[#0A0E17] text-white py-20 lg:py-24">
                
                {/* Background Shooting Championship Photo */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: `url('/images/shooting/shooting-team-trophy.jpg')` }}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/80 to-[#070A0F]/40" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        
                        {/* Left Title and Subtitle */}
                        <div className="space-y-2 max-w-xl">
                            <h2 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
                                Your Shooting Journey <br />
                                <span className="text-[#FF6A1A]">Starts Here</span>
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base font-normal">
                                Train Hard. Aim High. Achieve Excellence.
                            </p>
                        </div>

                        {/* Right CTA Button & Script Text */}
                        <div className="flex flex-col items-center md:items-end space-y-3 shrink-0">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all"
                            >
                                Enquire Now <FiArrowRight className="text-base" />
                            </Link>

                            {/* Script text below button */}
                            <span className="font-script text-2xl sm:text-3xl text-white/90 tracking-wide rotate-[-3deg] block">
                                Shoot Today <span className="text-[#FF6A1A]">Lead Tomorrow</span>
                            </span>
                        </div>

                    </div>
                </div>

            </section>

        </div>
    );
};

export default Home;