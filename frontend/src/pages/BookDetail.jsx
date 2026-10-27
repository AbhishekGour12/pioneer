// pages/BookDetail.jsx - Pioneer Rifle Shooting Academy Facility & Program Deep Dive
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  FiCalendar,
  FiStar,
  FiArrowLeft,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiClock,
  FiUser,
  FiAward,
  FiActivity,
  FiMapPin,
  FiPhone,
  FiCheck,
  FiTarget
} from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import { GiWhistle, GiMedal, GiLaurelCrown } from 'react-icons/gi';

const BookDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('curriculum');
  const [enrolled, setEnrolled] = useState(false);

  // Shooting Programs & Facilities Database
  const programsDb = {
    "1": {
      title: "10M Olympic Air Rifle Precision Championship Program",
      coach: "Coach Rajesh Sharma (ISSF / NRAI)",
      category: "10M Rifle Shooting",
      duration: "Daily Sessions (8:00 AM - 8:00 PM • 1 to 1.5 Hrs)",
      level: "Beginner to Championship",
      availableSlots: 6,
      totalSlots: 12,
      rating: 4.9,
      hourlyRate: "Included in Pass (₹4,700/mo)",
      image: "/images/shooting/shooting-squad-steps.jpg",
      description: "Olympic-spec 10M air rifle training focusing on stance alignment, cheekpiece geometry, natural point of aim (NPA), breath control, and consistent 10.9 shot release. Weapons, match pellets, and target papers are all included.",
      methodology: "Key Facility & Training Highlights:\n• 12 dedicated 10-meter shooting lanes with motorized paper target retrieval.\n• Master steady hold and trigger release under live match competition timing.\n• High-definition SCATT laser tracing for sighting stability and zero recoil follow-through.",
      modules: [
        "Shooting Jacket & Rifle Sling Fitment Biomechanics (Week 1-2)",
        "Natural Point of Aim (NPA) & Sight Picture Alignment (Week 3-4)",
        "Trigger Squeeze Rhythm & Smooth Follow-Through (Week 5-6)",
        "State & National Championship 60-Shot Match Simulations (Week 7-8)"
      ],
      gearRequired: [
        "Flat-soled athletic shoes or shooting boots",
        "Pioneer Shooting Academy Official Jersey (Provided on enrollment)",
        "Match-grade air rifles, pellets, and target papers (Provided by academy)",
        "Eye blinder / shooting glasses (Provided or personal)"
      ]
    },
    "2": {
      title: "10M Olympic Air Pistol Stance & Trigger Control Program",
      coach: "Coach Vikram Singh (National Medalist)",
      category: "10M Pistol Shooting",
      duration: "Daily Sessions (8:00 AM - 8:00 PM • 1 to 1.5 Hrs)",
      level: "Beginner to Advanced",
      availableSlots: 8,
      totalSlots: 12,
      rating: 4.9,
      hourlyRate: "Included in Pass (₹4,700/mo)",
      image: "/images/shooting/shooting-podium-girls.jpg",
      description: "Comprehensive 10M Air Pistol mastery developing single-handed isometric hold stability, front sight focus on the black bullseye, and smooth trigger release without jerking.",
      methodology: "Key Training Takeaways:\n• Custom anatomical grip fitment matching athlete hand anatomy.\n• Front sight elevation control and stable shoulder locking.\n• Timed match series simulation under ISSF 60-shot qualification rules.",
      modules: [
        "Anatomical Grip Customization & Arm Raise Trajectory (Week 1)",
        "Front-Sight Focus & Sight Alignment Centering (Week 2-3)",
        "Trigger Weight Sensitivity & Smooth Follow-Through (Week 4-5)",
        "District & State Level Qualification Match Trials (Week 6)"
      ],
      gearRequired: [
        "Comfortable athletic shoes with solid flat sole",
        "Pioneer Shooting Academy Training Kit",
        "Match air pistol & ammunition pellets (Provided by academy)",
        "Shooter logbook for shot grouping records"
      ]
    },
    "3": {
      title: "Beginner Safety, Stance & Foundation Shooting Course",
      coach: "Coach Ananya Sen (Shooting Lead)",
      category: "Beginner Foundation",
      duration: "Daily Sessions (8:00 AM - 8:00 PM • 1 to 1.5 Hrs)",
      level: "Zero Experience / Grassroots (Ages 8+)",
      availableSlots: 6,
      totalSlots: 15,
      rating: 4.9,
      hourlyRate: "Included in Pass (₹4,700/mo)",
      image: "/images/shooting/shooting-team-trophy.jpg",
      description: "The ideal starting point for youth and adults with zero prior shooting experience. Complete firearm safety protocols, master eye identification, posture balance, and your very first 10-ring bullseye shots.",
      methodology: "Key Beginner Drills:\n• Comprehensive range safety rules & weapon handling discipline.\n• Master eye testing and sighting geometry explanation.\n• Daily personalized coaching on trigger press and steady breathing.",
      modules: [
        "Range Safety Rules & Firearm Etiquette (Week 1)",
        "Master Eye Determination & Sight Picture Fundamentals (Week 2)",
        "Body Stance Balance & Diaphragmatic Breath Rhythm (Week 3-4)",
        "Scoring & Evaluation on 10M Target Papers (Week 5-6)"
      ],
      gearRequired: [
        "Standard sports attire and flat sneakers",
        "All weapons, pellets, and target papers provided by academy",
        "Beginner progress passport"
      ]
    },
    "4": {
      title: "SCATT Laser Sighting & Biomechanics Alignment Studio",
      coach: "Coach Rahul Nair (Biomechanics)",
      category: "Biomechanics Lab",
      duration: "Integrated into Daily Sessions",
      level: "All Trainees",
      availableSlots: 5,
      totalSlots: 10,
      rating: 4.9,
      hourlyRate: "Included in Pass (₹4,700/mo)",
      image: "/images/shooting/shooting-squad-outdoor.jpg",
      description: "High-tech optoelectronic trace analysis mapping sight sway, hold steadiness, and trigger release execution in real-time to convert 9s into steady 10.5+ inner 10s.",
      methodology: "Key Science Metrics:\n• 1.0s pre-trigger hold stability tracking.\n• Tremor reduction and heart rate pause synchronization.\n• Shot group displacement diagnostics.",
      modules: [
        "Hold Stability Mapping & Natural Point of Aim Alignment",
        "Trigger Jerk Identification & Smooth Release Synchronization",
        "Heart Rate & Respiratory Pause Integration"
      ],
      gearRequired: [
        "Shooting stance gear",
        "All sensors, computers, and analysis software provided"
      ]
    }
  };

  const program = programsDb[id] || programsDb["1"];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/facilities"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF6A1A] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <FiArrowLeft /> Back to Facilities & Arenas
          </Link>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          
          {/* Left Column: Image & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative bg-slate-900 h-80">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900/90 text-[#FF6A1A] border border-[#FF6A1A]/30 backdrop-blur-md">
                  {program.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="flex items-center gap-1 font-semibold">
                  <FiMapPin className="text-[#FF6A1A]" /> Pioneer Shooting Range, Mahalaxmi Nagar
                </span>
                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full font-bold text-[11px]">
                  {program.hourlyRate}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                Facility & Cohort Highlights
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Duration / Schedule:</span>
                  <strong className="text-slate-800">{program.duration}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Skill Level:</span>
                  <strong className="text-slate-800">{program.level}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Batch Availability:</span>
                  <strong className="text-[#FF6A1A] font-bold">{program.availableSlots} of {program.totalSlots} Slots Open</strong>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Annual Reg. Fee:</span>
                  <strong className="text-slate-800">₹5,000 (One-Time / Year)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Monthly Training Fee:</span>
                  <strong className="text-emerald-600 font-bold">₹4,700 / mo (All Consumables Included)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rating:</span>
                  <strong className="text-amber-500 flex items-center gap-1">
                    <FiStar className="fill-amber-400" /> {program.rating} / 5.0
                  </strong>
                </div>
              </div>

              <button
                onClick={() => setEnrolled(!enrolled)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  enrolled
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-[#FF6A1A] hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 active:scale-98'
                }`}
              >
                {enrolled ? (
                  <>
                    <FiCheck className="text-base" /> Batch Spot Reserved
                  </>
                ) : (
                  <>
                    <span>Reserve Training Spot</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Free trial sessions and court orientation available for new athletes.
              </p>
            </div>
          </div>

          {/* Right Column: Syllabus & Methodology */}
          <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <span className="text-xs font-bold text-[#FF6A1A] uppercase tracking-wider">
                {program.category} • Lead Coach: {program.coach}
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                {program.title}
              </h1>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {program.description}
            </p>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 gap-6 text-xs sm:text-sm font-bold pt-2">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'curriculum' ? 'text-[#FF6A1A] font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Training Curriculum
                {activeTab === 'curriculum' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('methodology')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'methodology' ? 'text-[#FF6A1A] font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Arena Specs & Technology
                {activeTab === 'methodology' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('gear')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'gear' ? 'text-[#FF6A1A] font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Gear & Footwear Rules
                {activeTab === 'gear' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A] rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'curriculum' && (
                <div className="space-y-3">
                  {program.modules.map((mod, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FF6A1A]/10 text-[#FF6A1A] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700">{mod}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'methodology' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <pre className="text-xs sm:text-sm text-slate-700 font-sans whitespace-pre-line leading-relaxed">
                    {program.methodology}
                  </pre>
                </div>
              )}

              {activeTab === 'gear' && (
                <div className="space-y-3">
                  {program.gearRequired.map((gear, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                      <FiCheckCircle className="text-emerald-500 shrink-0 text-base" />
                      <span>{gear}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookDetail;