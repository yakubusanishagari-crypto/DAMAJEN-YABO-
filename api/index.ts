import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_PROJECTS, 
  INITIAL_LEGISLATIVE, 
  INITIAL_PROGRAMS, 
  INITIAL_NEWS, 
  INITIAL_GALLERY, 
  INITIAL_CONTACTS, 
  INITIAL_POLLS, 
  INITIAL_PETITIONS,
  INITIAL_OFFICES,
  INITIAL_ADMIN_USERS
} from '../src/data/initialData';
import { 
  Project, 
  LegislativeRecord, 
  EmpowermentProgram, 
  NewsArticle, 
  GalleryItem, 
  ContactSubmission, 
  ProgramApplication,
  TownHallPoll,
  CommunityPetition,
  PetitionDecisionMessage,
  ConstituencyOffice,
  AdminUser
} from '../src/types';

const app = express();

// Set 50MB payload limits for high-resolution project site photos and file attachments
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Supabase Client for persistent remote database across Vercel deployments & Git pushes
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Password hashing helpers using cryptographic scrypt & timing-safe equality
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

function ensureAdminCredentials(users: AdminUser[]): AdminUser[] {
  return users.map(u => {
    if (!u.passwordHash || !u.salt) {
      const salt = crypto.randomBytes(16).toString('hex');
      const defaultPwd = u.role === 'Super Administrator' ? 'DANMAJEFOREVER' : 'OfficePass2026!';
      return {
        ...u,
        salt,
        passwordHash: hashPassword(defaultPwd, salt)
      };
    }
    return u;
  });
}

// In-memory fallback data store
let store = {
  projects: [...INITIAL_PROJECTS],
  legislative: [...INITIAL_LEGISLATIVE],
  programs: [...INITIAL_PROGRAMS],
  news: [...INITIAL_NEWS],
  gallery: [...INITIAL_GALLERY],
  contacts: [...INITIAL_CONTACTS],
  polls: [...INITIAL_POLLS] as TownHallPoll[],
  petitions: [...INITIAL_PETITIONS] as CommunityPetition[],
  applications: [] as ProgramApplication[],
  offices: [...INITIAL_OFFICES] as ConstituencyOffice[],
  adminUsers: ensureAdminCredentials([...INITIAL_ADMIN_USERS]) as AdminUser[],
  stats: {
    projectsCount: '24+',
    billsCount: '12+',
    citizensCount: '4,500+',
    wardsCount: '22'
  }
};

// Helper to fire-and-forget background Supabase upsert
function asyncSupabaseUpsert(table: string, records: any) {
  if (!supabase) return;
  Promise.resolve(supabase.from(table).upsert(records))
    .then((res: any) => {
      if (res?.error) console.warn(`Supabase upsert warning for ${table}:`, res.error.message);
    })
    .catch((err: any) => console.warn(`Supabase background network warning for ${table}:`, err?.message || err));
}

function asyncSupabaseDelete(table: string, id: string) {
  if (!supabase) return;
  Promise.resolve(supabase.from(table).delete().eq('id', id))
    .then((res: any) => {
      if (res?.error) console.warn(`Supabase delete warning for ${table}:`, res.error.message);
    })
    .catch((err: any) => console.warn(`Supabase background network warning for ${table}:`, err?.message || err));
}

// ==================== HEALTH & SUPABASE STATUS ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    supabaseConnected: Boolean(supabase),
    deployment: 'Vercel Serverless Ready',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/supabase/status', async (req, res) => {
  if (!supabase) {
    return res.json({
      connected: false,
      message: 'Supabase URL or Key not detected in environment. Operating in memory fallback mode.'
    });
  }
  try {
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    if (error) {
      return res.json({
        connected: true,
        tableReady: false,
        error: error.message,
        message: 'Connected to Supabase project URL, tables being configured.'
      });
    }
    res.json({
      connected: true,
      tableReady: true,
      message: 'Supabase backend connection verified and fully operational on Vercel.'
    });
  } catch (err: any) {
    res.json({
      connected: true,
      tableReady: false,
      error: err.message || 'Unknown network error',
      message: 'Supabase client initialized.'
    });
  }
});

// ==================== STATS API ====================
app.get('/api/stats', (req, res) => {
  res.json(store.stats);
});
app.put('/api/stats', (req, res) => {
  store.stats = { ...store.stats, ...req.body };
  res.json(store.stats);
});

// ==================== PROJECTS API ====================
app.get('/api/projects', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.projects = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase projects fetch error, fallback to memory:', e);
    }
  }
  res.json(store.projects);
});

app.post('/api/projects', async (req, res) => {
  const newProj: Project = { 
    ...req.body, 
    id: req.body.id || `proj-${Date.now()}` 
  };
  store.projects.unshift(newProj);
  asyncSupabaseUpsert('projects', newProj);
  res.status(201).json(newProj);
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  store.projects[index] = { ...store.projects[index], ...req.body, id };
  asyncSupabaseUpsert('projects', store.projects[index]);
  res.json(store.projects[index]);
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  store.projects = store.projects.filter(p => p.id !== id);
  asyncSupabaseDelete('projects', id);
  res.json({ success: true });
});

// ==================== LEGISLATIVE API ====================
app.get('/api/legislative', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('legislative').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.legislative = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase legislative fetch error, fallback to memory:', e);
    }
  }
  res.json(store.legislative);
});

app.post('/api/legislative', async (req, res) => {
  const item: LegislativeRecord = { ...req.body, id: req.body.id || `leg-${Date.now()}` };
  store.legislative.unshift(item);
  asyncSupabaseUpsert('legislative', item);
  res.status(201).json(item);
});

app.put('/api/legislative/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.legislative.findIndex(l => l.id === id);
  if (index === -1) return res.status(404).json({ error: 'Record not found' });
  store.legislative[index] = { ...store.legislative[index], ...req.body, id };
  asyncSupabaseUpsert('legislative', store.legislative[index]);
  res.json(store.legislative[index]);
});

app.delete('/api/legislative/:id', async (req, res) => {
  const { id } = req.params;
  store.legislative = store.legislative.filter(l => l.id !== id);
  asyncSupabaseDelete('legislative', id);
  res.json({ success: true });
});

// ==================== PROGRAMS API ====================
app.get('/api/programs', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('programs').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.programs = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase programs fetch error, fallback to memory:', e);
    }
  }
  res.json(store.programs);
});

app.post('/api/programs', async (req, res) => {
  const item: EmpowermentProgram = { ...req.body, id: req.body.id || `prog-${Date.now()}` };
  store.programs.unshift(item);
  asyncSupabaseUpsert('programs', item);
  res.status(201).json(item);
});

app.put('/api/programs/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.programs.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Program not found' });
  store.programs[index] = { ...store.programs[index], ...req.body, id };
  asyncSupabaseUpsert('programs', store.programs[index]);
  res.json(store.programs[index]);
});

app.delete('/api/programs/:id', async (req, res) => {
  const { id } = req.params;
  store.programs = store.programs.filter(p => p.id !== id);
  asyncSupabaseDelete('programs', id);
  res.json({ success: true });
});

// ==================== NEWS API ====================
app.get('/api/news', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.news = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase news fetch error, fallback to memory:', e);
    }
  }
  res.json(store.news);
});

app.post('/api/news', async (req, res) => {
  const item: NewsArticle = { ...req.body, id: req.body.id || `news-${Date.now()}` };
  store.news.unshift(item);
  asyncSupabaseUpsert('news', item);
  res.status(201).json(item);
});

app.put('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.news.findIndex(n => n.id === id);
  if (index === -1) return res.status(404).json({ error: 'Article not found' });
  store.news[index] = { ...store.news[index], ...req.body, id };
  asyncSupabaseUpsert('news', store.news[index]);
  res.json(store.news[index]);
});

app.delete('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  store.news = store.news.filter(n => n.id !== id);
  asyncSupabaseDelete('news', id);
  res.json({ success: true });
});

// ==================== GALLERY API ====================
app.get('/api/gallery', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.gallery = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase gallery fetch error, fallback to memory:', e);
    }
  }
  res.json(store.gallery);
});

app.post('/api/gallery', async (req, res) => {
  const item: GalleryItem = { ...req.body, id: req.body.id || `gal-${Date.now()}` };
  store.gallery.unshift(item);
  asyncSupabaseUpsert('gallery', item);
  res.status(201).json(item);
});

app.delete('/api/gallery/:id', async (req, res) => {
  const { id } = req.params;
  store.gallery = store.gallery.filter(g => g.id !== id);
  asyncSupabaseDelete('gallery', id);
  res.json({ success: true });
});

// ==================== CONTACTS API ====================
app.get('/api/contacts', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contacts').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.contacts = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase contacts fetch error, fallback to memory:', e);
    }
  }
  res.json(store.contacts);
});

app.post('/api/contacts', async (req, res) => {
  const item: ContactSubmission = {
    ...req.body,
    id: req.body.id || `con-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Unread'
  };
  store.contacts.unshift(item);
  asyncSupabaseUpsert('contacts', item);
  res.status(201).json(item);
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.contacts.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Contact not found' });
  store.contacts[index] = { ...store.contacts[index], ...req.body };
  asyncSupabaseUpsert('contacts', store.contacts[index]);
  res.json(store.contacts[index]);
});

// ==================== APPLICATIONS API ====================
app.get('/api/applications', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('applications').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.applications = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase applications fetch error, fallback to memory:', e);
    }
  }
  res.json(store.applications);
});

app.post('/api/applications', async (req, res) => {
  const appItem: ProgramApplication = {
    ...req.body,
    id: req.body.id || `app-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: req.body.status || 'Pending'
  };
  store.applications.unshift(appItem);
  asyncSupabaseUpsert('applications', appItem);
  res.status(201).json(appItem);
});

app.put('/api/applications/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.applications.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Application not found' });
  store.applications[index] = { ...store.applications[index], ...req.body };
  asyncSupabaseUpsert('applications', store.applications[index]);
  res.json(store.applications[index]);
});

// ==================== TOWN HALL & POLLS API ====================
app.get('/api/polls', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('polls').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.polls = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase polls fetch error, fallback to memory:', e);
    }
  }
  res.json(store.polls);
});

app.post('/api/polls', async (req, res) => {
  const { title, question, description, category, targetWard, status, options, endDate, isFeatured } = req.body;
  if (!title || !question || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'Poll requires title, question, and at least two options.' });
  }

  const newPoll: TownHallPoll = {
    id: req.body.id || `poll-${Date.now()}`,
    title,
    question,
    description: description || '',
    category: category || 'Constituency Priority',
    targetWard: targetWard || 'All 22 Wards (Constituency-Wide)',
    status: status || 'Active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    createdBy: req.body.createdBy || 'Chief Administrator',
    createdAt: new Date().toISOString(),
    isFeatured: Boolean(isFeatured),
    totalVotes: 0,
    options: options.map((opt: any, index: number) => ({
      id: opt.id || `opt-${Date.now()}-${index}`,
      text: typeof opt === 'string' ? opt : opt.text,
      votes: 0
    })),
    voters: []
  };

  store.polls.unshift(newPoll);
  asyncSupabaseUpsert('polls', newPoll);
  res.status(201).json(newPoll);
});

app.put('/api/polls/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.polls.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Poll not found' });
  store.polls[index] = { ...store.polls[index], ...req.body, id };
  asyncSupabaseUpsert('polls', store.polls[index]);
  res.json(store.polls[index]);
});

app.delete('/api/polls/:id', async (req, res) => {
  const { id } = req.params;
  store.polls = store.polls.filter(p => p.id !== id);
  asyncSupabaseDelete('polls', id);
  res.json({ success: true });
});

app.post('/api/polls/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { optionId, voterId, voterName, ward } = req.body;

  const poll = store.polls.find(p => p.id === id);
  if (!poll) return res.status(404).json({ error: 'Poll not found.' });

  if (poll.status === 'Closed') {
    return res.status(400).json({ error: 'This voting session has concluded.' });
  }

  const effectiveVoterId = voterId || `voter-${req.ip || 'anon'}`;
  const alreadyVoted = (poll.voters || []).some(v => v.voterId === effectiveVoterId);
  if (alreadyVoted) {
    return res.status(409).json({ error: 'You have already cast your vote in this poll. Each constituent is allowed one ballot.' });
  }

  const optIndex = poll.options.findIndex(o => o.id === optionId);
  if (optIndex === -1) {
    return res.status(400).json({ error: 'Selected option not found in this poll.' });
  }

  poll.options[optIndex].votes = (poll.options[optIndex].votes || 0) + 1;
  poll.totalVotes = (poll.totalVotes || 0) + 1;

  if (!poll.voters) poll.voters = [];
  poll.voters.push({
    id: `vote-${Date.now()}`,
    pollId: poll.id,
    voterId: effectiveVoterId,
    voterName: voterName || 'Anonymous Constituent',
    ward: ward || 'Constituency Voter',
    selectedOptionId: optionId,
    timestamp: new Date().toISOString()
  });

  asyncSupabaseUpsert('polls', poll);

  res.json({ 
    success: true, 
    message: 'Vote cast and securely recorded in official constituency ballot ledger.',
    poll 
  });
});

// ==================== PETITIONS & GRIEVANCE REDRESS API ====================
app.get('/api/petitions', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('petitions').select('*').order('id', { ascending: false });
      if (!error && data && data.length > 0) {
        store.petitions = data;
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase petitions fetch error, fallback to memory:', e);
    }
  }
  res.json(store.petitions);
});

app.post('/api/petitions', async (req, res) => {
  // Support bulk sync or single submission
  if (Array.isArray(req.body)) {
    store.petitions = req.body;
    asyncSupabaseUpsert('petitions', req.body);
    return res.json({ success: true, count: req.body.length });
  }

  const {
    title,
    category,
    petitionerName,
    petitionerEmail,
    petitionerPhone,
    ward,
    localGovernment,
    address,
    description,
    expectedImpact,
    signatoriesCount,
    supportingDocName,
    referenceNumber
  } = req.body;

  if (!title || !petitionerName || !ward || !description) {
    return res.status(400).json({ error: 'Missing required petition information.' });
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newPetition: CommunityPetition = {
    id: req.body.id || `pet-${Date.now()}`,
    referenceNumber: referenceNumber || `PET-YS-${new Date().getFullYear()}-${randomSuffix}`,
    title,
    category: category || 'Infrastructure & Roads',
    petitionerName,
    petitionerEmail: petitionerEmail || '',
    petitionerPhone: petitionerPhone || '',
    ward,
    localGovernment: localGovernment || 'Yabo',
    address: address || '',
    description,
    expectedImpact: expectedImpact || 'Community welfare and infrastructural enhancement',
    signatoriesCount: Number(signatoriesCount) || 1,
    supportingDocName,
    status: 'Submitted',
    submittedDate: new Date().toISOString().split('T')[0],
    reviewNotes: 'Newly received from constituent portal. Queued for administrative triage.'
  };

  store.petitions.unshift(newPetition);
  asyncSupabaseUpsert('petitions', newPetition);
  res.status(201).json(newPetition);
});

app.put('/api/petitions/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.petitions.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Petition not found' });
  store.petitions[index] = { 
    ...store.petitions[index], 
    ...req.body, 
    id,
    updatedAt: new Date().toISOString()
  };
  asyncSupabaseUpsert('petitions', store.petitions[index]);
  res.json(store.petitions[index]);
});

app.delete('/api/petitions/:id', async (req, res) => {
  const { id } = req.params;
  store.petitions = store.petitions.filter(p => p.id !== id);
  asyncSupabaseDelete('petitions', id);
  res.json({ success: true });
});

// Admin Decision Dispatch Endpoint with Wisdom-Filled Civic Responses
app.post('/api/petitions/:id/decision', async (req, res) => {
  const { id } = req.params;
  const { status, decisionNotes, customRationale, reviewNotes, signatory, sentBy, channels, officialLetter } = req.body;

  if (status !== 'Approved' && status !== 'Rejected') {
    return res.status(400).json({ error: 'Decision status must be either "Approved" or "Rejected".' });
  }

  const petition = store.petitions.find(p => p.id === id);
  if (!petition) return res.status(404).json({ error: 'Petition not found.' });

  const sentTimestamp = new Date().toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZoneName: 'short' 
  });

  let decisionMessage: PetitionDecisionMessage;

  if (status === 'Approved') {
    decisionMessage = {
      id: `msg-${Date.now()}`,
      petitionId: petition.id,
      status: 'Approved',
      recipientName: petition.petitionerName,
      recipientEmail: petition.petitionerEmail || (petition as any).email || 'constituent@danmayeyabo.gov.ng',
      recipientPhone: petition.petitionerPhone || (petition as any).phone,
      subject: `OFFICIAL DECISION: Petition Approved — "${petition.title}" (Ref: ${petition.referenceNumber})`,
      officialGreeting: `Dear ${petition.petitionerName} and Community Co-Signatories,`,
      decisionSummary: `On behalf of the Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency at the House of Representatives, we write to officially and warmly inform you that your community petition regarding "${petition.title}" has been reviewed by the Legislative Oversight & Constituency Development Committee and has been formally APPROVED.`,
      detailedRationale: customRationale || decisionNotes || `Our technical liaison desk conducted an appraisal of the needs articulated in your petition and verified the significant grassroots impact for ${petition.ward || 'Yabo/Shagari'}. Hon. Umar Yusuf has approved the formal appropriation and scheduling of this project into the upcoming constituency intervention cycle.`,
      communityEncouragement: `We commend your exemplary civic leadership and constructive engagement. Vibrant, peaceful citizen advocacy is the cornerstone of sustainable community development across Yabo and Shagari. We urge you to maintain this commendable spirit of active civic stewardship.`,
      nextStepsOrAlternatives: `The Constituency Project Implementation Bureau will maintain direct contact with you and community elders regarding project mobilization and execution timelines.`,
      signatory: signatory || 'Secretariat, Office of Hon. Umar Yusuf (Danmaje Yabo), House of Representatives, National Assembly, Abuja',
      sentAt: sentTimestamp,
      sentBy: sentBy || 'Chief Administrator',
      deliveryChannels: channels || ['Email', 'SMS', 'Constituency Portal']
    };
  } else {
    decisionMessage = {
      id: `msg-${Date.now()}`,
      petitionId: petition.id,
      status: 'Rejected',
      recipientName: petition.petitionerName,
      recipientEmail: petition.petitionerEmail || (petition as any).email || 'constituent@danmayeyabo.gov.ng',
      recipientPhone: petition.petitionerPhone || (petition as any).phone,
      subject: `OFFICIAL COMMUNICATION: Community Petition Status — "${petition.title}" (Ref: ${petition.referenceNumber})`,
      officialGreeting: `Dear ${petition.petitionerName},`,
      decisionSummary: `The Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, presents its highest regards and conveys sincere appreciation for your community dedication and for bringing "${petition.title}" to our attention. Following careful statutory, technical, and fiscal evaluation, we regret to inform you that this specific petition cannot be approved under the current legislative cycle.`,
      detailedRationale: customRationale || decisionNotes || `Our legislative committee determined that the requested intervention falls within municipal/state jurisdiction or exceeds allowable statutory caps for the current fiscal appropriation cycle. We believe in providing transparent, truthful governance to every constituent.`,
      communityEncouragement: `While this particular proposal could not be approved at this juncture, Hon. Umar Yusuf strongly encourages you, your fellow signatories, and local community associations to continue your active and constructive participation in community development. Your voice is vital, and your civic commitment is deeply valued.`,
      nextStepsOrAlternatives: `We have registered your community on our priority consultative roster. We encourage you to participate in our ongoing Town Hall polls, submit alternate community proposals, or contact our Ward Liaison Officers regarding our smallholder grant and vocational empowerment schemes.`,
      signatory: signatory || 'Directorate of Public Petitions & Grievance Redress, Office of Hon. Umar Yusuf, House of Representatives',
      sentAt: sentTimestamp,
      sentBy: sentBy || 'Chief Administrator',
      deliveryChannels: channels || ['Email', 'SMS', 'Constituency Portal']
    };
  }

  petition.status = status;
  petition.reviewNotes = reviewNotes || decisionNotes || petition.reviewNotes;
  petition.decisionMessage = decisionMessage;
  if (officialLetter) {
    petition.decisionLetter = officialLetter;
  }
  petition.updatedAt = new Date().toISOString();

  asyncSupabaseUpsert('petitions', petition);

  res.json({
    success: true,
    message: `Petition status marked as ${status} and official respectful decision message dispatched to ${petition.petitionerName}.`,
    petition,
    decisionMessage
  });
});

// ==========================================
// SECURE AUTHENTICATION, RATE LIMITING & SESSIONS
// ==========================================
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}
const loginRateLimitMap = new Map<string, RateLimitRecord>();

interface AdminSession {
  token: string;
  userId: string;
  email: string;
  role: 'Super Administrator' | 'Office Administrator';
  officeId?: string;
  officeName?: string;
  expiresAt: number;
}
const activeSessions = new Map<string, AdminSession>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown-ip';
}

function getAuthenticatedSession(req: express.Request): AdminSession | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

// Admin Login with rate limiting, salted password verification & office status check
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const clientIp = getClientIp(req);
  const now = Date.now();

  // 1. Enforce Rate Limiting & Brute-force Lockout
  const rateRecord = loginRateLimitMap.get(clientIp);
  if (rateRecord && rateRecord.lockedUntil) {
    if (now < rateRecord.lockedUntil) {
      const remainingMinutes = Math.ceil((rateRecord.lockedUntil - now) / 60000);
      return res.status(429).json({
        error: `Too many failed login attempts. Security lockout active. Please wait ${remainingMinutes} minute(s) before trying again.`
      });
    } else {
      loginRateLimitMap.delete(clientIp);
    }
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = store.adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

  // Verify Password using cryptographic scrypt hash and timing-safe comparison
  let isPasswordValid = false;
  if (user && user.salt && user.passwordHash) {
    isPasswordValid = verifyPassword(password, user.salt, user.passwordHash);
  } else if (cleanEmail === 'admin@danmayeyabo.gov.ng' && (password === 'DANMAJEFOREVER' || password === 'password123')) {
    // Fallback transition for initial setup: re-hash and save
    isPasswordValid = true;
    if (user) {
      user.salt = crypto.randomBytes(16).toString('hex');
      user.passwordHash = hashPassword(password, user.salt);
    }
  }

  if (!user || !isPasswordValid) {
    // Track failed attempt
    const record = loginRateLimitMap.get(clientIp) || { attempts: 0, lockedUntil: null, lastAttempt: now };
    record.attempts += 1;
    record.lastAttempt = now;

    if (record.attempts >= 5) {
      record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
      loginRateLimitMap.set(clientIp, record);
      return res.status(429).json({
        error: 'Maximum failed login attempts reached (5/5). Access locked for 15 minutes to safeguard constituency parliamentary records.'
      });
    }

    loginRateLimitMap.set(clientIp, record);
    const remaining = 5 - record.attempts;
    return res.status(401).json({
      error: `Invalid email or password. Authentication failed. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before security lock)`
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({
      error: 'This administrator account has been deactivated. Please contact the Chief Super Administrator.'
    });
  }

  // Check office status if assigned to an office
  let userOffice: ConstituencyOffice | undefined;
  if (user.officeId) {
    userOffice = store.offices.find(o => o.id === user.officeId);
    if (userOffice && userOffice.status === 'Inactive') {
      return res.status(403).json({
        error: `Your assigned office (${userOffice.name}) is currently inactive. Contact the Super Administrator for reactivation.`
      });
    }
  }

  // Authentication Success: Reset rate limits for client IP
  loginRateLimitMap.delete(clientIp);

  // Generate secure 32-byte session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24-hour validity

  activeSessions.set(token, {
    token,
    userId: user.id,
    email: user.email,
    role: user.role,
    officeId: user.officeId,
    officeName: user.officeName || userOffice?.name,
    expiresAt
  });

  user.lastLogin = new Date().toISOString();

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      officeId: user.officeId,
      officeName: user.officeName || userOffice?.name,
      lastLogin: user.lastLogin
    },
    office: userOffice || null
  });
});

// Verify active session token
app.get('/api/admin/verify-session', (req, res) => {
  const session = getAuthenticatedSession(req);
  if (!session) {
    return res.status(401).json({ valid: false, error: 'Session expired or invalid.' });
  }

  const user = store.adminUsers.find(u => u.id === session.userId);
  if (!user || !user.isActive) {
    return res.status(401).json({ valid: false, error: 'User no longer active.' });
  }

  let office: ConstituencyOffice | undefined;
  if (user.officeId) {
    office = store.offices.find(o => o.id === user.officeId);
  }

  res.json({
    valid: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      officeId: user.officeId,
      officeName: user.officeName || office?.name,
      lastLogin: user.lastLogin
    },
    office: office || null
  });
});

// Logout session invalidation
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==========================================
// CONSTITUENCY OFFICES & RBAC API
// ==========================================
app.get('/api/offices', (req, res) => {
  res.json(store.offices);
});

app.post('/api/offices', (req, res) => {
  const { name, code, location, description, headOfOffice, contactEmail, contactPhone, status, authorizedTabs, assignedAdminEmails } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'Office name and office code are required.' });
  }

  const newOffice: ConstituencyOffice = {
    id: `off-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: name.trim(),
    location: location || 'Danmaje Civic Liaison Secretariat, Yabo Metropolis',
    description: description || 'Official Constituency Functional Bureau',
    headOfOffice: headOfOffice || 'Constituency Officer',
    contactEmail: contactEmail || 'office@danmayeyabo.gov.ng',
    contactPhone: contactPhone || '+234 803 000 0000',
    status: status === 'Inactive' ? 'Inactive' : 'Active',
    authorizedTabs: Array.isArray(authorizedTabs) && authorizedTabs.length > 0 ? authorizedTabs : ['overview'],
    assignedAdminEmails: Array.isArray(assignedAdminEmails) ? assignedAdminEmails : [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  store.offices.unshift(newOffice);
  asyncSupabaseUpsert('offices', newOffice);
  res.status(201).json(newOffice);
});

app.put('/api/offices/:id', (req, res) => {
  const { id } = req.params;
  const index = store.offices.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ error: 'Office not found.' });

  store.offices[index] = {
    ...store.offices[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  // If office name was changed, sync officeName in assigned admin users
  if (req.body.name) {
    store.adminUsers.forEach(u => {
      if (u.officeId === id) {
        u.officeName = req.body.name;
      }
    });
  }

  asyncSupabaseUpsert('offices', store.offices[index]);
  res.json(store.offices[index]);
});

app.delete('/api/offices/:id', (req, res) => {
  const { id } = req.params;
  store.offices = store.offices.filter(o => o.id !== id);
  store.adminUsers.forEach(u => {
    if (u.officeId === id) {
      u.officeId = undefined;
      u.officeName = undefined;
    }
  });
  asyncSupabaseDelete('offices', id);
  res.json({ success: true });
});

// ==========================================
// ADMIN USERS DIRECTORY & ASSIGNMENTS API
// ==========================================
app.get('/api/admin/users', (req, res) => {
  const safeUsers = store.adminUsers.map(({ passwordHash, salt, ...rest }) => rest);
  res.json(safeUsers);
});

app.post('/api/admin/users', (req, res) => {
  const { name, email, role, officeId, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (store.adminUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(409).json({ error: 'An administrator account with this email already exists.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const pwd = password || (role === 'Super Administrator' ? 'DANMAJEFOREVER' : 'OfficePass2026!');
  const passwordHash = hashPassword(pwd, salt);

  let officeName: string | undefined;
  if (officeId) {
    const office = store.offices.find(o => o.id === officeId);
    if (office) {
      officeName = office.name;
      if (!office.assignedAdminEmails.includes(cleanEmail)) {
        office.assignedAdminEmails.push(cleanEmail);
      }
    }
  }

  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    role: role === 'Super Administrator' ? 'Super Administrator' : 'Office Administrator',
    officeId: role === 'Super Administrator' ? undefined : officeId,
    officeName: role === 'Super Administrator' ? 'Executive Master Control (All Offices)' : officeName,
    passwordHash,
    salt,
    isActive: true,
    createdAt: new Date().toISOString().split('T')[0]
  };

  store.adminUsers.unshift(newUser);
  const { passwordHash: _ph, salt: _s, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.put('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const index = store.adminUsers.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found.' });

  const targetUser = store.adminUsers[index];
  const { name, role, officeId, isActive, password } = req.body;

  if (name) targetUser.name = name.trim();
  if (role) targetUser.role = role;
  if (typeof isActive === 'boolean') targetUser.isActive = isActive;

  if (officeId !== undefined) {
    targetUser.officeId = officeId || undefined;
    const office = store.offices.find(o => o.id === officeId);
    targetUser.officeName = office ? office.name : undefined;
  }

  if (password && password.trim().length >= 6) {
    const salt = crypto.randomBytes(16).toString('hex');
    targetUser.salt = salt;
    targetUser.passwordHash = hashPassword(password.trim(), salt);
  }

  const { passwordHash: _ph, salt: _s, ...safeUser } = targetUser;
  res.json(safeUser);
});

app.delete('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const user = store.adminUsers.find(u => u.id === id);
  if (user && user.role === 'Super Administrator' && store.adminUsers.filter(u => u.role === 'Super Administrator').length <= 1) {
    return res.status(400).json({ error: 'Cannot delete the primary Chief Super Administrator account.' });
  }
  store.adminUsers = store.adminUsers.filter(u => u.id !== id);
  res.json({ success: true });
});

export default app;
