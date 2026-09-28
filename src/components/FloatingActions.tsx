import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { SchoolSettings } from '../types';

interface FloatingActionsProps {
  settings: SchoolSettings;
  onNavigateToContact: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  settings,
  onNavigateToContact
}) => {
  const handleWhatsAppClick = () => {
    if (settings.whatsappNumber) {
      const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNum}?text=Hello,%20I%20would%20like%20to%20enquire%20about%20admissions%20at%20Al-Asar%20International%20Model%20School%20Lahor%20Swabi.`, '_blank');
    } else {
      onNavigateToContact();
    }
  };

  const handleCallClick = () => {
    if (settings.phone) {
      window.location.href = `tel:${settings.phone}`;
    } else {
      onNavigateToContact();
    }
  };

  return (
    <div className="fixed bottom-safe right-3 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto">
      {/* WhatsApp Button - Pure Fluid Pill without Rectangular Box */}
      <button
        onClick={handleWhatsAppClick}
        title={settings.whatsappNumber ? `Chat on WhatsApp (${settings.whatsappNumber})` : "WhatsApp (Contact School)"}
        id="floating-whatsapp-btn"
        className="gordonstoun-pill flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer min-h-[46px] min-w-[46px] justify-center"
        aria-label="Chat with school on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600 shrink-0" />
        <span className="text-xs sm:text-sm font-bold tracking-wide hidden sm:inline-block">
          WhatsApp Desk
        </span>
      </button>

      {/* Call Button - Pure Fluid Pill without Rectangular Box */}
      <button
        onClick={handleCallClick}
        title={settings.phone ? `Call School Office (${settings.phone})` : "Call School Office"}
        id="floating-call-btn"
        className="gordonstoun-pill gordonstoun-glow-navy flex items-center gap-2.5 bg-[#002244] hover:bg-[#003366] active:bg-slate-950 text-[#D4AF37] p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer font-bold min-h-[46px] min-w-[46px] justify-center"
        aria-label="Call school office"
      >
        <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
        <span className="text-xs sm:text-sm tracking-wide hidden sm:inline-block">
          Call Office
        </span>
      </button>
    </div>
  );
};
