// pages/Services.jsx - Pioneer Rifle Shooting Academy Programs & Facilities
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiChevronRight,
  FiCheckCircle,
  FiX,
  FiInfo,
  FiCalendar,
  FiClock,
  FiUsers,
  FiAward,
  FiTarget
} from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import { GiWhistle, GiLaurelCrown } from 'react-icons/gi';
import { MdOutlineSportsScore } from 'react-icons/md';

const Services = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const sportsPrograms = [
    {
      id: 'rifle-10m',
      category: 'Rifle Shooting',
      title: '10M Air Rifle Shooting',
      subtitle: 'Aim | Focus | Precision Posture',
      ageGroup: 'Ages 8 - Adult',
      schedule: 'Daily Sessions (8:00 AM - 8:00 PM • 1 to 1.5 Hrs)',
      coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
      image: '/images/shooting/program-rifle-10m.jpg',
      icon: <FiTarget className="text-[#FF6A1A] text-xl" />,
      tag: 'Olympic 10M Precision',
      overview: 'Professional 10M Olympic Air Rifle training focusing on body posture, cheekpiece adjustment, natural point of aim, breath control, and consistent 10.9 shot release.',
      curriculum: [
        'Shooting jacket & rifle sling fitment biomechanics',
        'Target paper alignment & natural point of aim (NPA)',
        'Trigger squeeze rhythm and smooth follow-through',
        'State & National Shooting Championship trials prep'
      ]
    },
    {
      id: 'pistol-10m',
      category: 'Pistol Shooting',
      title: '10M Air Pistol Shooting',
      subtitle: 'Focus | Grip | Trigger Discipline',
      ageGroup: 'Ages 10 - Adult',
      schedule: 'Daily Sessions (8:00 AM - 8:00 PM • 1 to 1.5 Hrs)',
      coach: 'Coach Vikram Singh (National Medalist)',
      image: '/images/shooting/program-pistol-10m.jpg',
      icon: <FiTarget className="text-[#FF6A1A] text-xl" />,
      tag: 'Olympic 10M Precision',
      overview: 'Master the art of 10M Air Pistol with expert coaching in single-handed stance, isometric grip stability, front-sight focus, and trigger control under match pressure.',
      curriculum: [
        'Anatomical grip customization & arm raise trajectory',
        'Sight picture focus & front post centering on bullseye',
        'Trigger weight sensitivity & zero recoil follow-through',
        'National Rifle Association of India (NRAI) trial coaching'
      ]
    },
    {
      id: 'beginner-course',
      category: 'Beginner Training',
      title: 'Beginner Training Course',
      subtitle: 'Safety | Stance | First 10s',
      ageGroup: 'Ages 8 - 18 yrs & Adults',
      schedule: 'Open All Days (8:00 AM - 8:00 PM • 1 to 1.5 Hrs)',
      coach: 'Coach Ananya Sen (Shooting Lead)',
      image: '/images/shooting/program-beginner-course.jpg',
      icon: <GiWhistle className="text-[#FF6A1A] text-xl" />,
      tag: 'Equipment Included',
      overview: 'Comprehensive foundation course for aspiring shooters with zero prior experience. Complete safety protocols, rifle & pistol handling, weapons, pellets, and target papers included.',
      curriculum: [
        'Range safety rules & firearm discipline',
        'Master eye determination & sighting fundamentals',
        'Body posture balance & steady breathing rhythm',
        'Introductory scoring on standard 10M target papers'
      ]
    },
    {
      id: 'championship-prep',
      category: 'Competitive Prep',
      title: 'Competitive Championship Prep',
      subtitle: 'Discipline | Consistency | Success',
      ageGroup: 'Junior & Senior Shooters',
      schedule: 'Morning & Evening Batches (1.5 Hrs)',
      coach: 'Master Coach & NRAI Mentors',
      image: '/images/shooting/program-championship-prep.jpg',
      icon: <FaTrophy className="text-[#FF6A1A] text-xl" />,
      tag: 'Medal Track',
      overview: 'Intensive competitive match training program designed to prepare shooters for district leagues, state championships, national trials, and Khelo India tournaments.',
      curriculum: [
        'Match simulation under 60-shot ISSF competition timing',
        'Heart rate regulation & match psychology',
        'Shot card data logging & pellet group analysis',
        'Equipment tuning and electronic target training'
      ]
    },
    {
      id: 'target-biomechanics',
      category: 'Competitive Prep',
      title: 'Target Biomechanics & Breath Control',
      subtitle: 'Pulse Sync | Eye Focus | Core Stability',
      ageGroup: 'All Trainees',
      schedule: 'Integrated into Daily Sessions',
      coach: 'Coach Rahul Nair (Performance Mentor)',
      image: '/images/shooting/program-stance-focus.jpg',
      icon: <FiCheckCircle className="text-[#FF6A1A] text-xl" />,
      tag: 'Precision Science',
      overview: 'Specialized sports biomechanics training that eliminates micro-wobble, optimizes respiratory pauses, and improves hold stability on the 10-ring.',
      curriculum: [
        'Diaphragmatic breathing and respiratory pause mastery',
        'Core stabilization drills for rifle and pistol hold',
        'Eye fatigue prevention & optical contrast training',
        'Heart rate management between scoring shots'
      ]
    },
    {
      id: 'daily-practice-pass',
      category: 'Beginner Training',
      title: 'Daily Practice Sessions',
      subtitle: 'Duration: 1 to 1.5 Hours | All Days',
      ageGroup: 'All Registered Athletes',
      schedule: '8:00 AM TO 8:00 PM (All 7 Days)',
      coach: 'Expert Coaching Support',
      image: '/images/shooting/program-daily-practice.jpg',
      icon: <FiCheckCircle className="text-[#FF6A1A] text-xl" />,
      tag: '₹4,700/mo Inclusive',
      overview: 'Flexible daily practice sessions designed around student and working professional schedules. Training fee includes pellet boxes, target papers, weapons and equipment.',
      curriculum: [
        'Flexible 1 to 1.5 hour training slots every single day',
        'Full access to match-grade weapons and shooting lanes',
        'High-grade pellet boxes and target papers provided',
        'Continuous personalized coach feedback every lane session'
      ]
    }
  ];

  const filteredPrograms = activeFilter === 'All' 
    ? sportsPrograms 
    : sportsPrograms.filter(p => p.category === activeFilter);

  const categories = ['All', 'Rifle Shooting', 'Pistol Shooting', 'Beginner Training', 'Competitive Prep'];

  return (
    <div className="bg-white min-h-screen text-slate-800">
      
      {/* Hero Header */}
      <div className="relative bg-[#0A0E17] text-white py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('/images/shooting/shooting-winners-podium.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/80 to-[#070A0F]/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A1A]">
              PIONEER SHOOTING PROGRAMS
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Explore Our Shooting Programs & <br />
            <span className="text-[#FF6A1A]">Precision Facilities</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            At Pioneer Rifle Shooting Academy, we provide a professional, disciplined and focused training environment for aspiring shooters. Shoot today, then lead tomorrow.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-[#FF6A1A] text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="h-56 relative overflow-hidden bg-slate-900">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-md border border-white/20">
                    {prog.tag}
                  </span>

                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs font-semibold text-[#FF6A1A] block">{prog.category}</span>
                    <h3 className="font-display font-extrabold text-2xl text-white leading-none mt-0.5">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {prog.overview}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-[#FF6A1A] shrink-0" />
                      <span><strong>Eligibility:</strong> {prog.ageGroup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-[#FF6A1A] shrink-0" />
                      <span><strong>Schedule:</strong> {prog.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GiWhistle className="text-[#FF6A1A] shrink-0 text-sm" />
                      <span><strong>Head Coach:</strong> {prog.coach}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => setSelectedSport(prog)}
                  className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiInfo /> View Syllabus
                </button>
                <Link
                  to="/contact"
                  className="flex-1 py-3 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  Book Trial <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Academy Fee Policy & Admission Structure Section */}
      <section className="bg-slate-50 py-16 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/70 border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
              <span className="text-[11px] font-bold text-[#FF6A1A] uppercase tracking-wider">
                Official Academy Membership Structure
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
              Transparent, All-Inclusive <span className="text-[#FF6A1A]">Shooting Fees</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No hidden costs or weapon rental surprises. Pioneer Rifle Shooting Academy operates under a standardized official fee policy: a one-time annual registration fee of ₹5,000 and an all-inclusive monthly training fee of ₹4,700 per month.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 1. One-Time Annual Registration Fee */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg relative flex flex-col justify-between">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                  Mandatory Annual Fee
                </span>
                <div className="mt-4 mb-2">
                  <h3 className="font-display font-black text-2xl text-slate-900">
                    One-Time Annual Registration Fee
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Valid for 1 Full Year • Shooter Accreditation & Affiliation
                  </p>
                </div>
                <div className="my-6 py-4 border-y border-slate-100 flex items-baseline gap-2">
                  <span className="font-display font-black text-4xl sm:text-5xl text-slate-900">
                    ₹5,000
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ 1-Time Annual Fee</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-[#FF6A1A] shrink-0 text-sm" />
                    <span>Official Pioneer Shooter ID Card & Member Record</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-[#FF6A1A] shrink-0 text-sm" />
                    <span>Digital Turnstile QR Gate Pass & Locker Room Access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-[#FF6A1A] shrink-0 text-sm" />
                    <span>Affiliation for District, State & National Shooting Trials</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-[#FF6A1A] shrink-0 text-sm" />
                    <span>Weapon Armory Safety Inspection & Stance Fitting</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  to="/enroll"
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Register Student Online</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>

            {/* 2. Monthly Training Fee */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#FF6A1A] shadow-xl relative flex flex-col justify-between">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF6A1A] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                Official Monthly Training Fee
              </span>
              <div>
                <span className="px-3.5 py-1 rounded-full bg-orange-100 text-[#FF6A1A] text-[10px] font-bold uppercase tracking-wider">
                  All-Inclusive Pass
                </span>
                <div className="mt-4 mb-2">
                  <h3 className="font-display font-black text-2xl text-slate-900">
                    Monthly Training Fee
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Open All 7 Days (8:00 AM - 8:00 PM) • 1 to 1.5 Hrs Daily
                  </p>
                </div>
                <div className="my-6 py-4 border-y border-slate-100 flex items-baseline gap-2">
                  <span className="font-display font-black text-4xl sm:text-5xl text-[#FF6A1A]">
                    ₹4,700
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ per month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                    <span>Daily 1 to 1.5 Hour Dedicated Range Practice Sessions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                    <span>High-Grade Pellet Boxes Included in Fee</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                    <span>Official 10M Target Papers Provided Every Session</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                    <span>Match-Grade Air Rifles & Air Pistols Access (Zero Rental)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                    <span>Continuous Certified ISSF / NRAI Coaching Mentorship</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  to="/enroll"
                  className="w-full py-3.5 rounded-2xl bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
                >
                  <span>Enroll in Monthly Training</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedSport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedSport(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <FiX />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">
                  {selectedSport.icon}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-slate-900">
                    {selectedSport.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#FF6A1A]">
                    {selectedSport.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                {selectedSport.overview}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-2 text-xs text-slate-700 border border-slate-100">
                <p><strong>Training Batches:</strong> {selectedSport.schedule}</p>
                <p><strong>Age Category:</strong> {selectedSport.ageGroup}</p>
                <p><strong>Mentored By:</strong> {selectedSport.coach}</p>
              </div>

              <h4 className="font-display font-bold text-sm text-slate-900 mb-3">
                Core Training Modules:
              </h4>

              <div className="space-y-2.5 mb-8">
                {selectedSport.curriculum.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FiCheckCircle className="text-[#FF6A1A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link
                  to="/contact"
                  onClick={() => setSelectedSport(null)}
                  className="flex-1 text-center py-3 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  Enroll in {selectedSport.title}
                </Link>
                <button
                  onClick={() => setSelectedSport(null)}
                  className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Services;