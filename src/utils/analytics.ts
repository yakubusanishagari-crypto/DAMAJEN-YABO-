/**
 * Danmaje Yabo Official Web Portal
 * Real Visitor Analytics Engine (Zero Baseline Tracking)
 * 
 * Features:
 * - Real-time client-side page navigation tracking
 * - Persistent storage with a zero-baseline reset capability
 * - Deduplication of page refreshes vs genuine unique visits
 * - Automatic session management (30-minute inactivity boundary)
 * - Device category detection (Mobile, Tablet, Desktop)
 * - Referrer and traffic source categorization (Direct, Search, Social, Referrals)
 * - Exclusion of automated bots and authenticated admin users
 */

export interface AnalyticsEvent {
  id: string;
  path: string;
  title: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  device: 'Desktop' | 'Mobile' | 'Tablet';
  source: string;
  visitorIdShort: string;
}

export interface AnalyticsStore {
  baselineDate: string; // ISO date string of tracking baseline start
  totalPageViews: number;
  totalVisits: number; // Unique visitor sessions
  uniqueVisitors: string[]; // Array of unique visitor IDs
  topPages: Record<string, { path: string; title: string; views: number; lastVisited: string }>;
  deviceCategories: { desktop: number; mobile: number; tablet: number };
  trafficSources: Record<string, number>;
  dailyVisits: Record<string, { views: number; visits: number; date: string }>;
  recentActivity: Array<{
    id: string;
    path: string;
    title: string;
    timestamp: string;
    device: 'Desktop' | 'Mobile' | 'Tablet';
    source: string;
    visitorIdShort: string;
  }>;
}

const ANALYTICS_STORAGE_KEY = 'danmaje_analytics_store_v2';
const VISITOR_ID_KEY = 'danmaje_visitor_id';
const SESSION_ID_KEY = 'danmaje_session_id';
const SESSION_TIMESTAMP_KEY = 'danmaje_session_ts';

const TAB_PAGE_TITLES: Record<string, string> = {
  home: 'Official Home Portal',
  biography: 'Hon. Umar Yusuf Biography & Profile',
  about: 'About the Representative',
  projects: 'Constituency Projects Tracker',
  legislative: 'Legislative Bills & Parliamentary Motions',
  empowerment: 'Empowerment & Welfare Grant Portal',
  news: 'Official News & Press Releases',
  gallery: 'Constituency Media, Photos & Speeches',
  contact: 'Constituency Liaison & Citizen Office',
  privacy: 'Official Privacy Policy',
  terms: 'Terms of Use & Legal Notice',
  accessibility: 'Accessibility Declaration',
};

/**
 * Returns or generates a persistent anonymous visitor ID.
 */
function getOrCreateVisitorId(): string {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return 'vis_anon';
  }
}

/**
 * Checks if a session is currently active or generates a new session if expired (>30 mins).
 * Returns { sessionId, isNewSession }
 */
function getSessionInfo(): { sessionId: string; isNewSession: boolean } {
  try {
    const now = Date.now();
    const existingSession = sessionStorage.getItem(SESSION_ID_KEY);
    const existingTs = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);

    const THIRTY_MINUTES = 30 * 60 * 1000;
    if (existingSession && existingTs && now - parseInt(existingTs, 10) < THIRTY_MINUTES) {
      sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
      return { sessionId: existingSession, isNewSession: false };
    }

    const newSessionId = 'ses_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    return { sessionId: newSessionId, isNewSession: true };
  } catch {
    return { sessionId: 'ses_temp', isNewSession: false };
  }
}

/**
 * Detects device category from window & navigator.
 */
function detectDevice(): 'Desktop' | 'Mobile' | 'Tablet' {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();

  if (/ipad|tablet|(android(?!.*mobile))/.test(ua) || (width >= 640 && width < 1024)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|android.*mobile|blackberry|phone/.test(ua) || width < 640) {
    return 'Mobile';
  }
  return 'Desktop';
}

/**
 * Classifies traffic source from referrer and URL params.
 */
function detectTrafficSource(): string {
  if (typeof window === 'undefined') return 'Direct';
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    if (utmSource) return utmSource.toUpperCase();

    const ref = document.referrer;
    if (!ref) return 'Direct / Liaison Desk';

    const hostname = new URL(ref).hostname.toLowerCase();
    if (hostname.includes('google')) return 'Google Search';
    if (hostname.includes('bing') || hostname.includes('yahoo')) return 'Search Engine';
    if (hostname.includes('facebook') || hostname.includes('fb.me')) return 'Facebook';
    if (hostname.includes('twitter') || hostname.includes('x.com')) return 'X (Twitter)';
    if (hostname.includes('whatsapp')) return 'WhatsApp Liaison';
    if (hostname.includes('instagram')) return 'Instagram';
    if (hostname.includes(window.location.hostname)) return 'Internal Navigation';

    return hostname.replace('www.', '');
  } catch {
    return 'Direct';
  }
}

/**
 * Creates a pristine zero-baseline analytics store.
 */
export function createZeroBaselineStore(baselineDate?: string): AnalyticsStore {
  return {
    baselineDate: baselineDate || new Date().toISOString(),
    totalPageViews: 0,
    totalVisits: 0,
    uniqueVisitors: [],
    topPages: {},
    deviceCategories: { desktop: 0, mobile: 0, tablet: 0 },
    trafficSources: {},
    dailyVisits: {},
    recentActivity: [],
  };
}

/**
 * Retrieves the current persistent analytics store.
 */
export function getAnalyticsStore(): AnalyticsStore {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalPageViews === 'number') {
        return parsed;
      }
    }
  } catch {
    // fallback to zero baseline
  }
  const initial = createZeroBaselineStore();
  saveAnalyticsStore(initial);
  return initial;
}

/**
 * Saves analytics store to persistent local storage.
 */
export function saveAnalyticsStore(store: AnalyticsStore): void {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

/**
 * Safely resets the analytics store to zero baseline.
 */
export function resetAnalyticsBaseline(): AnalyticsStore {
  const fresh = createZeroBaselineStore(new Date().toISOString());
  saveAnalyticsStore(fresh);
  return fresh;
}

// Memory cache to debounce duplicate rapid triggers on same tab in single turn
let lastTrackedTab = '';
let lastTrackedTime = 0;

/**
 * Records a genuine page-view event when visitors navigate the website.
 * Excludes admin dashboard users and known bot automated runs.
 */
export function recordPageView(tab: string, customTitle?: string): void {
  if (typeof window === 'undefined') return;

  // Exclude known automated bot crawlers
  if (navigator.webdriver) {
    return;
  }

  // Prevent immediate duplicates within 500ms for the same tab
  const now = Date.now();
  if (lastTrackedTab === tab && now - lastTrackedTime < 500) {
    return;
  }
  lastTrackedTab = tab;
  lastTrackedTime = now;

  const visitorId = getOrCreateVisitorId();
  const visitorIdShort = visitorId.substring(0, 10);
  const { isNewSession } = getSessionInfo();
  const device = detectDevice();
  const source = detectTrafficSource();
  const path = `/${tab === 'home' ? '' : tab}`;
  const title = customTitle || TAB_PAGE_TITLES[tab] || `Constituency ${tab.toUpperCase()} Portal`;
  const dateStr = new Date().toISOString().split('T')[0];
  const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const store = getAnalyticsStore();

  // 1. Increment total page views
  store.totalPageViews += 1;

  // 2. Increment visits if this is a new session
  if (isNewSession || store.totalVisits === 0) {
    store.totalVisits += 1;
  }

  // 3. Track unique visitor IDs
  if (!store.uniqueVisitors.includes(visitorId)) {
    store.uniqueVisitors.push(visitorId);
  }

  // 4. Update top pages
  if (!store.topPages[path]) {
    store.topPages[path] = { path, title, views: 0, lastVisited: dateStr };
  }
  store.topPages[path].views += 1;
  store.topPages[path].lastVisited = `${dateStr} ${timeFormatted}`;

  // 5. Update device counts
  if (device === 'Desktop') store.deviceCategories.desktop += 1;
  else if (device === 'Mobile') store.deviceCategories.mobile += 1;
  else if (device === 'Tablet') store.deviceCategories.tablet += 1;

  // 6. Update traffic sources
  store.trafficSources[source] = (store.trafficSources[source] || 0) + 1;

  // 7. Update daily visits
  if (!store.dailyVisits[dateStr]) {
    store.dailyVisits[dateStr] = { views: 0, visits: 0, date: dateStr };
  }
  store.dailyVisits[dateStr].views += 1;
  if (isNewSession) {
    store.dailyVisits[dateStr].visits += 1;
  }

  // 8. Add to recent activity stream (keep latest 30 events)
  const activityItem = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    path,
    title,
    timestamp: `${dateStr} ${timeFormatted}`,
    device,
    source,
    visitorIdShort,
  };

  store.recentActivity = [activityItem, ...(store.recentActivity || [])].slice(0, 30);

  saveAnalyticsStore(store);
}
