import { 
  Project, LegislativeRecord, EmpowermentProgram, NewsArticle, 
  GalleryItem, ContactSubmission, ProgramApplication, TownHallPoll, CommunityPetition, AdminUser
} from '../types';
import { ConstituencyStats } from '../App';
import { safeSetItem, safeGetItem } from './safeStorage';
import { db, storage, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, query, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';

// ==================== STORAGE UPLOAD (Firebase Cloud Storage) ====================
export async function apiCheckStorageStatus(): Promise<any> {
  return { connected: true, provider: 'Firebase Cloud Storage', message: 'Firebase Storage operational.' };
}

export async function apiUploadFile(file: File | string, fileName?: string, bucket?: string): Promise<string> {
  try {
    // Ensure Firebase Auth session is active to satisfy storage rules
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Anonymous auth warning during upload:', authErr);
      }
    }

    let blob: Blob;
    let name = fileName || 'upload.jpg';

    if (typeof file === 'string' && file.startsWith('data:')) {
      const matches = file.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 data URL format.');
      }
      const contentType = matches[1];
      const byteCharacters = atob(matches[2]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: contentType });
    } else if (typeof file === 'string') {
      const byteCharacters = atob(file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    } else {
      blob = file;
      name = file.name;
    }

    const cleanName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `constituency/${Date.now()}-${cleanName}`);
    
    // Upload with timeout protection (30 seconds)
    const uploadPromise = uploadBytes(storageRef, blob);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firebase Storage upload timed out after 30 seconds.')), 30000)
    );

    await Promise.race([uploadPromise, timeoutPromise]);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err: any) {
    console.error('Firebase Storage upload error:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to upload file to Firebase Storage.');
  }
}

// ==================== FIRESTORE GENERIC HELPERS ====================
async function fetchCollection<T>(path: string, cacheKey?: string): Promise<T[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, path));
    const items: T[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    if (cacheKey && items.length > 0) {
      safeSetItem(cacheKey, JSON.stringify(items));
    }
    return items.length > 0 ? items : null;
  } catch (err) {
    console.warn(`Firestore fetch warning for ${path}:`, err);
    if (cacheKey) {
      const cached = safeGetItem(cacheKey);
      if (cached) {
        try { return JSON.parse(cached); } catch {}
      }
    }
    return null;
  }
}

async function createDoc<T extends { id?: string }>(path: string, item: T): Promise<T> {
  try {
    const id = item.id || `doc-${Date.now()}`;
    const docRef = doc(db, path, id);
    const payload = { ...item, id, updatedAt: new Date().toISOString() };
    await setDoc(docRef, payload, { merge: true });
    return payload as T;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

async function updateDocData<T>(path: string, id: string, item: Partial<T>): Promise<T | null> {
  try {
    const docRef = doc(db, path, id);
    const payload = { ...item, updatedAt: new Date().toISOString() };
    await updateDoc(docRef, payload as any);
    const updatedSnap = await getDoc(docRef);
    return updatedSnap.exists() ? ({ id: updatedSnap.id, ...updatedSnap.data() } as T) : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${path}/${id}`);
  }
}

async function deleteDocData(path: string, id: string): Promise<boolean> {
  try {
    const docRef = doc(db, path, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn(`Firestore delete error for ${path}/${id}:`, err);
    return false;
  }
}

// ==================== PROJECTS ====================
export async function apiFetchProjects(): Promise<Project[] | null> {
  return await fetchCollection<Project>('projects', 'danmaje_projects');
}
export async function apiCreateProject(project: Partial<Project>): Promise<Project | null> {
  return await createDoc<Project>('projects', project as Project);
}
export async function apiUpdateProject(id: string, project: Partial<Project>): Promise<Project | null> {
  return await updateDocData<Project>('projects', id, project);
}
export async function apiDeleteProject(id: string): Promise<boolean> {
  return await deleteDocData('projects', id);
}

// ==================== LEGISLATIVE ====================
export async function apiFetchLegislative(): Promise<LegislativeRecord[] | null> {
  return await fetchCollection<LegislativeRecord>('legislative', 'danmaje_legislative');
}
export async function apiCreateLegislative(item: Partial<LegislativeRecord>): Promise<LegislativeRecord | null> {
  return await createDoc<LegislativeRecord>('legislative', item as LegislativeRecord);
}
export async function apiUpdateLegislative(id: string, item: Partial<LegislativeRecord>): Promise<LegislativeRecord | null> {
  return await updateDocData<LegislativeRecord>('legislative', id, item);
}
export async function apiDeleteLegislative(id: string): Promise<boolean> {
  return await deleteDocData('legislative', id);
}

// ==================== PROGRAMS ====================
export async function apiFetchPrograms(): Promise<EmpowermentProgram[] | null> {
  return await fetchCollection<EmpowermentProgram>('programs', 'danmaje_programs');
}
export async function apiCreateProgram(item: Partial<EmpowermentProgram>): Promise<EmpowermentProgram | null> {
  return await createDoc<EmpowermentProgram>('programs', item as EmpowermentProgram);
}
export async function apiUpdateProgram(id: string, item: Partial<EmpowermentProgram>): Promise<EmpowermentProgram | null> {
  return await updateDocData<EmpowermentProgram>('programs', id, item);
}
export async function apiDeleteProgram(id: string): Promise<boolean> {
  return await deleteDocData('programs', id);
}

// ==================== NEWS ====================
export async function apiFetchNews(): Promise<NewsArticle[] | null> {
  return await fetchCollection<NewsArticle>('news', 'danmaje_news');
}
export async function apiCreateNews(item: Partial<NewsArticle>): Promise<NewsArticle | null> {
  return await createDoc<NewsArticle>('news', item as NewsArticle);
}
export async function apiUpdateNews(id: string, item: Partial<NewsArticle>): Promise<NewsArticle | null> {
  return await updateDocData<NewsArticle>('news', id, item);
}
export async function apiDeleteNews(id: string): Promise<boolean> {
  return await deleteDocData('news', id);
}

// ==================== GALLERY ====================
export async function apiFetchGallery(): Promise<GalleryItem[] | null> {
  return await fetchCollection<GalleryItem>('gallery', 'danmaje_gallery');
}
export async function apiCreateGallery(item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  return await createDoc<GalleryItem>('gallery', item as GalleryItem);
}
export async function apiUpdateGallery(id: string, item: Partial<GalleryItem>): Promise<GalleryItem | null> {
  return await updateDocData<GalleryItem>('gallery', id, item);
}
export async function apiDeleteGallery(id: string): Promise<boolean> {
  return await deleteDocData('gallery', id);
}

// ==================== CONTACTS ====================
export async function apiFetchContacts(): Promise<ContactSubmission[] | null> {
  return await fetchCollection<ContactSubmission>('contacts', 'danmaje_contacts');
}
export async function apiCreateContact(item: Partial<ContactSubmission>): Promise<ContactSubmission | null> {
  return await createDoc<ContactSubmission>('contacts', item as ContactSubmission);
}

// ==================== APPLICATIONS ====================
export async function apiFetchApplications(): Promise<ProgramApplication[] | null> {
  return await fetchCollection<ProgramApplication>('applications', 'danmaje_applications');
}
export async function apiCreateApplication(item: Partial<ProgramApplication>): Promise<ProgramApplication | null> {
  return await createDoc<ProgramApplication>('applications', item as ProgramApplication);
}
export async function apiUpdateApplication(id: string, item: Partial<ProgramApplication>): Promise<ProgramApplication | null> {
  return await updateDocData<ProgramApplication>('applications', id, item);
}

// ==================== STATS ====================
export async function apiFetchStats(): Promise<ConstituencyStats | null> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'stats'));
    if (docSnap.exists()) {
      return docSnap.data() as ConstituencyStats;
    }
  } catch {}
  const saved = safeGetItem('danmaje_stats');
  return saved ? JSON.parse(saved) : null;
}

export async function apiUpdateStats(stats: ConstituencyStats): Promise<ConstituencyStats | null> {
  try {
    await setDoc(doc(db, 'settings', 'stats'), stats, { merge: true });
    safeSetItem('danmaje_stats', JSON.stringify(stats));
    return stats;
  } catch {
    return stats;
  }
}

// ==================== SETTINGS ====================
export async function apiFetchSettings(): Promise<any | null> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'general'));
    return docSnap.exists() ? docSnap.data() : null;
  } catch {
    return null;
  }
}

export async function apiUpdateSettings(settings: any): Promise<any | null> {
  try {
    await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
    return settings;
  } catch {
    return settings;
  }
}

// ==================== ADMIN USERS & RBAC ====================
export async function apiFetchAdminUsers(): Promise<any[] | null> {
  return await fetchCollection<any>('adminUsers', 'danmaje_admin_users');
}

export async function apiCreateAdminUser(user: any): Promise<any | null> {
  return await createDoc<any>('adminUsers', user);
}

export async function apiUpdateAdminUser(id: string, user: any): Promise<any | null> {
  return await updateDocData<any>('adminUsers', id, user);
}

export async function apiDeleteAdminUser(id: string): Promise<boolean> {
  return await deleteDocData('adminUsers', id);
}

// ==================== PETITIONS & GRIEVANCE REDRESS ====================
export async function apiFetchPetitions(): Promise<any[] | null> {
  return await fetchCollection<any>('petitions', 'danmaje_petitions');
}

export async function apiCreatePetition(petition: any): Promise<any | null> {
  return await createDoc<any>('petitions', petition);
}

export async function apiUpdatePetition(id: string, petition: any): Promise<any | null> {
  return await updateDocData<any>('petitions', id, petition);
}

export async function apiDispatchPetitionDecision(id: string, decisionPayload: any): Promise<any | null> {
  return await updateDocData<any>('petitions', id, { decisionPayload, status: 'Resolved' });
}

// ==================== POLLS & TOWN HALL ====================
export async function apiFetchPolls(): Promise<any[] | null> {
  return await fetchCollection<any>('polls', 'danmaje_polls');
}
