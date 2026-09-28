import React from 'react';
import {
  GraduationCap,
  Heart,
  Smile,
  Shield,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface WelcomeSectionProps {
  settings: SchoolSettings;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ settings }) => {
  const pillars = [
    {
      icon: <GraduationCap className="w-5 h-5 text-slate-800" />,
      title: 'Quality Primary Education',
      description: 'Solid basic foundations in reading, writing, mathematics, and science through clear, conceptual teaching.'
    },
    {
      icon: <Heart className="w-5 h-5 text-[#D4AF37]" />,
      title: 'Caring & Attentive Teachers',
      description: 'Dedicated educators who give individual attention and encourage every young child with patience and kindness.'
    },
    {
      icon: <Smile className="w-5 h-5 text-slate-800" />,
      title: 'Child-Friendly Atmosphere',
      description: 'A warm, safe, and joyful space where primary students feel comfortable, valued, and excited to learn.'
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-600" />,
      title: 'Discipline & Good Manners',
      description: 'Instilling polite behavior, moral values (Adaab), respect for elders, and cleanliness in daily routine.'
    },
    {
      icon: <BookOpen className="w-5 h-5 text-slate-800" />,
      title: 'Basic Academic Development',
      description: 'Step-by-step learning designed for young minds to absorb language and numerical concepts without stress.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
      title: 'Confidence & Expression',
      description: 'Encouraging classroom questions, speech, reading out loud, and participation in simple school activities.'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Gordonstoun Smooth Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Foundational Excellence</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            Welcome to Al-Asar International Model School
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            {settings.welcomeText}
          </p>
        </div>

        {/* Content Grid: Text + Core Pillars & School Image */}
        {settings.welcomeImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Image with School Atmosphere */}
            <div className="lg:col-span-5 order-2 lg:order-1 reveal-on-scroll reveal-delay-100">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md p-2 group">
                <img
                  src={settings.welcomeImage}
                  alt={`${settings.name} Classroom and Learning`}
                  className="w-full h-72 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Pillars Grid - Zero Rectangle Box Styling */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`gordonstoun-card bg-white/85 backdrop-blur-md p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll reveal-delay-${(idx % 4) * 100}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-100/90 flex items-center justify-center mb-3 text-slate-900 shadow-2xs">
                      {pillar.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`gordonstoun-card bg-white/85 backdrop-blur-md p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll reveal-delay-${(idx % 3) * 100}`}
              >
                <div className="w-11 h-11 rounded-full bg-sky-100/90 flex items-center justify-center mb-4 text-slate-900 shadow-2xs">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
