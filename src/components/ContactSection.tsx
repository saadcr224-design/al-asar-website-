import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ShieldCheck,
  Navigation,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface ContactSectionProps {
  settings: SchoolSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [quickTopic, setQuickTopic] = useState<string>('Admissions 2025–26 Enquiry');
  const [customNote, setCustomNote] = useState<string>('');

  const officialPhone = settings.phone || '03404333571';
  const officialWhatsapp = settings.whatsappNumber || '03404333571';
  const cleanWhatsapp = officialWhatsapp.replace(/[^0-9]/g, '');

  const quickInquiryTopics = [
    { label: 'Admissions 2025–26', query: 'Admissions for Session 2025–26' },
    { label: 'Playgroup to Grade 5 Classes', query: 'Playgroup to Grade 5 Primary Classes Information' },
    { label: 'School Timings & Visit', query: 'School Office Timings & Campus Visit appointment' },
    { label: 'Fee Structure & Details', query: 'Fee Structure and Admission Requirements' }
  ];

  const handleLaunchWhatsApp = (customMessage?: string) => {
    const textToSend = customMessage || `${quickTopic}${customNote ? `: ${customNote}` : ''}`;
    const encoded = encodeURIComponent(
      `*Al-Asar International Model School Lahor Swabi*\n\n` +
      `*Enquiry:* ${textToSend}\n\n` +
      `_Connecting via School Official Website_`
    );
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encoded}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-on-scroll">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-xs mb-3">
            <Phone className="w-3.5 h-3.5 text-[#003366]" />
            <span>Direct School Office & Contact Desk</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            Contact School Administration
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            Reach out directly to Al-Asar International Model School in Lahor (Chota Lahore), Swabi. Connect instantly via WhatsApp or call our administration office.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct WhatsApp & Call Interactive Station */}
          <div className="lg:col-span-6 space-y-6 reveal-on-scroll">
            
            {/* Primary WhatsApp Card - Zero Box Frame */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shrink-0">
                    <MessageCircle className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                      Official Instant Messaging
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      Direct WhatsApp Helpline
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs shrink-0">
                  Online
                </span>
              </div>

              <div className="bg-black/30 backdrop-blur-xs rounded-2xl p-4 mb-6">
                <span className="text-xs text-slate-300 block mb-1">Direct School WhatsApp Number:</span>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-300 tracking-wider">
                  {officialWhatsapp}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Click below to chat instantly with the administration for admissions, fees, and questions.
                </p>
              </div>

              {/* Quick WhatsApp Inquiry Buttons - Fluid Pills */}
              <div className="space-y-3 mb-6">
                <span className="text-xs font-bold text-slate-200 block uppercase tracking-wide">
                  Choose an Inquiry Topic:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickInquiryTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuickTopic(topic.query)}
                      className={`gordonstoun-pill p-3 rounded-full text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                        quickTopic === topic.query
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                    >
                      <span className="line-clamp-1">{topic.label}</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${quickTopic === topic.query ? 'text-white' : 'opacity-40'}`} />
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Optional: add student name or specific question..."
                    className="w-full text-xs px-4 py-3 rounded-full bg-black/40 text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 border-none"
                  />
                </div>
              </div>

              {/* Direct Open WhatsApp Button - Pure Fluid Pill */}
              <button
                type="button"
                onClick={() => handleLaunchWhatsApp()}
                id="contact-section-direct-whatsapp-btn"
                className="w-full py-4 px-8 rounded-full gordonstoun-pill bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950 shrink-0" />
                <span>Open WhatsApp Chat ({officialWhatsapp})</span>
              </button>
            </div>

            {/* Direct Phone Call Card */}
            <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#003366] text-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Direct Phone Line
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-0.5">
                    {officialPhone}
                  </div>
                  <p className="text-xs text-slate-600">
                    Available during school office hours for inquiries.
                  </p>
                </div>
              </div>

              <a
                href={`tel:${officialPhone}`}
                id="contact-section-call-button"
                className="gordonstoun-pill inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#003366] hover:bg-[#002244] text-[#D4AF37] hover:text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call School Office</span>
              </a>
            </div>

            {/* Timings & Office Hours Card */}
            <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Official School Timings</h4>
                  <p className="text-xs text-slate-500">Academic & Office Hours</p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Monday – Thursday:</span>
                  <span className="font-bold text-slate-900">8:00 AM – 1:30 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Friday:</span>
                  <span className="font-bold text-slate-900">8:00 AM – 12:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50">
                  <span className="font-semibold text-amber-900">Saturday & Sunday:</span>
                  <span className="font-bold text-amber-800">Closed (Weekend)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Physical Address, KPPSRA Registration, and Map */}
          <div className="lg:col-span-6 space-y-6 reveal-on-scroll reveal-delay-200">
            
            {/* School Location & Registration Card */}
            <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Physical Campus Location
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                    Lahor (Chota Lahore), Swabi
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {settings.location}
                  </p>
                  <p className="text-xs text-[#003366] font-semibold mt-1">
                    District Swabi, Khyber Pakhtunkhwa, Pakistan
                  </p>
                </div>
              </div>

              {/* Registration */}
              <div className="p-4 rounded-2xl bg-slate-50 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Government Accreditation
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 block">
                    {settings.registrationNumber}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {settings.registrationAuthority}
                  </span>
                </div>
              </div>

              {/* Get Directions Button - Fluid Pill */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lahor+Swabi+Khyber+Pakhtunkhwa+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="gordonstoun-pill w-full py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>Open in Google Maps (Get Directions)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

            </div>

            {/* Interactive Embedded Google Map */}
            <div className="gordonstoun-card bg-white/85 backdrop-blur-md rounded-3xl p-3 shadow-md overflow-hidden">
              <div className="rounded-2xl overflow-hidden aspect-16/9 w-full bg-slate-200">
                <iframe
                  title="Al-Asar International Model School Lahor Swabi Map"
                  src={settings.googleMapEmbedUrl || "https://maps.google.com/maps?q=Lahor+Swabi+Khyber+Pakhtunkhwa+Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
