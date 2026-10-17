import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { INITIAL_PROJECTS, INITIAL_LEGISLATIVE, INITIAL_PROGRAMS, INITIAL_NEWS, INITIAL_GALLERY, INITIAL_CONTACTS } from './src/data/initialData';
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission, ProgramApplication } from './src/types';
import { sanitizeGalleryList } from './src/utils/youtube';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory data store with fallback to initial data
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

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Stats
  app.get('/api/stats', (req, res) => {
    res.json(store.stats);
  });
  app.put('/api/stats', (req, res) => {
    store.stats = { ...store.stats, ...req.body };
    res.json(store.stats);
  });

  // Projects
  app.get('/api/projects', (req, res) => {
    res.json(store.projects);
  });
  app.post('/api/projects', (req, res) => {
    const newProj: Project = { ...req.body, id: `proj-${Date.now()}` };
    store.projects.unshift(newProj);
    res.status(201).json(newProj);
  });
  app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const index = store.projects.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    store.projects[index] = { ...store.projects[index], ...req.body, id };
    res.json(store.projects[index]);
  });
  app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    store.projects = store.projects.filter(p => p.id !== id);
    res.json({ success: true });
  });

  // Legislative
  app.get('/api/legislative', (req, res) => {
    res.json(store.legislative);
  });
  app.post('/api/legislative', (req, res) => {
    const item: LegislativeRecord = { ...req.body, id: `leg-${Date.now()}` };
    store.legislative.unshift(item);
    res.status(201).json(item);
  });
  app.put('/api/legislative/:id', (req, res) => {
    const { id } = req.params;
    const index = store.legislative.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });
    store.legislative[index] = { ...store.legislative[index], ...req.body, id };
    res.json(store.legislative[index]);
  });
  app.delete('/api/legislative/:id', (req, res) => {
    store.legislative = store.legislative.filter(l => l.id !== req.params.id);
    res.json({ success: true });
  });

  // Programs
  app.get('/api/programs', (req, res) => {
    res.json(store.programs);
  });
  app.post('/api/programs', (req, res) => {
    const item: EmpowermentProgram = { ...req.body, id: `prog-${Date.now()}` };
    store.programs.unshift(item);
    res.status(201).json(item);
  });
  app.put('/api/programs/:id', (req, res) => {
    const { id } = req.params;
    const index = store.programs.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Program not found' });
    store.programs[index] = { ...store.programs[index], ...req.body, id };
    res.json(store.programs[index]);
  });
  app.delete('/api/programs/:id', (req, res) => {
    store.programs = store.programs.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // News
  app.get('/api/news', (req, res) => {
    res.json(store.news);
  });
  app.post('/api/news', (req, res) => {
    const item: NewsArticle = { ...req.body, id: `news-${Date.now()}` };
    store.news.unshift(item);
    res.status(201).json(item);
  });
  app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const index = store.news.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ error: 'Article not found' });
    store.news[index] = { ...store.news[index], ...req.body, id };
    res.json(store.news[index]);
  });
  app.delete('/api/news/:id', (req, res) => {
    store.news = store.news.filter(n => n.id !== req.params.id);
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    res.json(store.gallery);
  });
  app.post('/api/gallery', (req, res) => {
    const item: GalleryItem = { ...req.body, id: `gal-${Date.now()}` };
    store.gallery.unshift(item);
    res.status(201).json(item);
  });
  app.put('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    const index = store.gallery.findIndex(g => g.id === id);
    if (index === -1) return res.status(404).json({ error: 'Gallery item not found' });
    store.gallery[index] = { ...store.gallery[index], ...req.body, id };
    res.json(store.gallery[index]);
  });
  app.delete('/api/gallery/:id', (req, res) => {
    store.gallery = store.gallery.filter(g => g.id !== req.params.id);
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
    res.status(201).json(item);
  });
  app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const index = store.contacts.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Contact not found' });
    store.contacts[index] = { ...store.contacts[index], ...req.body };
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
    res.status(201).json(appItem);
  });
  app.put('/api/applications/:id', (req, res) => {
    const { id } = req.params;
    const index = store.applications.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Application not found' });
    store.applications[index] = { ...store.applications[index], ...req.body };
    res.json(store.applications[index]);
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
