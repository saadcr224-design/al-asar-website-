import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  ChevronDown,
  Home,
  Info,
  BookOpen,
  FileCheck,
  Sparkles,
  Bell,
  Image as ImageIcon,
  Users,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { SchoolSettings } from "../types";

interface HeaderProps {
  settings: SchoolSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  onOpenParentPortal?: () => void;
  onOpenContact: () => void;
  hasTeachers?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeSection,
  onNavigate,
  onOpenAdmin,
  onOpenParentPortal,
  onOpenContact,
  hasTeachers = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<
    string | null
  >(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dunham School & Gordonstoun Endpoints Directory
  const rawDirectory = [
    {
      id: "home",
      title: "Home",
      icon: Home,
      highlight: false,
      items: [
        "School Identity & Motto",
        "Caring Primary Education",
        "Campus Image & Highlights",
        "Official KPPSRA Registration",
      ],
    },
    {
      id: "about",
      title: "About Al-Asar",
      icon: Info,
      highlight: false,
      badge: "About",
      items: [
        "About Al-Asar Model School",
        "Mission & Vision Statements",
        "Leadership & Administration",
        "Core Learning Focus",
      ],
    },
    {
      id: "academics",
      title: "Academics / By Age",
      icon: BookOpen,
      highlight: true,
      badge: "Curriculum",
      items: [
        "Early Childhood (Playgroup to Prep)",
        "Lower School (Grades 1 to 5)",
        "Core Subjects (Eng, Urdu, Math, Sci, Isl)",
        "Conceptual Learning Approach",
      ],
    },
    {
      id: "admissions",
      title: "Admissions 2025–26",
      icon: FileCheck,
      highlight: true,
      badge: "Open",
      items: [
        "Admission Procedure & Criteria",
        "Required Documents (B-Form, CNIC)",
        "Fee Policy Information",
        "Online Admission Application",
      ],
    },
    {
      id: "life-at-school",
      title: "Life at School",
      icon: Sparkles,
      highlight: false,
      items: [
        "Physical Sports & Play Activities",
        "Creative Arts, Drawing & Coloring",
        "Reading Circles & Storytelling",
        "Annual Days & Celebrations",
      ],
    },
    {
      id: "our-community",
      title: "Our Community & Parents",
      icon: Users,
      highlight: true,
      badge: "Portal",
      items: [
        "Parent Portal & Family Guide",
        "Track Admission Application Status",
        "Key Term Dates & School Calendar",
        "Uniform & Discipline Guidelines",
      ],
    },
    {
      id: "news-events",
      title: "News & Events",
      icon: Bell,
      highlight: false,
      items: [
        "School Announcements & Notices",
        "Term Exam & Result Notices",
        "Parent-Teacher Meetings",
        "Holiday Notices",
      ],
    },
    {
      id: "gallery",
      title: "Photo Gallery",
      icon: ImageIcon,
      highlight: false,
      items: [
        "Annual Community Gathering",
        "Prize Distribution & Awards",
        "Classroom Learning & Activities",
        "Morning Assemblies & Sports",
      ],
    },
    {
      id: "teachers",
      title: "Teachers & Faculty",
      icon: Users,
      highlight: false,
      items: [
        "Primary School Faculty",
        "Class Mentors & Specialists",
        "Child Guidance & Care",
      ],
    },
    {
      id: "contact",
      title: "Contact & Campus Map",
      icon: MapPin,
      highlight: true,
      badge: "Lahor Swabi",
      items: [
        "Campus Location in Lahor Swabi",
        "Direct WhatsApp Desk (03404333571)",
        "Helpline & Calling Hours",
        "Google Maps Interactive Directions",
      ],
    },
  ];

  const fullDirectory = rawDirectory.filter(
    (item) => item.id !== "teachers" || hasTeachers,
  );

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Contact & Quick Portal Strip - Borderless Fluid Bar */}
      {(settings.whatsappNumber || settings.phone) && (
        <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                Reg: {settings.registrationNumber} (
                {settings.registrationAuthority})
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gordonstoun-pill flex items-center gap-1.5 text-emerald-300 hover:text-emerald-100 font-bold bg-emerald-950/80 px-3 py-1 rounded-full text-[11px] shadow-xs"
                  id="header-top-whatsapp"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}

              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="gordonstoun-pill flex items-center gap-1.5 text-slate-200 hover:text-[#D4AF37] px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
                  id="header-top-phone"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar - Gordonstoun Translucent Glass */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2.5"
            : "bg-white/90 backdrop-blur-sm py-3.5 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo & School Name */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden cursor-pointer min-w-0"
            id="brand-logo-button"
            aria-label="Go to Home"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300 shrink-0 overflow-hidden ring-2 ring-[#D4AF37]/80">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
              )}
            </div>
            <div className="min-w-0">
              <span className="block text-xs xs:text-sm sm:text-base font-extrabold text-slate-900 leading-tight tracking-tight group-hover:text-slate-700 transition-colors truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                Al-Asar International Model School
              </span>
              <span className="block text-[10px] xs:text-[11px] font-semibold text-slate-600 tracking-wide truncate">
                Lahor Swabi{" "}
                <span className="text-[#D4AF37] font-bold">
                  • Primary School
                </span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links with Gordonstoun Smooth Hover - Zero Rectangle Boxes */}
          <div
            className="hidden lg:flex items-center gap-1.5"
            ref={dropdownRef}
          >
            {/* Dunham School Directory Mega-Menu Trigger - Fluid Pill */}
            <div className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                id="top-bar-directory-mega-button"
                className={`gordonstoun-pill px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  megaMenuOpen
                    ? "bg-slate-900 text-[#D4AF37] shadow-md"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>By Category</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${megaMenuOpen ? "rotate-180 text-[#D4AF37]" : ""}`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-[720px] bg-white rounded-3xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-[#D4AF37] flex items-center justify-center shadow-xs">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Website Directory & Endpoints
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Quick jump to any school department and portal
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMegaMenuOpen(false)}
                      className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                    {fullDirectory.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleNavClick(cat.id)}
                          className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer text-left group shadow-xs hover:shadow-md ${
                            cat.highlight
                              ? "bg-amber-50/70 hover:bg-amber-100/70"
                              : "bg-slate-50/80 hover:bg-slate-100/90"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                  cat.highlight
                                    ? "bg-slate-900 text-[#D4AF37]"
                                    : "bg-slate-200 text-slate-800"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-slate-900 group-hover:text-slate-700">
                                {cat.title}
                              </span>
                            </div>
                            {cat.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-950">
                                {cat.badge}
                              </span>
                            )}
                          </div>

                          <ul className="space-y-0.5 text-[11px] text-slate-600 pl-9">
                            {cat.items.map((sub, sIdx) => (
                              <li
                                key={sIdx}
                                className="flex items-center gap-1.5"
                              >
                                <span className="w-1 h-1 rounded-full bg-slate-400" />
                                <span className="line-clamp-1">{sub}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Al-Asar Model School • Lahor Swabi
                    </span>
                    <button
                      onClick={() => {
                        setMegaMenuOpen(false);
                        onOpenContact();
                      }}
                      className="gordonstoun-pill px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-[#D4AF37] font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Contact School Desk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Dunham School Endpoints - Zero Rectangle Boxes */}
            {[
              { id: "about", label: "About" },
              { id: "academics", label: "Academics" },
              { id: "admissions", label: "Admissions" },
              { id: "life-at-school", label: "Life at School" },
              { id: "gallery", label: "Gallery" },
              { id: "news-events", label: "News" },
              { id: "contact", label: "Contact" },
            ].map((link) => {
              const isActive =
                activeSection === link.id ||
                (link.id === "life-at-school" &&
                  activeSection === "activities") ||
                (link.id === "news-events" && activeSection === "events");
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`gordonstoun-pill px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {hasTeachers && (
              <button
                onClick={() => handleNavClick("teachers")}
                className={`gordonstoun-pill px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 ${
                  activeSection === "teachers"
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80"
                }`}
              >
                Teachers
              </button>
            )}
          </div>

          {/* Action Buttons: Admin Portal & Apply Admission - Fluid Pill Buttons without Rectangle Boxes */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick("admissions")}
              id="header-apply-button"
              className="gordonstoun-pill gordonstoun-glow-navy inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#003366] to-[#002244] hover:from-[#002244] hover:to-slate-950 text-white font-bold text-xs shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer min-h-[38px]"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="hidden xs:inline">Admissions 2025–26</span>
              <span className="xs:hidden">Apply</span>
            </button>

            {/* Mobile Menu Toggle - Pure Circular Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-button"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Dunham School Endpoints - Zero Rectangle Boxes */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md shadow-2xl px-4 pt-4 pb-8 animate-in slide-in-from-top-2 duration-300 max-h-[82vh] overflow-y-auto overscroll-contain">
          <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-[#002244] uppercase tracking-wider">
              Dunham Style Directory & Endpoints
            </span>
            <span className="text-[11px] text-[#003366] font-semibold">
              Reg: {settings.registrationNumber}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            {fullDirectory.map((cat) => {
              const Icon = cat.icon;
              const isExpanded = expandedMobileCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl overflow-hidden bg-slate-50/80 shadow-xs"
                >
                  <div className="flex items-center justify-between p-3">
                    <button
                      onClick={() => handleNavClick(cat.id)}
                      className="flex items-center gap-2.5 text-left flex-1 cursor-pointer font-bold text-xs text-[#002244]"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          cat.highlight
                            ? "bg-[#003366] text-[#D4AF37]"
                            : "bg-[#E6F0FF] text-[#003366]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{cat.title}</span>
                      {cat.badge && (
                        <span className="text-[10px] bg-[#D4AF37] text-[#002244] font-bold px-2 py-0.5 rounded-full ml-1">
                          {cat.badge}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setExpandedMobileCategory(isExpanded ? null : cat.id)
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer rounded-full"
                      aria-label="Toggle details"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Expandable sub-items */}
                  {isExpanded && (
                    <div className="bg-white/90 p-3.5 text-xs text-slate-600 space-y-1.5 animate-in fade-in duration-150">
                      {cat.items.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 pl-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#003366] shrink-0" />
                          <span>{sub}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleNavClick(cat.id)}
                          className="w-full py-2 px-4 rounded-full bg-[#E6F0FF] text-[#003366] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Open {cat.title}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Actions - Fluid Borderless Pills */}
            <div className="pt-4 flex flex-col gap-2.5">
              {onOpenParentPortal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenParentPortal();
                  }}
                  id="mobile-drawer-parent-portal-button"
                  className="w-full py-3 px-5 rounded-full bg-sky-950 hover:bg-sky-900 text-sky-200 font-bold text-sm text-center shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Parent Portal & Application Tracker</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick("admissions");
                }}
                id="mobile-drawer-admissions-button"
                className="w-full py-3 px-5 rounded-full bg-[#003366] hover:bg-[#002244] text-white font-bold text-sm text-center shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Apply for Admission (2025–26)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                id="mobile-drawer-contact-button"
                className="w-full py-2.5 px-5 rounded-full bg-amber-50 hover:bg-amber-100 text-[#002244] font-bold text-xs text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#002244]" />
                <span>Contact Desk (Lahor Swabi)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
