import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Phone,
  AlertCircle,
  Printer,
  ChevronRight,
  Shield,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Save,
  RefreshCw,
  Search,
  Camera,
  Upload,
  X
} from 'lucide-react';
import {
  SchoolSettings,
  SchoolClass,
  SchoolSubject,
  Teacher,
  Activity,
  SchoolEvent,
  GalleryItem,
  AdmissionApplication,
  ContactMessage,
  DashboardStats
} from '../../types';
import { api, clearAuthToken } from '../../lib/api';
import { ImageUploadField } from './ImageUploadField';

interface AdminDashboardProps {
  initialSettings: SchoolSettings;
  onClose: () => void;
  onRefreshData: () => void;
}

type AdminTab =
  | 'overview'
  | 'admissions'
  | 'photos'
  | 'settings'
  | 'about'
  | 'classes'
  | 'subjects'
  | 'teachers'
  | 'activities'
  | 'events'
  | 'gallery'
  | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialSettings,
  onClose,
  onRefreshData
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<SchoolSettings>(initialSettings);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<SchoolSubject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Filter & Search states
  const [admissionFilter, setAdmissionFilter] = useState<string>('All');
  const [admissionSearch, setAdmissionSearch] = useState<string>('');
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionApplication | null>(null);

  // UI feedback states
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Password change state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Editing Modals / Form states
  const [editingClass, setEditingClass] = useState<Partial<SchoolClass> | null>(null);
  const [editingSubject, setEditingSubject] = useState<Partial<SchoolSubject> | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
  const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<SchoolEvent> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [photoFilter, setPhotoFilter] = useState<'all' | 'background' | 'core' | 'teachers' | 'activities' | 'events' | 'gallery'>('all');
  const [quickPhotoModal, setQuickPhotoModal] = useState<{
    type: 'teacher' | 'activity' | 'event' | 'gallery' | 'core';
    id?: string;
    title: string;
    currentUrl: string;
    onSave: (newUrl: string) => Promise<void>;
  } | null>(null);

  // Check auth on mount
  useEffect(() => {
    const verify = async () => {
      const auth = await api.verifyAuth();
      setIsAuthenticated(auth);
      if (auth) {
        loadAllAdminData();
      }
    };
    verify();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [
        statsData,
        settingsData,
        admissionsData,
        messagesData,
        classesData,
        subjectsData,
        teachersData,
        activitiesData,
        eventsData,
        galleryData
      ] = await Promise.all([
        api.getStats(),
        api.getSettings(),
        api.getAdmissions(),
        api.getContactMessages(),
        api.getClasses(),
        api.getSubjects(),
        api.getTeachers(),
        api.getActivities(),
        api.getEvents(),
        api.getGallery()
      ]);

      setStats(statsData);
      setSettings(settingsData);
      setAdmissions(admissionsData);
      setMessages(messagesData);
      setClasses(classesData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setActivities(activitiesData);
      setEvents(eventsData);
      setGallery(galleryData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await api.login(passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        loadAllAdminData();
      } else {
        setLoginError(res.error || 'Invalid password.');
      }
    } catch {
      setLoginError('Authentication failed. Please check network connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    onRefreshData();
  };

  // --- Settings Save Handler ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      showNotification('School settings saved successfully!');
      onRefreshData();
    } catch {
      showNotification('Failed to save settings', 'error');
    }
  };

  // --- Admission Actions ---
  const handleUpdateAdmissionStatus = async (id: string, status: AdmissionApplication['status'], notes?: string) => {
    try {
      const updated = await api.updateAdmissionStatus(id, status, notes);
      setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
      if (selectedAdmission && selectedAdmission.id === id) {
        setSelectedAdmission(updated);
      }
      showNotification(`Application marked as ${status}`);
    } catch {
      showNotification('Failed to update application status', 'error');
    }
  };

  const handleDeleteAdmission = async (id: string) => {
    try {
      await api.deleteAdmission(id);
      setAdmissions(prev => prev.filter(a => a.id !== id));
      if (selectedAdmission?.id === id) setSelectedAdmission(null);
      showNotification('Admission application permanently deleted');
      onRefreshData();
    } catch {
      showNotification('Failed to delete application', 'error');
    }
  };

  // --- Contact Message Actions ---
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const updated = await api.updateMessageStatus(id, currentRead ? 'New' : 'Replied', !currentRead);
      setMessages(prev => prev.map(m => m.id === id ? updated : m));
    } catch {
      showNotification('Failed to update message', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await api.deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      showNotification('Message permanently deleted');
      onRefreshData();
    } catch {
      showNotification('Failed to delete message', 'error');
    }
  };

  // --- Password Change ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPass || !newPass) return;
    try {
      const res = await api.changePassword(currPass, newPass);
      if (res.success) {
        showNotification('Admin password updated successfully!');
        setCurrPass('');
        setNewPass('');
      } else {
        showNotification(res.error || 'Failed to update password', 'error');
      }
    } catch {
      showNotification('Error changing password', 'error');
    }
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
          
          <div className="bg-blue-950 p-6 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-blue-900 mx-auto flex items-center justify-center mb-3 border border-blue-700">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold">Admin Portal</h3>
            <p className="text-xs text-amber-300 font-medium mt-1">
              Al-Asar International Model School Lahor Swabi
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Authorized school administrative access only.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoggingIn ? 'Verifying...' : 'Login to Dashboard'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Filtered Admissions
  const filteredAdmissions = admissions.filter(a => {
    const matchesFilter = admissionFilter === 'All' || a.status === admissionFilter;
    const matchesSearch =
      a.studentName.toLowerCase().includes(admissionSearch.toLowerCase()) ||
      a.fatherName.toLowerCase().includes(admissionSearch.toLowerCase()) ||
      a.referenceNumber.toLowerCase().includes(admissionSearch.toLowerCase()) ||
      a.parentPhone.includes(admissionSearch) ||
      a.applyingClass.toLowerCase().includes(admissionSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ----------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div className="bg-slate-100 sm:rounded-2xl max-w-6xl w-full h-full sm:h-[92vh] mx-auto shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top App Bar */}
        <div className="bg-blue-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center border border-blue-700">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Al-Asar Super Admin Dashboard
              </h2>
              <p className="text-xs text-amber-300">
                Lahor, Swabi • KPPSRA: {settings.registrationNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllAdminData}
              className="p-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-slate-200 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 text-xs font-semibold border border-rose-700/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onRefreshData();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            <CheckCircle className="w-4 h-4" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Dashboard Layout: Sidebar Navigation + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-2 sm:p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'overview' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'admissions' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Admissions</span>
              </span>
              {admissions.filter(a => a.status === 'Pending').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {admissions.filter(a => a.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'photos' ? 'bg-[#003366] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span>Photos & Media</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#003366] font-bold text-[10px]">
                All Pics
              </span>
            </button>

            <div className="hidden md:block my-2 border-t border-slate-200" />

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'settings' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>School Info & Contact</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'about' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>About & Principal</span>
            </button>

            <button
              onClick={() => setActiveTab('classes')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'classes' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Classes</span>
            </button>

            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'subjects' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Subjects</span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'teachers' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teachers</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'activities' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Activities</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'events' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events & Notices</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'gallery' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </button>

            <div className="hidden md:block my-2 border-t border-slate-200" />

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 md:w-full ${
                activeTab === 'security' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>

          {/* Content Pane */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Dashboard Overview</h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Real-time status of applications, messages, and school website content.
                  </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      New Admissions
                    </span>
                    <p className="text-2xl font-extrabold text-blue-950 mt-1">
                      {admissions.filter(a => a.status === 'Pending').length}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Total: {admissions.length}
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Campus Gallery
                    </span>
                    <p className="text-2xl font-extrabold text-[#003366] mt-1">
                      {gallery.length}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Photos active
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Primary Classes
                    </span>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">
                      {classes.length}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Playgroup to Grade 5
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Events & Notices
                    </span>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">
                      {events.length}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Active on site
                    </span>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Website Display Background Photo Quick Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                          <Camera className="w-4 h-4 text-[#003366]" />
                          <span>Website Display Background</span>
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        The visual backdrop across all pages of the school website.
                      </p>
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-100 mb-3 shadow-inner">
                        <img
                          src={settings.backgroundImage || settings.heroImage || settings.welcomeImage || '/assets/website-background.jpg'}
                          alt="Current Display Background"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-semibold text-white truncate">
                            {settings.backgroundImage?.startsWith('data:') ? 'Custom Uploaded Photo' : (settings.backgroundImage || 'Default Ceremony Photo')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFilter('background');
                        setActiveTab('photos');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Change Background Pic</span>
                    </button>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-900" />
                      <span>Recent Admission Enquiries</span>
                    </h4>
                    {admissions.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setSelectedAdmission(a);
                          setActiveTab('admissions');
                        }}
                        className="py-2 border-b border-slate-100 last:border-b-0 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{a.studentName}</p>
                          <p className="text-[11px] text-slate-500">
                            {a.applyingClass} • Ref: {a.referenceNumber}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          a.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                    {admissions.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No admission enquiries yet.</p>
                    )}
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-700" />
                        <span>Direct Contact & WhatsApp</span>
                      </h4>
                      <p className="text-xs text-slate-500 mb-3">
                        Official school contact channels for parents and admission applicants.
                      </p>
                      <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                        <p><strong className="text-slate-900">WhatsApp:</strong> {settings.whatsappNumber || '03404333571'}</p>
                        <p><strong className="text-slate-900">Phone:</strong> {settings.phone || '03404333571'}</p>
                        <p className="text-[11px] text-slate-500 truncate"><strong className="text-slate-700">Location:</strong> Lahor (Chota Lahore), Swabi</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" />
                      <span>Manage School Info & Contact</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ADMISSIONS TAB */}
            {activeTab === 'admissions' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Admission Applications</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Manage and track all online admission forms submitted by parents.
                    </p>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search applicant or phone..."
                        value={admissionSearch}
                        onChange={(e) => setAdmissionSearch(e.target.value)}
                        className="pl-9 pr-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs w-48 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <select
                      value={admissionFilter}
                      onChange={(e) => setAdmissionFilter(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-hidden"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Table of Applications */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Ref Number</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Father Name</th>
                          <th className="p-3">Class</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAdmissions.map((adm) => (
                          <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-blue-900">{adm.referenceNumber}</td>
                            <td className="p-3 font-semibold text-slate-900">{adm.studentName}</td>
                            <td className="p-3 text-slate-600">{adm.fatherName}</td>
                            <td className="p-3 font-medium text-slate-800">{adm.applyingClass}</td>
                            <td className="p-3 text-slate-700">
                              <a href={`tel:${adm.parentPhone}`} className="hover:underline text-blue-800 font-medium">
                                {adm.parentPhone}
                              </a>
                            </td>
                            <td className="p-3">
                              <select
                                value={adm.status}
                                onChange={(e) => handleUpdateAdmissionStatus(adm.id, e.target.value as any)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-md border ${
                                  adm.status === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                  adm.status === 'Accepted' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                  adm.status === 'Contacted' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                  'bg-slate-50 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Archived">Archived</option>
                              </select>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => setSelectedAdmission(adm)}
                                className="px-2 py-1 rounded bg-blue-50 text-blue-900 hover:bg-blue-100 font-medium text-[11px]"
                              >
                                View Slip
                              </button>
                              <button
                                onClick={() => handleDeleteAdmission(adm.id)}
                                className="p-1 rounded text-rose-600 hover:bg-rose-50"
                                title="Delete application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredAdmissions.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No matching admission applications found.
                    </div>
                  )}
                </div>

                {/* Detailed Application Modal / Drawer */}
                {selectedAdmission && (
                  <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <span className="text-[11px] uppercase font-bold text-amber-700">Official Admission Record</span>
                          <h4 className="text-lg font-bold text-slate-900">{selectedAdmission.referenceNumber}</h4>
                        </div>
                        <button
                          onClick={() => setSelectedAdmission(null)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block">Student Name:</span>
                          <span className="font-bold text-slate-900">{selectedAdmission.studentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Father / Guardian:</span>
                          <span className="font-semibold text-slate-800">{selectedAdmission.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Class Applied:</span>
                          <span className="font-bold text-blue-900">{selectedAdmission.applyingClass}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Gender:</span>
                          <span className="text-slate-800">{selectedAdmission.gender}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Date of Birth:</span>
                          <span className="text-slate-800">{selectedAdmission.dateOfBirth || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Phone:</span>
                          <span className="font-bold text-emerald-700">{selectedAdmission.parentPhone}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block">WhatsApp:</span>
                          <span className="text-slate-800">{selectedAdmission.whatsappNumber || selectedAdmission.parentPhone}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block">Address:</span>
                          <span className="text-slate-800">{selectedAdmission.address}</span>
                        </div>
                        {selectedAdmission.previousSchool && (
                          <div className="col-span-2">
                            <span className="text-slate-400 block">Previous School:</span>
                            <span className="text-slate-800">{selectedAdmission.previousSchool}</span>
                          </div>
                        )}
                        {selectedAdmission.message && (
                          <div className="col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <span className="text-slate-400 block text-[10px]">Parent Message:</span>
                            <span className="text-slate-700 italic">{selectedAdmission.message}</span>
                          </div>
                        )}
                      </div>

                      {/* Admin Notes Section */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          School Admin Notes
                        </label>
                        <textarea
                          rows={2}
                          defaultValue={selectedAdmission.adminNotes || ''}
                          onBlur={(e) => handleUpdateAdmissionStatus(selectedAdmission.id, selectedAdmission.status, e.target.value)}
                          placeholder="Add internal notes (e.g. Assessment passed, documents collected, verified)..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print
                        </button>
                        <button
                          onClick={() => setSelectedAdmission(null)}
                          className="px-4 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* WEBSITE PHOTOS & MEDIA MANAGER TAB */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">Website Photos & Media Manager</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#003366] text-xs font-bold">
                        All Images
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Upload from your phone/computer or change links for any image on the website: Hero banner, campus photo, school crest, teachers, activities, notices, and gallery.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const updated = await api.updateSettings(settings);
                        setSettings(updated);
                        showNotification('All core website photo settings saved!');
                        onRefreshData();
                      } catch {
                        showNotification('Failed to save photo changes', 'error');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>Save Core Photos</span>
                  </button>
                </div>

                {/* Photo Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      photoFilter === 'all'
                        ? 'bg-[#003366] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All Photos ({5 + teachers.length + activities.length + events.length + gallery.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('background')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      photoFilter === 'background'
                        ? 'bg-[#003366] text-white ring-2 ring-[#D4AF37]'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Display Background (1)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('core')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      photoFilter === 'core'
                        ? 'bg-[#003366] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Core & Homepage (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('teachers')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      photoFilter === 'teachers'
                        ? 'bg-[#003366] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Teachers & Faculty ({teachers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('activities')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      photoFilter === 'activities'
                        ? 'bg-[#003366] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Activities ({activities.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('events')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      photoFilter === 'events'
                        ? 'bg-[#003366] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Notices & Events ({events.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoFilter('gallery')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      photoFilter === 'gallery'
                        ? 'bg-[#003366] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Campus Gallery ({gallery.length})
                  </button>
                </div>

                {/* 0. DEDICATED FULL WEBSITE DISPLAY BACKGROUND PICTURE */}
                {(photoFilter === 'all' || photoFilter === 'background') && (
                  <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-sky-950 rounded-2xl p-5 border-2 border-[#D4AF37] shadow-lg text-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                            Main Wallpaper
                          </span>
                          <h4 className="font-bold text-white text-base flex items-center gap-2">
                            <Camera className="w-5 h-5 text-[#D4AF37]" />
                            <span>Website Display Background Picture</span>
                          </h4>
                        </div>
                        <p className="text-xs text-sky-200 mt-1">
                          This photo is rendered across the entire website display with elegant atmospheric light-blue lighting.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSettings({ ...settings, backgroundImage: '/assets/website-background.jpg' });
                            showNotification('Reset to default authentic ceremony photo');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-sky-200 text-xs font-semibold border border-blue-700 cursor-pointer transition-colors"
                        >
                          Default Award Photo
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const updated = await api.updateSettings(settings);
                              setSettings(updated);
                              showNotification('Website display background updated & live!');
                              onRefreshData();
                            } catch {
                              showNotification('Failed to save background photo', 'error');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save & Apply Background</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Live Visual Preview Frame */}
                      <div className="lg:col-span-5 space-y-2">
                        <span className="text-xs font-bold text-amber-300 block uppercase tracking-wide">
                          Live Display Wallpaper Preview
                        </span>
                        <div className="relative rounded-xl overflow-hidden aspect-video border-2 border-white/20 shadow-2xl bg-slate-950 group">
                          <img
                            src={settings.backgroundImage || settings.heroImage || settings.welcomeImage || '/assets/website-background.jpg'}
                            alt="Website Background Display"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-sky-300/30 via-transparent to-blue-950/80 pointer-events-none" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-medium bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md">
                            <span className="truncate">Active on live website</span>
                            <span className="text-amber-300 font-bold shrink-0 ml-2">Display Wallpaper</span>
                          </div>
                        </div>
                      </div>

                      {/* Photo Upload & Change Controls */}
                      <div className="lg:col-span-7 bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-4">
                        <ImageUploadField
                          label="Upload or Select New Display Background"
                          value={settings.backgroundImage || ''}
                          onChange={(url) => setSettings({ ...settings, backgroundImage: url })}
                          helperText="Upload high-res picture from device (phone/computer) or paste any image link."
                          aspectRatio="video"
                          idPrefix="display-bg-pic"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. CORE HOMEPAGE & BRANDING PHOTOS */}
                {(photoFilter === 'all' || photoFilter === 'core') && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                          <span>Core Website & Homepage Photos</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Controls the high-visibility hero banner, campus introduction photo, school emblem, and principal photo.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Hero Section Banner Image */}
                      <ImageUploadField
                        label="1. Hero Section Banner Photo"
                        value={settings.heroImage || ''}
                        onChange={(url) => setSettings({ ...settings, heroImage: url })}
                        helperText="Displayed prominently in the top Hero header on the homepage."
                        aspectRatio="video"
                        idPrefix="hero-img"
                      />

                      {/* Welcome Section Campus Photo */}
                      <ImageUploadField
                        label="2. Welcome Section Campus Photo"
                        value={settings.welcomeImage || ''}
                        onChange={(url) => setSettings({ ...settings, welcomeImage: url })}
                        helperText="Displayed in the 'Welcome to Al-Asar' primary classroom introduction."
                        aspectRatio="video"
                        idPrefix="welcome-img"
                      />

                      {/* School Crest / Logo */}
                      <ImageUploadField
                        label="3. School Crest / Official Logo"
                        value={settings.logoUrl || ''}
                        onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                        helperText="Displayed in the top navigation header and footer. (Leave empty for default graduation crest)."
                        aspectRatio="square"
                        idPrefix="logo-img"
                      />

                      {/* Principal / Head Teacher Photo */}
                      <ImageUploadField
                        label="4. Principal / Leadership Photo"
                        value={settings.principalPhoto || ''}
                        onChange={(url) => setSettings({ ...settings, principalPhoto: url })}
                        helperText="Displayed in the About Us section alongside the Principal's message."
                        aspectRatio="portrait"
                        idPrefix="principal-img"
                      />
                    </div>

                    <div className="pt-2 flex justify-end border-t border-slate-100">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const updated = await api.updateSettings(settings);
                            setSettings(updated);
                            showNotification('Core website photos saved successfully!');
                            onRefreshData();
                          } catch {
                            showNotification('Failed to save settings', 'error');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs shadow-sm cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-[#D4AF37]" />
                        <span>Save Core Website Photos</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. TEACHERS & FACULTY PHOTOS */}
                {(photoFilter === 'all' || photoFilter === 'teachers') && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#003366]" />
                          <span>Teachers & Faculty Photos</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Change photo for any teacher with 1-click upload or selection.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTeacher({ name: '', position: 'Primary Teacher', bio: '', photo: '', order: teachers.length + 1 })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Teacher</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teachers.map((tch) => (
                        <div
                          key={tch.id}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center gap-3 shadow-2xs hover:border-[#003366]/40 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative group">
                            <img
                              src={tch.photo}
                              alt={tch.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-900 text-xs truncate">{tch.name}</h5>
                            <span className="text-[10px] font-semibold text-amber-700 block truncate">{tch.position}</span>
                            
                            <div className="mt-2 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickPhotoModal({
                                    type: 'teacher',
                                    id: tch.id,
                                    title: `Change Photo for ${tch.name}`,
                                    currentUrl: tch.photo,
                                    onSave: async (newUrl) => {
                                      const updated = await api.updateTeacher(tch.id, { ...tch, photo: newUrl });
                                      setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
                                      showNotification(`Photo updated for ${tch.name}`);
                                      onRefreshData();
                                    }
                                  });
                                }}
                                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#E6F0FF] text-[#003366] border border-slate-300 hover:border-[#003366] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Camera className="w-3 h-3 text-[#D4AF37]" />
                                <span>Change Photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTeacher(tch)}
                                className="p-1 rounded text-slate-600 hover:bg-slate-200 text-xs"
                                title="Edit Full Profile"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await api.deleteTeacher(tch.id);
                                    setTeachers(prev => prev.filter(t => t.id !== tch.id));
                                    showNotification(`Teacher ${tch.name} permanently deleted`);
                                    onRefreshData();
                                  } catch {
                                    showNotification('Failed to delete teacher', 'error');
                                  }
                                }}
                                className="p-1 rounded text-rose-600 hover:bg-rose-100 text-xs"
                                title="Delete Teacher"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. STUDENT ACTIVITIES PHOTOS */}
                {(photoFilter === 'all' || photoFilter === 'activities') && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#003366]" />
                          <span>Student Activities Photos</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Change or upload pictures for sports, art, literacy, and student club activities.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingActivity({ title: '', description: '', category: 'Sports', image: '', order: activities.length + 1 })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Activity</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activities.map((act) => (
                        <div
                          key={act.id}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center gap-3 shadow-2xs hover:border-[#003366]/40 transition-colors"
                        >
                          <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                            <img
                              src={act.image}
                              alt={act.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                              {act.category}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs truncate mt-0.5">{act.title}</h5>

                            <div className="mt-2 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickPhotoModal({
                                    type: 'activity',
                                    id: act.id,
                                    title: `Change Photo for ${act.title}`,
                                    currentUrl: act.image,
                                    onSave: async (newUrl) => {
                                      const updated = await api.updateActivity(act.id, { ...act, image: newUrl });
                                      setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
                                      showNotification(`Photo updated for ${act.title}`);
                                      onRefreshData();
                                    }
                                  });
                                }}
                                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#E6F0FF] text-[#003366] border border-slate-300 hover:border-[#003366] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Camera className="w-3 h-3 text-[#D4AF37]" />
                                <span>Change Photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingActivity(act)}
                                className="p-1 rounded text-slate-600 hover:bg-slate-200 text-xs"
                                title="Edit Activity"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await api.deleteActivity(act.id);
                                    setActivities(prev => prev.filter(a => a.id !== act.id));
                                    showNotification(`Activity ${act.title} permanently deleted`);
                                    onRefreshData();
                                  } catch {
                                    showNotification('Failed to delete activity', 'error');
                                  }
                                }}
                                className="p-1 rounded text-rose-600 hover:bg-rose-100 text-xs"
                                title="Delete Activity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. NOTICES & EVENTS PHOTOS */}
                {(photoFilter === 'all' || photoFilter === 'events') && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#003366]" />
                          <span>Notices & Events Photos</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Set or replace banner pictures attached to school announcements and alerts.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingEvent({ title: '', date: 'Upcoming Date', category: 'Announcement', description: '', isImportant: false })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Notice</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map((evt) => (
                        <div
                          key={evt.id}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center gap-3 shadow-2xs"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center">
                            {evt.image ? (
                              <img
                                src={evt.image}
                                alt={evt.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Calendar className="w-6 h-6 text-slate-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-slate-500 block truncate">{evt.date}</span>
                            <h5 className="font-bold text-slate-900 text-xs truncate">{evt.title}</h5>

                            <div className="mt-2 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickPhotoModal({
                                    type: 'event',
                                    id: evt.id,
                                    title: `Set Photo for ${evt.title}`,
                                    currentUrl: evt.image || '',
                                    onSave: async (newUrl) => {
                                      const updated = await api.updateEvent(evt.id, { ...evt, image: newUrl });
                                      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
                                      showNotification(`Photo updated for ${evt.title}`);
                                      onRefreshData();
                                    }
                                  });
                                }}
                                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#E6F0FF] text-[#003366] border border-slate-300 hover:border-[#003366] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Camera className="w-3 h-3 text-[#D4AF37]" />
                                <span>{evt.image ? 'Change Photo' : 'Add Photo'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingEvent(evt)}
                                className="p-1 rounded text-slate-600 hover:bg-slate-200 text-xs"
                                title="Edit Notice"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await api.deleteEvent(evt.id);
                                    setEvents(prev => prev.filter(e => e.id !== evt.id));
                                    showNotification(`Notice "${evt.title}" permanently deleted`);
                                    onRefreshData();
                                  } catch {
                                    showNotification('Failed to delete notice', 'error');
                                  }
                                }}
                                className="p-1 rounded text-rose-600 hover:bg-rose-100 text-xs"
                                title="Delete Notice"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. CAMPUS PHOTO GALLERY */}
                {(photoFilter === 'all' || photoFilter === 'gallery') && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#003366]" />
                          <span>Campus Photo Gallery ({gallery.length})</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manage all high-resolution photos displayed in the interactive public gallery.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingGallery({ title: '', category: 'School', imageUrl: '', caption: '' })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#002244] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload New Gallery Photo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                              />
                            </div>
                            <div className="p-2.5">
                              <span className="text-[9px] font-bold text-[#003366]">{item.category}</span>
                              <h5 className="font-bold text-xs text-slate-900 truncate mt-0.5">{item.title}</h5>
                            </div>
                          </div>

                          <div className="p-2 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickPhotoModal({
                                  type: 'gallery',
                                  id: item.id,
                                  title: `Replace Gallery Photo: ${item.title}`,
                                  currentUrl: item.imageUrl,
                                  onSave: async (newUrl) => {
                                    const updated = await api.updateGalleryItem(item.id, { ...item, imageUrl: newUrl });
                                    setGallery(prev => prev.map(g => g.id === updated.id ? updated : g));
                                    showNotification(`Gallery photo updated!`);
                                    onRefreshData();
                                  }
                                });
                              }}
                              className="px-2 py-1 rounded bg-[#E6F0FF] text-[#003366] hover:bg-[#003366] hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Replace</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await api.deleteGalleryItem(item.id);
                                  setGallery(prev => prev.filter(g => g.id !== item.id));
                                  showNotification(`Gallery image "${item.title}" permanently deleted`);
                                  onRefreshData();
                                } catch {
                                  showNotification('Failed to delete photo', 'error');
                                }
                              }}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. SCHOOL INFO & CONTACT SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">School Information & Contact</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Update official school name, verified registration numbers, phone numbers, and timings.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">School Identity</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">School Full Name</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline / Motto</label>
                      <input
                        type="text"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">KPPSRA Registration Number</label>
                      <input
                        type="text"
                        value={settings.registrationNumber}
                        onChange={(e) => setSettings({ ...settings, registrationNumber: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono font-bold focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Registration Authority</label>
                      <input
                        type="text"
                        value={settings.registrationAuthority}
                        onChange={(e) => setSettings({ ...settings, registrationAuthority: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#003366]" />
                      <span>Full Website Display Background Picture</span>
                    </h4>
                    <span className="text-xs text-amber-600 font-semibold">
                      Main Atmospheric Backdrop
                    </span>
                  </div>
                  <ImageUploadField
                    label="Website Display Wallpaper Photo"
                    value={settings.backgroundImage || ''}
                    onChange={(url) => setSettings({ ...settings, backgroundImage: url })}
                    helperText="Upload any picture from phone/computer or paste a URL to set the full website display background."
                    aspectRatio="video"
                    idPrefix="settings-bg-img"
                  />
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Contact Details & Timings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        School Phone Number
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="e.g. 0938-XXXXXX or 0300-XXXXXXX"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400">Controls the Floating Call button and header phone</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="e.g. 923001234567"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400">Controls the Floating WhatsApp chat button</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="e.g. info@alasarschool.edu.pk"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">School Timings</label>
                      <input
                        type="text"
                        value={settings.schoolTimings}
                        onChange={(e) => setSettings({ ...settings, schoolTimings: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">School Location / Address</label>
                      <input
                        type="text"
                        value={settings.location}
                        onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Maps Embed URL</label>
                      <input
                        type="text"
                        value={settings.googleMapEmbedUrl}
                        onChange={(e) => setSettings({ ...settings, googleMapEmbedUrl: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Social Media Links (Optional)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settings.facebookUrl}
                        onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settings.instagramUrl}
                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">YouTube URL</label>
                      <input
                        type="url"
                        value={settings.youtubeUrl}
                        onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Save All Settings</span>
                  </button>
                </div>
              </form>
            )}

            {/* 5. ABOUT & PRINCIPAL TAB */}
            {activeTab === 'about' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">About Content & Leadership</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Customize mission, vision, welcome statement, and principal's message.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Homepage & About Texts</h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hero Introduction</label>
                    <textarea
                      rows={2}
                      value={settings.heroIntroduction}
                      onChange={(e) => setSettings({ ...settings, heroIntroduction: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Welcome Text</label>
                    <textarea
                      rows={3}
                      value={settings.welcomeText}
                      onChange={(e) => setSettings({ ...settings, welcomeText: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">About School Narrative</label>
                    <textarea
                      rows={3}
                      value={settings.aboutText}
                      onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mission</label>
                      <textarea
                        rows={3}
                        value={settings.mission}
                        onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vision</label>
                      <textarea
                        rows={3}
                        value={settings.vision}
                        onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Principal / School Leadership</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Principal / Incharge Name</label>
                      <input
                        type="text"
                        value={settings.principalName}
                        onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                        placeholder="e.g. Principal / Administration Head"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label="Principal Photo"
                        value={settings.principalPhoto || ''}
                        onChange={(url) => setSettings({ ...settings, principalPhoto: url })}
                        helperText="Principal / Head Teacher portrait photo displayed in the About Us section."
                        aspectRatio="portrait"
                        idPrefix="about-principal-img"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Principal's Message</label>
                      <textarea
                        rows={4}
                        value={settings.principalMessage}
                        onChange={(e) => setSettings({ ...settings, principalMessage: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Save About Content</span>
                  </button>
                </div>
              </form>
            )}

            {/* 6. CLASSES TAB */}
            {activeTab === 'classes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Primary Classes</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Add, update, or remove primary school classes.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingClass({ name: '', ageGroup: '', description: '', order: classes.length + 1 })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Class</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{cls.name}</h4>
                          <span className="text-xs text-slate-500 font-medium">{cls.ageGroup}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{cls.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Order: {cls.order}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingClass(cls)}
                            className="p-1 rounded text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await api.deleteClass(cls.id);
                                setClasses(prev => prev.filter(c => c.id !== cls.id));
                                showNotification(`Class ${cls.name} permanently deleted`);
                                onRefreshData();
                              } catch {
                                showNotification('Failed to delete class', 'error');
                              }
                            }}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SUBJECTS TAB */}
            {activeTab === 'subjects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Primary Subjects</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Manage subjects taught across primary grades.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingSubject({ name: '', description: '', category: 'Core Academics', order: subjects.length + 1 })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Subject</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {subjects.map((sub) => (
                    <div key={sub.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900">{sub.category}</span>
                        </div>
                        <p className="text-xs text-slate-600">{sub.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Order: {sub.order}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingSubject(sub)}
                            className="p-1 rounded text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await api.deleteSubject(sub.id);
                                setSubjects(prev => prev.filter(s => s.id !== sub.id));
                                showNotification(`Subject ${sub.name} permanently deleted`);
                                onRefreshData();
                              } catch {
                                showNotification('Failed to delete subject', 'error');
                              }
                            }}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TEACHERS TAB */}
            {activeTab === 'teachers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Teachers & Faculty</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Manage teachers, designations, and biographies.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingTeacher({ name: '', position: 'Primary Teacher', bio: '', photo: '', order: teachers.length + 1 })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Teacher</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {teachers.map((tch) => (
                    <div key={tch.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="h-40 bg-slate-100 overflow-hidden">
                          <img src={tch.photo} alt={tch.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 text-sm">{tch.name}</h4>
                          <span className="text-[11px] font-semibold text-amber-700">{tch.position}</span>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-3">{tch.bio}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Order: {tch.order}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditingTeacher(tch)} className="p-1 text-blue-700 hover:bg-blue-100 rounded">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await api.deleteTeacher(tch.id);
                                setTeachers(prev => prev.filter(t => t.id !== tch.id));
                                showNotification(`Teacher ${tch.name} permanently deleted`);
                                onRefreshData();
                              } catch {
                                showNotification('Failed to delete teacher', 'error');
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. ACTIVITIES TAB */}
            {activeTab === 'activities' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Student Activities</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Manage co-curricular, sports, drawing, and reading activities.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingActivity({ title: '', description: '', category: 'Sports', image: '', order: activities.length + 1 })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Activity</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activities.map((act) => (
                    <div key={act.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs flex">
                      <div className="w-36 h-36 shrink-0 bg-slate-100">
                        <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                            {act.category}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{act.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1">{act.description}</p>
                        </div>
                        <div className="flex justify-end gap-1 pt-2">
                          <button onClick={() => setEditingActivity(act)} className="p-1 text-blue-700 hover:bg-blue-50 rounded">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await api.deleteActivity(act.id);
                                setActivities(prev => prev.filter(a => a.id !== act.id));
                                showNotification(`Activity ${act.title} permanently deleted`);
                                onRefreshData();
                              } catch {
                                showNotification('Failed to delete activity', 'error');
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Events & Announcements</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Post admission alerts, examination notices, holidays, and school meetings.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingEvent({ title: '', date: 'Upcoming Date', category: 'Announcement', description: '', isImportant: false })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event / Notice</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {events.map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl border bg-white border-slate-200 shadow-2xs flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold">
                            {evt.category}
                          </span>
                          {evt.isImportant && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                              Important
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-semibold">{evt.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{evt.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{evt.description}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setEditingEvent(evt)} className="p-1.5 rounded text-blue-700 hover:bg-blue-50">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await api.deleteEvent(evt.id);
                              setEvents(prev => prev.filter(e => e.id !== evt.id));
                              showNotification(`Event "${evt.title}" permanently deleted`);
                              onRefreshData();
                            } catch {
                              showNotification('Failed to delete event', 'error');
                            }
                          }}
                          className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">School Gallery</h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Upload and manage images shown in the public gallery.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingGallery({ title: '', category: 'School', imageUrl: '', caption: '' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Gallery Image</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs group flex flex-col justify-between hover:border-[#003366]/40 transition-all">
                      <div>
                        <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setQuickPhotoModal({
                                  type: 'gallery',
                                  id: item.id,
                                  title: `Change Picture: ${item.title}`,
                                  currentUrl: item.imageUrl,
                                  onSave: async (newUrl) => {
                                    const updated = await api.updateGalleryItem(item.id, { ...item, imageUrl: newUrl });
                                    setGallery(prev => prev.map(g => g.id === updated.id ? updated : g));
                                    showNotification(`Picture updated for "${item.title}"`);
                                    onRefreshData();
                                  }
                                });
                              }}
                              className="p-1.5 rounded-full bg-[#003366] text-white hover:bg-[#002244] shadow-md transition-colors"
                              title="Change Photo"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </button>
                            <button
                              onClick={() => setEditingGallery(item)}
                              className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
                              title="Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await api.deleteGalleryItem(item.id);
                                  setGallery(prev => prev.filter(g => g.id !== item.id));
                                  showNotification(`Gallery image "${item.title}" permanently deleted`);
                                  onRefreshData();
                                } catch {
                                  showNotification('Failed to delete image', 'error');
                                }
                              }}
                              className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-colors"
                              title="Delete image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900">{item.category}</span>
                          <h4 className="font-bold text-xs text-slate-900 truncate mt-1">{item.title}</h4>
                          {item.caption && <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.caption}</p>}
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setQuickPhotoModal({
                              type: 'gallery',
                              id: item.id,
                              title: `Change Picture: ${item.title}`,
                              currentUrl: item.imageUrl,
                              onSave: async (newUrl) => {
                                const updated = await api.updateGalleryItem(item.id, { ...item, imageUrl: newUrl });
                                setGallery(prev => prev.map(g => g.id === updated.id ? updated : g));
                                showNotification(`Picture updated for "${item.title}"`);
                                onRefreshData();
                              }
                            });
                          }}
                          className="px-2 py-1 rounded bg-[#E6F0FF] hover:bg-[#003366] text-[#003366] hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3 h-3 text-[#D4AF37]" />
                          <span>Change Pic</span>
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingGallery(item)}
                            className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                            title="Edit Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await api.deleteGalleryItem(item.id);
                                setGallery(prev => prev.filter(g => g.id !== item.id));
                                showNotification(`Gallery image "${item.title}" permanently deleted`);
                                onRefreshData();
                              } catch {
                                showNotification('Failed to delete image', 'error');
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                            title="Delete Pic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-lg">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Admin Security</h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Change the password used to access this Super Admin Portal.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currPass}
                      onChange={(e) => setCurrPass(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                      placeholder="Enter new strong password"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Update Admin Password
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* UNIFIED GLOBAL MODALS */}
      {/* 1. CLASS MODAL */}
      {editingClass && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                {editingClass.id ? 'Edit Primary Class' : 'Add New Primary Class'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={editingClass.name || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  placeholder="e.g. Nursery or Grade 1"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age Group</label>
                <input
                  type="text"
                  value={editingClass.ageGroup || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, ageGroup: e.target.value })}
                  placeholder="e.g. Age 4 – 5 Years"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingClass.description || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingClass.order || 1}
                  onChange={(e) => setEditingClass({ ...editingClass, order: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingClass.name?.trim()) {
                    showNotification('Please enter a class name', 'error');
                    return;
                  }
                  try {
                    if (editingClass.id) {
                      const updated = await api.updateClass(editingClass.id, editingClass);
                      setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
                      showNotification(`Class "${updated.name}" updated permanently`);
                    } else {
                      const created = await api.addClass(editingClass as any);
                      setClasses(prev => [...prev, created]);
                      showNotification(`Class "${created.name}" added permanently`);
                    }
                    setEditingClass(null);
                    onRefreshData();
                  } catch {
                    showNotification('Failed to save class', 'error');
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save Class</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUBJECT MODAL */}
      {editingSubject && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                {editingSubject.id ? 'Edit Subject' : 'Add New Subject'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editingSubject.name || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  placeholder="e.g. Mathematics or Urdu"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingSubject.category || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, category: e.target.value })}
                  placeholder="e.g. Core Academics, Languages, Moral"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingSubject.description || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingSubject.name?.trim()) {
                    showNotification('Please enter a subject name', 'error');
                    return;
                  }
                  try {
                    if (editingSubject.id) {
                      const updated = await api.updateSubject(editingSubject.id, editingSubject);
                      setSubjects(prev => prev.map(s => s.id === updated.id ? updated : s));
                      showNotification(`Subject "${updated.name}" updated permanently`);
                    } else {
                      const created = await api.addSubject(editingSubject as any);
                      setSubjects(prev => [...prev, created]);
                      showNotification(`Subject "${created.name}" added permanently`);
                    }
                    setEditingSubject(null);
                    onRefreshData();
                  } catch {
                    showNotification('Failed to save subject', 'error');
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save Subject</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TEACHER MODAL */}
      {editingTeacher && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                {editingTeacher.id ? 'Edit Teacher' : 'Add New Teacher'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Name</label>
                <input
                  type="text"
                  value={editingTeacher.name || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  placeholder="e.g. Mrs. Ayesha Khan"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Position / Role</label>
                <input
                  type="text"
                  value={editingTeacher.position || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, position: e.target.value })}
                  placeholder="e.g. Senior Primary Teacher, Science Head"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <ImageUploadField
                label="Teacher Profile Photo"
                value={editingTeacher.photo || ''}
                onChange={(url) => setEditingTeacher({ ...editingTeacher, photo: url })}
                helperText="Upload teacher portrait photo from phone/PC or select a sample image."
                aspectRatio="square"
                idPrefix="modal-tch-photo"
              />
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={editingTeacher.bio || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                  placeholder="Qualifications and background..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingTeacher.name?.trim()) {
                    showNotification('Please enter teacher name', 'error');
                    return;
                  }
                  try {
                    if (editingTeacher.id) {
                      const updated = await api.updateTeacher(editingTeacher.id, editingTeacher);
                      setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
                      showNotification(`Teacher "${updated.name}" updated permanently`);
                    } else {
                      const created = await api.addTeacher(editingTeacher as any);
                      setTeachers(prev => [...prev, created]);
                      showNotification(`Teacher "${created.name}" added permanently`);
                    }
                    setEditingTeacher(null);
                    onRefreshData();
                  } catch {
                    showNotification('Failed to save teacher', 'error');
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save Teacher</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACTIVITY MODAL */}
      {editingActivity && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                {editingActivity.id ? 'Edit Activity' : 'Add Activity'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingActivity.title || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  placeholder="e.g. Annual Sports & Martial Arts"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingActivity.category || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value })}
                  placeholder="e.g. Sports, Art & Craft, Literacy"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <ImageUploadField
                label="Activity Photo"
                value={editingActivity.image || ''}
                onChange={(url) => setEditingActivity({ ...editingActivity, image: url })}
                helperText="Upload activity photo from phone/PC or choose a sample image."
                aspectRatio="video"
                idPrefix="modal-act-photo"
              />
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingActivity.description || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  placeholder="Description of activities..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingActivity.title?.trim()) {
                    showNotification('Please enter an activity title', 'error');
                    return;
                  }
                  try {
                    if (editingActivity.id) {
                      const updated = await api.updateActivity(editingActivity.id, editingActivity);
                      setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
                      showNotification(`Activity "${updated.title}" updated permanently`);
                    } else {
                      const created = await api.addActivity(editingActivity as any);
                      setActivities(prev => [...prev, created]);
                      showNotification(`Activity "${created.title}" added permanently`);
                    }
                    setEditingActivity(null);
                    onRefreshData();
                  } catch {
                    showNotification('Failed to save activity', 'error');
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save Activity</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-bold text-slate-900">
                {editingEvent.id ? 'Edit Notice / Event' : 'Add New Notice / Event'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice / Event Title</label>
                <input
                  type="text"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="e.g. Spring Term Admissions Open"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date / Period</label>
                  <input
                    type="text"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="e.g. 15 March 2025"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    placeholder="e.g. Admissions, Meeting"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                  />
                </div>
              </div>
              <ImageUploadField
                label="Notice Banner Image (Optional)"
                value={editingEvent.image || ''}
                onChange={(url) => setEditingEvent({ ...editingEvent, image: url })}
                helperText="Upload event photo/poster or paste link."
                aspectRatio="video"
                idPrefix="modal-evt-photo"
              />
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Event or announcement details..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isImportantNoticeModal"
                  checked={!!editingEvent.isImportant}
                  onChange={(e) => setEditingEvent({ ...editingEvent, isImportant: e.target.checked })}
                  className="rounded text-[#003366]"
                />
                <label htmlFor="isImportantNoticeModal" className="font-bold text-slate-800 cursor-pointer">
                  Highlight as Important Announcement
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingEvent.title?.trim()) {
                    showNotification('Please enter a notice title', 'error');
                    return;
                  }
                  try {
                    if (editingEvent.id) {
                      const updated = await api.updateEvent(editingEvent.id, editingEvent);
                      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
                      showNotification(`Notice "${updated.title}" updated permanently`);
                    } else {
                      const created = await api.addEvent(editingEvent as any);
                      setEvents(prev => [created, ...prev]);
                      showNotification(`Notice "${created.title}" added permanently`);
                    }
                    setEditingEvent(null);
                    onRefreshData();
                  } catch {
                    showNotification('Failed to save notice', 'error');
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GALLERY MODAL */}
      {editingGallery && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center text-white">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {editingGallery.id ? 'Edit Gallery Photo & Details' : 'Add New Gallery Photo'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {editingGallery.id ? 'Change picture, title, category or caption' : 'Upload and publish photo permanently to website'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Title / Headline</label>
                <input
                  type="text"
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="e.g. Primary Science Fair Project"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editingGallery.category || 'School'}
                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366] bg-white"
                >
                  <option value="School">School & Campus</option>
                  <option value="Classroom">Classroom & Learning</option>
                  <option value="Activities">Activities & Co-curricular</option>
                  <option value="Events">Events & Celebrations</option>
                  <option value="Sports">Sports & Physical Education</option>
                </select>
              </div>

              <ImageUploadField
                label="Select or Upload Photo"
                value={editingGallery.imageUrl || ''}
                onChange={(url) => setEditingGallery({ ...editingGallery, imageUrl: url })}
                helperText="Upload a photo from your device or choose from curated school samples."
                aspectRatio="video"
                idPrefix="modal-gal-photo-global"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={editingGallery.caption || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                  placeholder="Brief context or description..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingGallery.title?.trim()) {
                    showNotification('Please enter an image title', 'error');
                    return;
                  }
                  if (!editingGallery.imageUrl?.trim()) {
                    showNotification('Please upload or select an image', 'error');
                    return;
                  }
                  try {
                    if (editingGallery.id) {
                      const updated = await api.updateGalleryItem(editingGallery.id, {
                        title: editingGallery.title,
                        category: editingGallery.category || 'School',
                        imageUrl: editingGallery.imageUrl,
                        caption: editingGallery.caption || ''
                      } as any);
                      setGallery(prev => prev.map(g => g.id === updated.id ? updated : g));
                      showNotification(`Gallery photo "${updated.title}" updated successfully!`);
                    } else {
                      const created = await api.addGalleryItem({
                        title: editingGallery.title,
                        category: editingGallery.category || 'School',
                        imageUrl: editingGallery.imageUrl,
                        caption: editingGallery.caption || ''
                      } as any);
                      setGallery(prev => [created, ...prev]);
                      showNotification(`Gallery photo "${created.title}" permanently added!`);
                    }
                    setEditingGallery(null);
                    onRefreshData();
                  } catch {
                    showNotification('Failed to save gallery photo', 'error');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{editingGallery.id ? 'Save Changes' : 'Add & Publish Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PHOTO UPLOAD & CHANGE MODAL */}
      {quickPhotoModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#003366] flex items-center justify-center text-white">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{quickPhotoModal.title}</h4>
                  <p className="text-[11px] text-slate-500">Upload new image file or paste URL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickPhotoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ImageUploadField
              label="Choose or Upload Picture"
              value={quickPhotoModal.currentUrl}
              onChange={(newUrl) => setQuickPhotoModal({ ...quickPhotoModal, currentUrl: newUrl })}
              helperText="Upload an image from your phone or computer, or enter any web URL."
              aspectRatio="video"
              idPrefix="modal-quick-photo"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickPhotoModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await quickPhotoModal.onSave(quickPhotoModal.currentUrl || '');
                  setQuickPhotoModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Save & Apply Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
