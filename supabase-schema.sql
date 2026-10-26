-- ==============================================================================
-- HON. UMAR YUSUF DANMAJE CONSTITUENCY PORTAL - SUPABASE SQL SCHEMA
-- Run this script in the Supabase SQL Editor if setting up a new project or tables.
-- ==============================================================================

-- 1. Storage Buckets Setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('uploads', 'uploads', true, 26214400, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('media', 'media', true, 26214400, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies (Allow public reads and authenticated/service uploads)
CREATE POLICY "Public Read All Buckets"
ON storage.objects FOR SELECT
USING (true);

CREATE POLICY "Public Upload to Uploads Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('uploads', 'media'));

CREATE POLICY "Public Update Uploads Bucket"
ON storage.objects FOR UPDATE
USING (bucket_id IN ('uploads', 'media'));

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  "startDate" TEXT,
  "completionDate" TEXT,
  "budgetNotes" TEXT,
  expenditure TEXT,
  year TEXT,
  currency TEXT DEFAULT '₦',
  contractor TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  updates JSONB DEFAULT '[]'::jsonb,
  date TEXT,
  "isFeatured" BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. News & Press Releases Table
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  "imageUrl" TEXT,
  "videoUrl" TEXT,
  "showOnHomepage" BOOLEAN DEFAULT true,
  "isFeatured" BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gallery & Media Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'photo' | 'video'
  category TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "videoUrl" TEXT,
  "showOnHomepage" BOOLEAN DEFAULT false,
  "youtubeTitle" TEXT,
  date TEXT,
  description TEXT,
  "hasDownloadPermission" BOOLEAN DEFAULT false,
  "downloadUrl" TEXT,
  "downloadFileSize" TEXT,
  "downloadQuality" TEXT,
  "permissionNote" TEXT,
  "officialChannelUrl" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Empowerment Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  "targetBeneficiaries" TEXT,
  "slotsAvailable" NUMERIC DEFAULT 500,
  status TEXT DEFAULT 'Active',
  eligibility TEXT,
  "startDate" TEXT,
  deadline TEXT,
  "isPublished" BOOLEAN DEFAULT true,
  "grantPackage" TEXT,
  "requirePassportPhoto" BOOLEAN DEFAULT true,
  "submissionInstructions" TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  "requiredDocs" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Program Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  "referenceNumber" TEXT UNIQUE,
  "programId" TEXT,
  "programTitle" TEXT,
  "applicantName" TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  "wardOrTown" TEXT,
  qualifications TEXT,
  statement TEXT,
  date TEXT,
  status TEXT DEFAULT 'SUBMITTED',
  "currentStage" TEXT DEFAULT 'SUBMITTED',
  notes TEXT,
  "publicFeedback" TEXT,
  "awardGrantPackage" TEXT,
  "passportPhoto" TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Legislative Records Table
CREATE TABLE IF NOT EXISTS public.legislative (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  date TEXT,
  description TEXT,
  "documentUrl" TEXT,
  source TEXT,
  "coSponsors" JSONB DEFAULT '[]'::jsonb,
  "statusNotes" TEXT,
  "statusUpdatedAt" TEXT,
  "statusUpdatedBy" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Citizen Contacts & Enquiries Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Polls & Petitions Tables
CREATE TABLE IF NOT EXISTS public.polls (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  "totalVotes" NUMERIC DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.petitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  signatures NUMERIC DEFAULT 0,
  goal NUMERIC DEFAULT 1000,
  status TEXT DEFAULT 'Under Review',
  category TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Offices Table
CREATE TABLE IF NOT EXISTS public.offices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lga TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  officer TEXT,
  "authorizedTabs" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add public read / write policies for tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legislative ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.projects FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.news FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.gallery FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.programs FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.applications FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.legislative FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.legislative FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.contacts FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.polls FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.petitions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.petitions FOR ALL USING (true);

CREATE POLICY "Allow public read access" ON public.offices FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON public.offices FOR ALL USING (true);
