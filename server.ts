import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_PROJECTS, INITIAL_LEGISLATIVE, INITIAL_PROGRAMS, INITIAL_NEWS, INITIAL_GALLERY, INITIAL_CONTACTS } from './src/data/initialData';
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission, ProgramApplication } from './src/types';
import { sanitizeGalleryList } from './src/utils/youtube';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const DATA_FILE = path.join(__dirname, 'data', 'store.json');

  // In-memory data store with persistent file fallback
  let store = {
    projects: [...INITIAL_PROJECTS],
    legislative: [...INITIAL_LEGISLATIVE],
    programs: [...INITIAL_PROGRAMS],
    news: [...INITIAL_NEWS],
    gallery: sanitizeGalleryList([...INITIAL_GALLERY]),
    contacts: [...INITIAL_CONTACTS],
    applications: [] as ProgramApplication[],
    stats: {
      projectsCount: '24+',
      billsCount: '12+',
      citizensCount: '4,500+',
      wardsCount: '22'
    }
  };

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      store = { ...store, ...parsed };
    } else {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    }
  } catch (e) {
    console.warn('Failed to load store.json, using initial data:', e);
  }

  if (supabase) {
    try {
      const [pRes, lRes, prRes, nRes, gRes, cRes, aRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('legislative').select('*'),
        supabase.from('programs').select('*'),
        supabase.from('news').select('*'),
        supabase.from('gallery').select('*'),
        supabase.from('contacts').select('*'),
        supabase.from('applications').select('*'),
      ]);
      if (pRes.data && pRes.data.length > 0) store.projects = pRes.data;
      if (lRes.data && lRes.data.length > 0) store.legislative = lRes.data;
      if (prRes.data && prRes.data.length > 0) store.programs = prRes.data;
      if (nRes.data && nRes.data.length > 0) store.news = nRes.data;
      if (gRes.data && gRes.data.length > 0) store.gallery = sanitizeGalleryList(gRes.data);
      if (cRes.data && cRes.data.length > 0) store.contacts = cRes.data;
      if (aRes.data && aRes.data.length > 0) store.applications = aRes.data;
      console.log('Successfully loaded data from Supabase tables.');
    } catch (err) {
      console.warn('Supabase load warning (falling back to store.json):', err);
    }
  }

  function saveStore() {
    try {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));

      if (supabase) {
        Promise.all([
          supabase.from('projects').upsert(store.projects),
          supabase.from('legislative').upsert(store.legislative),
          supabase.from('programs').upsert(store.programs),
          supabase.from('news').upsert(store.news),
          supabase.from('gallery').upsert(store.gallery),
          supabase.from('contacts').upsert(store.contacts),
          supabase.from('applications').upsert(store.applications),
        ]).catch(err => console.warn('Supabase background sync warning:', err));
      }
    } catch (e) {
      console.error('Failed to save store.json:', e);
    }
  }

  // Termii SMS Helper function for background notifications
  async function sendTermiiSmsQuietly(to: string, sms: string) {
    const apiKey = process.env.TERMII_API_KEY;
    if (!apiKey || !to || !sms) return;
    try {
      const payload = {
        api_key: apiKey,
        to: to.replace(/[\s+-]/g, ''),
        from: process.env.TERMII_SENDER_ID || 'DanmajeYabo',
        sms,
        type: 'plain',
        channel: 'generic'
      };
      await fetch('https://v3.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Background Termii SMS dispatch failed:', e);
    }
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Termii SMS Gateway Configuration & Send Status
  app.get('/api/sms/config', (req, res) => {
    const apiKey = process.env.TERMII_API_KEY || '';
    const configured = apiKey.length > 5;
    const maskedKey = configured ? `${apiKey.substring(0, 4)}••••${apiKey.substring(apiKey.length - 4)}` : '';
    res.json({
      configured,
      maskedKey,
      senderId: process.env.TERMII_SENDER_ID || 'DanmajeYabo',
      endpoint: 'https://v3.termii.com/api/sms/send'
    });
  });

  app.post('/api/sms/send', async (req, res) => {
    const { to, sms, senderId, type, channel } = req.body;
    const apiKey = process.env.TERMII_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'TERMII_API_KEY is not configured on the server environment. Please set TERMII_API_KEY in your server environment variables.' 
      });
    }

    if (!to || !sms) {
      return res.status(400).json({ success: false, error: 'Recipient phone number (to) and message (sms) are required.' });
    }

    try {
      const payload = {
        api_key: apiKey,
        to: to.replace(/[\s+-]/g, ''),
        from: senderId || process.env.TERMII_SENDER_ID || 'DanmajeYabo',
        sms,
        type: type || 'plain',
        channel: channel || 'generic'
      };

      const response = await fetch('https://v3.termii.com/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok && (data.code === 'ok' || data.message_id || data.status === 'success' || data.code === 200)) {
        return res.json({ success: true, providerResponse: data, message: 'SMS successfully sent via Termii SMS Gateway.' });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: data.message || data.error || 'Termii SMS Gateway returned an error response.', 
          providerResponse: data 
        });
      }
    } catch (err: any) {
      console.error('Termii SMS API error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to connect to Termii SMS Gateway API.' });
    }
  });

  // Stats
  app.get('/api/stats', (req, res) => {
    res.json(store.stats);
  });
  app.put('/api/stats', (req, res) => {
    store.stats = { ...store.stats, ...req.body };
    saveStore();
    res.json(store.stats);
  });


  // Projects
  app.get('/api/projects', (req, res) => {
    res.json(store.projects);
  });
  app.post('/api/projects', (req, res) => {
    const newProj: Project = { ...req.body, id: `proj-${Date.now()}` };
    store.projects.unshift(newProj);
    saveStore();
    res.status(201).json(newProj);
  });
  app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const index = store.projects.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    store.projects[index] = { ...store.projects[index], ...req.body, id };
    saveStore();
    res.json(store.projects[index]);
  });
  app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    store.projects = store.projects.filter(p => p.id !== id);
    saveStore();
    res.json({ success: true });
  });

  // Legislative
  app.get('/api/legislative', (req, res) => {
    res.json(store.legislative);
  });
  app.post('/api/legislative', (req, res) => {
    const item: LegislativeRecord = { ...req.body, id: `leg-${Date.now()}` };
    store.legislative.unshift(item);
    saveStore();
    res.status(201).json(item);
  });
  app.put('/api/legislative/:id', (req, res) => {
    const { id } = req.params;
    const index = store.legislative.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });
    store.legislative[index] = { ...store.legislative[index], ...req.body, id };
    saveStore();
    res.json(store.legislative[index]);
  });
  app.delete('/api/legislative/:id', (req, res) => {
    store.legislative = store.legislative.filter(l => l.id !== req.params.id);
    saveStore();
    res.json({ success: true });
  });

  // Programs
  app.get('/api/programs', (req, res) => {
    res.json(store.programs);
  });
  app.post('/api/programs', (req, res) => {
    const item: EmpowermentProgram = { ...req.body, id: `prog-${Date.now()}` };
    store.programs.unshift(item);
    saveStore();
    res.status(201).json(item);
  });
  app.put('/api/programs/:id', (req, res) => {
    const { id } = req.params;
    const index = store.programs.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Program not found' });
    store.programs[index] = { ...store.programs[index], ...req.body, id };
    saveStore();
    res.json(store.programs[index]);
  });
  app.delete('/api/programs/:id', (req, res) => {
    store.programs = store.programs.filter(p => p.id !== req.params.id);
    saveStore();
    res.json({ success: true });
  });

  // News
  app.get('/api/news', (req, res) => {
    res.json(store.news);
  });
  app.post('/api/news', (req, res) => {
    const item: NewsArticle = { ...req.body, id: `news-${Date.now()}` };
    store.news.unshift(item);
    saveStore();
    res.status(201).json(item);
  });
  app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const index = store.news.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ error: 'Article not found' });
    store.news[index] = { ...store.news[index], ...req.body, id };
    saveStore();
    res.json(store.news[index]);
  });
  app.delete('/api/news/:id', (req, res) => {
    store.news = store.news.filter(n => n.id !== req.params.id);
    saveStore();
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    res.json(store.gallery);
  });
  app.post('/api/gallery', (req, res) => {
    const item: GalleryItem = { ...req.body, id: `gal-${Date.now()}` };
    store.gallery.unshift(item);
    saveStore();
    res.status(201).json(item);
  });
  app.put('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    const index = store.gallery.findIndex(g => g.id === id);
    if (index === -1) return res.status(404).json({ error: 'Gallery item not found' });
    store.gallery[index] = { ...store.gallery[index], ...req.body, id };
    saveStore();
    res.json(store.gallery[index]);
  });
  app.delete('/api/gallery/:id', (req, res) => {
    store.gallery = store.gallery.filter(g => g.id !== req.params.id);
    saveStore();
    res.json({ success: true });
  });

  // Contacts
  app.get('/api/contacts', (req, res) => {
    res.json(store.contacts);
  });
  app.post('/api/contacts', (req, res) => {
    const item: ContactSubmission = {
      ...req.body,
      id: `con-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Unread'
    };
    store.contacts.unshift(item);
    saveStore();
    res.status(201).json(item);
  });
  app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const index = store.contacts.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Contact not found' });
    store.contacts[index] = { ...store.contacts[index], ...req.body };
    saveStore();
    res.json(store.contacts[index]);
  });

  // Applications
  app.get('/api/applications', (req, res) => {
    res.json(store.applications);
  });
  app.post('/api/applications', (req, res) => {
    const appItem: ProgramApplication = {
      id: req.body.id || `app-${Date.now()}`,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0],
      status: req.body.status || 'SUBMITTED'
    };
    store.applications.unshift(appItem);
    saveStore();

    if (appItem.phone) {
      sendTermiiSmsQuietly(
        appItem.phone,
        `Hon. Umar Yusuf (Danmaje Yabo): Your application (${appItem.referenceNumber || appItem.id}) for "${appItem.programTitle}" has been received and logged into the constituency portal. Track via *384*77#.`
      );
    }

    res.status(201).json(appItem);
  });
  app.put('/api/applications/:id', (req, res) => {
    const { id } = req.params;
    const index = store.applications.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Application not found' });
    const oldApp = store.applications[index];
    store.applications[index] = { ...oldApp, ...req.body };
    const newApp = store.applications[index];
    saveStore();

    if (newApp.phone && newApp.status && newApp.status !== oldApp.status) {
      if (newApp.status === 'APPROVED') {
        sendTermiiSmsQuietly(
          newApp.phone,
          `CONGRATULATIONS! Hon. Umar Yusuf (Danmaje Yabo) Empower Desk: Your application (${newApp.referenceNumber}) for "${newApp.programTitle}" has been APPROVED. Access your official congratulatory offer letter on the constituency portal.`
        );
      } else if (newApp.status === 'REJECTED') {
        sendTermiiSmsQuietly(
          newApp.phone,
          `Hon. Umar Yusuf (Danmaje Yabo) Constituency Update: Your application (${newApp.referenceNumber}) review has concluded. Thank you for participating in Yabo/Shagari grassroots development.`
        );
      } else {
        sendTermiiSmsQuietly(
          newApp.phone,
          `Hon. Umar Yusuf (Danmaje Yabo) Portal Update: Your application (${newApp.referenceNumber}) stage has advanced to ${newApp.status}.`
        );
      }
    }

    res.json(newApp);
  });


  // Admin Login mock
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@danmayeyabo.gov.ng' && (password === 'DANMAJEFOREVER' || password === 'password123')) {
      res.json({ token: 'mock-jwt-token-danmaje-yabo', user: { name: 'Hon. Admin Staff', email, role: 'Super Administrator' } });
    } else {
      res.status(401).json({ error: 'Invalid email or password. (Official credentials: admin@danmayeyabo.gov.ng / DANMAJEFOREVER)' });
    }
  });

  // Setup Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
