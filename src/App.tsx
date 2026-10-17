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
import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission } from './types';
import { Language, Translations, DEFAULT_TRANSLATIONS } from './utils/i18n';
import { sanitizeGalleryList } from './utils/youtube';

export interface ConstituencyStats {
  projectsCount: string;
  billsCount: string;
  citizensCount: string;
  wardsCount: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [adminOpen, setAdminOpen] = useState(false);

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

      <Footer
        setCurrentTab={setCurrentTab}
        currentLang={currentLang}
        translations={translations}
        onOpenAdmin={() => setAdminOpen(true)}
      />

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
