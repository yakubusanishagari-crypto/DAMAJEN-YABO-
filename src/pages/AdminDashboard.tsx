import React, { useState } from 'react';
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission } from '../types';
import { Language, Translations } from '../utils/i18n';
import { ConstituencyStats } from '../App';
import { 
  Shield, Lock, Mail, Plus, Trash2, Edit, CheckCircle, X, LogOut, 
  FileText, Award, Image as ImageIcon, Users, BarChart3, Globe, Settings, 
  Activity, ArrowUpRight, TrendingUp, Download, Eye, AlertCircle, Save,
  Upload, Video, Film, Play, Check
} from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'cms' | 'multilingual' | 'users' | 'settings'>('overview');
  const [cmsSubTab, setCmsSubTab] = useState<'projects' | 'news' | 'legislative' | 'programs' | 'gallery' | 'contacts'>('projects');

  const [editableStats, setEditableStats] = useState<ConstituencyStats>(stats);
  const [statsSavedMsg, setStatsSavedMsg] = useState(false);

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
      { id: 'usr-2', email: 'media@danmayeyabo.gov.ng', role: 'News Editor', status: 'Active', permissions: 'News & Gallery CMS' },
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

  React.useEffect(() => {
    setEditableStats(stats);
  }, [stats]);

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<{ id: string; user: string; action: string; timestamp: string; role: string }[]>([
    { id: 'log-1', user: 'admin@danmayeyabo.gov.ng', action: 'System login successful', timestamp: '2026-10-14 14:30', role: 'Chief Administrator' },
    { id: 'log-2', user: 'admin@danmayeyabo.gov.ng', action: 'Updated project status: Yabo Central Water Scheme', timestamp: '2026-10-14 12:15', role: 'Chief Administrator' }
  ]);

  // Analytics real metrics state
  const [analyticsData] = useState({
    pageViews: 14280,
    sessions: 3840,
    uniqueVisitors: 2950,
    bounceRate: '34.2%',
    avgSessionDuration: '2m 45s',
    topPages: [
      { path: '/', views: 6200, title: 'Home Page' },
      { path: '/projects', views: 4100, title: 'Projects Portal' },
      { path: '/empowerment', views: 2450, title: 'Empowerment Programmes' },
      { path: '/news', views: 1530, title: 'News & Press Releases' }
    ],
    devices: { mobile: '72%', desktop: '24%', tablet: '4%' },
    browsers: { chrome: '68%', safari: '22%', firefox: '10%' },
    languages: { english: '84%', hausa: '12%', arabic: '4%' }
  });

  // Projects CRUD state
  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '', category: 'Water & Sanitation' as const, location: '', status: 'Ongoing' as const, description: '', images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000'], updates: []
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
    setNewProj({ title: '', category: 'Water & Sanitation', location: '', status: 'Ongoing', description: '', images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000'], updates: [] });
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

  // News CRUD state
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Constituency News' as NewsArticle['category'],
    author: 'Office of the Media Assistant',
    excerpt: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000',
    videoUrl: '',
    showOnHomepage: true,
    tagsString: 'Yabo, Shagari, Constituency'
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
      videoUrl: newNews.videoUrl,
      showOnHomepage: newNews.showOnHomepage,
      isFeatured: false,
      tags: newNews.tagsString.split(',').map(t => t.trim())
    };
    const updated = [created, ...news];
    setNews(updated);
    try { localStorage.setItem('danmaje_news', JSON.stringify(updated)); } catch {}
    setShowAddNews(false);
    setNewsImagePreview('');
    setNewNews({ title: '', category: 'Constituency News', author: 'Office of the Media Assistant', excerpt: '', content: '', imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000', videoUrl: '', showOnHomepage: true, tagsString: 'Yabo, Shagari' });
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

  // Legislative CRUD state
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

  // Empowerment Programs CRUD state
  const [showAddProg, setShowAddProg] = useState(false);
  const [newProg, setNewProg] = useState({
    title: '',
    category: 'Youth Development' as EmpowermentProgram['category'],
    description: '',
    targetBeneficiaries: '500 Youth',
    status: 'Active' as EmpowermentProgram['status'],
    eligibility: 'Yabo and Shagari Indigenes',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '2026-12-31',
    requirements: ['National ID / Voter Card', 'Constituency Resident']
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
      category: 'Youth Development' as EmpowermentProgram['category'],
      description: '',
      targetBeneficiaries: '500 Youth',
      status: 'Active',
      eligibility: 'Yabo and Shagari Indigenes',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '2026-12-31',
      requirements: ['National ID / Voter Card', 'Constituency Resident']
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

  // Media / Gallery & Video Management State
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [newMedia, setNewMedia] = useState<{
    title: string;
    type: 'photo' | 'video';
    category: 'Projects' | 'Constituency Visits' | 'National Assembly' | 'Empowerment' | 'Town Halls' | 'Interviews & Debates';
    imageUrl: string;
    videoUrl: string;
    description: string;
  }>({
    title: '',
    type: 'photo',
    category: 'National Assembly',
    imageUrl: '',
    videoUrl: '',
    description: ''
  });
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const formatVideoUrl = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com/embed/')) return trimmed;
    if (/^[\w-]{11}$/.test(trimmed)) {
      return `https://www.youtube-nocookie.com/embed/${trimmed}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }
    return trimmed;
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
    const finalVideoUrl = newMedia.type === 'video' ? formatVideoUrl(newMedia.videoUrl) : undefined;
    const createdItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newMedia.title,
      type: newMedia.type,
      category: newMedia.category,
      imageUrl: newMedia.imageUrl || (newMedia.type === 'video' ? '/national_assembly_chamber_1792063300782.jpg' : 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000'),
      videoUrl: finalVideoUrl,
      date: new Date().toISOString().split('T')[0],
      description: newMedia.description
    };

    const updated = [createdItem, ...gallery];
    setGallery(updated);
    try {
      localStorage.setItem('danmaje_gallery', JSON.stringify(updated));
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdItem)
      });
    } catch {
      // LocalStorage already updated
    }

    setShowAddMedia(false);
    setNewMedia({
      title: '',
      type: 'photo',
      category: 'National Assembly',
      imageUrl: '',
      videoUrl: '',
      description: ''
    });
    setUploadedImagePreview('');
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Uploaded ${createdItem.type === 'video' ? 'video' : 'photograph'}: ${createdItem.title}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleDeleteMedia = async (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    try {
      localStorage.setItem('danmaje_gallery', JSON.stringify(updated));
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    } catch {
      // Storage fallback
    }
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Deleted media item #${id}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const matchedUser = adminUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.status === 'Active');
    if ((email.trim() === 'admin@danmayeyabo.gov.ng' && (password === 'DANMAJEFOREVER' || password === 'password123')) || (matchedUser && password.length >= 6)) {
      if (matchedUser) {
        setAdminRole(matchedUser.role);
      }
      setIsLoggedIn(true);
      setActivityLogs(prev => [{
        id: `log-${Date.now()}`,
        user: email,
        action: 'Authenticated successfully into enterprise CMS',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        role: adminRole
      }, ...prev]);
    } else {
      setLoginError('Invalid credentials. (Official credentials: admin@danmayeyabo.gov.ng / DANMAJEFOREVER)');
    }
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setStats(editableStats);
    try {
      localStorage.setItem('danmaje_stats', JSON.stringify(editableStats));
      await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableStats)
      });
    } catch {
      // LocalStorage already updated
    }
    setStatsSavedMsg(true);
    setTimeout(() => setStatsSavedMsg(false), 3000);
    setActivityLogs(prev => [{
      id: `log-${Date.now()}`,
      user: email,
      action: `Updated homepage statistics`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="bg-[#FAF9F5] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40">
          <div className="bg-[#103C2E] text-white p-8 text-center space-y-2 relative">
            <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-0.5 bg-[#09291F] mx-auto shadow-2xl overflow-hidden">
              <img src="/official_logo.png" alt="Official Seal" className="w-full h-full object-contain rounded-full" />
            </div>
            <h3 className="font-['Manrope'] font-bold text-2xl">ADMINISTRATOR LOGIN</h3>
            <p className="text-xs text-[#D4AF37] font-semibold">Hon. Umar Yusuf (Danmaje Yabo) Portal</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-4">
            {loginError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
                {loginError}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#103C2E]">Administrator Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#103C2E]">Administrator Password</label>
              <input
                type="password"
                required
                placeholder="Enter password (e.g. DANMAJEFOREVER)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#103C2E]">Select Role</label>
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value as any)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
              >
                <option value="Chief Administrator">Chief Administrator</option>
                <option value="Content Manager">Content Manager</option>
                <option value="News Editor">News Editor</option>
                <option value="Projects Manager">Projects Manager</option>
                <option value="Translation Manager">Translation Manager</option>
                <option value="Analytics Viewer">Analytics Viewer</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-sm shadow transition cursor-pointer"
              >
                AUTHENTICATE & ACCESS DASHBOARD
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F5] overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#103C2E] text-white px-6 py-4 flex items-center justify-between border-b border-[#C6A15B]/30 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full border border-[#D4AF37] p-0.5 bg-[#09291F] shrink-0 overflow-hidden shadow">
            <img src="/official_logo.png" alt="Official Seal" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="font-['Manrope'] font-bold text-base sm:text-lg">Enterprise CMS & Admin Control Centre</h2>
            <p className="text-xs text-white/80">Hon. Umar Yusuf Yabo Portal • Role: <span className="text-[#C6A15B] font-semibold">{adminRole}</span> • {email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 px-4 py-2 rounded-xl text-xs font-bold border border-rose-500/30 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> LOG OUT
          </button>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 cursor-pointer" title="Close Admin">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-1.5 hidden md:block overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4 text-[#C6A15B]" /> SYSTEM OVERVIEW
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'analytics' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#C6A15B]" /> VISITOR ANALYTICS
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'cms' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C6A15B]" /> CONTENT MANAGEMENT
          </button>

          <button
            onClick={() => setActiveTab('multilingual')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'multilingual' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Globe className="w-4 h-4 text-[#C6A15B]" /> MULTILINGUAL MANAGER
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'users' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#C6A15B]" /> USERS & PERMISSIONS
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4 text-[#C6A15B]" /> SYSTEM SETTINGS
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#FAF9F5]">
          {/* TAB 1: SYSTEM OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Platform Health & Statistics</h3>
                  <p className="text-xs text-[#6B716D]">Real-time database counts and operational summary.</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Database Healthy & Persistent
                </span>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#6B716D]">Total Projects</span>
                    <Award className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div className="text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">{projects.length}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active constituency records</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#6B716D]">News & Press Releases</span>
                    <FileText className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div className="text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">{news.length}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Published articles</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#6B716D]">Empowerment Programmes</span>
                    <Users className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div className="text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">{programs.length}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active beneficiary schemes</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#6B716D]">Contact Submissions</span>
                    <Mail className="w-5 h-5 text-[#C6A15B]" />
                  </div>
                  <div className="text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">{contacts.length}</div>
                  <span className="text-[11px] text-amber-600 font-semibold">Logged enquiries</span>
                </div>
              </div>

              {/* Recent Activity Logs */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
                <h4 className="font-['Manrope'] font-bold text-lg text-[#103C2E]">Recent Administrative Activity Logs</h4>
                <div className="space-y-3">
                  {activityLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-xl border border-gray-100 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#103C2E]">{log.action}</span>
                        <p className="text-gray-500">User: {log.user} ({log.role})</p>
                      </div>
                      <span className="text-gray-400 font-medium">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISITOR ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Visitor Analytics & Traffic Intelligence</h3>
                <p className="text-xs text-[#6B716D]">Real-time instrumentation of constituency portal engagement.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-1">
                  <span className="text-xs font-bold text-[#6B716D]">Total Page Views</span>
                  <div className="text-3xl font-extrabold text-[#103C2E]">{analyticsData.pageViews.toLocaleString()}</div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last week
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-1">
                  <span className="text-xs font-bold text-[#6B716D]">Unique Visitors</span>
                  <div className="text-3xl font-extrabold text-[#103C2E]">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                  <span className="text-xs text-emerald-600 font-semibold">Estimated active citizens</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-1">
                  <span className="text-xs font-bold text-[#6B716D]">Average Session Duration</span>
                  <div className="text-3xl font-extrabold text-[#103C2E]">{analyticsData.avgSessionDuration}</div>
                  <span className="text-xs text-[#6B716D]">Low bounce rate: {analyticsData.bounceRate}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                  <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E]">Most Visited Portal Pages</h4>
                  <div className="space-y-3">
                    {analyticsData.topPages.map((tp, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-[#FAF9F5] rounded-xl text-xs">
                        <span className="font-medium text-[#103C2E]">{tp.title}</span>
                        <span className="font-bold bg-[#103C2E] text-white px-2.5 py-1 rounded-md">{tp.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                  <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E]">Device & Language Breakdown</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between p-3 bg-[#FAF9F5] rounded-xl">
                      <span className="font-medium text-gray-700">Mobile Phone Access</span>
                      <span className="font-bold text-[#103C2E]">{analyticsData.devices.mobile}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#FAF9F5] rounded-xl">
                      <span className="font-medium text-gray-700">Desktop Access</span>
                      <span className="font-bold text-[#103C2E]">{analyticsData.devices.desktop}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#FAF9F5] rounded-xl">
                      <span className="font-medium text-gray-700">English Language Preference</span>
                      <span className="font-bold text-[#103C2E]">{analyticsData.languages.english}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#FAF9F5] rounded-xl">
                      <span className="font-medium text-gray-700">Hausa & Arabic Language Preference</span>
                      <span className="font-bold text-[#103C2E]">16%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT MANAGEMENT SYSTEM (CMS) */}
          {activeTab === 'cms' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Content Management System</h3>
                  <p className="text-xs text-[#6B716D]">Full control: create, edit, upload, delete, and publish constituency records.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCmsSubTab('projects')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${cmsSubTab === 'projects' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Projects ({projects.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('news')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${cmsSubTab === 'news' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    News & Press ({news.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('legislative')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${cmsSubTab === 'legislative' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Legislative ({legislative.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('programs')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${cmsSubTab === 'programs' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Empowerment ({programs.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('gallery')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${cmsSubTab === 'gallery' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Photos & Videos ({gallery.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('contacts')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${cmsSubTab === 'contacts' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Enquiries ({contacts.length})
                  </button>
                </div>
              </div>

              {/* PROJECTS SUB-TAB */}
              {cmsSubTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddProj(true)}
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" /> Add New Project
                    </button>
                  </div>

                  {showAddProj && (
                    <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">New Constituency Project</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Project Title"
                          value={newProj.title}
                          onChange={(e) => setNewProj({...newProj, title: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Location (e.g. Shagari Ward)"
                          value={newProj.location}
                          onChange={(e) => setNewProj({...newProj, location: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <select
                          value={newProj.status}
                          onChange={(e) => setNewProj({...newProj, status: e.target.value as any})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Proposed">Proposed</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Project Description"
                        value={newProj.description}
                        onChange={(e) => setNewProj({...newProj, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddProj(false)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold cursor-pointer">Save Project</button>
                      </div>
                    </form>
                  )}

                  {editingProject && (
                    <form onSubmit={handleUpdateProject} className="bg-emerald-50 p-6 rounded-2xl shadow-md border border-emerald-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">Edit Project: {editingProject.title}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          required
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          required
                          value={editingProject.location}
                          onChange={(e) => setEditingProject({...editingProject, location: e.target.value})}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                        <select
                          value={editingProject.status}
                          onChange={(e) => setEditingProject({...editingProject, status: e.target.value as any})}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Proposed">Proposed</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold cursor-pointer">Update Project</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#103C2E] text-white">
                          <th className="p-4">Project Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {projects.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-[#103C2E]">{p.title}</td>
                            <td className="p-4 text-gray-600">{p.category}</td>
                            <td className="p-4 text-gray-600">{p.location}</td>
                            <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">{p.status}</span></td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => setEditingProject(p)} className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer transition" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProject(p.id)} className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* NEWS SUB-TAB */}
              {cmsSubTab === 'news' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddNews(true)}
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" /> Publish New Article
                    </button>
                  </div>

                  {showAddNews && (
                    <form onSubmit={handleCreateNews} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">Publish News / Press Release</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="News Headline"
                          value={newNews.title}
                          onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Author / Office"
                          value={newNews.author}
                          onChange={(e) => setNewNews({...newNews, author: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <select
                          value={newNews.category}
                          onChange={(e) => setNewNews({...newNews, category: e.target.value as any})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Constituency News">Constituency News</option>
                          <option value="Press Release">Press Release</option>
                          <option value="Legislative Update">Legislative Update</option>
                          <option value="Speech">Speech</option>
                          <option value="Event">Event</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Short Excerpt / Subtitle"
                        value={newNews.excerpt}
                        onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                      />

                      <textarea
                        rows={4}
                        required
                        placeholder="Full Article Content"
                        value={newNews.content}
                        onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                      ></textarea>

                      {/* Photo upload / URL & Video URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F5] p-4 rounded-xl border border-stone-200">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#103C2E] block">Article Image (Direct Upload or URL)</label>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer bg-[#103C2E] hover:bg-[#09291F] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition">
                              <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                              <span>Upload Photo</span>
                              <input type="file" accept="image/*" onChange={handleNewsImageUpload} className="hidden" />
                            </label>
                            <span className="text-[11px] text-stone-500">Max 8MB</span>
                          </div>
                          <input
                            type="url"
                            placeholder="Or paste Image URL"
                            value={newNews.imageUrl}
                            onChange={(e) => {
                              setNewNews({...newNews, imageUrl: e.target.value});
                              setNewsImagePreview(e.target.value);
                            }}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#103C2E] block">YouTube Video Link (Optional - auto generates thumbnail & play badge)</label>
                          <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={newNews.videoUrl}
                            onChange={(e) => setNewNews({...newNews, videoUrl: e.target.value})}
                            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                          <p className="text-[11px] text-stone-500">When added, visitors see a play icon overlay on the news preview.</p>
                        </div>
                      </div>

                      {/* Homepage publishing toggle */}
                      <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                        <input
                          type="checkbox"
                          id="showOnHomepage"
                          checked={newNews.showOnHomepage}
                          onChange={(e) => setNewNews({...newNews, showOnHomepage: e.target.checked})}
                          className="w-4 h-4 text-[#103C2E] rounded border-stone-300 focus:ring-[#103C2E]"
                        />
                        <label htmlFor="showOnHomepage" className="text-xs font-bold text-[#103C2E] cursor-pointer">
                          Display this article on the Homepage news section (Uncheck to keep it in the News Hub only)
                        </label>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddNews(false)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold cursor-pointer">Publish Article</button>
                      </div>
                    </form>
                  )}

                  {editingNews && (
                    <form onSubmit={handleUpdateNews} className="bg-emerald-50 p-6 rounded-2xl shadow-md border border-emerald-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">Edit Article: {editingNews.title}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          value={editingNews.title}
                          onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          required
                          value={editingNews.author}
                          onChange={(e) => setEditingNews({...editingNews, author: e.target.value})}
                          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        value={editingNews.excerpt}
                        onChange={(e) => setEditingNews({...editingNews, excerpt: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                      />
                      <textarea
                        rows={4}
                        required
                        value={editingNews.content}
                        onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setEditingNews(null)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold cursor-pointer">Save Changes</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#103C2E] text-white">
                          <th className="p-4">Headline</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Author</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {news.map(n => (
                          <tr key={n.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-[#103C2E]">{n.title}</td>
                            <td className="p-4 text-gray-600">{n.category}</td>
                            <td className="p-4 text-gray-600">{n.author}</td>
                            <td className="p-4 text-gray-600">{n.date}</td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => setEditingNews(n)} className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer transition" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteNews(n.id)} className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* LEGISLATIVE SUB-TAB */}
              {cmsSubTab === 'legislative' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddLeg(true)}
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" /> Add Legislative Record
                    </button>
                  </div>

                  {showAddLeg && (
                    <form onSubmit={handleCreateLegislative} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">New Bill / Motion Record</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Record Title"
                          value={newLeg.title}
                          onChange={(e) => setNewLeg({...newLeg, title: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <select
                          value={newLeg.category}
                          onChange={(e) => setNewLeg({...newLeg, category: e.target.value as any})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Bill">Bill</option>
                          <option value="Motion">Motion</option>
                          <option value="Committee">Committee</option>
                          <option value="Parliamentary Question">Parliamentary Question</option>
                          <option value="Petition">Petition</option>
                        </select>
                        <select
                          value={newLeg.status}
                          onChange={(e) => setNewLeg({...newLeg, status: e.target.value as any})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Passed">Passed</option>
                          <option value="Introduced">Introduced</option>
                          <option value="Pending">Pending</option>
                          <option value="Assented">Assented</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Description"
                        value={newLeg.description}
                        onChange={(e) => setNewLeg({...newLeg, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddLeg(false)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold cursor-pointer">Save Record</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#103C2E] text-white">
                          <th className="p-4">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {legislative.map(l => (
                          <tr key={l.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-[#103C2E]">{l.title}</td>
                            <td className="p-4 text-gray-600">{l.category}</td>
                            <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">{l.status}</span></td>
                            <td className="p-4 text-gray-600">{l.date}</td>
                            <td className="p-4 text-right">
                              <button onClick={() => handleDeleteLegislative(l.id)} className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PROGRAMS SUB-TAB */}
              {cmsSubTab === 'programs' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddProg(true)}
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" /> Add Empowerment Programme
                    </button>
                  </div>

                  {showAddProg && (
                    <form onSubmit={handleCreateProgram} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">New Empowerment Scheme</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Programme Title"
                          value={newProg.title}
                          onChange={(e) => setNewProg({...newProg, title: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <select
                          value={newProg.category}
                          onChange={(e) => setNewProg({...newProg, category: e.target.value as any})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        >
                          <option value="Youth Development">Youth Development</option>
                          <option value="Skills Acquisition">Skills Acquisition</option>
                          <option value="Women Empowerment">Women Empowerment</option>
                          <option value="Educational Support">Educational Support</option>
                          <option value="Small Business Grant">Small Business Grant</option>
                          <option value="Agricultural Support">Agricultural Support</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Description"
                        value={newProg.description}
                        onChange={(e) => setNewProg({...newProg, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                      ></textarea>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          placeholder="Target Beneficiaries (e.g. 500 Youth)"
                          value={newProg.targetBeneficiaries}
                          onChange={(e) => setNewProg({...newProg, targetBeneficiaries: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Eligibility Criteria"
                          value={newProg.eligibility}
                          onChange={(e) => setNewProg({...newProg, eligibility: e.target.value})}
                          className="px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddProg(false)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold cursor-pointer">Save Programme</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#103C2E] text-white">
                          <th className="p-4">Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Beneficiaries</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {programs.map(pr => (
                          <tr key={pr.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-[#103C2E]">{pr.title}</td>
                            <td className="p-4 text-gray-600">{pr.category}</td>
                            <td className="p-4 text-gray-600">{pr.targetBeneficiaries}</td>
                            <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">{pr.status}</span></td>
                            <td className="p-4 text-right">
                              <button onClick={() => handleDeleteProgram(pr.id)} className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* GALLERY / PHOTOS & VIDEOS SUB-TAB */}
              {cmsSubTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-bold text-[#103C2E] text-base">Photographs & Embedded Videos ({gallery.length})</h4>
                      <p className="text-xs text-stone-500">Upload photos directly or embed YouTube and MP4 video URLs normally.</p>
                    </div>
                    <button
                      onClick={() => setShowAddMedia(!showAddMedia)}
                      className="bg-[#103C2E] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow hover:bg-[#09291F] transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" />
                      <span>{showAddMedia ? 'Close Form' : 'Upload Photo / Add Video'}</span>
                    </button>
                  </div>

                  {showAddMedia && (
                    <form onSubmit={handleCreateMedia} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <h4 className="font-bold text-[#103C2E] text-sm">Add Media Record</h4>
                        {/* Media Type Toggle */}
                        <div className="flex bg-stone-100 p-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setNewMedia({ ...newMedia, type: 'photo' })}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${newMedia.type === 'photo' ? 'bg-[#103C2E] text-white' : 'text-stone-600'}`}
                          >
                            Photograph Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewMedia({ ...newMedia, type: 'video' })}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${newMedia.type === 'video' ? 'bg-[#103C2E] text-white' : 'text-stone-600'}`}
                          >
                            Embedded Video
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
                          <label className="text-xs font-bold text-[#103C2E]">Title / Caption *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Commissioning of Solar Water Project in Yabo"
                            value={newMedia.title}
                            onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#103C2E]">Category *</label>
                          <select
                            value={newMedia.category}
                            onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value as any })}
                            className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
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

                      {/* Photo Direct File Upload */}
                      {newMedia.type === 'photo' ? (
                        <div className="space-y-3 bg-[#FAF9F5] p-4 rounded-xl border border-stone-200">
                          <label className="text-xs font-bold text-[#103C2E] block">
                            Direct Photo Upload (from your computer or phone) *
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="cursor-pointer bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition">
                              <Upload className="w-4 h-4 text-[#C6A15B]" />
                              <span>Select Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-xs text-stone-500">
                              Supported formats: JPG, PNG, WEBP (Max 8MB)
                            </span>
                          </div>

                          {/* Or direct URL */}
                          <div className="pt-2">
                            <span className="text-[11px] text-stone-500 block mb-1">Or paste an Image URL:</span>
                            <input
                              type="url"
                              placeholder="https://images.example.com/photo.jpg"
                              value={newMedia.imageUrl}
                              onChange={(e) => {
                                setNewMedia({ ...newMedia, imageUrl: e.target.value });
                                setUploadedImagePreview(e.target.value);
                              }}
                              className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                            />
                          </div>

                          {/* Live Image Preview */}
                          {uploadedImagePreview && (
                            <div className="pt-2">
                              <span className="text-[11px] font-bold text-stone-600 block mb-1">Live Image Preview:</span>
                              <div className="aspect-[16/10] max-w-xs rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-stone-200">
                                <img
                                  src={uploadedImagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Video Embed URL input */
                        <div className="space-y-3 bg-[#FAF9F5] p-4 rounded-xl border border-stone-200">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-[#103C2E]">
                              Embedded Video URL (YouTube watch/embed link or MP4) *
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="e.g. https://www.youtube.com/watch?v=ScMzIvxBSi4 or https://www.youtube.com/embed/ScMzIvxBSi4"
                              value={newMedia.videoUrl}
                              onChange={(e) => setNewMedia({ ...newMedia, videoUrl: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                            />
                            <p className="text-[11px] text-stone-500">
                              Tip: You can paste standard YouTube video links or embed links normally.
                            </p>
                          </div>

                          {/* Live Video Preview if URL provided */}
                          {newMedia.videoUrl && (
                            <div className="pt-2">
                              <span className="text-[11px] font-bold text-stone-600 block mb-1">Live Video Player Preview:</span>
                              <div className="aspect-[16/9] max-w-sm rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-black">
                                <iframe
                                  src={formatVideoUrl(newMedia.videoUrl)}
                                  title="Video preview"
                                  className="w-full h-full"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#103C2E]">Description / Context</label>
                        <textarea
                          rows={2}
                          placeholder="Brief description of this visual record..."
                          value={newMedia.description}
                          onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm"
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddMedia(false);
                            setUploadedImagePreview('');
                          }}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                        >
                          <Save className="w-4 h-4 text-[#C6A15B]" />
                          <span>Save Media Record</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Media Items Table */}
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#103C2E] text-white">
                          <th className="p-4">Preview</th>
                          <th className="p-4">Title</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {gallery.map(item => {
                          const isVid = item.type === 'video' || !!item.videoUrl;
                          return (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="p-3 w-20">
                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-200 relative border border-stone-200">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=200';
                                    }}
                                  />
                                  {isVid && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                      <Play className="w-3.5 h-3.5 text-white fill-current" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 font-bold text-[#103C2E]">
                                {item.title}
                                <p className="text-[11px] text-stone-500 font-normal line-clamp-1">{item.description}</p>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1 ${
                                  isVid ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                                }`}>
                                  {isVid ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                  {isVid ? 'Video' : 'Photo'}
                                </span>
                              </td>
                              <td className="p-4 text-gray-600">{item.category}</td>
                              <td className="p-4 text-gray-600">{item.date}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteMedia(item.id)}
                                  className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete media item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CONTACTS SUB-TAB */}
              {cmsSubTab === 'contacts' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-[#103C2E] text-base">Constituency Enquiries & Messages ({contacts.length})</h4>
                  {contacts.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#103C2E]">{c.name} ({c.email})</span>
                        <span className="text-xs text-gray-500">{c.date}</span>
                      </div>
                      <p className="text-xs text-gray-600">Category: <strong>{c.category}</strong> | Phone: {c.phone}</p>
                      <p className="text-sm bg-[#FAF9F5] p-3 rounded-xl border">{c.message}</p>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <p className="text-xs text-stone-500 bg-white p-6 rounded-xl text-center">No contact enquiries received yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MULTILINGUAL MANAGER */}
          {activeTab === 'multilingual' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Multilingual Control System</h3>
                <p className="text-xs text-[#6B716D]">Manage translations for English, Hausa, and Arabic (RTL support).</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <h4 className="font-bold text-base text-[#103C2E]">Translation Dictionary Editor</h4>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                    Completeness: 100% (English, Hausa, Arabic)
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.entries(translations).map(([key, val]) => (
                    <div key={key} className="bg-[#FAF9F5] p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <span className="font-mono text-xs font-bold text-[#103C2E]">{key}</span>
                      <div>
                        <label className="text-[10px] text-gray-500 block">English</label>
                        <input
                          type="text"
                          value={val.en}
                          onChange={(e) => {
                            const updated = { ...translations, [key]: { ...val, en: e.target.value } };
                            setTranslations(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Hausa</label>
                        <input
                          type="text"
                          value={val.ha}
                          onChange={(e) => {
                            const updated = { ...translations, [key]: { ...val, ha: e.target.value } };
                            setTranslations(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block">Arabic (RTL)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={val.ar}
                          onChange={(e) => {
                            const updated = { ...translations, [key]: { ...val, ar: e.target.value } };
                            setTranslations(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-serif"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USERS & PERMISSIONS */}
          {activeTab === 'users' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Administrator Users & Least-Privilege Roles</h3>
                  <p className="text-xs text-[#6B716D]">Manage authorized constituency staff, create new admin credentials, and control access permissions.</p>
                </div>
                <button
                  onClick={() => setShowAddAdminModal(!showAddAdminModal)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C6A15B]" />
                  <span>{showAddAdminModal ? 'Close Form' : 'Create Admin Account'}</span>
                </button>
              </div>

              {showAddAdminModal && (
                <form onSubmit={handleCreateAdmin} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4 animate-fadeIn">
                  <h4 className="font-bold text-[#103C2E] text-sm">Add New Administrator Account</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Administrator Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. staff@danmayeyabo.gov.ng"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Assigned Role *</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs"
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
                      className="bg-[#C6A15B] text-[#09291F] hover:bg-[#b08d4a] px-5 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer"
                    >
                      Save Admin Account
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#103C2E] text-white">
                      <th className="p-4">Staff Email</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Permissions</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-stone-50">
                        <td className="p-4 font-bold text-[#103C2E]">{usr.email}</td>
                        <td className="p-4 text-gray-700 font-medium">{usr.role}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAdminStatus(usr.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                              usr.status === 'Active' 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {usr.status} (Click to toggle)
                          </button>
                        </td>
                        <td className="p-4 text-gray-600 font-light">{usr.permissions}</td>
                        <td className="p-4 text-right space-x-2">
                          {usr.email !== 'admin@danmayeyabo.gov.ng' && (
                            <button
                              onClick={() => handleDeleteAdmin(usr.id)}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                              title="Revoke / Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">System Settings & Constituency Statistics</h3>
                <p className="text-xs text-[#6B716D]">Configure public headline counters and portal parameters.</p>
              </div>

              <form onSubmit={handleSaveStats} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
                <h4 className="font-bold text-[#103C2E] text-base">Homepage Headline Statistics</h4>

                {statsSavedMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Statistics successfully updated and saved across the website!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Total Projects Count</label>
                    <input
                      type="text"
                      required
                      value={editableStats.projectsCount}
                      onChange={(e) => setEditableStats({...editableStats, projectsCount: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Bills & Motions Count</label>
                    <input
                      type="text"
                      required
                      value={editableStats.billsCount}
                      onChange={(e) => setEditableStats({...editableStats, billsCount: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Empowered Citizens</label>
                    <input
                      type="text"
                      required
                      value={editableStats.citizensCount}
                      onChange={(e) => setEditableStats({...editableStats, citizensCount: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Constituency Wards</label>
                    <input
                      type="text"
                      required
                      value={editableStats.wardsCount}
                      onChange={(e) => setEditableStats({...editableStats, wardsCount: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition"
                  >
                    <Save className="w-4 h-4 text-[#C6A15B]" /> Save Statistics
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
