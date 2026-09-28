import React from 'react';
import {
  Target,
  Eye,
  Quote,
  MapPin,
  Award,
  Check,
  UserCheck,
  Compass
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface AboutSectionProps {
  settings: SchoolSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>About Our Institution</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            About Al-Asar International Model School
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            {settings.aboutText}
          </p>
        </div>

        {/* School Overview Cards - Zero Rectangle Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          {/* Who We Serve */}
          <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 hover:bg-white/95 shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll">
            <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Our Community</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Conveniently located in Lahor (Chota Lahore), Swabi, serving families seeking disciplined and supportive primary school education for their young children.
            </p>
          </div>

          {/* Primary Education Focus */}
          <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 hover:bg-white/95 shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll reveal-delay-100">
            <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
              <Target className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {settings.mission}
            </p>
          </div>

          {/* Vision for Learners */}
          <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 hover:bg-white/95 shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll reveal-delay-200">
            <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
              <Eye className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {settings.vision}
            </p>
          </div>

        </div>

        {/* Focus Areas Checklist - Zero Rectangle Frame */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 mb-14 shadow-2xl reveal-on-scroll">
          <div className="max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">
              Primary Learning Focus at Al-Asar
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              We concentrate strictly on essential primary education needs so children develop clear conceptual foundations without unnecessary stress:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Basic Reading & Writing Readiness</span>
            </div>
            <div className="flex items-start gap-2.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Foundational Arithmetic & Logic</span>
            </div>
            <div className="flex items-start gap-2.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Good Islamic & Social Manners</span>
            </div>
            <div className="flex items-start gap-2.5 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>Individual Student Attention</span>
            </div>
          </div>
        </div>

        {/* Head of School / Administration Message */}
        {settings.principalMessage && (
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto reveal-on-scroll">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {settings.principalPhoto ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 shadow-lg ring-2 ring-[#D4AF37]">
                  <img
                    src={settings.principalPhoto}
                    alt={settings.principalName || "Head of School"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-900 text-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
                  <UserCheck className="w-9 h-9" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <Quote className="w-8 h-8 text-[#D4AF37] opacity-60 mb-2 mx-auto sm:mx-0" />
                <p className="text-slate-700 italic text-sm sm:text-base leading-relaxed mb-4">
                  "{settings.principalMessage}"
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {settings.principalName || "School Administration Desk"}
                  </h4>
                  <p className="text-xs text-[#003366] font-semibold">
                    Al-Asar International Model School, Lahor Swabi
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
