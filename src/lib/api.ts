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
} from '../types';

const TOKEN_KEY = 'asar_admin_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  // Auth
  async login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async verifyAuth(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: getHeaders(true)
      });
      const data = await res.json();
      return !!data.authenticated;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(true)
      });
    } finally {
      clearAuthToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SchoolSettings> {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Classes
  async getClasses(): Promise<SchoolClass[]> {
    const res = await fetch('/api/classes');
    return res.json();
  },

  async addClass(cls: Omit<SchoolClass, 'id'>): Promise<SchoolClass> {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(cls)
    });
    return res.json();
  },

  async updateClass(id: string, cls: Partial<SchoolClass>): Promise<SchoolClass> {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(cls)
    });
    return res.json();
  },

  async deleteClass(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Subjects
  async getSubjects(): Promise<SchoolSubject[]> {
    const res = await fetch('/api/subjects');
    return res.json();
  },

  async addSubject(sub: Omit<SchoolSubject, 'id'>): Promise<SchoolSubject> {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(sub)
    });
    return res.json();
  },

  async updateSubject(id: string, sub: Partial<SchoolSubject>): Promise<SchoolSubject> {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(sub)
    });
    return res.json();
  },

  async deleteSubject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    const res = await fetch('/api/teachers');
    return res.json();
  },

  async addTeacher(tch: Omit<Teacher, 'id'>): Promise<Teacher> {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(tch)
    });
    return res.json();
  },

  async updateTeacher(id: string, tch: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(tch)
    });
    return res.json();
  },

  async deleteTeacher(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Activities
  async getActivities(): Promise<Activity[]> {
    const res = await fetch('/api/activities');
    return res.json();
  },

  async addActivity(act: Omit<Activity, 'id'>): Promise<Activity> {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(act)
    });
    return res.json();
  },

  async updateActivity(id: string, act: Partial<Activity>): Promise<Activity> {
    const res = await fetch(`/api/activities/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(act)
    });
    return res.json();
  },

  async deleteActivity(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Events
  async getEvents(): Promise<SchoolEvent[]> {
    const res = await fetch('/api/events');
    return res.json();
  },

  async addEvent(evt: Omit<SchoolEvent, 'id' | 'createdAt'>): Promise<SchoolEvent> {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(evt)
    });
    return res.json();
  },

  async updateEvent(id: string, evt: Partial<SchoolEvent>): Promise<SchoolEvent> {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(evt)
    });
    return res.json();
  },

  async deleteEvent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    const res = await fetch('/api/gallery');
    return res.json();
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Admissions
  async submitAdmission(data: {
    studentName: string;
    fatherName: string;
    dateOfBirth?: string;
    gender: 'Male' | 'Female' | 'Other';
    applyingClass: string;
    parentPhone: string;
    whatsappNumber?: string;
    address: string;
    previousSchool?: string;
    message?: string;
  }): Promise<{ success: boolean; message: string; referenceNumber: string; application: AdmissionApplication; error?: string }> {
    const res = await fetch('/api/admissions', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit admission enquiry');
    }
    return result;
  },

  async getAdmissions(): Promise<AdmissionApplication[]> {
    const res = await fetch('/api/admissions', {
      headers: getHeaders(true)
    });
    return res.json();
  },

  async updateAdmissionStatus(id: string, status: AdmissionApplication['status'], adminNotes?: string): Promise<AdmissionApplication> {
    const res = await fetch(`/api/admissions/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status, adminNotes })
    });
    return res.json();
  },

  async deleteAdmission(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admissions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Contact
  async submitContact(data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }): Promise<{ success: boolean; message: string; id: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to send message');
    }
    return result;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/contact', {
      headers: getHeaders(true)
    });
    return res.json();
  },

  async updateMessageStatus(id: string, status: ContactMessage['status'], isRead?: boolean): Promise<ContactMessage> {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status, isRead })
    });
    return res.json();
  },

  async deleteContactMessage(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats', {
      headers: getHeaders(true)
    });
    return res.json();
  },

  // Permanent Image Upload
  async uploadImage(dataUrl: string, filename?: string): Promise<{ success: boolean; url: string; error?: string }> {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ dataUrl, filename })
      });
      const result = await res.json();
      if (res.ok && result.url) {
        return { success: true, url: result.url };
      }
      return { success: false, url: dataUrl, error: result.error };
    } catch (err) {
      console.warn('Fallback to direct dataUrl storage:', err);
      return { success: true, url: dataUrl };
    }
  }
};
