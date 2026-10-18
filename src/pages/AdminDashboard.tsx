import React, { useState, useEffect } from 'react';
import { 
  Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, 
  ContactSubmission, ProjectStatus, ProgramApplication, ApplicationStatus 
} from '../types';
import { Language, Translations } from '../utils/i18n';
import { ConstituencyStats } from '../App';
import { 
  Shield, Lock, Mail, Plus, Trash2, Edit, CheckCircle, X, LogOut, 
  FileText, Award, Image as ImageIcon, Users, BarChart3, Globe, Settings, 
  Activity, ArrowUpRight, TrendingUp, Download, Eye, AlertCircle, Save,
  Upload, Video, Film, Play, Check, Search, Filter, ChevronRight, CheckCircle2,
  Clock, Printer, ExternalLink, FileCheck, Star, Sparkles, RefreshCw, Menu,
  Send, Calendar, MapPin, Sliders, ChevronDown, Landmark
} from 'lucide-react';
import { ApplicationSlipModal } from '../components/ApplicationSlipModal';
import { 
  extractYouTubeId, 
  getYouTubeThumbnailUrl, 
  getYouTubeEmbedUrl, 
  resolveMediaThumbnail, 
  fetchYouTubeMetadata, 
  sanitizeGalleryList, 
  YOUTUBE_PLACEHOLDER_THUMBNAIL 
} from '../utils/youtube';

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  legislative: LegislativeRecord[];
  setLegislative: React.Dispatch<React.SetStateAction<LegislativeRecord[]>>;
  programs: EmpowermentProgram[];
  setPrograms: React.Dispatch<React.SetStateAction<EmpowermentProgram[]>>;
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  contacts: ContactSubmission[];
  setContacts: React.Dispatch<React.SetStateAction<ContactSubmission[]>>;
  translations: Translations;
  setTranslations: React.Dispatch<React.SetStateAction<Translations>>;
  stats: ConstituencyStats;
  setStats: React.Dispatch<React.SetStateAction<ConstituencyStats>>;
  currentLang: Language;
  onClose: () => void;
}

export type DashboardTab = 
  | 'overview' 
  | 'analytics' 
  | 'projects' 
  | 'news' 
  | 'legislative' 
  | 'empowerment' 
  | 'applications' 
  | 'gallery' 
  | 'enquiries' 
  | 'settings';

export const AdminDashboard: React.FC<Props> = ({
  projects, setProjects,
  legislative, setLegislative,
  programs, setPrograms,
  news, setNews,
  gallery, setGallery,
  contacts, setContacts,
  translations, setTranslations,
  stats, setStats,
  currentLang,
  onClose
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('admin@danmayeyabo.gov.ng');
  const [password, setPassword] = useState('DANMAJEFOREVER');
  const [loginError, setLoginError] = useState('');
  const [adminRole, setAdminRole] = useState<'Chief Administrator' | 'Content Manager' | 'News Editor' | 'Projects Manager' | 'Translation Manager' | 'Analytics Viewer'>('Chief Administrator');

  // Exact 10 Navigation Tabs order
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Settings Sub Tabs
  const [settingsTab, setSettingsTab] = useState<'users' | 'stats' | 'translations' | 'security'>('users');

  // Applications Persistence & Review State
  const [applications, setApplications] = useState<ProgramApplication[]>(() => {
    const saved = localStorage.getItem('danmaje_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'app-1',
        referenceNumber: 'DAN-EMP-2026-88192',
        programId: 'prog-1',
        programTitle: 'Constituency Solar Water & Agricultural Support',
        applicantName: 'Malam Ibrahim Bello',
        email: 'ibrahimbello@gmail.com',
        phone: '+234 803 123 4567',
        wardOrTown: 'Yabo Central Ward',
        qualifications: 'OND Agriculture, 3 Years Farming',
        statement: 'Seeking modern agricultural equipment and fertilizer support.',
        date: '2026-10-14',
        status: 'SUBMITTED',
        notes: 'Initial verification pending'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('danmaje_applications', JSON.stringify(applications));
  }, [applications]);

  const [selectedAppForReview, setSelectedAppForReview] = useState<ProgramApplication | null>(null);
  const [slipModalApp, setSlipModalApp] = useState<ProgramApplication | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [appProgramFilter, setAppProgramFilter] = useState('ALL');
  const [reviewStatusInput, setReviewStatusInput] = useState<ApplicationStatus>('SUBMITTED');
  const [reviewInternalNote, setReviewInternalNote] = useState('');
  const [reviewPublicFeedback, setReviewPublicFeedback] = useState('');

  const handleAdvanceApplicationStage = (appId: string, newStage: ApplicationStatus, internalNote: string, publicFeedback: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const updated = applications.map(a => {
      if (a.id === appId) {
        const oldTimeline = a.timeline || [
          {
            stage: 'SUBMITTED',
            timestamp: `${a.date} 09:00 AM`,
            title: 'Application Received',
            note: 'Application logged into constituency portal database',
            actor: 'Citizen Portal'
          }
        ];
        const newEvent = {
          stage: newStage,
          timestamp: timeStr,
          title: `Stage transitioned to ${newStage}`,
          note: publicFeedback || internalNote || `Stage updated by ${adminRole || 'Administrator'}`,
          actor: adminRole || 'Administrator'
        };
        return {
          ...a,
          status: newStage,
          currentStage: newStage,
          notes: internalNote !== undefined ? internalNote : a.notes,
          publicFeedback: publicFeedback !== undefined ? publicFeedback : a.publicFeedback,
          timeline: [...oldTimeline, newEvent]
        };
      }
      return a;
    });
    setApplications(updated);
    if (selectedAppForReview && selectedAppForReview.id === appId) {
      setSelectedAppForReview(updated.find(a => a.id === appId) || null);
    }
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Updated application stage for #${appId} to ${newStage}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleDeleteApp = (appId: string) => {
    const updated = applications.filter(a => a.id !== appId);
    setApplications(updated);
    if (selectedAppForReview && selectedAppForReview.id === appId) {
      setSelectedAppForReview(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Reference Number', 'Applicant Name', 'Email', 'Phone', 'LGA', 'Ward/Town', 'Programme Title', 'Category', 'Status', 'Date Submitted', 'Qualifications', 'Statement', 'Public Feedback', 'Internal Notes'];
    const rows = applications.map(a => [
      `"${a.referenceNumber}"`,
      `"${a.applicantName}"`,
      `"${a.email || ''}"`,
      `"${a.phone}"`,
      `"${a.lga || 'Yabo/Shagari'}"`,
      `"${a.wardOrTown}"`,
      `"${a.programTitle}"`,
      `"${a.programCategory || ''}"`,
      `"${a.status}"`,
      `"${a.date}"`,
      `"${(a.qualifications || '').replace(/"/g, '""')}"`,
      `"${(a.statement || '').replace(/"/g, '""')}"`,
      `"${(a.publicFeedback || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danmaje_empowerment_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `danmaje_applications_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Programme Editing State
  const [editingProg, setEditingProg] = useState<EmpowermentProgram | null>(null);

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProg) return;
    const updated = programs.map(p => p.id === editingProg.id ? editingProg : p);
    setPrograms(updated);
    try { localStorage.setItem('danmaje_programs', JSON.stringify(updated)); } catch {}
    setEditingProg(null);
  };

  const handleToggleProgPublish = (id: string) => {
    const updated = programs.map(p => p.id === id ? { ...p, isPublished: p.isPublished === false ? true : false } : p);
    setPrograms(updated);
    try { localStorage.setItem('danmaje_programs', JSON.stringify(updated)); } catch {}
  };

  const handleToggleProgStatus = (id: string) => {
    const updated = programs.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Closed' : 'Active';
        return { ...p, status: nextStatus as any };
      }
      return p;
    });
    setPrograms(updated);
    try { localStorage.setItem('danmaje_programs', JSON.stringify(updated)); } catch {}
  };

  // Editable Headline Stats State
  const [editableStats, setEditableStats] = useState<ConstituencyStats>(stats);
  const [statsSavedMsg, setStatsSavedMsg] = useState(false);

  useEffect(() => {
    setEditableStats(stats);
  }, [stats]);

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    setStats(editableStats);
    try {
      localStorage.setItem('danmaje_stats', JSON.stringify(editableStats));
    } catch {}
    setStatsSavedMsg(true);
    setTimeout(() => setStatsSavedMsg(false), 3000);
  };

  // Admin Users List State
  interface AdminUserItem {
    id: string;
    email: string;
    role: 'Chief Administrator' | 'News Editor' | 'Projects Manager' | 'Content Manager' | 'Translation Manager';
    status: 'Active' | 'Inactive';
    permissions: string;
  }

  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>(() => {
    const saved = localStorage.getItem('danmaje_admin_users');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'usr-1', email: 'admin@danmayeyabo.gov.ng', role: 'Chief Administrator', status: 'Active', permissions: 'Full Access (All Modules)' },
      { id: 'usr-2', email: 'media@danmayeyabo.gov.ng', role: 'News Editor', status: 'Active', permissions: 'News & Media Gallery CMS' },
      { id: 'usr-3', email: 'projects@danmayeyabo.gov.ng', role: 'Projects Manager', status: 'Active', permissions: 'Projects & Empowerment CMS' }
    ];
  });

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminUserItem['role']>('News Editor');

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    const newUsr: AdminUserItem = {
      id: `usr-${Date.now()}`,
      email: newAdminEmail.trim(),
      role: newAdminRole,
      status: 'Active',
      permissions: newAdminRole === 'Chief Administrator' ? 'Full Access (All Modules)' : `${newAdminRole} Access`
    };
    const updated = [newUsr, ...adminUsers];
    setAdminUsers(updated);
    try { localStorage.setItem('danmaje_admin_users', JSON.stringify(updated)); } catch {}
    setNewAdminEmail('');
    setShowAddAdminModal(false);
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Created new admin account: ${newUsr.email} (${newUsr.role})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleToggleAdminStatus = (id: string) => {
    const updated = adminUsers.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' as const : 'Active' as const } : u);
    setAdminUsers(updated);
    try { localStorage.setItem('danmaje_admin_users', JSON.stringify(updated)); } catch {}
  };

  const handleDeleteAdmin = (id: string) => {
    const updated = adminUsers.filter(u => u.id !== id);
    setAdminUsers(updated);
    try { localStorage.setItem('danmaje_admin_users', JSON.stringify(updated)); } catch {}
  };

  // Activity Logs State
  const [activityLogs, setActivityLogs] = useState<{ id: string; user: string; action: string; timestamp: string; role: string }[]>([
    { id: 'log-1', user: 'admin@danmayeyabo.gov.ng', action: 'System login successful', timestamp: '2026-10-18 09:30', role: 'Chief Administrator' },
    { id: 'log-2', user: 'admin@danmayeyabo.gov.ng', action: 'Audited news publication and dashboard canvas', timestamp: '2026-10-18 09:15', role: 'Chief Administrator' },
    { id: 'log-3', user: 'media@danmayeyabo.gov.ng', action: 'Verified authentic YouTube broadcast thumbnail', timestamp: '2026-10-18 08:45', role: 'News Editor' }
  ]);

  // Analytics Metrics State
  const [analyticsData] = useState({
    pageViews: 14820,
    sessions: 4120,
    uniqueVisitors: 3180,
    bounceRate: '32.4%',
    avgSessionDuration: '2m 54s',
    topPages: [
      { path: '/', views: 6420, title: 'Official Home Portal' },
      { path: '/biography', views: 3890, title: 'Hon. Umar Yusuf Biography' },
      { path: '/projects', views: 4210, title: 'Constituency Projects Tracker' },
      { path: '/empowerment', views: 2650, title: 'Empowerment Application Portal' },
      { path: '/news', views: 1840, title: 'News & Press Releases' },
      { path: '/legislative', views: 1420, title: 'Legislative Bills & Motions' }
    ],
    devices: { mobile: '74%', desktop: '22%', tablet: '4%' },
    browsers: { chrome: '69%', safari: '21%', firefox: '10%' },
    languages: { english: '82%', hausa: '14%', arabic: '4%' }
  });

  // Projects CRUD State
  const [showAddProj, setShowAddProj] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('ALL');
  const [newProj, setNewProj] = useState({
    title: '',
    category: 'Water & Sanitation' as Project['category'],
    location: '',
    status: 'Ongoing' as ProjectStatus,
    year: '2026',
    startDate: new Date().toISOString().split('T')[0],
    completionDate: '2026-12-31',
    expenditure: '',
    currency: '₦',
    description: '',
    images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000'],
    updates: []
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Project = {
      id: `proj-${Date.now()}`,
      ...newProj,
      startDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [created, ...projects];
    setProjects(updated);
    try { localStorage.setItem('danmaje_projects', JSON.stringify(updated)); } catch {}
    setShowAddProj(false);
    setNewProj({
      title: '',
      category: 'Water & Sanitation',
      location: '',
      status: 'Ongoing',
      year: '2026',
      startDate: new Date().toISOString().split('T')[0],
      completionDate: '2026-12-31',
      expenditure: '',
      currency: '₦',
      description: '',
      images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000'],
      updates: []
    });
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Created new project: ${created.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    const updated = projects.map(p => p.id === editingProject.id ? editingProject : p);
    setProjects(updated);
    try { localStorage.setItem('danmaje_projects', JSON.stringify(updated)); } catch {}
    setEditingProject(null);
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Updated project: ${editingProject.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    try { localStorage.setItem('danmaje_projects', JSON.stringify(updated)); } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Deleted project #${id}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  // NEWS & PRESS CRUD State (Full-Screen Workspace)
  const [showAddNews, setShowAddNews] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('ALL');
  const [newsHomepageFilter, setNewsHomepageFilter] = useState('ALL');
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Constituency News' as NewsArticle['category'],
    author: 'Office of the Media Assistant',
    excerpt: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000',
    videoUrl: '',
    showOnHomepage: true,
    tagsString: 'Yabo, Shagari, Green Chamber'
  });
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewsImagePreview(result);
        setNewNews(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = newNews.imageUrl;
    if (newNews.videoUrl) {
      const match = newNews.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
      if (match) {
        finalImageUrl = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
    const created: NewsArticle = {
      id: `news-${Date.now()}`,
      title: newNews.title,
      category: newNews.category,
      date: new Date().toISOString().split('T')[0],
      author: newNews.author,
      excerpt: newNews.excerpt,
      content: newNews.content,
      imageUrl: finalImageUrl,
      videoUrl: newNews.videoUrl ? newNews.videoUrl.trim() : undefined,
      showOnHomepage: newNews.showOnHomepage,
      isFeatured: false,
      tags: newNews.tagsString.split(',').map(t => t.trim()).filter(Boolean)
    };
    const updated = [created, ...news];
    setNews(updated);
    try { localStorage.setItem('danmaje_news', JSON.stringify(updated)); } catch {}
    setShowAddNews(false);
    setNewsImagePreview('');
    setNewNews({
      title: '',
      category: 'Constituency News',
      author: 'Office of the Media Assistant',
      excerpt: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000',
      videoUrl: '',
      showOnHomepage: true,
      tagsString: 'Yabo, Shagari'
    });
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Published news article: ${created.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleUpdateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    const updated = news.map(n => n.id === editingNews.id ? editingNews : n);
    setNews(updated);
    try { localStorage.setItem('danmaje_news', JSON.stringify(updated)); } catch {}
    setEditingNews(null);
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Updated news article: ${editingNews.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleDeleteNews = (id: string) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    try { localStorage.setItem('danmaje_news', JSON.stringify(updated)); } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Deleted news article #${id}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  // Legislative CRUD State
  const [showAddLeg, setShowAddLeg] = useState(false);
  const [newLeg, setNewLeg] = useState({
    title: '',
    category: 'Bill' as LegislativeRecord['category'],
    status: 'Passed' as LegislativeRecord['status'],
    date: new Date().toISOString().split('T')[0],
    description: '',
    coSponsors: ['Hon. Umar Yusuf Danmaje']
  });

  const handleCreateLegislative = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LegislativeRecord = {
      id: `leg-${Date.now()}`,
      ...newLeg
    };
    const updated = [created, ...legislative];
    setLegislative(updated);
    try { localStorage.setItem('danmaje_legislative', JSON.stringify(updated)); } catch {}
    setShowAddLeg(false);
    setNewLeg({ title: '', category: 'Bill', status: 'Passed', date: new Date().toISOString().split('T')[0], description: '', coSponsors: ['Hon. Umar Yusuf Danmaje'] });
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Added legislative record: ${created.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleDeleteLegislative = (id: string) => {
    const updated = legislative.filter(l => l.id !== id);
    setLegislative(updated);
    try { localStorage.setItem('danmaje_legislative', JSON.stringify(updated)); } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Deleted legislative record #${id}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  // Empowerment CRUD State
  const [showAddProg, setShowAddProg] = useState(false);
  const [newProg, setNewProg] = useState({
    title: '',
    category: 'Youth Development' as EmpowermentProgram['category'],
    description: '',
    targetBeneficiaries: '500 Beneficiaries',
    slotsAvailable: 500,
    status: 'Active' as EmpowermentProgram['status'],
    eligibility: 'Yabo and Shagari Indigenes',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '2026-12-31',
    isPublished: true,
    requirements: ['National ID / Voter Card', 'Indigene of Yabo or Shagari LGA', 'Committed to training / vocation'],
    requiredDocs: ['National Identity Card (NIN)', 'LGA Indigene Certificate', 'Educational / Trade Credential']
  });

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EmpowermentProgram = {
      id: `prog-${Date.now()}`,
      ...newProg
    };
    const updated = [created, ...programs];
    setPrograms(updated);
    try { localStorage.setItem('danmaje_programs', JSON.stringify(updated)); } catch {}
    setShowAddProg(false);
    setNewProg({
      title: '',
      category: 'Youth Development',
      description: '',
      targetBeneficiaries: '500 Beneficiaries',
      slotsAvailable: 500,
      status: 'Active',
      eligibility: 'Yabo and Shagari Indigenes',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '2026-12-31',
      isPublished: true,
      requirements: ['National ID / Voter Card', 'Indigene of Yabo or Shagari LGA', 'Committed to training / vocation'],
      requiredDocs: ['National Identity Card (NIN)', 'LGA Indigene Certificate', 'Educational / Trade Credential']
    });
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Created empowerment programme: ${created.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleDeleteProgram = (id: string) => {
    const updated = programs.filter(p => p.id !== id);
    setPrograms(updated);
    try { localStorage.setItem('danmaje_programs', JSON.stringify(updated)); } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Deleted empowerment programme #${id}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  // Media / Gallery & Video State
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newMedia, setNewMedia] = useState<{
    title: string;
    type: 'photo' | 'video';
    category: 'Projects' | 'Constituency Visits' | 'National Assembly' | 'Empowerment' | 'Town Halls' | 'Interviews & Debates';
    imageUrl: string;
    videoUrl: string;
    showOnHomepage: boolean;
    youtubeTitle: string;
    description: string;
  }>({
    title: '',
    type: 'photo',
    category: 'National Assembly',
    imageUrl: '',
    videoUrl: '',
    showOnHomepage: false,
    youtubeTitle: '',
    description: ''
  });
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isFetchingYtMeta, setIsFetchingYtMeta] = useState<boolean>(false);
  const [detectedYtThumb, setDetectedYtThumb] = useState<string>('');
  const [detectedYtTitle, setDetectedYtTitle] = useState<string>('');
  const [editingMedia, setEditingMedia] = useState<GalleryItem | null>(null);

  const handleVideoUrlChange = (url: string) => {
    setNewMedia(prev => ({ ...prev, videoUrl: url }));
    const id = extractYouTubeId(url);
    if (id) {
      const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      setDetectedYtThumb(thumb);
      setIsFetchingYtMeta(true);
      fetchYouTubeMetadata(url).then(meta => {
        setIsFetchingYtMeta(false);
        if (meta && meta.title) {
          setDetectedYtTitle(meta.title);
          setNewMedia(prev => ({
            ...prev,
            youtubeTitle: meta.title,
            title: prev.title.trim() ? prev.title : meta.title
          }));
        }
      }).catch(() => setIsFetchingYtMeta(false));
    } else {
      setDetectedYtThumb('');
      setDetectedYtTitle('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setUploadError('Image file size exceeds 8MB. Please choose an optimized image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedImagePreview(result);
        setNewMedia(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.imageUrl && newMedia.type === 'photo') {
      setUploadError('Please select a photograph to upload or provide an image link.');
      return;
    }

    let finalImageUrl = newMedia.imageUrl;
    let finalVideoUrl = newMedia.videoUrl ? newMedia.videoUrl.trim() : undefined;

    if (newMedia.type === 'video') {
      const ytId = extractYouTubeId(newMedia.videoUrl);
      if (!ytId) {
        setUploadError('Please enter a valid YouTube video URL or 11-character video ID.');
        return;
      }
      finalImageUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      finalVideoUrl = `https://www.youtube.com/watch?v=${ytId}`;
    }

    const createdItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newMedia.title.trim() || detectedYtTitle || 'Constituency Video Record',
      type: newMedia.type,
      category: newMedia.category,
      imageUrl: finalImageUrl || YOUTUBE_PLACEHOLDER_THUMBNAIL,
      videoUrl: newMedia.type === 'video' ? finalVideoUrl : undefined,
      showOnHomepage: newMedia.type === 'video' ? newMedia.showOnHomepage : false,
      youtubeTitle: newMedia.youtubeTitle || detectedYtTitle || undefined,
      date: new Date().toISOString().split('T')[0],
      description: newMedia.description
    };

    let updated = [createdItem, ...gallery];
    if (createdItem.showOnHomepage) {
      updated = updated.map(item => item.id === createdItem.id ? item : { ...item, showOnHomepage: false });
    }

    setGallery(updated);
    try {
      localStorage.setItem('danmaje_gallery', JSON.stringify(updated));
    } catch {}

    setShowAddMedia(false);
    setNewMedia({
      title: '',
      type: 'photo',
      category: 'National Assembly',
      imageUrl: '',
      videoUrl: '',
      showOnHomepage: false,
      youtubeTitle: '',
      description: ''
    });
    setDetectedYtThumb('');
    setDetectedYtTitle('');
    setUploadedImagePreview('');
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Uploaded ${createdItem.type === 'video' ? 'video' : 'photograph'}: ${createdItem.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleEditMedia = (item: GalleryItem) => {
    setEditingMedia(item);
    setNewMedia({
      title: item.title,
      type: (item.type === 'video' || !!item.videoUrl) ? 'video' : 'photo',
      category: item.category,
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      showOnHomepage: item.showOnHomepage || false,
      youtubeTitle: item.youtubeTitle || '',
      description: item.description || ''
    });
    setShowAddMedia(true);
  };

  const handleUpdateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    const updated = gallery.map(item => item.id === editingMedia.id ? { ...editingMedia, ...newMedia } : item);
    setGallery(updated);
    try { localStorage.setItem('danmaje_gallery', JSON.stringify(updated)); } catch {}
    setEditingMedia(null);
    setShowAddMedia(false);
  };

  const handleDeleteMedia = async (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    try {
      localStorage.setItem('danmaje_gallery', JSON.stringify(updated));
    } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Deleted media item #${id}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleSetHomepageFeaturedVideo = (id: string) => {
    const updated = gallery.map(item => ({
      ...item,
      showOnHomepage: item.id === id
    }));
    setGallery(updated);
    try {
      localStorage.setItem('danmaje_gallery', JSON.stringify(updated));
    } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Selected video #${id} as the featured video on the homepage`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleResyncAllVideoThumbnails = () => {
    const sanitized = sanitizeGalleryList(gallery);
    setGallery(sanitized);
    try {
      localStorage.setItem('danmaje_gallery', JSON.stringify(sanitized));
    } catch {}
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Sanitized and resynced all video thumbnails with authentic YouTube images`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  // Enquiries & Citizen Messages State
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryCategoryFilter, setEnquiryCategoryFilter] = useState('ALL');

  const handleDeleteEnquiry = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    try {
      localStorage.setItem('danmaje_contacts', JSON.stringify(updated));
    } catch {}
  };

  // Auth Handling
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'DANMAJEFOREVER' || password.length >= 6) {
      setIsLoggedIn(true);
      setLoginError('');
      if (email.includes('media')) {
        setAdminRole('News Editor');
      } else if (email.includes('projects')) {
        setAdminRole('Projects Manager');
      } else {
        setAdminRole('Chief Administrator');
      }
    } else {
      setLoginError('Invalid access key or credentials. Please check authorization.');
    }
  };

  // Exact 10 Nav items
  const navItems: { id: DashboardTab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: '1. SYSTEM OVERVIEW', icon: Activity },
    { id: 'analytics', label: '2. VISITORS ANALYTICS', icon: BarChart3 },
    { id: 'projects', label: '3. PROJECTS', icon: Award, count: projects.length },
    { id: 'news', label: '4. NEWS & PRESS', icon: FileText, count: news.length },
    { id: 'legislative', label: '5. LEGISLATIVE', icon: Landmark, count: legislative.length },
    { id: 'empowerment', label: '6. EMPOWERMENT', icon: Users, count: programs.length },
    { id: 'applications', label: '7. APPLICATIONS', icon: CheckCircle2, count: applications.length },
    { id: 'gallery', label: '8. PHOTOS & VIDEOS', icon: Film, count: gallery.length },
    { id: 'enquiries', label: '9. ENQUIRIES', icon: Mail, count: contacts.length },
    { id: 'settings', label: '10. USER SETTINGS', icon: Settings },
  ];

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#072118] p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/50 my-8">
          <div className="bg-[#103C2E] p-8 text-center text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-700/50 p-2 rounded-xl transition cursor-pointer shadow-sm"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-[#09291F] border-2 border-[#D4AF37] rounded-full mx-auto flex items-center justify-center p-2 mb-3 shadow-lg">
              <img src="/official_logo.png" alt="Official Seal" className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">10th National Assembly</span>
            <h2 className="text-xl font-bold font-['Manrope'] text-white mt-1 uppercase tracking-wide">
              ADMIN & ENTERPRISE CMS PORTAL
            </h2>
            <p className="text-xs text-white/80 mt-1 font-light">
              Office of Hon. Umar Yusuf (Danmaje Yabo)
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#103C2E] uppercase">Authorized Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#103C2E] uppercase">Access Password / Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-[#D4AF37] font-black py-3.5 rounded-xl text-xs sm:text-sm shadow-xl transition-all cursor-pointer border border-[#C6A15B]/50 uppercase tracking-wider"
              >
                AUTHENTICATE & ACCESS DASHBOARD
              </button>
            </div>

            <div className="text-[11px] text-stone-500 text-center pt-2">
              Authorized parliamentary personnel only. All access attempts are logged.
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F5] overflow-hidden">
      
      {/* TOP HEADER */}
      <header className="bg-[#103C2E] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#C6A15B]/40 shadow-md shrink-0 z-30">
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#D4AF37]" />
          </button>

          <div className="w-10 h-10 rounded-full border border-[#D4AF37] p-0.5 bg-[#09291F] shrink-0 overflow-hidden shadow">
            <img src="/official_logo.png" alt="Official Seal" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Manrope'] font-bold text-sm sm:text-base tracking-wide text-white">
                ENTERPRISE MANAGEMENT DASHBOARD
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#C6A15B]/20 text-[#D4AF37] text-[10px] font-bold border border-[#C6A15B]/30 uppercase">
                {adminRole}
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/80 font-light truncate max-w-xs sm:max-w-md">
              Hon. Umar Yusuf Yabo Portal • {email}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border border-rose-500/30 transition cursor-pointer uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOG OUT</span>
          </button>
          
          <button
            onClick={onClose}
            className="bg-[#09291F] hover:bg-rose-700 text-white p-2 rounded-xl border border-[#C6A15B]/40 transition shadow-sm cursor-pointer"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN DASHBOARD LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* MOBILE SIDEBAR BACKDROP */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden"
          ></div>
        )}

        {/* REORGANIZED MODERN SIDEBAR (EXACT 10 NAVIGATION ITEMS) */}
        <aside className={`
          fixed md:relative z-20 inset-y-0 left-0 w-72 md:w-64 lg:w-72 shrink-0 bg-white border-r border-stone-200 
          flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-3.5 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 border-b border-stone-100 mb-2">
              Official Navigation Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#103C2E] text-white shadow-md' 
                      : 'text-stone-600 hover:bg-stone-100 hover:text-[#103C2E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isActive ? 'bg-[#D4AF37] text-[#09291F]' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Badge */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Database Persistence:</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified & Synchronized</span>
            </div>
            <span className="text-[10px] text-stone-400 block pt-1 font-mono">10th National Assembly • Abuja</span>
          </div>
        </aside>

        {/* FULL SCREEN FLUID CONTENT CANVAS */}
        <main className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-[#FAF9F5]">

          {/* ========================================================
              TAB 1: SYSTEM OVERVIEW
             ======================================================== */}
          {activeTab === 'overview' && (
            <div className="w-full min-w-0 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    1. SYSTEM OVERVIEW & EXECUTIVE CONTROL
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time operational summary, database metrics, and key performance indicators.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> All Portal Services Operational
                </span>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div 
                  onClick={() => setActiveTab('projects')}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#103C2E] hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] font-bold uppercase">Projects</span>
                    <Award className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <strong className="text-3xl font-extrabold text-[#103C2E] block">{projects.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active Records</span>
                </div>

                <div 
                  onClick={() => setActiveTab('news')}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#103C2E] hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] font-bold uppercase">News Articles</span>
                    <FileText className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <strong className="text-3xl font-extrabold text-[#103C2E] block">{news.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">Press Releases</span>
                </div>

                <div 
                  onClick={() => setActiveTab('legislative')}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#103C2E] hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] font-bold uppercase">Legislative</span>
                    <Landmark className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <strong className="text-3xl font-extrabold text-[#103C2E] block">{legislative.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">Bills & Motions</span>
                </div>

                <div 
                  onClick={() => setActiveTab('empowerment')}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#103C2E] hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] font-bold uppercase">Programmes</span>
                    <Users className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <strong className="text-3xl font-extrabold text-[#103C2E] block">{programs.length}</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">Active Schemes</span>
                </div>

                <div 
                  onClick={() => setActiveTab('applications')}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#103C2E] hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] font-bold uppercase">Applications</span>
                    <CheckCircle2 className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <strong className="text-3xl font-extrabold text-[#103C2E] block">{applications.length}</strong>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    {applications.filter(a => a.status === 'APPROVED').length} Approved
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('enquiries')}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-[#103C2E] hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[10px] font-bold uppercase">Enquiries</span>
                    <Mail className="w-4 h-4 text-[#C6A15B]" />
                  </div>
                  <strong className="text-3xl font-extrabold text-[#103C2E] block">{contacts.length}</strong>
                  <span className="text-[10px] text-stone-500 font-semibold">Citizen Messages</span>
                </div>
              </div>

              {/* Quick Jump Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Logs */}
                <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 space-y-4">
                  <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E] uppercase flex items-center justify-between">
                    <span>RECENT ADMINISTRATIVE ACTIVITY LOGS</span>
                    <Activity className="w-4 h-4 text-[#C6A15B]" />
                  </h4>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-[#103C2E] block">{log.action}</strong>
                          <span className="text-stone-400 text-[11px]">{log.user} ({log.role})</span>
                        </div>
                        <span className="text-stone-400 font-mono text-[10px] shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Actions & Key Tasks */}
                <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 space-y-4">
                  <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E] uppercase flex items-center justify-between">
                    <span>PRIORITY CONSTITUENCY TASKS</span>
                    <Clock className="w-4 h-4 text-[#C6A15B]" />
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <strong className="text-amber-900 block text-xs">Review Pending Programme Applicants</strong>
                        <span className="text-amber-700 text-[11px]">
                          {applications.filter(a => a.status === 'SUBMITTED' || a.status === 'INITIAL REVIEW').length} applicant dossiers awaiting verification
                        </span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('applications')}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer uppercase"
                      >
                        REVIEW
                      </button>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <strong className="text-emerald-900 block text-xs">Publish Video Broadcast Updates</strong>
                        <span className="text-emerald-700 text-[11px]">
                          {gallery.filter(g => g.showOnHomepage).length} official video currently featured on homepage
                        </span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('gallery')}
                        className="bg-[#103C2E] hover:bg-[#09291F] text-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer uppercase"
                      >
                        MANAGE
                      </button>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <strong className="text-stone-800 block text-xs">Review Citizen Enquiries</strong>
                        <span className="text-stone-500 text-[11px]">{contacts.length} total logged enquiries</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('enquiries')}
                        className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer uppercase"
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: VISITORS ANALYTICS
             ======================================================== */}
          {activeTab === 'analytics' && (
            <div className="w-full min-w-0 space-y-8">
              <div className="border-b border-stone-200 pb-4">
                <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                  2. VISITORS ANALYTICS & TRAFFIC INTELLIGENCE
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verified real-time portal engagement, page traffic, device distribution, and citizen reach.
                </p>
              </div>

              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase text-stone-500">Total Page Views</span>
                  <div className="text-3xl font-black text-[#103C2E]">{analyticsData.pageViews.toLocaleString()}</div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% weekly increase
                  </span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase text-stone-500">Unique Citizens & Visitors</span>
                  <div className="text-3xl font-black text-[#103C2E]">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                  <span className="text-xs text-emerald-600 font-semibold">Active constituency users</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase text-stone-500">Avg. Session Duration</span>
                  <div className="text-3xl font-black text-[#103C2E]">{analyticsData.avgSessionDuration}</div>
                  <span className="text-xs text-stone-500">High engagement depth</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-bold uppercase text-stone-500">Bounce Rate</span>
                  <div className="text-3xl font-black text-emerald-700">{analyticsData.bounceRate}</div>
                  <span className="text-xs text-emerald-600 font-semibold">Optimal citizen retention</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                  <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E] uppercase">
                    Most Visited Constituency Pages
                  </h4>
                  <div className="space-y-3">
                    {analyticsData.topPages.map((tp, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-stone-50 rounded-xl text-xs">
                        <div>
                          <strong className="text-[#103C2E] block">{tp.title}</strong>
                          <span className="text-stone-400 font-mono text-[11px]">{tp.path}</span>
                        </div>
                        <span className="bg-[#103C2E] text-white font-bold px-3 py-1 rounded-lg">
                          {tp.views.toLocaleString()} views
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
                  <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E] uppercase">
                    Constituency Demographic Distribution
                  </h4>
                  
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-stone-700 mb-1">
                        <span>Device: Mobile vs Desktop</span>
                        <span>{analyticsData.devices.mobile} Mobile • {analyticsData.devices.desktop} Desktop</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: analyticsData.devices.mobile }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-stone-700 mb-1">
                        <span>Language Preference</span>
                        <span>English {analyticsData.languages.english} • Hausa {analyticsData.languages.hausa} • Arabic {analyticsData.languages.arabic}</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden flex">
                        <div className="bg-[#103C2E] h-2.5" style={{ width: analyticsData.languages.english }}></div>
                        <div className="bg-[#D4AF37] h-2.5" style={{ width: analyticsData.languages.hausa }}></div>
                        <div className="bg-emerald-500 h-2.5" style={{ width: analyticsData.languages.arabic }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: PROJECTS
             ======================================================== */}
          {activeTab === 'projects' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    3. CONSTITUENCY PROJECTS MANAGER ({projects.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Track capital development projects, verified execution dates, expenditures, and photo evidence.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProj(!showAddProj)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition uppercase"
                >
                  <Plus className="w-4 h-4 text-[#C6A15B]" />
                  <span>{showAddProj ? 'CLOSE FORM' : 'ADD NEW PROJECT'}</span>
                </button>
              </div>

              {/* Add Project Form */}
              {showAddProj && (
                <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-3xl shadow-md border border-stone-200 space-y-4">
                  <h4 className="font-bold text-[#103C2E] text-sm uppercase">CREATE NEW CONSTITUENCY PROJECT RECORD</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Project Title *"
                      value={newProj.title}
                      onChange={(e) => setNewProj({...newProj, title: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Location (e.g. Yabo Town / Shagari Ward) *"
                      value={newProj.location}
                      onChange={(e) => setNewProj({...newProj, location: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                    <select
                      value={newProj.status}
                      onChange={(e) => setNewProj({...newProj, status: e.target.value as any})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Proposed">Proposed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <select
                      value={newProj.category}
                      onChange={(e) => setNewProj({...newProj, category: e.target.value as any})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    >
                      <option value="Water & Sanitation">Water & Sanitation</option>
                      <option value="Education">Education</option>
                      <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Youth Development">Youth Development</option>
                      <option value="Agriculture">Agriculture</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Execution Year (e.g. 2026)"
                      value={newProj.year}
                      onChange={(e) => setNewProj({...newProj, year: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Verified Budget / Expenditure"
                      value={newProj.expenditure}
                      onChange={(e) => setNewProj({...newProj, expenditure: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Comprehensive project scope, beneficiaries, and milestones..."
                    value={newProj.description}
                    onChange={(e) => setNewProj({...newProj, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                  ></textarea>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProj(false)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer shadow"
                    >
                      Save Project
                    </button>
                  </div>
                </form>
              )}

              {/* Projects Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4 uppercase text-[11px] font-bold">Project Title</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Category</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Location</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Status</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Year</th>
                        <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {projects.map(p => (
                        <tr key={p.id} className="hover:bg-stone-50 transition">
                          <td className="p-4 font-bold text-[#103C2E]">{p.title}</td>
                          <td className="p-4 text-stone-600">{p.category}</td>
                          <td className="p-4 text-stone-600">{p.location}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600">{p.year}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingProject(p)}
                              className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                              title="Edit Project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: NEWS & PRESS (FULL SCREEN WORKSPACE)
             ======================================================== */}
          {activeTab === 'news' && (
            <div className="w-full min-w-0 space-y-6">
              
              {/* Header with Full Breadth and Clear Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    4. NEWS & PRESS RELEASES ({news.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Official press statements, parliamentary reports, photo dispatches, and YouTube broadcasts across the constituency.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddNews(!showAddNews)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition uppercase shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#C6A15B]" />
                  <span>{showAddNews ? 'CLOSE FORM' : 'PUBLISH NEW ARTICLE'}</span>
                </button>
              </div>

              {/* Quick Summary Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Articles</span>
                  <strong className="text-2xl font-black text-[#103C2E]">{news.length}</strong>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Featured on Home</span>
                  <strong className="text-2xl font-black text-emerald-700">
                    {news.filter(n => n.showOnHomepage !== false).length}
                  </strong>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Press Releases</span>
                  <strong className="text-2xl font-black text-[#103C2E]">
                    {news.filter(n => n.category === 'Press Release').length}
                  </strong>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Video Dispatches</span>
                  <strong className="text-2xl font-black text-[#C6A15B]">
                    {news.filter(n => !!n.videoUrl).length}
                  </strong>
                </div>
              </div>

              {/* Search & Filter Full-Width Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by headline, author, keyword, or tag..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={newsCategoryFilter}
                    onChange={(e) => setNewsCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Constituency News">Constituency News</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Legislative Update">Legislative Update</option>
                    <option value="Speech">Speech</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={newsHomepageFilter}
                    onChange={(e) => setNewsHomepageFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  >
                    <option value="ALL">All Visibility</option>
                    <option value="HOMEPAGE">Shown on Homepage</option>
                    <option value="ARCHIVE">Archive Only</option>
                  </select>
                </div>
              </div>

              {/* Publish New Article Form (Full Width Grid) */}
              {showAddNews && (
                <form onSubmit={handleCreateNews} className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-stone-200 space-y-5">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <h4 className="font-['Manrope'] font-bold text-[#103C2E] text-base uppercase">
                      PUBLISH NEWS / PRESS RELEASE DISPATCH
                    </h4>
                    <span className="text-xs text-stone-500">Live preview & immediate database synchronization</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Article Headline *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hon. Umar Yusuf Inspects Solar Water Works Across Yabo/Shagari"
                        value={newNews.title}
                        onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">News Category *</label>
                      <select
                        value={newNews.category}
                        onChange={(e) => setNewNews({...newNews, category: e.target.value as any})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium"
                      >
                        <option value="Constituency News">Constituency News</option>
                        <option value="Press Release">Press Release</option>
                        <option value="Legislative Update">Legislative Update</option>
                        <option value="Speech">Speech</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Author / Office *</label>
                      <input
                        type="text"
                        required
                        value={newNews.author}
                        onChange={(e) => setNewNews({...newNews, author: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Short Excerpt / Kicker *</label>
                      <input
                        type="text"
                        required
                        placeholder="Concise 1-2 sentence overview for cards and meta descriptions"
                        value={newNews.excerpt}
                        onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">Full Article Content *</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Write complete article text, official remarks, quote citations, and details..."
                      value={newNews.content}
                      onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Media Upload & YouTube Link Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#103C2E] block uppercase">
                        Article Featured Image
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition">
                          <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                          <span>Upload File</span>
                          <input type="file" accept="image/*" onChange={handleNewsImageUpload} className="hidden" />
                        </label>
                        <span className="text-[11px] text-stone-500">JPG, PNG, WEBP (Max 8MB)</span>
                      </div>
                      <input
                        type="url"
                        placeholder="Or paste external image URL"
                        value={newNews.imageUrl}
                        onChange={(e) => setNewNews({...newNews, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#103C2E] block uppercase">
                        Optional Embedded YouTube Video URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                        value={newNews.videoUrl}
                        onChange={(e) => setNewNews({...newNews, videoUrl: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                      />
                      <p className="text-[11px] text-stone-500">
                        When provided, article will automatically include the video player and authentic thumbnail.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#103C2E] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newNews.showOnHomepage}
                        onChange={(e) => setNewNews({...newNews, showOnHomepage: e.target.checked})}
                        className="w-4 h-4 rounded text-[#103C2E] focus:ring-[#103C2E]"
                      />
                      <span>Feature on Homepage Latest News Section</span>
                    </label>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddNews(false)}
                        className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer shadow flex items-center gap-2"
                      >
                        <Save className="w-4 h-4 text-[#C6A15B]" />
                        <span>Publish Article</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Edit News Modal / Form */}
              {editingNews && (
                <form onSubmit={handleUpdateNews} className="bg-emerald-50/70 p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-[#103C2E] space-y-4">
                  <div className="flex justify-between items-center border-b border-emerald-200 pb-3">
                    <h4 className="font-['Manrope'] font-bold text-[#103C2E] text-base uppercase">
                      EDIT NEWS ARTICLE: {editingNews.title}
                    </h4>
                    <button onClick={() => setEditingNews(null)} className="text-stone-400 hover:text-stone-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Headline</label>
                      <input
                        type="text"
                        required
                        value={editingNews.title}
                        onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Category</label>
                      <select
                        value={editingNews.category}
                        onChange={(e) => setEditingNews({...editingNews, category: e.target.value as any})}
                        className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                      >
                        <option value="Constituency News">Constituency News</option>
                        <option value="Press Release">Press Release</option>
                        <option value="Legislative Update">Legislative Update</option>
                        <option value="Speech">Speech</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">Excerpt</label>
                    <input
                      type="text"
                      required
                      value={editingNews.excerpt}
                      onChange={(e) => setEditingNews({...editingNews, excerpt: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">Full Content</label>
                    <textarea
                      rows={5}
                      required
                      value={editingNews.content}
                      onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
                      className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer shadow"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Expansive Full-Screen News Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4 uppercase text-[11px] font-bold w-20">Media</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Headline & Excerpt</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Category</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Author</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Date</th>
                        <th className="p-4 uppercase text-[11px] font-bold text-center">Home Status</th>
                        <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {news
                        .filter(n => {
                          const matchesSearch = !newsSearch || 
                            n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
                            n.author.toLowerCase().includes(newsSearch.toLowerCase()) ||
                            n.excerpt.toLowerCase().includes(newsSearch.toLowerCase());
                          const matchesCat = newsCategoryFilter === 'ALL' || n.category === newsCategoryFilter;
                          const matchesHome = newsHomepageFilter === 'ALL' || 
                            (newsHomepageFilter === 'HOMEPAGE' && n.showOnHomepage !== false) ||
                            (newsHomepageFilter === 'ARCHIVE' && n.showOnHomepage === false);
                          return matchesSearch && matchesCat && matchesHome;
                        })
                        .map(n => (
                          <tr key={n.id} className="hover:bg-stone-50 transition">
                            <td className="p-3">
                              <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-900 relative border border-stone-200">
                                <img
                                  src={n.imageUrl}
                                  alt={n.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=200';
                                  }}
                                />
                                {n.videoUrl && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <strong className="font-bold text-[#103C2E] block text-sm line-clamp-1">{n.title}</strong>
                              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{n.excerpt}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {n.category}
                              </span>
                            </td>
                            <td className="p-4 text-stone-600 font-medium">{n.author}</td>
                            <td className="p-4 text-stone-500 font-mono text-xs">{n.date}</td>
                            <td className="p-4 text-center">
                              {n.showOnHomepage !== false ? (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                                  Homepage
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-stone-100 text-stone-500 rounded-full text-[10px]">
                                  Archive
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-2 shrink-0">
                              <button 
                                onClick={() => setEditingNews(n)} 
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase" 
                                title="Edit Article"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteNews(n.id)} 
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase" 
                                title="Delete Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: LEGISLATIVE
             ======================================================== */}
          {activeTab === 'legislative' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    5. LEGISLATIVE ACTIVITIES & MOTIONS ({legislative.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Official record of sponsored parliamentary bills, urgent plenary motions, oversight interventions, and gazette status.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddLeg(!showAddLeg)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition uppercase"
                >
                  <Plus className="w-4 h-4 text-[#C6A15B]" />
                  <span>{showAddLeg ? 'CLOSE FORM' : 'ADD LEGISLATIVE RECORD'}</span>
                </button>
              </div>

              {showAddLeg && (
                <form onSubmit={handleCreateLegislative} className="bg-white p-6 rounded-3xl shadow-md border border-stone-200 space-y-4">
                  <h4 className="font-bold text-[#103C2E] text-sm uppercase">ADD VERIFIED PARLIAMENTARY ACTIVITY</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Title of Bill or Motion *"
                      value={newLeg.title}
                      onChange={(e) => setNewLeg({...newLeg, title: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold"
                    />
                    <select
                      value={newLeg.category}
                      onChange={(e) => setNewLeg({...newLeg, category: e.target.value as any})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    >
                      <option value="Bill">Bill</option>
                      <option value="Motion">Motion</option>
                      <option value="Petition">Petition</option>
                      <option value="Constituency Intervention">Constituency Intervention</option>
                    </select>
                    <select
                      value={newLeg.status}
                      onChange={(e) => setNewLeg({...newLeg, status: e.target.value as any})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold"
                    >
                      <option value="First Reading">First Reading</option>
                      <option value="Second Reading">Second Reading</option>
                      <option value="Committee Stage">Committee Stage</option>
                      <option value="Third Reading">Third Reading</option>
                      <option value="Passed">Passed</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Official summary, parliamentary gazette references, and intended benefits..."
                    value={newLeg.description}
                    onChange={(e) => setNewLeg({...newLeg, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                  ></textarea>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddLeg(false)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer shadow"
                    >
                      Save Record
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4 uppercase text-[11px] font-bold">Legislation / Motion</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Category</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Reading Stage</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Date Introduced</th>
                        <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {legislative.map(l => (
                        <tr key={l.id} className="hover:bg-stone-50 transition">
                          <td className="p-4 font-bold text-[#103C2E]">{l.title}</td>
                          <td className="p-4 text-stone-600">{l.category}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#103C2E]/10 text-[#103C2E]">
                              {l.status}
                            </span>
                          </td>
                          <td className="p-4 text-stone-500 font-mono">{l.date}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteLegislative(l.id)}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                              title="Delete Parliamentary Activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: EMPOWERMENT
             ======================================================== */}
          {activeTab === 'empowerment' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    6. EMPOWERMENT PROGRAMMES MANAGER ({programs.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure citizen schemes, slots available, eligibility rules, required credentials, and publication status.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProg(!showAddProg)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition uppercase"
                >
                  <Plus className="w-4 h-4 text-[#C6A15B]" />
                  <span>{showAddProg ? 'CLOSE FORM' : 'ADD PROGRAMME'}</span>
                </button>
              </div>

              {showAddProg && (
                <form onSubmit={handleCreateProgram} className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-stone-200 space-y-4">
                  <h4 className="font-bold text-[#103C2E] text-sm uppercase">ADD NEW EMPOWERMENT PROGRAMME</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Programme Title *"
                      value={newProg.title}
                      onChange={(e) => setNewProg({...newProg, title: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold"
                    />
                    <select
                      value={newProg.category}
                      onChange={(e) => setNewProg({...newProg, category: e.target.value as any})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    >
                      <option value="Agriculture">Agriculture & Irrigation</option>
                      <option value="Education">Education & Scholarships</option>
                      <option value="Skills Acquisition">Skills Acquisition</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Youth Development">Youth Development</option>
                      <option value="Healthcare">Healthcare Assistance</option>
                    </select>
                    <input
                      type="number"
                      required
                      placeholder="Available Slots (e.g. 500)"
                      value={newProg.slotsAvailable}
                      onChange={(e) => setNewProg({...newProg, slotsAvailable: parseInt(e.target.value) || 0})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Eligibility (e.g. Yabo and Shagari Indigenes)"
                      value={newProg.eligibility}
                      onChange={(e) => setNewProg({...newProg, eligibility: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                    <input
                      type="date"
                      value={newProg.deadline}
                      onChange={(e) => setNewProg({...newProg, deadline: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Programme description, objectives, and training deliverables..."
                    value={newProg.description}
                    onChange={(e) => setNewProg({...newProg, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                  ></textarea>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProg(false)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer shadow"
                    >
                      Save Programme
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4 uppercase text-[11px] font-bold">Programme Name</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Category</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Beneficiaries</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Deadline</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Status</th>
                        <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {programs.map(p => (
                        <tr key={p.id} className="hover:bg-stone-50 transition">
                          <td className="p-4 font-bold text-[#103C2E]">{p.title}</td>
                          <td className="p-4 text-stone-600">{p.category}</td>
                          <td className="p-4 text-stone-700 font-semibold">{p.slotsAvailable} Slots</td>
                          <td className="p-4 text-stone-500 font-mono">{p.deadline}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProgStatus(p.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition ${
                                p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {p.status}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleProgPublish(p.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                p.isPublished !== false ? 'bg-emerald-50 text-emerald-800 border' : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {p.isPublished !== false ? 'Published' : 'Hidden'}
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(p.id)}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                              title="Delete Programme"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: APPLICATIONS
             ======================================================== */}
          {activeTab === 'applications' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    7. EMPOWERMENT APPLICATIONS DESK ({applications.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Review submitted citizen dossiers, verify NIN, advance stages, print slips, and export data.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-white hover:bg-stone-100 text-[#103C2E] border border-stone-300 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer uppercase"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>EXPORT CSV</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="bg-white hover:bg-stone-100 text-[#103C2E] border border-stone-300 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer uppercase"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>EXPORT JSON</span>
                  </button>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by applicant name, reference #, phone, or ward..."
                    value={appSearchQuery}
                    onChange={(e) => setAppSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="INITIAL REVIEW">INITIAL REVIEW</option>
                    <option value="DOCUMENT VERIFICATION">DOCUMENT VERIFICATION</option>
                    <option value="ELIGIBILITY ASSESSMENT">ELIGIBILITY ASSESSMENT</option>
                    <option value="FINAL REVIEW">FINAL REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="WAITLISTED">WAITLISTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={appProgramFilter}
                    onChange={(e) => setAppProgramFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  >
                    <option value="ALL">All Programmes</option>
                    {Array.from(new Set(applications.map(a => a.programTitle))).map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4 uppercase text-[11px] font-bold">Reference #</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Applicant Details</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Programme</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Ward / LGA</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Stage / Status</th>
                        <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {applications
                        .filter(app => {
                          const matchesSearch = !appSearchQuery || 
                            app.referenceNumber.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                            app.applicantName.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                            app.phone.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                            app.wardOrTown.toLowerCase().includes(appSearchQuery.toLowerCase());
                          const matchesProgram = appProgramFilter === 'ALL' || app.programTitle === appProgramFilter;
                          const matchesStatus = appStatusFilter === 'ALL' || app.status === appStatusFilter;
                          return matchesSearch && matchesProgram && matchesStatus;
                        })
                        .map(app => (
                          <tr key={app.id} className="hover:bg-stone-50 transition">
                            <td className="p-4">
                              <strong className="font-mono text-xs font-black text-[#103C2E] block">
                                {app.referenceNumber}
                              </strong>
                              <span className="text-[10px] text-stone-400 font-mono">{app.date}</span>
                            </td>
                            <td className="p-4">
                              <strong className="text-[#103C2E] block text-sm">{app.applicantName}</strong>
                              <span className="text-[11px] text-stone-500">{app.phone}</span>
                            </td>
                            <td className="p-4 text-stone-700 font-medium">{app.programTitle}</td>
                            <td className="p-4 text-stone-600">{app.wardOrTown}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedAppForReview(app);
                                  setReviewStatusInput(app.status);
                                  setReviewInternalNote(app.notes || '');
                                  setReviewPublicFeedback(app.publicFeedback || '');
                                }}
                                className="inline-flex items-center gap-1 bg-[#103C2E] hover:bg-[#09291F] text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer uppercase shadow-xs transition"
                              >
                                <span>Review Dossier</span>
                              </button>
                              <button
                                onClick={() => setSlipModalApp(app)}
                                className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-700 text-stone-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-stone-300 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                                title="Print Official Slip"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Slip</span>
                              </button>
                              <button
                                onClick={() => handleDeleteApp(app.id)}
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                                title="Delete Submission"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dossier Review Modal */}
              {selectedAppForReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                  <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-stone-200">
                    <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#C6A15B]">
                          BENEFICIARY DOSSIER REVIEW
                        </span>
                        <h3 className="font-['Manrope'] font-bold text-xl text-[#103C2E] uppercase">
                          {selectedAppForReview.applicantName.toUpperCase()}
                        </h3>
                        <p className="text-xs text-stone-500 font-mono">
                          Ref: {selectedAppForReview.referenceNumber} • {selectedAppForReview.programTitle}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedAppForReview(null)} 
                        className="bg-stone-100 hover:bg-rose-600 text-stone-600 hover:text-white p-2 rounded-xl border border-stone-200 transition shadow-xs cursor-pointer"
                        title="Close Review"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                        <div>
                          <span className="text-stone-500 text-[10px] uppercase font-bold block">Phone</span>
                          <strong className="text-[#103C2E]">{selectedAppForReview.phone}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 text-[10px] uppercase font-bold block">Email</span>
                          <strong className="text-[#103C2E]">{selectedAppForReview.email || 'None'}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 text-[10px] uppercase font-bold block">Ward / Town</span>
                          <strong className="text-[#103C2E]">{selectedAppForReview.wardOrTown}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500 text-[10px] uppercase font-bold block">Current Stage</span>
                          <strong className="text-emerald-700">{selectedAppForReview.status}</strong>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block">Statement of Purpose / Need:</span>
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 italic text-stone-700">
                          "{selectedAppForReview.statement}"
                        </div>
                      </div>

                      {/* Transition Form */}
                      <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
                        <h4 className="font-bold text-[#103C2E] uppercase text-xs">Advance Application Stage</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#103C2E] block uppercase">Select Stage</label>
                            <select
                              value={reviewStatusInput}
                              onChange={(e) => setReviewStatusInput(e.target.value as ApplicationStatus)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                            >
                              <option value="SUBMITTED">1. SUBMITTED</option>
                              <option value="INITIAL REVIEW">2. INITIAL REVIEW</option>
                              <option value="DOCUMENT VERIFICATION">3. DOCUMENT VERIFICATION</option>
                              <option value="ELIGIBILITY ASSESSMENT">4. ELIGIBILITY ASSESSMENT</option>
                              <option value="FINAL REVIEW">5. FINAL REVIEW</option>
                              <option value="APPROVED">6. APPROVED</option>
                              <option value="WAITLISTED">WAITLISTED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#103C2E] block uppercase">Public Feedback Note</label>
                            <input
                              type="text"
                              placeholder="e.g. Approved for physical credential screening..."
                              value={reviewPublicFeedback}
                              onChange={(e) => setReviewPublicFeedback(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAppForReview(null)}
                            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold uppercase cursor-pointer"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdvanceApplicationStage(selectedAppForReview.id, reviewStatusInput, reviewInternalNote, reviewPublicFeedback)}
                            className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase shadow cursor-pointer"
                          >
                            Save Stage Transition
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slip Modal */}
              {slipModalApp && (
                <ApplicationSlipModal
                  application={slipModalApp}
                  onClose={() => setSlipModalApp(null)}
                />
              )}
            </div>
          )}

          {/* ========================================================
              TAB 8: PHOTOS & VIDEOS
             ======================================================== */}
          {activeTab === 'gallery' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    8. PHOTOS & VIDEOS GALLERY ({gallery.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload official constituency photographs or embed YouTube video broadcasts with authentic metadata and thumbnail previews.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResyncAllVideoThumbnails}
                    className="bg-white hover:bg-stone-100 text-[#103C2E] border border-stone-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer uppercase"
                    title="Resync YouTube Thumbnails"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>RESYNC THUMBNAILS</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingMedia(null);
                      setShowAddMedia(!showAddMedia);
                    }}
                    className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer uppercase"
                  >
                    <Plus className="w-4 h-4 text-[#C6A15B]" />
                    <span>{showAddMedia ? 'CLOSE FORM' : 'ADD MEDIA RECORD'}</span>
                  </button>
                </div>
              </div>

              {/* Media Form */}
              {showAddMedia && (
                <form onSubmit={editingMedia ? handleUpdateMedia : handleCreateMedia} className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-stone-200 space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <h4 className="font-bold text-[#103C2E] text-sm uppercase">
                      {editingMedia ? 'EDIT MEDIA RECORD' : 'ADD NEW MEDIA RECORD'}
                    </h4>
                    <div className="flex bg-stone-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewMedia({...newMedia, type: 'photo'})}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                          newMedia.type === 'photo' ? 'bg-[#103C2E] text-white' : 'text-stone-600'
                        }`}
                      >
                        Photograph
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewMedia({...newMedia, type: 'video'})}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                          newMedia.type === 'video' ? 'bg-[#103C2E] text-white' : 'text-stone-600'
                        }`}
                      >
                        YouTube Video
                      </button>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Media Caption / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Plenary Debate: Federal College of Agricultural Technology Bill"
                        value={newMedia.title}
                        onChange={(e) => setNewMedia({...newMedia, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Category *</label>
                      <select
                        value={newMedia.category}
                        onChange={(e) => setNewMedia({...newMedia, category: e.target.value as any})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                      >
                        <option value="National Assembly">National Assembly</option>
                        <option value="Projects">Projects</option>
                        <option value="Constituency Visits">Constituency Visits</option>
                        <option value="Empowerment">Empowerment</option>
                        <option value="Town Halls">Town Halls</option>
                        <option value="Interviews & Debates">Interviews & Debates</option>
                      </select>
                    </div>
                  </div>

                  {newMedia.type === 'photo' ? (
                    <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                      <label className="text-xs font-bold text-[#103C2E] block uppercase">Direct Image File or Link</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition">
                          <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                          <span>Select Image File</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <span className="text-[11px] text-stone-500">Max 8MB file size</span>
                      </div>
                      <input
                        type="url"
                        placeholder="Or enter Image URL"
                        value={newMedia.imageUrl}
                        onChange={(e) => {
                          setNewMedia({...newMedia, imageUrl: e.target.value});
                          setUploadedImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                      <label className="text-xs font-bold text-[#103C2E] block uppercase">YouTube Video Link or ID *</label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4 or youtu.be/ScMzIvxBSi4"
                        value={newMedia.videoUrl}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                      />
                      {isFetchingYtMeta && (
                        <div className="flex items-center gap-2 text-xs text-[#103C2E] bg-emerald-50 p-2 rounded-xl">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C6A15B]" />
                          <span>Querying YouTube API for verified title & authentic thumbnail...</span>
                        </div>
                      )}
                      {detectedYtThumb && (
                        <div className="flex items-center gap-3 pt-2">
                          <img src={detectedYtThumb} alt="YouTube Thumbnail Preview" className="w-24 h-16 rounded-xl object-cover border" />
                          <div className="text-xs">
                            <span className="font-bold text-emerald-800 block">Authentic YouTube Thumbnail Detected</span>
                            <span className="text-stone-500 text-[11px]">{detectedYtTitle || 'Video Ready'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMedia(false)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer shadow flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-[#C6A15B]" />
                      <span>{editingMedia ? 'UPDATE MEDIA RECORD' : 'SAVE MEDIA RECORD'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Gallery Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4 uppercase text-[11px] font-bold w-24">Thumbnail</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Caption & Title</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Type</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Category</th>
                        <th className="p-4 uppercase text-[11px] font-bold">Homepage Video</th>
                        <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {gallery.map(item => {
                        const isVid = item.type === 'video' || !!item.videoUrl;
                        const thumbUrl = resolveMediaThumbnail(item);
                        return (
                          <tr key={item.id} className="hover:bg-stone-50 transition">
                            <td className="p-3">
                              <div className="w-20 h-14 rounded-xl overflow-hidden bg-stone-900 relative border border-stone-300">
                                <img
                                  src={thumbUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = isVid
                                      ? 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg'
                                      : 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=200';
                                  }}
                                />
                                {isVid && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-bold text-[#103C2E]">
                              {item.title}
                              {item.youtubeTitle && item.youtubeTitle !== item.title && (
                                <p className="text-[11px] text-[#C6A15B] font-semibold mt-0.5">
                                  YT: {item.youtubeTitle}
                                </p>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                isVid ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                              }`}>
                                {isVid ? 'Video' : 'Photo'}
                              </span>
                            </td>
                            <td className="p-4 text-stone-600">{item.category}</td>
                            <td className="p-4">
                              {isVid ? (
                                item.showOnHomepage ? (
                                  <span className="px-2.5 py-1 bg-[#103C2E] text-[#D4AF37] border border-[#C6A15B]/40 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-sm">
                                    <Star className="w-3 h-3 fill-[#D4AF37]" />
                                    <span>Featured on Home</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSetHomepageFeaturedVideo(item.id)}
                                    className="px-3 py-1.5 bg-amber-50 hover:bg-[#D4AF37] text-amber-900 hover:text-[#09291F] rounded-xl text-xs font-bold border border-amber-300 transition-all shadow-xs cursor-pointer uppercase"
                                  >
                                    Set as Homepage Video
                                  </button>
                                )
                              ) : (
                                <span className="text-stone-400 text-xs">—</span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditMedia(item)}
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                                title="Edit Media"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(item.id)}
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                                title="Delete Media"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 9: ENQUIRIES
             ======================================================== */}
          {activeTab === 'enquiries' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                    9. CITIZEN ENQUIRIES & MESSAGES ({contacts.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Constituency messages, community petitions, project requests, and feedback submitted through the official portal.
                  </p>
                </div>
              </div>

              {/* Enquiries Search */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search enquiries by sender name, email, phone, or content..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <select
                    value={enquiryCategoryFilter}
                    onChange={(e) => setEnquiryCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Project Request">Project Request</option>
                    <option value="Constituency Intervention">Constituency Intervention</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Feedback / Commendation">Feedback / Commendation</option>
                  </select>
                </div>
              </div>

              {/* Enquiries Cards Grid */}
              <div className="space-y-4">
                {contacts
                  .filter(c => {
                    const matchesSearch = !enquirySearch || 
                      c.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                      c.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                      c.phone.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                      c.message.toLowerCase().includes(enquirySearch.toLowerCase());
                    const matchesCategory = enquiryCategoryFilter === 'ALL' || c.category === enquiryCategoryFilter;
                    return matchesSearch && matchesCategory;
                  })
                  .map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <strong className="text-base font-bold text-[#103C2E] block">{c.name}</strong>
                          <span className="text-xs text-stone-500 font-medium">{c.email} • {c.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#103C2E]/10 text-[#103C2E]">
                            {c.category}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">{c.date}</span>
                          <button
                            onClick={() => handleDeleteEnquiry(c.id)}
                            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                        "{c.message}"
                      </div>
                    </div>
                  ))}

                {contacts.length === 0 && (
                  <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center text-stone-500 text-xs">
                    No citizen enquiries received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 10: USER SETTINGS (MANAGEMENT & CONFIGURATION)
             ======================================================== */}
          {activeTab === 'settings' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                  10. USER SETTINGS & ENTERPRISE CONFIGURATION
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage authorized administrators, portal headline statistics, multilingual translations dictionary, and security controls.
                </p>
              </div>

              {/* Settings Sub-Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
                <button
                  onClick={() => setSettingsTab('users')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settingsTab === 'users' ? 'bg-[#103C2E] text-white shadow' : 'bg-white text-stone-700 border'
                  }`}
                >
                  Authorized Administrators ({adminUsers.length})
                </button>
                <button
                  onClick={() => setSettingsTab('stats')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settingsTab === 'stats' ? 'bg-[#103C2E] text-white shadow' : 'bg-white text-stone-700 border'
                  }`}
                >
                  Headline Statistics
                </button>
                <button
                  onClick={() => setSettingsTab('translations')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settingsTab === 'translations' ? 'bg-[#103C2E] text-white shadow' : 'bg-white text-stone-700 border'
                  }`}
                >
                  Multilingual Dictionary (RTL)
                </button>
                <button
                  onClick={() => setSettingsTab('security')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settingsTab === 'security' ? 'bg-[#103C2E] text-white shadow' : 'bg-white text-stone-700 border'
                  }`}
                >
                  Session & Security
                </button>
              </div>

              {/* Sub-Tab 1: Administrators */}
              {settingsTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-base text-[#103C2E] uppercase">Authorized Personnel Accounts</h4>
                      <p className="text-xs text-stone-500">Role-based access control for parliamentary assistants and directors.</p>
                    </div>
                    <button
                      onClick={() => setShowAddAdminModal(!showAddAdminModal)}
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" />
                      <span>{showAddAdminModal ? 'Close' : 'Add Admin'}</span>
                    </button>
                  </div>

                  {showAddAdminModal && (
                    <form onSubmit={handleCreateAdmin} className="bg-white p-6 rounded-3xl shadow-md border border-stone-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-sm uppercase">Create Administrator Account</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#103C2E] uppercase">Staff Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="staff@danmayeyabo.gov.ng"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#103C2E] uppercase">Assigned Role *</label>
                          <select
                            value={newAdminRole}
                            onChange={(e) => setNewAdminRole(e.target.value as any)}
                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                          >
                            <option value="Chief Administrator">Chief Administrator</option>
                            <option value="News Editor">News Editor</option>
                            <option value="Projects Manager">Projects Manager</option>
                            <option value="Content Manager">Content Manager</option>
                            <option value="Translation Manager">Translation Manager</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="bg-[#103C2E] text-white px-6 py-2 rounded-xl text-xs font-bold cursor-pointer uppercase shadow"
                        >
                          Save Admin Account
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#103C2E] text-white">
                            <th className="p-4 uppercase text-[11px] font-bold">Email</th>
                            <th className="p-4 uppercase text-[11px] font-bold">Role</th>
                            <th className="p-4 uppercase text-[11px] font-bold">Status</th>
                            <th className="p-4 uppercase text-[11px] font-bold">Permissions</th>
                            <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {adminUsers.map(usr => (
                            <tr key={usr.id} className="hover:bg-stone-50">
                              <td className="p-4 font-bold text-[#103C2E]">{usr.email}</td>
                              <td className="p-4 text-stone-700 font-medium">{usr.role}</td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleToggleAdminStatus(usr.id)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer ${
                                    usr.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {usr.status}
                                </button>
                              </td>
                              <td className="p-4 text-stone-500">{usr.permissions}</td>
                              <td className="p-4 text-right">
                                {usr.email !== 'admin@danmayeyabo.gov.ng' && (
                                  <button
                                    onClick={() => handleDeleteAdmin(usr.id)}
                                    className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                                    title="Revoke Admin"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Revoke</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Headline Statistics */}
              {settingsTab === 'stats' && (
                <form onSubmit={handleSaveStats} className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <h4 className="font-bold text-[#103C2E] text-base uppercase">Homepage Headline Counters</h4>
                      <p className="text-xs text-stone-500">Publicly verified metric counters displayed across the website hero and statistics section.</p>
                    </div>
                    {statsSavedMsg && (
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Saved Successfully!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Total Projects Count</label>
                      <input
                        type="text"
                        required
                        value={editableStats.projectsCount}
                        onChange={(e) => setEditableStats({...editableStats, projectsCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Bills & Motions</label>
                      <input
                        type="text"
                        required
                        value={editableStats.billsCount}
                        onChange={(e) => setEditableStats({...editableStats, billsCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Empowered Citizens</label>
                      <input
                        type="text"
                        required
                        value={editableStats.citizensCount}
                        onChange={(e) => setEditableStats({...editableStats, citizensCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">Constituency Wards</label>
                      <input
                        type="text"
                        required
                        value={editableStats.wardsCount}
                        onChange={(e) => setEditableStats({...editableStats, wardsCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase shadow cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-[#C6A15B]" />
                      <span>Save Statistics</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-Tab 3: Multilingual Dictionary */}
              {settingsTab === 'translations' && (
                <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-5">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <h4 className="font-bold text-[#103C2E] text-base uppercase">Multilingual Dictionary Editor</h4>
                      <p className="text-xs text-stone-500">Full translation coverage for English, Hausa, and Arabic with native RTL input.</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                      100% Complete
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {Object.entries(translations).map(([key, val]) => (
                      <div key={key} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        <span className="font-mono text-xs font-bold text-[#103C2E] truncate">{key}</span>
                        <div>
                          <label className="text-[10px] text-stone-400 block uppercase font-bold">English</label>
                          <input
                            type="text"
                            value={val.en}
                            onChange={(e) => {
                              const updated = { ...translations, [key]: { ...val, en: e.target.value } };
                              setTranslations(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-400 block uppercase font-bold">Hausa</label>
                          <input
                            type="text"
                            value={val.ha}
                            onChange={(e) => {
                              const updated = { ...translations, [key]: { ...val, ha: e.target.value } };
                              setTranslations(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-400 block uppercase font-bold">Arabic (RTL)</label>
                          <input
                            type="text"
                            dir="rtl"
                            value={val.ar}
                            onChange={(e) => {
                              const updated = { ...translations, [key]: { ...val, ar: e.target.value } };
                              setTranslations(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-serif"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Security & Session */}
              {settingsTab === 'security' && (
                <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-4">
                  <h4 className="font-bold text-[#103C2E] text-base uppercase">Session & Password Security</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Current Session User</span>
                      <strong className="text-[#103C2E] text-sm block">{email}</strong>
                      <span className="text-emerald-700 font-semibold">{adminRole} • Active</span>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Security Standard</span>
                      <strong className="text-[#103C2E] text-sm block">TLS / HTTPS • Local Storage Encrypted</strong>
                      <span className="text-stone-500 font-medium">Session valid for current browser window</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
};
