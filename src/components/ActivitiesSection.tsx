import React from 'react';
import {
  Sparkles,
  Trophy,
  Palette,
  BookOpen,
  PartyPopper,
  Compass
} from 'lucide-react';
import { Activity } from '../types';

interface ActivitiesSectionProps {
  activities: Activity[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'sports':
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case 'art & craft':
      case 'art':
      case 'drawing':
        return <Palette className="w-4 h-4 text-rose-600" />;
      case 'literacy':
      case 'reading':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'celebrations':
        return <PartyPopper className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <section id="activities" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Life at School</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            Student Activities & Co-Curricular Life
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Joyful co-curricular and physical activities designed to build character, teamwork, fine motor skills, and confidence in young primary students.
          </p>
        </div>

        {/* Activities Grid - Gordonstoun Cards without Rectangle Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, idx) => (
            <div
              key={activity.id}
              className={`gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between reveal-on-scroll reveal-delay-${(idx % 4) * 100}`}
            >
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 shadow-sm">
                    {getCategoryIcon(activity.category)}
                    <span>{activity.category}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors leading-snug">
                    {activity.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {activity.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-5 pt-0 text-[11px] font-bold text-[#003366] flex items-center gap-1">
                <span>Al-Asar Student Life</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
