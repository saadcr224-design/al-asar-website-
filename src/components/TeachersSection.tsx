import React from 'react';
import {
  GraduationCap,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { Teacher } from '../types';

interface TeachersSectionProps {
  teachers: Teacher[];
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({ teachers }) => {
  if (!teachers || teachers.length === 0) {
    return null;
  }

  return (
    <section id="teachers" className="py-14 sm:py-20 bg-transparent border-b border-sky-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
            Dedicated Educators
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Our Teachers
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Our caring teachers are committed to providing personalized guidance, foundational academic skills, and good manners to young primary students.
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white/75 backdrop-blur-md rounded-2xl overflow-hidden border border-white/90 shadow-md hover:shadow-2xl hover:border-sky-300/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-64 overflow-hidden bg-slate-200 relative">
                  {teacher.photo ? (
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                      <UserCheck className="w-16 h-16 text-[#D4AF37]" />
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs text-[#D4AF37] text-xs font-semibold px-3 py-1 rounded-md shadow-xs border border-[#D4AF37]/30">
                    {teacher.position}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mb-3">
                    Primary Faculty
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {teacher.bio}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 text-[11px] text-slate-500 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                <span>Al-Asar International Model School</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
