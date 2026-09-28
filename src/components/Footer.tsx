import React from "react";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Clock,
  Lock,
  ShieldCheck,
  Navigation,
  BookOpen,
  Calendar,
  MessageCircle,
  ExternalLink,
  School,
  Users,
} from "lucide-react";
import { SchoolSettings } from "../types";

interface FooterProps {
  settings: SchoolSettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenParentPortal?: () => void;
  hasTeachers?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenAdmin,
  onOpenParentPortal,
  hasTeachers = false,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dunham School Style Endpoints
  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Al-Asar" },
    { id: "academics", label: "Academics / By Age" },
    { id: "admissions", label: "Admissions 2025–26" },
    { id: "life-at-school", label: "Life at School" },
    { id: "our-community", label: "Our Community & Parents" },
    { id: "news-events", label: "News & Notices" },
    { id: "gallery", label: "Photo Gallery" },
    ...(hasTeachers ? [{ id: "teachers", label: "Our Faculty" }] : []),
    { id: "contact", label: "Contact & Location" },
  ];

  const mapsQuery = encodeURIComponent(
    `${settings.name} ${settings.location || "Lahor Swabi KP Pakistan"}`,
  );
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-16 sm:pb-12 pb-safe border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Location & Quick Access Banner - Zero Rectangle Box */}
        <div className="mb-14 p-6 sm:p-10 rounded-3xl bg-slate-900/90 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Location Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#003366] text-xs font-semibold text-[#D4AF37]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Campus Location & Coordinates</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Al-Asar International Model School
              </h3>

              <div className="text-sm text-slate-300 space-y-2">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <span>
                    <strong>Physical Address:</strong> {settings.location}{" "}
                    (District Swabi, Khyber Pakhtunkhwa, Pakistan)
                  </span>
                </p>
                <p className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
                  <Navigation className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    Conveniently reachable from Swabi-Mardan Road & Swabi
                    Interchange M1 Motorway.
                  </span>
                </p>
              </div>

              {/* Action Buttons - Fluid Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gordonstoun-pill inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#003366] hover:bg-[#002244] text-xs text-[#D4AF37] hover:text-white font-bold shadow-md transition-all active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                {settings.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gordonstoun-pill inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                )}

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="gordonstoun-pill inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{settings.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right: Key Website & Academic Details Snapshot */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-950/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-1">
                  <School className="w-4 h-4" />
                  <span>Classes Offered</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Playgroup, Nursery, Prep & Primary Grades 1st to 5th
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Single National Curriculum (SNC) & Nazra Quran
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Registration</span>
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  {settings.registrationNumber}
                </p>
                <p className="text-[10px] text-slate-400">
                  {settings.registrationAuthority}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>School Hours</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  8:00 AM – 1:30 PM (Mon–Thu) | Fri: 8:00 AM – 12:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main 4-Column Directory Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-xs">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-900 flex items-center justify-center ring-2 ring-[#D4AF37] overflow-hidden shrink-0 shadow-md">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm leading-tight">
                  {settings.name}
                </h4>
                <p className="text-[11px] text-[#D4AF37]">{settings.subName}</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              {settings.tagline ||
                "Learning Today, Growing Tomorrow. Quality foundational primary education in Lahor Swabi."}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                KPPSRA Authority Registration
              </span>
              <p className="font-mono text-slate-300 text-xs">
                {settings.registrationNumber}
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Endpoints (Dunham School Model) */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm tracking-wider uppercase">
              School Endpoints
            </h5>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Dunham Style Portals & Community */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm tracking-wider uppercase">
              Portals & Resources
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate("admissions")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Admissions Application Desk
                </button>
              </li>
              {onOpenParentPortal && (
                <li>
                  <button
                    onClick={onOpenParentPortal}
                    className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>Parent Portal & Status Tracker</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigate("academics")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  By Age Academic Curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("gallery")}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Campus Life Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm tracking-wider uppercase">
              Official Contact Desk
            </h5>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.location}</span>
              </div>

              {settings.whatsappNumber && (
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors font-mono"
                  >
                    {settings.whatsappNumber} (WhatsApp)
                  </a>
                </div>
              )}

              {settings.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`tel:${settings.phone}`}
                    className="hover:text-white transition-colors font-mono"
                  >
                    {settings.phone}
                  </a>
                </div>
              )}

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {settings.schoolTimings}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Trigger - Fluid Pills without Rectangle Boxes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} Al-Asar International Model School.
              All Rights Reserved.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lahor (Chota Lahore), Swabi, Khyber Pakhtunkhwa, Pakistan •
              Primary Education Foundation
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenParentPortal && (
              <button
                onClick={onOpenParentPortal}
                id="footer-parent-portal-button"
                className="gordonstoun-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-950 hover:bg-sky-900 text-sky-200 hover:text-white text-xs font-semibold shadow-xs transition-all duration-300 active:scale-95 cursor-pointer"
                title="Open Parent Portal"
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Parent Portal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="gordonstoun-pill w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Scroll to Top"
              aria-label="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
