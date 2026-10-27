// components/PioneerLogo.jsx - Pioneer Rifle Shooting Academy Official Logo & Branding
import React from 'react';

export const PioneerLogoIcon = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Tricolor Arcs */}
    <path 
      d="M 22 25 A 38 38 0 0 1 78 25" 
      stroke="#FF7A00" 
      strokeWidth="5" 
      strokeLinecap="round" 
    />
    <path 
      d="M 16 35 A 42 42 0 0 1 84 35" 
      stroke="#FF9933" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeDasharray="2 3"
    />
    <path 
      d="M 22 75 A 38 38 0 0 0 78 75" 
      stroke="#16A34A" 
      strokeWidth="5" 
      strokeLinecap="round" 
    />
    <path 
      d="M 16 65 A 42 42 0 0 0 84 65" 
      stroke="#22C55E" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeDasharray="2 3"
    />
    
    {/* Target concentric rings */}
    <circle cx="50" cy="50" r="32" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="24" stroke="#475569" strokeWidth="1.8" />
    <circle cx="50" cy="50" r="16" stroke="#64748B" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="8" stroke="#0F172A" strokeWidth="1.2" />
    <circle cx="50" cy="50" r="3.5" fill="#DC2626" />
    
    {/* Crosshairs */}
    <line x1="50" y1="14" x2="50" y2="28" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="50" y1="72" x2="50" y2="86" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="50" x2="28" y2="50" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="72" y1="50" x2="86" y2="50" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />

    {/* Shooter Silhouette with Rifle aiming right towards bullseye */}
    <path 
      d="M32 40 C32 37 34 35 37 35 C39 35 41 37 41 40 C41 42 39 43 37 43 C34 43 32 42 32 40 Z" 
      fill="#0F172A" 
    />
    {/* Cap visor */}
    <path d="M37 36 L43 37 L39 39 Z" fill="#0F172A" />
    {/* Torso & shooting stance */}
    <path 
      d="M33 44 C31 46 30 52 30 58 L37 58 C37 53 38 48 38 44 Z" 
      fill="#0F172A" 
    />
    {/* Shooting arm & Precision rifle aimed right */}
    <path 
      d="M34 46 L46 44 L54 44 L66 43.5 L66 45.5 L54 46 L46 47 L41 53 L38 52 L39 47 Z" 
      fill="#0F172A" 
    />
    {/* Rifle sight / scope */}
    <rect x="47" y="42" width="6" height="2" fill="#0F172A" rx="0.5" />
    <circle cx="66" cy="44.5" r="1.5" fill="#FF7A00" />
  </svg>
);

export const PioneerLogoBrand = ({ isDark = false, showTagline = true, className = "" }) => (
  <div className={`flex items-center gap-2.5 shrink-0 group ${className}`}>
    <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 drop-shadow-sm transition-transform group-hover:scale-105">
      <PioneerLogoIcon className="w-10 h-10 sm:w-11 sm:h-11" />
    </div>
    <div className="leading-tight">
      <div className="flex items-baseline">
        <span className={`font-display font-extrabold text-xl sm:text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          PIONEER
        </span>
      </div>
      <div className="flex items-center gap-1 -mt-0.5">
        <span className="text-[10px] sm:text-[11px] font-black text-[#FF6A1A] uppercase tracking-[0.14em]">
          RIFLE SHOOTING
        </span>
        <span className={`text-[9px] font-bold tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          ACADEMY
        </span>
      </div>
      {showTagline && (
        <span className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.18em] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          AIM • FOCUS • DISCIPLINE • EXCELLENCE
        </span>
      )}
    </div>
  </div>
);

export default PioneerLogoBrand;
