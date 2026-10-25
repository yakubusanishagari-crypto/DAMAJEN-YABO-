import { 
  Project, 
  LegislativeRecord, 
  EmpowermentProgram, 
  NewsArticle, 
  GalleryItem, 
  ContactSubmission,
  TownHallPoll,
  CommunityPetition,
  ConstituencyOffice,
  AdminUser
} from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Yabo Central Solar-Powered Water Supply Scheme',
    category: 'Water & Sanitation',
    location: 'Yabo Town Central, Yabo LGA',
    status: 'Completed',
    description: 'Installation of high-capacity solar-powered motorized boreholes with overhead storage tanks and multiple fetching points to provide clean, reliable potable water to over 15,000 residents and public institutions.',
    startDate: '2025-03-10',
    completionDate: '2025-08-20',
    budgetNotes: 'Constituency Development Allocation 2024/2025',
    contractor: 'HydraTech Engineering Ltd.',
    images: [
      '/solar_water_project_1792063316637.jpg',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000'
    ],
    updates: [
      { id: 'u1', date: '2025-06-15', title: 'Solar Panels and Pump Installation', description: 'Mounting of 24 heavy-duty solar panels and submersible pumps completed successfully.' },
      { id: 'u2', date: '2025-08-20', title: 'Commissioning & Handover', description: 'Project commissioned in the presence of community elders, youth leaders, and local government officials.' }
    ],
    date: '2025-03-10',
    isFeatured: true
  },
  {
    id: 'proj-2',
    title: 'Shagari Model Secondary School Science Laboratory Upgrade',
    category: 'Education',
    location: 'Government Secondary School, Shagari',
    status: 'Ongoing',
    description: 'Comprehensive rehabilitation and modernization of physics, chemistry, and biology laboratories equipped with modern apparatus, computers, and furniture to support STEM education for students across Shagari LGA.',
    startDate: '2025-06-01',
    budgetNotes: 'Federal Capital Constituency Project',
    contractor: 'BuildCraft Consults Nigeria',
    images: [
      '/science_lab_renovation_1792063333276.jpg',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1000'
    ],
    updates: [
      { id: 'u3', date: '2025-07-10', title: 'Structural Renovation', description: 'Roofing and floor tiling completed. Electrical and plumbing rewiring currently underway.' }
    ],
    date: '2025-05-15',
    isFeatured: true
  },
  {
    id: 'proj-3',
    title: 'Yabo-Shagari Rural Agrarian Access Road Grading',
    category: 'Roads & Infrastructure',
    location: 'Connecting Yabo and Shagari farming clusters',
    status: 'Ongoing',
    description: 'Grading, laterite filling, and drainage clearing of 35 kilometers of vital agricultural access routes to facilitate seamless transportation of farm produce to urban markets and reduce post-harvest losses.',
    startDate: '2025-04-12',
    budgetNotes: 'Federal Ministry of Works Collaborative Intervention',
    contractor: 'Zenith Earthmovers Ltd.',
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000'
    ],
    updates: [
      { id: 'u4', date: '2025-07-01', title: 'Phase 1 Culvert Construction', description: 'Construction of 6 concrete culverts across seasonal waterways finished.' }
    ],
    date: '2025-04-01',
    isFeatured: true
  },
  {
    id: 'proj-4',
    title: 'Primary Healthcare Centre Renovation & Maternity Ward Extension',
    category: 'Healthcare',
    location: 'Bodinga/Yabo Border Ward',
    status: 'Completed',
    description: 'Construction of a fully equipped maternity ward, solar backup power installation, and supply of essential maternal drugs to ensure 24-hour healthcare delivery for nursing mothers and infants.',
    startDate: '2024-11-10',
    completionDate: '2025-04-15',
    budgetNotes: 'Primary Healthcare Intervention Fund',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000'
    ],
    updates: [
      { id: 'u5', date: '2025-04-15', title: 'Handover to State Primary Healthcare Board', description: 'Facility fully handed over with resident midwives and medical supplies deployed.' }
    ],
    date: '2024-11-10',
    isFeatured: false
  },
  {
    id: 'proj-5',
    title: 'Yabo Youth Digital Skills & Innovation Hub',
    category: 'Youth Development',
    location: 'Yabo Metropolis',
    status: 'Proposed',
    description: 'Establishment of a 50-workstation computer training center equipped with high-speed internet, solar power, and certified trainers to train constituents in coding, digital marketing, and entrepreneurship.',
    startDate: '2025-10-01',
    budgetNotes: 'Legislative Constituency Initiative',
    images: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000'
    ],
    updates: [],
    date: '2025-09-01',
    isFeatured: true
  }
];

export const INITIAL_LEGISLATIVE: LegislativeRecord[] = [
  {
    id: 'leg-1',
    title: 'A Bill for an Act to Establish the Federal College of Agricultural Technology, Yabo',
    category: 'Bill',
    status: 'Under Review',
    statusNotes: 'Referred to House Committee on Agricultural Colleges and Research for clause-by-clause stakeholder review.',
    statusUpdatedAt: '2026-03-14',
    statusUpdatedBy: 'Chief Administrator',
    date: '2025-05-18',
    description: 'Sponsored legislation aimed at boosting agricultural research, advanced farming techniques, and middle-level manpower training for youth in Sokoto State and Northwestern Nigeria.',
    documentUrl: '#',
    source: 'National Assembly Official Gazette',
    coSponsors: ['Hon. Aminu Bello', 'Hon. Zainab Ahmed']
  },
  {
    id: 'leg-2',
    title: 'Motion on the Urgent Need for Ecological Intervention on Erosion Sites in Yabo and Shagari LGAs',
    category: 'Motion',
    status: 'Passed',
    statusNotes: 'Adopted unanimously at Plenary session; ecological agency mobilized to commencement.',
    statusUpdatedAt: '2025-03-22',
    statusUpdatedBy: 'Chief Administrator',
    date: '2025-03-22',
    description: 'Successfully moved a motion drawing federal attention to severe gully erosion threatening farmlands and residential settlements across Yabo and Shagari, leading to a mandate for ecological funds deployment.',
    documentUrl: '#',
    source: 'Votes and Proceedings, House of Representatives'
  },
  {
    id: 'leg-3',
    title: 'A Bill to Amend the Universal Basic Education Act to Enhance Nomadic and Rural School Funding',
    category: 'Bill',
    status: 'Approved',
    statusNotes: 'Approved by plenary session for third reading and final transmission.',
    statusUpdatedAt: '2025-11-20',
    statusUpdatedBy: 'Chief Administrator',
    date: '2025-07-14',
    description: 'Legislative proposal to secure dedicated matching grants for nomadic pastoralist education and mobile classroom facilities in remote agrarian settlements.',
    documentUrl: '#',
    source: 'National Assembly Legislative Journal'
  },
  {
    id: 'leg-4',
    title: 'Motion on Expanding Rural Electrification and Grid Reliability in Agrarian Communities',
    category: 'Motion',
    status: 'Passed',
    statusNotes: 'Passed and transmitted to Federal Ministry of Power and REA.',
    statusUpdatedAt: '2024-11-30',
    statusUpdatedBy: 'Chief Administrator',
    date: '2024-11-30',
    description: 'Addressed power outages affecting micro-industries and irrigation pumps in Yabo/Shagari, securing approval for step-down transformer installations.',
    documentUrl: '#',
    source: 'House Hansard Records'
  },
  {
    id: 'leg-5',
    title: 'A Bill for an Act to Provide Strategic Grain Silos and Modern Post-Harvest Infrastructure in Sokoto South-West',
    category: 'Bill',
    status: 'Proposed',
    statusNotes: 'Formulated in consultation with farmer associations across Yabo and Shagari; awaiting formal presentation.',
    statusUpdatedAt: '2026-06-15',
    statusUpdatedBy: 'Chief Administrator',
    date: '2026-06-15',
    description: 'Proposed legislative intervention to eliminate post-harvest crop rot and stabilize farmer income through federally supported grain storage terminals.',
    documentUrl: '#',
    source: 'House Legislative Drafting Service'
  },
  {
    id: 'leg-6',
    title: 'Motion Requesting Reclassification of Sokoto-Jega Federal Road Toll Free Zone',
    category: 'Motion',
    status: 'Rejected',
    statusNotes: 'Debated at plenary; stepped down as incompatible with national toll policy; substituted with direct road rehabilitation motion.',
    statusUpdatedAt: '2025-09-18',
    statusUpdatedBy: 'Chief Administrator',
    date: '2025-09-18',
    description: 'Motion seeking toll-free designation along agrarian commercial transit lines; rejected in plenary and redirected to direct road reconstruction funding.',
    documentUrl: '#',
    source: 'National Assembly Votes & Proceedings'
  }
];

export const INITIAL_PROGRAMS: EmpowermentProgram[] = [
  {
    id: 'prog-1',
    title: 'Danmaje Yabo Dry-Season Farming & Fertilizer Support Initiative',
    category: 'Agricultural Support',
    eligibility: 'Registered smallholder farmers residing in Yabo and Shagari LGAs',
    targetBeneficiaries: '2,500 Farmers',
    startDate: '2026-01-10',
    deadline: '2026-11-25',
    status: 'Active',
    isPublished: true,
    description: 'Provision of subsidized NPK and Urea fertilizers, improved maize and wheat seedlings, and solar water pumps for dry-season irrigation farmers.',
    requirements: ['Voter Card (PVC) from Yabo/Shagari', 'Farmer Cooperative Membership ID', 'Passport photograph'],
    requiredDocs: ['National Identity Card (NIN)', 'LGA Indigene Certificate', 'Farmer Cooperative ID'],
    slotsAvailable: 2500
  },
  {
    id: 'prog-2',
    title: 'Constituency Tertiary Scholarship & Educational Support Scheme',
    category: 'Educational Support',
    eligibility: 'Indigent students of Yabo and Shagari enrolled in Nigerian public universities and polytechnics',
    targetBeneficiaries: '1,000 Tertiary Students',
    startDate: '2026-02-01',
    deadline: '2026-12-15',
    status: 'Active',
    isPublished: true,
    description: 'Direct bursary and tuition support grants disbursed to deserving undergraduate, polytechnic, and college of education students from Yabo/Shagari Federal Constituency.',
    requirements: ['Current Semester Registration Evidence', 'Student ID Card from Accredited Tertiary Institution', 'Minimum 2.50 CGPA or equivalent'],
    requiredDocs: ['National Identity Card (NIN)', 'LGA Indigene Certificate', 'Admission Letter / Student ID', 'Current Transcript / Result Slip'],
    slotsAvailable: 1000
  },
  {
    id: 'prog-3',
    title: 'Yabo/Shagari Youth ICT & Smartphone Repairs Training Scheme',
    category: 'Skills Acquisition',
    eligibility: 'Unemployed youth aged 18-35 from the constituency',
    targetBeneficiaries: '500 Youth',
    startDate: '2026-03-01',
    deadline: '2026-11-30',
    status: 'Active',
    isPublished: true,
    description: 'Three-month intensive practical training in mobile phone troubleshooting, computer maintenance, and startup toolkits provided upon graduation.',
    requirements: ['Minimum Senior Secondary School Certificate', 'Guarantor form from community leader', 'Passport photograph'],
    requiredDocs: ['National Identity Card (NIN)', 'LGA Indigene Certificate', 'SSCE / WAEC / NECO Result'],
    slotsAvailable: 500
  },
  {
    id: 'prog-4',
    title: 'Women Micro-Enterprise Capital Grant Programme',
    category: 'Women Empowerment',
    eligibility: 'Market women and rural female entrepreneurs',
    targetBeneficiaries: '1,200 Women',
    startDate: '2026-04-15',
    deadline: '2026-12-20',
    status: 'Active',
    isPublished: true,
    description: 'Financial grants and bookkeeping training to support petty trading, poultry farming, and cottage agro-processing enterprises.',
    requirements: ['Women Cooperative Group Membership', 'Valid means of identification'],
    requiredDocs: ['National Identity Card (NIN)', 'LGA Indigene Certificate'],
    slotsAvailable: 1200
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Hon. Umar Yusuf Danmaje Inspects Ongoing Solar Water Projects Across Yabo Wards',
    excerpt: 'The federal lawmaker reaffirmed his commitment to ensuring every community in Yabo and Shagari has access to clean, potable drinking water before the end of the legislative year.',
    content: `Abuja & Yabo — In fulfillment of his campaign promises and constituency service mandate, Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, embarked on a comprehensive inspection tour of ongoing water and infrastructural projects across the constituency.\n\nDuring the tour, Hon. Danmaje inspected the newly completed solar-powered water schemes in Yabo Central, Kuchi, and Shagari urban wards. While interacting with community leaders and residents, the lawmaker emphasized that water is life and priority must be given to basic human needs.\n\n"Our people deserve the best. We will continue to collaborate with relevant federal agencies and development partners to attract projects that directly touch the lives of our constituents," Danmaje stated during a town hall meeting with elders and youth representatives.\n\nCommunity leaders expressed immense gratitude for the prompt execution of the projects, noting that perennial water scarcity in the area has been drastically alleviated.`,
    category: 'Constituency News',
    date: '2025-09-14',
    imageUrl: '/solar_water_project_1792063316637.jpg',
    author: 'Office of the Media Assistant',
    isFeatured: true,
    tags: ['Water Project', 'Yabo', 'Shagari', 'Constituency Tour']
  },
  {
    id: 'news-2',
    title: 'Danmaje Sponsors Bill for Federal College of Agrilcultural Technology, Yabo',
    excerpt: 'The landmark bill scaled second reading at the House of Representatives, receiving widespread commendation from lawmakers across geopolitical divides.',
    content: `Abuja — A major legislative milestone was achieved yesterday as the bill sponsored by Hon. Umar Yusuf (Danmaje Yabo) seeking to establish the Federal College of Agricultural Technology, Yabo, successfully passed its second reading on the floor of the House of Representatives.\n\nLeading the debate, Hon. Danmaje highlighted the immense agricultural potential of Yabo/Shagari and the wider Sokoto region. He noted that the institution will serve as a hub for agricultural research, youth skill development, and mechanized farming innovation.\n\n"Agriculture remains the mainstay of our economy in Northern Nigeria. By establishing this college, we are equipping our youth with modern scientific knowledge to transform subsistence farming into a lucrative commercial enterprise," Danmaje argued before the plenary.\n\nThe Speaker commended the sponsor for the thoughtful legislative initiative, referring the bill to the relevant committee for further legislative action and public hearing.`,
    category: 'Legislative Update',
    date: '2025-07-19',
    imageUrl: '/national_assembly_chamber_1792063300782.jpg',
    author: 'Legislative Desk, National Assembly',
    isFeatured: true,
    tags: ['Agriculture', 'Bills', 'National Assembly', 'Education']
  },
  {
    id: 'news-3',
    title: 'Over 2,000 Farmers Benefit from Danmaje Agricultural Input Distribution',
    excerpt: 'Dry-season farming inputs including high-yield seeds, fertilizers, and water pumps distributed to cooperative farmers in Yabo and Shagari.',
    content: `Yabo Town — In a bid to boost food security and economic empowerment in Yabo/Shagari Federal Constituency, Hon. Umar Yusuf (Danmaje Yabo) has flagged off the distribution of subsidized agricultural inputs to over 2,000 registered farmers.\n\nThe flag-off ceremony, held at the Yabo Local Government Secretariat, witnessed enthusiastic turnout from farmers, cooperative leaders, and traditional title holders.\n\nSpeaking at the event, Hon. Danmaje reiterated his unwavering dedication to grassroots economic development. "Farming is the pride of our heritage. We are determined to remove bottlenecks and provide our hardworking farmers with the tools needed for bumper harvests," he said.\n\nBeneficiaries praised the transparent distribution process, noting that the timely arrival of fertilizers and pumps will significantly enhance their dry-season productivity.`,
    category: 'Press Release',
    date: '2025-05-04',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4f6c4f7cad13?auto=format&fit=crop&q=80&w=1000',
    author: 'Constituency Communications',
    isFeatured: false,
    tags: ['Agriculture', 'Empowerment', 'Farmers']
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-vid-1',
    title: 'Plenary Debate: Federal College of Agricultural Technology Yabo Bill',
    youtubeTitle: 'Plenary Debate: Federal College of Agricultural Technology Yabo Bill',
    type: 'video',
    category: 'National Assembly',
    imageUrl: 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    showOnHomepage: true,
    date: '2025-07-19',
    description: 'Hon. Umar Yusuf Danmaje leading the debate during plenary session at the Green Chamber, advocating for agricultural education and research for Sokoto State.',
    hasDownloadPermission: false,
    officialChannelUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    permissionNote: 'Broadcast under National Assembly Parliamentary Television license. In accordance with YouTube terms of service, direct MP4 downloading is restricted; constituents may stream or use official YouTube offline options.'
  },
  {
    id: 'gal-vid-2',
    title: 'Constituency Documentary: Solar Water Project Inspection in Yabo',
    youtubeTitle: 'Constituency Documentary: Solar Water Project Inspection in Yabo',
    type: 'video',
    category: 'Projects',
    imageUrl: 'https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    showOnHomepage: false,
    date: '2025-08-20',
    description: 'Field report showing the completed motorized solar-powered water schemes serving rural communities in Yabo and Shagari.',
    hasDownloadPermission: true,
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    downloadFileSize: '28.4 MB',
    downloadQuality: '1080p Full HD MP4',
    permissionNote: 'Official Constituency Media Unit Master Footage — Website owner grants full public authorization for educational, broadcast, and community download.'
  },
  {
    id: 'gal-vid-3',
    title: 'Constituency Empowerment & Agricultural Input Flag-off Documentary',
    youtubeTitle: 'Constituency Empowerment & Agricultural Input Flag-off Documentary',
    type: 'video',
    category: 'Empowerment',
    imageUrl: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    showOnHomepage: false,
    date: '2025-05-04',
    description: 'Special broadcast documenting the flag-off ceremony of subsidized fertilizer and solar pump distribution to over 2,000 smallholder farmers.',
    hasDownloadPermission: true,
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    downloadFileSize: '35.6 MB',
    downloadQuality: '720p HD MP4',
    permissionNote: 'Official Constituency Media Unit Production — Authorized for Public Download.'
  },
  {
    id: 'gal-1',
    title: 'Hon. Umar Yusuf Danmaje addressing the House of Representatives Plenary',
    type: 'photo',
    category: 'National Assembly',
    imageUrl: '/national_assembly_chamber_1792063300782.jpg',
    date: '2025-07-19',
    description: 'Presenting the debate for the establishment of the Federal College of Agricultural Technology, Yabo.'
  },
  {
    id: 'gal-2',
    title: 'Commissioning of Solar Water Project in Yabo Central',
    type: 'photo',
    category: 'Projects',
    imageUrl: '/solar_water_project_1792063316637.jpg',
    date: '2025-08-20',
    description: 'Unveiling the motorized solar borehole facility with community elders and youth leaders.'
  },
  {
    id: 'gal-3',
    title: 'Constituency Town Hall Meeting with Elders and Youth Leaders',
    type: 'photo',
    category: 'Town Halls',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000',
    date: '2025-06-11',
    description: 'Listening to community priorities, agricultural needs, and presenting stewardship reports in Shagari LGA.'
  },
  {
    id: 'gal-4',
    title: 'Agricultural Input & Fertilizer Distribution Flag-off',
    type: 'photo',
    category: 'Empowerment',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4f6c4f7cad13?auto=format&fit=crop&q=80&w=1000',
    date: '2025-05-04',
    description: 'Handing over fertilizer bags and irrigation pumps to farmer cooperative representatives across 22 wards.'
  },
  {
    id: 'gal-5',
    title: 'Inspection of GSS Shagari Science Laboratory Renovation',
    type: 'photo',
    category: 'Constituency Visits',
    imageUrl: '/science_lab_renovation_1792063333276.jpg',
    date: '2025-07-10',
    description: 'Inspecting construction quality and science laboratory equipment installation for secondary students.'
  }
];

export const INITIAL_CONTACTS: ContactSubmission[] = [
  {
    id: 'con-1',
    name: 'Alhaji Ibrahim Sani',
    email: 'ibrahim.sani@gmail.com',
    phone: '+234 803 123 4567',
    category: 'Project Support',
    message: 'We appreciate the water project in Yabo Central. We would like to request an extension pipeline to the northern quarters.',
    date: '2025-10-02',
    status: 'Unread'
  },
  {
    id: 'con-2',
    name: 'Dr. Fatima Aliyu',
    email: 'fatima.aliyu@yahoo.com',
    phone: '+234 802 987 6543',
    category: 'General Inquiry',
    message: 'How can our women cooperative register for the upcoming micro-enterprise grant programme?',
    date: '2025-10-05',
    status: 'In Progress'
  }
];

// ==========================================
// INITIAL TOWN HALL POLLS (Civic Decision-Making)
// ==========================================
export const INITIAL_POLLS: TownHallPoll[] = [
  {
    id: 'poll-1',
    title: 'Constituency Capital Project Priorities for Q1 2027 Budget Allocation',
    question: 'Which sector should receive the highest capital project allocation in the upcoming legislative intervention cycle?',
    description: 'Hon. Umar Yusuf (Danmaje Yabo) invites all constituents of Yabo and Shagari Federal Constituency to voice their priorities to guide budget defense and capital intervention bill appropriations.',
    category: 'Budget & Projects',
    targetWard: 'All 22 Wards (Constituency-Wide)',
    status: 'Active',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    createdBy: 'Chief Administrator',
    createdAt: '2026-10-01T08:00:00Z',
    isFeatured: true,
    totalVotes: 842,
    options: [
      { id: 'opt-1a', text: 'Solar-Powered Irrigation Boreholes & Fadama Farming Support', votes: 384 },
      { id: 'opt-1b', text: 'Rural Feeder Road Grading & Culvert Construction', votes: 248 },
      { id: 'opt-1c', text: 'Primary Healthcare Center Equipment & Maternity Wards', votes: 142 },
      { id: 'opt-1d', text: 'Youth ICT Hubs & Digital Skills Apprenticeship', votes: 68 }
    ],
    voters: [
      { id: 'v-1', pollId: 'poll-1', voterId: 'usr-881', voterName: 'Aliyu Dan-Yabo', ward: 'Yabo Central Ward', selectedOptionId: 'opt-1a', timestamp: '2026-10-14 10:20' },
      { id: 'v-2', pollId: 'poll-1', voterId: 'usr-882', voterName: 'Maryam Shagari', ward: 'Shagari South Ward', selectedOptionId: 'opt-1a', timestamp: '2026-10-15 14:15' },
      { id: 'v-3', pollId: 'poll-1', voterId: 'usr-883', voterName: 'Bello Garba Kuchi', ward: 'Kuchi Ward', selectedOptionId: 'opt-1b', timestamp: '2026-10-16 09:40' }
    ]
  },
  {
    id: 'poll-2',
    title: 'Constituency Tertiary Scholarship & Bursary Allocation Criteria',
    question: 'How should the upcoming ₦25 Million Constituency Education Grant be disbursed among our students?',
    description: 'We seek community consensus on the most equitable formula for supporting our sons and daughters studying across accredited universities, polytechnics, and colleges of education.',
    category: 'Youth & Education',
    targetWard: 'All 22 Wards (Constituency-Wide)',
    status: 'Active',
    startDate: '2026-10-10',
    endDate: '2026-12-05',
    createdBy: 'Chief Administrator',
    createdAt: '2026-10-10T09:30:00Z',
    isFeatured: true,
    totalVotes: 519,
    options: [
      { id: 'opt-2a', text: 'Equal Ward Quota (Equal funding per each of the 22 wards)', votes: 265 },
      { id: 'opt-2b', text: 'Academic Merit & High GPA Tiered Scholarships', votes: 160 },
      { id: 'opt-2c', text: 'Indigent & Vulnerable Student Needs-Based Assistance', votes: 94 }
    ],
    voters: [
      { id: 'v-4', pollId: 'poll-2', voterId: 'usr-884', voterName: 'Shehu Danladi', ward: 'Torankawa Ward', selectedOptionId: 'opt-2a', timestamp: '2026-10-17 11:00' }
    ]
  },
  {
    id: 'poll-3',
    title: 'Placement of High-Mast Solar Security Lighting Across Agrarian Markets',
    question: 'Where should the phase-two high-mast solar illumination installations be concentrated?',
    description: 'Concluded public consultation on solar lighting installations across rural commercial junctions.',
    category: 'Community Welfare',
    targetWard: 'Yabo & Shagari Commercial Wards',
    status: 'Closed',
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    createdBy: 'Chief Administrator',
    createdAt: '2026-08-01T08:00:00Z',
    isFeatured: false,
    totalVotes: 630,
    options: [
      { id: 'opt-3a', text: 'Central Weekly Markets (Yabo & Shagari Town Centers)', votes: 350 },
      { id: 'opt-3b', text: 'Transit Inter-LGA Bus Terminals & Motor Parks', votes: 180 },
      { id: 'opt-3c', text: 'Surrounding Primary Healthcare Centers & Clinics', votes: 100 }
    ]
  }
];

// ==========================================
// INITIAL COMMUNITY PETITIONS
// ==========================================
export const INITIAL_PETITIONS: CommunityPetition[] = [
  {
    id: 'pet-1',
    referenceNumber: 'PET-YS-2026-0041',
    title: 'Petition for Rehabilitation of Bakale–Kuchi Rural Access Road and Water Culverts',
    category: 'Infrastructure & Roads',
    petitionerName: 'Alhaji Musa Bakale',
    petitionerEmail: 'musa.bakale@gmail.com',
    petitionerPhone: '+234 803 555 1234',
    ward: 'Kuchi Ward',
    localGovernment: 'Yabo',
    address: 'Bakale Community Association, Kuchi Ward',
    description: 'The major farm evacuation link between Bakale village and Kuchi weekly grain market experiences severe erosion during rainy seasons, impeding over 3,000 farmers from transporting onions, maize, and livestock.',
    expectedImpact: 'Direct access to market for 3,000+ smallholder farmers, preventing post-harvest spoilage and reducing motorcycle transit accidents.',
    signatoriesCount: 148,
    supportingDocName: 'Bakale_Erosion_Survey_Report.pdf',
    status: 'Under Review',
    submittedDate: '2026-09-28',
    reviewNotes: 'Assigned to Constituency Works Liaison Officer Engr. Bello for field topographical inspection.',
    updatedAt: '2026-10-12'
  },
  {
    id: 'pet-2',
    referenceNumber: 'PET-YS-2026-0038',
    title: 'Petition for Expansion of Motorized Solar Water Scheme to Lambo Quarters',
    category: 'Water & Boreholes',
    petitionerName: 'Hajia Safiya Lambo',
    petitionerEmail: 'safiya.lambo@yahoo.com',
    petitionerPhone: '+234 802 777 9876',
    ward: 'Shagari South Ward',
    localGovernment: 'Shagari',
    address: 'Lambo Women Cooperative, Shagari South',
    description: 'Request for installation of an auxiliary distribution pipe network and 4-tap dispensing station connecting the existing solar borehole to Lambo quarters, easing water collection for nursing mothers and children.',
    expectedImpact: 'Will eliminate 3-kilometer daily water fetch trek for more than 400 households in Lambo settlement.',
    signatoriesCount: 215,
    supportingDocName: 'Lambo_Household_Signatures.pdf',
    status: 'Approved',
    submittedDate: '2026-08-14',
    reviewNotes: 'Technical feasibility verified by Constituency Water Team. Approved for inclusion in Phase 3 Constituency Water Scheme.',
    updatedAt: '2026-09-02',
    decisionMessage: {
      id: 'dec-msg-1',
      petitionId: 'pet-2',
      status: 'Approved',
      recipientName: 'Hajia Safiya Lambo',
      recipientEmail: 'safiya.lambo@yahoo.com',
      recipientPhone: '+234 802 777 9876',
      subject: 'OFFICIAL NOTICE OF PETITION APPROVAL: Expansion of Solar Water Scheme to Lambo Quarters (Ref: PET-YS-2026-0038)',
      officialGreeting: 'Dear Hajia Safiya Lambo and the Respected Signatories of Lambo Quarters,',
      decisionSummary: 'On behalf of the Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency at the House of Representatives, we write with immense pleasure to formally inform you that your community petition regarding the Expansion of the Motorized Solar Water Scheme to Lambo Quarters has been comprehensively reviewed and officially APPROVED.',
      detailedRationale: 'Our engineering assessment team conducted a verified on-site inspection in Shagari South Ward and confirmed that the existing borehole pressure has ample capacity to support a dedicated auxiliary pipeline reticulation and a four-point fetching stand at Lambo center. Hon. Umar Yusuf has prioritized this intervention under the 2026 Constituency Priority Water Intervention Budget.',
      communityEncouragement: 'We commend you, Hajia Safiya, and all community leaders for demonstrating exemplary civic leadership and articulating your community needs through this peaceful, democratic petition channel. Constructive constituent engagement is the heartbeat of genuine grassroots democracy and accelerated development in Yabo and Shagari.',
      nextStepsOrAlternatives: 'The Constituency Engineering Works Unit will mobilize to Lambo Quarters within the next 21 business days to flag off trenching and piping works. We encourage you to liaise with the Ward Liaison Officer to facilitate unhindered community support during execution.',
      signatory: 'Secretariat, Office of Hon. Umar Yusuf (Danmaje Yabo), House of Representatives, Abuja',
      sentAt: '2026-09-02 11:30 WAT',
      sentBy: 'Chief Administrator',
      deliveryChannels: ['Email', 'SMS', 'Constituency Portal']
    }
  },
  {
    id: 'pet-3',
    referenceNumber: 'PET-YS-2026-0029',
    title: 'Petition for Permanent Commercial Toll Barrier at Yabo Central Roundabout',
    category: 'Infrastructure & Roads',
    petitionerName: 'Malam Kabir Yabo',
    petitionerEmail: 'kabir.yabo@outlook.com',
    petitionerPhone: '+234 805 444 8899',
    ward: 'Yabo Central Ward',
    localGovernment: 'Yabo',
    address: 'Near Central Motor Park, Yabo Metropolis',
    description: 'Proposal to erect private commercial parking revenue gates and toll barriers across the federal intersection to generate revenue for transport operators.',
    expectedImpact: 'Private revenue collection for local transport union members.',
    signatoriesCount: 32,
    status: 'Rejected',
    submittedDate: '2026-07-10',
    reviewNotes: 'Reviewed by Parliamentary Legal & Transport Advisory Desk. Violates Federal Highway regulations and impedes public right of way.',
    updatedAt: '2026-07-22',
    decisionMessage: {
      id: 'dec-msg-2',
      petitionId: 'pet-3',
      status: 'Rejected',
      recipientName: 'Malam Kabir Yabo',
      recipientEmail: 'kabir.yabo@outlook.com',
      recipientPhone: '+234 805 444 8899',
      subject: 'OFFICIAL COMMUNICATION: Outcome of Community Petition (Ref: PET-YS-2026-0029)',
      officialGreeting: 'Dear Malam Kabir Yabo,',
      decisionSummary: 'The Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, presents its highest compliments and thanks you profoundly for your active engagement and for bringing your petition regarding the Yabo Roundabout to our attention.',
      detailedRationale: 'Following statutory evaluation by our Parliamentary Legal Desk and consultation with the Federal Ministry of Works & Transportation, we regret to inform you that your petition to erect private commercial barriers at the Yabo Central Roundabout cannot be approved. Federal highways and strategic roundabouts are gazetted public transit corridors subject to nationwide free-flow safety standards, and erection of non-statutory barriers is prohibited by national transport regulations.',
      communityEncouragement: 'Although this specific proposal cannot be accommodated within the regulatory framework, Hon. Umar Yusuf strongly encourages you, your union colleagues, and youth associates to continue your commendable interest in community progress. Your willingness to organize and seek economic opportunities for our people is deeply appreciated.',
      nextStepsOrAlternatives: 'To sustainably support transport operators and micro-businesses in Yabo Central, our office has enrolled transport union members into the upcoming Federal Small Business Micro-Grant Scheme and is rehabilitating the designated off-highway municipal motor park where safe, orderly commercial activity can thrive without compromising road safety.',
      signatory: 'Office of the Chief Administrator, Constituency Directorate of Public Petitions & Grievance Redress',
      sentAt: '2026-07-22 15:45 WAT',
      sentBy: 'Chief Administrator',
      deliveryChannels: ['Email', 'SMS', 'Constituency Portal']
    }
  }
];

export const INITIAL_OFFICES: ConstituencyOffice[] = [
  {
    id: 'off-liaison',
    code: 'OFF-LIAISON',
    name: 'Constituency Liaison & Grievance Redress Bureau',
    location: 'Danmaje Civic Liaison Secretariat, Main Sokoto-Jega Highway, Yabo Metropolis',
    description: 'Frontline citizen engagement bureau handling public petitions, constituent enquiries, Town Hall hearings, and grassroots grievance resolution.',
    headOfOffice: 'Alhaji Bello Dan-Yabo',
    contactEmail: 'liaison.admin@danmayeyabo.gov.ng',
    contactPhone: '+234 803 111 2233',
    status: 'Active',
    authorizedTabs: ['overview', 'petitions', 'enquiries', 'townhall'],
    assignedAdminEmails: ['liaison.admin@danmayeyabo.gov.ng'],
    createdAt: '2025-01-15'
  },
  {
    id: 'off-projects',
    code: 'OFF-PROJECTS',
    name: 'Constituency Projects, Works & Infrastructure Bureau',
    location: 'Projects Monitoring Division, Works Compound, Yabo',
    description: 'Technical oversight, GIS site verification, contractor auditing, and progress photo reporting for all federal and constituency infrastructure works.',
    headOfOffice: 'Engr. Faruq Shagari',
    contactEmail: 'projects.admin@danmayeyabo.gov.ng',
    contactPhone: '+234 803 222 3344',
    status: 'Active',
    authorizedTabs: ['overview', 'projects', 'analytics'],
    assignedAdminEmails: ['projects.admin@danmayeyabo.gov.ng'],
    createdAt: '2025-01-15'
  },
  {
    id: 'off-media',
    code: 'OFF-MEDIA',
    name: 'Directorate of Media, Public Relations & Press Affairs',
    location: 'Danmaje Media & Communications Suite, Yabo',
    description: 'Official press releases, parliamentary news, documentary production, social media engagement, and high-definition photo/video gallery archives.',
    headOfOffice: 'Hon. Aminu Kuchi',
    contactEmail: 'media.admin@danmayeyabo.gov.ng',
    contactPhone: '+234 803 333 4455',
    status: 'Active',
    authorizedTabs: ['overview', 'news', 'gallery', 'analytics'],
    assignedAdminEmails: ['media.admin@danmayeyabo.gov.ng'],
    createdAt: '2025-01-15'
  },
  {
    id: 'off-legislative',
    code: 'OFF-LEGIS',
    name: 'Parliamentary Legislative & Policy Advisory Bureau',
    location: 'Suite 3.24, House of Representatives Wing, National Assembly Complex, Abuja',
    description: 'Drafting constituency bills, sponsoring motions, conducting federal committee oversight, and analyzing federal budget appropriations for Yabo/Shagari.',
    headOfOffice: 'Barrister Mustapha Dan-Yabo',
    contactEmail: 'legislative.admin@danmayeyabo.gov.ng',
    contactPhone: '+234 803 444 5566',
    status: 'Active',
    authorizedTabs: ['overview', 'legislative', 'petitions', 'townhall'],
    assignedAdminEmails: ['legislative.admin@danmayeyabo.gov.ng'],
    createdAt: '2025-01-15'
  },
  {
    id: 'off-empowerment',
    code: 'OFF-EMPOWER',
    name: 'Empowerment, Skills Acquisition & Social Welfare Directorate',
    location: 'Danmaje Vocational & Youth Training Center, Shagari LGA',
    description: 'Management of youth and women empowerment schemes, vocational training, business grant applications, and educational bursary disbursements.',
    headOfOffice: 'Hajia Fatima Shagari',
    contactEmail: 'empowerment.admin@danmayeyabo.gov.ng',
    contactPhone: '+234 803 555 6677',
    status: 'Active',
    authorizedTabs: ['overview', 'empowerment', 'applications'],
    assignedAdminEmails: ['empowerment.admin@danmayeyabo.gov.ng'],
    createdAt: '2025-01-15'
  },
  {
    id: 'off-electoral',
    code: 'OFF-ELECTORAL',
    name: 'Constituency Electoral Operations & Field Polling Desk',
    location: 'Civic Collation & Polling Coordination Unit, Yabo',
    description: 'Grassroots polling unit agent deployment, ward-by-ward field reporting, and election day results verification across all 22 wards.',
    headOfOffice: 'Comrade Usman Torankawa',
    contactEmail: 'electoral.admin@danmayeyabo.gov.ng',
    contactPhone: '+234 803 666 7788',
    status: 'Active',
    authorizedTabs: ['overview', 'election'],
    assignedAdminEmails: ['electoral.admin@danmayeyabo.gov.ng'],
    createdAt: '2025-01-15'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-super',
    email: 'admin@danmayeyabo.gov.ng',
    name: 'Hon. Chief Administrator',
    role: 'Super Administrator',
    officeId: undefined,
    officeName: 'Executive Master Control (All Offices)',
    isActive: true,
    createdAt: '2025-01-01'
  },
  {
    id: 'usr-liaison',
    email: 'liaison.admin@danmayeyabo.gov.ng',
    name: 'Alhaji Bello Dan-Yabo',
    role: 'Office Administrator',
    officeId: 'off-liaison',
    officeName: 'Constituency Liaison & Grievance Redress Bureau',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-projects',
    email: 'projects.admin@danmayeyabo.gov.ng',
    name: 'Engr. Faruq Shagari',
    role: 'Office Administrator',
    officeId: 'off-projects',
    officeName: 'Constituency Projects, Works & Infrastructure Bureau',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-media',
    email: 'media.admin@danmayeyabo.gov.ng',
    name: 'Hon. Aminu Kuchi',
    role: 'Office Administrator',
    officeId: 'off-media',
    officeName: 'Directorate of Media, Public Relations & Press Affairs',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-legis',
    email: 'legislative.admin@danmayeyabo.gov.ng',
    name: 'Barrister Mustapha Dan-Yabo',
    role: 'Office Administrator',
    officeId: 'off-legislative',
    officeName: 'Parliamentary Legislative & Policy Advisory Bureau',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-empower',
    email: 'empowerment.admin@danmayeyabo.gov.ng',
    name: 'Hajia Fatima Shagari',
    role: 'Office Administrator',
    officeId: 'off-empowerment',
    officeName: 'Empowerment, Skills Acquisition & Social Welfare Directorate',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-electoral',
    email: 'electoral.admin@danmayeyabo.gov.ng',
    name: 'Comrade Usman Torankawa',
    role: 'Office Administrator',
    officeId: 'off-electoral',
    officeName: 'Constituency Electoral Operations & Field Polling Desk',
    isActive: true,
    createdAt: '2025-01-15'
  }
];
