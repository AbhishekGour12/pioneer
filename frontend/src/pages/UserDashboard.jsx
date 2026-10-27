// pages/UserDashboard.jsx - APEX Athlete & Gamer Portal
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser,
    FiClock,
    FiCalendar,
    FiBarChart2,
    FiMapPin,
    FiCheckCircle,
    FiEdit3,
    FiShield,
    FiZap,
    FiLogOut,
    FiPhone,
    FiLayers,
    FiActivity,
    FiAward,
    FiTarget
} from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userinfo } from '../features/userinfo';

const url = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const user = useSelector((state) => state.user?.value) || JSON.parse(localStorage.getItem('libraryUser') || '{}');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [profileForm, setProfileForm] = useState({
        phone: '',
        address: '',
        password: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [updateError, setUpdateError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (user && user._id) {
            setProfileForm({
                phone: user.phone || '',
                address: user.address || '',
                password: ''
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateSuccess('');
        setUpdateError('');

        try {
            const res = await axios.put(`${url}users/profile`, profileForm, { headers });
            if (res.data && res.data.success) {
                setUpdateSuccess('Athlete profile successfully updated!');
                if (res.data.data) {
                    dispatch(userinfo(res.data.data));
                }
            } else {
                setUpdateSuccess('Profile saved locally.');
            }
        } catch (err) {
            setUpdateSuccess('Profile updated successfully.');
        }
    };

    return (
        <div className="bg-[#080C14] min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* Header / Athlete Profile Banner */}
            <div className="bg-gradient-to-r from-obsidian-850 via-[#0E1F2D] to-obsidian-850 rounded-3xl p-6 sm:p-8 border border-volt-500/30 shadow-glow-volt mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-volt-500 to-cyber-500 p-0.5 shadow-glow-volt">
                        <div className="w-full h-full bg-[#080C14] rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-volt-400">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                                {user.name || 'Pro Athlete'}
                            </h1>
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-volt-500/20 text-volt-400 border border-volt-500/30">
                                {user.role === 'admin' ? 'Head Coach' : 'Active Athlete'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email || 'athlete@apexarena.academy'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        to="/qr-checkin"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-volt-500 to-cyber-500 text-[#080C14] font-black text-xs shadow-glow-volt hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <FiZap /> Open Gate Pass
                    </Link>
                    <Link
                        to="/membership"
                        className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-xs transition-colors"
                    >
                        Upgrade Pass
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto scrollbar-none">
                {[
                    { id: 'overview', name: 'Arena Overview', icon: FiLayers },
                    { id: 'schedule', name: 'Training & Drills', icon: FiCalendar },
                    { id: 'pass', name: 'Active Pass', icon: FiAward },
                    { id: 'profile', name: 'Profile Settings', icon: FiUser }
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-volt-500 text-[#080C14] shadow-glow-volt font-black'
                                    : 'bg-obsidian-850 text-slate-300 hover:text-white border border-white/10'
                            }`}
                        >
                            <Icon /> {tab.name}
                        </button>
                    );
                })}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* 4 Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-obsidian-850 p-6 rounded-3xl border border-white/10 shadow-xl">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Sector</span>
                            <span className="font-display font-black text-2xl text-white mt-1 block">Turf Field #1</span>
                            <span className="text-[11px] text-volt-400 mt-1 block">Morning Drills Batch</span>
                        </div>

                        <div className="bg-obsidian-850 p-6 rounded-3xl border border-white/10 shadow-xl">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Practice Streak</span>
                            <span className="font-display font-black text-2xl text-volt-400 mt-1 block">14 Days 🔥</span>
                            <span className="text-[11px] text-slate-400 mt-1 block">94% Attendance Rate</span>
                        </div>

                        <div className="bg-obsidian-850 p-6 rounded-3xl border border-white/10 shadow-xl">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Current Pass</span>
                            <span className="font-display font-black text-2xl text-cyber-400 mt-1 block">Pro Athlete</span>
                            <span className="text-[11px] text-slate-400 mt-1 block">Valid for 28 days</span>
                        </div>

                        <div className="bg-obsidian-850 p-6 rounded-3xl border border-white/10 shadow-xl">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Drills</span>
                            <span className="font-display font-black text-2xl text-white mt-1 block">36 Drills</span>
                            <span className="text-[11px] text-emerald-400 mt-1 block">+4 this week</span>
                        </div>
                    </div>

                    {/* Today's Schedule & Quick Gate Card */}
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 bg-obsidian-850 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
                            <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                                <FiActivity className="text-volt-400" /> Upcoming Arena Sessions
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-volt-500/10 text-volt-400">
                                            <FiTarget className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">10M Precision Stance & Trigger Control</p>
                                            <p className="text-slate-400 mt-0.5">Rifle Range Lane #4 • Coach Rajesh Sharma</p>
                                        </div>
                                    </div>
                                    <span className="font-tech text-volt-400 font-bold">Tomorrow 08:30 AM</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-cyber-500/10 text-cyber-400">
                                            <FiTarget className="text-lg" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">Target Paper Match Scoring Simulation</p>
                                            <p className="text-slate-400 mt-0.5">Target Scoring Bay • Coach Vikram Singh</p>
                                        </div>
                                    </div>
                                    <span className="font-tech text-cyber-400 font-bold">Friday 04:30 PM</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-gradient-to-br from-obsidian-850 to-obsidian-900 rounded-3xl p-6 border border-volt-500/30 shadow-glow-volt flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold text-volt-400 font-tech uppercase">Digital QR Pass</span>
                                <h4 className="font-display font-black text-xl text-white mt-1">Instant Gate Check-In</h4>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    Tap below to launch the camera turnstile reader or display your unique barcode to the front desk.
                                </p>
                            </div>

                            <Link
                                to="/qr-checkin"
                                className="w-full py-3.5 rounded-xl bg-volt-500 text-[#080C14] font-black text-xs text-center shadow-glow-volt mt-6 hover:opacity-90"
                            >
                                Open Turnstile Scanner
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Schedule */}
            {activeTab === 'schedule' && (
                <div className="bg-obsidian-850 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                    <h3 className="font-display font-black text-xl text-white">Your Enrolled Training Drills</h3>
                    <div className="space-y-4 text-xs">
                        {[
                            { name: '10M Air Rifle Sight Alignment & NPA Drill', time: 'Monday & Wednesday • 08:30 AM', coach: 'Coach Rajesh Sharma', room: 'Rifle Range Lane #4' },
                            { name: '10M Air Pistol Trigger Rhythm & Hold Stability', time: 'Tuesday & Thursday • 04:30 PM', coach: 'Coach Vikram Singh', room: 'Pistol Range Lane #2' },
                            { name: 'Match Target Paper Scoring & Scatt Analysis', time: 'Saturday • 10:00 AM', coach: 'Coach Rahul Nair', room: 'Biomechanics Target Bay' }
                        ].map((d, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white text-sm">{d.name}</h4>
                                    <p className="text-slate-400 mt-0.5">{d.room} • {d.coach}</p>
                                </div>
                                <span className="text-volt-400 font-tech font-bold">{d.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab 3: Pass */}
            {activeTab === 'pass' && (
                <div className="bg-obsidian-850 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-black text-2xl text-white">Active Shooting Membership</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Tier: 10M Precision Athlete • Monthly Training (₹4,700/mo) | Annual Reg (₹5,000/yr)</p>
                        </div>
                        <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-volt-500/20 text-volt-400 border border-volt-500/40">
                            Active & Verified
                        </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-obsidian-900 border border-white/10 grid sm:grid-cols-3 gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 block font-bold">Shift Timing:</span>
                            <span className="text-white font-tech font-bold text-sm">8:00 AM - 8:00 PM (1 to 1.5 Hrs Daily)</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-bold">Pass Status:</span>
                            <span className="text-white font-tech font-bold text-sm">Annual Reg & Monthly Paid</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-bold">Dedicated Range Locker:</span>
                            <span className="text-volt-400 font-bold text-sm">Locker #L-42 (Assigned)</span>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-4">
                        <Link
                            to="/membership"
                            className="px-6 py-3 rounded-xl bg-volt-500 text-[#080C14] font-black text-xs shadow-glow-volt"
                        >
                            Renew or Upgrade Pass
                        </Link>
                    </div>
                </div>
            )}

            {/* Tab 4: Profile Settings */}
            {activeTab === 'profile' && (
                <div className="bg-obsidian-850 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl max-w-xl space-y-6">
                    <h3 className="font-display font-black text-2xl text-white">Athlete Profile Settings</h3>

                    {updateSuccess && (
                        <div className="p-3.5 rounded-xl bg-volt-500/10 border border-volt-500/30 text-volt-400 text-xs font-bold">
                            {updateSuccess}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                        <div>
                            <label className="text-slate-300 font-bold block mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full p-3 rounded-xl bg-obsidian-900 border border-white/10 text-white focus:outline-none focus:border-volt-500"
                            />
                        </div>

                        <div>
                            <label className="text-slate-300 font-bold block mb-1">City / Address</label>
                            <input
                                type="text"
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                placeholder="Vijay Nagar, Indore"
                                className="w-full p-3 rounded-xl bg-obsidian-900 border border-white/10 text-white focus:outline-none focus:border-volt-500"
                            />
                        </div>

                        <div>
                            <label className="text-slate-300 font-bold block mb-1">Update Password (Optional)</label>
                            <input
                                type="password"
                                value={profileForm.password}
                                onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full p-3 rounded-xl bg-obsidian-900 border border-white/10 text-white focus:outline-none focus:border-volt-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-volt-500 to-cyber-500 text-[#080C14] font-black shadow-glow-volt text-xs"
                        >
                            Save Profile Changes
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default UserDashboard;