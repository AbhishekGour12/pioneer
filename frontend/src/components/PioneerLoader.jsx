// components/PioneerLoader.jsx - Pioneer Rifle Shooting Academy Official Themed Loader
import React from 'react';
import { motion } from 'framer-motion';

const PioneerLoader = ({ 
    fullScreen = true, 
    message = "Target Range Loading...", 
    subMessage = "Precision • Discipline • Focus" 
}) => {
    const content = (
        <div className="flex flex-col items-center justify-center p-6 text-center select-none">
            {/* Precision Rifle Crosshair & Target Reticle */}
            <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outer Rotating Calibration Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-orange-500/20 border-dashed"
                />

                {/* Second Precision Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute inset-2 rounded-full border border-slate-700/60"
                >
                    {/* Compass / Mil-dot ticks */}
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#FF6A1A]" />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#FF6A1A]" />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-[#FF6A1A]" />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-[#FF6A1A]" />
                </motion.div>

                {/* Inner 9 & 10 Rings */}
                <div className="absolute inset-5 rounded-full border-2 border-slate-800 bg-slate-950/80 shadow-inner flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border border-orange-500/40 flex items-center justify-center">
                        {/* 10.9 Center Bullseye */}
                        <motion.div
                            animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                            className="w-4 h-4 rounded-full bg-[#FF6A1A] shadow-lg shadow-orange-500/60 flex items-center justify-center"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        </motion.div>
                    </div>
                </div>

                {/* Crosshair Laser Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6A1A]/60 to-transparent" />
                    <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#FF6A1A]/60 to-transparent" />
                </div>

                {/* Concentric Pulse Wave */}
                <motion.div
                    animate={{ scale: [0.8, 1.4], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#FF6A1A]/50 pointer-events-none"
                />
            </div>

            {/* Academy Typography Branding */}
            <div className="mt-6 space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                    <span className="font-display font-black text-xl tracking-[0.25em] text-white">
                        PIONEER
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-[#FF6A1A] text-white uppercase tracking-wider">
                        10M
                    </span>
                </div>
                
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#FF6A1A] uppercase">
                    RIFLE SHOOTING ACADEMY
                </p>

                <p className="text-xs text-slate-400 font-semibold pt-1 animate-pulse">
                    {message}
                </p>

                {subMessage && (
                    <p className="text-[10px] text-slate-500 tracking-widest uppercase">
                        {subMessage}
                    </p>
                )}
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A0F] text-white">
                {/* Subtle Background Glow */}
                <div className="absolute w-96 h-96 rounded-full bg-[#FF6A1A]/10 blur-3xl pointer-events-none" />
                {content}
            </div>
        );
    }

    return content;
};

export default PioneerLoader;
