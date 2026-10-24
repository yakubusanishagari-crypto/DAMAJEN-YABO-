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
  expenditure?: string;
  year?: string;
  currency?: string;
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
  isPublished?: boolean;
  imageUrl?: string;
  description: string;
  requirements: string[];
  slotsAvailable?: number;
  requiredDocs?: string[];
  stages?: string[];
  grantPackage?: string;
  requirePassportPhoto?: boolean;
  submissionInstructions?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Press Release' | 'Constituency News' | 'Legislative Update' | 'Speech' | 'Event';
  date: string;
  imageUrl: string;
  videoUrl?: string;
  showOnHomepage?: boolean;
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
  showOnHomepage?: boolean;
  youtubeTitle?: string;
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

export type ApplicationStatus = 'SUBMITTED' | 'INITIAL REVIEW' | 'DOCUMENT VERIFICATION' | 'ELIGIBILITY ASSESSMENT' | 'FINAL REVIEW' | 'APPROVED' | 'REJECTED' | 'WAITLISTED' | 'Pending' | 'Reviewing' | 'Declined';

export interface ApplicationHistoryEvent {
  stage: string;
  timestamp: string;
  title: string;
  note?: string;
  actor?: string;
}

export interface AttachedDocument {
  id: string;
  name: string;
  type: string;
  size?: string;
  dataUrl?: string;
  uploadedAt?: string;
}

export interface ProgramApplication {
  id: string;
  referenceNumber: string;
  programId: string;
  programTitle: string;
  programCategory?: string;
  applicantName: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  nin?: string;
  email: string;
  phone: string;
  altPhone?: string;
  lga?: 'Yabo' | 'Shagari' | 'Other';
  wardOrTown: string;
  residentialAddress?: string;
  passportPhoto?: string;
  awardGrantPackage?: string;

  // Education & Employment
  highestEducation?: string;
  institutionName?: string;
  courseOfStudy?: string;
  graduationYear?: string;
  employmentStatus?: string;
  monthlyIncome?: string;
  qualifications: string;

  // Programme Specifics
  statement: string;
  targetGrantUse?: string;
  hasReceivedPreviousSupport?: 'Yes' | 'No';
  previousSupportDetails?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;

  // Attached Documents
  documents?: AttachedDocument[];

  // Tracking & Timeline
  date: string;
  submissionTime?: string;
  status: ApplicationStatus;
  currentStage?: string;
  timeline?: ApplicationHistoryEvent[];
  publicFeedback?: string;
  notes?: string;
  verifiedBy?: string;
}

export interface PollingUnitAgentLink {
  id: string;
  agentName: string;
  localGovernment: string;
  ward: string;
  wardName?: string;
  pollingUnitName: string;
  pollingUnitCode?: string;
  phone: string;
  uniqueToken: string;
  token?: string;
  password: string;
  createdAt: string;
  isUsed: boolean;
  status?: 'PENDING' | 'SUBMITTED';
}

export interface ElectionReport {
  id: string;
  linkId: string;
  agentName: string;
  ward: string;
  localGovernment: string;
  pollingUnitName: string;
  pollingUnitCode: string;
  phone: string;
  totalRegisteredVoters: number;
  totalAccreditedVoters: number;
  totalValidVotes: number;
  rejectedVotes: number;
  danmajeVotes: number; 
  opponentVotes: number; 
  otherPartyVotes: number;
  notes?: string;
  submittedAt: string;
}

