import React, { useState, useEffect } from 'react';
import {
  SchoolSettings,
  SchoolClass,
  SchoolSubject,
  Teacher,
  Activity,
  SchoolEvent,
  GalleryItem,
  AdmissionApplication
} from './types';
import { api } from './lib/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WelcomeSection } from './components/WelcomeSection';
import { AboutSection } from './components/AboutSection';
import { AcademicsSection } from './components/AcademicsSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { EventsSection } from './components/EventsSection';
import { GallerySection } from './components/GallerySection';
import { TeachersSection } from './components/TeachersSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdmissionSuccessModal } from './components/AdmissionSuccessModal';
import { ParentPortalModal } from './components/ParentPortalModal';
import { SEOHead } from './components/SEOHead';
import { useScrollReveal } from './hooks/useScrollReveal';
import { Loader2 } from 'lucide-react';

const DEFAULT_FALLBACK_SETTINGS: SchoolSettings = {
  id: 'default',
  name: 'Al-Asar International Model School',
  subName: 'Lahor Swabi',
  tagline: 'Learning Today, Growing Tomorrow',
  level: 'Primary School (Playgroup to Grade 5)',
  location: 'Lahor (Chota Lahore), Swabi, Khyber Pakhtunkhwa, Pakistan',
  city: 'Lahor (Chota Lahore)',
  district: 'Swabi',
  province: 'Khyber Pakhtunkhwa',
  country: 'Pakistan',
  registrationNumber: 'PSRA-SWB-00085286-25',
  registrationAuthority: 'KP Private Schools Regulatory Authority (KPPSRA)',
  status: 'Active',
  phone: '03404333571',
  whatsappNumber: '03404333571',
  email: '',
  schoolTimings: 'Monday – Thursday: 8:00 AM – 1:30 PM | Friday: 8:00 AM – 12:00 PM',
  admissionStatus: 'Admissions Open for Session 2025–2026',
  admissionProcedure: '1. Complete and submit the online admission application form or visit the school office.\n2. Submit student\'s Birth Certificate / B-Form copy along with 2 passport photographs.\n3. Short friendly assessment and parent discussion.\n4. Confirmation and issuance of admission slip.',
  eligibilityInfo: 'Children seeking primary education in Playgroup, Nursery, Prep, and Grades 1 through 5.',
  requiredDocuments: '• Student B-Form / Birth Certificate (copy)\n• Father or Guardian CNIC (copy)\n• 2 Passport-size photographs\n• Previous School Leaving Certificate (for Grade 1 and above, if applicable)',
  feeInfo: 'For current admission and fee structure details, please contact the school administration office.',
  googleMapEmbedUrl: 'https://maps.google.com/maps?q=Lahor+Swabi+Khyber+Pakhtunkhwa+Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  heroIntroduction: 'Providing children with a positive learning environment, foundational education, good manners, self-confidence, and character development in Lahor, Swabi.',
  welcomeText: 'Al-Asar International Model School is dedicated to nurturing young minds during their most crucial foundational years. Situated in Lahor (Chota Lahore), Swabi, we provide child-friendly primary education focused on basic academic concepts, discipline, respect, and creative growth with caring and attentive teachers.',
  aboutText: 'Al-Asar International Model School serves children and families in Lahor, Swabi and adjacent areas. As a dedicated primary institution, we focus on fundamental literacy, mathematical thinking, Islamic and moral values, and student confidence in a safe, disciplined environment.',
  mission: 'To provide young children with a strong educational foundation and help them develop good habits, confidence, discipline, and positive character.',
  vision: 'To help young students become confident, responsible, and successful learners equipped for future educational milestones.',
  principalName: '',
  principalMessage: 'Welcome to Al-Asar International Model School. Our primary goal is to foster a safe, cheerful, and disciplined learning environment where children build solid foundational skills and moral values. We partner with parents to ensure every child is guided with care, patience, and encouragement.',
  principalPhoto: '',
  heroImage: '',
  welcomeImage: '',
  backgroundImage: '/uploads/img_1790579009641_m44vh9.jpg',
  logoUrl: '/uploads/img_1790579644773_ithkbu.jpg'
};

const PERMANENT_CLASSES: SchoolClass[] = [
  { id: 'class-pg', name: 'Playgroup (Pre-Nursery)', ageGroup: 'Age 3 – 4 Years', description: 'Play-based early learning focusing on motor skills, phonics sounds, colors, socialization, and confidence.', order: 1 },
  { id: 'class-nur', name: 'Nursery', ageGroup: 'Age 4 – 5 Years', description: 'Introduction to letter tracing, number recognition, basic Urdu & English vocabulary, and structured habits.', order: 2 },
  { id: 'class-prep', name: 'Prep (Kindergarten)', ageGroup: 'Age 5 – 6 Years', description: 'Preparation for formal schooling with reading readiness, basic addition/subtraction, writing skills, and manners.', order: 3 },
  { id: 'class-1', name: 'Grade 1', ageGroup: 'Age 6 – 7 Years', description: 'Foundations of reading comprehension, basic mathematics, Urdu reading, General Knowledge, and Islamiat.', order: 4 },
  { id: 'class-2', name: 'Grade 2', ageGroup: 'Age 7 – 8 Years', description: 'Sentence formation, mental math, primary science concepts, handwriting improvement, and moral lessons.', order: 5 },
  { id: 'class-3', name: 'Grade 3', ageGroup: 'Age 8 – 9 Years', description: 'Developing independent reading, word problems in mathematics, general science explorations, and conversational confidence.', order: 6 },
  { id: 'class-4', name: 'Grade 4', ageGroup: 'Age 9 – 10 Years', description: 'Enhanced conceptual learning in Science, Mathematics, English grammar, Social Studies, and Islamic studies.', order: 7 },
  { id: 'class-5', name: 'Grade 5', ageGroup: 'Age 10 – 11 Years', description: 'Comprehensive primary curriculum mastery, problem-solving, moral development, and preparation for middle school.', order: 8 }
];

const PERMANENT_SUBJECTS: SchoolSubject[] = [
  { id: 'sub-eng', name: 'English', description: 'Phonics, reading fluency, vocabulary, spelling, and sentence construction for early learners.', category: 'Languages', order: 1 },
  { id: 'sub-math', name: 'Mathematics', description: 'Number sense, basic arithmetic, counting, shapes, measurements, and simple word problems.', category: 'Core Academics', order: 2 },
  { id: 'sub-urdu', name: 'Urdu', description: 'Huroof-e-Tahajji, reading comprehension, handwriting (Khushkhati), and spoken expression.', category: 'Languages', order: 3 },
  { id: 'sub-sci', name: 'General Science', description: 'Exploring the natural world, living things, plants, animals, weather, and healthy living habits.', category: 'Core Academics', order: 4 },
  { id: 'sub-isl', name: 'Islamiat & Nazra Quran', description: 'Basic Islamic ethics, Duas, Kalimas, Tajweed basics, good manners (Adaab), and prophetic stories.', category: 'Moral Education', order: 5 },
  { id: 'sub-art', name: 'Art & Drawing', description: 'Creative coloring, sketching, paper craft, and fine motor skill enhancement.', category: 'Co-Curricular', order: 6 }
];

const PERMANENT_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Physical Sports & Play Activities',
    description: 'Healthy physical exercise, tag games, friendly sports races, and outdoor play that develop motor skills, teamwork, and agility.',
    category: 'Sports',
    image: '/uploads/img_1790579103925_q5nz45.jpg',
    order: 1
  },
  {
    id: 'act-2',
    title: 'Drawing & Creative Coloring',
    description: 'Engaging art sessions where children express their creativity, explore colors, and enhance their concentration and coordination.',
    category: 'Art & Craft',
    image: '/uploads/img_1790579149646_m6xmkj.jpg',
    order: 2
  },
  {
    id: 'act-3',
    title: 'Reading Circles & Storytelling',
    description: 'Interactive classroom story sessions that cultivate an early love for books, improve listening skills, and expand vocabulary.',
    category: 'Literacy',
    image: '/uploads/img_1790579190596_f6464r.jpg',
    order: 3
  },
  {
    id: 'act-4',
    title: 'School Celebrations & Special Days',
    description: 'Observing National Days, Pakistan Day, Eid celebrations, and Annual Prize Distribution events to build student confidence.',
    category: 'Celebrations',
    image: '/uploads/img_1790579246366_pqjt7r.jpg',
    order: 4
  }
];

const PERMANENT_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-1',
    title: 'New Academic Admissions Open for Primary Classes',
    date: 'Academic Year 2025–2026',
    category: 'Admissions',
    description: 'Admissions are currently underway for Playgroup, Nursery, Prep, and Primary Classes 1 through 5. Parents are welcome to apply online or visit the school desk.',
    image: '/uploads/img_1790579309606_jtks49.jpg',
    isImportant: true,
    createdAt: '2026-09-28T06:54:54.754Z'
  },
  {
    id: 'evt-2',
    title: 'First Term Parent-Teacher Meeting',
    date: 'Upcoming Saturday',
    category: 'Meeting',
    description: 'A constructive session for parents to discuss their child’s academic progress, daily classroom engagement, and moral development with class teachers.',
    image: '/uploads/img_1790579363398_42kags.jpg',
    isImportant: false,
    createdAt: '2026-09-28T06:54:54.754Z'
  },
  {
    id: 'evt-3',
    title: 'Primary Health, Cleanliness & Good Habits Week',
    date: 'School Activity Week',
    category: 'Activity',
    description: 'Special morning assembly talks and practical exercises on hand hygiene, neat uniforms, polite greetings, and respectful classroom conduct.',
    image: '/uploads/img_1790579450851_pw75up.jpg',
    isImportant: false,
    createdAt: '2026-09-28T06:54:54.754Z'
  }
];

const PERMANENT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-annual-gathering',
    title: 'Annual School Gathering & Community Function',
    category: 'Events',
    imageUrl: '/uploads/gallery_annual_gathering_1790580603298.jpg',
    caption: 'Parents, students, and teachers gathered for the grand annual community ceremony under the Al-Asar canopy.',
    createdAt: '2026-09-28T07:30:00.000Z'
  },
  {
    id: 'gal-prize-distribution',
    title: 'Annual Prize Distribution & Merit Awards',
    category: 'Events',
    imageUrl: '/uploads/gallery_prize_distribution_1790580618074.jpg',
    caption: 'Celebrating student academic achievements with merit shields, trophies, and certificates on stage.',
    createdAt: '2026-09-28T07:30:01.000Z'
  },
  {
    id: 'gal-primary-classroom',
    title: 'Primary Classroom Learning & Engagement',
    category: 'Classroom',
    imageUrl: '/uploads/gallery_primary_classroom_1790580631328.jpg',
    caption: 'Students actively engaged with foundational learning materials, books, and attentive primary school teachers.',
    createdAt: '2026-09-28T07:30:02.000Z'
  },
  {
    id: 'gal-morning-assembly',
    title: 'Morning Assembly & Student Presentations',
    category: 'School',
    imageUrl: '/uploads/gallery_morning_assembly_1790580642009.jpg',
    caption: 'Disciplined morning assembly in the courtyard featuring student speech presentations and daily prayer.',
    createdAt: '2026-09-28T07:30:03.000Z'
  },
  {
    id: 'gal-sports-activities',
    title: 'Sports Day & Physical Activity Sessions',
    category: 'Sports',
    imageUrl: '/uploads/gallery_sports_activities_1790580654523.jpg',
    caption: 'Active outdoor games, team sports, and agility exercises promoting health and teamwork.',
    createdAt: '2026-09-28T07:30:04.000Z'
  }
];

export default function App() {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_FALLBACK_SETTINGS);
  const [classes, setClasses] = useState<SchoolClass[]>(PERMANENT_CLASSES);
  const [subjects, setSubjects] = useState<SchoolSubject[]>(PERMANENT_SUBJECTS);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activities, setActivities] = useState<Activity[]>(PERMANENT_ACTIVITIES);
  const [events, setEvents] = useState<SchoolEvent[]>(PERMANENT_EVENTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(PERMANENT_GALLERY);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState<boolean>(false);
  const [submittedApplication, setSubmittedApplication] = useState<AdmissionApplication | null>(null);

  const fetchSchoolData = async () => {
    try {
      const [
        settingsData,
        classesData,
        subjectsData,
        teachersData,
        activitiesData,
        eventsData,
        galleryData
      ] = await Promise.all([
        api.getSettings(),
        api.getClasses(),
        api.getSubjects(),
        api.getTeachers(),
        api.getActivities(),
        api.getEvents(),
        api.getGallery()
      ]);

      if (settingsData && settingsData.name) {
        setSettings(settingsData);
      }
      if (Array.isArray(classesData) && classesData.length > 0) setClasses(classesData);
      if (Array.isArray(subjectsData) && subjectsData.length > 0) setSubjects(subjectsData);
      if (Array.isArray(teachersData)) setTeachers(teachersData);
      if (Array.isArray(activitiesData) && activitiesData.length > 0) setActivities(activitiesData);
      if (Array.isArray(eventsData) && eventsData.length > 0) setEvents(eventsData);
      if (Array.isArray(galleryData) && galleryData.length > 0) setGallery(galleryData);
    } catch (err) {
      console.error('Failed to load school data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, []);

  // Gordonstoun Luxury Scroll Reveal Observer
  useScrollReveal([classes, subjects, activities, events, gallery]);

  // Clean HTML5 pushState routing (ZERO '#') & Dunham School endpoints
  useEffect(() => {
    const handleRouteSync = () => {
      // Clean up legacy '#' from URL if user accessed via bookmark or old link
      if (window.location.hash) {
        const legacyHash = window.location.hash.replace(/^#\/?/, '');
        const targetCleanPath = legacyHash === 'home' || !legacyHash ? '/' : `/${legacyHash}`;
        window.history.replaceState(null, '', targetCleanPath);
      }

      const pathname = window.location.pathname.replace(/^\/+/, '').split('/')[0] || '';

      if (pathname === 'admin') {
        setIsAdminOpen(true);
      } else if (pathname === 'parent-portal' || pathname === 'our-community') {
        setIsParentPortalOpen(true);
      } else if (pathname) {
        let targetId = pathname;
        if (pathname === 'life-at-school') targetId = 'activities';
        if (pathname === 'news-events') targetId = 'events';

        setActiveSection(targetId);
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      } else {
        setActiveSection('home');
      }
    };

    handleRouteSync();
    window.addEventListener('popstate', handleRouteSync);
    return () => window.removeEventListener('popstate', handleRouteSync);
  }, []);

  const handleNavigate = (endpointId: string) => {
    let cleanUrlPath = endpointId;
    let targetDomId = endpointId;

    if (endpointId === 'activities' || endpointId === 'life-at-school') {
      cleanUrlPath = 'life-at-school';
      targetDomId = 'activities';
    } else if (endpointId === 'events' || endpointId === 'news-events') {
      cleanUrlPath = 'news-events';
      targetDomId = 'events';
    } else if (endpointId === 'our-community' || endpointId === 'parent-portal') {
      window.history.pushState(null, '', '/our-community');
      setIsParentPortalOpen(true);
      return;
    } else if (endpointId === 'admin') {
      window.history.pushState(null, '', '/admin');
      setIsAdminOpen(true);
      return;
    }

    setActiveSection(targetDomId);

    if (endpointId === 'home') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Set clean endpoint URL without any '#'
    window.history.pushState(null, '', `/${cleanUrlPath}`);
    const element = document.getElementById(targetDomId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400 mb-4" />
        <h2 className="text-lg font-bold">Al-Asar International Model School</h2>
        <p className="text-xs text-slate-400 mt-1">Lahor (Chota Lahore), Swabi, Khyber Pakhtunkhwa</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative">
      {/* Dynamic SEO Meta Tags & Head Controller */}
      <SEOHead
        activeSection={activeSection}
        settings={settings}
      />

      {/* Attractive Light Blue Background Layer with Hero Image Backdrop */}
      <AnimatedBackground
        backgroundImageUrl={settings.backgroundImage || settings.heroImage || settings.welcomeImage || '/assets/website-background.jpg'}
      />

      {/* Header */}
      <Header
        settings={settings}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
        onOpenParentPortal={() => handleNavigate('our-community')}
        onOpenContact={() => handleNavigate('contact')}
        hasTeachers={teachers.length > 0}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          settings={settings}
          onNavigate={handleNavigate}
          onOpenParentPortal={() => handleNavigate('our-community')}
        />

        {/* 2. Welcome Section */}
        <WelcomeSection
          settings={settings}
        />

        {/* 3. About School Section */}
        <AboutSection
          settings={settings}
        />

        {/* 4. Co-Curricular & Student Activities Section */}
        <ActivitiesSection
          activities={activities}
        />

        {/* 5. School Events, Notices & Announcements */}
        <EventsSection
          events={events}
          onOpenContact={() => handleNavigate('contact')}
        />

        {/* 6. Photo Gallery Section */}
        <GallerySection
          gallery={gallery}
        />

        {/* 7. Teachers Section (if any teachers configured) */}
        <TeachersSection
          teachers={teachers}
        />

        {/* 8. Primary Academics & Curriculum Section */}
        <AcademicsSection
          classes={classes}
          subjects={subjects}
          onOpenApply={() => handleNavigate('admissions')}
        />

        {/* 9. Admissions & Online Application Form Section */}
        <AdmissionsSection
          settings={settings}
          classes={classes}
          onAdmissionSuccess={(app) => setSubmittedApplication(app)}
        />

        {/* 10. Direct School Office & Contact Desk (Lahor, Swabi KP) */}
        <ContactSection
          settings={settings}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
        onOpenParentPortal={() => handleNavigate('our-community')}
        hasTeachers={teachers.length > 0}
      />

      {/* Floating Call / WhatsApp Buttons */}
      <FloatingActions
        settings={settings}
        onNavigateToContact={() => handleNavigate('contact')}
      />

      {/* Parent & Community Portal Modal (Dunham School Model) */}
      <ParentPortalModal
        isOpen={isParentPortalOpen}
        settings={settings}
        onClose={() => {
          setIsParentPortalOpen(false);
          const path = window.location.pathname;
          if (path === '/parent-portal' || path === '/our-community') {
            window.history.pushState(null, '', '/');
          }
        }}
        onOpenAdmissions={() => handleNavigate('admissions')}
      />

      {/* Admission Submission Success Receipt Modal */}
      {submittedApplication && (
        <AdmissionSuccessModal
          application={submittedApplication}
          settings={settings}
          onClose={() => setSubmittedApplication(null)}
        />
      )}

      {/* Super Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard
          initialSettings={settings}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
              window.history.pushState(null, '', '/');
            }
          }}
          onRefreshData={fetchSchoolData}
        />
      )}
    </div>
  );
}
