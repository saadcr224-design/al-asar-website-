import React from 'react';
import {
  ArrowRight,
  BookOpen,
  FileCheck,
  Users,
  Compass,
  Sparkles,
  MapPin
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface HeroProps {
  settings: SchoolSettings;
  onNavigate: (sectionId: string) => void;
  onOpenParentPortal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onNavigate, onOpenParentPortal }) => {
  const heroBgImage = settings.backgroundImage || settings.heroImage || settings.welcomeImage || '/assets/website-background.jpg';

  return (
    <section className="relative overflow-hidden text-white py-14 sm:py-20 lg:py-28 min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center justify-center">
      {/* Background Image Container with Gordonstoun subtle slow scale float */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroBgImage}
          alt={`${settings.name} Campus`}
          className="w-full h-full object-cover object-center sm:object-[center_28%] filter brightness-95 contrast-105 transition-transform duration-1000 ease-out hover:scale-105"
        />
        {/* Soft Luxurious Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/60 to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        
        {/* Floating Admission Status Pill - Zero Rectangle Box */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md text-[#D4AF37] text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 animate-gordonstoun-float">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{settings.admissionStatus || 'Admissions Open 2025–2026'}</span>
        </div>

        {/* School Main Heading with Gordonstoun Typographic Presence */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
            {settings.name}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
            {settings.subName} • {settings.location}
          </p>
          <p className="text-xs sm:text-sm md:text-base text-[#D4AF37] italic font-semibold pt-1 max-w-xl mx-auto">
            "{settings.tagline}"
          </p>
        </div>

        {/* Primary Hero Actions - Pure Fluid Pills without Rectangle Boxes */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 max-w-md sm:max-w-none mx-auto w-full">
          <button
            onClick={() => onNavigate('admissions')}
            id="hero-apply-button"
            className="w-full sm:w-auto gordonstoun-pill gordonstoun-glow-gold inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c4a030] text-slate-950 font-bold text-sm sm:text-base shadow-xl transition-all duration-300 active:scale-95 cursor-pointer min-h-[46px]"
          >
            <FileCheck className="w-4 h-4 text-slate-950 shrink-0" />
            <span>Apply for Admission (2025–26)</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={() => onNavigate('about')}
            id="hero-about-button"
            className="w-full sm:w-auto gordonstoun-pill inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base backdrop-blur-md shadow-lg transition-all duration-300 active:scale-95 cursor-pointer min-h-[46px]"
          >
            <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
            <span>About School</span>
          </button>

          {onOpenParentPortal && (
            <button
              onClick={onOpenParentPortal}
              id="hero-parent-portal-button"
              className="w-full sm:w-auto gordonstoun-pill inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#003366]/80 hover:bg-[#003366] text-[#D4AF37] font-semibold text-sm sm:text-base backdrop-blur-md shadow-lg transition-all duration-300 active:scale-95 cursor-pointer min-h-[46px]"
            >
              <Users className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Parent Portal</span>
            </button>
          )}
        </div>

        {/* Dunham School Quick Portal Shortcuts - Fluid Borderless Pill Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Quick Endpoints:
          </span>
          {[
            { id: 'academics', label: 'Academics / By Age' },
            { id: 'life-at-school', label: 'Life at School' },
            { id: 'gallery', label: 'Photo Gallery' },
            { id: 'news-events', label: 'News & Notices' },
            { id: 'contact', label: 'Contact & Map' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="gordonstoun-pill px-4 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white backdrop-blur-md shadow-xs transition-all duration-200 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
