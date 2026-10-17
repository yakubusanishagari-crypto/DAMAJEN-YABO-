import { Project, LegislativeRecord, EmpowermentProgram, NewsArticle, GalleryItem, ContactSubmission } from '../types';

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
    status: 'Pending',
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
    date: '2025-03-22',
    description: 'Successfully moved a motion drawing federal attention to severe gully erosion threatening farmlands and residential settlements across Yabo and Shagari, leading to a mandate for ecological funds deployment.',
    documentUrl: '#',
    source: 'Votes and Proceedings, House of Representatives'
  },
  {
    id: 'leg-3',
    title: 'A Bill to Amend the Universal Basic Education Act to Enhance Nomadic and Rural School Funding',
    category: 'Bill',
    status: 'Introduced',
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
    date: '2024-11-30',
    description: 'Addressed power outages affecting micro-industries and irrigation pumps in Yabo/Shagari, securing approval for step-down transformer installations.',
    documentUrl: '#',
    source: 'House Hansard Records'
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
    type: 'video',
    category: 'National Assembly',
    imageUrl: '/national_assembly_chamber_1792063300782.jpg',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    date: '2025-07-19',
    description: 'Hon. Umar Yusuf Danmaje leading the debate during plenary session at the Green Chamber, advocating for agricultural education and research for Sokoto State.'
  },
  {
    id: 'gal-vid-2',
    title: 'Constituency Documentary: Solar Water Project Inspection in Yabo',
    type: 'video',
    category: 'Projects',
    imageUrl: '/solar_water_project_1792063316637.jpg',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    date: '2025-08-20',
    description: 'Field report showing the completed motorized solar-powered water schemes serving rural communities in Yabo and Shagari.'
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
