import React from 'react';
import {
  Calendar,
  Bell,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Phone
} from 'lucide-react';
import { SchoolEvent } from '../types';

interface EventsSectionProps {
  events: SchoolEvent[];
  onOpenContact?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onOpenContact }) => {
  return (
    <section id="events" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>News & Updates</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            School News, Events & Announcements
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Stay informed with current notices, parent-teacher interactions, examination alerts, and special school events.
          </p>
        </div>

        {/* Events Grid - Gordonstoun Cards without Rectangle Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt, idx) => (
            <div
              key={evt.id}
              className={`gordonstoun-card rounded-3xl transition-all duration-500 flex flex-col justify-between overflow-hidden backdrop-blur-md shadow-sm hover:shadow-2xl reveal-on-scroll reveal-delay-${(idx % 3) * 100} ${
                evt.isImportant
                  ? 'bg-gradient-to-b from-amber-50/95 to-white/90 shadow-md ring-2 ring-[#D4AF37]/50'
                  : 'bg-white/85 hover:bg-white/95'
              }`}
            >
              <div>
                {/* Optional Image */}
                {evt.image && (
                  <div className="h-48 overflow-hidden bg-slate-100 relative group">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {evt.isImportant && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-950" /> Important
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs shadow-2xs">
                      {evt.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-700" />
                      <span>{evt.date}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {evt.description}
                  </p>
                </div>
              </div>

              {onOpenContact && (
                <div className="px-6 pb-6 pt-0">
                  <button
                    onClick={onOpenContact}
                    className="gordonstoun-pill inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-900 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Contact Office for Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
