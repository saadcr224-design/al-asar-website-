import React from 'react';
import {
  CheckCircle,
  Printer,
  X,
  FileText,
  Phone,
  Calendar,
  User,
  GraduationCap,
  MessageCircle
} from 'lucide-react';
import { AdmissionApplication, SchoolSettings } from '../types';

interface AdmissionSuccessModalProps {
  application: AdmissionApplication | null;
  settings: SchoolSettings;
  onClose: () => void;
}

export const AdmissionSuccessModal: React.FC<AdmissionSuccessModalProps> = ({
  application,
  settings,
  onClose
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSend = () => {
    const targetWhatsapp = (settings.whatsappNumber || '03404333571').replace(/[^0-9]/g, '');
    const waMsg = encodeURIComponent(
      `*Admission Reference:* ${application.referenceNumber}\n` +
      `*Student Name:* ${application.studentName}\n` +
      `*Father Name:* ${application.fatherName}\n` +
      `*Applying Class:* ${application.applyingClass}\n` +
      `*Phone:* ${application.parentPhone}\n` +
      `*Address:* ${application.address}\n\n` +
      `_Assalam-o-Alaikum, I have submitted this admission form for Al-Asar International Model School Lahor Swabi._`
    );
    window.open(`https://wa.me/${targetWhatsapp}?text=${waMsg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#003366] text-white p-6 relative border-b-2 border-[#D4AF37]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-[#D4AF37] p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#002244] flex items-center justify-center shadow-md">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Application Submitted!</h3>
              <p className="text-xs text-[#D4AF37] font-medium">
                Al-Asar International Model School Lahor Swabi
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Slip to Print */}
        <div className="p-6 space-y-5" id="printable-admission-slip">
          {/* Reference Card */}
          <div className="bg-[#FFF9E6] border border-[#D4AF37]/50 rounded-xl p-4 text-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#003366]">
              Application Reference Number
            </span>
            <p className="text-2xl font-extrabold text-[#002244] mt-1 font-mono tracking-wider">
              {application.referenceNumber}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Please save or print this reference number for future communication.
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-[#F8FAFD] rounded-xl p-4 border border-[#C8DCF0] space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#003366]" /> Student Name:
              </span>
              <span className="font-bold text-slate-900">{application.studentName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Father's Name:</span>
              <span className="font-semibold text-slate-800">{application.fatherName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#003366]" /> Class Applied:
              </span>
              <span className="font-bold text-[#003366]">{application.applyingClass}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#003366]" /> Contact Number:
              </span>
              <span className="font-medium text-slate-800">{application.parentPhone}</span>
            </div>
            {application.dateOfBirth && (
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#003366]" /> Date of Birth:
                </span>
                <span className="text-slate-800">{application.dateOfBirth}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Gender:</span>
              <span className="text-slate-800">{application.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Address:</span>
              <span className="text-slate-800 text-right max-w-[200px] truncate">{application.address}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6F0FF] text-[#003366] font-bold text-xs border border-[#C8DCF0]">
                {application.status}
              </span>
            </div>
          </div>

          {/* Next Steps Guide */}
          <div className="text-xs text-slate-600 bg-[#E6F0FF]/50 p-3.5 rounded-xl border border-[#C8DCF0]">
            <h4 className="font-bold text-[#002244] mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#003366]" /> Next Steps:
            </h4>
            <p>
              The school administration will review your application and contact you on the provided phone number. You may also visit the school office in Lahor, Swabi with the student's B-Form copy and 2 passport photos.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleWhatsAppSend}
            id="modal-send-whatsapp-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Open WhatsApp Chat</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#003366] hover:bg-[#002244] text-[#D4AF37] text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-[#D4AF37]/30"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
