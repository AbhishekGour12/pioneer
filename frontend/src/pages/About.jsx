// pages/About.jsx - PlayPeak Sports Academy Story & Mission
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FiArrowRight,
    FiUsers,
    FiTarget,
    FiAward,
    FiCheckCircle,
    FiStar,
    FiHeart,
    FiShield
} from 'react-icons/fi';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { GiWhistle, GiLaurelCrown } from 'react-icons/gi';

const About = () => {
    // 4 Stats
    const stats = [
        {
            icon: <FiUsers className="w-5 h-5 text-[#FF6A1A]" />,
            number: '500+',
            label: 'Shooters Trained'
        },
        {
            icon: <GiWhistle className="w-5 h-5 text-[#FF6A1A]" />,
            number: '8 AM - 8 PM',
            label: 'Open All 7 Days'
        },
        {
            icon: <FiTarget className="w-5 h-5 text-[#FF6A1A]" />,
            number: '1 - 1.5 Hrs',
            label: 'Daily Session Duration'
        },
        {
            icon: <FaTrophy className="w-5 h-5 text-[#FF6A1A]" />,
            number: '₹4,700',
            label: 'Monthly (Weapons Included)'
        }
    ];

    // Core Values / Pillars - DISCIPLINE • FOCUS • CONSISTENCY • SUCCESS
    const corePillars = [
        {
            icon: <GiWhistle className="w-6 h-6 text-[#FF6A1A]" />,
            title: 'Discipline',
            desc: 'Strict range safety protocols, posture discipline, and dedicated training habits for high precision.'
        },
        {
            icon: <FiTarget className="w-6 h-6 text-blue-600" />,
            title: 'Focus',
            desc: 'Laser-sharp sight alignment, breath synchronization, and unwavering mental calmness at the trigger.'
        },
        {
            icon: <FiCheckCircle className="w-6 h-6 text-emerald-600" />,
            title: 'Consistency',
            desc: 'Daily 1 to 1.5 hour focused practice sessions building rock-solid trigger muscle memory and stance.'
        },
        {
            icon: <FaTrophy className="w-6 h-6 text-amber-500" />,
            title: 'Success',
            desc: 'Preparing champion shooters for district, state, and national podiums through structured match prep.'
        }
    ];

    // Coaching Faculty
    const coaches = [
        {
            name: "Coach Rajesh Sharma",
            role: "Head Coach - 10M Air Rifle",
            badge: "NRAI / ISSF Certified",
            desc: "14+ years of national shooting coaching. Guided numerous junior and senior shooters to state and national medals.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
        },
        {
            name: "Coach Vikram Singh",
            role: "Director of Pistol Development",
            badge: "National Medalist Coach",
            desc: "Expert in 10M Air Pistol trigger biomechanics, recoil stabilization, and high-pressure match temperament.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
        },
        {
            name: "Coach Ananya Sen",
            role: "Beginner Training & Foundation Lead",
            badge: "Certified Shooting Mentor",
            desc: "Specializes in firearm safety, stance foundation, sighting geometry, and youth athlete talent nurturing.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop"
        },
        {
            name: "Coach Rahul Nair",
            role: "Mental Focus & Biomechanics Coach",
            badge: "Sports Psychology Specialist",
            desc: "Focuses on breath control, heart rate synchronization, visual focus, and competitive match endurance.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop"
        }
    ];

    return (
        <div className="bg-white min-h-screen text-slate-800">
            
            {/* Header / Hero Banner */}
            <div className="relative bg-[#0A0E17] text-white py-20 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url('/images/shooting/shooting-team-trophy.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/80 to-[#070A0F]/40" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A1A]">
                            PIONEER RIFLE SHOOTING ACADEMY
                        </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                        Shoot Today, <br />
                        <span className="text-[#FF6A1A]">Then Lead Tomorrow.</span>
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        At Pioneer Rifle Shooting Academy, we provide a professional, disciplined and focused training environment for aspiring shooters. We don't just teach shooting, we build champions.
                    </p>
                </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-4 justify-center sm:justify-start">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="font-display text-3xl font-black text-slate-900 leading-none">{stat.number}</p>
                                <p className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story & Facility Split */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">
                                OUR MISSION & COMMITMENT
                            </span>
                        </div>

                        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                            Train Hard. Aim High. Achieve Excellence.
                        </h2>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            At Pioneer Rifle Shooting Academy, we provide a professional, disciplined and focused training environment for aspiring shooters. We are committed to providing quality training and helping every shooter develop discipline, focus, and competitive shooting skills in a safe, professional and supportive environment.
                        </p>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            With open timings from 8:00 AM to 8:00 PM across all days, our daily practice sessions generally last 1 to 1.5 hours. Our all-inclusive training fee covers weapons & equipment, pellet boxes, target papers, and certified coach support.
                        </p>

                        <div className="pt-2">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
                            >
                                Book a Trial Range Session <FiArrowRight />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column Photo with Badge */}
                    <div className="lg:col-span-6 relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                            <img 
                                src="/images/shooting/shooting-squad-steps.jpg" 
                                alt="Pioneer Shooting Academy Champions & Squad" 
                                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-5 -left-5 bg-slate-900 text-white p-5 rounded-3xl shadow-xl border border-white/10 hidden sm:block">
                            <p className="font-display font-black text-xl text-[#FF6A1A]">Pioneer Shooting Academy</p>
                            <p className="text-xs text-slate-300 mt-0.5">We don't just teach shooting, we build champions.</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Core Pillars Grid */}
            <div className="bg-slate-50 py-20 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">
                                CORE PILLARS
                            </span>
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Discipline • Focus • Consistency • Success
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {corePillars.map((pillar, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                    {pillar.icon}
                                </div>
                                <h3 className="font-display font-bold text-slate-900 text-base mb-2">
                                    {pillar.title}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Coaching Staff Showcase */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A1A]">
                            EXPERT COACHES
                        </span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                        Meet Our National Coaching Panel
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        Learn directly from certified national coaches and tournament veterans.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coaches.map((coach, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                        >
                            <div className="h-60 relative overflow-hidden bg-slate-100">
                                <img src={coach.image} alt={coach.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className="absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full bg-slate-900/85 text-[#FF6A1A] backdrop-blur-md">
                                    {coach.badge}
                                </span>
                            </div>

                            <div className="p-5 space-y-2 flex-grow">
                                <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-[#FF6A1A] transition-colors">
                                    {coach.name}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500">{coach.role}</p>
                                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                                    {coach.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom Call to Action */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
                        Ready to Start Your Shooting Journey?
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                        Shoot today, then lead tomorrow. Join Pioneer Rifle Shooting Academy today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/contact"
                            className="px-8 py-3.5 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-sm shadow-lg transition-all hover:scale-105"
                        >
                            Enquire Now <FiArrowRight className="inline ml-1" />
                        </Link>
                        <Link
                            to="/services"
                            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all"
                        >
                            Explore Programs
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;