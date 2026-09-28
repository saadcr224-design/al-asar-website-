import React, { useState } from 'react';
import {
  FileCheck2,
  HelpCircle,
  Clock,
  Send,
  Loader2,
  Info,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SchoolSettings, SchoolClass, AdmissionApplication } from '../types';
import { api } from '../lib/api';

interface AdmissionsSectionProps {
  settings: SchoolSettings;
  classes: SchoolClass[];
  onAdmissionSuccess: (application: AdmissionApplication) => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  settings,
  classes,
  onAdmissionSuccess
}) => {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    applyingClass: classes.length > 0 ? classes[0].name : 'Playgroup',
    parentPhone: '',
    whatsappNumber: '',
    address: '',
    previousSchool: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.studentName.trim() || !formData.fatherName.trim() || !formData.parentPhone.trim() || !formData.address.trim()) {
      setErrorMsg('Please complete all required fields (Student Name, Father Name, Phone, Address).');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitAdmission({
        ...formData,
        whatsappNumber: formData.whatsappNumber || formData.parentPhone
      });

      if (res.success && res.application) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore confetti failure gracefully
        }

        const app = res.application;
        const targetWhatsapp = (settings.whatsappNumber || '03404333571').replace(/[^0-9]/g, '');

        // Format message for WhatsApp
        const waMsg = encodeURIComponent(
          `*New Admission Application - Al-Asar International Model School*\n\n` +
          `*Ref Number:* ${app.referenceNumber}\n` +
          `*Student Name:* ${app.studentName}\n` +
          `*Father Name:* ${app.fatherName}\n` +
          `*Applying Class:* ${app.applyingClass}\n` +
          `*Phone:* ${app.parentPhone}\n` +
          (app.whatsappNumber ? `*WhatsApp:* ${app.whatsappNumber}\n` : '') +
          `*Address:* ${app.address}\n` +
          (app.previousSchool ? `*Previous School:* ${app.previousSchool}\n` : '') +
          (app.message ? `*Remarks:* ${app.message}\n` : '') +
          `\n_Submitted via School Official Website_`
        );

        // Directly open WhatsApp to school number 03404333571
        const waUrl = `https://wa.me/${targetWhatsapp}?text=${waMsg}`;
        window.open(waUrl, '_blank');

        onAdmissionSuccess(res.application);
        // Reset form
        setFormData({
          studentName: '',
          fatherName: '',
          dateOfBirth: '',
          gender: 'Male',
          applyingClass: classes.length > 0 ? classes[0].name : 'Playgroup',
          parentPhone: '',
          whatsappNumber: '',
          address: '',
          previousSchool: '',
          message: ''
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Failed to submit application. Please try again.');
      } else {
        setErrorMsg('Failed to submit application. Please check your details and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="admissions" className="py-14 sm:py-20 bg-transparent border-b border-sky-200/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
            Join Our Primary School
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Admissions & Enquiries
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full mb-4" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
            We welcome young learners to begin their foundational education journey at Al-Asar International Model School in Lahor (Chota Lahore), Swabi.
          </p>
        </div>

        {/* 2-Column Layout: Admission Info & Admission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Admission Procedures & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Status Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-[#D4AF37]/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">
                  Status
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {settings.admissionStatus}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Admissions are open for Playgroup, Nursery, Prep, and Primary Classes 1 through 5.
              </p>
            </div>

            {/* Admission Procedure */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/90 shadow-sm">
              <h4 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-800" />
                <span>Admission Procedure</span>
              </h4>
              <div className="text-xs sm:text-sm text-slate-600 space-y-2 whitespace-pre-line leading-relaxed">
                {settings.admissionProcedure}
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/90 shadow-sm">
              <h4 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                <span>Required Documents</span>
              </h4>
              <div className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {settings.requiredDocuments}
              </div>
            </div>

            {/* Fee Note Notice (Strict Rule Compliance) */}
            <div className="bg-amber-50/90 backdrop-blur-md rounded-2xl p-5 border border-[#D4AF37]/50 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Fee Information</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {settings.feeInfo}
              </p>
              <p className="text-[11px] text-slate-900 font-bold mt-2">
                We believe in fair and accessible quality primary education.
              </p>
            </div>

          </div>

          {/* Right Column: Online Admission Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-white/90 shadow-lg p-6 sm:p-8">
              
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-800" />
                  <span>Online Admission Application Form</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Fill in the details below. Our administration will contact you with reference confirmation.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" id="admission-application-form">
                
                {/* Student & Father Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="e.g. Muhammad Ahmad"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Father's / Guardian's Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="e.g. Tariq Khan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Gender <span className="text-rose-600">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Applying Class */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Applying Class <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="applyingClass"
                    value={formData.applyingClass}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent bg-white"
                  >
                    {classes.length > 0 ? (
                      classes.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} {c.ageGroup ? `(${c.ageGroup})` : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Playgroup">Playgroup</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Prep">Prep</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parent / Guardian Phone <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="e.g. 0300-1234567"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="Optional (if different)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Residential Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Residential Address (Lahor, Swabi / Area) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Mohallah, Main Bazar, Lahor Swabi"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                </div>

                {/* Previous School (if applicable) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Previous School (If applicable)
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    placeholder="Leave blank for fresh early learners"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                </div>

                {/* Message / Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Additional Message or Notes
                  </label>
                  <textarea
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any special remarks or questions for the school administration..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                </div>

                {/* Submit Button - Pure Fluid Pill */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="submit-admission-form-button"
                  className="w-full py-4 px-8 rounded-full gordonstoun-pill gordonstoun-glow-gold bg-[#D4AF37] hover:bg-[#c4a030] text-[#002244] font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Application</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  Upon submission, you will receive an official application reference number.
                </p>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
