import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  Users,
  ExternalLink
} from 'lucide-react';
import { SchoolSettings, AdmissionApplication } from '../types';

interface ParentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SchoolSettings;
  onOpenAdmissions: () => void;
}

export const ParentPortalModal: React.FC<ParentPortalModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenAdmissions
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'status' | 'dates' | 'guidelines'>('overview');
  const [searchRef, setSearchRef] = useState('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; app?: AdmissionApplication; message?: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      // Inquire from public admission check endpoint or local DB search
      const res = await fetch(`/api/admissions`);
      if (res.ok) {
        const admissions: AdmissionApplication[] = await res.json();
        const cleanQuery = searchRef.trim().toLowerCase();
        const match = admissions.find(
          a => a.referenceNumber.toLowerCase() === cleanQuery ||
               a.studentName.toLowerCase().includes(cleanQuery) ||
               a.parentPhone.includes(cleanQuery)
        );

        if (match) {
          setSearchResult({ found: true, app: match });
        } else {
          setSearchResult({
            found: false,
            message: `No application found for "${searchRef}". Please check your Reference Number (e.g. ASAR-${new Date().getFullYear()}-0001) or call the admissions desk.`
          });
        }
      } else {
        setSearchResult({
          found: false,
          message: 'Unable to check status online right now. Please contact the school office directly via WhatsApp.'
        });
      }
    } catch {
      setSearchResult({
        found: false,
        message: 'Could not connect to the admissions system. Please try again or chat with school administration.'
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] gordonstoun-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002244] to-[#003366] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Parent Portal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
            <Users className="w-4 h-4" />
            <span>Our Community & Parent Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Family & Parent Resources
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md">
            Key academic dates, guidelines, dress code, and online application tracking.
          </p>

          {/* Navigation Tabs - Borderless Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-white/15">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'status', label: 'Track Application' },
              { id: 'dates', label: 'Key Dates' },
              { id: 'guidelines', label: 'Uniform & Dress' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`gordonstoun-pill px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm mb-1">
                    <Clock className="w-4 h-4 text-[#003366]" />
                    <span>Daily School Hours</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {settings.schoolTimings}
                  </p>
                  <p className="text-[11px] text-[#003366] font-semibold mt-2">
                    Assembly begins promptly at 8:00 AM.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Government Registration</span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono mt-1">
                    {settings.registrationNumber}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {settings.registrationAuthority}
                  </p>
                </div>
              </div>

              {/* Direct Admission Application CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#002244] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div>
                  <h4 className="font-bold text-sm text-[#D4AF37]">Admissions Session 2025–2026 Open</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Playgroup, Nursery, Prep, and Grades 1 through 5</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmissions();
                  }}
                  className="gordonstoun-pill gordonstoun-glow-gold px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c4a030] text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md"
                >
                  Apply Online Now
                </button>
              </div>

              {/* Quick Contact & WhatsApp */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl bg-slate-50 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Parent Help Desk</span>
                    <span className="text-[11px] text-slate-500">Fast assistance for admissions and fee inquiries</span>
                  </div>
                </div>
                {settings.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gordonstoun-pill px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Track Admission Application</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your assigned Reference Number (e.g. ASAR-2026-0001) or registered student name.
                </p>
              </div>

              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    placeholder="Enter Reference # or Student Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] bg-slate-50/70"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="gordonstoun-pill px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs shrink-0 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSearching ? 'Checking...' : 'Check Status'}
                </button>
              </form>

              {searchResult && searchResult.found && searchResult.app && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application Found</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Ref Number</span>
                      <span className="font-bold font-mono text-slate-900">{searchResult.app.referenceNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Student</span>
                      <span className="font-semibold text-slate-900">{searchResult.app.studentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Class</span>
                      <span className="font-semibold text-slate-900">{searchResult.app.applyingClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        searchResult.app.status === 'Approved'
                          ? 'bg-emerald-600 text-white'
                          : searchResult.app.status === 'Rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {searchResult.app.status}
                      </span>
                    </div>
                  </div>
                  {searchResult.app.adminNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-white text-xs border border-emerald-100 text-slate-600">
                      <span className="font-bold text-slate-800 block text-[11px]">Admin Remarks:</span>
                      {searchResult.app.adminNotes}
                    </div>
                  )}
                </div>
              )}

              {searchResult && !searchResult.found && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Application Not Found</span>
                  </div>
                  <p>{searchResult.message}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900">Academic Year 2025–2026 Key Dates</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">New Academic Admissions Open</span>
                    <span className="text-slate-500">Playgroup to Grade 5 registration window</span>
                  </div>
                  <span className="font-bold text-[#D4AF37] bg-slate-900 px-2.5 py-1 rounded-full text-[11px] shrink-0">Ongoing</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">First Term Parent-Teacher Discussion</span>
                    <span className="text-slate-500">Individual progress evaluation and feedback</span>
                  </div>
                  <span className="font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full text-[11px] shrink-0">Term 1</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Primary Sports & Cleanliness Week</span>
                    <span className="text-slate-500">Co-curricular activities, races, and habit building</span>
                  </div>
                  <span className="font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full text-[11px] shrink-0">Annual</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-3 text-xs text-slate-600">
              <h3 className="font-bold text-base text-slate-900">Uniform & Appearance Guidelines</h3>
              <p>
                All enrolled students are expected to arrive in neat, clean, and properly ironed school uniforms:
              </p>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>Prescribed Al-Asar school uniform with school crest/badge.</li>
                <li>Clean black shoes with socks.</li>
                <li>Neat, disciplined haircut for boys; tidy hairstyle with ribbon for girls.</li>
                <li>Proper school bag containing pencils, eraser, sharpener, and daily timetable books.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Al-Asar Model School • Lahor Swabi</span>
          <button
            onClick={onClose}
            className="gordonstoun-pill px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
