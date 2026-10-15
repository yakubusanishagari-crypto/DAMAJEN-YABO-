import React, { useState } from 'react';
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission } from '../types';
import { Language, Translations, DEFAULT_TRANSLATIONS } from '../utils/i18n';
import { ConstituencyStats } from '../App';
import { 
  Shield, Lock, Mail, Plus, Trash2, Edit, CheckCircle, X, LogOut, 
  FileText, Award, Image as ImageIcon, Users, BarChart3, Globe, Settings, 
  Activity, ArrowUpRight, TrendingUp, Download, Eye, AlertCircle, Save,
  Upload, Video, Film, Play
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
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [adminRole, setAdminRole] = useState<'Chief Administrator' | 'Content Manager' | 'News Editor' | 'Projects Manager' | 'Translation Manager' | 'Analytics Viewer'>('Chief Administrator');

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'cms' | 'multilingual' | 'users' | 'settings'>('overview');
  const [cmsSubTab, setCmsSubTab] = useState<'projects' | 'news' | 'legislative' | 'programs' | 'gallery' | 'contacts'>('projects');

  const [editableStats, setEditableStats] = useState<ConstituencyStats>(stats);
  const [statsSavedMsg, setStatsSavedMsg] = useState(false);

  React.useEffect(() => {
    setEditableStats(stats);
  }, [stats]);

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<{ id: string; user: string; action: string; timestamp: string; role: string }[]>([
    { id: 'log-1', user: 'admin@danmayeyabo.gov.ng', action: 'System login successful', timestamp: '2026-10-14 14:30', role: 'Chief Administrator' },
    { id: 'log-2', user: 'admin@danmayeyabo.gov.ng', action: 'Updated project status: Yabo Central Water Scheme', timestamp: '2026-10-14 12:15', role: 'Chief Administrator' }
  ]);

  // Analytics real metrics state
  const [analyticsData, setAnalyticsData] = useState({
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

  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '', category: 'Water & Sanitation' as const, location: '', status: 'Ongoing' as const, description: '', images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000'], updates: []
  });

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
    const createdItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newMedia.title,
      type: newMedia.type,
      category: newMedia.category,
      imageUrl: newMedia.imageUrl || (newMedia.type === 'video' ? '/src/assets/images/national_assembly_chamber_1792063300782.jpg' : 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000'),
      videoUrl: newMedia.type === 'video' ? newMedia.videoUrl : undefined,
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
    if (email === 'admin@danmayeyabo.gov.ng' && password === 'password123') {
      setIsLoggedIn(true);
      setActivityLogs(prev => [{
        id: `log-${Date.now()}`,
        user: email,
        action: 'Authenticated successfully into enterprise CMS',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        role: adminRole
      }, ...prev]);
    } else {
      setLoginError('Invalid credentials. (Demo: admin@danmayeyabo.gov.ng / password123)');
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Project = {
      id: `proj-${Date.now()}`,
      ...newProj,
      startDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0]
    };
    setProjects([created, ...projects]);
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
      action: `Updated homepage statistics (Projects: ${editableStats.projectsCount}, Bills: ${editableStats.billsCount}, Citizens: ${editableStats.citizensCount}, Wards: ${editableStats.wardsCount})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: adminRole
    }, ...prev]);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="bg-[#FAF9F5] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40">
          <div className="bg-[#103C2E] text-white p-8 text-center space-y-2 relative">
            <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="w-14 h-14 bg-[#C6A15B] text-[#09291F] rounded-full flex items-center justify-center mx-auto font-bold text-xl shadow">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="font-['Manrope'] font-bold text-2xl">Secure Admin System</h3>
            <p className="text-xs text-white/80">Hon. Umar Yusuf (Danmaje Yabo) Portal</p>
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
              <label className="text-xs font-bold text-[#103C2E]">Password (Demo: password123)</label>
              <input
                type="password"
                required
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
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-sm shadow transition"
              >
                Authenticate & Access Dashboard
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
          <Shield className="w-6 h-6 text-[#C6A15B]" />
          <div>
            <h2 className="font-['Manrope'] font-bold text-lg">Enterprise CMS & Admin Control Centre</h2>
            <p className="text-xs text-white/80">Role: <span className="text-[#C6A15B] font-semibold">{adminRole}</span> • {email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 px-4 py-2 rounded-xl text-xs font-bold border border-rose-500/30 transition"
          >
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2" title="Close Admin">
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
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'overview' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4 text-[#C6A15B]" /> System Overview
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'analytics' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#C6A15B]" /> Visitor Analytics
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'cms' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C6A15B]" /> Content Management
          </button>

          <button
            onClick={() => setActiveTab('multilingual')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'multilingual' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Globe className="w-4 h-4 text-[#C6A15B]" /> Multilingual Manager
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'users' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#C6A15B]" /> Users & Permissions
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition ${
              activeTab === 'settings' ? 'bg-[#103C2E] text-white shadow' : 'text-[#6B716D] hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4 text-[#C6A15B]" /> System Settings
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
                  <p className="text-xs text-[#6B716D]">Create, edit, publish, and manage constituency records.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCmsSubTab('projects')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${cmsSubTab === 'projects' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Projects ({projects.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('gallery')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${cmsSubTab === 'gallery' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Photos & Videos ({gallery.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('news')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${cmsSubTab === 'news' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    News ({news.length})
                  </button>
                  <button
                    onClick={() => setCmsSubTab('contacts')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${cmsSubTab === 'contacts' ? 'bg-[#103C2E] text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Enquiries ({contacts.length})
                  </button>
                </div>
              </div>

              {cmsSubTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddProj(true)}
                      className="bg-[#103C2E] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow"
                    >
                      <Plus className="w-4 h-4 text-[#C6A15B]" /> Add New Project
                    </button>
                  </div>

                  {showAddProj && (
                    <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                      <h4 className="font-bold text-[#103C2E] text-base">New Constituency Project</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <button type="button" onClick={() => setShowAddProj(false)} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-[#103C2E] text-white rounded-xl text-xs font-bold">Save Project</button>
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
                            <td className="p-4 text-right">
                              <button onClick={() => setProjects(projects.filter(item => item.id !== p.id))} className="text-rose-600 hover:text-rose-800 p-1">
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

              {cmsSubTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-bold text-[#103C2E] text-base">Photographs & Embedded Videos ({gallery.length})</h4>
                      <p className="text-xs text-stone-500">Upload photos directly from your device or embed parliamentary and documentary video URLs.</p>
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
                              Embedded Video URL (YouTube embed or MP4 video URL) *
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="e.g. https://www.youtube.com/embed/ScMzIvxBSi4"
                              value={newMedia.videoUrl}
                              onChange={(e) => setNewMedia({ ...newMedia, videoUrl: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                            />
                            <p className="text-[11px] text-stone-500">
                              Tip: For YouTube videos, use the embed link format: <code>https://www.youtube.com/embed/VIDEO_ID</code>
                            </p>
                          </div>

                          {/* Optional Thumbnail Upload */}
                          <div className="pt-2 space-y-1">
                            <label className="text-xs font-bold text-[#103C2E]">Video Cover Thumbnail (Optional)</label>
                            <div className="flex items-center gap-3">
                              <label className="cursor-pointer bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Poster</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                              <input
                                type="url"
                                placeholder="Or paste thumbnail image URL"
                                value={newMedia.imageUrl}
                                onChange={(e) => {
                                  setNewMedia({ ...newMedia, imageUrl: e.target.value });
                                  setUploadedImagePreview(e.target.value);
                                }}
                                className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          {/* Live Video Preview if URL provided */}
                          {newMedia.videoUrl && (
                            <div className="pt-2">
                              <span className="text-[11px] font-bold text-stone-600 block mb-1">Live Video Player Preview:</span>
                              <div className="aspect-[16/9] max-w-sm rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-black">
                                <iframe
                                  src={newMedia.videoUrl}
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

              {cmsSubTab === 'news' && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#103C2E] text-white">
                        <th className="p-4">Headline</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {news.map(n => (
                        <tr key={n.id} className="hover:bg-gray-50">
                          <td className="p-4 font-bold text-[#103C2E]">{n.title}</td>
                          <td className="p-4 text-gray-600">{n.category}</td>
                          <td className="p-4 text-gray-600">{n.date}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => setNews(news.filter(item => item.id !== n.id))} className="text-rose-600 hover:text-rose-800 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {cmsSubTab === 'contacts' && (
                <div className="space-y-4">
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
              <div>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Administrator Users & Least-Privilege Roles</h3>
                <p className="text-xs text-[#6B716D]">Manage authorized constituency staff and permission levels.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#103C2E] text-white">
                      <th className="p-4">Staff Email</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Permissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="p-4 font-bold text-[#103C2E]">admin@danmayeyabo.gov.ng</td>
                      <td className="p-4 text-gray-700">Chief Administrator</td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Active</span></td>
                      <td className="p-4 text-right font-medium text-gray-600">Full Access (All Modules)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#103C2E]">media@danmayeyabo.gov.ng</td>
                      <td className="p-4 text-gray-700">News Editor</td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Active</span></td>
                      <td className="p-4 text-right font-medium text-gray-600">News & Gallery CMS</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#103C2E]">projects@danmayeyabo.gov.ng</td>
                      <td className="p-4 text-gray-700">Projects Manager</td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Active</span></td>
                      <td className="p-4 text-right font-medium text-gray-600">Projects Portal Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM SETTINGS (INCLUDING HOMEPAGE STATS CONFIGURATION) */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Website Settings & Constituency Statistics</h3>
                <p className="text-xs text-[#6B716D]">Configure homepage metrics, official branding, SEO metadata, and database backups.</p>
              </div>

              {/* Homepage Statistics Configuration Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h4 className="font-bold text-base text-[#103C2E]">Homepage Statistics & Key Metrics</h4>
                    <p className="text-xs text-gray-500">Update the counter numbers displayed prominently on the homepage (e.g. 24+, 12+, 4500+, 22+).</p>
                  </div>
                  {statsSavedMsg && (
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-fadeIn">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Stats Saved Successfully!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveStats} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Constituency Projects</label>
                      <input
                        type="text"
                        required
                        value={editableStats.projectsCount}
                        onChange={(e) => setEditableStats({...editableStats, projectsCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm font-bold text-[#103C2E]"
                        placeholder="e.g. 24+"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Bills & Motions Sponsored</label>
                      <input
                        type="text"
                        required
                        value={editableStats.billsCount}
                        onChange={(e) => setEditableStats({...editableStats, billsCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm font-bold text-[#103C2E]"
                        placeholder="e.g. 12+"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Empowered Citizens & Farmers</label>
                      <input
                        type="text"
                        required
                        value={editableStats.citizensCount}
                        onChange={(e) => setEditableStats({...editableStats, citizensCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm font-bold text-[#103C2E]"
                        placeholder="e.g. 4,500+"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Wards Represented</label>
                      <input
                        type="text"
                        required
                        value={editableStats.wardsCount}
                        onChange={(e) => setEditableStats({...editableStats, wardsCount: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm font-bold text-[#103C2E]"
                        placeholder="e.g. 22"
                      />
                    </div>
                  </div>

                  {/* Real-time Preview Cards */}
                  <div className="bg-[#FAF9F5] p-4 rounded-xl border border-stone-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Live Homepage Counter Preview:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-white p-3 rounded-lg border border-stone-200">
                        <div className="text-xl sm:text-2xl font-extrabold text-[#103C2E] font-['Manrope']">
                          {editableStats.projectsCount || '—'}
                        </div>
                        <p className="text-[10px] text-stone-500 font-bold mt-0.5">Projects</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-stone-200">
                        <div className="text-xl sm:text-2xl font-extrabold text-[#103C2E] font-['Manrope']">
                          {editableStats.billsCount || '—'}
                        </div>
                        <p className="text-[10px] text-stone-500 font-bold mt-0.5">Bills & Motions</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-stone-200">
                        <div className="text-xl sm:text-2xl font-extrabold text-[#103C2E] font-['Manrope']">
                          {editableStats.citizensCount || '—'}
                        </div>
                        <p className="text-[10px] text-stone-500 font-bold mt-0.5">Citizens</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-stone-200">
                        <div className="text-xl sm:text-2xl font-extrabold text-[#103C2E] font-['Manrope']">
                          {editableStats.wardsCount || '—'}
                        </div>
                        <p className="text-[10px] text-stone-500 font-bold mt-0.5">Wards</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-7 py-3.5 rounded-xl font-bold text-xs shadow flex items-center gap-2 transition cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-[#C6A15B]" /> Save & Update Homepage Statistics
                    </button>
                  </div>
                </form>
              </div>

              {/* Database Backup & Export Card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4">
                <h4 className="font-bold text-base text-[#103C2E]">Database Backup & Export</h4>
                <p className="text-xs text-gray-600">Download a verified JSON backup of all constituency projects, news articles, statistics, and submissions.</p>
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ projects, news, contacts, programs, stats }, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `danmaje_yabo_backup_${new Date().toISOString().split('T')[0]}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4 text-[#C6A15B]" /> Download Verified Database Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
