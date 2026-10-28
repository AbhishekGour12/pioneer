// components/Footer.jsx - Pioneer Rifle Shooting Academy Footer
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaInstagram, FaYoutube, FaFacebook, FaTwitter } from 'react-icons/fa';
import { PioneerLogoBrand } from './PioneerLogo';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="inline-block group">
                            <PioneerLogoBrand isDark={true} showTagline={true} />
                        </Link>

                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            At Pioneer Rifle Shooting Academy, we provide a professional, disciplined and focused training environment for aspiring shooters. We don't just teach shooting, we build champions.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaFacebook />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaYoutube />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF6A1A] transition-colors">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    {/* Shooting Programs */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Programs</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">10M Rifle Shooting</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">10M Pistol Shooting</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Beginner Training Course</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Competitive Match Prep</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Target Biomechanics & Stance</Link></li>
                            <li><Link to="/services" className="hover:text-[#FF6A1A] transition-colors">Daily Practice (1 - 1.5 Hrs)</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li><Link to="/about" className="hover:text-[#FF6A1A] transition-colors">About Pioneer Academy</Link></li>
                            <li><Link to="/facilities" className="hover:text-[#FF6A1A] transition-colors">Shooting Range & Armory</Link></li>
                            <li><Link to="/membership" className="hover:text-[#FF6A1A] transition-colors">Fee Structure & Inclusions</Link></li>
                            <li><Link to="/enroll" className="hover:text-[#FF6A1A] transition-colors font-semibold text-orange-400">Athlete Self-Enroll (QR)</Link></li>
                            <li><Link to="/gallery" className="hover:text-[#FF6A1A] transition-colors">Academy Gallery</Link></li>
                            <li><Link to="/contact" className="hover:text-[#FF6A1A] transition-colors">Book Range Visit</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Academy Location */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
                        <div className="space-y-2.5 text-xs text-slate-400">
                            <p className="flex items-start gap-2.5">
                                <FiMapPin className="text-[#FF6A1A] shrink-0 mt-0.5" />
                                <span>Sector R Mahalaxmi Nagar, Near Pioneer Convent School, Indore 452010</span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <FiPhone className="text-[#FF6A1A] shrink-0" />
                                <span>+91 9893270807 / +91 9294771208</span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <FiMail className="text-[#FF6A1A] shrink-0" />
                                <span>pioneershootingindore@gmail.com</span>
                            </p>
                            <p className="flex items-start gap-2.5">
                                <FiClock className="text-[#FF6A1A] shrink-0 mt-0.5" />
                                <span>Mon - Sun: 8:00 AM - 8:00 PM (Open All Days • 1 - 1.5 Hrs/Session)</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Bottom Rights */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Pioneer Rifle Shooting Academy. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/membership" className="hover:text-slate-300">Fee Structure (₹4,700/mo)</Link>
                        <Link to="/contact" className="hover:text-slate-400">Privacy Policy</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;