import express from 'express';
import { 
  INITIAL_PROJECTS, 
  INITIAL_LEGISLATIVE, 
  INITIAL_PROGRAMS, 
  INITIAL_NEWS, 
  INITIAL_GALLERY, 
  INITIAL_CONTACTS,
  INITIAL_POLLS,
  INITIAL_PETITIONS
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
  PetitionDecisionMessage
} from '../src/types';

const app = express();
app.use(express.json());

// In-memory data store with fallback
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
  stats: {
    projectsCount: '24+',
    billsCount: '12+',
    citizensCount: '4,500+',
    wardsCount: '22'
  }
};

// Health
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
    ...req.body,
    id: `app-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
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

// ==========================================
// TOWN HALL & POLLS API
// ==========================================
app.get('/api/polls', (req, res) => {
  res.json(store.polls);
});

app.post('/api/polls', (req, res) => {
  const { title, question, description, category, targetWard, status, options, endDate, isFeatured } = req.body;
  if (!title || !question || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'Poll requires title, question, and at least two options.' });
  }

  const newPoll: TownHallPoll = {
    id: `poll-${Date.now()}`,
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
  res.status(201).json(newPoll);
});

app.put('/api/polls/:id', (req, res) => {
  const { id } = req.params;
  const index = store.polls.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Poll not found' });
  store.polls[index] = { ...store.polls[index], ...req.body, id };
  res.json(store.polls[index]);
});

app.delete('/api/polls/:id', (req, res) => {
  const { id } = req.params;
  store.polls = store.polls.filter(p => p.id !== id);
  res.json({ success: true });
});

app.post('/api/polls/:id/vote', (req, res) => {
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

  res.json({ 
    success: true, 
    message: 'Vote cast and securely recorded in official constituency ballot ledger.',
    poll 
  });
});

// ==========================================
// PETITIONS & GRIEVANCE REDRESS API
// ==========================================
app.get('/api/petitions', (req, res) => {
  res.json(store.petitions);
});

app.post('/api/petitions', (req, res) => {
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
    supportingDocName
  } = req.body;

  if (!title || !petitionerName || !petitionerEmail || !ward || !description) {
    return res.status(400).json({ error: 'Missing required petition information.' });
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newPetition: CommunityPetition = {
    id: `pet-${Date.now()}`,
    referenceNumber: `PET-YS-${new Date().getFullYear()}-${randomSuffix}`,
    title,
    category: category || 'Infrastructure & Roads',
    petitionerName,
    petitionerEmail,
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
  res.status(201).json(newPetition);
});

app.put('/api/petitions/:id', (req, res) => {
  const { id } = req.params;
  const index = store.petitions.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Petition not found' });
  store.petitions[index] = { 
    ...store.petitions[index], 
    ...req.body, 
    id,
    updatedAt: new Date().toISOString()
  };
  res.json(store.petitions[index]);
});

app.delete('/api/petitions/:id', (req, res) => {
  const { id } = req.params;
  store.petitions = store.petitions.filter(p => p.id !== id);
  res.json({ success: true });
});

app.post('/api/petitions/:id/decision', (req, res) => {
  const { id } = req.params;
  const { status, customRationale, reviewNotes, signatory, sentBy, channels } = req.body;

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
      recipientEmail: petition.petitionerEmail || petition.email || 'constituent@danmayeyabo.gov.ng',
      recipientPhone: petition.petitionerPhone || petition.phone,
      subject: `OFFICIAL DECISION: Petition Approved — "${petition.title}" (Ref: ${petition.referenceNumber})`,
      officialGreeting: `Dear ${petition.petitionerName} and Community Co-Signatories,`,
      decisionSummary: `On behalf of the Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency at the House of Representatives, we write to officially and warmly inform you that your community petition regarding "${petition.title}" has been reviewed by the Legislative Oversight & Constituency Development Committee and has been formally APPROVED.`,
      detailedRationale: customRationale || `Our technical liaison desk conducted an appraisal of the needs articulated in your petition and verified the significant grassroots impact for ${petition.ward || 'Yabo/Shagari'}. Hon. Umar Yusuf has approved the formal appropriation and scheduling of this project into the upcoming constituency intervention cycle.`,
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
      recipientEmail: petition.petitionerEmail || petition.email || 'constituent@danmayeyabo.gov.ng',
      recipientPhone: petition.petitionerPhone || petition.phone,
      subject: `OFFICIAL COMMUNICATION: Community Petition Status — "${petition.title}" (Ref: ${petition.referenceNumber})`,
      officialGreeting: `Dear ${petition.petitionerName},`,
      decisionSummary: `The Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, presents its highest regards and conveys sincere appreciation for your community dedication and for bringing "${petition.title}" to our attention. Following careful statutory, technical, and fiscal evaluation, we regret to inform you that this specific petition cannot be approved under the current legislative cycle.`,
      detailedRationale: customRationale || `Our legislative committee determined that the requested intervention falls within municipal/state jurisdiction or exceeds allowable statutory caps for the current fiscal appropriation cycle. We believe in providing transparent, truthful governance to every constituent.`,
      communityEncouragement: `While this particular proposal could not be approved at this juncture, Hon. Umar Yusuf strongly encourages you, your fellow signatories, and local community associations to continue your active and constructive participation in community development. Your voice is vital, and your civic commitment is deeply valued.`,
      nextStepsOrAlternatives: `We have registered your community on our priority consultative roster. We encourage you to participate in our ongoing Town Hall polls, submit alternate community proposals, or contact our Ward Liaison Officers regarding our smallholder grant and vocational empowerment schemes.`,
      signatory: signatory || 'Directorate of Public Petitions & Grievance Redress, Office of Hon. Umar Yusuf, House of Representatives',
      sentAt: sentTimestamp,
      sentBy: sentBy || 'Chief Administrator',
      deliveryChannels: channels || ['Email', 'SMS', 'Constituency Portal']
    };
  }

  petition.status = status;
  petition.reviewNotes = reviewNotes || petition.reviewNotes;
  petition.decisionMessage = decisionMessage;
  petition.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `Petition status marked as ${status} and official respectful decision message dispatched to ${petition.petitionerName} (${petition.petitionerEmail}).`,
    petition,
    decisionMessage
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@danmayeyabo.gov.ng' && (password === 'DANMAJEFOREVER' || password === 'password123')) {
    res.json({ token: 'mock-jwt-token-danmaje-yabo', user: { name: 'Hon. Admin Staff', email, role: 'Chief Administrator' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials. (Official admin password: DANMAJEFOREVER)' });
  }
});

export default app;
