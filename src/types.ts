export type ProjectStatus = 'Proposed' | 'Ongoing' | 'Completed' | 'Suspended';

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Roads & Infrastructure' | 'Education' | 'Healthcare' | 'Water & Sanitation' | 'Youth Development' | 'Women Empowerment' | 'Agriculture' | 'Community Facilities';
  location: string;
  status: ProjectStatus;
  description: string;
  startDate: string;
  completionDate?: string;
  budgetNotes?: string;
  contractor?: string;
  images: string[];
  updates: ProjectUpdate[];
  date: string;
  isFeatured?: boolean;
}

export type LegislativeStatus = 'Introduced' | 'Pending' | 'Passed' | 'Assented' | 'Withdrawn';

export interface LegislativeRecord {
  id: string;
  title: string;
  category: 'Bill' | 'Motion' | 'Committee' | 'Parliamentary Question' | 'Petition';
  status: LegislativeStatus;
  date: string;
  description: string;
  documentUrl?: string;
  source?: string;
  coSponsors?: string[];
}

export type ProgramStatus = 'Active' | 'Upcoming' | 'Closed';

export interface EmpowermentProgram {
  id: string;
  title: string;
  category: 'Skills Acquisition' | 'Youth Development' | 'Women Empowerment' | 'Educational Support' | 'Small Business Grant' | 'Agricultural Support';
  eligibility: string;
  targetBeneficiaries: string;
  startDate: string;
  deadline: string;
  status: ProgramStatus;
  description: string;
  requirements: string[];
  slotsAvailable?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Press Release' | 'Constituency News' | 'Legislative Update' | 'Speech' | 'Event';
  date: string;
  imageUrl: string;
  author: string;
  isFeatured?: boolean;
  tags: string[];
}

export type MediaType = 'photo' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  type?: MediaType;
  category: 'Projects' | 'Constituency Visits' | 'National Assembly' | 'Empowerment' | 'Town Halls' | 'Interviews & Debates';
  imageUrl: string;
  videoUrl?: string;
  date: string;
  description: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'General Inquiry' | 'Project Support' | 'Community Issue' | 'Empowerment Inquiry' | 'Media Request';
  message: string;
  date: string;
  status: 'Unread' | 'In Progress' | 'Resolved';
}

export interface ProgramApplication {
  id: string;
  programId: string;
  programTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  wardOrTown: string;
  qualifications: string;
  statement: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Reviewing' | 'Declined';
}
