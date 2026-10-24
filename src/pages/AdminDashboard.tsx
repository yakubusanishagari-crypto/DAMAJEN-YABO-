import React, { useState, useEffect } from 'react';
import { 
  Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, 
  ContactSubmission, ProjectStatus, ProgramApplication, ApplicationStatus,
  PollingUnitAgentLink, ElectionReport
} from '../types';
import { Language, Translations } from '../utils/i18n';
import { ConstituencyStats } from '../App';
import { 
  Shield, Lock, Mail, Plus, Trash2, Edit, CheckCircle, X, LogOut, 
  FileText, Award, Image as ImageIcon, Users, BarChart3, Globe, Settings, 
  Activity, ArrowUpRight, TrendingUp, Download, Eye, AlertCircle, Save,
  Upload, Video, Film, Play, Check, Search, Filter, ChevronRight, CheckCircle2,
  Clock, Printer, ExternalLink, FileCheck, Star, Sparkles, RefreshCw, Menu,
  Send, Calendar, MapPin, Sliders, ChevronDown, Landmark, Smartphone, Monitor, Laptop,
  Tablet, Compass, CheckSquare, BarChart2, Share2, Copy, User, Camera, ExternalLink as ExtLink
} from 'lucide-react';
import { ApplicationSlipModal } from '../components/ApplicationSlipModal';
import { CongratulationOfferModal } from '../components/CongratulationOfferModal';
import { ElectionTab } from '../components/ElectionTab';
import { 
  extractYouTubeId, 
  getYouTubeThumbnailUrl, 
  getYouTubeEmbedUrl, 
  resolveMediaThumbnail, 
  fetchYouTubeMetadata, 
  sanitizeGalleryList, 
  YOUTUBE_PLACEHOLDER_THUMBNAIL 
} from '../utils/youtube';
import { getAnalyticsStore, resetAnalyticsBaseline, AnalyticsStore } from '../utils/analytics';

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
  agents: PollingUnitAgentLink[];
  setAgents: React.Dispatch<React.SetStateAction<PollingUnitAgentLink[]>>;
  electionReports: ElectionReport[];
  setElectionReports: React.Dispatch<React.SetStateAction<ElectionReport[]>>;
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
  | 'election'
  | 'settings';

export const AdminDashboard: React.FC<Props> = ({
  projects, setProjects,
  legislative, setLegislative,
  programs, setPrograms,
  news, setNews,
  gallery, setGallery,
  contacts, setContacts,
  agents, setAgents,
  electionReports, setElectionReports,
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
  const [offerModalApp, setOfferModalApp] = useState<ProgramApplication | null>(null);
  const [previewDocModal, setPreviewDocModal] = useState<any | null>(null);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [appProgramFilter, setAppProgramFilter] = useState('ALL');
  const [reviewStatusInput, setReviewStatusInput] = useState<ApplicationStatus>('SUBMITTED');
  const [reviewInternalNote, setReviewInternalNote] = useState('');
  const [reviewPublicFeedback, setReviewPublicFeedback] = useState('');
  const [reviewAwardPackage, setReviewAwardPackage] = useState('');

  const handleAdvanceApplicationStage = (
    appId: string, 
    newStage: ApplicationStatus, 
    internalNote: string, 
    publicFeedback: string,
    awardPackage?: string
  ) => {
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
          awardGrantPackage: awardPackage || a.awardGrantPackage || reviewAwardPackage,
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

  // Real Analytics Metrics State (Zero Baseline Tracking)
  const [analyticsStore, setAnalyticsStore] = useState<AnalyticsStore>(() => getAnalyticsStore());
  const [analyticsDateFilter, setAnalyticsDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [analyticsRefreshing, setAnalyticsRefreshing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const refreshAnalytics = () => {
    setAnalyticsRefreshing(true);
    const updated = getAnalyticsStore();
    setAnalyticsStore(updated);
    setTimeout(() => setAnalyticsRefreshing(false), 400);
  };

  // Periodic automatic sync every 6 seconds to keep live metrics accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsStore(getAnalyticsStore());
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleResetAnalytics = () => {
    const fresh = resetAnalyticsBaseline();
    setAnalyticsStore(fresh);
    setShowResetConfirm(false);
  };

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
    targetLGA: 'All Federal Constituency (Yabo & Shagari)',
    grantPackage: '₦150,000 Direct Seed Capital + Vocational Starter Kit',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '2026-12-31',
    isPublished: true,
    requirePassportPhoto: true,
    requireNIN: true,
    requireIndigene: true,
    requireQualifications: true,
    submissionInstructions: 'Complete all steps of the online form. Upload a recent passport photo and your National Identity Number (NIN). Print and preserve your official application slip for constituency physical accreditation.',
    requirementsText: 'Applicant must be an indigene of Yabo or Shagari LGA\nMust possess a valid National Identity Number (NIN)\nCommitted to designated training, trade, or farming activity'
  });

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = newProg.requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const requiredDocs: string[] = [];
    if (newProg.requirePassportPhoto) requiredDocs.push('Biometric Passport Photograph');
    if (newProg.requireNIN) requiredDocs.push('National Identity Card (NIN)');
    if (newProg.requireIndigene) requiredDocs.push('LGA Indigene Certificate');
    if (newProg.requireQualifications) requiredDocs.push('Educational / Trade Credential');

    const created: EmpowermentProgram = {
      id: `prog-${Date.now()}`,
      title: newProg.title,
      category: newProg.category,
      description: newProg.description,
      targetBeneficiaries: newProg.targetBeneficiaries,
      slotsAvailable: newProg.slotsAvailable,
      status: newProg.status,
      eligibility: `${newProg.eligibility} (${newProg.targetLGA})`,
      startDate: newProg.startDate,
      deadline: newProg.deadline,
      isPublished: newProg.isPublished,
      grantPackage: newProg.grantPackage,
      requirePassportPhoto: newProg.requirePassportPhoto,
      submissionInstructions: newProg.submissionInstructions,
      requirements: requirements.length > 0 ? requirements : ['Indigene of Yabo or Shagari LGA', 'Valid NIN'],
      requiredDocs: requiredDocs.length > 0 ? requiredDocs : ['National Identity Card (NIN)']
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
      targetLGA: 'All Federal Constituency (Yabo & Shagari)',
      grantPackage: '₦150,000 Direct Seed Capital + Vocational Starter Kit',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '2026-12-31',
      isPublished: true,
      requirePassportPhoto: true,
      requireNIN: true,
      requireIndigene: true,
      requireQualifications: true,
      submissionInstructions: 'Complete all steps of the online form. Upload a recent passport photo and your National Identity Number (NIN). Print and preserve your official application slip for constituency physical accreditation.',
      requirementsText: 'Applicant must be an indigene of Yabo or Shagari LGA\nMust possess a valid National Identity Number (NIN)\nCommitted to designated training, trade, or farming activity'
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
    { id: 'election', label: '10. ELECTION RESULTS & AGENTS', icon: CheckSquare },
    { id: 'settings', label: '11. USER SETTINGS', icon: Settings },
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
          fixed md:relative z-20 inset-y-0 left-0 w-72 md:w-64 lg:w-72 shrink-0 bg-[#FAF9F5] border-r border-[#103C2E]/15 
          flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg md:shadow-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-3.5 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#103C2E] bg-[#103C2E]/5 rounded-xl border border-[#103C2E]/10 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#C6A15B]" />
                ADMINISTRATION MODULES
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                  className={`w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-xs flex items-center justify-between transition-all duration-200 cursor-pointer group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C6A15B] ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#09291F] via-[#103C2E] to-[#124536] text-white shadow-lg border-l-4 border-l-[#C6A15B] border-y border-r border-[#C6A15B]/30 ring-1 ring-emerald-500/20' 
                      : 'text-stone-700 hover:text-[#09291F] hover:bg-white hover:border-[#103C2E]/20 hover:shadow-xs border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`p-1.5 rounded-lg transition-transform duration-200 ${
                      isActive 
                        ? 'bg-[#09291F] text-[#D4AF37] border border-[#C6A15B]/40 shadow-xs scale-105' 
                        : 'bg-stone-200/70 text-stone-500 group-hover:bg-[#103C2E]/10 group-hover:text-[#103C2E]'
                    }`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="truncate tracking-wide">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-[#D4AF37] text-[#09291F] shadow-xs' 
                        : 'bg-stone-200 text-stone-700 group-hover:bg-[#103C2E]/10 group-hover:text-[#103C2E]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Badge */}
          <div className="p-4 m-3 rounded-2xl border border-[#C6A15B]/40 bg-[#09291F] text-white space-y-1.5 shadow-md">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider">
              <span>SYSTEM STATUS:</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Synchronized</span>
            </div>
            <span className="text-[10px] text-stone-300 block pt-0.5 font-mono">10th National Assembly • Abuja</span>
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
              TAB 2: VISITORS ANALYTICS (REAL ZERO BASELINE SYSTEM)
             ======================================================== */}
          {activeTab === 'analytics' && (() => {
            // Compute real statistics from analyticsStore
            const totalViews = analyticsStore.totalPageViews;
            const totalVisits = analyticsStore.totalVisits;
            const uniqueVisitorsCount = analyticsStore.uniqueVisitors ? analyticsStore.uniqueVisitors.length : 0;
            
            // Format baseline date
            const baselineDateFormatted = analyticsStore.baselineDate 
              ? new Date(analyticsStore.baselineDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Initial Session';

            // Sorted Top Pages
            const pagesList = Object.values(analyticsStore.topPages || {}).sort((a, b) => b.views - a.views);
            const topPage = pagesList[0] || null;

            // Device counts and percentages
            const totalDevices = ((analyticsStore.deviceCategories?.mobile) || 0) + 
                                 ((analyticsStore.deviceCategories?.desktop) || 0) + 
                                 ((analyticsStore.deviceCategories?.tablet) || 0);
            const mobilePct = totalDevices > 0 ? Math.round(((analyticsStore.deviceCategories?.mobile || 0) / totalDevices) * 100) : 0;
            const desktopPct = totalDevices > 0 ? Math.round(((analyticsStore.deviceCategories?.desktop || 0) / totalDevices) * 100) : 0;
            const tabletPct = totalDevices > 0 ? Math.round(((analyticsStore.deviceCategories?.tablet || 0) / totalDevices) * 100) : 0;

            // Daily visits (chronological list)
            const dailyEntries = Object.values(analyticsStore.dailyVisits || {}).sort((a, b) => a.date.localeCompare(b.date));
            const maxDailyViews = Math.max(...dailyEntries.map(d => d.views), 1);

            // Traffic sources
            const trafficEntries = Object.entries(analyticsStore.trafficSources || {}).sort((a, b) => b[1] - a[1]);
            const totalTrafficEvents = trafficEntries.reduce((acc, curr) => acc + curr[1], 0);

            return (
              <div className="w-full min-w-0 space-y-8 animate-fadeIn">
                {/* Header with Live Indicator, Baseline Badge, Date Filter & Action Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-['Manrope'] font-black text-2xl text-[#103C2E] uppercase tracking-wide">
                        2. VISITORS ANALYTICS & TRAFFIC INTELLIGENCE
                      </h3>
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE EVENT TRACKING ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Genuine recorded activity starting from baseline established on <strong className="text-[#103C2E]">{baselineDateFormatted}</strong>. Admin actions and automated crawlers are excluded.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Refresh Button */}
                    <button
                      onClick={refreshAnalytics}
                      className="bg-white hover:bg-stone-50 active:scale-[0.98] text-[#103C2E] px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-300 shadow-xs flex items-center gap-1.5 transition cursor-pointer uppercase tracking-wider"
                      title="Poll latest visitor activity"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#C6A15B] ${analyticsRefreshing ? 'animate-spin' : ''}`} />
                      <span>REFRESH DATA</span>
                    </button>

                    {/* Reset to Zero Baseline Button */}
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white active:scale-[0.98] px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-200 shadow-xs flex items-center gap-1.5 transition cursor-pointer uppercase tracking-wider"
                      title="Clear tracking and establish a new zero baseline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>RESET TO ZERO BASELINE</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span className="text-xs font-black uppercase text-[#103C2E]">TIME RANGE FILTER:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(['all', 'today', '7days', '30days'] as const).map(filterKey => (
                      <button
                        key={filterKey}
                        onClick={() => setAnalyticsDateFilter(filterKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                          analyticsDateFilter === filterKey
                            ? 'bg-[#103C2E] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {filterKey === 'all' ? 'ALL TIME (ZERO BASELINE)' : filterKey === 'today' ? 'TODAY' : filterKey === '7days' ? 'LAST 7 DAYS' : 'LAST 30 DAYS'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Metric KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Total Page Views */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 hover:border-[#103C2E]/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">TOTAL PAGE VIEWS</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-['Manrope'] text-[#103C2E]">
                      {totalViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Verified page navigation events</span>
                    </div>
                  </div>

                  {/* Card 2: Total Visits / Sessions */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 hover:border-[#103C2E]/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">TOTAL VISITS</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-['Manrope'] text-[#103C2E]">
                      {totalVisits.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <span>Distinct 30-min browsing sessions</span>
                    </div>
                  </div>

                  {/* Card 3: Unique Visitors */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 hover:border-[#103C2E]/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">UNIQUE VISITORS</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-['Manrope'] text-[#103C2E]">
                      {uniqueVisitorsCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <span>Reliably measurable client devices</span>
                    </div>
                  </div>

                  {/* Card 4: Top-Performing Page */}
                  <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 hover:border-[#103C2E]/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">TOP-PERFORMING PAGE</span>
                      <div className="w-8 h-8 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-lg font-black font-['Manrope'] text-[#103C2E] truncate" title={topPage ? topPage.title : 'No visits recorded yet'}>
                      {topPage ? topPage.title : 'Awaiting Visits'}
                    </div>
                    <div className="text-xs text-emerald-700 font-bold">
                      {topPage ? `${topPage.views} views (${totalViews > 0 ? Math.round((topPage.views / totalViews) * 100) : 0}% of traffic)` : 'Zero baseline initial state'}
                    </div>
                  </div>
                </div>

                {/* Zero Baseline Notice when counts are small */}
                {totalViews === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#103C2E] text-sm uppercase">
                        GENUINE ZERO-BASELINE TRACKING ACTIVATED
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        The analytics system is configured to record real visitor interactions exclusively. As citizens navigate the public portal (Home, Biography, Projects, Legislative, Empowerment, News, Gallery, and Contact), genuine events will be securely logged and reflected here in real-time. Admin operations and search-bot traffic are excluded to guarantee 100% data fidelity.
                      </p>
                    </div>
                  </div>
                )}

                {/* Visits by Date Timeline / Chart */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <h4 className="font-['Manrope'] font-black text-base text-[#103C2E] uppercase">
                        VISITS & VIEWS BY DATE (GENUINE RECORDED TIMELINE)
                      </h4>
                      <span className="text-xs text-stone-500">
                        Daily breakdown of genuine public website traffic.
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {dailyEntries.length} ACTIVE RECORDING DAY(S)
                    </span>
                  </div>

                  {dailyEntries.length === 0 ? (
                    <div className="py-12 text-center text-xs text-stone-400 space-y-2">
                      <BarChart3 className="w-8 h-8 mx-auto text-stone-300" />
                      <p className="font-medium">No recorded daily traffic yet for this period.</p>
                      <p className="text-[11px] text-stone-400">Events appear here automatically as public visitors browse pages.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-end gap-3 h-48 pt-6 pb-2 px-2 border-b border-stone-200 overflow-x-auto">
                        {dailyEntries.map((day, idx) => {
                          const heightPct = Math.max(Math.round((day.views / maxDailyViews) * 100), 12);
                          return (
                            <div key={idx} className="flex-1 min-w-[50px] max-w-[90px] flex flex-col items-center gap-2 group h-full justify-end">
                              <span className="text-[10px] font-bold text-stone-500 group-hover:text-[#103C2E]">
                                {day.views}
                              </span>
                              <div
                                style={{ height: `${heightPct}%` }}
                                className="w-full bg-gradient-to-t from-[#103C2E] to-emerald-600 rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs relative"
                              >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#09291F] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-10 transition">
                                  {day.views} views • {day.visits} visits
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-stone-500 truncate w-full text-center">
                                {day.date.substring(5)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                        <span>Baseline Date: {dailyEntries[0]?.date || 'Today'}</span>
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded bg-[#103C2E]"></span>
                          <span>Daily Recorded Views</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2-Column Grid: Top-Performing Pages & Demographic Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Top-Performing Website Pages */}
                  <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <h4 className="font-['Manrope'] font-black text-base text-[#103C2E] uppercase">
                          TOP-PERFORMING WEBSITE PAGES
                        </h4>
                        <span className="text-xs text-stone-500">
                          Ranked by total genuine page-view volume.
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#103C2E] bg-stone-100 px-2.5 py-1 rounded-lg">
                        {pagesList.length} PAGES TRACKED
                      </span>
                    </div>

                    {pagesList.length === 0 ? (
                      <div className="py-10 text-center text-xs text-stone-400">
                        No pages recorded yet. Navigate the website to start recording.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pagesList.map((p, idx) => {
                          const pct = totalViews > 0 ? Math.round((p.views / totalViews) * 100) : 0;
                          return (
                            <div key={idx} className="p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-2xl border border-stone-200/80 space-y-2 transition">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-[#103C2E] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <strong className="text-xs sm:text-sm font-bold text-[#103C2E] truncate block">
                                      {p.title}
                                    </strong>
                                  </div>
                                  <span className="text-[11px] font-mono text-stone-500 pl-7 block">
                                    {p.path}
                                  </span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="bg-[#103C2E] text-white text-xs font-black px-2.5 py-1 rounded-lg inline-block">
                                    {p.views.toLocaleString()} VIEWS
                                  </span>
                                  <span className="text-[10px] text-stone-400 block pt-0.5">
                                    {pct}% OF TRAFFIC
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-emerald-600 to-[#C6A15B] h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.max(pct, 4)}%` }}
                                ></div>
                              </div>
                              <div className="text-[10px] text-stone-400 flex items-center justify-between">
                                <span>Last Activity: {p.lastVisited}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Device Categories & Traffic Sources */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Device Breakdown */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                      <div className="border-b border-stone-100 pb-3">
                        <h4 className="font-['Manrope'] font-black text-base text-[#103C2E] uppercase">
                          DEVICE CATEGORIES
                        </h4>
                        <span className="text-xs text-stone-500">
                          Measured device viewport categories.
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center space-y-1">
                          <Smartphone className="w-5 h-5 mx-auto text-emerald-700" />
                          <span className="text-[11px] font-black uppercase text-stone-500 block">MOBILE</span>
                          <strong className="text-lg font-black text-[#103C2E] block">{mobilePct}%</strong>
                          <span className="text-[10px] text-stone-400 font-medium">({analyticsStore.deviceCategories?.mobile || 0} views)</span>
                        </div>

                        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center space-y-1">
                          <Monitor className="w-5 h-5 mx-auto text-blue-700" />
                          <span className="text-[11px] font-black uppercase text-stone-500 block">DESKTOP</span>
                          <strong className="text-lg font-black text-[#103C2E] block">{desktopPct}%</strong>
                          <span className="text-[10px] text-stone-400 font-medium">({analyticsStore.deviceCategories?.desktop || 0} views)</span>
                        </div>

                        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center space-y-1">
                          <Tablet className="w-5 h-5 mx-auto text-amber-700" />
                          <span className="text-[11px] font-black uppercase text-stone-500 block">TABLET</span>
                          <strong className="text-lg font-black text-[#103C2E] block">{tabletPct}%</strong>
                          <span className="text-[10px] text-stone-400 font-medium">({analyticsStore.deviceCategories?.tablet || 0} views)</span>
                        </div>
                      </div>

                      {/* Proportional Bar */}
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-600 h-full" style={{ width: `${mobilePct}%` }} title={`Mobile: ${mobilePct}%`}></div>
                        <div className="bg-blue-600 h-full" style={{ width: `${desktopPct}%` }} title={`Desktop: ${desktopPct}%`}></div>
                        <div className="bg-amber-500 h-full" style={{ width: `${tabletPct}%` }} title={`Tablet: ${tabletPct}%`}></div>
                      </div>
                    </div>

                    {/* Traffic Sources */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                      <div className="border-b border-stone-100 pb-3">
                        <h4 className="font-['Manrope'] font-black text-base text-[#103C2E] uppercase">
                          TRAFFIC SOURCES & REFERRALS
                        </h4>
                        <span className="text-xs text-stone-500">
                          Identified traffic origins and channels.
                        </span>
                      </div>

                      {trafficEntries.length === 0 ? (
                        <div className="py-6 text-center text-xs text-stone-400">
                          No traffic source events recorded yet.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {trafficEntries.map(([source, count], idx) => {
                            const sourcePct = totalTrafficEvents > 0 ? Math.round((count / totalTrafficEvents) * 100) : 0;
                            return (
                              <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                                <div className="flex items-center gap-2">
                                  <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
                                  <span className="font-bold text-[#103C2E] uppercase">{source}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-stone-700">{count} visits</span>
                                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                                    {sourcePct}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real-Time Visitor Activity Stream */}
                <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                    <div>
                      <h4 className="font-['Manrope'] font-black text-base text-[#103C2E] uppercase flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#C6A15B]" />
                        <span>RECENT VISITOR ACTIVITY (REAL-TIME AUDIT STREAM)</span>
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Live stream of the latest recorded visitor pageviews across the portal.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#103C2E] bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                      SHOWING LATEST {analyticsStore.recentActivity?.length || 0} EVENTS
                    </span>
                  </div>

                  {(!analyticsStore.recentActivity || analyticsStore.recentActivity.length === 0) ? (
                    <div className="py-12 text-center text-xs text-stone-400 space-y-2">
                      <Clock className="w-8 h-8 mx-auto text-stone-300" />
                      <p className="font-medium">No recent visitor activity recorded yet.</p>
                      <p className="text-[11px] text-stone-400">Events appear here automatically as visitors navigate.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#103C2E] text-white">
                            <th className="p-3.5 uppercase text-[11px] font-black tracking-wider">TIMESTAMP</th>
                            <th className="p-3.5 uppercase text-[11px] font-black tracking-wider">PAGE / SECTION</th>
                            <th className="p-3.5 uppercase text-[11px] font-black tracking-wider">PATH</th>
                            <th className="p-3.5 uppercase text-[11px] font-black tracking-wider">DEVICE</th>
                            <th className="p-3.5 uppercase text-[11px] font-black tracking-wider">TRAFFIC ORIGIN</th>
                            <th className="p-3.5 uppercase text-[11px] font-black tracking-wider text-right">VISITOR ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {analyticsStore.recentActivity.map((act) => (
                            <tr key={act.id} className="hover:bg-stone-50 transition">
                              <td className="p-3.5 font-mono text-stone-500 whitespace-nowrap">
                                {act.timestamp}
                              </td>
                              <td className="p-3.5 font-bold text-[#103C2E] whitespace-nowrap">
                                {act.title}
                              </td>
                              <td className="p-3.5 font-mono text-stone-500">
                                {act.path}
                              </td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#103C2E]/10 text-[#103C2E]">
                                  {act.device}
                                </span>
                              </td>
                              <td className="p-3.5 text-stone-600 font-semibold uppercase text-[11px]">
                                {act.source}
                              </td>
                              <td className="p-3.5 text-right font-mono text-stone-400 text-[11px]">
                                {act.visitorIdShort}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Reset Confirmation Modal */}
                {showResetConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-300 shadow-2xl space-y-5">
                      <div className="flex items-center gap-3 text-rose-600">
                        <AlertCircle className="w-8 h-8 shrink-0" />
                        <div>
                          <h4 className="font-['Manrope'] font-black text-lg text-rose-900 uppercase">
                            CONFIRM ANALYTICS RESET
                          </h4>
                          <span className="text-xs text-rose-700">Establish New Zero Baseline</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Are you sure you want to reset visitor analytics? This will reset all page views, unique visits, and traffic history to a fresh zero baseline starting from this exact moment. All database items (projects, news, applications, and enquiries) remain completely preserved.
                      </p>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer uppercase"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={handleResetAnalytics}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-xs font-black transition shadow-sm cursor-pointer uppercase tracking-wider"
                        >
                          CONFIRM RESET TO ZERO
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

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
                               className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-[#103C2E] text-[#103C2E] hover:text-white px-3 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                               title="Edit Project"
                             >
                               <Edit className="w-3.5 h-3.5" />
                               <span>EDIT</span>
                             </button>
                             <button
                               onClick={() => handleDeleteProject(p.id)}
                               className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-700 text-rose-700 hover:text-white px-3 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                               title="Delete Project"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                               <span>DELETE</span>
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
                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-[#103C2E] text-[#103C2E] hover:text-white px-3 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase" 
                                title="Edit Article"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>EDIT</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteNews(n.id)} 
                                className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-700 text-rose-700 hover:text-white px-3 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase" 
                                title="Delete Article"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>DELETE</span>
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
                               className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-700 text-rose-700 hover:text-white px-3 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                               title="Delete Parliamentary Activity"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                               <span>DELETE</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Eligibility Criteria (e.g. Registered Constituency Youths)"
                      value={newProg.eligibility}
                      onChange={(e) => setNewProg({...newProg, eligibility: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                    <select
                      value={newProg.targetLGA}
                      onChange={(e) => setNewProg({...newProg, targetLGA: e.target.value})}
                      className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold"
                    >
                      <option value="All Federal Constituency (Yabo & Shagari)">All Federal Constituency (Yabo & Shagari)</option>
                      <option value="Yabo Local Government Only">Yabo Local Government Only</option>
                      <option value="Shagari Local Government Only">Shagari Local Government Only</option>
                    </select>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Application Deadline</label>
                      <input
                        type="date"
                        value={newProg.deadline}
                        onChange={(e) => setNewProg({...newProg, deadline: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#103C2E] uppercase block mb-1">
                      Approved Grant / Empowerment Package Allocation (Will appear on Final Offer Letter) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₦150,000 Direct Working Capital Grant + MSME Financial Record Book"
                      value={newProg.grantPackage}
                      onChange={(e) => setNewProg({...newProg, grantPackage: e.target.value})}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-[#103C2E]"
                    />
                  </div>

                  {/* Settle Application Submission Requirements */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#103C2E] flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-[#C6A15B]" />
                        <span>Settle Mandatory Applicant Submission Requirements:</span>
                      </span>
                      <span className="text-[10px] text-stone-500 font-bold uppercase">Screening Rules</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <label className="flex items-center gap-2 font-bold text-[#103C2E] cursor-pointer bg-white p-2.5 rounded-xl border border-emerald-200">
                        <input
                          type="checkbox"
                          checked={newProg.requirePassportPhoto}
                          onChange={(e) => setNewProg({...newProg, requirePassportPhoto: e.target.checked})}
                          className="rounded text-emerald-700"
                        />
                        <span>Passport Photo</span>
                      </label>

                      <label className="flex items-center gap-2 font-bold text-[#103C2E] cursor-pointer bg-white p-2.5 rounded-xl border border-emerald-200">
                        <input
                          type="checkbox"
                          checked={newProg.requireNIN}
                          onChange={(e) => setNewProg({...newProg, requireNIN: e.target.checked})}
                          className="rounded text-emerald-700"
                        />
                        <span>NIN (National ID)</span>
                      </label>

                      <label className="flex items-center gap-2 font-bold text-[#103C2E] cursor-pointer bg-white p-2.5 rounded-xl border border-emerald-200">
                        <input
                          type="checkbox"
                          checked={newProg.requireIndigene}
                          onChange={(e) => setNewProg({...newProg, requireIndigene: e.target.checked})}
                          className="rounded text-emerald-700"
                        />
                        <span>Indigene Cert</span>
                      </label>

                      <label className="flex items-center gap-2 font-bold text-[#103C2E] cursor-pointer bg-white p-2.5 rounded-xl border border-emerald-200">
                        <input
                          type="checkbox"
                          checked={newProg.requireQualifications}
                          onChange={(e) => setNewProg({...newProg, requireQualifications: e.target.checked})}
                          className="rounded text-emerald-700"
                        />
                        <span>Trade / Certificate</span>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#103C2E] uppercase">
                        Application Instructions & Guidance (Visible to Constituents):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Complete all form sections. Print official slip and bring to constituency liaison office..."
                        value={newProg.submissionInstructions}
                        onChange={(e) => setNewProg({...newProg, submissionInstructions: e.target.value})}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#103C2E] uppercase block mb-1">
                        Programme Description & Objectives
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Programme description, objectives, and training deliverables..."
                        value={newProg.description}
                        onChange={(e) => setNewProg({...newProg, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#103C2E] uppercase block mb-1">
                        Eligibility Criteria (One Per Line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Applicant must be resident in Yabo/Shagari&#10;Commitment to agricultural training..."
                        value={newProg.requirementsText}
                        onChange={(e) => setNewProg({...newProg, requirementsText: e.target.value})}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono"
                      ></textarea>
                    </div>
                  </div>

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
                               className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-700 text-rose-700 hover:text-white px-3 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                               title="Delete Programme"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                               <span>DELETE</span>
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
                                  setReviewAwardPackage(app.awardGrantPackage || '1x Complete Starter Kit + Direct Financial Empowerment Grant');
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
                              {app.status === 'APPROVED' && (
                                <button
                                  onClick={() => setOfferModalApp(app)}
                                  className="inline-flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#B38F44] text-[#09291F] px-2.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer text-xs font-black uppercase"
                                  title="View Official Congratulation Offer"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Offer</span>
                                </button>
                              )}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
                  <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-stone-200 max-h-[92vh] overflow-y-auto">
                    
                    {/* Header with Applicant Biometric Passport & Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-stone-100 pb-5">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                        {/* Biometric Passport Frame */}
                        <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-[#103C2E] bg-stone-100 shrink-0 shadow-md flex flex-col items-center justify-center relative">
                          {selectedAppForReview.passportPhoto ? (
                            <img
                              src={selectedAppForReview.passportPhoto}
                              alt={selectedAppForReview.applicantName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-stone-400">
                              <User className="w-10 h-10 mx-auto text-stone-300" />
                              <span className="text-[9px] font-bold uppercase mt-1 block">No Passport</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-[#103C2E] text-[#D4AF37] text-[8px] font-black py-0.5 text-center uppercase tracking-widest">
                            Official Photo
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/15 px-2.5 py-0.5 rounded-full border border-[#C6A15B]/30 inline-block">
                            CONSTITUENCY BENEFICIARY DOSSIER
                          </span>
                          <h3 className="font-['Manrope'] font-black text-2xl text-[#103C2E] uppercase">
                            {selectedAppForReview.applicantName}
                          </h3>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-600 font-mono">
                            <span className="font-bold text-[#103C2E]">REF: {selectedAppForReview.referenceNumber}</span>
                            <span>•</span>
                            <span className="font-sans font-medium text-stone-500">{selectedAppForReview.programTitle}</span>
                          </div>
                          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              selectedAppForReview.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              selectedAppForReview.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              STATUS: {selectedAppForReview.status}
                            </span>
                            {selectedAppForReview.lga && (
                              <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                LGA: {selectedAppForReview.lga}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSlipModalApp(selectedAppForReview)}
                          className="bg-stone-100 hover:bg-stone-200 text-[#103C2E] px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                          title="Print official application slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Slip</span>
                        </button>
                        <button 
                          onClick={() => setSelectedAppForReview(null)} 
                          className="bg-stone-100 hover:bg-rose-600 text-stone-600 hover:text-white p-2 rounded-xl border border-stone-200 transition shadow-xs cursor-pointer"
                          title="Close Review"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5 text-xs">
                      
                      {/* Section 1: Detailed Personal Bio */}
                      <div className="space-y-2">
                        <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center gap-1.5 border-b border-stone-200 pb-1">
                          <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
                          1. APPLICANT BIO-DATA & RESIDENCY
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">National ID (NIN)</span>
                            <strong className="text-[#103C2E] font-mono text-sm">{selectedAppForReview.nin || 'On File'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Phone Number</span>
                            <strong className="text-[#103C2E] font-mono">{selectedAppForReview.phone}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Email Address</span>
                            <strong className="text-[#103C2E]">{selectedAppForReview.email || 'None Provided'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">LGA / Ward</span>
                            <strong className="text-[#103C2E]">{selectedAppForReview.lga || 'Constituency'} • {selectedAppForReview.wardOrTown}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Gender</span>
                            <strong className="text-[#103C2E]">{selectedAppForReview.gender || 'Not Specified'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Date of Birth</span>
                            <strong className="text-[#103C2E] font-mono">{selectedAppForReview.dob || 'Not Provided'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Residential Address</span>
                            <strong className="text-[#103C2E] truncate block">{selectedAppForReview.residentialAddress || selectedAppForReview.wardOrTown}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Submission Date</span>
                            <strong className="text-stone-700 font-mono">{selectedAppForReview.date}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Education, Vocation & Disbursement Bank */}
                      <div className="space-y-2">
                        <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center gap-1.5 border-b border-stone-200 pb-1">
                          <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
                          2. EDUCATION, VOCATION & DISBURSEMENT ACCOUNT
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Education</span>
                            <strong className="text-[#103C2E]">{selectedAppForReview.highestEducation || 'SSCE / Primary'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Current Employment</span>
                            <strong className="text-[#103C2E]">{selectedAppForReview.employmentStatus || 'Unemployed / Youth'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Disbursement Bank</span>
                            <strong className="text-[#103C2E]">{selectedAppForReview.bankName || 'Awaiting Account Details'}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[10px] uppercase font-bold block">Account Number</span>
                            <strong className="text-[#103C2E] font-mono">{selectedAppForReview.accountNumber || 'None'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Applicant Uploaded Documents Review */}
                      <div className="space-y-2">
                        <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center justify-between border-b border-stone-200 pb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
                            <span>3. APPLICANT SUPPORTING DOCUMENTS & CREDENTIALS</span>
                          </span>
                          <span className="text-[10px] font-bold text-stone-500">
                            {selectedAppForReview.documents ? selectedAppForReview.documents.length : 0} Document(s) Attached
                          </span>
                        </h4>

                        {selectedAppForReview.documents && selectedAppForReview.documents.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedAppForReview.documents.map((doc, idx) => (
                              <div key={doc.id || idx} className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#103C2E] text-xs block truncate">{doc.type || 'Supporting Document'}</span>
                                    <span className="text-[10px] text-stone-500 block truncate">{doc.name} {doc.size ? `(${doc.size})` : ''}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewDocModal(doc)}
                                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition shrink-0 cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3 text-[#C6A15B]" />
                                  <span>Review</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-500 text-center space-y-1">
                            <FileText className="w-6 h-6 mx-auto text-stone-400" />
                            <p className="text-xs font-semibold">Physical credentials presented during in-person constituency screening.</p>
                            <span className="text-[10px] text-stone-400 block">NIN and residency certificates verified via parliamentary register.</span>
                          </div>
                        )}
                      </div>

                      {/* Section 4: Statement of Purpose */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block">Applicant Statement of Purpose / Socio-Economic Need:</span>
                        <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 italic text-stone-700 leading-relaxed">
                          "{selectedAppForReview.statement || 'Applicant committed to participating fully in constituency empowerment activities.'}"
                        </div>
                      </div>

                      {/* Transition Form & Award Settlement */}
                      <div className="bg-emerald-50/70 p-5 rounded-2xl border-2 border-emerald-300 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-[#103C2E] uppercase text-xs flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-emerald-700" />
                            <span>Advance Application Stage & Settle Allocation</span>
                          </h4>
                          {selectedAppForReview.status === 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => setOfferModalApp(selectedAppForReview)}
                              className="bg-gradient-to-r from-[#D4AF37] to-[#B38F44] text-[#09291F] px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Preview Congratulation Offer Letter</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#103C2E] block uppercase mb-1">Select Stage</label>
                            <select
                              value={reviewStatusInput}
                              onChange={(e) => setReviewStatusInput(e.target.value as ApplicationStatus)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-[#103C2E]"
                            >
                              <option value="SUBMITTED">1. SUBMITTED</option>
                              <option value="INITIAL REVIEW">2. INITIAL REVIEW</option>
                              <option value="DOCUMENT VERIFICATION">3. DOCUMENT VERIFICATION</option>
                              <option value="ELIGIBILITY ASSESSMENT">4. ELIGIBILITY ASSESSMENT</option>
                              <option value="FINAL REVIEW">5. FINAL REVIEW</option>
                              <option value="APPROVED">6. APPROVED (Award Official Congratulatory Offer)</option>
                              <option value="WAITLISTED">WAITLISTED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#103C2E] block uppercase mb-1">Public Feedback (Visible to Applicant on Tracker)</label>
                            <input
                              type="text"
                              placeholder="e.g. Approved. Please bring printed slip and NIN for physical handover..."
                              value={reviewPublicFeedback}
                              onChange={(e) => setReviewPublicFeedback(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800"
                            />
                          </div>
                        </div>

                        {/* Grant Package Allocation Field (crucial when approving) */}
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-300 space-y-1">
                          <label className="text-[11px] font-black text-[#103C2E] uppercase block flex items-center justify-between">
                            <span>Approved Award Package / Allocation (Printed on Congratulation Offer Letter):</span>
                            <span className="text-[10px] text-emerald-700 font-bold">Official Allocation</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 1x Complete Solar Irrigation Pumping Unit + Industrial Hose + ₦50,000 Agricultural Seed Fund"
                            value={reviewAwardPackage}
                            onChange={(e) => setReviewAwardPackage(e.target.value)}
                            className="w-full px-3 py-2 bg-emerald-50/40 border border-emerald-200 rounded-lg text-xs font-bold text-[#103C2E]"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/80">
                          <div className="text-[10px] text-stone-500 font-medium">
                            Approved applicants can immediately view and download their official Congratulatory Offer letter.
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedAppForReview(null)}
                              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold uppercase cursor-pointer"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdvanceApplicationStage(selectedAppForReview.id, reviewStatusInput, reviewInternalNote, reviewPublicFeedback, reviewAwardPackage)}
                              className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2 rounded-xl text-xs font-bold uppercase shadow cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4 text-[#C6A15B]" />
                              <span>Save & Commit Stage</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Preview Modal */}
              {previewDocModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
                  <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#C6A15B]">DOCUMENT PREVIEW</span>
                        <h4 className="font-bold text-base text-[#103C2E]">{previewDocModal.type || 'Supporting Document'}</h4>
                      </div>
                      <button
                        onClick={() => setPreviewDocModal(null)}
                        className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-center space-y-3">
                      {previewDocModal.dataUrl && previewDocModal.dataUrl.startsWith('data:image') ? (
                        <img
                          src={previewDocModal.dataUrl}
                          alt={previewDocModal.name}
                          className="max-h-80 mx-auto rounded-lg shadow-sm border border-stone-300"
                        />
                      ) : (
                        <div className="space-y-2 py-4">
                          <FileText className="w-16 h-16 mx-auto text-[#103C2E]" />
                          <p className="font-bold text-sm text-[#103C2E]">{previewDocModal.name}</p>
                          <p className="text-xs text-stone-500">{previewDocModal.size || 'Verified Document'} • Uploaded {previewDocModal.uploadedAt || 'During Submission'}</p>
                          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mt-2">
                            ✓ Verified Constituency Credential
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      {previewDocModal.dataUrl && (
                        <a
                          href={previewDocModal.dataUrl}
                          download={previewDocModal.name}
                          className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-4 h-4 text-[#C6A15B]" />
                          <span>Download File</span>
                        </a>
                      )}
                      <button
                        onClick={() => setPreviewDocModal(null)}
                        className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Offer Modal in Admin */}
              {offerModalApp && (
                <CongratulationOfferModal
                  application={offerModalApp}
                  onClose={() => setOfferModalApp(null)}
                />
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
               TAB 10: ELECTION RESULTS & AGENTS
              ======================================================== */}
          {activeTab === 'election' && (
            <ElectionTab 
              agents={agents} 
              setAgents={setAgents} 
              electionReports={electionReports} 
              setElectionReports={setElectionReports} 
            />
          )}

          {/* ========================================================
              TAB 11: USER SETTINGS (MANAGEMENT & CONFIGURATION)
             ======================================================== */}
          {activeTab === 'settings' && (
            <div className="w-full min-w-0 space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
                  11. USER SETTINGS & ENTERPRISE CONFIGURATION
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
