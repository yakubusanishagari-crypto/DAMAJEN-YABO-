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

export interface ConstituencyStats {
  projectsCount: string;
  billsCount: string;
  citizensCount: string;
  wardsCount: string;
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

  const [stats, setStats] = useState<ConstituencyStats>(() => {
    const saved = localStorage.getItem('danmaje_stats');
    return saved ? JSON.parse(saved) : {
      projectsCount: '24+',
      billsCount: '12+',
      citizensCount: '4,500+',
      wardsCount: '22'
    };
  });

  useEffect(() => {
    localStorage.setItem('danmaje_stats', JSON.stringify(stats));
  }, [stats]);

  const [translations, setTranslations] = useState<Translations>(() => {
    const saved = localStorage.getItem('danmaje_translations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_TRANSLATIONS, ...parsed };
      } catch (e) {
        return DEFAULT_TRANSLATIONS;
      }
    }
    return DEFAULT_TRANSLATIONS;
  });

  useEffect(() => {
    localStorage.setItem('danmaje_translations', JSON.stringify(translations));
  }, [translations]);

  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('danmaje_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [legislative, setLegislative] = useState<LegislativeRecord[]>(() => {
    const saved = localStorage.getItem('danmaje_legislative');
    return saved ? JSON.parse(saved) : INITIAL_LEGISLATIVE;
  });

  const [programs, setPrograms] = useState<EmpowermentProgram[]>(() => {
    const saved = localStorage.getItem('danmaje_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('danmaje_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('danmaje_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return sanitizeGalleryList(parsed);
      } catch {
        return sanitizeGalleryList(INITIAL_GALLERY);
      }
    }
    return sanitizeGalleryList(INITIAL_GALLERY);
  });

  const [contacts, setContacts] = useState<ContactSubmission[]>(() => {
    const saved = localStorage.getItem('danmaje_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
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
    localStorage.setItem('danmaje_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('danmaje_legislative', JSON.stringify(legislative));
  }, [legislative]);

  useEffect(() => {
    localStorage.setItem('danmaje_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('danmaje_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('danmaje_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('danmaje_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('danmaje_agents', JSON.stringify(agents));
    localStorage.setItem('danmaje_agent_links', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('danmaje_election_reports', JSON.stringify(electionReports));
  }, [electionReports]);

  const isAgentPortalRoute = 
    Boolean(agentToken) || 
    urlParams.get('portal') === 'agent' || 
    urlParams.get('agent') === 'true' || 
    window.location.pathname.includes('agent') || 
    currentTab === 'agent-portal';

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
  );
}
