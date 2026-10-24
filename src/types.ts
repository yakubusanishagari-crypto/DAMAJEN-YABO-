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

export type LegislativeStatus = 
  | 'Proposed' 
  | 'Under Review' 
  | 'Approved' 
  | 'Rejected' 
  | 'Passed' 
  | 'First Reading' 
  | 'Second Reading' 
  | 'Committee Stage' 
  | 'Third Reading' 
  | 'Adopted' 
  | 'Introduced' 
  | 'Pending' 
  | 'Assented' 
  | 'Withdrawn';

export interface LegislativeRecord {
  id: string;
  title: string;
  category: 'Bill' | 'Motion' | 'Committee' | 'Parliamentary Question' | 'Petition' | 'Constituency Intervention' | string;
  status: LegislativeStatus;
  date: string;
  description: string;
  documentUrl?: string;
  source?: string;
  coSponsors?: string[];
  statusNotes?: string;
  statusUpdatedAt?: string;
  statusUpdatedBy?: string;
}

export type ProgramStatus = 'Active' | 'Upcoming' | 'Closed';

export interface EmpowermentProgram {
  id: string;
  title: string;
  category: 'Skills Acquisition' | 'Youth Development' | 'Women Empowerment' | 'Educational Support' | 'Small Business Grant' | 'Agricultural Support' | string;
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
  category: 'Press Release' | 'Constituency News' | 'Legislative Update' | 'Speech' | 'Event' | string;
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
  category: 'Projects' | 'Constituency Visits' | 'National Assembly' | 'Empowerment' | 'Town Halls' | 'Interviews & Debates' | string;
  imageUrl: string;
  videoUrl?: string;
  showOnHomepage?: boolean;
  youtubeTitle?: string;
  date: string;
  description: string;
  hasDownloadPermission?: boolean;
  downloadUrl?: string;
  downloadFileSize?: string;
  downloadQuality?: string;
  permissionNote?: string;
  officialChannelUrl?: string;
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

  // Automated Petitioner Communication & Civic Encouragement
  petitionerDecisionMessage?: PetitionerDecisionMessage;
  decisionHistory?: PetitionerDecisionMessage[];
}

export interface PetitionerDecisionMessage {
  id: string;
  petitionId: string;
  referenceNumber?: string;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  wardOrTown?: string;
  category?: string;
  petitionTitle?: string;
  decision?: 'APPROVED' | 'REJECTED' | 'INITIAL REVIEW' | 'SUBMITTED' | 'Approved' | 'Rejected' | string;
  status?: 'Approved' | 'Rejected' | string;
  decisionTitle?: string;
  salutation?: string;
  officialGreeting?: string;
  executiveSummary?: string;
  decisionSummary?: string;
  detailedReason?: string;
  detailedRationale?: string;
  committedAction?: string;
  nextStepsOrAlternatives?: string;
  civicEncouragement?: string;
  communityEncouragement?: string;
  sentAt: string;
  senderTitle?: string;
  signatory?: string;
  sentBy?: string;
  subject?: string;
  channels?: {
    smsDelivered: boolean;
    portalNotified: boolean;
    emailQueued: boolean;
  };
  deliveryChannels?: string[];
  smsExcerpt?: string;
}

export type PetitionDecisionMessage = PetitionerDecisionMessage;

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
  danmajePartyName?: string;
  opponentVotes: number; 
  opponentPartyName?: string;
  otherPartyVotes: number;
  otherPartyName?: string;
  notes?: string;
  inquiryDetails?: string;
  incidentsReported?: string;
  submittedAt: string;
}

export interface SmsBroadcastRecord {
  id: string;
  senderId: string;
  targetGroup: string;
  recipientsCount: number;
  message: string;
  timestamp: string;
  status: 'DELIVERED' | 'DISPATCHED' | 'FAILED';
  deliveryRate: string;
}

export interface UssdSessionRecord {
  id: string;
  phoneNumber: string;
  serviceCode: string;
  sessionDuration: string;
  menuAccessed: string;
  networkCarrier: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';
  timestamp: string;
  status: 'COMPLETED' | 'TIMEOUT';
}

export type PetitionCategory = 'Infrastructure & Roads' | 'Water & Sanitation' | 'Healthcare' | 'Education' | 'Youth & Employment' | 'Agriculture' | 'Security & Peace' | 'Constituency Petition' | 'General Inquiry';
export type PetitionStatus = 'Submitted' | 'Under Review' | 'In Field Investigation' | 'Committee Hearing' | 'Approved' | 'Rejected' | 'Archived';

export interface CommunityPetition {
  id: string;
  referenceNumber: string;
  title: string;
  category: string;
  petitionerName: string;
  petitionerEmail: string;
  petitionerPhone?: string;
  email?: string;
  phone?: string;
  ward: string;
  targetWard?: string;
  localGovernment?: string;
  address?: string;
  description: string;
  problemStatement?: string;
  proposedSolution?: string;
  expectedImpact?: string;
  signatoriesCount?: number;
  signaturesCount?: number;
  supportingDocName?: string;
  status: 'Submitted' | 'Under Review' | 'In Field Investigation' | 'Committee Hearing' | 'Approved' | 'Rejected' | 'Archived' | string;
  decision?: string | { status?: 'Approved' | 'Rejected' | string; decisionDate?: string; decisionBy?: string; decisionNotes?: string; officialLetter?: string; deliveredVia?: string[]; rationale?: string; [key: string]: any };
  submittedDate: string;
  reviewNotes?: string;
  updatedAt?: string;
  decisionMessage?: PetitionerDecisionMessage;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  votesCount?: number;
}

export interface PollVoterRecord {
  id: string;
  pollId: string;
  voterId: string;
  voterName?: string;
  ward?: string;
  selectedOptionId: string;
  optionId?: string;
  ipHash?: string;
  timestamp: string;
}

export type PollVoteRecord = PollVoterRecord;
export type PollCategory = string;
export type PollStatus = 'Active' | 'Closed' | 'Upcoming' | string;

export interface TownHallPoll {
  id: string;
  title: string;
  question: string;
  description?: string;
  category: string;
  targetWard: string;
  status: 'Active' | 'Closed' | 'Upcoming' | string;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  isFeatured?: boolean;
  totalVotes: number;
  options: PollOption[];
  voters?: PollVoterRecord[];
  votes?: PollVoterRecord[];
}

