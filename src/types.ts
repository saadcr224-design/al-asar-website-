export interface SchoolSettings {
  id: string;
  name: string;
  subName: string;
  tagline: string;
  level: string;
  location: string;
  city: string;
  district: string;
  province: string;
  country: string;
  registrationNumber: string;
  registrationAuthority: string;
  status: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  schoolTimings: string;
  admissionStatus: string;
  admissionProcedure: string;
  eligibilityInfo: string;
  requiredDocuments: string;
  feeInfo: string;
  googleMapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  heroIntroduction: string;
  welcomeText: string;
  aboutText: string;
  mission: string;
  vision: string;
  principalName: string;
  principalMessage: string;
  principalPhoto: string;
  heroImage?: string;
  welcomeImage?: string;
  backgroundImage?: string;
  logoUrl?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  ageGroup: string;
  description: string;
  order: number;
}

export interface SchoolSubject {
  id: string;
  name: string;
  description: string;
  category: string;
  order: number;
}

export interface Teacher {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  order: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  order: number;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  isImportant?: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'School' | 'Classroom' | 'Activities' | 'Events' | 'Sports';
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export interface AdmissionApplication {
  id: string;
  referenceNumber: string;
  studentName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  applyingClass: string;
  parentPhone: string;
  whatsappNumber: string;
  address: string;
  previousSchool?: string;
  message?: string;
  status: 'Pending' | 'Reviewed' | 'Contacted' | 'Accepted' | 'Archived';
  adminNotes?: string;
  submittedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  status: 'New' | 'Replied' | 'Archived';
  submittedAt: string;
}

export interface DashboardStats {
  totalAdmissions: number;
  pendingAdmissions: number;
  totalMessages: number;
  unreadMessages: number;
  totalClasses: number;
  totalEvents: number;
}
