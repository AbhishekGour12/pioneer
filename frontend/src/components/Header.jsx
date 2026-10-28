// components/Header.jsx - PlayPeak Sports Academy Fully Responsive Navigation & Mobile Sidebar Drawer
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FiMenu,
    FiX,
    FiUser,
    FiLogOut,
    FiLayers,
    FiCheckCircle,
    FiChevronDown,
    FiPhone,
    FiHome,
    FiInfo,
    FiActivity,
    FiMapPin,
    FiAward,
    FiImage,
    FiCalendar,
    FiMail
} from 'react-icons/fi';
import { FaWhatsapp, FaQrcode } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { userinfo } from '../features/userinfo';
import { PioneerLogoBrand } from './PioneerLogo';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const user = useSelector((state) => state.user?.value) || JSON.parse(localStorage.getItem('libraryUser') || 'null');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navLinks = [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'About', path: '/about', icon: <FiInfo /> },
        { name: 'Programs', path: '/services', icon: <FiActivity /> },
        { name: 'Facilities', path: '/facilities', icon: <FiMapPin /> },
        { name: 'Gallery', path: '/gallery', icon: <FiImage /> },
        { name: 'Memberships', path: '/membership', icon: <FiAward /> },
        { name: 'Contact', path: '/contact', icon: <FiMail /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('libraryUser');
        dispatch(userinfo(null));
        navigate('/login');
    };

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsUserDropdownOpen(false);
    }, [location.pathname]);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 text-slate-800 transition-all shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Left: Brand Logo & Tagline */}
                        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                            <PioneerLogoBrand showTagline={true} />
                        </Link>

                        {/* Center: Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-[13px] xl:text-[14px] font-semibold transition-colors hover:text-[#FF6A1A] relative py-1 ${
                                            isActive
                                                ? 'text-[#FF6A1A] font-bold'
                                                : 'text-slate-600'
                                        }`}
                                    >
                                        <span>{link.name}</span>
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6A1A] rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {user && user.role === 'admin' ? (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/admin"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                                    >
                                        <FiLayers className="text-[#FF6A1A]" />
                                        <span>Admin Portal</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Sign Out"
                                    >
                                        <FiLogOut />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/membership"
                                    className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#FF6A1A] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02]"
                                >
                                    Enroll Now
                                </Link>
                            )}

                            {/* Mobile Hamburger / Sidebar Toggle Button */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:text-[#FF6A1A] hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6A1A]/30"
                                aria-label="Open Navigation Menu"
                            >
                                <FiMenu className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* FULL MOBILE SIDEBAR DRAWER (Sliding Navigation Menu) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />

                        {/* Sidebar Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                                <PioneerLogoBrand showTagline={false} />
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                                    aria-label="Close Navigation Menu"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 px-4 py-3 space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
                                    Navigation
                                </p>
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                isActive
                                                    ? 'bg-[#FF6A1A] text-white shadow-md shadow-orange-500/20'
                                                    : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A]'
                                            }`}
                                        >
                                            <span className="text-base">{link.icon}</span>
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}

                                {user && user.role === 'admin' && (
                                    <>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1">
                                            Admin Portal
                                        </p>
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#FF6A1A] transition-all"
                                        >
                                            <FiLayers className="text-base text-[#FF6A1A]" />
                                            <span>Admin Command Center</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Drawer Bottom Actions */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                                <Link
                                    to="/membership"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center py-2.5 bg-[#FF6A1A] hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                                >
                                    Explore Memberships
                                </Link>

                                {user && user.role === 'admin' ? (
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-xs transition-colors"
                                    >
                                        <FiLogOut /> Sign Out (Admin)
                                    </button>
                                ) : (
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-2 text-slate-600 hover:text-slate-900 rounded-xl font-semibold text-xs border border-slate-200 bg-white"
                                    >
                                        Contact Coaching Desk
                                    </Link>
                                )}

                                <div className="pt-2 text-center text-[10px] text-slate-400">
                                    <span>Pioneer Rifle Shooting Academy • 8:00 AM - 8:00 PM</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;