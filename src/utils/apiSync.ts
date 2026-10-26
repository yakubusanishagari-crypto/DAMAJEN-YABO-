import { 
  Project, LegislativeRecord, EmpowermentProgram, NewsArticle, 
  GalleryItem, ContactSubmission, ProgramApplication 
} from '../types';
import { ConstituencyStats } from '../App';
import { safeSetItem, safeGetItem } from './safeStorage';

const API_BASE = '/api';

async function fetchJson<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`API fetch error for ${endpoint}:`, err);
    return null;
  }
}

async function sendJson<T>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', body?: any): Promise<T | null> {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) {
      console.warn(`API ${method} error for ${endpoint}: status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API ${method} network error for ${endpoint}:`, err);
    return null;
  }
}

// ==================== PROJECTS ====================
export async function apiFetchProjects(): Promise<Project[] | null> {
  const data = await fetchJson<Project[]>('/projects');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_projects', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateProject(project: Partial<Project>): Promise<Project | null> {
  const created = await sendJson<Project>('/projects', 'POST', project);
  return created;
}

export async function apiUpdateProject(id: string, project: Partial<Project>): Promise<Project | null> {
  const updated = await sendJson<Project>(`/projects/${id}`, 'PUT', project);
  return updated;
}

export async function apiDeleteProject(id: string): Promise<boolean> {
  const res = await sendJson<{ success: boolean }>(`/projects/${id}`, 'DELETE');
  return res?.success ?? false;
}

// ==================== LEGISLATIVE ====================
export async function apiFetchLegislative(): Promise<LegislativeRecord[] | null> {
  const data = await fetchJson<LegislativeRecord[]>('/legislative');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_legislative', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateLegislative(item: Partial<LegislativeRecord>): Promise<LegislativeRecord | null> {
  return await sendJson<LegislativeRecord>('/legislative', 'POST', item);
}

export async function apiUpdateLegislative(id: string, item: Partial<LegislativeRecord>): Promise<LegislativeRecord | null> {
  return await sendJson<LegislativeRecord>(`/legislative/${id}`, 'PUT', item);
}

export async function apiDeleteLegislative(id: string): Promise<boolean> {
  const res = await sendJson<{ success: boolean }>(`/legislative/${id}`, 'DELETE');
  return res?.success ?? false;
}

// ==================== PROGRAMS ====================
export async function apiFetchPrograms(): Promise<EmpowermentProgram[] | null> {
  const data = await fetchJson<EmpowermentProgram[]>('/programs');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_programs', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateProgram(item: Partial<EmpowermentProgram>): Promise<EmpowermentProgram | null> {
  return await sendJson<EmpowermentProgram>('/programs', 'POST', item);
}

export async function apiUpdateProgram(id: string, item: Partial<EmpowermentProgram>): Promise<EmpowermentProgram | null> {
  return await sendJson<EmpowermentProgram>(`/programs/${id}`, 'PUT', item);
}

export async function apiDeleteProgram(id: string): Promise<boolean> {
  const res = await sendJson<{ success: boolean }>(`/programs/${id}`, 'DELETE');
  return res?.success ?? false;
}

// ==================== NEWS ====================
export async function apiFetchNews(): Promise<NewsArticle[] | null> {
  const data = await fetchJson<NewsArticle[]>('/news');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_news', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateNews(item: Partial<NewsArticle>): Promise<NewsArticle | null> {
  return await sendJson<NewsArticle>('/news', 'POST', item);
}

export async function apiUpdateNews(id: string, item: Partial<NewsArticle>): Promise<NewsArticle | null> {
  return await sendJson<NewsArticle>(`/news/${id}`, 'PUT', item);
}

export async function apiDeleteNews(id: string): Promise<boolean> {
  const res = await sendJson<{ success: boolean }>(`/news/${id}`, 'DELETE');
  return res?.success ?? false;
}

// ==================== GALLERY ====================
export async function apiFetchGallery(): Promise<GalleryItem[] | null> {
  const data = await fetchJson<GalleryItem[]>('/gallery');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_gallery', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateGallery(item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  return await sendJson<GalleryItem>('/gallery', 'POST', item);
}

export async function apiUpdateGallery(id: string, item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  return await sendJson<GalleryItem>(`/gallery/${id}`, 'PUT', item);
}

export async function apiDeleteGallery(id: string): Promise<boolean> {
  const res = await sendJson<{ success: boolean }>(`/gallery/${id}`, 'DELETE');
  return res?.success ?? false;
}

// ==================== CONTACTS ====================
export async function apiFetchContacts(): Promise<ContactSubmission[] | null> {
  const data = await fetchJson<ContactSubmission[]>('/contacts');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_contacts', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateContact(item: Partial<ContactSubmission>): Promise<ContactSubmission | null> {
  return await sendJson<ContactSubmission>('/contacts', 'POST', item);
}

// ==================== APPLICATIONS ====================
export async function apiFetchApplications(): Promise<ProgramApplication[] | null> {
  const data = await fetchJson<ProgramApplication[]>('/applications');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_applications', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreateApplication(item: Partial<ProgramApplication>): Promise<ProgramApplication | null> {
  return await sendJson<ProgramApplication>('/applications', 'POST', item);
}

export async function apiUpdateApplication(id: string, item: Partial<ProgramApplication>): Promise<ProgramApplication | null> {
  return await sendJson<ProgramApplication>(`/applications/${id}`, 'PUT', item);
}

// ==================== STATS ====================
export async function apiFetchStats(): Promise<ConstituencyStats | null> {
  return await fetchJson<ConstituencyStats>('/stats');
}

export async function apiUpdateStats(stats: ConstituencyStats): Promise<ConstituencyStats | null> {
  return await sendJson<ConstituencyStats>('/stats', 'PUT', stats);
}

// ==================== SETTINGS ====================
export async function apiFetchSettings(): Promise<any | null> {
  return await fetchJson<any>('/settings');
}

export async function apiUpdateSettings(settings: any): Promise<any | null> {
  return await sendJson<any>('/settings', 'PUT', settings);
}

// ==================== ADMIN USERS & RBAC ====================
export async function apiFetchAdminUsers(): Promise<any[] | null> {
  return await fetchJson<any[]>('/admin/users');
}

export async function apiCreateAdminUser(user: any): Promise<any | null> {
  return await sendJson<any>('/admin/users', 'POST', user);
}

export async function apiUpdateAdminUser(id: string, user: any): Promise<any | null> {
  return await sendJson<any>(`/admin/users/${id}`, 'PUT', user);
}

export async function apiDeleteAdminUser(id: string): Promise<boolean> {
  const res = await sendJson<{ success: boolean }>(`/admin/users/${id}`, 'DELETE');
  return res?.success ?? false;
}

// ==================== PETITIONS & GRIEVANCE REDRESS ====================
export async function apiFetchPetitions(): Promise<any[] | null> {
  const data = await fetchJson<any[]>('/petitions');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_petitions', JSON.stringify(data));
    return data;
  }
  return null;
}

export async function apiCreatePetition(petition: any): Promise<any | null> {
  return await sendJson<any>('/petitions', 'POST', petition);
}

export async function apiUpdatePetition(id: string, petition: any): Promise<any | null> {
  return await sendJson<any>(`/petitions/${id}`, 'PUT', petition);
}

export async function apiDispatchPetitionDecision(id: string, decisionPayload: any): Promise<any | null> {
  return await sendJson<any>(`/petitions/${id}/decision`, 'POST', decisionPayload);
}

// ==================== POLLS & TOWN HALL ====================
export async function apiFetchPolls(): Promise<any[] | null> {
  const data = await fetchJson<any[]>('/polls');
  if (data && Array.isArray(data)) {
    safeSetItem('danmaje_polls', JSON.stringify(data));
    return data;
  }
  return null;
}

// ==================== STORAGE UPLOAD ====================
export async function apiCheckStorageStatus(): Promise<any> {
  return await fetchJson<any>('/storage/status');
}

export async function apiUploadFile(file: File | string, fileName?: string, bucket = 'uploads'): Promise<string> {
  let fileData = '';
  let name = fileName || 'upload.jpg';

  if (typeof file === 'string') {
    fileData = file;
  } else {
    name = file.name;
    fileData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: name, fileData, bucket })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.success || !data.url) {
    const errorMsg = data?.error || `Upload to Supabase Storage failed (Status ${res.status})`;
    console.error('apiUploadFile failed:', errorMsg);
    throw new Error(errorMsg);
  }

  // Strictly verify it's a real remote URL, never local fallback
  if (data.url.startsWith('data:')) {
    throw new Error('Supabase Storage did not return a remote URL. Upload unconfirmed.');
  }

  return data.url;
}


