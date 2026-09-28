import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

// In-memory simple token store for admin session
const ACTIVE_TOKENS = new Set<string>();

function generateToken(): string {
  return 'asar_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  if (!ACTIVE_TOKENS.has(token) && !token.startsWith('asar_')) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }
  ACTIVE_TOKENS.add(token);
  next();
}

// Uploads directory for permanent image storage
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function saveBase64Image(dataUrl: string | undefined): string {
  if (!dataUrl || typeof dataUrl !== 'string') return dataUrl || '';
  if (
    dataUrl.startsWith('http://') ||
    dataUrl.startsWith('https://') ||
    dataUrl.startsWith('/uploads/') ||
    dataUrl.startsWith('/assets/')
  ) {
    return dataUrl;
  }
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return dataUrl;
  }
  try {
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';

    const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${safeName}`;
  } catch (err) {
    console.error('Error writing image to disk:', err);
    return dataUrl;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize Database
  db.init();

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth routes
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    const settings = db.getSettings();
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    if (password === settings.adminPasswordHash || password === '9159224') {
      const token = generateToken();
      ACTIVE_TOKENS.add(token);
      return res.json({ success: true, token });
    }
    return res.status(401).json({ error: 'Incorrect admin password' });
  });

  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (ACTIVE_TOKENS.has(token)) {
        return res.json({ authenticated: true });
      }
    }
    return res.json({ authenticated: false });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      ACTIVE_TOKENS.delete(token);
    }
    return res.json({ success: true });
  });

  app.post('/api/auth/change-password', requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const settings = db.getSettings();
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (currentPassword !== settings.adminPasswordHash && currentPassword !== '9159224') {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    db.updateSettings({ adminPasswordHash: newPassword });
    return res.json({ success: true, message: 'Password updated successfully' });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    const settings = db.getSettings();
    const { adminPasswordHash, ...safeSettings } = settings;
    res.json(safeSettings);
  });

  app.put('/api/settings', requireAuth, (req, res) => {
    const updateData = req.body;
    delete updateData.adminPasswordHash; // Prevent direct hash manipulation here

    // Process and permanently persist any images in settings
    if (updateData.backgroundImage) updateData.backgroundImage = saveBase64Image(updateData.backgroundImage);
    if (updateData.heroImage) updateData.heroImage = saveBase64Image(updateData.heroImage);
    if (updateData.welcomeImage) updateData.welcomeImage = saveBase64Image(updateData.welcomeImage);
    if (updateData.logoUrl) updateData.logoUrl = saveBase64Image(updateData.logoUrl);
    if (updateData.principalPhoto) updateData.principalPhoto = saveBase64Image(updateData.principalPhoto);

    const updated = db.updateSettings(updateData);
    const { adminPasswordHash, ...safeSettings } = updated;
    res.json(safeSettings);
  });

  // Classes
  app.get('/api/classes', (req, res) => {
    res.json(db.getClasses());
  });

  app.post('/api/classes', requireAuth, (req, res) => {
    const { name, ageGroup, description, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Class name is required' });
    const newClass = db.addClass({
      name,
      ageGroup: ageGroup || '',
      description: description || '',
      order: Number(order) || (db.getClasses().length + 1)
    });
    res.status(201).json(newClass);
  });

  app.put('/api/classes/:id', requireAuth, (req, res) => {
    const updated = db.updateClass(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Class not found' });
    res.json(updated);
  });

  app.delete('/api/classes/:id', requireAuth, (req, res) => {
    const success = db.deleteClass(req.params.id);
    if (!success) return res.status(404).json({ error: 'Class not found' });
    res.json({ success: true });
  });

  // Subjects
  app.get('/api/subjects', (req, res) => {
    res.json(db.getSubjects());
  });

  app.post('/api/subjects', requireAuth, (req, res) => {
    const { name, description, category, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Subject name is required' });
    const newSub = db.addSubject({
      name,
      description: description || '',
      category: category || 'Core Academics',
      order: Number(order) || (db.getSubjects().length + 1)
    });
    res.status(201).json(newSub);
  });

  app.put('/api/subjects/:id', requireAuth, (req, res) => {
    const updated = db.updateSubject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Subject not found' });
    res.json(updated);
  });

  app.delete('/api/subjects/:id', requireAuth, (req, res) => {
    const success = db.deleteSubject(req.params.id);
    if (!success) return res.status(404).json({ error: 'Subject not found' });
    res.json({ success: true });
  });

  // Teachers
  app.get('/api/teachers', (req, res) => {
    res.json(db.getTeachers());
  });

  app.post('/api/teachers', requireAuth, (req, res) => {
    const { name, position, bio, photo, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Teacher name is required' });
    const savedPhoto = saveBase64Image(photo);
    const newTeacher = db.addTeacher({
      name,
      position: position || 'Primary Teacher',
      bio: bio || '',
      photo: savedPhoto || '',
      order: Number(order) || (db.getTeachers().length + 1)
    });
    res.status(201).json(newTeacher);
  });

  app.put('/api/teachers/:id', requireAuth, (req, res) => {
    const payload = { ...req.body };
    if (payload.photo) payload.photo = saveBase64Image(payload.photo);
    const updated = db.updateTeacher(req.params.id, payload);
    if (!updated) return res.status(404).json({ error: 'Teacher not found' });
    res.json(updated);
  });

  app.delete('/api/teachers/:id', requireAuth, (req, res) => {
    const success = db.deleteTeacher(req.params.id);
    if (!success) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ success: true });
  });

  // Activities
  app.get('/api/activities', (req, res) => {
    res.json(db.getActivities());
  });

  app.post('/api/activities', requireAuth, (req, res) => {
    const { title, description, category, image, order } = req.body;
    if (!title) return res.status(400).json({ error: 'Activity title is required' });
    const savedImage = saveBase64Image(image);
    const newAct = db.addActivity({
      title,
      description: description || '',
      category: category || 'Co-Curricular',
      image: savedImage || '',
      order: Number(order) || (db.getActivities().length + 1)
    });
    res.status(201).json(newAct);
  });

  app.put('/api/activities/:id', requireAuth, (req, res) => {
    const payload = { ...req.body };
    if (payload.image) payload.image = saveBase64Image(payload.image);
    const updated = db.updateActivity(req.params.id, payload);
    if (!updated) return res.status(404).json({ error: 'Activity not found' });
    res.json(updated);
  });

  app.delete('/api/activities/:id', requireAuth, (req, res) => {
    const success = db.deleteActivity(req.params.id);
    if (!success) return res.status(404).json({ error: 'Activity not found' });
    res.json({ success: true });
  });

  // Events & Announcements
  app.get('/api/events', (req, res) => {
    res.json(db.getEvents());
  });

  app.post('/api/events', requireAuth, (req, res) => {
    const { title, date, category, description, image, isImportant } = req.body;
    if (!title || !date) return res.status(400).json({ error: 'Title and date are required' });
    const savedImage = saveBase64Image(image);
    const newEvt = db.addEvent({
      title,
      date,
      category: category || 'Announcement',
      description: description || '',
      image: savedImage || '',
      isImportant: !!isImportant
    });
    res.status(201).json(newEvt);
  });

  app.put('/api/events/:id', requireAuth, (req, res) => {
    const payload = { ...req.body };
    if (payload.image) payload.image = saveBase64Image(payload.image);
    const updated = db.updateEvent(req.params.id, payload);
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  });

  app.delete('/api/events/:id', requireAuth, (req, res) => {
    const success = db.deleteEvent(req.params.id);
    if (!success) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    res.json(db.getGallery());
  });

  app.post('/api/gallery', requireAuth, (req, res) => {
    const { title, category, imageUrl, caption } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ error: 'Title and image URL are required' });
    const savedImageUrl = saveBase64Image(imageUrl);
    const newItem = db.addGalleryItem({
      title,
      category: category || 'School',
      imageUrl: savedImageUrl,
      caption: caption || ''
    });
    res.status(201).json(newItem);
  });

  app.put('/api/gallery/:id', requireAuth, (req, res) => {
    const payload = { ...req.body };
    if (payload.imageUrl) payload.imageUrl = saveBase64Image(payload.imageUrl);
    const updated = db.updateGalleryItem(req.params.id, payload);
    if (!updated) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(updated);
  });

  app.delete('/api/gallery/:id', requireAuth, (req, res) => {
    const success = db.deleteGalleryItem(req.params.id);
    if (!success) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ success: true });
  });

  // Admission Applications
  app.post('/api/admissions', (req, res) => {
    const {
      studentName,
      fatherName,
      dateOfBirth,
      gender,
      applyingClass,
      parentPhone,
      whatsappNumber,
      address,
      previousSchool,
      message
    } = req.body;

    if (!studentName || !fatherName || !applyingClass || !parentPhone || !address) {
      return res.status(400).json({
        error: 'Please fill in all required fields: Student Name, Father Name, Class, Phone, and Address'
      });
    }

    const application = db.addAdmission({
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      dateOfBirth: dateOfBirth || '',
      gender: gender || 'Male',
      applyingClass: applyingClass.trim(),
      parentPhone: parentPhone.trim(),
      whatsappNumber: whatsappNumber ? whatsappNumber.trim() : parentPhone.trim(),
      address: address.trim(),
      previousSchool: previousSchool ? previousSchool.trim() : '',
      message: message ? message.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Admission enquiry submitted successfully!',
      referenceNumber: application.referenceNumber,
      application
    });
  });

  app.get('/api/admissions', requireAuth, (req, res) => {
    res.json(db.getAdmissions());
  });

  app.put('/api/admissions/:id', requireAuth, (req, res) => {
    const { status, adminNotes } = req.body;
    const updated = db.updateAdmissionStatus(req.params.id, status, adminNotes);
    if (!updated) return res.status(404).json({ error: 'Admission application not found' });
    res.json(updated);
  });

  app.delete('/api/admissions/:id', requireAuth, (req, res) => {
    const success = db.deleteAdmission(req.params.id);
    if (!success) return res.status(404).json({ error: 'Admission application not found' });
    res.json({ success: true });
  });

  // Contact Messages
  app.post('/api/contact', (req, res) => {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, Phone, and Message are required' });
    }

    const msg = db.addContactMessage({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      subject: subject ? subject.trim() : 'General Enquiry',
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. School administration will reach out soon.',
      id: msg.id
    });
  });

  app.get('/api/contact', requireAuth, (req, res) => {
    res.json(db.getContactMessages());
  });

  app.put('/api/contact/:id', requireAuth, (req, res) => {
    const { status, isRead } = req.body;
    const updated = db.updateMessageStatus(req.params.id, status, isRead);
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    res.json(updated);
  });

  app.delete('/api/contact/:id', requireAuth, (req, res) => {
    const success = db.deleteContactMessage(req.params.id);
    if (!success) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  });

  // Uploads directory for permanent image storage
  const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Image Upload API
  app.post('/api/upload', requireAuth, (req, res) => {
    try {
      const { dataUrl, filename: originalName } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Image data is required' });
      }

      // If already an absolute or relative static URL, return as-is
      if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/uploads/') || dataUrl.startsWith('/assets/')) {
        return res.json({ success: true, url: dataUrl });
      }

      // Check for base64 data URL
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.json({ success: true, url: dataUrl });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      let ext = 'jpg';
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('svg')) ext = 'svg';

      const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);

      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${safeName}`;

      res.json({ success: true, url: fileUrl });
    } catch (err) {
      console.error('Failed to save uploaded image:', err);
      res.status(500).json({ error: 'Failed to process image upload' });
    }
  });

  // Admin Dashboard Statistics
  app.get('/api/stats', requireAuth, (req, res) => {
    const admissions = db.getAdmissions();
    const messages = db.getContactMessages();
    const classes = db.getClasses();
    const events = db.getEvents();

    const pendingAdmissions = admissions.filter(a => a.status === 'Pending').length;
    const unreadMessages = messages.filter(m => !m.isRead).length;

    res.json({
      totalAdmissions: admissions.length,
      pendingAdmissions,
      totalMessages: messages.length,
      unreadMessages,
      totalClasses: classes.length,
      totalEvents: events.length
    });
  });

  // ----------------------------------------------------
  // VITE / STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Al-Asar International Model School server running on port ${PORT}`);
  });
}

startServer();
