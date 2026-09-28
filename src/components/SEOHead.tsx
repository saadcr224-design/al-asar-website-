import React, { useEffect } from 'react';
import { SchoolSettings } from '../types';

interface SEOHeadProps {
  activeSection: string;
  settings: SchoolSettings;
}

const SECTION_SEO_MAP: Record<string, { title: string; description: string; canonical: string }> = {
  home: {
    title: 'Al-Asar International Model School Lahor Swabi | Primary School in Khyber Pakhtunkhwa',
    description: 'Official website of Al-Asar International Model School, Lahor (Chota Lahore), Swabi, Khyber Pakhtunkhwa. Registered with KPPSRA (PSRA-SWB-00085286-25). Providing foundational primary education from Playgroup to Grade 5.',
    canonical: '/'
  },
  about: {
    title: 'About Al-Asar International Model School | Primary Education in Swabi, KP',
    description: 'Learn about Al-Asar International Model School in Lahor, Swabi. Discover our mission, educational vision, KPPSRA registration, and message from the school administration.',
    canonical: '/about'
  },
  academics: {
    title: 'Primary Academics & Curriculum (Playgroup to Grade 5) | Al-Asar School Swabi',
    description: 'Explore primary curriculum and academic subjects at Al-Asar International Model School Lahor Swabi. Playgroup, Nursery, Prep, and Grades 1-5 foundational teaching methodology.',
    canonical: '/academics'
  },
  admissions: {
    title: 'Admissions Open Session 2025–2026 | Al-Asar International Model School Swabi',
    description: 'Apply for primary admissions (Playgroup to Grade 5) at Al-Asar International Model School in Lahor (Chota Lahore), Swabi. View admission procedure, required documents, and submit online enquiry.',
    canonical: '/admissions'
  },
  activities: {
    title: 'Student Activities & Co-Curricular Growth | Al-Asar Model School Swabi',
    description: 'Co-curricular sports, creative drawing, reading circles, and annual celebrations fostering confidence and character development at Al-Asar International Model School Swabi.',
    canonical: '/life-at-school'
  },
  'life-at-school': {
    title: 'Life at School & Co-Curricular Activities | Al-Asar Model School Swabi',
    description: 'Explore arts, sports, athletics, storytelling and annual functions at Al-Asar International Model School Lahor Swabi.',
    canonical: '/life-at-school'
  },
  'our-community': {
    title: 'Our Community & Parent Portal | Al-Asar Model School Swabi',
    description: 'Family resources, term calendar, uniform guidelines, and live admission application tracking for parents.',
    canonical: '/our-community'
  },
  events: {
    title: 'News, Notices & Academic Announcements | Al-Asar International Model School Swabi',
    description: 'Latest school announcements, term exams, parent-teacher meetings, holiday notices, and important updates from Al-Asar International Model School in Lahor, Swabi.',
    canonical: '/news-events'
  },
  'news-events': {
    title: 'News, Notices & Calendar | Al-Asar International Model School Swabi',
    description: 'Latest school notices, academic calendar, events, and examination timetables.',
    canonical: '/news-events'
  },
  gallery: {
    title: 'Campus & Classroom Photo Gallery | Al-Asar International Model School Swabi',
    description: 'Browse photos of classrooms, learning activities, sports, and campus life at Al-Asar International Model School in Lahor (Chota Lahore), Swabi, KP.',
    canonical: '/gallery'
  },
  teachers: {
    title: 'Faculty & Primary Mentors | Al-Asar International Model School Swabi',
    description: 'Meet our dedicated, caring, and attentive primary school teachers at Al-Asar International Model School in Lahor, Swabi.',
    canonical: '/teachers'
  },
  contact: {
    title: 'Contact School Administration & Location | Al-Asar International Model School Lahor Swabi',
    description: 'Find Al-Asar International Model School in Lahor (Chota Lahore), District Swabi, KP. Get phone numbers, WhatsApp, school timings, Google Maps location, and send direct messages.',
    canonical: '/contact'
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({ activeSection, settings }) => {
  useEffect(() => {
    const seoData = SECTION_SEO_MAP[activeSection] || SECTION_SEO_MAP['home'];
    
    // 1. Update Document Title
    const finalTitle = seoData.title.replace('Al-Asar International Model School', settings.name || 'Al-Asar International Model School');
    document.title = finalTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoData.description);

    // 3. Update Open Graph Meta Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', finalTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seoData.description);

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', finalTitle);

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', seoData.description);

    // 4. Update Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    const currentBase = window.location.origin + window.location.pathname;
    canonicalTag.setAttribute('href', seoData.canonical.startsWith('#') ? `${currentBase}${seoData.canonical}` : currentBase);

    // 5. Update Favicon / Tab Logo in Browser & Google Tab
    const currentFaviconUrl = settings.logoUrl || '/favicon.svg';
    const faviconSelectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel="alternate icon"]', 'link[rel="apple-touch-icon"]'];
    
    faviconSelectors.forEach((selector) => {
      let iconTag = document.querySelector(selector);
      if (!iconTag) {
        iconTag = document.createElement('link');
        if (selector.includes('apple')) {
          iconTag.setAttribute('rel', 'apple-touch-icon');
        } else if (selector.includes('shortcut')) {
          iconTag.setAttribute('rel', 'shortcut icon');
        } else {
          iconTag.setAttribute('rel', 'icon');
        }
        document.head.appendChild(iconTag);
      }
      iconTag.setAttribute('href', currentFaviconUrl);
    });

  }, [activeSection, settings]);

  return null;
};
