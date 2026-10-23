/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BiographyPage } from './pages/BiographyPage';
import { About } from './pages/About';
import { ProjectsPage } from './pages/ProjectsPage';
import { LegislativePage } from './pages/LegislativePage';
import { EmpowermentPage } from './pages/EmpowermentPage';
import { NewsPage } from './pages/NewsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { INITIAL_PROJECTS, INITIAL_LEGISLATIVE, INITIAL_PROGRAMS, INITIAL_NEWS, INITIAL_GALLERY, INITIAL_CONTACTS } from './data/initialData';
import { INITIAL_AGENTS } from './data/initialAgents';
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission, PollingUnitAgentLink, ElectionReport } from './types';
import { Language, Translations, DEFAULT_TRANSLATIONS } from './utils/i18n';
import { sanitizeGalleryList } from './utils/youtube';
import { recordPageView } from './utils/analytics';
import { AgentElectionPortal } from './components/AgentElectionPortal';
import { ConstituencyGISMap } from './components/ConstituencyGISMap';
import { TownHallWidget } from './components/TownHallWidget';
import { PetitionTrackerWidget } from './components/PetitionTrackerWidget';
import { ParliamentaryGazetteExporter } from './components/ParliamentaryGazetteExporter';

import { safeSetItem, safeGetItem } from './utils/safeStorage';
import { 
  apiFetchProjects, apiFetchNews, apiFetchPrograms, 
  apiFetchLegislative, apiFetchGallery, apiFetchContacts, 
  apiFetchStats 
} from './utils/apiSync';


export interface ConstituencyStats {
  projectsCount: string;
  billsCount: string;
  citizensCount: string;
  wardsCount: string;
}

// Global React Error Boundary to prevent white screen
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Portal render error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center text-[#103C2E]">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-stone-200 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <img src="/official_logo.png" alt="Official Seal" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-xl font-bold font-['Manrope']">National Assembly Constituency Portal</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              The portal encountered a transient display state. Your data is secure and safe.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase cursor-pointer shadow"
            >
              Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const agentToken = urlParams.get('agent_token');

  const [currentTab, setCurrentTab] = useState('home');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [adminOpen, setAdminOpen] = useState(false);

  // Track genuine public visitor navigation events (zero baseline)
  useEffect(() => {
    if (!adminOpen) {
      recordPageView(currentTab);
    }
  }, [currentTab, adminOpen]);

  useEffect(() => {
    if (window.location.pathname.includes('admin')) {
      setAdminOpen(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Live Backend Data Fetch & Sync on Mount
  useEffect(() => {
    async function syncBackendData() {
      try {
        const [proj, newsData, progs, leg, gal, con, st] = await Promise.all([
          apiFetchProjects(),
          apiFetchNews(),
          apiFetchPrograms(),
          apiFetchLegislative(),
          apiFetchGallery(),
          apiFetchContacts(),
          apiFetchStats()
        ]);
        if (proj !== null) setProjects(proj);
        if (newsData !== null) setNews(newsData);
        if (progs !== null) setPrograms(progs);
        if (leg !== null) setLegislative(leg);
        if (gal !== null) setGallery(gal);
        if (con !== null) setContacts(con);
        if (st !== null) setStats(st);
      } catch (err) {
        console.warn("Backend API sync warning:", err);
      }
    }
    syncBackendData();
  }, []);

  const [stats, setStats] = useState<ConstituencyStats>(() => {
    try {
      const saved = safeGetItem('danmaje_stats');
      return saved ? JSON.parse(saved) : {
        projectsCount: '24+',
        billsCount: '12+',
        citizensCount: '4,500+',
        wardsCount: '22'
      };
    } catch {
      return {
        projectsCount: '24+',
        billsCount: '12+',
        citizensCount: '4,500+',
        wardsCount: '22'
      };
    }
  });

  useEffect(() => {
    safeSetItem('danmaje_stats', JSON.stringify(stats));
  }, [stats]);

  const [translations, setTranslations] = useState<Translations>(() => {
    try {
      const saved = safeGetItem('danmaje_translations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_TRANSLATIONS, ...parsed };
      }
    } catch (e) {
      // Fallback
    }
    return DEFAULT_TRANSLATIONS;
  });

  useEffect(() => {
    safeSetItem('danmaje_translations', JSON.stringify(translations));
  }, [translations]);

  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = safeGetItem('danmaje_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Storage recovery for projects:", e);
    }
    return INITIAL_PROJECTS;
  });

  const [legislative, setLegislative] = useState<LegislativeRecord[]>(() => {
    try {
      const saved = safeGetItem('danmaje_legislative');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_LEGISLATIVE;
  });

  const [programs, setPrograms] = useState<EmpowermentProgram[]>(() => {
    try {
      const saved = safeGetItem('danmaje_programs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROGRAMS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = safeGetItem('danmaje_news');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_NEWS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = safeGetItem('danmaje_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeGalleryList(parsed);
      }
    } catch {}
    return sanitizeGalleryList(INITIAL_GALLERY);
  });

  const [contacts, setContacts] = useState<ContactSubmission[]>(() => {
    try {
      const saved = safeGetItem('danmaje_contacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CONTACTS;
  });


  const [agents, setAgents] = useState<PollingUnitAgentLink[]>(() => {
    const saved = localStorage.getItem('danmaje_agents') || localStorage.getItem('danmaje_agent_links');
    if (saved) {
      try {
        const parsed: PollingUnitAgentLink[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return parsed.map((ag, idx) => {
            const initial = INITIAL_AGENTS.find(i => i.id === ag.id || i.token === ag.token);
            const token = ag.uniqueToken || ag.token || initial?.token || `agent-${idx + 1}`;
            return {
              ...ag,
              token,
              uniqueToken: token,
              password: ag.password || initial?.password || 'DANMAJE2026',
              ward: ag.ward || ag.wardName || initial?.ward || 'Constituency Ward',
              wardName: ag.wardName || ag.ward || initial?.ward || 'Constituency Ward',
              localGovernment: ag.localGovernment || initial?.localGovernment || 'Yabo'
            };
          });
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_AGENTS;
  });

  const [electionReports, setElectionReports] = useState<ElectionReport[]>(() => {
    const saved = localStorage.getItem('danmaje_election_reports');
    return saved ? JSON.parse(saved) : [
      { id: 'rep-1', linkId: 'yabo-central-001', agentName: 'Aliyu Dan-Yabo', ward: 'Yabo Central Ward', wardName: 'Yabo Central Ward', localGovernment: 'Yabo', pollingUnitName: 'Town Hall Polling Unit 001', pollingUnitCode: '01/05/02/001', phone: '+234 803 456 7890', totalRegisteredVoters: 1250, totalAccreditedVoters: 780, totalValidVotes: 760, rejectedVotes: 20, danmajeVotes: 495, opponentVotes: 240, otherPartyVotes: 25, notes: 'Peaceful voting process. High turnout recorded. All party agents present during count.', submittedAt: '2026-10-18 15:30' },
      { id: 'rep-2', linkId: 'yabo-central-002', agentName: 'Sani Shehu', ward: 'Yabo Central Ward', wardName: 'Yabo Central Ward', localGovernment: 'Yabo', pollingUnitName: 'Primary School Gate PU 002', pollingUnitCode: '01/05/02/002', phone: '+234 802 333 4455', totalRegisteredVoters: 980, totalAccreditedVoters: 620, totalValidVotes: 610, rejectedVotes: 10, danmajeVotes: 380, opponentVotes: 200, otherPartyVotes: 30, notes: 'Smooth exercise. Zero incident reported.', submittedAt: '2026-10-18 16:05' },
      { id: 'rep-3', linkId: 'kuchi-001', agentName: 'Musa Garba Kuchi', ward: 'Kuchi Ward', wardName: 'Kuchi Ward', localGovernment: 'Yabo', pollingUnitName: 'Market Square PU 001', pollingUnitCode: '01/05/01/001', phone: '+234 805 111 2233', totalRegisteredVoters: 1400, totalAccreditedVoters: 890, totalValidVotes: 875, rejectedVotes: 15, danmajeVotes: 560, opponentVotes: 285, otherPartyVotes: 30, notes: 'Voters came out en masse. Result signed by INEC official and all agents.', submittedAt: '2026-10-18 16:40' },
      { id: 'rep-4', linkId: 'shagari-south-001', agentName: 'Garba Shagari', ward: 'Shagari South Ward', wardName: 'Shagari South Ward', localGovernment: 'Shagari', pollingUnitName: 'Magajin Gari Open Space', pollingUnitCode: '01/06/01/001', phone: '+234 803 999 1122', totalRegisteredVoters: 1100, totalAccreditedVoters: 700, totalValidVotes: 685, rejectedVotes: 15, danmajeVotes: 430, opponentVotes: 225, otherPartyVotes: 30, notes: 'Collation completed successfully. Hon. Umar Yusuf leads comfortably.', submittedAt: '2026-10-18 17:10' }
    ];
  });

  useEffect(() => {
    safeSetItem('danmaje_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    safeSetItem('danmaje_legislative', JSON.stringify(legislative));
  }, [legislative]);

  useEffect(() => {
    safeSetItem('danmaje_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    safeSetItem('danmaje_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    safeSetItem('danmaje_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    safeSetItem('danmaje_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    safeSetItem('danmaje_agents', JSON.stringify(agents));
    safeSetItem('danmaje_agent_links', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    safeSetItem('danmaje_election_reports', JSON.stringify(electionReports));
  }, [electionReports]);

  const isAgentPortalRoute = 
    Boolean(agentToken) || 
    urlParams.get('portal') === 'agent' || 
    urlParams.get('agent') === 'true' || 
    window.location.pathname.includes('agent');

  if (isAgentPortalRoute) {
    return (
      <AgentElectionPortal
        initialToken={agentToken || ''}
        currentLang={currentLang}
        translations={translations}
        onBackToHome={() => {
          setCurrentTab('home');
          window.history.replaceState({}, '', '/');
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col bg-[#FAF9F5] text-[#242824] selection:bg-[#C6A15B] selection:text-[#09291F] ${currentLang === 'ar' ? 'font-serif' : ''}`}>
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          translations={translations}
          onOpenAdmin={() => setAdminOpen(true)}
        />

        <main className="flex-1">
          {currentTab === 'home' && (
            <Home
              setCurrentTab={setCurrentTab}
              projects={projects}
              news={news}
              programs={programs}
              legislative={legislative}
              gallery={gallery}
              stats={stats}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {(currentTab === 'biography' || currentTab === 'about') && (
            <BiographyPage 
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'projects' && (
            <ProjectsPage 
              projects={projects} 
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'legislative' && (
            <LegislativePage 
              legislative={legislative} 
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'empowerment' && (
            <EmpowermentPage 
              programs={programs} 
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'news' && (
            <NewsPage 
              news={news} 
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'gallery' && (
            <GalleryPage 
              gallery={gallery} 
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'contact' && (
            <ContactPage 
              currentLang={currentLang}
              translations={translations}
            />
          )}
          {currentTab === 'gis-map' && (
            <ConstituencyGISMap projects={projects} currentLang={currentLang} />
          )}
          {currentTab === 'townhall' && (
            <TownHallWidget currentLang={currentLang} />
          )}
          {currentTab === 'petitions' && (
            <PetitionTrackerWidget currentLang={currentLang} />
          )}
          {currentTab === 'gazette' && (
            <ParliamentaryGazetteExporter legislative={legislative} projects={projects} programs={programs} currentLang={currentLang} />
          )}
          {(currentTab === 'privacy' || currentTab === 'terms' || currentTab === 'accessibility') && (
            <LegalPage
              type={currentTab as 'privacy' | 'terms' | 'accessibility'}
              setCurrentTab={setCurrentTab}
              currentLang={currentLang}
              translations={translations}
            />
          )}
        </main>

        {!adminOpen && (
          <Footer
            setCurrentTab={setCurrentTab}
            currentLang={currentLang}
            translations={translations}
            onOpenAdmin={() => setAdminOpen(true)}
          />
        )}

        {adminOpen && (
          <AdminDashboard
            projects={projects}
            setProjects={setProjects}
            legislative={legislative}
            setLegislative={setLegislative}
            programs={programs}
            setPrograms={setPrograms}
            news={news}
            setNews={setNews}
            gallery={gallery}
            setGallery={setGallery}
            contacts={contacts}
            setContacts={setContacts}
            agents={agents}
            setAgents={setAgents}
            electionReports={electionReports}
            setElectionReports={setElectionReports}
            translations={translations}
            setTranslations={setTranslations}
            stats={stats}
            setStats={setStats}
            currentLang={currentLang}
            onClose={() => setAdminOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
