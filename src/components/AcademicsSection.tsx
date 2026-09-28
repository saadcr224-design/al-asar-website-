import React from 'react';
import {
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { SchoolClass, SchoolSubject } from '../types';

interface AcademicsSectionProps {
  classes: SchoolClass[];
  subjects: SchoolSubject[];
  onOpenApply: () => void;
}

export const AcademicsSection: React.FC<AcademicsSectionProps> = ({
  classes,
  subjects,
  onOpenApply
}) => {
  const learningApproaches = [
    {
      title: 'Understanding Basic Concepts',
      desc: 'Focusing on conceptual clarity rather than rote memorization, helping children truly comprehend numbers, letters, and nature.'
    },
    {
      title: 'Reading & Writing Skills',
      desc: 'Step-by-step guidance in English and Urdu phonics, word formation, spelling, and neat handwriting.'
    },
    {
      title: 'Primary Mathematics',
      desc: 'Intuitive number sense, addition, subtraction, shapes, counting, and simple everyday problem-solving.'
    },
    {
      title: 'Active Classroom Participation',
      desc: 'Encouraging young learners to ask questions, read aloud, answer queries, and participate joyfully.'
    },
    {
      title: 'Good Manners & Moral Values',
      desc: 'Embedding Islamic morals (Adaab), respectful speech, greeting elders, sharing, and honesty.'
    },
    {
      title: 'Confidence & Creative Activities',
      desc: 'Building self-esteem through drawing, recitation, group activities, and regular positive encouragement.'
    }
  ];

  return (
    <section id="academics" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curriculum & Learning By Age</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            Primary Academics
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Our curriculum is thoughtfully tailored for early childhood and primary stages, establishing strong foundations in literacy, numeracy, and character development.
          </p>
        </div>

        {/* 1. Classes Offered Grid */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 reveal-on-scroll">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-800" />
                <span>Primary Classes Offered (By Age)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Playgroup through Grade 5 foundational primary education.
              </p>
            </div>
            <button
              onClick={onOpenApply}
              className="gordonstoun-pill gordonstoun-glow-gold inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-950 bg-[#D4AF37] hover:bg-[#c4a030] px-6 py-2.5 rounded-full shadow-md self-start sm:self-auto cursor-pointer transition-all active:scale-95"
            >
              <span>Enquire for Class Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {classes.map((cls, idx) => (
              <div
                key={cls.id}
                className={`gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between reveal-on-scroll reveal-delay-${(idx % 4) * 100}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-sky-100/90 text-slate-900 text-xs font-bold shadow-2xs">
                      {cls.name}
                    </span>
                    {cls.ageGroup && (
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {cls.ageGroup}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {cls.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-bold text-[#003366]">
                  <span>Foundational Stage</span>
                  <span className="text-[#D4AF37]">Class #{cls.order}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Key Primary Subjects */}
        <div className="mb-16">
          <div className="mb-8 reveal-on-scroll">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-slate-800" />
              <span>Core Primary Subjects</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Structured to develop reading, writing, mathematical thinking, and values.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((sub, idx) => (
              <div
                key={sub.id}
                className={`gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll reveal-delay-${(idx % 3) * 100}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {sub.name}
                  </h4>
                  {sub.category && (
                    <span className="text-[10px] uppercase font-bold text-[#003366] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {sub.category}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Learning Approach Principles */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl reveal-on-scroll">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
              Teaching Methodology
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              How We Teach Young Learners
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs sm:text-sm">
            {learningApproaches.map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-5 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-[#D4AF37] mb-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
