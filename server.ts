import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_PROJECTS, 
  INITIAL_LEGISLATIVE, 
  INITIAL_PROGRAMS, 
  INITIAL_NEWS, 
  INITIAL_GALLERY, 
  INITIAL_CONTACTS,
  INITIAL_POLLS,
  INITIAL_PETITIONS,
  INITIAL_OFFICES,
  INITIAL_ADMIN_USERS
} from './src/data/initialData';
import { 
  Project, 
  LegislativeRecord, 
  EmpowermentProgram, 
  NewsArticle, 
  GalleryItem, 
  ContactSubmission, 
  ProgramApplication,
  TownHallPoll,
  CommunityPetition,
  PetitionDecisionMessage,
  ConstituencyOffice,
  AdminUser
} from './src/types';
import { sanitizeGalleryList } from './src/utils/youtube';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to strip quotes, extra whitespace, and carriage returns from environment variables
function cleanEnv(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

// Supabase Initialization with multi-environment variable fallback & Service Role prioritization
export function createSupabaseClient() {
  const url = cleanEnv(
    process.env.SUPABASE_URL || 
    process.env.VITE_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.SUPABASE_PROJECT_URL
  );

  const key = cleanEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.SUPABASE_SERVICE_KEY || 
    process.env.SUPABASE_SECRET_KEY || 
    process.env.SUPABASE_ANON_KEY || 
    process.env.VITE_SUPABASE_ANON_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.SUPABASE_KEY
  );

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

let supabase = createSupabaseClient();

export async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Support pre-parsed body from Vercel Serverless runtime without hanging
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      (req as any)._body = true;
    }
    next();
  });

  // Increase payload limits to 50MB for high-resolution site photo & image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Ensure fresh Supabase client instance with runtime environment variables
  supabase = createSupabaseClient();

  // Normalize API requests whether forwarded as /api/* or /* across Vercel rewrite configurations
  app.use((req, res, next) => {
    if (
      !req.url.startsWith('/api') && 
      !req.url.startsWith('/@') && 
      !req.url.startsWith('/src') && 
      !req.url.startsWith('/node_modules') && 
      !req.url.startsWith('/dist') &&
      !req.url.startsWith('/assets') &&
      !req.url.includes('.')
    ) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
    next();
  });

  const DATA_FILE = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
    ? path.join('/tmp', 'danmaje_store.json')
    : path.join(__dirname, 'data', 'store.json');

  // Password hashing helpers using cryptographic scrypt & timing-safe equality
  function hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
    try {
      const hash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
    } catch {
      return false;
    }
  }

  // Ensure default admin users have salted hashes initialized
  function ensureAdminCredentials(users: AdminUser[]): AdminUser[] {
    return users.map(u => {
      if (!u.passwordHash || !u.salt) {
        const salt = crypto.randomBytes(16).toString('hex');
        const defaultPwd = u.role === 'Super Administrator' ? 'DANMAJEFOREVER' : 'OfficePass2026!';
        return {
          ...u,
          salt,
          passwordHash: hashPassword(defaultPwd, salt)
        };
      }
      return u;
    });
  }

  // In-memory store initialized with default data
  let store = {
    projects: [...INITIAL_PROJECTS],
    legislative: [...INITIAL_LEGISLATIVE],
    programs: [...INITIAL_PROGRAMS],
    news: [...INITIAL_NEWS],
    gallery: sanitizeGalleryList([...INITIAL_GALLERY]),
    contacts: [...INITIAL_CONTACTS],
    polls: [...INITIAL_POLLS] as TownHallPoll[],
    petitions: [...INITIAL_PETITIONS] as CommunityPetition[],
    applications: [] as ProgramApplication[],
    offices: [...INITIAL_OFFICES] as ConstituencyOffice[],
    adminUsers: ensureAdminCredentials([...INITIAL_ADMIN_USERS]) as AdminUser[],
    stats: {
      projectsCount: '24+',
      billsCount: '12+',
      citizensCount: '4,500+',
      wardsCount: '22'
    }
  };

  // Load from local store file if exists
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      store = { 
        ...store, 
        ...parsed,
        offices: parsed.offices && parsed.offices.length > 0 ? parsed.offices : [...INITIAL_OFFICES],
        adminUsers: ensureAdminCredentials(parsed.adminUsers && parsed.adminUsers.length > 0 ? parsed.adminUsers : [...INITIAL_ADMIN_USERS])
      };
    } else {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    }
  } catch (e) {
    console.warn('Local store file warning, using default initial data:', e);
  }

  // Load from Supabase on startup if configured
  if (supabase) {
    try {
      console.log('Attempting Supabase sync on server start...');
      const [pRes, lRes, prRes, nRes, gRes, cRes, aRes, polRes, petRes] = await Promise.allSettled([
        supabase.from('projects').select('*'),
        supabase.from('legislative').select('*'),
        supabase.from('programs').select('*'),
        supabase.from('news').select('*'),
        supabase.from('gallery').select('*'),
        supabase.from('contacts').select('*'),
        supabase.from('applications').select('*'),
        supabase.from('polls').select('*'),
        supabase.from('petitions').select('*')
      ]);

      if (pRes.status === 'fulfilled' && pRes.value.data && pRes.value.data.length > 0) {
        store.projects = pRes.value.data;
      }
      if (lRes.status === 'fulfilled' && lRes.value.data && lRes.value.data.length > 0) {
        store.legislative = lRes.value.data;
      }
      if (prRes.status === 'fulfilled' && prRes.value.data && prRes.value.data.length > 0) {
        store.programs = prRes.value.data;
      }
      if (nRes.status === 'fulfilled' && nRes.value.data && nRes.value.data.length > 0) {
        store.news = nRes.value.data;
      }
      if (gRes.status === 'fulfilled' && gRes.value.data && gRes.value.data.length > 0) {
        store.gallery = sanitizeGalleryList(gRes.value.data);
      }
      if (cRes.status === 'fulfilled' && cRes.value.data && cRes.value.data.length > 0) {
        store.contacts = cRes.value.data;
      }
      if (aRes.status === 'fulfilled' && aRes.value.data && aRes.value.data.length > 0) {
        store.applications = aRes.value.data;
      }
      if (polRes.status === 'fulfilled' && polRes.value.data && polRes.value.data.length > 0) {
        store.polls = polRes.value.data;
      }
      if (petRes.status === 'fulfilled' && petRes.value.data && petRes.value.data.length > 0) {
        store.petitions = petRes.value.data;
      }
      console.log('Supabase initial state sync complete.');
    } catch (err) {
      console.warn('Supabase initial fetch warning (continuing with persistent local store):', err);
    }
  }

  // Helper to persist store locally and push updates to Supabase securely
  async function persistStore() {
    try {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    } catch {
      // Safe non-fatal notice on read-only environments
    }

    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        await Promise.allSettled([
          active.from('projects').upsert(store.projects),
          active.from('legislative').upsert(store.legislative),
          active.from('programs').upsert(store.programs),
          active.from('news').upsert(store.news),
          active.from('gallery').upsert(store.gallery),
          active.from('contacts').upsert(store.contacts),
          active.from('applications').upsert(store.applications),
          active.from('polls').upsert(store.polls),
          active.from('petitions').upsert(store.petitions),
          active.from('offices').upsert(store.offices)
        ]);
      } catch (e: any) {
        console.warn('[Supabase Persist Batch Notice]:', e?.message || e);
      }
    }
  }

  // Helper to safely execute and await Supabase operations so serverless environments don't drop writes
  async function syncSupabase(builder: any) {
    const active = createSupabaseClient() || supabase;
    if (!active) return null;
    try {
      const res = await builder;
      if (res && res.error) {
        console.warn('[Supabase Operation Notice]:', res.error.message || res.error);
      }
      return res;
    } catch (err: any) {
      console.warn('[Supabase Network Notice]:', err?.message || err);
      return null;
    }
  }

  // ==================== HEALTH & SUPABASE STATUS API ====================
  app.get('/api/health', (req, res) => {
    const activeSupabase = createSupabaseClient() || supabase;
    res.json({ 
      status: 'ok', 
      supabaseConnected: Boolean(activeSupabase),
      timestamp: new Date().toISOString() 
    });
  });

  app.get('/api/supabase/status', async (req, res) => {
    const activeSupabase = createSupabaseClient() || supabase;
    if (!activeSupabase) {
      return res.json({
        connected: false,
        message: 'Supabase URL or Key not detected in environment. Please check Vercel environment variables.'
      });
    }
    try {
      const { data, error } = await activeSupabase.from('projects').select('id').limit(1);
      if (error) {
        return res.json({
          connected: true,
          tableReady: false,
          error: error.message,
          message: 'Connected to Supabase project URL, table query warning: ' + error.message
        });
      }
      res.json({
        connected: true,
        tableReady: true,
        message: 'Supabase backend connection verified and fully operational.'
      });
    } catch (err: any) {
      res.json({
        connected: true,
        tableReady: false,
        error: err.message || 'Unknown network error',
        message: 'Supabase client initialized, background connection checking...'
      });
    }
  });

  // ==================== STORAGE & SUPABASE DIAGNOSTIC API ====================
  app.get('/api/storage/status', async (req, res) => {
    const activeSupabase = createSupabaseClient() || supabase;
    const url = cleanEnv(
      process.env.SUPABASE_URL || 
      process.env.VITE_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.SUPABASE_PROJECT_URL
    );
    const hasServiceRoleKey = Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY || 
      process.env.SUPABASE_SERVICE_KEY || 
      process.env.SUPABASE_SECRET_KEY
    );
    const hasAnonKey = Boolean(
      process.env.SUPABASE_ANON_KEY || 
      process.env.VITE_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.SUPABASE_KEY
    );
    const configuredBucket = cleanEnv(process.env.SUPABASE_STORAGE_BUCKET || process.env.SUPABASE_BUCKET);

    if (!activeSupabase) {
      return res.status(503).json({
        connected: false,
        keyType: 'none',
        hasServiceRoleKey,
        hasAnonKey,
        message: 'Supabase credentials missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) are set in Vercel Environment Variables.'
      });
    }

    try {
      const { data: buckets, error: bErr } = await activeSupabase.storage.listBuckets();
      const sanitizedUrl = url ? url.replace(/^(https?:\/\/[^/]+).*$/, '$1') : '';
      const keyType = hasServiceRoleKey ? 'service_role' : (hasAnonKey ? 'anon' : 'custom');

      let selectedBucket = configuredBucket;
      if (!selectedBucket && buckets && buckets.length > 0) {
        selectedBucket = buckets[0].name;
      }

      return res.json({
        connected: true,
        projectUrl: sanitizedUrl,
        keyType,
        hasServiceRoleKey,
        hasAnonKey,
        configuredBucket: configuredBucket || null,
        selectedBucket: selectedBucket || 'uploads',
        buckets: buckets ? buckets.map(b => ({ id: b.id, name: b.name, public: b.public })) : [],
        bucketsError: bErr ? { name: bErr.name, message: bErr.message } : null,
        message: 'Supabase storage diagnostic completed.'
      });
    } catch (err: any) {
      console.error('[Storage Diagnostic Error]', err?.message || err);
      return res.status(500).json({
        connected: false,
        error: err?.message || 'Failed to query Supabase storage.',
        message: 'Exception while verifying Supabase storage client.'
      });
    }
  });

  // ==================== SUPABASE STORAGE UPLOAD API ====================
  app.post('/api/upload', async (req, res) => {
    try {
      const activeSupabase = createSupabaseClient() || supabase;
      if (!activeSupabase) {
        console.error('[Upload API] Supabase credentials not found in environment.');
        return res.status(503).json({ 
          success: false, 
          code: 'SUPABASE_NOT_CONFIGURED',
          error: 'Supabase Storage is not connected. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in Vercel Environment Variables.' 
        });
      }

      const { fileName, fileData } = req.body || {};
      const requestedBucket = cleanEnv(req.body?.bucket);
      const configuredBucket = cleanEnv(process.env.SUPABASE_STORAGE_BUCKET || process.env.SUPABASE_BUCKET);

      if (!fileData) {
        return res.status(400).json({ 
          success: false, 
          code: 'MISSING_FILE_DATA',
          error: 'No file data provided in request body.' 
        });
      }

      // Convert base64 data URL to Buffer and detect MIME type
      let buffer: Buffer;
      let contentType = 'image/jpeg';

      if (typeof fileData === 'string' && fileData.startsWith('data:')) {
        const matches = fileData.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ 
            success: false, 
            code: 'INVALID_BASE64_FORMAT',
            error: 'Invalid base64 data URL format provided.' 
          });
        }
        contentType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else if (typeof fileData === 'string') {
        buffer = Buffer.from(fileData, 'base64');
      } else {
        return res.status(400).json({ 
          success: false, 
          code: 'UNSUPPORTED_DATA_FORMAT',
          error: 'Unsupported file data format. Expected base64 string or data URL.' 
        });
      }

      // Check request size (e.g. 25MB max for Supabase storage limit)
      if (buffer.length > 25 * 1024 * 1024) {
        return res.status(413).json({
          success: false,
          code: 'FILE_TOO_LARGE',
          error: `File size (${(buffer.length / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed upload size (25MB).`
        });
      }

      // Dynamic bucket discovery: inspect user's existing Supabase Storage buckets
      // Do NOT assume the bucket is named "uploads" and do NOT create another bucket.
      let targetBucket = configuredBucket || requestedBucket || '';
      let existingBucketsList: string[] = [];
      let isBucketPublic = true;

      try {
        const { data: buckets, error: listError } = await activeSupabase.storage.listBuckets();
        if (listError) {
          console.warn('[Upload API] listBuckets notice:', { name: listError.name, message: listError.message });
        } else if (buckets && buckets.length > 0) {
          existingBucketsList = buckets.map(b => b.name);
          console.log('[Upload API] Confirmed existing Supabase Storage buckets:', existingBucketsList);

          // If targetBucket was requested/configured and exists in the project buckets, use it
          const matchingBucket = buckets.find(b => 
            targetBucket && (b.name.toLowerCase() === targetBucket.toLowerCase() || b.id.toLowerCase() === targetBucket.toLowerCase())
          );

          if (matchingBucket) {
            targetBucket = matchingBucket.name;
            isBucketPublic = matchingBucket.public;
          } else if (existingBucketsList.length > 0) {
            // Find existing common bucket or select the user's first existing bucket
            const candidate = buckets.find(b => 
              ['uploads', 'media', 'images', 'photos', 'public', 'danmaje', 'constituency', 'documents'].includes(b.name.toLowerCase())
            ) || buckets[0];

            console.log(`[Upload API] Selected existing Supabase bucket: "${candidate.name}" (public: ${candidate.public})`);
            targetBucket = candidate.name;
            isBucketPublic = candidate.public;
          }
        }
      } catch (discErr: any) {
        console.warn('[Upload API] Bucket discovery error:', discErr?.message || discErr);
      }

      // If still empty (e.g. anon key prevented listBuckets and no env var configured), use fallback
      if (!targetBucket) {
        targetBucket = configuredBucket || requestedBucket || 'uploads';
      }

      // Generate clean unique storage file path
      const ext = contentType.split('/')[1]?.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
      const cleanFileName = (fileName || `media-${Date.now()}.${ext}`)
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_+/g, '_');
      const filePath = `constituency/${Date.now()}-${cleanFileName}`;

      console.log(`[Upload API] Uploading ${filePath} (${buffer.length} bytes, MIME ${contentType}) to bucket "${targetBucket}"...`);

      // Upload file directly to Supabase Storage
      const { data: uploadData, error: uploadError } = await activeSupabase.storage
        .from(targetBucket)
        .upload(filePath, buffer, {
          contentType,
          upsert: true
        });

      if (uploadError) {
        const errCode = (uploadError as any).statusCode || (uploadError as any).status || 500;
        const errMsg = uploadError.message || 'Supabase Storage upload failed';
        const errName = uploadError.name || 'StorageUploadError';

        console.error('[Upload API] Supabase storage upload error:', {
          operation: 'storage.upload',
          bucket: targetBucket,
          filePath,
          contentType,
          sizeBytes: buffer.length,
          errorName: errName,
          errorMessage: errMsg,
          statusCode: errCode
        });

        // Granular error distinction without leaking secret keys:
        if (errMsg.toLowerCase().includes('bucket not found') || String(errCode) === '404') {
          return res.status(404).json({
            success: false,
            code: 'BUCKET_NOT_FOUND',
            error: `Supabase Storage bucket "${targetBucket}" does not exist. Available project buckets: [${existingBucketsList.join(', ') || 'none listed'}]. Please verify bucket name in SUPABASE_STORAGE_BUCKET.`,
            bucket: targetBucket,
            availableBuckets: existingBucketsList
          });
        }

        if (
          errMsg.toLowerCase().includes('row-level security') || 
          errMsg.toLowerCase().includes('violates') || 
          errMsg.toLowerCase().includes('policy') ||
          errMsg.toLowerCase().includes('unauthorized') ||
          String(errCode) === '403' ||
          String(errCode) === '401'
        ) {
          return res.status(403).json({
            success: false,
            code: 'STORAGE_RLS_RESTRICTION',
            error: `Supabase Storage access denied for bucket "${targetBucket}". RLS Policy notice: ${errMsg}. Resolution: Ensure SUPABASE_SERVICE_ROLE_KEY is configured in Vercel to allow backend uploads, or add an INSERT RLS policy on the bucket in Supabase dashboard.`,
            bucket: targetBucket
          });
        }

        if (errMsg.toLowerCase().includes('payload') || errMsg.toLowerCase().includes('size') || String(errCode) === '413') {
          return res.status(413).json({
            success: false,
            code: 'PAYLOAD_TOO_LARGE',
            error: `Image file exceeds Supabase Storage file size limit: ${errMsg}`,
            bucket: targetBucket
          });
        }

        const numericStatus = parseInt(String(errCode), 10);
        const finalStatus = (numericStatus >= 400 && numericStatus < 600) ? numericStatus : 500;

        return res.status(finalStatus).json({
          success: false,
          code: errName,
          error: `Supabase Storage upload failed: ${errMsg}`,
          bucket: targetBucket,
          availableBuckets: existingBucketsList
        });
      }

      // Obtain permanent public URL from Supabase Storage
      const { data: urlData } = activeSupabase.storage
        .from(targetBucket)
        .getPublicUrl(filePath);

      let permanentUrl = urlData?.publicUrl;

      // If bucket is private, generate a long-lived signed URL (5 years)
      if (!isBucketPublic || !permanentUrl) {
        try {
          const { data: signedData, error: signErr } = await activeSupabase.storage
            .from(targetBucket)
            .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 5);
          if (!signErr && signedData?.signedUrl) {
            permanentUrl = signedData.signedUrl;
          }
        } catch {}
      }

      if (!permanentUrl) {
        return res.status(500).json({
          success: false,
          code: 'URL_GENERATION_FAILED',
          error: 'Supabase Storage confirmed file upload, but failed to construct public URL.',
          bucket: targetBucket
        });
      }

      console.log(`[Upload API] Upload confirmed by Supabase! Bucket: "${targetBucket}", Permanent URL: ${permanentUrl}`);

      return res.json({
        success: true,
        url: permanentUrl,
        path: filePath,
        bucket: targetBucket,
        size: buffer.length
      });
    } catch (err: any) {
      console.error('[Upload API] Internal error:', err?.message || err);
      return res.status(500).json({ 
        success: false, 
        code: 'INTERNAL_SERVER_ERROR',
        error: err?.message || 'Internal server error during upload.' 
      });
    }
  });


  // ==================== STATS API ====================
  app.get('/api/stats', (req, res) => {
    res.json(store.stats);
  });
  app.put('/api/stats', (req, res) => {
    store.stats = { ...store.stats, ...req.body };
    persistStore();
    res.json(store.stats);
  });

  // ==================== PROJECTS API ====================
  app.get('/api/projects', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('projects').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          store.projects = data;
        }
      } catch {}
    }
    res.json(store.projects);
  });
  app.post('/api/projects', async (req, res) => {
    const newProj: Project = { 
      ...req.body, 
      id: req.body.id || `proj-${Date.now()}` 
    };
    store.projects.unshift(newProj);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('projects').insert(newProj));
    }
    persistStore();
    res.status(201).json(newProj);
  });
  app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.projects.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    store.projects[index] = { ...store.projects[index], ...req.body, id };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('projects').upsert(store.projects[index]));
    }
    persistStore();
    res.json(store.projects[index]);
  });
  app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    store.projects = store.projects.filter(p => p.id !== id);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('projects').delete().eq('id', id));
    }
    persistStore();
    res.json({ success: true });
  });

  // ==================== LEGISLATIVE API ====================
  app.get('/api/legislative', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('legislative').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          store.legislative = data;
        }
      } catch {}
    }
    res.json(store.legislative);
  });
  app.post('/api/legislative', async (req, res) => {
    const item: LegislativeRecord = { ...req.body, id: req.body.id || `leg-${Date.now()}` };
    store.legislative.unshift(item);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('legislative').insert(item));
    }
    persistStore();
    res.status(201).json(item);
  });
  app.put('/api/legislative/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.legislative.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });
    store.legislative[index] = { ...store.legislative[index], ...req.body, id };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('legislative').upsert(store.legislative[index]));
    }
    persistStore();
    res.json(store.legislative[index]);
  });
  app.delete('/api/legislative/:id', async (req, res) => {
    const { id } = req.params;
    store.legislative = store.legislative.filter(l => l.id !== id);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('legislative').delete().eq('id', id));
    }
    persistStore();
    res.json({ success: true });
  });

  // ==================== PROGRAMS API ====================
  app.get('/api/programs', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('programs').select('*').order('deadline', { ascending: false });
        if (!error && data && data.length > 0) {
          store.programs = data;
        }
      } catch {}
    }
    res.json(store.programs);
  });
  app.post('/api/programs', async (req, res) => {
    const item: EmpowermentProgram = { ...req.body, id: req.body.id || `prog-${Date.now()}` };
    store.programs.unshift(item);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('programs').insert(item));
    }
    persistStore();
    res.status(201).json(item);
  });
  app.put('/api/programs/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.programs.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Program not found' });
    store.programs[index] = { ...store.programs[index], ...req.body, id };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('programs').upsert(store.programs[index]));
    }
    persistStore();
    res.json(store.programs[index]);
  });
  app.delete('/api/programs/:id', async (req, res) => {
    const { id } = req.params;
    store.programs = store.programs.filter(p => p.id !== id);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('programs').delete().eq('id', id));
    }
    persistStore();
    res.json({ success: true });
  });

  // ==================== NEWS API ====================
  app.get('/api/news', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('news').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          store.news = data;
        }
      } catch {}
    }
    res.json(store.news);
  });
  app.post('/api/news', async (req, res) => {
    const item: NewsArticle = { ...req.body, id: req.body.id || `news-${Date.now()}` };
    store.news.unshift(item);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('news').insert(item));
    }
    persistStore();
    res.status(201).json(item);
  });
  app.put('/api/news/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.news.findIndex(n => n.id === id);
    if (index === -1) return res.status(404).json({ error: 'Article not found' });
    store.news[index] = { ...store.news[index], ...req.body, id };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('news').upsert(store.news[index]));
    }
    persistStore();
    res.json(store.news[index]);
  });
  app.delete('/api/news/:id', async (req, res) => {
    const { id } = req.params;
    store.news = store.news.filter(n => n.id !== id);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('news').delete().eq('id', id));
    }
    persistStore();
    res.json({ success: true });
  });

  // ==================== GALLERY API ====================
  app.get('/api/gallery', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('gallery').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          store.gallery = sanitizeGalleryList(data);
        }
      } catch {}
    }
    res.json(store.gallery);
  });
  app.post('/api/gallery', async (req, res) => {
    const item: GalleryItem = { ...req.body, id: req.body.id || `gal-${Date.now()}` };
    store.gallery.unshift(item);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('gallery').insert(item));
    }
    persistStore();
    res.status(201).json(item);
  });
  app.put('/api/gallery/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.gallery.findIndex(g => g.id === id);
    if (index === -1) return res.status(404).json({ error: 'Gallery item not found' });
    store.gallery[index] = { ...store.gallery[index], ...req.body, id };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('gallery').upsert(store.gallery[index]));
    }
    persistStore();
    res.json(store.gallery[index]);
  });
  app.delete('/api/gallery/:id', async (req, res) => {
    const { id } = req.params;
    store.gallery = store.gallery.filter(p => p.id !== id);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('gallery').delete().eq('id', id));
    }
    persistStore();
    res.json({ success: true });
  });

  // ==================== CONTACTS API ====================
  app.get('/api/contacts', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('contacts').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          store.contacts = data;
        }
      } catch {}
    }
    res.json(store.contacts);
  });
  app.post('/api/contacts', async (req, res) => {
    const item: ContactSubmission = {
      ...req.body,
      id: req.body.id || `con-${Date.now()}`,
      date: req.body.date || new Date().toISOString().split('T')[0],
      status: 'Unread'
    };
    store.contacts.unshift(item);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('contacts').insert(item));
    }
    persistStore();
    res.status(201).json(item);
  });
  app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.contacts.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Contact not found' });
    store.contacts[index] = { ...store.contacts[index], ...req.body };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('contacts').upsert(store.contacts[index]));
    }
    persistStore();
    res.json(store.contacts[index]);
  });

  // ==================== APPLICATIONS API ====================
  app.get('/api/applications', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('applications').select('*').order('date', { ascending: false });
        if (!error && data && data.length > 0) {
          store.applications = data;
        }
      } catch {}
    }
    res.json(store.applications);
  });
  app.post('/api/applications', async (req, res) => {
    const appItem: ProgramApplication = {
      id: req.body.id || `app-${Date.now()}`,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0],
      status: req.body.status || 'SUBMITTED'
    };
    store.applications.unshift(appItem);
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('applications').insert(appItem));
    }
    persistStore();
    res.status(201).json(appItem);
  });
  app.put('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    const index = store.applications.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: 'Application not found' });
    store.applications[index] = { ...store.applications[index], ...req.body };
    const active = createSupabaseClient() || supabase;
    if (active) {
      await syncSupabase(active.from('applications').upsert(store.applications[index]));
    }
    persistStore();
    res.json(store.applications[index]);
  });

  // ==================== TOWN HALL & POLLS API ====================
  app.get('/api/polls', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('polls').select('*').order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          store.polls = data;
        }
      } catch {}
    }
    res.json(store.polls);
  });

  app.post('/api/polls', (req, res) => {
    const { title, question, description, category, targetWard, status, options, endDate, isFeatured } = req.body;
    if (!title || !question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Poll requires title, question, and at least two options.' });
    }

    const newPoll: TownHallPoll = {
      id: `poll-${Date.now()}`,
      title,
      question,
      description: description || '',
      category: category || 'Constituency Priority',
      targetWard: targetWard || 'All 22 Wards (Constituency-Wide)',
      status: status || 'Active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdBy: req.body.createdBy || 'Chief Administrator',
      createdAt: new Date().toISOString(),
      isFeatured: Boolean(isFeatured),
      totalVotes: 0,
      options: options.map((opt: any, index: number) => ({
        id: opt.id || `opt-${Date.now()}-${index}`,
        text: typeof opt === 'string' ? opt : opt.text,
        votes: 0
      })),
      voters: []
    };

    store.polls.unshift(newPoll);
    persistStore();
    res.status(201).json(newPoll);
  });

  app.put('/api/polls/:id', (req, res) => {
    const { id } = req.params;
    const index = store.polls.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Poll not found' });
    store.polls[index] = { ...store.polls[index], ...req.body, id };
    persistStore();
    res.json(store.polls[index]);
  });

  app.delete('/api/polls/:id', (req, res) => {
    const { id } = req.params;
    store.polls = store.polls.filter(p => p.id !== id);
    persistStore();
    res.json({ success: true });
  });

  app.post('/api/polls/:id/vote', (req, res) => {
    const { id } = req.params;
    const { optionId, voterId, voterName, ward } = req.body;

    const poll = store.polls.find(p => p.id === id);
    if (!poll) return res.status(404).json({ error: 'Poll not found.' });

    if (poll.status === 'Closed') {
      return res.status(400).json({ error: 'This voting session has concluded.' });
    }

    const effectiveVoterId = voterId || `voter-${req.ip || 'anon'}`;
    const alreadyVoted = (poll.voters || []).some(v => v.voterId === effectiveVoterId);
    if (alreadyVoted) {
      return res.status(409).json({ error: 'You have already cast your vote in this poll. Each constituent is allowed one ballot.' });
    }

    const optIndex = poll.options.findIndex(o => o.id === optionId);
    if (optIndex === -1) {
      return res.status(400).json({ error: 'Selected option not found in this poll.' });
    }

    poll.options[optIndex].votes = (poll.options[optIndex].votes || 0) + 1;
    poll.totalVotes = (poll.totalVotes || 0) + 1;

    if (!poll.voters) poll.voters = [];
    poll.voters.push({
      id: `vote-${Date.now()}`,
      pollId: poll.id,
      voterId: effectiveVoterId,
      voterName: voterName || 'Anonymous Constituent',
      ward: ward || 'Constituency Voter',
      selectedOptionId: optionId,
      timestamp: new Date().toISOString()
    });

    persistStore();

    res.json({ 
      success: true, 
      message: 'Vote cast and securely recorded in official constituency ballot ledger.',
      poll 
    });
  });

  // ==========================================
  // PETITIONS & GRIEVANCE REDRESS API
  // ==========================================
  app.get('/api/petitions', async (req, res) => {
    const active = createSupabaseClient() || supabase;
    if (active) {
      try {
        const { data, error } = await active.from('petitions').select('*').order('submittedDate', { ascending: false });
        if (!error && data && data.length > 0) {
          store.petitions = data;
        }
      } catch {}
    }
    res.json(store.petitions);
  });

  app.post('/api/petitions', (req, res) => {
    const {
      title,
      category,
      petitionerName,
      petitionerEmail,
      petitionerPhone,
      ward,
      localGovernment,
      address,
      description,
      expectedImpact,
      signatoriesCount,
      supportingDocName
    } = req.body;

    if (!title || !petitionerName || !petitionerEmail || !ward || !description) {
      return res.status(400).json({ error: 'Missing required petition information.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newPetition: CommunityPetition = {
      id: `pet-${Date.now()}`,
      referenceNumber: `PET-YS-${new Date().getFullYear()}-${randomSuffix}`,
      title,
      category: category || 'Infrastructure & Roads',
      petitionerName,
      petitionerEmail,
      petitionerPhone: petitionerPhone || '',
      ward,
      localGovernment: localGovernment || 'Yabo',
      address: address || '',
      description,
      expectedImpact: expectedImpact || 'Community welfare and infrastructural enhancement',
      signatoriesCount: Number(signatoriesCount) || 1,
      supportingDocName,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      reviewNotes: 'Newly received from constituent portal. Queued for administrative triage.'
    };

    store.petitions.unshift(newPetition);
    persistStore();
    res.status(201).json(newPetition);
  });

  app.put('/api/petitions/:id', (req, res) => {
    const { id } = req.params;
    const index = store.petitions.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Petition not found' });
    store.petitions[index] = { 
      ...store.petitions[index], 
      ...req.body, 
      id,
      updatedAt: new Date().toISOString()
    };
    persistStore();
    res.json(store.petitions[index]);
  });

  app.delete('/api/petitions/:id', (req, res) => {
    const { id } = req.params;
    store.petitions = store.petitions.filter(p => p.id !== id);
    persistStore();
    res.json({ success: true });
  });

  // Automated respectful professional decision dispatch
  app.post('/api/petitions/:id/decision', (req, res) => {
    const { id } = req.params;
    const { status, customRationale, reviewNotes, signatory, sentBy, channels } = req.body;

    if (status !== 'Approved' && status !== 'Rejected') {
      return res.status(400).json({ error: 'Decision status must be either "Approved" or "Rejected".' });
    }

    const petition = store.petitions.find(p => p.id === id);
    if (!petition) return res.status(404).json({ error: 'Petition not found.' });

    const sentTimestamp = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZoneName: 'short' 
    });

    let decisionMessage: PetitionDecisionMessage;

    if (status === 'Approved') {
      decisionMessage = {
        id: `msg-${Date.now()}`,
        petitionId: petition.id,
        status: 'Approved',
        recipientName: petition.petitionerName,
        recipientEmail: petition.petitionerEmail || petition.email || 'constituent@danmayeyabo.gov.ng',
        recipientPhone: petition.petitionerPhone || petition.phone,
        subject: `OFFICIAL DECISION: Petition Approved — "${petition.title}" (Ref: ${petition.referenceNumber})`,
        officialGreeting: `Dear ${petition.petitionerName} and Community Co-Signatories,`,
        decisionSummary: `On behalf of the Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency at the House of Representatives, we write to officially and warmly inform you that your community petition regarding "${petition.title}" has been reviewed by the Legislative Oversight & Constituency Development Committee and has been formally APPROVED.`,
        detailedRationale: customRationale || `Our technical liaison desk conducted an appraisal of the needs articulated in your petition and verified the significant grassroots impact for ${petition.ward || 'Yabo/Shagari'}. Hon. Umar Yusuf has approved the formal appropriation and scheduling of this project into the upcoming constituency intervention cycle.`,
        communityEncouragement: `We commend your exemplary civic leadership and constructive engagement. Vibrant, peaceful citizen advocacy is the cornerstone of sustainable community development across Yabo and Shagari. We urge you to maintain this commendable spirit of active civic stewardship.`,
        nextStepsOrAlternatives: `The Constituency Project Implementation Bureau will maintain direct contact with you and community elders regarding project mobilization and execution timelines.`,
        signatory: signatory || 'Secretariat, Office of Hon. Umar Yusuf (Danmaje Yabo), House of Representatives, National Assembly, Abuja',
        sentAt: sentTimestamp,
        sentBy: sentBy || 'Chief Administrator',
        deliveryChannels: channels || ['Email', 'SMS', 'Constituency Portal']
      };
    } else {
      decisionMessage = {
        id: `msg-${Date.now()}`,
        petitionId: petition.id,
        status: 'Rejected',
        recipientName: petition.petitionerName,
        recipientEmail: petition.petitionerEmail || petition.email || 'constituent@danmayeyabo.gov.ng',
        recipientPhone: petition.petitionerPhone || petition.phone,
        subject: `OFFICIAL COMMUNICATION: Community Petition Status — "${petition.title}" (Ref: ${petition.referenceNumber})`,
        officialGreeting: `Dear ${petition.petitionerName},`,
        decisionSummary: `The Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, presents its highest regards and conveys sincere appreciation for your community dedication and for bringing "${petition.title}" to our attention. Following careful statutory, technical, and fiscal evaluation, we regret to inform you that this specific petition cannot be approved under the current legislative cycle.`,
        detailedRationale: customRationale || `Our legislative committee determined that the requested intervention falls within municipal/state jurisdiction or exceeds allowable statutory caps for the current fiscal appropriation cycle. We believe in providing transparent, truthful governance to every constituent.`,
        communityEncouragement: `While this particular proposal could not be approved at this juncture, Hon. Umar Yusuf strongly encourages you, your fellow signatories, and local community associations to continue your active and constructive participation in community development. Your voice is vital, and your civic commitment is deeply valued.`,
        nextStepsOrAlternatives: `We have registered your community on our priority consultative roster. We encourage you to participate in our ongoing Town Hall polls, submit alternate community proposals, or contact our Ward Liaison Officers regarding our smallholder grant and vocational empowerment schemes.`,
        signatory: signatory || 'Directorate of Public Petitions & Grievance Redress, Office of Hon. Umar Yusuf, House of Representatives',
        sentAt: sentTimestamp,
        sentBy: sentBy || 'Chief Administrator',
        deliveryChannels: channels || ['Email', 'SMS', 'Constituency Portal']
      };
    }

    petition.status = status;
    petition.reviewNotes = reviewNotes || petition.reviewNotes;
    petition.decisionMessage = decisionMessage;
    petition.updatedAt = new Date().toISOString();

    persistStore();

    res.json({
      success: true,
      message: `Petition status marked as ${status} and official respectful decision message dispatched to ${petition.petitionerName} (${petition.petitionerEmail}).`,
      petition,
      decisionMessage
    });
  });

  // ==========================================
  // SECURE AUTHENTICATION, RATE LIMITING & SESSIONS
  // ==========================================
  interface RateLimitRecord {
    attempts: number;
    lockedUntil: number | null;
    lastAttempt: number;
  }
  const loginRateLimitMap = new Map<string, RateLimitRecord>();

  interface AdminSession {
    token: string;
    userId: string;
    email: string;
    role: 'Super Administrator' | 'Office Administrator';
    officeId?: string;
    officeName?: string;
    expiresAt: number;
  }
  const activeSessions = new Map<string, AdminSession>();

  function getClientIp(req: express.Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown-ip';
  }

  function getAuthenticatedSession(req: express.Request): AdminSession | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7).trim();
    const session = activeSessions.get(token);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return null;
    }
    return session;
  }

  // Admin Login with rate limiting, salted password verification & office status check
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    const clientIp = getClientIp(req);
    const now = Date.now();

    // 1. Enforce Rate Limiting & Brute-force Lockout
    const rateRecord = loginRateLimitMap.get(clientIp);
    if (rateRecord && rateRecord.lockedUntil) {
      if (now < rateRecord.lockedUntil) {
        const remainingMinutes = Math.ceil((rateRecord.lockedUntil - now) / 60000);
        return res.status(429).json({
          error: `Too many failed login attempts. Security lockout active. Please wait ${remainingMinutes} minute(s) before trying again.`
        });
      } else {
        loginRateLimitMap.delete(clientIp);
      }
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = store.adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

    // Verify Password using cryptographic scrypt hash and timing-safe comparison
    let isPasswordValid = false;
    if (user && user.salt && user.passwordHash) {
      isPasswordValid = verifyPassword(password, user.salt, user.passwordHash);
    } else if (cleanEmail === 'admin@danmayeyabo.gov.ng' && (password === 'DANMAJEFOREVER' || password === 'password123')) {
      // Fallback transition for initial setup: re-hash and save
      isPasswordValid = true;
      if (user) {
        user.salt = crypto.randomBytes(16).toString('hex');
        user.passwordHash = hashPassword(password, user.salt);
        persistStore();
      }
    }

    if (!user || !isPasswordValid) {
      // Track failed attempt
      const record = loginRateLimitMap.get(clientIp) || { attempts: 0, lockedUntil: null, lastAttempt: now };
      record.attempts += 1;
      record.lastAttempt = now;

      if (record.attempts >= 5) {
        record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
        loginRateLimitMap.set(clientIp, record);
        return res.status(429).json({
          error: 'Maximum failed login attempts reached (5/5). Access locked for 15 minutes to safeguard constituency parliamentary records.'
        });
      }

      loginRateLimitMap.set(clientIp, record);
      const remaining = 5 - record.attempts;
      return res.status(401).json({
        error: `Invalid email or password. Authentication failed. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before security lock)`
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'This administrator account has been deactivated. Please contact the Chief Super Administrator.'
      });
    }

    // Check office status if assigned to an office
    let userOffice: ConstituencyOffice | undefined;
    if (user.officeId) {
      userOffice = store.offices.find(o => o.id === user.officeId);
      if (userOffice && userOffice.status === 'Inactive') {
        return res.status(403).json({
          error: `Your assigned office (${userOffice.name}) is currently inactive. Contact the Super Administrator for reactivation.`
        });
      }
    }

    // Authentication Success: Reset rate limits for client IP
    loginRateLimitMap.delete(clientIp);

    // Generate secure 32-byte session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24-hour validity

    activeSessions.set(token, {
      token,
      userId: user.id,
      email: user.email,
      role: user.role,
      officeId: user.officeId,
      officeName: user.officeName || userOffice?.name,
      expiresAt
    });

    user.lastLogin = new Date().toISOString();
    persistStore();

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        officeId: user.officeId,
        officeName: user.officeName || userOffice?.name,
        lastLogin: user.lastLogin
      },
      office: userOffice || null
    });
  });

  // Verify active session token
  app.get('/api/admin/verify-session', (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid.' });
    }

    const user = store.adminUsers.find(u => u.id === session.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ valid: false, error: 'User no longer active.' });
    }

    let office: ConstituencyOffice | undefined;
    if (user.officeId) {
      office = store.offices.find(o => o.id === user.officeId);
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        officeId: user.officeId,
        officeName: user.officeName || office?.name,
        lastLogin: user.lastLogin
      },
      office: office || null
    });
  });

  // Logout session invalidation
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      activeSessions.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // ==========================================
  // CONSTITUENCY OFFICES & RBAC API
  // ==========================================
  app.get('/api/offices', (req, res) => {
    res.json(store.offices);
  });

  app.post('/api/offices', (req, res) => {
    const { name, code, location, description, headOfOffice, contactEmail, contactPhone, status, authorizedTabs, assignedAdminEmails } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Office name and office code are required.' });
    }

    const newOffice: ConstituencyOffice = {
      id: `off-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      location: location || 'Danmaje Civic Liaison Secretariat, Yabo Metropolis',
      description: description || 'Official Constituency Functional Bureau',
      headOfOffice: headOfOffice || 'Constituency Officer',
      contactEmail: contactEmail || 'office@danmayeyabo.gov.ng',
      contactPhone: contactPhone || '+234 803 000 0000',
      status: status === 'Inactive' ? 'Inactive' : 'Active',
      authorizedTabs: Array.isArray(authorizedTabs) && authorizedTabs.length > 0 ? authorizedTabs : ['overview'],
      assignedAdminEmails: Array.isArray(assignedAdminEmails) ? assignedAdminEmails : [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    store.offices.unshift(newOffice);
    persistStore();
    res.status(201).json(newOffice);
  });

  app.put('/api/offices/:id', (req, res) => {
    const { id } = req.params;
    const index = store.offices.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ error: 'Office not found.' });

    store.offices[index] = {
      ...store.offices[index],
      ...req.body,
      id,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // If office name was changed, sync officeName in assigned admin users
    if (req.body.name) {
      store.adminUsers.forEach(u => {
        if (u.officeId === id) {
          u.officeName = req.body.name;
        }
      });
    }

    persistStore();
    res.json(store.offices[index]);
  });

  app.delete('/api/offices/:id', (req, res) => {
    const { id } = req.params;
    store.offices = store.offices.filter(o => o.id !== id);
    // Unassign users from deleted office
    store.adminUsers.forEach(u => {
      if (u.officeId === id) {
        u.officeId = undefined;
        u.officeName = undefined;
      }
    });
    persistStore();
    res.json({ success: true });
  });

  // ==========================================
  // ADMIN USERS DIRECTORY & ASSIGNMENTS API
  // ==========================================
  app.get('/api/admin/users', (req, res) => {
    // Return users without exposing hashes or salts
    const safeUsers = store.adminUsers.map(({ passwordHash, salt, ...rest }) => rest);
    res.json(safeUsers);
  });

  app.post('/api/admin/users', (req, res) => {
    const { name, email, role, officeId, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (store.adminUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ error: 'An administrator account with this email already exists.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const pwd = password || (role === 'Super Administrator' ? 'DANMAJEFOREVER' : 'OfficePass2026!');
    const passwordHash = hashPassword(pwd, salt);

    let officeName: string | undefined;
    if (officeId) {
      const office = store.offices.find(o => o.id === officeId);
      if (office) {
        officeName = office.name;
        if (!office.assignedAdminEmails.includes(cleanEmail)) {
          office.assignedAdminEmails.push(cleanEmail);
        }
      }
    }

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: role === 'Super Administrator' ? 'Super Administrator' : 'Office Administrator',
      officeId: role === 'Super Administrator' ? undefined : officeId,
      officeName: role === 'Super Administrator' ? 'Executive Master Control (All Offices)' : officeName,
      passwordHash,
      salt,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    store.adminUsers.unshift(newUser);
    persistStore();

    const { passwordHash: _ph, salt: _s, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  });

  app.put('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    const index = store.adminUsers.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ error: 'User not found.' });

    const targetUser = store.adminUsers[index];
    const { name, role, officeId, isActive, password } = req.body;

    if (name) targetUser.name = name.trim();
    if (role) targetUser.role = role;
    if (typeof isActive === 'boolean') targetUser.isActive = isActive;

    if (officeId !== undefined) {
      targetUser.officeId = officeId || undefined;
      const office = store.offices.find(o => o.id === officeId);
      targetUser.officeName = office ? office.name : undefined;
    }

    if (password && password.trim().length >= 6) {
      const salt = crypto.randomBytes(16).toString('hex');
      targetUser.salt = salt;
      targetUser.passwordHash = hashPassword(password.trim(), salt);
    }

    persistStore();

    const { passwordHash: _ph, salt: _s, ...safeUser } = targetUser;
    res.json(safeUser);
  });

  app.delete('/api/admin/users/:id', (req, res) => {
    const { id } = req.params;
    const user = store.adminUsers.find(u => u.id === id);
    if (user && user.role === 'Super Administrator' && store.adminUsers.filter(u => u.role === 'Super Administrator').length <= 1) {
      return res.status(400).json({ error: 'Cannot delete the primary Chief Super Administrator account.' });
    }
    store.adminUsers = store.adminUsers.filter(u => u.id !== id);
    persistStore();
    res.json({ success: true });
  });

  // Setup Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  return app;
}

if (process.env.VERCEL !== '1') {
  startServer().then(app => {
    const PORT = process.env.PORT || 3000;
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}
